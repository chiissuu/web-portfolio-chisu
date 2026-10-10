// Loopback-only evidence harness. Explicit allowlist, no repo-wide serving.
import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { resolve, dirname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const evidence = dirname(fileURLToPath(import.meta.url));
const root = resolve(evidence, '../../../..');
const roots = new Map([
  ['/vendor/ffmpeg/', resolve(root, 'node_modules/@ffmpeg/ffmpeg/dist/esm')],
  ['/vendor/util/', resolve(root, 'node_modules/@ffmpeg/util/dist/esm')],
  ['/core-umd/', resolve(root, 'node_modules/@ffmpeg/core/dist/umd')],
  ['/core-esm/', resolve(root, 'node_modules/@ffmpeg/core/dist/esm')],
  ['/_astro/', resolve(root, 'dist/_astro')],
]);
createServer(async (request, response) => {
  try {
    const path = new URL(request.url, 'http://127.0.0.1').pathname;
    let file;
    if (['/diagnostico-motor.html', '/forms-sin-scripts.html'].includes(path)) {
      file = resolve(evidence, path.slice(1));
    } else {
      for (const [prefix, directory] of roots) {
        if (path.startsWith(prefix)) {
          const candidate = resolve(directory, path.slice(prefix.length));
          if (candidate.startsWith(directory + sep)) file = candidate;
        }
      }
    }
    if (!file) { response.writeHead(404); response.end(); return; }
    const type = file.endsWith('.html') ? 'text/html; charset=utf-8'
      : file.endsWith('.js') ? 'text/javascript' : file.endsWith('.css') ? 'text/css'
      : file.endsWith('.wasm') ? 'application/wasm' : 'application/octet-stream';
    response.writeHead(200, {'Content-Type': type});
    response.end(await readFile(file));
  } catch { response.writeHead(404); response.end(); }
}).listen(4324, '127.0.0.1', () => console.log('Diagnostic harness: http://127.0.0.1:4324/diagnostico-motor.html'));
