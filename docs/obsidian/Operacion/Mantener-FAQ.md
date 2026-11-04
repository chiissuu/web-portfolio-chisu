---
tags: [operacion, mantenimiento, faq]
actualizado: 2026-11-01
fuente: [src/content/site.js, src/lib/content-types.ts, src/components/FaqSection.astro, src/components/FaqBridge.astro]
---

# Mantener la sección FAQ

FAQ es la última sección: papel marfil con signos «?», cabecera centrada, **una columna** de preguntas que se abren con animación (al abrir una se cierra la anterior), atajos a otras secciones dentro de las respuestas, la línea «¿No está tu pregunta?» y el cierre de la página. Es una **plantilla**: el contenido se irá ampliando. Todo sale de `faq` y `closing` de [site.js](../../../src/content/site.js) (ES y EN).

> Git lo ejecuta siempre el usuario: esta nota no incluye ni ejecuta comandos de Git.

## Añadir o editar una pregunta

En `faq.items` (y **en `en.faq.items`**):

```js
{
  q: "¿La pregunta?",
  a: "La respuesta, en una o dos frases.",
  link: { label: "Ver cómo trabajo", href: "#services" }, // opcional: atajo bajo la respuesta
},
```

- El número (01, 02…) sale solo del orden. `link.href` puede ser una sección (`#projects`, `#services`, `#tools`, `#contact`, `#about`) o una ruta.
- Las respuestas actuales se apoyan en lo que ya dice la web (stack, «Cómo trabajo», privacidad del conversor, contacto). La de **freelance** está redactada de forma no comprometida («estoy abierto a hablar de proyectos…»): cambiarla cuando la disponibilidad esté confirmada.
- Más textos: `faq.lead` (línea bajo el título) y `faq.more` (`text`, `linkLabel`, `href` del «¿No está tu pregunta?»). Si la lista llega a ser muy larga, se puede añadir el mismo «Ver todas (N)» que usa [[Mantener-Tools]].

## Comportamiento

- **Una abierta a la vez:** abrir una cierra la que estaba abierta (el script de [FaqSection.astro](../../../src/components/FaqSection.astro) anima la altura y la opacidad con la Web Animations API; con «reducir movimiento» solo conmuta). Sin JavaScript funciona como `<details>` normales (varias a la vez). Estado lógico: clase `is-open` (el atributo `open` se mantiene mientras suena la animación de cierre).
- Accesible: `<details>/<summary>`, foco visible, teclado (Enter / Espacio).

## Cierre de la página

`closing.text` («Gracias por llegar hasta aquí.»), `closing.signature` («— chiissuu») y `closing.topLabel` (nombre accesible del botón redondo dorado de «volver arriba», que apunta a `#home`). `ClosingStatement.astro` sigue sin usarse.

## La frontera desde Contacto: «Amanecer»

[FaqBridge.astro](../../../src/components/FaqBridge.astro) (el fondo marfil usa `edge={false}`): sin regla, sin ola, sin hilo.

- Sobre el final de Contacto el negro se calienta pasando por oro hasta el marfil (`.fb-fade`); **un sol** a caballo de la línea (`.fb-sun` arriba y `.fb-spill` debajo, el mismo resplandor reflejado para que no haya escalón) que **sube con el scroll** (`--sun`, scrub) y está centrado en el eje de las preguntas (`--fx`, medido).
- **Motas de luz** que suben del sol (bucle CSS); algunas son los signos «?» dorados. Con «reducir movimiento» no se dibujan y el sol queda en su sitio.
- La barra lateral pasa a tema claro a mitad del degradado (`data-theme-trim` en `#contact`). El hueco bajo las tarjetas de Contacto (`margin-bottom` de `.ct-layout`) debe seguir siendo mayor que el degradado.

## Comprobación

1. `npm run check` y `npm run build`.
2. Escritorio: sol que sube al entrar la sección, motas y «?» subiendo; abrir una pregunta cierra la anterior con animación; los atajos navegan; «volver arriba» sube al inicio.
3. Móvil (<700px): las preguntas ocupan todo el ancho y el sol sigue centrado; sin desbordamiento horizontal propio.

## Relacionado

[[Mantener-Contacto]] · [[Mantener-Tools]] · [[Comandos-y-Pruebas]] · [[Contenido-por-Seccion]]
