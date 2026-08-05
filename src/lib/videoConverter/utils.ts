import {
  ACCEPTED_VIDEO_EXTENSIONS,
  LARGE_FILE_WARNING_BYTES,
  MAX_DURATION_SECONDS,
  MAX_FILE_SIZE_BYTES,
  MOBILE_VIEWPORT_QUERY,
} from "./constants";
import type { OutputFormat, ValidationErrorKey } from "./types";

export function formatBytes(bytes: number): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "—";
  if (bytes === 0) return "0 B";
  const units = ["B", "KB", "MB", "GB"];
  const exponent = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1);
  const value = bytes / 1024 ** exponent;
  return `${value.toFixed(exponent === 0 ? 0 : 1)} ${units[exponent]}`;
}

export function formatDuration(seconds: number | null): string | null {
  if (seconds === null || !Number.isFinite(seconds) || seconds < 0) return null;
  const total = Math.round(seconds);
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const secs = total % 60;
  const pad = (value: number) => String(value).padStart(2, "0");
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(secs)}` : `${minutes}:${pad(secs)}`;
}

export function getFileExtension(fileName: string): string {
  const match = /\.([a-zA-Z0-9]+)$/.exec(fileName);
  return match ? match[1].toLowerCase() : "";
}

const UNSAFE_CHARS_PATTERN = /[^a-zA-Z0-9-_]+/g;

/** Strips the extension, transliterates accents, and replaces anything that
 * isn't a plain ASCII letter/digit/`-`/`_` with `-` — used only to build the
 * *download* file name, never as a security boundary for anything written
 * into the browser's own filesystem (ffmpeg.wasm's virtual FS is in-memory
 * and per-session, not the real disk). */
export function sanitizeBaseName(fileName: string): string {
  const withoutExtension = fileName.replace(/\.[^./\\]+$/, "");
  const asciiOnly = withoutExtension.normalize("NFKD").replace(/[\u0300-\u036f]/g, "");
  const cleaned = asciiOnly
    .replace(UNSAFE_CHARS_PATTERN, "-")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
  return cleaned.length > 0 ? cleaned : "video";
}

export function buildOutputFileName(originalName: string, target: OutputFormat): string {
  return `${sanitizeBaseName(originalName)}.${target}`;
}

export interface FileValidationResult {
  ok: boolean;
  errorKey?: ValidationErrorKey;
}

/** MIME-type-or-extension check only — the duration cap (also part of the
 * spec's validation requirements) is checked separately once
 * `readVideoMetadata` resolves, since it needs an async browser decode. */
export function validateSelectedFile(file: File): FileValidationResult {
  if (file.size === 0) return { ok: false, errorKey: "emptyFile" };
  if (file.size > MAX_FILE_SIZE_BYTES) return { ok: false, errorKey: "tooLarge" };

  const extension = getFileExtension(file.name);
  const hasVideoMime = file.type.startsWith("video/");
  const hasKnownExtension = (ACCEPTED_VIDEO_EXTENSIONS as readonly string[]).includes(extension);

  if (!hasVideoMime && !hasKnownExtension) {
    return { ok: false, errorKey: "unsupportedFormat" };
  }

  return { ok: true };
}

export function validateDuration(durationSeconds: number | null): FileValidationResult {
  if (durationSeconds === null) return { ok: true };
  if (durationSeconds > MAX_DURATION_SECONDS) return { ok: false, errorKey: "tooLong" };
  return { ok: true };
}

export interface VideoMetadataResult {
  duration: number | null;
}

/** Reads duration via a detached `<video>` element rather than trusting the
 * file name/extension — resolves `{ duration: null }` (never rejects) if
 * the browser can't decode enough of the file to report metadata, so the
 * caller can show `errors.metadataUnreadable` instead of hanging forever. */
export function readVideoMetadata(file: File): Promise<VideoMetadataResult> {
  return new Promise((resolve) => {
    const video = document.createElement("video");
    video.preload = "metadata";
    video.muted = true;
    const objectUrl = URL.createObjectURL(file);

    let settled = false;
    const finish = (result: VideoMetadataResult) => {
      if (settled) return;
      settled = true;
      window.clearTimeout(timeoutId);
      video.removeAttribute("src");
      video.load();
      URL.revokeObjectURL(objectUrl);
      resolve(result);
    };

    const timeoutId = window.setTimeout(() => finish({ duration: null }), 8000);

    video.onloadedmetadata = () => {
      const duration = Number.isFinite(video.duration) ? video.duration : null;
      finish({ duration });
    };

    video.onerror = () => finish({ duration: null });

    video.src = objectUrl;
  });
}

/** Heuristic-only: `navigator.deviceMemory` is Chromium-only and always
 * `undefined` elsewhere, so the mobile-viewport check is the more reliable
 * signal in practice — either one being true is enough to show the
 * (non-blocking) notice. */
export function shouldWarnAboutLowMemory(fileSizeBytes: number): boolean {
  if (fileSizeBytes <= LARGE_FILE_WARNING_BYTES) return false;
  if (typeof navigator === "undefined" || typeof window === "undefined") return false;

  const nav = navigator as Navigator & { deviceMemory?: number };
  const lowMemoryDevice = typeof nav.deviceMemory === "number" && nav.deviceMemory <= 4;
  const isMobileViewport = window.matchMedia(MOBILE_VIEWPORT_QUERY).matches;

  return lowMemoryDevice || isMobileViewport;
}
