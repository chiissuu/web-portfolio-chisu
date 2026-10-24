---
tags: [componente, hero, gsap, scrolltrigger, sidebar]
actualizado: 2026-10-23
fuente: [src/components/HeroExperience.astro]
---

# Hero, animaciones y sidebar

Fuente: [HeroExperience.astro](../../../src/components/HeroExperience.astro). Es el componente con mayor acoplamiento entre DOM, CSS y geometría de scroll de todo el proyecto — el de mayor riesgo si se toca sin entender las piezas de abajo.

> [!warning] Zona de alto impacto
> Cualquier cambio aquí puede romper el morph de scroll, el sidebar o la entrada inicial a la vez. Revisar las cinco subsecciones completas antes de editar, no solo la que parezca relevante.

## Estructura DOM que debe conservarse

- `.hx-wrap` reserva `100svh` y pinta `--section-dark-start`, aunque conserva la clase de tema warm.
- `.hx-pin` mide `100svh`, tiene `min-height: 640px` y `overflow: clip`. En ventanas bajas, su altura mínima puede superar la reserva del wrapper.
- `.hx-pin-fade` contiene el fondo rasterizado; `.hx-glow` añade luz decorativa. El fade se aplica a estos hijos, **no** al fondo del propio elemento pineado.
- Los wrappers `hx-scroll-motion` y `hx-intro-motion` delimitan responsabilidades: entrada y scroll alcanzan algunos de los mismos elementos, pero su ejecución se serializa mediante la bandera `entranceSettled`.
- El sidebar es **hermano exterior** de `.hx-wrap`, fijo y transparente, con cuatro artículos: marca/tagline, métricas, navegación, redes/CTA. Puede desplazarse internamente si no cabe en altura.
- El botón y el panel del menú móvil también están fuera del Hero. El bloqueo `inert` del resto de la página no debe contenerlos a ellos.

La imagen de marca se centra en su tarjeta mediante `align-self: center`; la descripción inferior usa `text-align: center`. LinkedIn (placeholder), GitHub y Redes Sociales forman un grupo centrado de filas con PNG dorado de 20px y nombre visible, alineados en dos columnas. Las filas tienen una altura mínima de 24px y el CTA Contacto conserva `align-self: center`. Las filas del menú principal mantienen su alineación de icono y etiqueta. Los destinos de morph siguen siendo la imagen y el párrafo reales, medidos por el timeline; no se añaden offsets manuales.

Los logos sociales son PNG locales transparentes de 96×96, con siluetas reconocibles y el acabado metálico del nav. «Redes Sociales» usa Linktree para corresponder con su destino. Son decorativos (`alt=""`, `aria-hidden="true"`); los nombres y URLs permanecen en texto. LinkedIn sigue siendo un `span` deshabilitado sin `href`, con tooltip y opacidad atenuada hasta disponer de una URL real. GitHub y Linktree conservan foco visible, subrayado en hover/foco y `noopener noreferrer`; no se añade animación. Procedencia y licencias: [[Logos-Redes]].

## Entrada inicial

Estados internos: `pending` → `playing` → `completed` / `interrupted`. Espera `document.fonts.ready` y, cuando está disponible, la decodificación del retrato. Los fallos de estas esperas se toleran (no bloquean la entrada).

Se **omite** la entrada si: hay `prefers-reduced-motion`, si `scrollY > 0`, o si se detectó scroll durante la espera. Si el visitante empieza a desplazarse durante la animación, esta se completa/limpia y libera el inicio del sistema de scroll — el listener reacciona a scroll efectivo, no a un evento sintético sin desplazamiento real. Desde el 23 de octubre ese caso solo ocurre en cargas que ya llegan desplazadas (ancla o scroll restaurado), porque la página está bloqueada mientras la entrada se reproduce (ver siguiente apartado).

### Bloqueo de scroll durante la entrada (23 de octubre de 2026)

Mientras se reproduce la entrada no se puede hacer scroll. No hace falta ninguna librería ni un temporizador fijo: el Hero ya tiene un punto único de cierre, la promesa `entranceSettled`, que se resuelve en todos los desenlaces (termina, se salta, se interrumpe, falla o se desmonta).

- **Técnica:** la misma que el menú móvil: clase `hx-intro-locked` en `html` y `body` con `overflow: hidden` y `overscroll-behavior: none`. Es una clase **distinta** de `hx-mobile-nav-open`, para que cada bloqueo se libere por separado. En `html` añade `scrollbar-gutter: stable`, de modo que el hueco de la barra de desplazamiento se conserva y el diseño no salta al bloquear ni al desbloquear.
- **Cuándo se activa:** al iniciar el script, solo si habrá entrada: sin `prefers-reduced-motion` y con `scrollY` en 0. Con movimiento reducido o con una carga ya desplazada no se bloquea nada.
- **Cuándo se libera:** al resolverse `entranceSettled`. El `.then` que libera se registra antes de que `bootScrollTimeline()` espere esa misma promesa, así que la página ya está desbloqueada cuando el timeline de scroll mide y se construye. También se libera en la limpieza (`astro:before-swap`) y en `pagehide`.
- **Red de seguridad:** un temporizador de 8 s lo libera igualmente si fuentes o decodificación no terminasen nunca. No es el mecanismo normal.
- **Medido** (compilación de producción, iframe con fotogramas forzados): bloqueo a ~50 ms y desbloqueo a ~2,2 s desde el inicio de la carga, es decir, al acabar la animación; con ancla (`/#about`) el bloqueo dura ~30 ms y se libera al saltarse la entrada. Con el panel del navegador oculto (sin fotogramas) se comprobó que el temporizador de 8 s libera.
- **Efecto secundario deliberado:** el visitante ya no puede saltarse la entrada desplazándose; no existe un botón de «saltar».

Anima en este orden: imagen de marca (un único elemento, aunque el selector interno se llame `letter`), retrato, líneas de título, navegación, métricas, columna lateral y botones. La nota personal comparte el momento de animación del lateral derecho. Duraciones principales: marca 0,55s, retrato 0,75s, líneas 0,6s, cierre 0,5s; usa staggers y easings `power3.out`/`power2.out`. Si falla `playEntrance`, registra el error, limpia estilos y resuelve la espera para no dejar bloqueado el scroll.

**Código residual:** `fitWordmarkWidth()` sigue buscando `.hx-wordmark-row`, que está ausente en el markup actual — retorna antes de calcular nada. El PNG de marca se dimensiona por CSS, no por esa función. No es una razón para "recrear cinco letras" si alguien lo encuentra y asume que está roto.

## Morph y recorrido de scroll

Solo se construye el timeline maestro cuando `innerWidth >= 900` **y** no hay movimiento reducido. Configuración de ScrollTrigger: `start: "top top"`, recorrido de `window.innerHeight`, `scrub: 0.35`, pin de `.hx-pin`, `pinSpacing: false`, `anticipatePin: 1`, `invalidateOnRefresh: true`.

`pinSpacing: false` es lo que permite que About suba por debajo del Hero fijado — añadir espacio automático rompería esa transición visual. La animación mide fuentes y destinos por sus rectángulos de contenido, restando la posición del pin en la coordenada vertical de origen. La escala se limita entre 0,001 y 1.

Los pares de morph se enlazan mediante `data-morph-source` / `data-morph-target`: marca, tagline, cada métrica, y `nav-0`…`nav-5`. El orden original de navegación se indexa **antes** de dividirla en izquierda/derecha; el sidebar reordena visualmente esos enlaces manteniendo `morphIndex`. Una fuente sin destino se omite — FAQ y el CTA final no tienen fuente de morph y aparecen directamente con el sidebar.

La posición de viaje se calcula al construir el timeline. Para la marca PNG, desde el tiempo local 0.60 (viaje terminado), un callback del timeline compara los centros horizontales reales de origen y destino y corrige `x` si difieren más de 0.01px. Así las dos imágenes comparten el mismo centro durante el fundido aunque el destino cambie tras la medición inicial, por ejemplo con CSS recargado en desarrollo. La corrección no altera la escala, la posición vertical ni los tiempos de opacidad. El resto de pares conserva su cálculo original.

### Tabla de tiempos del timeline (posiciones locales 0–1, no segundos reales)

| Tramo local | Acción |
|---|---|
| 0–0,12 | Desenfoque del retrato hasta 12px |
| 0,10–0,28 | Desaparecen los separadores de navegación |
| 0,10–0,40 | Retrato, título, chips, botones y nota se desplazan −18px y desaparecen |
| 0,10–0,60 | Las fuentes viajan a sus destinos del sidebar |
| 0,20–0,75 | La textura del fondo pierde el dorado y baja a brillo 0,55; desaparece el glow |
| 0,58–0,90 | Aparece el sidebar |
| 0,62–0,86 | Desaparecen las fuentes del morph |
| 0,75–0,98 | Desaparece el fondo ya desaturado, dejando ver el carbón de Sobre mí |

La interactividad y `aria-hidden` del sidebar se activan cuando `ScrollTrigger.progress > 0.58`. El recorrido es reversible al volver hacia arriba.

El pin tiene `z-index: 2`: pinta encima del fondo de About, pero debajo de su `.ab-inner` (`z-index: 3`). About no usa `isolation: isolate`, porque encerraría su texto debajo del pin y lo ocultaría hasta el fundido final. El contenido entra con el scroll normal mientras el fondo mantiene su transición independiente; el sidebar fijo conserva su nivel 90. El filtro solo afecta a `.hx-pin-fade`, no al texto, los elementos del morph ni el sidebar. Al pasar de escritorio animado a modo estático se limpian tanto `opacity` como `filter` del fondo.

## Efecto del ratón sobre el fondo (23 de octubre de 2026)

Al mover el ratón por el Hero, el fondo se **desplaza y se desenfoca como un líquido** que se arrastra tras el cursor y se disuelve solo. Referencia: el portfolio de Arnaud Rocca ([artículo de Codrops](https://tympanus.net/codrops/2026/03/31/arnaud-roccas-portfolio-from-a-gsap-powered-motion-system-to-fluid-webgl/)), que usa una simulación de fluidos completa con la librería OGL (unos diez shaders). Aquí es una versión ligera **sin dependencias**, en [heroFluid.ts](../../../src/lib/heroFluid.ts):

- **Capa:** un `<canvas>` WebGL2 creado por el script dentro de `.hx-pin-fade`, así que se desvanece y se desatura con el resto del fondo al hacer scroll y queda bajo el wordmark, el retrato y la navegación. Es transparente donde no hay movimiento: el fondo CSS original no se toca.
- **Simulación:** una textura pequeña (192 px de ancho, `RGBA16F`) con la velocidad del puntero; cada fotograma se auto-arrastra, se difumina con sus vecinas, se desvanece (`0,982` por fotograma a 60 fps, independiente de la tasa de refresco) y recibe la «salpicadura» del cursor.
- **Dibujo:** otro paso toma la misma imagen de fondo (`hero-background-gold-alternative.png`), la desplaza según la velocidad y la desenfoca (9 muestras, radio proporcional) y la pinta con alfa igual a la intensidad. Resolución de salida: la mitad de la pantalla.
- **Consumo:** el bucle solo corre mientras hay movimiento y 2,6 s después; en reposo no hay trabajo de GPU. Se ignora si el Hero ya salió de pantalla (`scrollY` > 0,9 × alto) o la pestaña está oculta.
- **Cuándo no se activa:** sin puntero fino con hover (táctil), con `prefers-reduced-motion`, sin WebGL2 o sin `EXT_color_buffer_float`/`half_float`, o si el contexto se pierde: no hace nada y el fondo queda como antes.
- **Ajustes:** intensidad del desplazamiento (`0.05`) y del desenfoque (`0.011`) en el shader de dibujo; tamaño y arrastre de la salpicadura en `onPointerMove` y en `SIM_FRAG`.
- **Medido:** capa totalmente transparente en reposo; con el ratón en movimiento ~18 % del lienzo con alfa 255, 11 497 px con alfa ≤92 a los 1,2 s y 0 px a los ~5 s.

### Barras «|» del nav que quedaban visibles tras recargar desplazado (24 de octubre de 2026)

Síntoma: al recargarse la página por un cambio de código (sin F5) con el scroll ya en Sobre mí, las dos barras `|` que separan Proyectos / Servicios / Tools seguían a la vista sobre el Hero; desaparecían al subir y bajar. Causa: su opacidad dependía de una variable CSS (`--nav-sep-opacity`) escrita por el `onUpdate` de un tween sobre un objeto proxy. Al cargar con el scroll restaurado, GSAP coloca la línea de tiempo en su posición final sin disparar callbacks, así que la variable se quedaba en 1 (los demás elementos del Hero se animan directamente sobre el DOM y no sufren esto). Arreglo: el tween actúa ahora sobre el `opacity` de los `.hx-nav-sep` y `clearScrollDrivenState` lo limpia con `clearProps`; se eliminó la variable. Medido: cargado en `scrollY = 2600`, las 4 barras tienen opacidad 0 (antes 1); cargado arriba, 1. `--portrait-blur` sigue usando el mismo patrón proxy, pero el retrato ya está a opacidad 0 en esa posición, así que no se ve.

### Agua también en los elementos sueltos (24 de octubre de 2026)

El efecto del fondo se dibuja en su propio lienzo. El wordmark, el titular, el lema, la nota, los chips y las métricas son nodos HTML que el Hero anima y mueve al sidebar, así que no se pueden «pintar» en ese lienzo sin sustituirlos. En su lugar, cada uno recibe un **filtro SVG** propio ([heroWater.ts](../../../src/lib/heroWater.ts)):

- **Filtro:** `feTurbulence` (ruido suave, una octava, frecuencia baja) pesado por un «blob» redondo que sigue al puntero (`feImage` con un degradado radial) alimenta un `feDisplacementMap`. Fuera del blob el mapa es gris neutro: desplazamiento cero. Las coordenadas de `feImage` cuentan desde la esquina del elemento (calibrado en el navegador), así que el blob se coloca con `puntero − rect del elemento`.
- **Elementos afectados** (selectores en el bloque final del script del Hero): `.hx-wordmark-image`, `.hx-title-block`, `.hx-metric-value`, `.hx-metric-label`, `.hx-personal-note`, `.hx-chip` y `.hx-tagline`. **Excluidos:** botones, navegación, retrato y los fondos de cristal de las tarjetas (solo se mueve su texto).
- **Cuándo se aplica:** el filtro se activa con la clase `hx-water-on` (variable `--hx-water` por elemento) solo en los elementos a menos de ~210 px del puntero, mientras el Hero está en reposo (`scrollY < 4` y sin el bloqueo de la entrada) y hay movimiento. Usar una clase en vez de `style.filter` evita competir con el `filter: blur` en línea que usa la animación de entrada. En reposo (1,5 s sin mover) o al hacer scroll se retira.
- **Intensidad:** `MAX_SCALE` 44 px a velocidad máxima del puntero (la velocidad se mide en px/ms), `BLOB` 380 px, ruido `0.0055 0.0095`. El ripple va ligeramente por detrás del cursor (suavizado). Son las cuatro constantes de [heroWater.ts](../../../src/lib/heroWater.ts) para ajustar.
- **Se descartó** reutilizar el campo de velocidades real del fondo para el texto: obligaría a leerlo de la GPU y convertirlo en una imagen para cada filtro en cada fotograma (costoso y poco fiable en Safari). El resultado es «agua» del mismo estilo, no el mismo campo.
- **Cuándo no se activa:** igual que el fondo (táctil, `prefers-reduced-motion`).
- **Medido** (compilación de producción, iframe con fotogramas forzados y puntero sintético): los siete tipos de elemento reaccionan, botones/nav/retrato nunca, escala máxima ~41 px, 0 elementos con el filtro a los 2 s de reposo, apagado en <80 ms al hacer scroll y sin reactivarse mientras se está desplazado; el Hero arranca, el fondo líquido y el sidebar siguen funcionando.

## Tema y sección activa del sidebar

Cada artículo del sidebar calcula su solapamiento vertical con **todas** las secciones `.section-theme-dark`, toma el máximo, y lo divide por la altura del propio artículo:

- Se vuelve oscuro con **≥2%** de solapamiento.
- El artículo de navegación usa un umbral distinto: **≥35%**.

Por eso dos artículos del sidebar pueden tener temas distintos en una misma frontera de scroll — no es un bug, es el diseño. Textos, bordes y separadores interpolan durante 0,3s; con movimiento reducido el cambio es inmediato. Las métricas usan el acento de la paleta del sidebar, independiente del tema warm/dark de cada artículo.

El sidebar mantiene `data-palette="brand"` en todas las secciones, incluido About. La ronda dorada del 2026-10-23 retiró las reglas de la paleta mono y su asignación condicional en `setActiveSections()`: el logo conserva su dorado original, los botones reutilizan los mismos tokens metálicos del Hero y las tarjetas su superficie translúcida habitual, con contorno metálico dorado de 2px. El seguimiento de sección activa, los temas por artículo y el morph no cambian.

Los siete enlaces del nav, el CTA Contacto y los dos CTA del Hero («Ver Proyectos» y «Sobre Mí») comparten `.hx-metal-button`: bisel de 2px con reflejos claros y oscuros, reflejo diagonal, degradado, grano fino de metal cepillado y esquinas de 3px. `::before` dibuja la cara inclinada −4°; `::after` dibuja un canto fijo con reflejos alternos, visible 3px por debajo (2px en el sidebar de escritorio de altura ≤850px). Las áreas clicables conservan sus dimensiones y posición; cada enlace crea un contexto local con `isolation: isolate`, sin aislar el Hero ni About. Hero y sidebar utilizan los mismos tokens dorados, independientes del tema warm/dark de cada tarjeta. No se duplican los estilos del acabado.

El acabado dorado se aproxima a los tonos del PNG de CHISU: cara #c19b3d, luz #dfc357, sombra #b08a32 y bisel #efd683, evitando el marfil de la versión inicial. El reflejo diagonal usa `--hx-metal-glint` con RGB dorado (244 216 126). Esta corrección afecta solo al color, no al relieve, la textura o la pulsación.

El estado `.is-active` del menú mantiene `--hx-button-offset: 0px`: la cara queda elevada, con brillo 1.12 y un haz dorado fijo en el borde izquierdo mediante sombras interiores. No hay animación infinita. Hover usa −1px en los botones sin seleccionar; la selección conserva 0px. Solo `:active`, declarado después con la misma especificidad, baja 2px la cara, el texto y los iconos, y recupera el fondo/sombra hundidos durante la activación real. La transición sigue en 140ms. El canto y las áreas clicables permanecen fijos. El CTA Contacto inferior no se selecciona permanentemente; se hunde solo al activarlo, igual que los CTA del Hero. Se conservan ARIA, foco visible, entrada GSAP y desactivación de transiciones con movimiento reducido. El menú móvil conserva su estilo.

Las cuatro cajas del sidebar llevan un bisel dorado de 2px con el mismo degradado del borde de los botones. Un `::before` absoluto con máscara compuesta pinta solo el contorno y deja transparente el centro; `pointer-events: none` evita interceptar clics. Se mantiene el borde estructural de 1px, por lo que las dimensiones, padding y destinos del morph no cambian. Sin soporte de máscaras se conserva un borde dorado sólido de reserva. Los temas por artículo siguen controlando texto y separadores, no el contorno dorado.

Este mecanismo es genérico (detecta la clase `.section-theme-dark`, no un ID de sección concreto) — es por eso que intercambiar los temas de About y Proyectos (ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]]) no requirió ningún cambio en este archivo.

La sección activa se calcula con **siete** ScrollTriggers (home, about, projects, services, tools, contact y faq), de `top 45%` a `bottom 45%`, con eventos de entrada en ambos sentidos de scroll. Desde el 23 de octubre Servicios (`#services`) y Tools (`#tools`) son secciones separadas: cada una ilumina solo su propio enlace y nunca hay dos enlaces activos a la vez (antes `services-tools` los activaba juntos). El cambio solo tocó el array `NAV_TRIGGER_GROUPS` y sus comentarios; el morph, los temas por artículo y la geometría no se modificaron. Solo los enlaces que empiezan por `#` reciben `aria-current="location"` — los enlaces a subpáginas pueden resaltarse visualmente pero nunca se anuncian como ubicación actual de esa otra página.

Los triggers de tema y sección activa pueden seguir existiendo aunque el sidebar esté oculto en móvil — no deben confundirse con el timeline maestro, que sí está condicionado a escritorio.

## Resize, movimiento reducido y limpieza

Tras cargar fuentes, imagen y completar la entrada, se construye el timeline, se sincronizan temas y navegación, y se llama `ScrollTrigger.refresh()`. El resize se agrupa con 120ms de espera y reconstruye el timeline; un cambio de preferencia de movimiento vuelve a evaluar el modo completo.

> [!bug] Excepción real en `evaluateMode()`
> La clase `.hx-static` solo se añade dentro de `else if (scrollTl)`. Si la primera carga ya es móvil o ya tiene movimiento reducido, **no existía** timeline que destruir, así que esa rama nunca se ejecuta — no se puede afirmar que `.hx-static` esté siempre presente en esos modos. Si en cambio se pasa de escritorio animado a un modo sin scroll, sí se añade y se limpian los estilos del morph. Activar reduced motion durante una entrada ya en marcha tampoco tiene una cancelación explícita de esa entrada dentro de su propio listener.
>
> Ver [[Hallazgos-y-Pendientes]] ("Modo estático depende del historial de resize").

`astro:before-swap` revierte el contexto de GSAP, cancela la entrada y limpia los listeners/temporizadores que registra su propia función de limpieza. Los listeners del menú móvil y los observers de otros componentes **no** forman parte de ese contexto. Hoy no hay `ClientRouter` instalado — antes de añadir navegación parcial habría que revisar todo este ciclo de vida.

## Menú móvil

A ≤899px se ocultan la navegación superior y el sidebar, y aparece un botón de 44×44px. Al abrir: actualiza `aria-expanded`, el nombre accesible del botón, `aria-hidden`, `inert` y clases; bloquea el scroll de `html`/`body`; vuelve inerte el Hero y el `main`; enfoca el primer enlace. Tab y Shift+Tab recorren el botón y los seis enlaces con cierre circular (el foco nunca se escapa del menú).

Se cierra por: botón, Escape, clic en el fondo del panel, selección de un enlace, o cambio a escritorio. Botón/Escape/fondo devuelven el foco al botón que abrió el menú; elegir un destino o cambiar a escritorio **no** fuerza ese retorno de foco. Conserva los estados `inert` previos que ya tuvieran los elementos de fondo (no los pisa con un valor fijo).

`lastFocusedBeforeOpen` se asigna pero **no se usa** para restaurar el foco previo — queda como hint de una mejora no terminada, no como bug bloqueante.

El menú usa fade de 220ms y entrada escalonada 40–240ms solo con `prefers-reduced-motion: no-preference`; bajo reducción, cambia de estado directamente sin transición. Los nombres accesibles del menú están escritos directamente en el componente, no traducidos vía `site.js`.

## Relacionado

[[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]] · [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] · [[Hallazgos-y-Pendientes]]
