---
tags: [componente, about, intersection-observer]
actualizado: 2026-10-06
fuente: [src/components/AboutSection.astro]
---

# Sobre mí: estructura y excepciones

Fuente: [AboutSection.astro](../../../src/components/AboutSection.astro). Para el texto real de cada escena, ver [[Contenido-por-Seccion]]; esta nota cubre cómo está construido el componente.

## Layout de dos columnas

La portada, las escenas, formación/idiomas y skills comparten una única columna de contenido. A ≥900px hay una segunda columna reservada para un **rail sticky**. Ese rail no es el sidebar general del Hero ni un menú clicable — está marcado `aria-hidden="true"`, es puramente decorativo/indicador de progreso de lectura.

## `splitIntoBlocks(text, 2)`

Divide los textos por espacios tras `.`, `!` o `?`, y agrupa de dos en dos frases por párrafo visual. Preserva palabras y orden, pero normaliza los espacios en los puntos de unión — **una abreviatura con punto puede generar una separación no deseada** (p. ej. "Dr. Pérez", porque hay un espacio tras el punto). "Node.js" no se divide por su punto interno, ya que no va seguido de un espacio.

> [!tip] Caveat de uso real
> La portada **solo** consume `aboutMe.paragraphs[0]`. Otros elementos añadidos al array no aparecerían nunca, y un array vacío rompería esa llamada. Las escenas, en cambio, sí recorren **todos** sus párrafos — comportamiento distinto entre la portada y las escenas, fácil de olvidar al editar contenido.

## `TONE_COLORS` y visuales por escena

`TONE_COLORS` admite las claves `cyan`, `violet`, `gold` y `coral`, con acentos oscuros sobre fondo beige. **No tiene fallback** para una clave desconocida — una escena con un `tone` no reconocido no degrada con gracia.

Los visuales (diagrama de red, pipeline vertical, triángulo, nube de palabras) se renderizan por **presencia de campos** (`networkBranches`, `pipeline`, `triangleVertices`, `words`) — el tipo no obliga a elegir exactamente uno. Si una escena rellena varios campos de visual a la vez, se mostrarán varios simultáneamente (no hay exclusión mutua). El triángulo accede a tres posiciones fijas; sus datos deben conservar exactamente tres vértices.

## Rail e IntersectionObserver

Un `IntersectionObserver` con `rootMargin: "-45% 0px -45% 0px"` activa la escena que cruza la banda central de la pantalla. Entre las entradas que intersectan simultáneamente, elige la más cercana al borde superior. Marca el nodo correspondiente y actualiza la variable CSS `--ab-rail-progress` a `(índice + 1) / número de escenas` — es un progreso **por escena activa**, no un progreso continuo por píxel de scroll.

Si no hay intersecciones en un momento dado, conserva el último estado. Si el navegador no soporta `IntersectionObserver`, queda el estado inicial del markup (sin activación dinámica). El observer puede seguir existiendo aunque el rail esté oculto visualmente en móvil — no se desactiva por CSS.

## Responsive

A ≤640px las ramas del diagrama de red se apilan y el triángulo se convierte en una lista sin SVG. Los iconos de skills son decorativos (14px), acompañados siempre de nombre visible como texto. Un icono `null` en los datos omite la imagen limpiamente; un nombre de archivo inexistente en cambio produciría una imagen rota, porque **no hay manejador de error** en el `<img>`.

## Relacionado

[[Contenido-por-Seccion]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] · [[Hero-y-Sidebar]]
