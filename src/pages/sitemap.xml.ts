import type { APIRoute } from "astro";

// Indexable routes of the site. Add a path here when a new page is created
// (404 is deliberately left out).
const paths = ["/", "/video-converters/"];

export const GET: APIRoute = ({ site }) => {
  const urls = paths
    .map((path) => `  <url><loc>${new URL(path, site).href}</loc></url>`)
    .join("\n");

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
