import type { APIRoute } from "astro";

// Everything is public; the sitemap is built from `site` in astro.config.mjs,
// so the domain only has to be changed there.
export const GET: APIRoute = ({ site }) => {
  const sitemap = new URL("sitemap.xml", site).href;

  return new Response(`User-agent: *\nAllow: /\n\nSitemap: ${sitemap}\n`, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
