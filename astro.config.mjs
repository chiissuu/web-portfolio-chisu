// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// `site` is the production domain: it feeds the canonical URL, the Open Graph
// / Twitter share card, sitemap.xml and robots.txt. Routes in this project are
// flat (/ and /video-converters/) and the site lives at the domain root, so no
// `base` prefix is needed.
//
// `react()` is only needed for the video converter tool
// (`src/components/VideoConverter/*.tsx`, mounted with `client:only="react"`
// from `src/components/VideoConverterPageContent.astro`) — no other part of
// the site uses React, every other component stays a plain `.astro` file.
export default defineConfig({
  site: "https://chiissuu.com",
  // Content Security Policy, written by Astro into a <meta> tag on every page
  // (static build). Astro adds the hashes of its own inline scripts/styles;
  // what the site loads besides itself is listed here:
  //  - Google Fonts (stylesheet + font files),
  //  - 'wasm-unsafe-eval' to compile the FFmpeg WebAssembly core,
  //  - blob: for the converter's worker and its input/output files,
  //  - 'unsafe-inline' only for style attributes (style-src-attr), because
  //    GSAP and the components set `style="..."`; it does not cover <style>
  //    tags or scripts.
  // CSP does not apply in `astro dev`: test it with `npm run build` + `preview`.
  security: {
    csp: {
      scriptDirective: { resources: ["'self'", "'wasm-unsafe-eval'"] },
      styleDirective: {
        resources: [
          "'self'",
          "https://fonts.googleapis.com",
          { resource: "'unsafe-inline'", kind: "attribute" },
        ],
      },
      directives: [
        "default-src 'self'",
        "img-src 'self' data: blob:",
        "font-src 'self' https://fonts.gstatic.com",
        "connect-src 'self'",
        "media-src 'self' blob:",
        "worker-src 'self' blob:",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ],
    },
  },
  integrations: [
    react(),
    {
      name: "separate-vite-cache",
      hooks: {
        // Astro build also creates an internal Vite server; use Astro's command.
        "astro:config:setup": ({ command, updateConfig }) => {
          updateConfig({ vite: { cacheDir: `node_modules/.vite-astro-${command}` } });
        },
      },
    },
  ],
  vite: {
    optimizeDeps: {
      include: ["react-dom/client"],
    },
  },
});
