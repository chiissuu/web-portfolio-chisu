---
tags: [componente, proyectos, servicios, tools, contacto, faq, compartidos]
actualizado: 2026-10-06
fuente: [src/components]
---

# Otras secciones y componentes compartidos

Componentes más simples que Hero/About/Formularios/Conversor — aquí se agrupan por no justificar cada uno su propia nota. Para el texto real que muestran, ver [[Contenido-por-Seccion]].

## Proyectos — [ProjectsSection.astro](../../../src/components/ProjectsSection.astro)

Tres tarjetas numeradas 01–03 (Full-stack, Data Science, Visual/UI). Cada una muestra categoría, título provisional, tags y «Próximamente». La nota de la sección explica expresamente que son plantillas. La zona visual es un recuadro CSS con un número grande, **no** una fotografía ni una captura real. No hay enlace, filtro, modal, repositorio ni página de detalle — `ProjectItem` ni siquiera define esos campos en el tipo, así que no es solo contenido pendiente, es que el contrato de datos no los contempla todavía.

Actualmente usa el tema `.section-theme-dark` (se intercambió con About — ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]]).

## Servicios/Tools en portada — [ServicesToolsSection.astro](../../../src/components/ServicesToolsSection.astro)

Sección oscura con dos columnas y un separador central. La columna de Servicios usa segmentos de texto `{ text, strong? }` que se convierten en texto plano o en `<strong>` — nunca se inserta HTML crudo. La columna de Tools muestra como ejemplo `tools.page.items[0]`: ese ejemplo cambia automáticamente si se reordena la colección de herramientas, y su tarjeta de ejemplo no abre directamente el conversor al hacer clic. Los dos CTA llevan a las páginas completas de Servicios y Tools respectivamente. Si la lista de herramientas quedara vacía, el ejemplo desaparece pero los textos y el enlace de la columna permanecen.

No lleva la clase `.rd-reveal` en su bloque actual (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]]).

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

- [SectionHeadingCard.astro](../../../src/components/SectionHeadingCard.astro): título sobre un acabado de cristal. Permite h1/h2/h3, tamaños `lg`/`md` y clase opcional; valores por defecto h2/lg. La usan Proyectos, Servicios/Tools, Contacto y FAQ — About tiene su propio título y no la usa.
- [RollLink.astro](../../../src/components/RollLink.astro): enlace con duplicación visual de texto para efecto de rollover. Ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] para su comportamiento accesible.
- [SimpleNav.astro](../../../src/components/SimpleNav.astro): navegación sticky de las tres subpáginas. Ver [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]].
- [Layout.astro](../../../src/layouts/Layout.astro): documento HTML, tokens, reveals, clic central. Ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]] y [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]].

## Componentes existentes pero sin montar en ninguna ruta

`ServicesTeaser.astro`, `ToolsTeaser.astro` y `ClosingStatement.astro` **no se importan** en ninguna ruta actual:

- [ServicesTeaser.astro](../../../src/components/ServicesTeaser.astro) y [ToolsTeaser.astro](../../../src/components/ToolsTeaser.astro): representarían Servicios y Tools como secciones **separadas**, cada una con su propio ID (`services`, `tools`). Montarlas junto al bloque combinado actual ([ServicesToolsSection.astro](../../../src/components/ServicesToolsSection.astro)) duplicaría esos IDs — no son un simple "añadir de vuelta", requieren decidir cuál de los dos esquemas se usa.
- [ClosingStatement.astro](../../../src/components/ClosingStatement.astro): `closing.text` y `closing.signature` siguen existiendo en `site.js`, pero no hay cierre ni footer después de FAQ en ninguna ruta actual.

## Relacionado

[[Contenido-por-Seccion]] · [[Formularios]] · [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[Hallazgos-y-Pendientes]]
