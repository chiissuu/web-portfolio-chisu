---
tags: [moc, contexto-agente]
aliases: [Empieza-Aqui]
actualizado: 2026-10-06
fuente: [código fuente del proyecto]
---

# Empieza aquí

Este vault organiza todo el conocimiento del portfolio personal de **Jesús León** ("chiissuu"): un sitio estático construido con Astro, con React únicamente en el conversor de vídeo. El resto de la interacción viene de scripts de Astro, GSAP y CSS.

Este vault se construyó reestructurando, en notas de Obsidian interconectadas, una auditoría completa del proyecto (revisión del 10 de septiembre de 2026) que ya cumplió su propósito de dar contexto y fue retirada. Desde ahora este vault es la referencia documental única del proyecto — si en algún momento diverge del código, el código fuente manda.

**Estado Git en el momento de crear este vault (2026-10-06):** rama `feat/lower-sections-redesign`, HEAD `7b53ed6` ("chore: create audited portfolio checkpoint"). Cambios locales sin commit ya presentes: [AboutSection.astro](../../src/components/AboutSection.astro), [ProjectsSection.astro](../../src/components/ProjectsSection.astro), [site.js](../../src/content/site.js) y [content-types.ts](../../src/lib/content-types.ts). Son parte del estado documentado — no son un error a revertir.

## Qué es esto, en una frase por área

| Área | Estado real |
|---|---|
| Inicio y secciones editoriales | Implementados |
| Proyectos | Tres tarjetas provisionales, sin enlaces ni casos de estudio reales |
| Servicios | Contenido y formulario implementados; envío **simulado** |
| Tools | Conversor de vídeo implementado; comprobador de Instagram sin lógica ni página |
| Contacto | Enlaces externos + correo `mailto:`; formulario con envío simulado |
| FAQ | Cuatro preguntas; una respuesta provisional |
| Idiomas | Español servido; inglés existe en los datos pero sin rutas y con una clave ausente |
| Backend / API / auth / BD | No existen en este repositorio |

Detalle completo por sección en [[Contenido-por-Seccion]].

## Reglas de trabajo sobre este proyecto

- Revisar primero el componente, los datos que consume (`site.js`) y su relación con el layout, antes de tocar nada.
- Mantener los textos en [site.js](../../src/content/site.js) y actualizar su contrato en [content-types.ts](../../src/lib/content-types.ts) cuando cambie la forma de los datos. Editar este vault no cambia la web.
- Conservar los IDs, claves de morph y tokens compartidos (ver [[Hero-y-Sidebar]] y [[03-Sistema-de-Diseno|Sistema-de-Diseno]]), o actualizar conjuntamente todos sus consumidores.
- No confundir las tecnologías que aparecen como *habilidades personales* (sección Sobre mí) con dependencias reales del proyecto — Docker, Java, PostgreSQL o n8n aparecen como skills, no como stack implementado aquí.
- No editar `dist/`, `.astro/`, `node_modules/` ni `public/ffmpeg/`: son salidas o dependencias regenerables, no fuente.
- La carpeta hermana `portfolio-web-chiissuu-recovery/` es solo referencia histórica — nunca sustituir archivos actuales por copias de ahí sin comparar contenido, tipos, estilos y rutas. Detalle de qué difiere en la sección siguiente.

## Las dos carpetas (resumen)

Existe una carpeta hermana `portfolio-web-chiissuu-recovery/` con una copia de código (`desktop-stable-2026-08-19-8176afa/`) y una carpeta suelta `_to_delete/`. No es un repositorio Git operativo. Difieren de lo activo: `AboutSection.astro`, `ProjectsSection.astro`, `VideoConverterPageContent.astro`, `site.js`, `content-types.ts` y `astro.config.mjs` — el resto de `src/`, `scripts/`, `public/assets/` y la configuración coinciden byte a byte. El texto de depuración `PRUEBA DE SECCIÓN` solo sobrevive en esa copia antigua, ya retirado del proyecto activo.

## Changelog corto (respecto a la auditoría de agosto 2026)

- About pasó de un esquema de capítulos numerados a `scenes` + rail + portada propia sobre beige; Proyectos es ahora el tema oscuro (se intercambiaron).
- Lucide sí se usa y renderiza en el sidebar (la sospecha de dependencia sin uso quedó descartada).
- El texto de depuración del conversor ya no existe en el proyecto activo.
- Se añadió `vite.optimizeDeps.include: ["react-dom/client"]` en `astro.config.mjs` para resolver un fallo de hidratación en dev.
- El build local termina correctamente. El resumen de `astro check` indica 0 errores, 0 warnings y 126 hints; Vite emite además avisos de opciones obsoletas (ver [[Comandos-y-Pruebas]]).

## Mapa del vault

**Arquitectura y producto**
- [[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] — stack, dependencias, estructura de carpetas, diagrama
- [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]] — las 4 rutas y las 3 navegaciones (deliberadamente distintas)
- [[03-Sistema-de-Diseno|Sistema-de-Diseno]] — tokens, temas de color, breakpoints, fuentes
- [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] — reveals, foco, reduced motion, clic central
- [[05-SEO-Comunicaciones-Persistencia|SEO-Comunicaciones-Persistencia]] — metadatos, enlaces externos, almacenamiento

**Componentes**
- [[Hero-y-Sidebar]] — HeroExperience: entrada, morph de scroll, temas del sidebar, menú móvil
- [[Sobre-Mi]] — AboutSection: portada, escenas, rail, formación/idiomas, skills
- [[Formularios]] — ContactForm / ServicesForm: validación, envío simulado, límites reales
- [[Conversor-de-Video]] — isla React: estados, validación, FFmpeg, progreso/cancelación
- [[Otras-Secciones-y-Compartidos]] — Proyectos, Servicios/Tools, Contacto, FAQ, Layout, componentes sin montar

**Contenido**
- [[Contenido-por-Seccion]] — qué muestra cada sección, con sus placeholders reales
- [[Bilingue-ES-EN]] — qué le falta al inglés para poder publicarse

**Operación**
- [[Comandos-y-Pruebas]] — dev/check/build/preview, recorrido de prueba manual
- [[Hallazgos-y-Pendientes]] — tabla priorizada de pendientes, enlazada por componente

**Inventario**
- [[Archivos-del-Proyecto]] — los archivos de `src/` + config, cada uno enlazado al código real
- [[Recursos-Estaticos]] — assets de `public/` con tamaño en bytes y uso

## Convenciones de este vault

- Enlaces entre notas de este vault: wikilinks de Obsidian (doble corchete) usando el nombre real del archivo destino. Para mostrar un alias, usar `[[nombre-real|alias]]`; la propiedad `aliases` no sustituye el destino del enlace.
- Enlaces a código real (fuera del vault): Markdown estándar con ruta relativa, como el que usa esta misma nota para enlazar a [site.js](../../src/content/site.js).
- El contenido real de `content.es` **no se duplica** aquí (evita una segunda fuente que se desactualice): las notas de contenido explican estructura y texto en prosa/tablas y enlazan a [site.js](../../src/content/site.js) como única fuente.
- Cada nota termina con `## Relacionado`.
