---
tags: [inventario, archivos]
actualizado: 2026-10-23
fuente: [estructura del repositorio]
---

# Inventario de archivos del proyecto

Inventario completo de `src/` + configuración. Las bibliotecas instaladas y el código compilado no se enumeran como fuentes propias. Las copias equivalentes en la carpeta de recuperación se describen en [[00-Empieza-Aqui]].

| Archivo | Responsabilidad |
|---|---|
| [scripts/generate-about-veins.mjs](../../../scripts/generate-about-veins.mjs) | Genera `about-veins.webp` a partir de la textura del Hero (`sharp`), ver [[Sobre-Mi]] |
| [scripts/copy-ffmpeg-core.mjs](../../../scripts/copy-ffmpeg-core.mjs) | Copia del motor instalado a `public/ffmpeg` |
| [src/pages/video-converters/index.astro](../../../src/pages/video-converters/index.astro) | Única ruta aparte de la portada (antes `/tools/video-converter/`); ver [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]] |
| [src/components/SectionBackdrop.astro](../../../src/components/SectionBackdrop.astro) | Capas de fondo de Proyectos, Servicios, Tools, Contacto y FAQ (`champagne`, `blueprint`, `brushed`, `dawn`, `ivory`) — ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]] |
| [src/components/ProjectCard.astro](../../../src/components/ProjectCard.astro) | Tarjeta alta del carrusel de Proyectos (arte a toda la tarjeta, tags, texto y flecha) — ver [[Otras-Secciones-y-Compartidos]] |
| [src/components/SkillsStack.astro](../../../src/components/SkillsStack.astro) | «Mi stack de trabajo» (categorías y logos), bajo Proyectos; antes dentro de Sobre mí — ver [[Sobre-Mi]] |
| [src/components/AboutSatellite.astro](../../../src/components/AboutSatellite.astro) | Ilustraciones de línea dorada al lado de cada tarjeta del hilo de Sobre mí (ocho variantes, decorativas) — ver [[Sobre-Mi]] |
| [src/components/AboutSection.astro](../../../src/components/AboutSection.astro) | Título PNG dorado, siete párrafos en dos grupos y stack de 42 herramientas; formación e idiomas van dentro de la biografía — ver [[Sobre-Mi]] |
| Banderas [España](../../../public/assets/icons/flags/es.svg), [Reino Unido](../../../public/assets/icons/flags/gb.svg) y [Alemania](../../../public/assets/icons/flags/de.svg) | SVG locales simplificados para ubicación e idiomas de la biografía; no dependen de emojis de banderas |
| [scripts/test-video-converter.mjs](../../../scripts/test-video-converter.mjs) | Prueba reproducible del conversor (6 casos con el motor real); ver [[Comandos-y-Pruebas]] |
| [src/components/ClosingStatement.astro](../../../src/components/ClosingStatement.astro) | Cierre conservado; sin uso en rutas actuales — ver [[Otras-Secciones-y-Compartidos]] |
| [src/components/ContactForm.astro](../../../src/components/ContactForm.astro) | Formulario de contacto y estados de validación/envío simulado — ver [[Formularios]] |
| [src/components/ContactSection.astro](../../../src/components/ContactSection.astro) | Tarjetas sociales, formulario y correo manual |
| [src/components/FaqSection.astro](../../../src/components/FaqSection.astro) | Cuatro detalles desplegables nativos |
| [src/components/HeroExperience.astro](../../../src/components/HeroExperience.astro) | Hero, sidebar, menú móvil y sistema GSAP/ScrollTrigger — ver [[Hero-y-Sidebar]] |
| [src/components/ProjectsSection.astro](../../../src/components/ProjectsSection.astro) | Tres tarjetas provisionales de proyectos |
| [src/components/RollLink.astro](../../../src/components/RollLink.astro) | Enlace con duplicación visual y rollover accesible |
| [src/components/SectionHeadingCard.astro](../../../src/components/SectionHeadingCard.astro) | Primitiva de título: tarjeta de cristal o, con `image`, título gráfico recortado por CSS |
| [src/components/ServicesForm.astro](../../../src/components/ServicesForm.astro) | Solicitud de servicios con envío simulado — ver [[Formularios]] |
| [src/components/ServicesPageContent.astro](../../../src/components/ServicesPageContent.astro) | Página de servicios, artículos y formulario |
| [src/components/ServicesTeaser.astro](../../../src/components/ServicesTeaser.astro) | Teaser antiguo de servicios; sin uso actual |
| [src/components/ServicesSection.astro](../../../src/components/ServicesSection.astro) | Sección `#services` de la portada: tres tarjetas desde `services.page.articles` |
| [src/components/ToolsSection.astro](../../../src/components/ToolsSection.astro) | Sección `#tools` de la portada: tarjetas desde `tools.page.items` |
| [src/components/ShowcaseSection.astro](../../../src/components/ShowcaseSection.astro) | Sección compartida de Servicios/Tools: fondo grafito, título con halo, introducción, rejilla y CTA |
| [src/components/ShowcaseCard.astro](../../../src/components/ShowcaseCard.astro) | Tarjeta compartida: número, estado, hueco de imagen, título, texto, etiquetas y flecha |
| [src/components/SimpleNav.astro](../../../src/components/SimpleNav.astro) | Navegación sticky de las tres subpáginas |
| [src/components/ToolsPageContent.astro](../../../src/components/ToolsPageContent.astro) | Catálogo con CTA condicional según `href` |
| [src/components/ToolsTeaser.astro](../../../src/components/ToolsTeaser.astro) | Teaser antiguo de herramientas; sin uso actual |
| [src/components/VideoConverterPageContent.astro](../../../src/components/VideoConverterPageContent.astro) | Encabezado de conversor y montaje `client:only` |
| [src/components/VideoConverter/ConversionProgress.tsx](../../../src/components/VideoConverter/ConversionProgress.tsx) | Estado, porcentaje y cancelación |
| [src/components/VideoConverter/ConversionResult.tsx](../../../src/components/VideoConverter/ConversionResult.tsx) | Resultado, descarga y reset |
| [src/components/VideoConverter/DropZone.tsx](../../../src/components/VideoConverter/DropZone.tsx) | Selector y arrastrar/soltar del primer archivo |
| [src/components/VideoConverter/FileSummary.tsx](../../../src/components/VideoConverter/FileSummary.tsx) | Resumen de metadatos seleccionados |
| [src/components/VideoConverter/OutputSettings.tsx](../../../src/components/VideoConverter/OutputSettings.tsx) | Formato y bitrate |
| [src/components/VideoConverter/VideoConverter.tsx](../../../src/components/VideoConverter/VideoConverter.tsx) | Máquina de estados React — ver [[Conversor-de-Video]] |
| [src/components/VideoConverter/video-converter.module.css](../../../src/components/VideoConverter/video-converter.module.css) | CSS Module del conversor, breakpoint 560px |
| [src/content/site.js](../../../src/content/site.js) | Contenido español e inglés — ver [[Contenido-por-Seccion]] |
| [src/layouts/Layout.astro](../../../src/layouts/Layout.astro) | HTML, fuentes, tokens, estilos, reveal y clic central — ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]] |
| [src/lib/content-types.ts](../../../src/lib/content-types.ts) | Contratos de datos y props por componente |
| [src/lib/forms/submit.ts](../../../src/lib/forms/submit.ts) | Simulación asíncrona de 500ms |
| [src/lib/forms/types.ts](../../../src/lib/forms/types.ts) | Datos de ambos formularios y estado/resultado |
| [src/lib/forms/validate.ts](../../../src/lib/forms/validate.ts) | Validadores de campos y email |
| [src/lib/heroFluid.ts](../../../src/lib/heroFluid.ts) | Efecto del ratón sobre el fondo del Hero: WebGL2 sin dependencias, ver [[Hero-y-Sidebar]] |
| [src/lib/paths.js](../../../src/lib/paths.js) | Prefijo de `BASE_URL` para enlaces internos |
| [src/lib/videoConverter/constants.ts](../../../src/lib/videoConverter/constants.ts) | Límites, extensiones, bitrates y directorio FFmpeg |
| [src/lib/videoConverter/ffmpegClient.ts](../../../src/lib/videoConverter/ffmpegClient.ts) | Carga de Worker, conversión, cancelación y FS virtual |
| [src/lib/videoConverter/types.ts](../../../src/lib/videoConverter/types.ts) | Etapas, archivo seleccionado, resultado y errores de validación |
| [src/lib/videoConverter/utils.ts](../../../src/lib/videoConverter/utils.ts) | Metadatos, validación, memoria y nombres de salida |
| [src/pages/index.astro](../../../src/pages/index.astro) | Ruta: `/` |
| `src/pages/servicios/index.astro` | **Eliminada el 29 de octubre de 2026** (respaldo en `backups/paginas-eliminadas-2026-10-29/`); era la ruta `/servicios/` |
| `src/pages/tools/index.astro` | **Eliminada el 29 de octubre de 2026** (mismo respaldo); era la ruta `/tools/` |
| `src/pages/tools/video-converter/index.astro` | **Movida** a `src/pages/video-converters/index.astro` (ruta `/video-converters/`) |

## Configuración revisada

[package.json](../../../package.json) · [package-lock.json](../../../package-lock.json) · [astro.config.mjs](../../../astro.config.mjs) · [tsconfig.json](../../../tsconfig.json) · [.gitignore](../../../.gitignore) · [.claude/launch.json](../../../.claude/launch.json)

## Relacionado

[[Recursos-Estaticos]] · [[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] · [[00-Empieza-Aqui]]
