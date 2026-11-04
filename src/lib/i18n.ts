import { withBase } from "./paths.js";

// Spanish is the main language and lives at the site root; English lives under
// /en/. Pages are written once (a page component that takes `locale`) and
// mounted twice (src/pages/... and src/pages/en/...).
export type Locale = "es" | "en";

export const defaultLocale: Locale = "es";
export const locales: readonly Locale[] = ["es", "en"];

/** URL of a page in a given language. `path` is the Spanish (root) path:
 * "/" or "/video-converters/". */
export function pathFor(locale: Locale, path: string): string {
  const clean = path.startsWith("/") ? path : `/${path}`;
  return withBase(locale === defaultLocale ? clean : `/en${clean}`);
}

/** The same page in every language, for the language switch and `hreflang`. */
export function alternatesFor(path: string): Record<Locale, string> {
  return { es: pathFor("es", path), en: pathFor("en", path) };
}
