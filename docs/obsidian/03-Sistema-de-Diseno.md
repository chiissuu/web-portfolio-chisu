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

## Fondos alternados claro/oscuro (25 de octubre de 2026)

La portada alterna claro y oscuro: Hero (claro, oro líquido) → Sobre mí (oscuro, obsidiana con venas) → **Proyectos (claro)** → **Servicios (oscuro)** → **Tools (claro)** → **Contacto (oscuro)** → **FAQ (claro)**. Los cinco fondos nuevos son capas de [SectionBackdrop.astro](../../src/components/SectionBackdrop.astro) (primer hijo de la sección, `position: absolute`, `z-index: 0`, sin eventos), que comparten una costura superior (filo dorado de 2px con resplandor) y la paleta dorada:

| Sección | Fondo (`kind`) | Tono | Qué es |
|---|---|---|---|
| Proyectos | `champagne` | claro | satén marfil-champán con pliegues suaves y las venas de Sobre mí en **oro metálico** (`brightness(.74) saturate(2.4)`, opacidad .85; antes eran casi negras) que se desplazan ±6 % con el scroll (GSAP) |
| Servicios | `blueprint` | oscuro | grafito con rejilla técnica dorada **muy tenue** (líneas al 6 % y 2,5 %, nodos al 30 %; la primera versión, al 13 %/6 %/60 %, tapaba los textos y carteles) y tres pulsos de luz suaves por líneas horizontales (CSS, 11–14s). Las tarjetas oscuras usan una superficie casi opaca (`--theme-surface: rgb(20 19 16 / 82%)`) para que la rejilla no llegue al texto |
| Tools | `brushed` | claro | **placa de oro pálido cepillado** (ruido SVG estirado en horizontal, `multiply`), anillos grabados tipo esfera de reloj en dos esquinas, un brillo diagonal que viaja despacio (22s) y un reflejo bajo el puntero (solo puntero fino). Sustituyó al fondo «perla con puntos grises», que no seguía el dorado de la web |
| Contacto | `dawn` | oscuro | negro con un amanecer dorado desde abajo, polvo dorado que sube (dos capas, `transform`) y venas muy tenues arriba |
| FAQ | `ivory` | claro | papel marfil con brillos dorados en dos esquinas, grano (ruido SVG), un «?» gigante de **pan de oro** (degradado metálico recortado al glifo, brillo lento de 18s) y cuatro «?» de contorno dorado que derivan hacia arriba (34–58s) |

Las secciones claras usan `section-theme-warm bd-light` (tokens de `bd-light`: tinta `#1c1a17`, `--theme-accent: #7a5a12` para texto dorado pequeño, `--sc-chip-bg`) y las oscuras `section-theme-dark`; el sidebar sigue detectando las oscuras por su clase. `ShowcaseSection` recibe la prop `backdrop` (`champagne` | `blueprint` | `brushed`; `blueprint` es oscuro, el resto claro) y ya no tiene `blend`. `ShowcaseCard`, `SkillsStack`, `ContactSection` y `FaqSection` leen los tokens del tono. Con movimiento reducido no hay pulsos ni polvo animado, ni deriva de las venas.

## Transiciones entre secciones (26 de octubre de 2026, segunda versión)

La primera versión (puentes de color: degradados largos de claro a oscuro por oro y bronce) se descartó: dejaba escalones donde terminaban las texturas, mezclas marrones y verdosas y ningún movimiento. Ahora cada paso es un **evento animado con borde nítido**:

- **Sobre mí → Proyectos: iris desde la luz** (en [ShowcaseSection.astro](../../src/components/ShowcaseSection.astro), opción `iris`). **Segunda versión (26 de octubre, noche), tras la revisión del usuario:** la primera usaba un panel anclado de una pantalla que empezaba demasiado tarde (el usuario contó ~7 pasos de rueda sin que pasara nada), dejaba negro el texto del sidebar sobre el panel oscuro y, al abrirse, mostraba champán vacío hasta ~7 pasos después. Ahora **no hay anclaje propio**: una capa oscura (`.sc-iris`, absoluta, del inicio de la sección hasta el final del bloque título + introducción + carrusel) cubre Proyectos, y el scroll entre «el último nodo del hilo está a mitad de pantalla» (S0) y «empieza el anclaje del carrusel» la gobierna: (0–34 %) la luz baja por el hilo desde el nodo de salida (`#about .ab-marker--exit`) hasta un punto situado a ~200px del inicio del bloque (donde está el título); (34–42 %) el punto se enciende y estalla en 22 chispas; (36–100 %) crece un círculo (agujero en una máscara radial, `--r`) con un aro dorado que **descubre el contenido real de Proyectos** (título, texto y tarjetas), y entrega el testigo al carrusel justo cuando este se ancla (sin huecos). Con las medidas de 1440×900: S0 → fin ≈ 718px de scroll; chispas a ~2,5–3 pasos de rueda y apertura en ~4,5 pasos más. Una pieza vacía `.sc-iris-theme.section-theme-dark` hace que el sidebar mantenga el texto blanco mientras la capa oscura está detrás y lo cambie a negro cuando el círculo llega a su zona. **Tercera versión (26 de octubre, noche):** (1) el hilo, el punto y la pista tenue del iris estaban visibles antes de que el hilo llegara al último nodo; ahora aparecen con el progreso (opacidad `v / 0,03`, 0 en S0). (2) El círculo se cortaba plano en el borde superior de la sección y dejaba una franja de Sobre mí arriba; ahora el fondo oscuro y un fondo champán (`#ece3cb`, el mismo tono plano con el que empieza el fondo de Proyectos) continúan 700px **por encima** de la sección (`.sc-iris-up`): la parte oscura de arriba aparece con el progreso (0,12–0,30) para tapar las últimas tarjetas de Sobre mí al salir, y la parte champán solo se ve a través del círculo cuando este llega al borde de la sección. El aro cruza el final de Sobre mí pero se recorta por abajo (`clip-path` calculado en JS). (3) El recorrido termina cuando el borde superior de la sección llega al borde superior de la pantalla (606px a 1440×900, antes 718px), así no queda ninguna franja del bloque anterior. Solo en escritorio y con movimiento (≥900px, sin `prefers-reduced-motion`); si no, la capa no existe y Proyectos usa la onda de oro.
**Cuarta versión (26 de octubre, noche):** (1) *Secuencia.* El iris se dibujaba por scroll en cuanto el último nodo de Sobre mí llegaba a mitad de pantalla, antes de que ese nodo terminara su propia animación (el scroll rápido saltaba los tiempos). Ahora hay tres «compuertas» temporales (`gate.line`, `gate.ignite`, `gate.open`) que suben en orden tras el evento `ab-exit-lit` que lanza Sobre mí al encender su último nodo: 0,7s de espera (animación del nodo), 0,5s para que la luz baje hasta el punto, 0,25s para que el punto se encienda (chispas al 50 %) y 0,7s para abrir el círculo. Cada valor mostrado es el menor entre el del scroll y el de su compuerta; si el nodo se apaga (scroll hacia arriba) las compuertas vuelven a 0, y si la página carga ya más abajo se abren a la vez. La línea ya no empieza precargada sobre el tramo de arriba. (2) *Hilo cortado.* La capa oscura de arriba tapaba la tarjeta 08 y el hilo de Sobre mí en cuanto se alejaba el nodo; ahora aparece entre el 50 % y el 62 % del recorrido, cuando eso ya salió de la pantalla. (3) *Trazo que persistía.* La luz, la pista y el punto se desvanecen en cuanto el círculo empieza a abrirse (opacidad `1 − (open − 0,04) / 0,22`); antes la pista tenue seguía hasta el final y atravesaba el título. (4) El texto del sidebar se quedaba blanco sobre el champán si el scroll se detenía: al cambiar el estado de la capa se emite un evento `scroll` para que el sidebar relea sus tarjetas.
**Quinta versión (27 de octubre):** (1) *Resplandor cortado.* El brillo dorado alrededor del punto formaba parte de la capa oscura, que empieza en el borde superior de la sección, y se veía cortado plano allí (la zona de Sobre mí no lo tenía). Ahora es un elemento propio (`.sc-iris-glow`, círculo de 840px) que cruza el límite; aparece con la compuerta de la línea y se apaga con la apertura del círculo. La capa oscura se sube 2px sobre el borde de la sección (con el agujero de la máscara desplazado otros 2px) para que no asome una línea de subpíxel del fondo champán. (2) *Texto del sidebar en blanco al llegar a Proyectos.* El sidebar solo relee los colores de sus tarjetas con eventos de scroll de ScrollTrigger; los últimos fotogramas del iris ocurren con el scroll quieto (el scrub tiene 0,35s de retraso), así que el cambio de clases llegaba tarde y se quedaba en blanco hasta el siguiente scroll. [HeroExperience.astro](../../src/components/HeroExperience.astro) escucha ahora un evento propio `hx-theme-check` que ejecuta `checkArticleThemes`, y el iris lo emite cuando cambia el estado oscuro/claro (antes emitía un `scroll` sintético que ScrollTrigger ignoraba al no moverse el scroll). Copia previa: `backups/HeroExperience.astro.pre-theme-check-2026-10-27`.
- **Los otros cuatro pasos: borde de oro líquido** ([SectionBackdrop.astro](../../src/components/SectionBackdrop.astro), `.bd-edge`). Cada sección (Servicios, Tools, Contacto, FAQ) empieza con una onda orgánica (dos senos cuyas frecuencias dividen el periodo de 1440 unidades, curva de Bézier por Catmull-Rom) rellena con el tono de la propia sección, con un filo de oro metálico (degradado de 3px, `vector-effect: non-scaling-stroke`) y un resplandor. Se solapa con la parte final de la sección anterior y se desplaza un periodo completo (`xPercent` 0 → −50 %, el dibujo es el doble de ancho) mientras la sección llega. Cada una tiene su propia curva y color de relleno (`EDGE` en el frontmatter). Las primeras ~9rem del fondo son planas en ese tono (`.bd-bridge`) para que no haya escalón con las texturas. Se eliminaron los degradados largos y la franja dorada al final de Contacto.

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
| ≥900px, cualquier altura | Además (29 de octubre) el interior del sidebar usa la unidad `--u` = `clamp(0.62rem, 1.82svh, 1rem)`: 1rem en ventanas de ≥~880px de alto (igual que antes) y proporcionalmente menos en ventanas más bajas o con zoom, para que quepa sin barra |
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
