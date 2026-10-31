// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Set `site` (and `base`, if the site won't live at the domain root) once
// final hosting is decided. Routes in this project are already flat
// (/ and /video-converters/), so no `base` prefix is required by default.
//
// `react()` is only needed for the video converter tool
// (`src/components/VideoConverter/*.tsx`, mounted with `client:only="react"`
// from `src/components/VideoConverterPageContent.astro`) — no other part of
// the site uses React, every other component stays a plain `.astro` file.
export default defineConfig({
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
