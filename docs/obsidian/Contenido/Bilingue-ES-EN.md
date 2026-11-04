---
tags: [contenido, i18n, pendiente]
actualizado: 2026-11-04
fuente: [src/content/site.js, src/lib/content-types.ts]
---

# Estado bilingüe ES/EN

**Desde el 4 de noviembre de 2026 la web existe en español (raíz) e inglés (`/en/`).**

## Estructura de URLs

| Página | Español | Inglés |
|---|---|---|
| Inicio | `/` | `/en/` |
| Conversor | `/video-converters/` | `/en/video-converters/` |
| 404 | `/404.html` | `/en/404/` (Netlify la sirve para cualquier ruta `/en/…` inexistente) |

- `/es/…` no es una página: Netlify la redirige (301) a la raíz, para que haya una sola URL en español.
- Cada página se escribe una vez como componente que recibe `locale` ([HomePage.astro](../../src/components/HomePage.astro), [ConverterPage.astro](../../src/components/ConverterPage.astro), [NotFoundPage.astro](../../src/components/NotFoundPage.astro)) y se monta dos veces (`src/pages/…` y `src/pages/en/…`). Utilidades en [i18n.ts](../../src/lib/i18n.ts) (`pathFor`, `alternatesFor`).
- **Selector «ES | EN»:** píldora fija arriba a la izquierda en el Hero (se desplaza a la derecha del menú lateral cuando este aparece), en el menú móvil y en la barra de [SimpleNav.astro](../../src/components/SimpleNav.astro) del conversor. Son enlaces reales (funcionan sin JavaScript) y conservan el ancla de la sección (`#contact`). **No hay redirección automática** por el idioma del navegador ni aviso «View in English».
- **Enlaces con ancla:** el Hero salta a `location.hash` al cargar y de nuevo cuando termina de inicializarse (el salto nativo del navegador ocurría antes de que la página tuviera su altura final y se quedaba arriba), salvo que el visitante interactúe.

## Contenido

- `content.en` ya cumple el mismo contrato que `content.es` (`npm run check` lo comprueba al pasarlo a los componentes). Se añadió `hero.personalNote` en inglés, `hero.language`, `hero.menu`, `hero.motion` y los `titleImage` de Projects, Services y Contact.
- **Al añadir o cambiar texto, hay que hacerlo en los dos idiomas.** Los enlaces internos del inglés llevan el prefijo (p. ej. `/en/video-converters/`).
- **Títulos gráficos:** Projects, Services y Contact tienen versión en inglés (`section-title-*-en.webp`); **Tools y FAQ usan la misma imagen que en español** (decisión del usuario: «Tools» en español se veía demasiado grande, y «FAQ» es igual en ambos). Sobre mí usa `about-title-en.png`.
- El texto «Applied visually.» del título del Hero en inglés sustituye a «GFX» del español (viene de los datos, no de un cambio nuevo).

## SEO

Ver [[05-SEO-Comunicaciones-Persistencia|SEO-Comunicaciones-Persistencia]]: `hreflang` (es, en, x-default → español), canonical propio por idioma, `og:locale` y `og:locale:alternate`, y sitemap con las cuatro URLs y sus alternativas.

## Relacionado

[[Contenido-por-Seccion]] · [[Hallazgos-y-Pendientes]] · [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]]
