// Thin wrapper around `@ffmpeg/ffmpeg` 0.12.x, isolated from React so the
// state machine in `VideoConverter.tsx` only ever calls three functions:
// `getFFmpeg()`, `runConversion()`, `cancelActiveConversion()`. Everything
// FFmpeg-specific (module loading, virtual-FS bookkeeping, progress
// plumbing) stays in here.
//
// `@ffmpeg/ffmpeg` and `@ffmpeg/util` are imported dynamically when loading
// the engine and converting, never at module top level — the WebAssembly core
// (tens of MB) is fetched separately from the same origin and is never part of
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
let loadingInstance: FFmpegLike | null = null;
let loadPromise: Promise<FFmpegLike> | null = null;
let engineGeneration = 0;
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

  const generation = engineGeneration;
  const pendingLoad = (async () => {
    const { FFmpeg } = await import("@ffmpeg/ffmpeg");
    if (generation !== engineGeneration) throw new Error("Engine loading was cancelled.");

    const instance = new FFmpeg() as unknown as FFmpegLike;
    loadingInstance = instance;
    instance.on("progress", ({ progress }) => {
      if (currentProgressHandler && Number.isFinite(progress)) {
        currentProgressHandler(Math.min(1, Math.max(0, progress)));
      }
    });

    const coreBase = withBase(FFMPEG_CORE_DIR);
    // Self-hosted ESM assets need no Blob copies or CDN/CORS workaround.
    const coreURL = new URL(`${coreBase}/ffmpeg-core.js`, window.location.href).href;
    const wasmURL = new URL(`${coreBase}/ffmpeg-core.wasm`, window.location.href).href;

    try {
      await instance.load({ coreURL, wasmURL });
      if (generation !== engineGeneration) throw new Error("Engine loading was cancelled.");
      ffmpegInstance = instance;
      return instance;
    } catch (error) {
      instance.terminate();
      throw error;
    } finally {
      if (loadingInstance === instance) loadingInstance = null;
    }
  })();
  loadPromise = pendingLoad;

  try {
    return await pendingLoad;
  } finally {
    // An old cancelled request must not clear a newer request's promise.
    if (loadPromise === pendingLoad) loadPromise = null;
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
    const inputBytes = await fetchFile(params.file);
    if (ffmpeg !== ffmpegInstance) throw new Error("Conversion was cancelled.");
    await ffmpeg.writeFile(inputName, inputBytes);

    const args =
      params.target === "mp3"
        ? ["-i", inputName, "-vn", "-c:a", "libmp3lame", "-b:a", `${params.mp3Bitrate}k`, outputName]
        : ["-i", inputName, "-c:v", "libx264", "-c:a", "aac", "-movflags", "+faststart", outputName];

    const exitCode = await ffmpeg.exec(args);
    if (exitCode !== 0) throw new Error(`FFmpeg exited with code ${exitCode}.`);

    const data = await ffmpeg.readFile(outputName);
    // Re-wrapped through `new Uint8Array(...)` (a copy) rather than used
    // directly: ffmpeg's virtual-FS read can return a view typed against
    // `ArrayBufferLike` (which includes `SharedArrayBuffer`), and `Blob`
    // only accepts a view backed by a real `ArrayBuffer`.
    const bytes = typeof data === "string" ? new TextEncoder().encode(data) : new Uint8Array(data);
    if (bytes.byteLength === 0) throw new Error("FFmpeg produced an empty file.");
    const mimeType = params.target === "mp3" ? "audio/mpeg" : "video/mp4";

    return {
      blob: new Blob([bytes], { type: mimeType }),
      mimeType,
      fileName: buildOutputFileName(params.file.name, params.target),
    };
  } finally {
    await safeDeleteFile(ffmpeg, inputName);
    await safeDeleteFile(ffmpeg, outputName);
    isRunning = false;
    currentProgressHandler = null;
  }
}

/** Terminates the shared worker (if any) so a pending `exec()`/`writeFile()`
 * rejects immediately. The instance can't be reused after this — the next
 * `getFFmpeg()` call transparently reloads a fresh one (and the core with
 * it), which `VideoConverter.tsx` surfaces as the "loading engine" state
 * reappearing. */
export function cancelActiveConversion(): void {
  engineGeneration += 1;
  for (const instance of [loadingInstance, ffmpegInstance]) {
    if (!instance) continue;
    try {
      instance.terminate();
    } catch {
      // Already terminated — nothing to do.
    }
  }
  ffmpegInstance = null;
  loadingInstance = null;
  loadPromise = null;
  currentProgressHandler = null;
}
