---
tags: [diseno, css, tokens, responsive]
aliases: [Sistema-de-Diseno]
actualizado: 2026-10-23
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
- Acentos locales de About: `--ab-accent` (dorado compartido `var(--color-brand-gold)`, `#e0c58b`) y `--ab-copy` (gris `#d4d6d8`)

Colores base: fondo warm `#d5cfbe`, tinta `#1a1919`, dorado `#e0c58b`, dorado oscuro `#8a6420`. Tema dark: degradado `#050505 → #1b1b1f → #050505`.

## Orden actual de temas por sección

Hero (gráfico dorado sobre fondo estructural oscuro) → About (grafito cálido #24221f, textura suave y halo dorado estático detrás del título) → Proyectos (dark plano, `--section-dark-start`) → Servicios (grafito cálido #24221f, con fundido de entrada desde #050505) → Tools (el mismo grafito) → Contacto (el mismo grafito, con fundido final a #050505) → FAQ (dark con degradado). Servicios, Tools y Contacto reutilizan la receta de fondo de About (grafito, grano de 0,8 % y `--theme-*` de About), por lo que entre Proyectos y Servicios, entre Servicios y Tools, entre Tools y Contacto, y entre Contacto y FAQ (que Contacto enlaza con un fundido final a #050505) no hay corte. Ya no queda ninguna sección clara en la portada; el único corte seco es Sobre mí → Proyectos (#24221f → #050505). Ver [[Auditoria-Servicios-Tools]] y [[Auditoria-Contacto]]. No hay alternancia estricta entre todas las secciones. About conserva una transición corta desde #050505 en su unión con el Hero; después mantiene el mismo grafito hasta el final del stack.

About combina fondo carbón y lectura blanca/gris con la identidad dorada del Hero. El sidebar conserva `data-palette="brand"` en todas las secciones; no se desatura el logo ni se cambian sus botones a plata al entrar en About. El tema warm/dark sigue funcionando por artículo, independiente del acabado dorado. Sus cuatro cajas tienen un bisel dorado de 2px pintado sin alterar el layout. El enlace activo se ilumina con un haz lateral estático; el hundimiento se reserva para la pulsación real.

About conserva el título PNG dorado original de hasta 40rem, su h2 accesible y recorte CSS; se retiró únicamente el filtro que lo desaturaba. Bajo el cartel, la biografía es un **hilo dorado** de hasta 62rem: siete tarjetas que alternan izquierda y derecha unidas por un hilo SVG que se dibuja con el scroll (carril lateral en móvil), con los dos rótulos de grupo centrados sobre el hilo. Inter 400/600 sirve a los siete párrafos literales con una sola escala (hasta 1.08rem e interlineado 1.7); Space Grotesk sirve a rótulos y cierre. Se conservan enlaces subrayados, banderas y emojis discretos en gris; Madrid tiene texto sólido. El stack sigue secundario, con siete filas y 42 herramientas: icono de 28px y nombre juntos, listas flexibles y dos columnas a ≤640px. Solo el PNG mantiene `rd-reveal`; biografía y stack son visibles sin scripts. Ver [[Sobre-Mi]], [[Auditoria-Sobre-Mi]] y [[Logos-Stack]].

## Layout de contenido

`.section-inner` limita y espacia el contenido; la sección exterior pinta todo el ancho. En escritorio, **solo** `body.redesign-home .section-inner` reserva espacio para sidebar + gap. Ancho del sidebar: `clamp(15.5rem, 22vw, 19.5rem)`; gap: `clamp(2.5rem, 3vw, 4rem)`. Mover el fondo exterior en lugar del contenido dejaría sin pintar la franja detrás del sidebar — es una trampa fácil si se "simplifica" el CSS sin entender esto.

Excepción local de About a ≥1200px: centra `.ab-body` entre el borde visible del nav y el borde derecho de la página, con padding simétrico. Usa `--hx-sidebar-padding-inline: clamp(1.25rem, 2.5vw, 2rem)`, compartido con el padding real del sidebar, para descontar su franja transparente. El menú mantiene sus dimensiones. Ver [[Sobre-Mi]] para el límite de ancho interior.

`SectionHeadingCard` (ver [[Otras-Secciones-y-Compartidos]]) permite h1/h2/h3, tamaños lg/md y clase opcional (por defecto h2/lg). La usan Proyectos, Servicios, Tools, Contacto y FAQ; About tiene título propio. En español las cinco muestran un título gráfico WebP en lugar de la tarjeta de cristal (altura de letra común `clamp(5rem, 10vw, 9rem)`; ver [[Otras-Secciones-y-Compartidos]]). `.glass-panel`, `.hx-glass` y `.hx-frosted-card` son acabados **distintos** entre sí — no intercambiables aunque suenen parecido.

## Fuentes

Remotas (Google Fonts): Space Grotesk, Archivo Black, Inter Tight, Inter, JetBrains Mono. Editorial local: `PPNeueMontreal-Book.woff2` (27.516 bytes, con fallback a Inter/Arial) — el archivo sí existe en `public/assets/fonts/`, pese a algún comentario histórico que decía lo contrario.

Excepción de About: su biografía usa Inter, con pesos reales 400, 500 y 600 ya disponibles, para diferenciar cuerpo y énfasis. Las demás secciones conservan `--font-editorial`.

La prueba de Milesdane Trial se retiró del render el 2026-10-23 para unificar la lectura y evitar su marca en «2». El OTF y su aviso de licencia permanecen archivados junto a las fuentes; no hay un `@font-face` activo ni solicitud de ese archivo. La biografía usa los pesos reales de Inter ya cargados. No se añaden fuentes, dependencias ni solicitudes externas nuevas.

## Breakpoints y CSS generado

| Condición | Comportamiento |
|---|---|
| ≥900px | Hero con posibilidad de morph/sidebar y compensación de contenido; About respeta la reserva del sidebar; desde 1200px, sus h3 quedan a la izquierda de la prosa |
| 900–1599px | Tamaños específicos de título, tarjetas y retrato |
| 900–1399px | Ajustes adicionales de offsets y títulos; deben seguir al bloque general de escritorio |
| ≥1600px | Retrato y títulos mayores |
| ≥900px y altura ≤950px | Sidebar más compacto |
| ≥900px y altura ≤850px | Compactación adicional; enlaces de nav de 36px y CTA de 42px |
| ≤899px | Menú móvil; sidebar y nav superior ocultos; About y categorías del stack se apilan |
| 641–899px | Reglas de retrato normal/estático que **no sobreviven al build** — ver hallazgo abajo |
| ≤900px | Proyectos, artículos de Servicios y catálogo de Tools a una columna; Servicios/Tools se apila |
| ≤1100px | Contacto: formulario y canales directos pasan de dos columnas a una |
| ≤700px | Lista de SimpleNav oculta; FAQ y formularios a una columna |
| ≤640px | Hero móvil específico; listas del stack de About con dos columnas |
| ≤560px | Metadatos y ajustes del conversor a una columna |

A exactamente 900px coexisten sidebar de escritorio y algunos grids de una columna — no hay un único valor universal de breakpoint.

### Bug conocido: regla de retrato tablet ausente en el CSS compilado

Cerca de las líneas 1633–1727 de [HeroExperience.astro](../../src/components/HeroExperience.astro) hay un comentario que empieza con «Small-tablet portrait», otro inicio `/*` antes de cerrar el primero, y un texto suelto `CORRECTED: real-browser measurement`. El bloque de 641–899px queda precedido por ese comentario mal delimitado. En el CSS generado están los ajustes 900–1399 (`17.875rem`, `276.598`), pero **no** aparecen `185svh` ni `1900px` del retrato tablet. El build termina sin error — compilar no prueba que toda regla llegue a la salida.

Corrección mínima propuesta (no aplicada): reparar los delimitadores del comentario y verificar después el CSS y la vista 768×1024. Ver [[Hallazgos-y-Pendientes]].

## Relacionado

[[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] · [[Hero-y-Sidebar]] · [[Sobre-Mi]] · [[Hallazgos-y-Pendientes]]
