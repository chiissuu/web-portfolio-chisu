---
tags: [seo, comunicaciones, persistencia, seguridad]
aliases: [SEO-Comunicaciones-Persistencia]
actualizado: 2026-11-03
fuente: [src/layouts/Layout.astro, src/content/site.js]
---

# SEO, comunicaciones y persistencia

## Metadatos por página

Cada página tiene título, descripción, charset, viewport y `lang`; el favicon PNG se comparte entre todas. La portada usa `content.es.seo`. Servicios y Tools combinan título propio con el título del sitio y usan sus introducciones como descripción. El conversor usa `videoConverter.title` para el `<title>` y `videoConverter.seo.description` para la descripción — **`videoConverter.seo.title` existe en los datos pero no se consume actualmente** para el `<title>`.

## Publicación: dominio, tarjeta de compartir, robots y sitemap (3 de noviembre de 2026)

- **Dominio:** `site: "https://chiissuu.com"` en [astro.config.mjs](../../astro.config.mjs). De ahí salen todas las URLs absolutas; si cambia el dominio, se cambia solo ahí.
- **`<head>`** ([Layout.astro](../../src/layouts/Layout.astro)): canonical (omitido con `noindex`), Open Graph (`og:type/site_name/locale/title/description/url/image` con ancho, alto y alt) y Twitter Card `summary_large_image`, además de `theme-color` (#050505). Prop `noindex` para páginas que no deben indexarse.
- **Imagen al compartir:** [og-chiissuu.png](../../public/assets/images/og-chiissuu.png), 1200×630, generada por [generate-og-image.mjs](../../scripts/generate-og-image.mjs) con el wordmark dorado. Para cambiarla, editar el script y volver a ejecutarlo. Las redes guardan en caché la tarjeta: tras publicar, hay que refrescarla con sus depuradores.
- **404:** [404.astro](../../src/pages/404.astro) con el estilo de la web (hilo cortado, 404 dorado, botón dorado a Inicio); `noindex`, textos en `notFound` de `site.js`. Cada host la sirve a su manera (Netlify, Vercel, Cloudflare Pages y GitHub Pages usan `404.html` solos).
- **robots.txt y sitemap.xml:** son rutas de código ([robots.txt.ts](../../src/pages/robots.txt.ts), [sitemap.xml.ts](../../src/pages/sitemap.xml.ts)) que usan `site`. Al crear una página indexable nueva, añadir su ruta a `paths` en `sitemap.xml.ts`.

## Cabeceras de seguridad y CSP (4 de noviembre de 2026)

- **Cabeceras** en [netlify.toml](../../netlify.toml) para todas las rutas: `X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin` y `Permissions-Policy` (cámara, micrófono, geolocalización y pagos desactivados). Netlify ya envía HSTS. Comprobado en producción con `curl.exe -I https://chiissuu.com`.
- **Content Security Policy:** la escribe Astro (`security.csp` en [astro.config.mjs](../../astro.config.mjs)) en una etiqueta `<meta http-equiv="content-security-policy">` de cada página, con los hashes de sus scripts y estilos incrustados. Lo permitido además de `self`: Google Fonts (hoja de estilos y fuentes), `wasm-unsafe-eval` (compilar FFmpeg), `blob:` (worker y archivos del conversor) y `unsafe-inline` **solo en atributos `style`** (`style-src-attr`, por GSAP y los componentes). Si se añade un origen externo (analítica, otra fuente, un iframe…), hay que añadirlo ahí o se bloqueará.
- **No se aplica en `astro dev`:** probarla con `npm run build` y `npm run preview`. Una violación aparece en la consola del navegador como «Refused to…».
- Verificado en local con el build: home recorrida entera, conversión de un vídeo de prueba a MP4 (genera el archivo) y 404, sin violaciones ni errores en consola. **No verificado:** MP3, el envío real del `mailto:` ni la web publicada con la CSP (hay que comprobarla tras el despliegue).

## Lo que sigue sin existir

No hay JSON-LD ni manifest PWA ni CSP por cabecera (va en `<meta>`, que no admite `frame-ancestors`; eso lo cubre `X-Frame-Options`). Los textos de compartir solo existen en español (la web se sirve solo en español).

## Comunicaciones reales

Implementadas: descarga de HTML/CSS/JS/recursos propios, Google Fonts, y carga del motor FFmpeg desde el propio sitio al convertir (ver [[Conversor-de-Video]]). GitHub, Linktree, U-TAD y dos carpetas de Google Drive son enlaces externos simples, no conectores ni APIs integradas — su disponibilidad o permisos remotos no se han verificado desde este repositorio.

## Persistencia

No se encontró almacenamiento propio en cookies, localStorage, sessionStorage, IndexedDB ni base de datos. El conversor de vídeo mantiene datos en memoria/Blob/sistema de archivos virtual y permite descarga elegida por el usuario; no implementa subida de vídeo a ningún servidor. Esto no significa que el sitio sea offline: descarga el motor, assets y fuentes bajo demanda. La caché HTTP depende del navegador y del hosting final.

## Seguridad (alcance de código estático)

En el código propio revisado no hay `eval`, `set:html` ni `innerHTML`, ni solicitud de backend desde los formularios. npm audit del 10 de octubre informó cero vulnerabilidades conocidas; no se ejecutó audit fix. El fallback GET sin scripts se corrigió localmente en ambos forms (ver [[Auditoria-Web]]). `.gitignore` cubre `.env` y `.env.production`, pero no todos los posibles `.env.*`. No se requieren variables de entorno de aplicación actualmente — el único uso es `import.meta.env.BASE_URL`.

Si en el futuro se conecta un backend real, habrá que definir validación de servidor, tratamiento de errores, control de abuso y gestión de datos/privacidad según el servicio elegido. La ausencia actual de CSRF o de base de datos no es una vulnerabilidad explotable de un sitio estático sin backend — es simplemente el estado de un proyecto que todavía no tiene esa pieza.

## Relacionado

[[Formularios]] · [[Conversor-de-Video]] · [[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] · [[Hallazgos-y-Pendientes]]
