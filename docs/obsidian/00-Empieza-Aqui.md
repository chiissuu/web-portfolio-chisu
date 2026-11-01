---
tags: [moc, contexto-agente]
aliases: [Empieza-Aqui]
actualizado: 2026-10-23
fuente: [código fuente del proyecto]
---

# Empieza aquí

Este vault organiza todo el conocimiento del portfolio personal de **Jesús León** ("chiissuu"): un sitio estático construido con Astro, con React únicamente en el conversor de vídeo. El resto de la interacción viene de scripts de Astro, GSAP y CSS.

Este vault se construyó reestructurando, en notas de Obsidian interconectadas, una auditoría completa del proyecto (revisión del 10 de septiembre de 2026) que ya cumplió su propósito de dar contexto y fue retirada. Desde ahora este vault es la referencia documental única del proyecto — si en algún momento diverge del código, el código fuente manda.

**Estado Git (comprobado el 2026-10-23):** rama `feat/lower-sections-redesign`, HEAD `2948631` («feat: refine about and stack and fix video converter»). Antes de la última ronda dorada de About había cambios sin commit en [AboutSection.astro](../../src/components/AboutSection.astro), [HeroExperience.astro](../../src/components/HeroExperience.astro), [site.js](../../src/content/site.js) y [content-types.ts](../../src/lib/content-types.ts), además de recursos nuevos sin seguimiento (fuente Milesdane archivada, iconos sociales y PNG de título). Son parte del estado documentado — no son un error a revertir. Consultar `git status` para el estado actual: esta nota no es un registro en vivo.

## Qué es esto, en una frase por área

Estado comprobado el 10 de octubre en [[Auditoria-Web]]: formularios siguen simulados, con aviso previo y protección sin scripts; correo y contrastes locales corregidos. En una corrección posterior autorizada se aplicó el núcleo ESM del conversor: MP3/MP4, decodificación, errores, cancelación y reintentos pasan con el vídeo sintético. Se separaron las cachés dev/build para evitar el fallo de React. Ver [[Conversor-de-Video]] y [[Comandos-y-Pruebas]]. Las cuatro rutas permanecen y las zonas visuales terminadas se conservaron.

| Área | Estado real |
|---|---|
| Inicio y secciones editoriales | Implementados |
| Proyectos | **Terminado** (31 de octubre de 2026): carrusel horizontal anclado con seis proyectos reales, cabecera con hilo de luz y contador, cierre luminoso hacia «Mi stack de trabajo». Para añadir, quitar o editar proyectos: [[Mantener-Proyectos]] |
| Servicios | **Terminado** (1 de noviembre de 2026): transición desde el stack (degradado champán → oro → negro, regla con escala, raíles y escáner), cabecera centrada, tres tarjetas con ilustración, franja «Cómo trabajo» y botón dorado a Contacto. Mantenimiento: [[Mantener-Servicios]]. El formulario de la página `/servicios` (no montada) sigue con envío **simulado** |
| Tools | Conversor de vídeo implementado; «Herramientas de boosting para redes sociales» (antes «comprobador de Instagram») sin lógica ni página. **Terminado** (1 de noviembre de 2026): catálogo escalable que abre en «Destacadas» (máx. 3) con chips por categoría, y transición desde Servicios (degradado, hilos y destello). Mantenimiento: [[Mantener-Tools]] |
| Contacto | **Rediseñado** (1 de noviembre de 2026): cabecera centrada, tarjeta directa (botón dorado de email, copiar, canales; LinkedIn apagado) y formulario de 4 campos que abre el correo del visitante con `mailto:`; transición «señal» desde Tools. Mantenimiento: [[Mantener-Contacto]]. La salida hacia FAQ sigue con la ola |
| FAQ | **Rediseñada** (1 de noviembre de 2026): frontera «Amanecer» desde Contacto, siete preguntas en una columna con apertura animada (solo una abierta), atajos a otras secciones y cierre «Gracias por llegar hasta aquí. — chiissuu» con botón de volver arriba. Plantilla: se irá ampliando. Mantenimiento: [[Mantener-FAQ]] |
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

- About pasó de capítulos numerados a `scenes` + rail, y después (octubre) a: PNG dorado de título, siete párrafos en dos grupos, y un stack de 42 herramientas. Su fondo es grafito cálido #24221f con textura suave y halo dorado estático, tema dark, sin rail ni escenas. Proyectos conserva su tema oscuro.
- Desde el 23 de octubre el sidebar usa siempre la paleta `brand` (dorada); la paleta mono/plata se retiró.
- Servicios y Tools son ahora dos secciones consecutivas (`#services`, `#tools`) y el sidebar ilumina una sola a la vez. Proyectos, Servicios, Tools, Contacto y FAQ usan títulos gráficos WebP (ver [[Otras-Secciones-y-Compartidos]]). Ambas muestran ahora tarjetas con imagen provisional sobre el mismo fondo grafito que Sobre mí (ver [[Auditoria-Servicios-Tools]]).
- Contacto dejó de ser la sección clara: mismo grafito, formulario en panel y canales directos a la derecha (ver [[Auditoria-Contacto]]). El Hero bloquea el scroll mientras reproduce su entrada y, con un ratón, el fondo se deforma como un líquido que sigue al cursor, y el wordmark, el titular, el lema, la nota, los chips y las métricas se ondulan como agua (botones, navegación y retrato no) (ver [[Hero-y-Sidebar]]). La biografía de Sobre mí es ahora un hilo dorado con siete tarjetas que se enciende con el scroll (ver [[Sobre-Mi]]).
- Lucide sí se usa y renderiza en el sidebar (la sospecha de dependencia sin uso quedó descartada).
- El texto de depuración del conversor ya no existe en el proyecto activo.
- Se añadió `vite.optimizeDeps.include: ["react-dom/client"]` en `astro.config.mjs` para resolver un fallo de hidratación en dev.
- El build local termina correctamente. El resumen de `astro check` indica 0 errores, 0 warnings y 126 hints; los avisos de opciones obsoletas de Vite quedaron resueltos con la actualización del 6 de octubre de 2026 (ver [[Comandos-y-Pruebas]]).

## Mapa del vault

**Arquitectura y producto**
- [[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] — stack, dependencias, estructura de carpetas, diagrama
- [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]] — las 4 rutas y las 3 navegaciones (deliberadamente distintas)
- [[03-Sistema-de-Diseno|Sistema-de-Diseno]] — tokens, temas de color, breakpoints, fuentes
- [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] — reveals, foco, reduced motion, clic central
- [[05-SEO-Comunicaciones-Persistencia|SEO-Comunicaciones-Persistencia]] — metadatos, enlaces externos, almacenamiento

**Componentes**
- [[Hero-y-Sidebar]] — HeroExperience: entrada, morph de scroll, temas del sidebar, menú móvil
- [[Sobre-Mi]] — AboutSection: título Sobre mí, resumen inicial, formación/idiomas y skills
- [[Formularios]] — ContactForm / ServicesForm: validación, envío simulado, límites reales
- [[Conversor-de-Video]] — isla React: estados, validación, FFmpeg, progreso/cancelación
- [[Otras-Secciones-y-Compartidos]] — Proyectos, Servicios/Tools, Contacto, FAQ, Layout, componentes sin montar

**Contenido**
- [[Contenido-por-Seccion]] — qué muestra cada sección, con sus placeholders reales
- [[Bilingue-ES-EN]] — qué le falta al inglés para poder publicarse

**Operación**
- [[Comandos-y-Pruebas]] — dev/check/build/preview, recorrido de prueba manual
- [[Mantener-Proyectos]] — cómo añadir, quitar o modificar proyectos sin romper la sección
- [[Hallazgos-y-Pendientes]] — tabla priorizada de pendientes, enlazada por componente
- [[Skills-Desarrollo-Web]] — selección comprobada de skills e instalación manual
- [[Prompt-Continuidad-Claude]] — toma de contexto inicial completa y metodología de trabajo con delegación y consumo controlados
- [[Prompt-Auditoria-Web]] — encargo preparado para una auditoría con Hero/Sobre mí/nav lateral protegidos y cambios según riesgo
- [[Auditoria-Web]] — ronda ejecutada el 10 de octubre; cambios verificados, evidencias y decisiones pendientes
- [[Auditoria-Sobre-Mi]] — auditoría y rediseño de About (23 de octubre): fuentes, dorado, nav y fondo grafito
- [[Auditoria-Servicios-Tools]] — auditoría de coherencia y transiciones de Servicios/Tools, tarjetas y pendientes
- [[Auditoria-Contacto]] — auditoría y rediseño de Contacto: fondo, tipografía, organización y contrastes
- [[Logos-Stack]] y [[Logos-Redes]] — procedencia y licencias de los logos del stack y del sidebar

**Inventario**
- [[Archivos-del-Proyecto]] — los archivos de `src/` + config, cada uno enlazado al código real
- [[Recursos-Estaticos]] — assets de `public/` con tamaño en bytes y uso

## Convenciones de este vault

- Enlaces entre notas de este vault: wikilinks de Obsidian (doble corchete) usando el nombre real del archivo destino. Para mostrar un alias, usar `[[nombre-real|alias]]`; la propiedad `aliases` no sustituye el destino del enlace.
- Enlaces a código real (fuera del vault): Markdown estándar con ruta relativa, como el que usa esta misma nota para enlazar a [site.js](../../src/content/site.js).
- El contenido real de `content.es` **no se duplica** aquí (evita una segunda fuente que se desactualice): las notas de contenido explican estructura y texto en prosa/tablas y enlazan a [site.js](../../src/content/site.js) como única fuente.
- Cada nota termina con `## Relacionado`.
