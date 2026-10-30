---
tags: [rutas, navegacion]
aliases: [Rutas-y-Navegacion]
actualizado: 2026-10-29
fuente: [src/pages]
---

# Rutas y navegación

## Las 2 rutas (desde el 29 de octubre de 2026)

Se eliminaron las subpáginas `/servicios/`, `/tools/` y `/tools/video-converter/` y se adoptó una regla: **cada cosa tiene su propia página directa, sin una página «índice» intermedia** (antes: Tools → Conversor, dos redirecciones). El conversor pasó a `/video-converters/`.

| Ruta | Archivo bajo `src/pages/` | Estructura |
|---|---|---|
| `/` | [index.astro](../../src/pages/index.astro) | Layout + Hero + main con About, Proyectos, Servicios, Tools, Contacto y FAQ |
| `/video-converters/` | [video-converters/index.astro](../../src/pages/video-converters/index.astro) | Layout + SimpleNav + VideoConverterPageContent + isla React |

Las rutas antiguas devuelven 404 (el sitio aún no estaba publicado, así que no hay redirecciones). Los archivos de las páginas eliminadas están en `backups/paginas-eliminadas-2026-10-29/` (`.astro.bak`). **Se conservan sin montar** `ServicesPageContent`, `ToolsPageContent`, `ServicesForm`, `ServicesTeaser` y `ToolsTeaser` y el contenido `services.page`/`tools.page` (la portada usa sus artículos y herramientas), para recuperarlos cuando se decida. El nombre de la ruta, en plural, es el que pidió el usuario; cambiarlo es mover la carpeta y el enlace de `site.js`. Las tarjetas de Servicios y Tools de la portada ya no llevan el botón final (`ctaLabel`, ahora sin uso en `site.js`); las de Servicios no son enlaces y, en Tools, solo el conversor lo es.

Todas usan `lang="es"` y `bodyClass="redesign"`. Solo la portada añade `redesign-home`, que activa la reserva de espacio del sidebar y la excepción de clic central (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]]). Los cambios de página son cargas completas — no se instala `ClientRouter`.

No existen rutas `/en`, `/servicios`, `/tools`, detalle de proyecto, Instagram checker, contacto independiente, política de privacidad, página de gracias ni 404 personalizada.

## Anclas de la portada

`home`, `about`, `projects`, `services`, `tools`, `contact`, `faq`. Desde el 23 de octubre `services` y `tools` son dos secciones principales consecutivas e independientes (Servicios y después Tools); el antiguo contenedor `services-tools` ya no existe. Las escenas antiguas de About y sus anclas ya no existen. Sus encabezados internos usan ab-intro-heading, ab-difference-heading, ab-foundation-heading y ab-skills-heading; la navegación principal sigue apuntando a #about (ver [[Sobre-Mi]]).

## Tres navegaciones distintas — deliberadamente no equivalentes

Las tres difieren a propósito en el orden (desde el 29 de octubre ya no en el destino de Servicios/Tools: las tres usan anclas de la portada).

| Navegación | Orden | Destino de Servicios/Tools | Excepciones |
|---|---|---|---|
| Superior del Hero y menú móvil | Inicio, Sobre mí, Contacto, Proyectos, Servicios, Tools | `#services`, `#tools` | Seis enlaces; no incluyen FAQ |
| Sidebar (tras el morph) | Inicio, Sobre mí, Proyectos, Servicios, Tools, Contacto, FAQ | `#services`, `#tools` (antes `/servicios/`, `/tools/`) | Siete enlaces con iconos Lucide |
| SimpleNav de subpáginas | Sobre mí, Contacto, Proyectos, Servicios, Tools | `/#services`, `/#tools`, con `withBase` | La marca CHIISSUU vuelve a `/`; a ≤700px desaparece la lista pero la marca permanece |

Detalle del sidebar (morph, temas, sección activa) en [[Hero-y-Sidebar]].

## `withBase`

[paths.js](../../src/lib/paths.js) espera destinos internos con barra inicial, como `/tools/`. No normaliza URLs externas ni debe usarse para prefijarlas. La mayoría de enlaces y assets HTML respetan `BASE_URL`; dos excepciones CSS conocidas usan rutas absolutas `/assets/...`: la fuente editorial y el fondo del Hero (ver [[Hallazgos-y-Pendientes]], "Rutas CSS no preparadas para base").

## Relacionado

[[Hero-y-Sidebar]] · [[Otras-Secciones-y-Compartidos]] · [[01-Arquitectura-y-Stack|Arquitectura-y-Stack]]
