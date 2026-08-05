// Copies the single-threaded FFmpeg WebAssembly core (from the
// `@ffmpeg/core` package, installed as a normal dependency — see
// package.json) into `public/ffmpeg/`, so it is served locally as a static
// asset at build/dev time instead of being fetched from a CDN. This runs
// automatically via the `postinstall` npm script, so it's always in sync
// with whatever `@ffmpeg/core` version `npm install` resolved.
//
// Deliberately the single-thread build (`@ffmpeg/core`, not
// `@ffmpeg/core-mt`): the `-mt` core needs cross-origin isolation
// (COOP/COEP headers + SharedArrayBuffer support), which most static hosts
// don't set by default. The single-thread core has no such requirement, so
// it works on a plain static deployment.
//
// Safe to run more than once (e.g. re-running `npm install`) — it always
// overwrites `public/ffmpeg/` with whatever is currently in
// `node_modules/@ffmpeg/core`.

import { existsSync, mkdirSync, copyFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const coreDistDir = join(projectRoot, "node_modules", "@ffmpeg", "core", "dist", "umd");
const targetDir = join(projectRoot, "public", "ffmpeg");

const FILES_TO_COPY = ["ffmpeg-core.js", "ffmpeg-core.wasm"];

function main() {
  if (!existsSync(coreDistDir)) {
    console.warn(
      "[copy-ffmpeg-core] node_modules/@ffmpeg/core/dist/umd not found — " +
        "skipping copy. Run `npm install` first (it installs @ffmpeg/core, " +
        "which triggers this script automatically via postinstall). The " +
        "video converter tool cannot load its engine until this has run " +
        "once successfully."
    );
    return;
  }

  mkdirSync(targetDir, { recursive: true });

  let copiedCount = 0;
  for (const fileName of FILES_TO_COPY) {
    const source = join(coreDistDir, fileName);
    if (!existsSync(source)) {
      console.warn(`[copy-ffmpeg-core] Missing expected file: ${source}`);
      continue;
    }
    copyFileSync(source, join(targetDir, fileName));
    copiedCount += 1;
  }

  if (copiedCount === FILES_TO_COPY.length) {
    console.log(`[copy-ffmpeg-core] Copied ${copiedCount} file(s) to public/ffmpeg/.`);
  } else {
    console.warn(
      `[copy-ffmpeg-core] Only copied ${copiedCount}/${FILES_TO_COPY.length} expected file(s) — ` +
        "check that @ffmpeg/core's published layout still matches dist/umd/ffmpeg-core.{js,wasm}."
    );
  }
}

main();
