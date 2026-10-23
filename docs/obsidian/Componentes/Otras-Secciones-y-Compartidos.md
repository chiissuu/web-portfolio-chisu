---
tags: [componente, proyectos, servicios, tools, contacto, faq, compartidos]
actualizado: 2026-10-23
fuente: [src/components]
---

# Otras secciones y componentes compartidos

Componentes más simples que Hero/About/Formularios/Conversor — aquí se agrupan por no justificar cada uno su propia nota. Para el texto real que muestran, ver [[Contenido-por-Seccion]].

## Proyectos — [ProjectsSection.astro](../../../src/components/ProjectsSection.astro)

Tres tarjetas numeradas 01–03 (Full-stack, Data Science, Visual/UI). Cada una muestra categoría, título provisional, tags y «Próximamente». La nota de la sección explica expresamente que son plantillas. La zona visual es un recuadro CSS con un número grande, **no** una fotografía ni una captura real. No hay enlace, filtro, modal, repositorio ni página de detalle — `ProjectItem` ni siquiera define esos campos en el tipo, así que no es solo contenido pendiente, es que el contrato de datos no los contempla todavía.

Actualmente usa el tema `.section-theme-dark` (se intercambió con About — ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]]).

## Servicios y Tools en portada — [ServicesSection.astro](../../../src/components/ServicesSection.astro) y [ToolsSection.astro](../../../src/components/ToolsSection.astro)

Desde el 23 de octubre son **dos secciones oscuras consecutivas e independientes**: `#services` y después `#tools`. Cada una tiene su título gráfico (ver «Títulos gráficos» abajo), una etiqueta, su descripción y un CTA tipográfico a la página completa, en una columna de hasta 46rem. El contenido es el mismo de la antigua sección combinada, trasladado sin cambios (se actualizará en una tarea posterior): las etiquetas «Servicios» y «Tools» repiten por ahora el título gráfico.

Servicios usa segmentos de texto `{ text, strong? }` que se convierten en texto plano o en `<strong>` — nunca se inserta HTML crudo. Tools muestra como ejemplo `tools.page.items[0]`: ese ejemplo cambia automáticamente si se reordena la colección de herramientas, y su tarjeta no abre directamente el conversor al hacer clic. Si la lista de herramientas quedara vacía, el ejemplo desaparece pero los textos y el enlace permanecen.

Ninguna lleva `.rd-reveal` (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]]). El componente combinado `ServicesToolsSection.astro` se eliminó. Los datos siguen bajo `servicesTools` en `site.js`, ahora con `services.title`/`titleImage` y `tools.title`/`titleImage` y sin `servicesTools.title`; los contratos son `ServicesHomeSectionContent` y `ToolsHomeSectionContent`.

## Servicios: página independiente — [ServicesPageContent.astro](../../../src/components/ServicesPageContent.astro)

Título, introducción, tres artículos con tags (automatización de procesos / páginas web comerciales y visuales / auditoría y asesoramiento técnico-visual) y una llamada a «Cuéntame tu proyecto» que lleva al formulario (ver [[Formularios]]). No hay tarifas, calculadora de presupuesto, pagos, agenda ni contratación automática — el texto sobre auditoría describe una propuesta de trabajo, no un sistema que la programe o la exija técnicamente.

## Tools: catálogo — [ToolsPageContent.astro](../../../src/components/ToolsPageContent.astro)

Dos tarjetas: «Conversor de vídeo a MP3/MP4» (estado Disponible, enlace real a su ruta) y «Comprobador de quién no te sigue en Instagram» (En desarrollo, sin `href`, renderiza un `span` con `aria-disabled="true"` — no contacta Instagram ni permite importar datos).

Dato clave para no confundirse al editar: es la existencia de `item.href` la que determina si el CTA es un enlace real, **no** el texto de `status`. Cambiar solo la palabra "En desarrollo" por "Disponible" no implementa nada — hace falta además añadir el `href`. El grid está pensado para tres columnas aunque hoy solo haya dos tarjetas.

## Contacto — [ContactSection.astro](../../../src/components/ContactSection.astro)

Tarjetas de LinkedIn (deshabilitado), GitHub, y «Redes Sociales» (Linktree), texto de disponibilidad, el formulario de contacto (ver [[Formularios]]) y un enlace `mailto:jesusleonromero233@gmail.com` — ese enlace solo abre el gestor de correo del visitante; la web nunca envía ese correo por sí misma.

LinkedIn es enfocable y explica «Enlace todavía no disponible» mediante tooltip al pasar el ratón o al enfocar con teclado. **En el sidebar**, en cambio, LinkedIn es solo texto deshabilitado sin ese tooltip — misma información, presentación distinta según dónde aparece. GitHub y Linktree abren en otra pestaña con `rel="noopener noreferrer"`.

## FAQ — [FaqSection.astro](../../../src/components/FaqSection.astro)

Cuatro preguntas (experiencia profesional, disponibilidad freelance, acceso al trabajo de diseño, mejor vía de contacto) usando `<details>/<summary>` nativos con signos +/−, permitiendo varias preguntas abiertas a la vez. La segunda respuesta es un placeholder; la cuarta menciona el formulario aunque este todavía no envíe nada real. La interacción de abrir/cerrar no necesita JS, pero la visibilidad **inicial** del bloque sí depende de `.rd-reveal` (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]]).

## Primitivas compartidas

Auditoría del 10 de octubre: ejemplo Tools con h3 tras h2, correo ajustado a 320px y contrastes locales de notas/prosa. Formularios aclaran su simulación antes de pedir datos. No se modificaron las primitivas, sidebar ni textos fuente. FAQ mantiene dos respuestas desactualizadas sobre Drive/formulario como propuesta de contenido. Evidencia y límites en [[Auditoria-Web]].

- [SectionHeadingCard.astro](../../../src/components/SectionHeadingCard.astro): título de sección. Permite h1/h2/h3, tamaños `lg`/`md` y clase opcional; valores por defecto h2/lg. La usan Proyectos, Servicios, Tools, Contacto y FAQ — About tiene su propio título y no la usa. Con la prop `image` (un `TitleImage`) muestra el título como imagen en lugar de la tarjeta de cristal (ver «Títulos gráficos»).
- [RollLink.astro](../../../src/components/RollLink.astro): enlace con duplicación visual de texto para efecto de rollover. Ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] para su comportamiento accesible.
- [SimpleNav.astro](../../../src/components/SimpleNav.astro): navegación sticky de las tres subpáginas. Ver [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]].
- [Layout.astro](../../../src/layouts/Layout.astro): documento HTML, tokens, reveals, clic central. Ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]] y [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]].

## Títulos gráficos (23 de octubre de 2026)

Proyectos, Servicios, Tools, Contacto y FAQ muestran su título como imagen WebP transparente (`public/assets/images/section-title-*-es.webp`, 2000×1145, aportadas por el usuario y sin modificar). `SectionHeadingCard` oculta los márgenes transparentes solo con CSS (marco con `aspect-ratio` y `overflow: hidden`, el mismo método que el título de About) y dimensiona por **altura de letra**: `clamp(5rem, 10vw, 9rem)`, de modo que todas las palabras se ven a la misma escala (128px a 1280px de ancho, 80px en móvil) y el ancho sigue la proporción de cada una (`min(100%, altura × proporción)`), sin deformarse. Los datos (`titleImage` con `src`, `width`, `height` y `crop`) viven junto al título en `site.js` y su tipo es `TitleImage`. El texto del título sigue en el DOM como `h2` oculto visualmente (accesible); la imagen es decorativa (`alt=""`, `aria-hidden`). Sin `titleImage` (el inglés, que no tiene arte) se muestra la tarjeta de cristal con texto. Las páginas `/servicios/` y `/tools/` conservan su `h1` de texto.

## Componentes existentes pero sin montar en ninguna ruta

`ServicesTeaser.astro`, `ToolsTeaser.astro` y `ClosingStatement.astro` **no se importan** en ninguna ruta actual:

- [ServicesTeaser.astro](../../../src/components/ServicesTeaser.astro) y [ToolsTeaser.astro](../../../src/components/ToolsTeaser.astro): representarían Servicios y Tools como secciones **separadas**, cada una con su propio ID (`services`, `tools`). Montarlas junto a [ServicesSection.astro](../../../src/components/ServicesSection.astro) y [ToolsSection.astro](../../../src/components/ToolsSection.astro), que ya usan esos IDs, los duplicaría — no son un simple "añadir de vuelta", requieren decidir cuál de los dos esquemas se usa.
- [ClosingStatement.astro](../../../src/components/ClosingStatement.astro): `closing.text` y `closing.signature` siguen existiendo en `site.js`, pero no hay cierre ni footer después de FAQ en ninguna ruta actual.

## Relacionado

[[Contenido-por-Seccion]] · [[Formularios]] · [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[Hallazgos-y-Pendientes]]
