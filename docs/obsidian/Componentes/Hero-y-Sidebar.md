---
tags: [componente, hero, gsap, scrolltrigger, sidebar]
actualizado: 2026-10-06
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

## Entrada inicial

Estados internos: `pending` → `playing` → `completed` / `interrupted`. Espera `document.fonts.ready` y, cuando está disponible, la decodificación del retrato. Los fallos de estas esperas se toleran (no bloquean la entrada).

Se **omite** la entrada si: hay `prefers-reduced-motion`, si `scrollY > 0`, o si se detectó scroll durante la espera. Si el visitante empieza a desplazarse durante la animación, esta se completa/limpia y libera el inicio del sistema de scroll — el listener reacciona a scroll efectivo, no a un evento sintético sin desplazamiento real.

Anima en este orden: imagen de marca (un único elemento, aunque el selector interno se llame `letter`), retrato, líneas de título, navegación, métricas, columna lateral y botones. La nota personal comparte el momento de animación del lateral derecho. Duraciones principales: marca 0,55s, retrato 0,75s, líneas 0,6s, cierre 0,5s; usa staggers y easings `power3.out`/`power2.out`. Si falla `playEntrance`, registra el error, limpia estilos y resuelve la espera para no dejar bloqueado el scroll.

**Código residual:** `fitWordmarkWidth()` sigue buscando `.hx-wordmark-row`, que está ausente en el markup actual — retorna antes de calcular nada. El PNG de marca se dimensiona por CSS, no por esa función. No es una razón para "recrear cinco letras" si alguien lo encuentra y asume que está roto.

## Morph y recorrido de scroll

Solo se construye el timeline maestro cuando `innerWidth >= 900` **y** no hay movimiento reducido. Configuración de ScrollTrigger: `start: "top top"`, recorrido de `window.innerHeight`, `scrub: 0.35`, pin de `.hx-pin`, `pinSpacing: false`, `anticipatePin: 1`, `invalidateOnRefresh: true`.

`pinSpacing: false` es lo que permite que About suba por debajo del Hero fijado — añadir espacio automático rompería esa transición visual. La animación mide fuentes y destinos por sus rectángulos de contenido, restando la posición del pin en la coordenada vertical de origen. La escala se limita entre 0,001 y 1.

Los pares de morph se enlazan mediante `data-morph-source` / `data-morph-target`: marca, tagline, cada métrica, y `nav-0`…`nav-5`. El orden original de navegación se indexa **antes** de dividirla en izquierda/derecha; el sidebar reordena visualmente esos enlaces manteniendo `morphIndex`. Una fuente sin destino se omite — FAQ y el CTA final no tienen fuente de morph y aparecen directamente con el sidebar.

### Tabla de tiempos del timeline (posiciones locales 0–1, no segundos reales)

| Tramo local | Acción |
|---|---|
| 0–0,12 | Desenfoque del retrato hasta 12px |
| 0,10–0,28 | Desaparecen los separadores de navegación |
| 0,10–0,40 | Retrato, título, chips, botones y nota se desplazan −18px y desaparecen |
| 0,10–0,60 | Las fuentes viajan a sus destinos del sidebar |
| 0,58–0,90 | Aparece el sidebar |
| 0,62–0,86 | Desaparecen las fuentes del morph |
| 0,75–0,98 | Desaparecen fondo y glow, dejando ver la página inferior |

La interactividad y `aria-hidden` del sidebar se activan cuando `ScrollTrigger.progress > 0.58`. El recorrido es reversible al volver hacia arriba.

## Tema y sección activa del sidebar

Cada artículo del sidebar calcula su solapamiento vertical con **todas** las secciones `.section-theme-dark`, toma el máximo, y lo divide por la altura del propio artículo:

- Se vuelve oscuro con **≥2%** de solapamiento.
- El artículo de navegación usa un umbral distinto: **≥35%**.

Por eso dos artículos del sidebar pueden tener temas distintos en una misma frontera de scroll — no es un bug, es el diseño. Textos, bordes y separadores interpolan durante 0,3s; con movimiento reducido el cambio es inmediato. Las métricas mantienen siempre su acento dorado, independiente del tema.

Este mecanismo es genérico (detecta la clase `.section-theme-dark`, no un ID de sección concreto) — es por eso que intercambiar los temas de About y Proyectos (ver [[Sistema-de-Diseno]]) no requirió ningún cambio en este archivo.

La sección activa se calcula con **seis** ScrollTriggers, de `top 45%` a `bottom 45%`, con eventos de entrada en ambos sentidos de scroll. `services-tools` activa a la vez los enlaces de Servicios y Tools. Solo los enlaces que empiezan por `#` reciben `aria-current="location"` — los enlaces a subpáginas pueden resaltarse visualmente pero nunca se anuncian como ubicación actual de esa otra página.

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

[[Sistema-de-Diseno]] · [[Rutas-y-Navegacion]] · [[Accesibilidad-y-Movimiento]] · [[Hallazgos-y-Pendientes]]
