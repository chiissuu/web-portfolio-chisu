// Thin wrapper around `@ffmpeg/ffmpeg` 0.12.x, isolated from React so the
// state machine in `VideoConverter.tsx` only ever calls three functions:
// `getFFmpeg()`, `runConversion()`, `cancelActiveConversion()`. Everything
// FFmpeg-specific (module loading, virtual-FS bookkeeping, progress
// plumbing) stays in here.
//
// Both `@ffmpeg/ffmpeg` and `@ffmpeg/util` are imported dynamically inside
// `getFFmpeg()`, never at module top level — the WebAssembly core itself
// (tens of MB) is fetched separately via `toBlobURL` and is never part of
// any JS bundle regardless, but keeping the *library* import dynamic too
// means neither one is pulled into this island's bundle until the user
// actually starts a conversion, per the "no cargues FFmpeg hasta la primera
// conversión" requirement.
//
// This module is only ever imported from `VideoConverter.tsx`, which is
// mounted with `client:only="react"` — so none of this ever executes
// during SSR/build, even though the file itself has no server/client guard
// of its own (it doesn't need one: it's simply never reached server-side).

import { withBase } from "../paths.js";
import { FFMPEG_CORE_DIR } from "./constants";
import type { OutputFormat, Mp3Bitrate, ConversionOutcome } from "./types";
import { buildOutputFileName } from "./utils";

// Structural type covering only the surface of the real `FFmpeg` class this
// module actually touches — avoids a static top-level `import type` from
// `@ffmpeg/ffmpeg`, which would otherwise force TypeScript's emit to
// resolve that package's types even for callers that never load it.
interface FFmpegLike {
  load(config: { coreURL: string; wasmURL: string }): Promise<boolean>;
  on(event: "progress", handler: (data: { progress: number }) => void): void;
  writeFile(name: string, data: Uint8Array): Promise<boolean>;
  exec(args: string[]): Promise<number>;
  readFile(name: string): Promise<Uint8Array | string>;
  deleteFile(name: string): Promise<boolean>;
  terminate(): void;
}

let ffmpegInstance: FFmpegLike | null = null;
let loadPromise: Promise<FFmpegLike> | null = null;
let isRunning = false;
let currentProgressHandler: ((ratio: number) => void) | null = null;

export class ConversionInProgressError extends Error {
  constructor() {
    super("A conversion is already in progress.");
    this.name = "ConversionInProgressError";
  }
}

export function isFFmpegLoaded(): boolean {
  return ffmpegInstance !== null;
}

/** Loads (once) and returns the shared FFmpeg instance, downloading the
 * single-thread core from `public/ffmpeg/` (self-hosted, no CDN — see
 * `scripts/copy-ffmpeg-core.mjs`) the first time it's called. Subsequent
 * calls resolve immediately with the same instance, satisfying "reutiliza
 * una misma instancia cargada durante la sesión". */
export async function getFFmpeg(): Promise<FFmpegLike> {
  if (ffmpegInstance) return ffmpegInstance;
  if (loadPromise) return loadPromise;

  loadPromise = (async () => {
    const [{ FFmpeg }, { toBlobURL }] = await Promise.all([
      import("@ffmpeg/ffmpeg"),
      import("@ffmpeg/util"),
    ]);

    const instance = new FFmpeg() as unknown as FFmpegLike;
    instance.on("progress", ({ progress }) => {
      if (currentProgressHandler && Number.isFinite(progress)) {
        currentProgressHandler(Math.min(1, Math.max(0, progress)));
      }
    });

    const coreBase = withBase(FFMPEG_CORE_DIR);
    const [coreURL, wasmURL] = await Promise.all([
      toBlobURL(`${coreBase}/ffmpeg-core.js`, "text/javascript"),
      toBlobURL(`${coreBase}/ffmpeg-core.wasm`, "application/wasm"),
    ]);

    await instance.load({ coreURL, wasmURL });
    ffmpegInstance = instance;
    return instance;
  })();

  try {
    return await loadPromise;
  } finally {
    loadPromise = null;
  }
}

export interface RunConversionParams {
  file: File;
  inputExtension: string;
  target: OutputFormat;
  mp3Bitrate: Mp3Bitrate;
  onProgress: (ratio: number) => void;
}

async function safeDeleteFile(ffmpeg: FFmpegLike, name: string): Promise<void> {
  try {
    await ffmpeg.deleteFile(name);
  } catch {
    // The file may never have been written (e.g. writeFile itself failed,
    // or the worker was terminated mid-run) — nothing to clean up then.
  }
}

/** Runs exactly one MP3/MP4 conversion end to end: writes the input into
 * ffmpeg's virtual filesystem, execs the equivalent of the two documented
 * ffmpeg CLI commands, reads the result back out, and — regardless of
 * success or failure — deletes both the input and output virtual files
 * before returning/throwing, so nothing lingers in the WebAssembly heap
 * between conversions. */
export async function runConversion(
  ffmpeg: FFmpegLike,
  params: RunConversionParams
): Promise<ConversionOutcome> {
  if (isRunning) throw new ConversionInProgressError();
  isRunning = true;
  currentProgressHandler = params.onProgress;

  const safeExtension = params.inputExtension.replace(/[^a-z0-9]/gi, "") || "bin";
  const inputName = `input.${safeExtension}`;
  const outputName = params.target === "mp3" ? "output.mp3" : "output.mp4";

  try {
    const { fetchFile } = await import("@ffmpeg/util");
    await ffmpeg.writeFile(inputName, await fetchFile(params.file));

    const args =
      params.target === "mp3"
        ? ["-i", inputName, "-vn", "-c:a", "libmp3lame", "-b:a", `${params.mp3Bitrate}k`, outputName]
        : ["-i", inputName, "-c:v", "libx264", "-c:a", "aac", "-movflags", "+faststart", outputName];

    await ffmpeg.exec(args);

    const data = await ffmpeg.readFile(outputName);
    // Re-wrapped through `new Uint8Array(...)` (a copy) rather than used
    // directly: ffmpeg's virtual-FS read can return a view typed against
    // `ArrayBufferLike` (which includes `SharedArrayBuffer`), and `Blob`
    // only accepts a view backed by a real `ArrayBuffer`.
    const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
    const mimeType = params.target === "mp3" ? "audio/mpeg" : "video/mp4";

    return {
      blob: new Blob([bytes], { type: mimeType }),
      mimeType,
      fileName: buildOutputFileName(params.file.name, params.target),
    };
  } finally {
    isRunning = false;
    currentProgressHandler = null;
    await safeDeleteFile(ffmpeg, inputName);
    await safeDeleteFile(ffmpeg, outputName);
  }
}

/** Terminates the shared worker (if any) so a pending `exec()`/`writeFile()`
 * rejects immediately. The instance can't be reused after this — the next
 * `getFFmpeg()` call transparently reloads a fresh one (and the core with
 * it), which `VideoConverter.tsx` surfaces as the "loading engine" state
 * reappearing. */
export function cancelActiveConversion(): void {
  if (ffmpegInstance) {
    try {
      ffmpegInstance.terminate();
    } catch {
      // Already terminated — nothing to do.
    }
  }
  ffmpegInstance = null;
  loadPromise = null;
  isRunning = false;
  currentProgressHandler = null;
}
