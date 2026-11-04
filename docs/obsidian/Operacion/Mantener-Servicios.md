---
tags: [operacion, mantenimiento, servicios]
actualizado: 2026-10-31
fuente: [src/content/site.js, src/lib/content-types.ts, src/components/ServicesSection.astro, src/components/ServicesBridge.astro, src/components/ServicesProcess.astro, src/components/ServiceArt.astro, src/components/ShowcaseCard.astro]
---

# Mantener la sección Servicios

Servicios es la sección oscura («plano») entre Proyectos y Tools. Desde el 31 de octubre de 2026 tiene: transición «la luz entra en el plano» desde el stack, título e introducción centrados, tres tarjetas con ilustración, la franja «Cómo trabajo» y un cierre que lleva a Contacto. Todo el contenido sale de [site.js](../../../src/content/site.js) (ES y EN).

> Git lo ejecuta siempre el usuario: esta nota no incluye ni ejecuta comandos de Git.

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| Introducción corta (con negritas) | `servicesTools.services.description` (segmentos `{ text, strong? }`) |
| Texto del enlace de cierre | `servicesTools.services.ctaLabel` (va a `#contact`) |
| Franja «Cómo trabajo» | `servicesTools.services.process` (`title` y `steps[]` con `title` y `text`) |
| Tarjetas | `services.page.articles[]` (`title`, `text`, `tags`, `art`) — el mismo array alimenta la página `/servicios` que hoy no está montada |
| Ilustración de cada tarjeta | campo `art`: `flow`, `web` o `audit` (dibujos en [ServiceArt.astro](../../../src/components/ServiceArt.astro)) |

## Añadir, quitar o editar

- **Tarjeta**: añadir o quitar un objeto en `articles` en **los dos idiomas**. Si no lleva `art` (o es un valor desconocido) la tarjeta muestra el hueco discontinuo de siempre. La rejilla es de 3 columnas: con 4 o más tarjetas se pasan a una segunda fila (el diseño está pensado para tres).
- **Paso de «Cómo trabajo»**: añadir o quitar un objeto en `process.steps`. La rejilla, la línea de luz y el encendido de los rombos se recalculan solos (`--sp-n`). Pensado para 3 a 5 pasos; con más, las columnas quedan muy estrechas.
- **Ilustración nueva**: añadir un bloque `{kind === "nombre" && (...)}` en `ServiceArt.astro` (viewBox 200×130, trazos `currentColor`, relleno de nodos `#0f0e0a`) y usar `art: "nombre"` (el tipo es `string`).
- **Enlace de cierre**: hoy va a `#contact` porque la ruta `/servicios` no existe en esta rama. Si se monta esa página, cambiar `ctaHref` en [ServicesSection.astro](../../../src/components/ServicesSection.astro).

## Cómo funciona la transición (para no romperla)

- [ServicesBridge.astro](../../../src/components/ServicesBridge.astro) va en el slot `bridge` de `ShowcaseSection`. Solo se activa con `(min-width: 1200px)` y sin «reducir movimiento»; por debajo, Servicios es estático.
- Todo corre por TIEMPO desde un ScrollTrigger sobre `.pt-board` (`start: "bottom 62%"`, `refreshPriority: -4`): hilos desde la placa (1,2 s) → rombos dorados → línea de escáner (`--sb-p`, 2,8 s) que ilumina los raíles laterales y **descubre con `clip-path`** el título, la introducción, las tarjetas, la franja y el cierre (cada uno con su `--rt`, su distancia al borde superior, medida). Al terminar se quita el recorte (`sb-revealed`).
- Los raíles laterales y el ancho del contenido se miden de la placa del stack (`INSET = 16`, hueco de `1.5rem`): el contenido se estrecha con `padding` para quedar entre los raíles. Por eso el ancho de las tarjetas depende del ancho de la ventana (≈230px a 1280, ≈270px a 1440).
- Servicios no tiene ola: empieza en una regla dorada recta con escala graduada (`edge="flat"`; ver [[Comandos-y-Pruebas]]). Las marcas de registro y los rombos de entrada están sobre la regla (`--ny: 0`).
- La rejilla del plano empieza bajo la cabecera y el primer pulso se oculta (`#services .bd-grid`, `.bd-pulse` fila 1) para que no haya una línea cruzando bajo el título.
- Las propiedades CSS animadas (`--c`, `--so`, `--sb-p`) llevan un `gsap.set` inicial; si no, GSAP las lee como 0.

## Comprobación

1. `npm run check` y `npm run build`.
2. Escritorio ≥1200px: la luz baja desde la placa, los rombos se encienden, el escáner descubre título y contenido a la vez, los raíles llegan a los rombos del cierre y estos se encienden.
3. 900–1199px: Servicios estático, centrado, sin raíles. ≤999px: «Cómo trabajo» en lista vertical.
4. Móvil: sin desbordamiento horizontal.

## Relacionado

[[Comandos-y-Pruebas]] · [[Mantener-Proyectos]] · [[Contenido-por-Seccion]] · [[Otras-Secciones-y-Compartidos]]
