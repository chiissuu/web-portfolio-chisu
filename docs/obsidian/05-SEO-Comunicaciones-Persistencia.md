---
tags: [seo, comunicaciones, persistencia, seguridad]
aliases: [SEO-Comunicaciones-Persistencia]
actualizado: 2026-10-06
fuente: [src/layouts/Layout.astro, src/content/site.js]
---

# SEO, comunicaciones y persistencia

## Metadatos por página

Cada página tiene título, descripción, charset, viewport y `lang`; el favicon PNG se comparte entre todas. La portada usa `content.es.seo`. Servicios y Tools combinan título propio con el título del sitio y usan sus introducciones como descripción. El conversor usa `videoConverter.title` para el `<title>` y `videoConverter.seo.description` para la descripción — **`videoConverter.seo.title` existe en los datos pero no se consume actualmente** para el `<title>`.

## Lo que no existe

No hay canonical, Open Graph, Twitter Cards, sitemap, robots.txt, JSON-LD, manifest PWA ni 404 propia. La ausencia de `robots.txt` no impide por sí misma la indexación. No hay dominio configurado en `site` (astro.config.mjs); no se ha comprobado un dominio remoto, analítica, Lighthouse ni Search Console.

## Comunicaciones reales

Implementadas: descarga de HTML/CSS/JS/recursos propios, Google Fonts, y carga del motor FFmpeg desde el propio sitio al convertir (ver [[Conversor-de-Video]]). GitHub, Linktree, U-TAD y dos carpetas de Google Drive son enlaces externos simples, no conectores ni APIs integradas — su disponibilidad o permisos remotos no se han verificado desde este repositorio.

## Persistencia

No se encontró almacenamiento propio en cookies, localStorage, sessionStorage, IndexedDB ni base de datos. El conversor de vídeo mantiene datos en memoria/Blob/sistema de archivos virtual y permite descarga elegida por el usuario; no implementa subida de vídeo a ningún servidor. Esto no significa que el sitio sea offline: descarga el motor, assets y fuentes bajo demanda. La caché HTTP depende del navegador y del hosting final.

## Seguridad (alcance de código estático)

En el código propio revisado no hay `eval`, `set:html` ni `innerHTML`, ni solicitud de backend desde los formularios (ver [[Formularios]] — el envío es simulado). No se han verificado vulnerabilidades de dependencias mediante auditoría remota. `.gitignore` cubre `.env` y `.env.production`, pero no todos los posibles `.env.*`. No se requieren variables de entorno de aplicación actualmente — el único uso es `import.meta.env.BASE_URL`.

Si en el futuro se conecta un backend real, habrá que definir validación de servidor, tratamiento de errores, control de abuso y gestión de datos/privacidad según el servicio elegido. La ausencia actual de CSRF o de base de datos no es una vulnerabilidad explotable de un sitio estático sin backend — es simplemente el estado de un proyecto que todavía no tiene esa pieza.

## Relacionado

[[Formularios]] · [[Conversor-de-Video]] · [[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] · [[Hallazgos-y-Pendientes]]
