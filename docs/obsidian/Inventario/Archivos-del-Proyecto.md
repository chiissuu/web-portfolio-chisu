---
tags: [inventario, archivos]
actualizado: 2026-10-06
fuente: [estructura del repositorio]
---

# Inventario de archivos del proyecto

Inventario completo de `src/` + configuración. Las bibliotecas instaladas y el código compilado no se enumeran como fuentes propias. Las copias equivalentes en la carpeta de recuperación se describen en [[00-Empieza-Aqui]].

| Archivo | Responsabilidad |
|---|---|
| [scripts/copy-ffmpeg-core.mjs](../../../scripts/copy-ffmpeg-core.mjs) | Copia del motor instalado a `public/ffmpeg` |
| [src/components/AboutSection.astro](../../../src/components/AboutSection.astro) | Portada editorial, escenas, rail, formación, idiomas y skills — ver [[Sobre-Mi]] |
| [src/components/ClosingStatement.astro](../../../src/components/ClosingStatement.astro) | Cierre conservado; sin uso en rutas actuales — ver [[Otras-Secciones-y-Compartidos]] |
| [src/components/ContactForm.astro](../../../src/components/ContactForm.astro) | Formulario de contacto y estados de validación/envío simulado — ver [[Formularios]] |
| [src/components/ContactSection.astro](../../../src/components/ContactSection.astro) | Tarjetas sociales, formulario y correo manual |
| [src/components/FaqSection.astro](../../../src/components/FaqSection.astro) | Cuatro detalles desplegables nativos |
| [src/components/HeroExperience.astro](../../../src/components/HeroExperience.astro) | Hero, sidebar, menú móvil y sistema GSAP/ScrollTrigger — ver [[Hero-y-Sidebar]] |
| [src/components/ProjectsSection.astro](../../../src/components/ProjectsSection.astro) | Tres tarjetas provisionales de proyectos |
| [src/components/RollLink.astro](../../../src/components/RollLink.astro) | Enlace con duplicación visual y rollover accesible |
| [src/components/SectionHeadingCard.astro](../../../src/components/SectionHeadingCard.astro) | Primitiva de título sobre cristal |
| [src/components/ServicesForm.astro](../../../src/components/ServicesForm.astro) | Solicitud de servicios con envío simulado — ver [[Formularios]] |
| [src/components/ServicesPageContent.astro](../../../src/components/ServicesPageContent.astro) | Página de servicios, artículos y formulario |
| [src/components/ServicesTeaser.astro](../../../src/components/ServicesTeaser.astro) | Teaser antiguo de servicios; sin uso actual |
| [src/components/ServicesToolsSection.astro](../../../src/components/ServicesToolsSection.astro) | Sección combinada de portada y ejemplo de primera tool |
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
| [src/lib/paths.js](../../../src/lib/paths.js) | Prefijo de `BASE_URL` para enlaces internos |
| [src/lib/videoConverter/constants.ts](../../../src/lib/videoConverter/constants.ts) | Límites, extensiones, bitrates y directorio FFmpeg |
| [src/lib/videoConverter/ffmpegClient.ts](../../../src/lib/videoConverter/ffmpegClient.ts) | Carga de Worker, conversión, cancelación y FS virtual |
| [src/lib/videoConverter/types.ts](../../../src/lib/videoConverter/types.ts) | Etapas, archivo seleccionado, resultado y errores de validación |
| [src/lib/videoConverter/utils.ts](../../../src/lib/videoConverter/utils.ts) | Metadatos, validación, memoria y nombres de salida |
| [src/pages/index.astro](../../../src/pages/index.astro) | Ruta: `/` |
| [src/pages/servicios/index.astro](../../../src/pages/servicios/index.astro) | Ruta: `/servicios/` |
| [src/pages/tools/index.astro](../../../src/pages/tools/index.astro) | Ruta: `/tools/` |
| [src/pages/tools/video-converter/index.astro](../../../src/pages/tools/video-converter/index.astro) | Ruta: `/tools/video-converter/` |

## Configuración revisada

[package.json](../../../package.json) · [package-lock.json](../../../package-lock.json) · [astro.config.mjs](../../../astro.config.mjs) · [tsconfig.json](../../../tsconfig.json) · [.gitignore](../../../.gitignore) · [.claude/launch.json](../../../.claude/launch.json)

## Relacionado

[[Recursos-Estaticos]] · [[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] · [[00-Empieza-Aqui]]
