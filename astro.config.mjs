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
