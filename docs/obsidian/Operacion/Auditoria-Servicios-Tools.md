---
tags: [operacion, auditoria, servicios, tools, diseno, transiciones]
actualizado: 2026-10-23
fuente: [src/components/ShowcaseSection.astro, src/components/ShowcaseCard.astro, src/components/ServicesSection.astro, src/components/ToolsSection.astro, comprobaciones locales]
---

# Auditoría visual de Servicios y Tools — 23 de octubre de 2026

Objetivo: que `#services` y `#tools` sean coherentes con el nav, el Hero y Sobre mí (ya terminados), que sus transiciones con Proyectos y Contacto sean limpias, y que presenten cada servicio y cada herramienta como tarjeta con imagen (placeholder), según la referencia de heynesh.com. Alcance: solo estas dos secciones y los componentes que consumen; Hero, About, Layout y datos hero/about/nav no se tocaron.

## Hallazgos y decisión

| # | Estado previo (medido) | Decisión aplicada |
|---|---|---|
| 1 | Cada sección usaba el degradado oscuro genérico `#050505 → #1b1b1f → #050505`: dos bandas claras seguidas, con una paleta distinta de la de Sobre mí (grafito cálido #24221f, grano, halo dorado) | Mismo fondo que About: grafito #24221f con el grano de 0,8 %. Servicios entra con un fundido desde el #050505 de Proyectos (`clamp(10rem, 20svh, 14rem)`, la misma curva que About); Tools continúa el mismo grafito, así que no hay corte entre ambas |
| 2 | Etiquetas «SERVICIOS» y «TOOLS» bajo el título gráfico, repetidas | Eliminadas (confirmado por el usuario). Proyectos, Contacto y FAQ conservan su etiqueta |
| 3 | Texto largo + una sola tarjeta de ejemplo para Tools: una composición distinta de la rejilla de tarjetas de Proyectos | Rejilla de tarjetas: tres servicios (de `services.page.articles`) y las dos herramientas del catálogo (de `tools.page.items`) |
| 4 | Título gráfico sin el halo que acompaña al de About | Halo dorado estático opcional en `SectionHeadingCard` (`halo`), con la receta de About (15 % / 6 % / transparente) |
| 5 | Variables `--theme-*` oscuras genéricas (blanco/gris cálido) distintas de las de About | Se igualan a las de About: texto #f3f4f5, secundario #adb2b6, borde `rgb(196 204 209 / 18%)`, superficie `rgb(255 255 255 / 4%)` |

## Transiciones (medidas en 1280×800)

| Frontera | Resultado |
|---|---|
| Sobre mí → Proyectos | **Corte seco** #24221f → #050505 (preexistente, no tocado: Proyectos queda fuera de esta ronda) |
| Proyectos → Servicios | Ambos terminan/empiezan en #050505; el grafito aparece gradualmente: sin corte |
| Servicios → Tools | Mismo grafito: sin corte; la separación son los dos paddings de sección (≈205px) y el título gráfico |
| Tools → Contacto | Medido el 23 de octubre al redactar esta auditoría: corte seco grafito → beige. **Resuelto después**: Contacto pasó al grafito y ya no hay corte (ver [[Auditoria-Contacto]]) |

## Tarjeta (`ShowcaseCard`) y sección (`ShowcaseSection`)

- Estructura: pastilla numérica (`01`, `02`…) y estado opcional arriba; hueco de imagen (placeholder punteado con lavado dorado, como Proyectos); título, texto y etiquetas; flecha dorada metálica abajo a la derecha (misma paleta que los botones del nav: #dfc357 / #c19b3d / #b08a32, borde #efd683).
- **Etiquetas abajo, no arriba a la derecha** como en la referencia: con tarjetas de ~256px las etiquetas españolas se partían en 2–3 filas según la tarjeta y desalineaban los huecos de imagen. Así los huecos empiezan a la misma altura (65px) en todas.
- Enlace: con `href`, el enlace del título se extiende (`::after`) a toda la tarjeta; sin `href` (comprobador de Instagram) la tarjeta es inerte y la flecha queda atenuada. Servicios enlaza las tres a `/servicios/` (no hay ancla por servicio). El CTA tipográfico «Ir a la página de…» se conserva bajo la rejilla.
- Foco por teclado: contorno dorado de 2px alrededor de la tarjeta (`:has(.sc-link:focus-visible)`). Hover: elevación de 6px y borde dorado, solo en tarjetas enlazadas. Sin `.rd-reveal`: visibles sin JavaScript.
- Rejilla de tres columnas; a ≤900px, una (alto mínimo 26rem en escritorio, 22rem en estrecho). Tools muestra dos tarjetas en la rejilla de tres: la tercera columna queda vacía hasta que haya más herramientas.
- El párrafo largo de cada sección se conserva como introducción (anchura 46rem); no se ha reescrito ningún texto.

## Pendientes y recomendaciones (sin aplicar)

1. **Proyectos** usa todavía su tarjeta antigua (`rd-project-card`, visual de 160px, etiquetas abajo) y fondo negro plano entre dos secciones de grafito. Recomendado: migrarlo a `ShowcaseCard` y `ShowcaseSection` (tres tarjetas, cambio pequeño) y resolver el corte con Sobre mí. Es una decisión visual del usuario.
2. **Imágenes reales:** el hueco es `.sc-media`; `ServiceArticle` y `ToolItem` no tienen campo de imagen. Al llegar los recursos, añadir `image?: { src, alt, width, height }` al contrato y sustituir el hueco por `<img>`.
3. Reducir los dos párrafos introductorios (7 y 5 líneas) cuando se actualice el contenido.
4. Contacto ya se rediseñó ([[Auditoria-Contacto]]) y perdió su etiqueta; FAQ la conserva: aplicar el mismo criterio si se desea.
5. Títulos gráficos y tarjetas sin versión inglesa (usa la tarjeta de texto).

## Verificación

- `npm run check`: 47 archivos, 0 errores, 0 avisos, 126 hints. `npm run build`: cuatro páginas, código 0. HTML: `home > about > projects > services > tools > contact > faq`, 5 tarjetas (3 enlazan a `/servicios/`, 1 al conversor, 1 inerte).
- Navegador, compilación de producción (la vista previa de `dist/` ya activa en 4322): 1280, 768, 390 y 320px sin desbordamiento; tarjetas de 256px en escritorio y del ancho de la columna en el resto; título a 80px (≤768) y 128px (1280). Capturas revisadas de las fronteras Proyectos → Servicios y Tools → Contacto.
- **Servidor de desarrollo del usuario (4321):** sirvió el marcado nuevo pero con el CSS de los componentes desfasado (ya ocurrió antes). Reiniciar `npm run dev` para ver los estilos finales; se verificó sobre la compilación de producción.
- Límites: el panel del navegador se ocultó durante la ronda, así que no se repitió la comprobación del enlace activo del sidebar tras este cambio (los ids `#services`/`#tools` y la lógica no cambian; se verificó tras la separación). El foco por teclado y la presencia del hover se comprobaron en el CSS compilado, no con pulsaciones reales. No se probó movimiento reducido ni lector de pantalla.

## Relacionado

[[Otras-Secciones-y-Compartidos]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[Hero-y-Sidebar]] · [[Hallazgos-y-Pendientes]] · [[Auditoria-Sobre-Mi]]
