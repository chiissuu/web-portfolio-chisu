import type { Mp3Bitrate } from "./constants";

export type OutputFormat = "mp3" | "mp4";
export type { Mp3Bitrate };

/** Drives which panel(s) `VideoConverter.tsx` renders. Kept as one flat
 * union (rather than a nested object) so every state transition is a single
 * `setStage(...)` call and there's no risk of two booleans disagreeing with
 * each other. There is no dedicated "error" stage — errors/warnings are a
 * separate `note` piece of state layered on top of whichever stage is
 * current (usually "idle" for a rejected file, or "file-ready" for a failed
 * conversion the user can retry), since an error is an annotation, not a
 * distinct place in the flow. */
export type Stage = "idle" | "file-ready" | "loading-engine" | "converting" | "done";

export interface SelectedFileInfo {
  file: File;
  name: string;
  size: number;
  /** `null` when the browser couldn't read the video's metadata at all
   * (see `readVideoMetadata` in `utils.ts`) — the duration cap is skipped
   * in that case (there's nothing to check against) and the UI shows
   * `fileInfo.unknownDuration` instead of a number. */
  duration: number | null;
  extension: string;
  mimeType: string;
}

export type ValidationErrorKey = "tooLarge" | "tooLong" | "unsupportedFormat" | "emptyFile";

export interface ConversionOutcome {
  blob: Blob;
  mimeType: string;
  fileName: string;
}
