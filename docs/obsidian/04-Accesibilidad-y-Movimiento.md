---
tags: [accesibilidad, movimiento, reveals]
aliases: [Accesibilidad-y-Movimiento]
actualizado: 2026-10-23
fuente: [src/layouts/Layout.astro, src/components/RollLink.astro]
---

# Accesibilidad, reveals y movimiento

## Reveals por scroll

[Layout.astro](../../src/layouts/Layout.astro) observa `.rd-reveal` con `threshold: 0.15`, añade `.rd-in` al entrar y deja de observar ese elemento. El CSS pasa de opacidad 0 / `translateY(14px)` a visible en 0,55s.

**Sin IntersectionObserver**, el script hace visibles todos los elementos. **Sin JavaScript**, ese fallback no se ejecuta en absoluto y los elementos se quedan con opacidad 0 — es una mejora progresiva incompleta, no total. Un bloque extremadamente alto también puede no alcanzar nunca el 15% de intersección necesario. Servicios, Tools y Contacto no llevan la clase `.rd-reveal` en su bloque actual. Ver [[Hallazgos-y-Pendientes]].

Excepción desde 2026-10-23: la biografía y el stack de About ya no utilizan `.rd-reveal`; su lectura es inmediata sin scripts. El título PNG protegido conserva la clase y su limitación previa. Un fixture de la compilación sin scripts y con `html { font-size: 200% }` a 320px confirmó visibilidad y ausencia de overflow en los contenedores de texto/stack de About. La página completa sí desborda en ese escenario por elementos del Hero y encabezados de otras secciones, sin cambios en esta ronda. Es una prueba de ampliación de texto en un fixture, no una emulación del zoom nativo ni una auditoría de lector de pantalla. Ver [[Auditoria-Sobre-Mi]].

Los títulos gráficos de Proyectos, Servicios, Tools, Contacto y FAQ no usan `.rd-reveal`: el `h2` conserva su texto como contenido accesible oculto visualmente y la imagen es decorativa (`alt=""`, `aria-hidden`). Se cargan con `loading="lazy"`; no dependen de JavaScript.

## `RollLink`

[RollLink.astro](../../src/components/RollLink.astro) duplica visualmente el texto para desplazarlo verticalmente en hover/focus durante 0,4s. Oculta esas copias duplicadas a lectores de pantalla y usa `aria-label` en el enlace. `prefers-reduced-motion` quita la transición.

## Movimiento reducido (global)

Layout reduce las duraciones globales a 0,001ms y cambia el smooth scroll a `auto`. **Importante:** esto no hace visibles los reveals por sí mismo, ni resuelve la excepción `.hx-static` del Hero (ver [[Hero-y-Sidebar]], sección de resize/limpieza) — son tres mecanismos independientes que hay que verificar por separado.

El Hero bloquea el scroll mientras reproduce su entrada (unos 2 s). No se aplica con `prefers-reduced-motion` ni en cargas ya desplazadas, tiene un límite de 8 s y no atrapa el foco (solo impide desplazar). Detalle en [[Hero-y-Sidebar]].

## Estado de accesibilidad conocido

Existen: labels de formulario, estados `aria-live`, `<progress>` nativo, `alt` del retrato, iconos decorativos marcados, y menú móvil con control de foco (ver [[Hero-y-Sidebar]]). **No** hay auditoría con lector de pantalla ni medición de contraste.

Puntos concretos pendientes de revisar:
- Errores por campo corregidos: ARIA, descripción individual y foco; lector de pantalla sin probar (ver [[Formularios]])
- Contenido invisible sin JS (reveals, arriba)
- Jerarquía del ejemplo de Tools corregida a h2→h3, sin cambiar texto/estilo
- Enlaces de SimpleNav en móvil
- Cabeceras sticky que puedan tapar destinos de anclas

La presencia de atributos ARIA no equivale a conformidad completa de accesibilidad.

[[Auditoria-Web]] midió contrastes concretos y verificó cuatro rutas en cinco anchos, FAQ con Enter y foco de formularios. Reduced motion y desactivación global de JS no están expuestos por el navegador de esta sesión: se revisó código y un fixture de formularios sin scripts. Layout y Hero permanecen protegidos.

## Clic central (middle-click)

Solo en la portada (`body.redesign-home`), Layout intercepta `mousedown` con `button === 1` para impedir el auto-scroll del navegador sobre áreas no interactivas. Conserva el comportamiento nativo sobre `a[href]`, `area[href]`, inputs, textareas, selects/options, contenido editable y `[role="link"]`, incluidos sus descendientes.

Detalles que importan si se toca este código:
- No intercepta rueda del ratón, scroll por teclado ni clic principal (botón izquierdo).
- Un elemento `<button>` **no** está incluido por sí mismo en la lista de excepciones — un botón nativo sin rol de link pierde el autoscroll de clic central.
- Las subpáginas (`/servicios/`, `/tools/`, `/tools/video-converter/`) no tienen este bloqueo.

## Relacionado

[[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[Hero-y-Sidebar]] · [[Formularios]] · [[Hallazgos-y-Pendientes]]
