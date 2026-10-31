---
tags: [componente, proyectos, servicios, tools, contacto, faq, compartidos]
actualizado: 2026-10-23
fuente: [src/components]
---

# Otras secciones y componentes compartidos

Componentes más simples que Hero/About/Formularios/Conversor — aquí se agrupan por no justificar cada uno su propia nota. Para el texto real que muestran, ver [[Contenido-por-Seccion]].

## Proyectos — [ProjectsSection.astro](../../../src/components/ProjectsSection.astro)

> **Sección terminada (31 de octubre de 2026).** Para añadir, quitar o editar proyectos sin tocar el diseño ni las animaciones, seguir [[Mantener-Proyectos]]; los párrafos de abajo son el historial de decisiones de diseño.

**Cabecera fuera del anclaje (29 de octubre, tarde):** (1) Al terminar el iris la composición es título centrado (~y106–250 a 1440×900), introducción, contador «01 / 06» y tarjetas empezando (~y458): el punto de luz del iris se ancla al centro del título (`.sc-head .shc`) y se quitó la regla `padding-top: 0` de `.sc-inner` con iris. (2) El título y la introducción ya no van dentro del bloque anclado: `.sc-head` (cabecera) se desplaza con la página y `.sc-pin` contiene solo el contador/progreso y la fila. (3) El anclaje empieza con `PIN_TOP = 28` (`start: top 28px`), sustituyendo el cálculo por exceso de altura; con la fila anclada solo se ven la barra de progreso (y=28–55) y las tarjetas (y=79–583) y la introducción queda fuera de pantalla. Comprobado con el iframe de pruebas a 1440×900 (fin del iris y anclado a +250px) y a 390px (sin anclaje, sin contador, título centrado, sin desbordamiento). Copia previa: `backups/ShowcaseSection.astro.pre-cabecera-fuera-2026-10-29`.

**Pulido de Proyectos (29 de octubre):** (1) *Cabecera centrada* (`ShowcaseSection` con `center`): título e introducción centrados respecto al contenido, como en Sobre mí; introducción en Inter 500 a `clamp(1.1rem, 1.5vw, 1.3rem)`, tinta al 92 %, `text-wrap: balance`, con las frases de `projects.noteStrong` en negrita (la frase en sí sigue siendo provisional, el usuario la cambiará) y un parche suave del color de la sección detrás para que las venas no crucen las letras. (2) *Tarjetas* (`ProjectCard`): ilustración de línea dorada por proyecto (`ProjectArt.astro`: red neuronal, caché, pedido, tienda, grafo, diana; campo `art`), cifra destacada «0,99 exactitud» en la 01 (campo `metric`), punto que parpadea ante el estado «En desarrollo», tarjeta enfocada (crece un 3 %; las demás al 82 % de opacidad mientras la fila se desliza) y contador «02 / 06» con línea de progreso dorada (visibles solo con la fila anclada). El foco y el contador siguen el progreso del desplazamiento: `índice = round(progreso × (n − 1))`. (3) *Tarjeta final* `ProjectMoreCard` «Ver más en GitHub» (`moreLabel`, `moreHref`). La mecánica de scroll vertical → fila lateral no cambió. (4) *Stack* (`SkillsStack`, opción A): título como placa oscura con cursor, siete tarjetas de cristal oscuro con el bisel dorado y un contador por categoría, en mosaico de 12 columnas (6/6, 4/4/4, 6/6; columnas de logos `n ≤ 4 ? n : ceil(n/2)`), baldosas claras de 3,2rem con el nombre debajo que se elevan y brillan al pasar el cursor, y entrada escalonada al llegar cada tarjeta a la pantalla (solo con script y movimiento). En ≤899px las tarjetas ocupan todo el ancho. Descartados a propósito por el usuario: cintas de logos y pestañas (se perdería contenido). Copias previas: `backups/*.pre-proyectos-pulido-2026-10-29`.

**Carrusel horizontal anclado (25 de octubre):** Proyectos es ahora una fila horizontal de seis tarjetas altas (`ProjectCard.astro`: arte a toda la tarjeta, número y tags arriba, título y texto sobre un degradado oscuro, flecha dorada; 5:7, ~360px a 1440px; seis tintes provisionales). Referencia: la sección de proyectos de heynesh.com (vídeo del usuario). En escritorio con movimiento, `ShowcaseSection` con `rail` ancla (pin) título, introducción y fila con GSAP ScrollTrigger y convierte el scroll vertical en deslizamiento lateral (`x` = −recorrido, 1 px de scroll = 1 px de desplazamiento, `scrub: 0.6`) hasta que la última tarjeta pasa el borde derecho; luego se libera y sigue el stack. Recorrido = ancho de la fila − (ancho de ventana − borde izquierdo del contenedor) + 32px; si el panel es más alto que la pantalla se ancla algo por encima (`top top-=exceso`) para que las tarjetas quepan. Las tarjetas se desvanecen a la izquierda con una máscara para no pasar por debajo del sidebar translúcido. Por debajo de 900px o con `prefers-reduced-motion` no se ancla: es una tira que se desliza con el dedo (`overflow-x: auto`, `scroll-snap`). `refreshPriority: -1` para que el Hero calcule antes su propio pin. Seis proyectos de relleno en `site.js` (ids 01–06, ES y EN). Copias previas en `backups/` (`*.pre-rail-2026-10-25`). Debajo siguen estando la cuadrícula original de tres columnas en Servicios y Tools (sin `rail`).

**Rediseño del 24 de octubre:** Proyectos usa el mismo formato que Servicios y Tools: `ShowcaseSection` (título gráfico con halo, introducción con la nota de «plantillas», `blend` desde el negro de Sobre mí) y tres `ShowcaseCard` (número, categoría, título, «Próximamente» como texto, tags, sin enlace: flecha atenuada). Debajo van «Mi stack de trabajo» ([SkillsStack.astro](../../../src/components/SkillsStack.astro), antes en Sobre mí) y no hay botón final (no existe página de proyectos). `ShowcaseSection` tiene ahora el CTA opcional y un slot `after`. Servicios dejó de usar `blend` (continúa el grafito de Proyectos). El eyebrow «Proyectos — en construcción» ya no se pinta (el contenido sigue en `site.js`). En el sidebar, «Proyectos» queda marcado también mientras se ve el stack. Antes: tres tarjetas numeradas 01–03 (Full-stack, Data Science, Visual/UI). Cada una muestra categoría, título provisional, tags y «Próximamente». La nota de la sección explica expresamente que son plantillas. La zona visual es un recuadro CSS con un número grande, **no** una fotografía ni una captura real. No hay enlace, filtro, modal, repositorio ni página de detalle — `ProjectItem` ni siquiera define esos campos en el tipo, así que no es solo contenido pendiente, es que el contrato de datos no los contempla todavía.

Actualmente usa el tema `.section-theme-dark` (se intercambió con About — ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]]).

## Servicios y Tools en portada — [ServicesSection.astro](../../../src/components/ServicesSection.astro) y [ToolsSection.astro](../../../src/components/ToolsSection.astro)

Desde el 23 de octubre son **dos secciones consecutivas e independientes** (`#services` y después `#tools`) construidas sobre dos componentes compartidos, con la auditoría en [[Auditoria-Servicios-Tools]]:

- [ShowcaseSection.astro](../../../src/components/ShowcaseSection.astro): la sección. Fondo grafito cálido #24221f con el grano de About; `blend` (solo Servicios) hace entrar el fondo desde el #050505 de Proyectos en `clamp(10rem, 20svh, 14rem)`, de modo que Servicios → Tools no tiene corte. Título gráfico con halo dorado (`SectionHeadingCard halo`), una introducción (slot `intro`), una rejilla de tres columnas (slot por defecto; una columna a ≤900px) y un CTA tipográfico a la página completa. Redefine las variables `--theme-*` con las de About.
- [ShowcaseCard.astro](../../../src/components/ShowcaseCard.astro): la tarjeta. Pastilla numérica y estado opcional arriba, hueco de imagen (placeholder punteado, `.sc-media`), título, texto, etiquetas y flecha dorada. Con `href` el título se extiende a toda la tarjeta; sin él es inerte y la flecha se atenúa.

Servicios genera sus tres tarjetas desde `services.page.articles` (las tres enlazan a `/servicios/`; no hay ancla por servicio). Tools genera las suyas desde `tools.page.items`: el conversor enlaza a su página y el comprobador de Instagram, sin `href`, queda inerte con el estado «En desarrollo» arriba a la derecha. La introducción es el texto de `servicesTools.services.description` (con segmentos `{ text, strong? }`, nunca HTML crudo) y `servicesTools.tools.description`. Las etiquetas pequeñas «Servicios» y «Tools» sobre el título se eliminaron. Ninguna de las dos lleva `.rd-reveal` (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]]).

El componente combinado `ServicesToolsSection.astro` ya no existe. Los datos siguen bajo `servicesTools` en `site.js` con `services.title`/`titleImage` y `tools.title`/`titleImage` (sin `servicesTools.title`); los contratos son `ServicesHomeSectionContent` y `ToolsHomeSectionContent`. Para añadir imágenes reales, ver la recomendación 2 de [[Auditoria-Servicios-Tools]].

## Servicios: página independiente — [ServicesPageContent.astro](../../../src/components/ServicesPageContent.astro)

Título, introducción, tres artículos con tags (automatización de procesos / páginas web comerciales y visuales / auditoría y asesoramiento técnico-visual) y una llamada a «Cuéntame tu proyecto» que lleva al formulario (ver [[Formularios]]). No hay tarifas, calculadora de presupuesto, pagos, agenda ni contratación automática — el texto sobre auditoría describe una propuesta de trabajo, no un sistema que la programe o la exija técnicamente.

## Tools: catálogo — [ToolsPageContent.astro](../../../src/components/ToolsPageContent.astro)

Dos tarjetas: «Conversor de vídeo a MP3/MP4» (estado Disponible, enlace real a su ruta) y «Comprobador de quién no te sigue en Instagram» (En desarrollo, sin `href`, renderiza un `span` con `aria-disabled="true"` — no contacta Instagram ni permite importar datos).

Dato clave para no confundirse al editar: es la existencia de `item.href` la que determina si el CTA es un enlace real, **no** el texto de `status`. Cambiar solo la palabra "En desarrollo" por "Disponible" no implementa nada — hace falta además añadir el `href`. El grid está pensado para tres columnas aunque hoy solo haya dos tarjetas.

## Contacto — [ContactSection.astro](../../../src/components/ContactSection.astro)

Rediseñada el 23 de octubre (ver [[Auditoria-Contacto]]): ya no es la sección clara. Mismo grafito #24221f y grano que About/Servicios/Tools, título gráfico con halo dorado (sin la etiqueta repetida), un párrafo de entrada y dos columnas desde 1100px (una por debajo): a la izquierda el formulario ([[Formularios]]) dentro de un panel de tarjeta; a la derecha los **canales directos**, con el correo (`mailto:jesusleonromero233@gmail.com`, que solo abre el gestor de correo del visitante: la web nunca lo envía por sí misma) y las filas de LinkedIn, GitHub y Redes Sociales con los logos dorados del sidebar. El fondo termina con un fundido a #050505, donde empieza FAQ. Sin `.rd-reveal`: visible sin JavaScript.

LinkedIn es un `span` deshabilitado y enfocable, sin URL, que explica «Enlace todavía no disponible» con un tooltip al pasar el ratón o al enfocar con teclado. **En el sidebar**, LinkedIn es solo texto deshabilitado sin ese tooltip: misma información, presentación distinta. GitHub y Linktree abren en otra pestaña con `rel="noopener noreferrer"`. Las filas se elevan y toman borde dorado al pasar el ratón, salvo LinkedIn.

## FAQ — [FaqSection.astro](../../../src/components/FaqSection.astro)

Cuatro preguntas (experiencia profesional, disponibilidad freelance, acceso al trabajo de diseño, mejor vía de contacto) usando `<details>/<summary>` nativos con signos +/−, permitiendo varias preguntas abiertas a la vez. La segunda respuesta es un placeholder; la cuarta menciona el formulario aunque este todavía no envíe nada real. La interacción de abrir/cerrar no necesita JS, pero la visibilidad **inicial** del bloque sí depende de `.rd-reveal` (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]]).

## Primitivas compartidas

Auditoría del 10 de octubre: ejemplo Tools con h3 tras h2, correo ajustado a 320px y contrastes locales de notas/prosa. Formularios aclaran su simulación antes de pedir datos. No se modificaron las primitivas, sidebar ni textos fuente. FAQ mantiene dos respuestas desactualizadas sobre Drive/formulario como propuesta de contenido. Evidencia y límites en [[Auditoria-Web]].

- [SectionHeadingCard.astro](../../../src/components/SectionHeadingCard.astro): título de sección. Permite h1/h2/h3, tamaños `lg`/`md` y clase opcional; valores por defecto h2/lg. La usan Proyectos, Servicios, Tools, Contacto y FAQ — About tiene su propio título y no la usa. Con la prop `image` (un `TitleImage`) muestra el título como imagen en lugar de la tarjeta de cristal (ver «Títulos gráficos»).
- [RollLink.astro](../../../src/components/RollLink.astro): enlace con duplicación visual de texto para efecto de rollover. Ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] para su comportamiento accesible.
- [SimpleNav.astro](../../../src/components/SimpleNav.astro): navegación sticky de las tres subpáginas. Ver [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]].
- [Layout.astro](../../../src/layouts/Layout.astro): documento HTML, tokens, reveals, clic central. Ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]] y [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]].

## Títulos gráficos (23 de octubre de 2026)

Proyectos, Servicios, Tools, Contacto y FAQ muestran su título como imagen WebP transparente (`public/assets/images/section-title-*-es.webp`, 2000×1145, aportadas por el usuario y sin modificar). `SectionHeadingCard` (con `halo` opcional: el resplandor dorado estático de About, usado en Servicios y Tools) oculta los márgenes transparentes solo con CSS (marco con `aspect-ratio` y `overflow: hidden`, el mismo método que el título de About) y dimensiona por **altura de letra**: `clamp(5rem, 10vw, 9rem)`, de modo que todas las palabras se ven a la misma escala (128px a 1280px de ancho, 80px en móvil) y el ancho sigue la proporción de cada una (`min(100%, altura × proporción)`), sin deformarse. Los datos (`titleImage` con `src`, `width`, `height` y `crop`) viven junto al título en `site.js` y su tipo es `TitleImage`. El texto del título sigue en el DOM como `h2` oculto visualmente (accesible); la imagen es decorativa (`alt=""`, `aria-hidden`). Sin `titleImage` (el inglés, que no tiene arte) se muestra la tarjeta de cristal con texto. Las páginas `/servicios/` y `/tools/` conservan su `h1` de texto.

## Componentes existentes pero sin montar en ninguna ruta

`ServicesTeaser.astro`, `ToolsTeaser.astro` y `ClosingStatement.astro` **no se importan** en ninguna ruta actual:

- [ServicesTeaser.astro](../../../src/components/ServicesTeaser.astro) y [ToolsTeaser.astro](../../../src/components/ToolsTeaser.astro): representarían Servicios y Tools como secciones **separadas**, cada una con su propio ID (`services`, `tools`). Montarlas junto a [ServicesSection.astro](../../../src/components/ServicesSection.astro) y [ToolsSection.astro](../../../src/components/ToolsSection.astro), que ya usan esos IDs, los duplicaría — no son un simple "añadir de vuelta", requieren decidir cuál de los dos esquemas se usa.
- [ClosingStatement.astro](../../../src/components/ClosingStatement.astro): `closing.text` y `closing.signature` siguen existiendo en `site.js`, pero no hay cierre ni footer después de FAQ en ninguna ruta actual.

## Relacionado

[[Contenido-por-Seccion]] · [[Formularios]] · [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[Hallazgos-y-Pendientes]]
