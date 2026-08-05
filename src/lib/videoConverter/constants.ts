// Single source of truth for every hard limit / accepted-format list the
// video converter tool enforces. Keep both the validation logic
// (`utils.ts`) and any UI copy referencing these numbers (`site.js`'s
// `videoConverter.dropzone.hint`) in sync with the values below if they
// ever change.

/** Hard cap on the input file's size. */
export const MAX_FILE_SIZE_BYTES = 200 * 1024 * 1024; // 200 MB

/** Hard cap on the input video's duration, read from browser-decoded
 * metadata (see `readVideoMetadata` in `utils.ts`) — never trusted from the
 * file name or size alone. */
export const MAX_DURATION_SECONDS = 15 * 60; // 15 minutes

/** Above this size, `shouldWarnAboutLowMemory` (utils.ts) surfaces a
 * non-blocking notice on mobile / low-`deviceMemory` devices — ffmpeg.wasm
 * holds the whole input+output in the WebAssembly heap, so large files can
 * exhaust memory on constrained devices well before hitting the hard cap
 * above. */
export const LARGE_FILE_WARNING_BYTES = 80 * 1024 * 1024; // 80 MB

/** Matches the mobile breakpoint already used across the rest of the site
 * (see `HeroExperience.astro`'s `@media (max-width: 899px)`). */
export const MOBILE_VIEWPORT_QUERY = "(max-width: 899px)";

/** Extensions accepted when the browser reports no usable `video/*` MIME
 * type for the file (this genuinely happens for some containers, e.g. a
 * `.mkv` in some browsers reports an empty `type`) — never the *only*
 * signal used, see `validateSelectedFile` in `utils.ts`. */
export const ACCEPTED_VIDEO_EXTENSIONS = ["mp4", "webm", "mov", "mkv", "avi", "m4v", "ogv"] as const;

/** `accept` attribute for the native file input — a hint for the OS file
 * picker only, never relied on for real validation (that always happens in
 * JS after selection, see `validateSelectedFile`). */
export const FILE_INPUT_ACCEPT = ".mp4,.webm,.mov,.mkv,.avi,.m4v,.ogv,video/*";

export const MP3_BITRATES = [128, 192, 256] as const;
export type Mp3Bitrate = (typeof MP3_BITRATES)[number];
export const DEFAULT_MP3_BITRATE: Mp3Bitrate = 192;

/** Relative (BASE_URL-agnostic) path to where `scripts/copy-ffmpeg-core.mjs`
 * places the FFmpeg core after `npm install` — `withBase()` (see
 * `src/lib/paths.js`) is applied to this at the call site in
 * `ffmpegClient.ts`, same convention as every other internal link/asset
 * path in this project. */
export const FFMPEG_CORE_DIR = "/ffmpeg";
