import type { APIRoute } from "astro";
import { locales, pathFor } from "../lib/i18n";

// Indexable pages, by their Spanish (root) path. Each one is listed once per
// language and points to all its versions (`xhtml:link`), which is what search
// engines use to show the right language. Add a path here when a new page is
// created (the 404 pages are deliberately left out).
const paths = ["/", "/video-converters/"];

export const GET: APIRoute = ({ site }) => {
  const abs = (path: string) => new URL(path, site).href;

  const urls = paths.flatMap((path) =>
    locales.map((locale) => {
      const alternates = [
        ...locales.map(
          (l) => `    <xhtml:link rel="alternate" hreflang="${l}" href="${abs(pathFor(l, path))}"/>`,
        ),
        `    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(pathFor("es", path))}"/>`,
      ].join("\n");
      return `  <url>\n    <loc>${abs(pathFor(locale, path))}</loc>\n${alternates}\n  </url>`;
    }),
  );

  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls.join("\n")}\n</urlset>\n`,
    { headers: { "Content-Type": "application/xml; charset=utf-8" } },
  );
};
