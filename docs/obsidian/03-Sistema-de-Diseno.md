---
tags: [diseno, css, tokens, responsive]
aliases: [Sistema-de-Diseno]
actualizado: 2026-10-07
fuente: [src/layouts/Layout.astro]
---

# Sistema de diseño

Fuente principal: [Layout.astro](../../src/layouts/Layout.astro). CSS nativo global más estilos scoped por componente, y un CSS Module para la parte React del conversor. No hay Tailwind, Sass ni librería de componentes declarada.

## Tokens

- Primitivas: `--p-*`
- Semánticos: `--color-*`
- Temas de sección: `--theme-*` — el mecanismo clave que permite que un mismo componente (botones, bordes, texto) funcione igual sobre fondo claro u oscuro sin lógica condicional; solo cambia qué tema CSS envuelve a la sección. Esto es lo que permitió intercambiar About y Proyectos entre warm/dark sin tocar [[Hero-y-Sidebar]].
- Artículos del sidebar: `--art-*`
- Acentos locales del Hero: `--hx-ui-*`
- Acentos locales de About: `--ab-accent` y `--ab-tone` (gris `#c9c9c9`)

Colores base: fondo warm `#d5cfbe`, tinta `#1a1919`, dorado `#e0c58b`, dorado oscuro `#8a6420`. Tema dark: degradado `#050505 → #1b1b1f → #050505`.

## Orden actual de temas por sección

Hero (gráfico dorado sobre fondo estructural oscuro) → About (carbón, clase dark con textura desaturada del Hero que se desvanece) → Proyectos (dark plano, `--section-dark-start`) → Servicios/Tools (dark con degradado) → Contacto (warm) → FAQ (dark). No hay alternancia estricta entre todas las secciones.

About usa texto blanco y gris y superficies neutras. Su estado de navegación activa aplica `data-palette="mono"` al sidebar: logo gris oscuro y acentos/botones grises; las demás secciones conservan la paleta dorada. Esta paleta es independiente del tema warm/dark que cada artículo detecta por solapamiento.

La introducción de About tiene un título de hasta 4.6rem y biografía de hasta 1.35rem, centrada y limitada a 60ch. Sus cuatro escenas comparten columna de texto y gráfico compacto alineado arriba, alternando lados desde 1280px. Los encabezados usan iconos Lucide monocromos; proyectos, pipeline, triángulo y conceptos conservan la misma paleta neutral. Ver [[Sobre-Mi]] para la estructura y las excepciones responsive.

## Layout de contenido

`.section-inner` limita y espacia el contenido; la sección exterior pinta todo el ancho. En escritorio, **solo** `body.redesign-home .section-inner` reserva espacio para sidebar + gap. Ancho del sidebar: `clamp(15.5rem, 22vw, 19.5rem)`; gap: `clamp(2.5rem, 3vw, 4rem)`. Mover el fondo exterior en lugar del contenido dejaría sin pintar la franja detrás del sidebar — es una trampa fácil si se "simplifica" el CSS sin entender esto.

`SectionHeadingCard` (ver [[Otras-Secciones-y-Compartidos]]) permite h1/h2/h3, tamaños lg/md y clase opcional (por defecto h2/lg). La usan Proyectos, Servicios/Tools, Contacto y FAQ; About tiene título propio. `.glass-panel`, `.hx-glass` y `.hx-frosted-card` son acabados **distintos** entre sí — no intercambiables aunque suenen parecido.

## Fuentes

Remotas (Google Fonts): Space Grotesk, Archivo Black, Inter Tight, Inter, JetBrains Mono. Editorial local: `PPNeueMontreal-Book.woff2` (27.516 bytes, con fallback a Inter/Arial) — el archivo sí existe en `public/assets/fonts/`, pese a algún comentario histórico que decía lo contrario.

## Breakpoints y CSS generado

| Condición | Comportamiento |
|---|---|
| ≥900px | Hero con posibilidad de morph/sidebar; compensación de contenido; About respeta la reserva del sidebar; sin indicador lateral de lectura y escenas en dos columnas desde 1280px |
| 900–1599px | Tamaños específicos de título, tarjetas y retrato |
| 900–1399px | Ajustes adicionales de offsets y títulos; deben seguir al bloque general de escritorio |
| ≥1600px | Retrato y títulos mayores |
| ≥900px y altura ≤950px | Sidebar más compacto |
| ≥900px y altura ≤850px | Compactación adicional; enlaces de nav de 36px y CTA de 42px |
| ≤899px | Menú móvil; sidebar y nav superior ocultos; About en una columna y sin rail |
| 641–899px | Reglas de retrato normal/estático que **no sobreviven al build** — ver hallazgo abajo |
| ≤900px | Proyectos, artículos de Servicios y catálogo de Tools a una columna; Servicios/Tools se apila |
| ≤700px | Lista de SimpleNav oculta; FAQ, tarjetas de Contacto y formularios a una columna |
| ≤640px | Hero móvil específico; diagramas y bento de About se simplifican |
| ≤560px | Metadatos y ajustes del conversor a una columna |

A exactamente 900px coexisten sidebar de escritorio y algunos grids de una columna — no hay un único valor universal de breakpoint.

### Bug conocido: regla de retrato tablet ausente en el CSS compilado

Cerca de las líneas 1633–1727 de [HeroExperience.astro](../../src/components/HeroExperience.astro) hay un comentario que empieza con «Small-tablet portrait», otro inicio `/*` antes de cerrar el primero, y un texto suelto `CORRECTED: real-browser measurement`. El bloque de 641–899px queda precedido por ese comentario mal delimitado. En el CSS generado están los ajustes 900–1399 (`17.875rem`, `276.598`), pero **no** aparecen `185svh` ni `1900px` del retrato tablet. El build termina sin error — compilar no prueba que toda regla llegue a la salida.

Corrección mínima propuesta (no aplicada): reparar los delimitadores del comentario y verificar después el CSS y la vista 768×1024. Ver [[Hallazgos-y-Pendientes]].

## Relacionado

[[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] · [[Hero-y-Sidebar]] · [[Sobre-Mi]] · [[Hallazgos-y-Pendientes]]
