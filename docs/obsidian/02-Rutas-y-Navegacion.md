---
tags: [rutas, navegacion]
aliases: [Rutas-y-Navegacion]
actualizado: 2026-10-06
fuente: [src/pages]
---

# Rutas y navegación

## Las 4 rutas

| Ruta | Archivo bajo `src/pages/` | Estructura |
|---|---|---|
| `/` | [index.astro](../../src/pages/index.astro) | Layout + Hero + main con About, Proyectos, Servicios/Tools, Contacto y FAQ |
| `/servicios/` | [servicios/index.astro](../../src/pages/servicios/index.astro) | Layout + SimpleNav + ServicesPageContent + ServicesForm |
| `/tools/` | [tools/index.astro](../../src/pages/tools/index.astro) | Layout + SimpleNav + ToolsPageContent |
| `/tools/video-converter/` | [tools/video-converter/index.astro](../../src/pages/tools/video-converter/index.astro) | Layout + SimpleNav + VideoConverterPageContent + isla React |

Todas usan `lang="es"` y `bodyClass="redesign"`. Solo la portada añade `redesign-home`, que activa la reserva de espacio del sidebar y la excepción de clic central (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]]). Los cambios de página son cargas completas — no se instala `ClientRouter`.

No existen rutas `/en`, detalle de proyecto, Instagram checker, contacto independiente, política de privacidad, página de gracias ni 404 personalizada.

## Anclas de la portada

`home`, `about`, `projects`, `services-tools`, `services`, `tools`, `contact`, `faq`. `services` y `tools` son columnas internas de `services-tools`, no secciones principales independientes. About añade además `about-scene-foundations`, `about-scene-direction`, `about-scene-product` y `about-scene-drive` (ver [[Sobre-Mi]]).

## Tres navegaciones distintas — deliberadamente no equivalentes

Este es un punto fácil de "corregir por error" si no se conoce: las tres difieren a propósito en orden y en destino de Servicios/Tools.

| Navegación | Orden | Destino de Servicios/Tools | Excepciones |
|---|---|---|---|
| Superior del Hero y menú móvil | Inicio, Sobre mí, Contacto, Proyectos, Servicios, Tools | `#services`, `#tools` | Seis enlaces; no incluyen FAQ |
| Sidebar (tras el morph) | Inicio, Sobre mí, Proyectos, Servicios, Tools, Contacto, FAQ | `/servicios/`, `/tools/` | Siete enlaces con iconos Lucide |
| SimpleNav de subpáginas | Sobre mí, Contacto, Proyectos, Servicios, Tools | `/#services`, `/#tools`, con `withBase` | La marca CHIISSUU vuelve a `/`; a ≤700px desaparece la lista pero la marca permanece |

Detalle del sidebar (morph, temas, sección activa) en [[Hero-y-Sidebar]].

## `withBase`

[paths.js](../../src/lib/paths.js) espera destinos internos con barra inicial, como `/tools/`. No normaliza URLs externas ni debe usarse para prefijarlas. La mayoría de enlaces y assets HTML respetan `BASE_URL`; dos excepciones CSS conocidas usan rutas absolutas `/assets/...`: la fuente editorial y el fondo del Hero (ver [[Hallazgos-y-Pendientes]], "Rutas CSS no preparadas para base").

## Relacionado

[[Hero-y-Sidebar]] · [[Otras-Secciones-y-Compartidos]] · [[01-Arquitectura-y-Stack|Arquitectura-y-Stack]]
