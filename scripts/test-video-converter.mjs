// Temporary local test routes, never included in the production build.
// Run: node scripts/test-video-converter.mjs
import { dev } from 'astro';
import { readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const projectRoot = fileURLToPath(new URL('../', import.meta.url));
const html = await readFile(new URL('../tests/video-converter.browser.html', import.meta.url));
const video = await readFile(new URL('../docs/obsidian/Operacion/auditoria-evidencias/sintetico.avi', import.meta.url));
const server = await dev({
  root: projectRoot,
  server: { host: '127.0.0.1', port: 4324 },
  vite: {
    plugins: [{
      name: 'converter-browser-tests',
      enforce: 'post',
      config() { return { cacheDir: 'node_modules/.vite-converter-tests' }; },
      configureServer(viteServer) {
        viteServer.middlewares.use((request, response, next) => {
          const route = request.url?.split('?')[0];
          if (route === '/__converter-check.html') {
            response.setHeader('Content-Type', 'text/html; charset=utf-8');
            response.end(html);
          } else if (route === '/__converter-check.avi') {
            response.setHeader('Content-Type', 'video/x-msvideo');
            response.end(video);
          } else next();
        });
      },
    }],
  },
});
console.log('Pruebas: http://localhost:4324/__converter-check.html');
process.on('SIGINT', async () => { await server.stop(); process.exit(0); });
process.on('SIGTERM', async () => { await server.stop(); process.exit(0); });
