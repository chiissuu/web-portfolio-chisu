---
tags: [componente, about, layout]
actualizado: 2026-10-07
fuente: [src/components/AboutSection.astro]
---

# Sobre mí: estructura y excepciones

Fuente: [AboutSection.astro](../../../src/components/AboutSection.astro). Para el texto real de cada escena, ver [[Contenido-por-Seccion]]; esta nota cubre cómo está construido el componente.

## Layout y alineación

Portada, escenas, formación/idiomas y skills comparten una única columna de contenido. Se retiró el indicador decorativo Cimientos–Impulso y su IntersectionObserver para evitar una segunda columna lateral junto al menú principal. Desde 1200px, el contenedor empieza tras el ancho del sidebar más 1,5rem y añade 2rem de padding interior. Móvil y tablet conservan el espaciado previo.

La introducción completa (etiqueta, título, ubicación/idiomas y biografía) se centra dentro del área de contenido. El título usa `clamp(2.1rem, 6.4vw, 4.6rem)`; la biografía, `clamp(1.05rem, 1.4vw, 1.35rem)`, ancho máximo 60ch e interlineado 1.65. También crecen ligeramente la etiqueta y la línea de ubicación/idiomas. Los títulos de Mi base actual y Mi sistema de trabajo siguen centrados; el interior de las tarjetas conserva su alineación de lectura.

A ≥1280px, las cuatro escenas comparten `.ab-scene-grid`: `.ab-scene-copy` agrupa encabezado, destacado, prosa y CTA; el visual es su hermano y se alinea arriba, con ancho máximo 24rem. Las columnas tienen proporción `1fr / 0.62fr`; `.ab-scene-reverse` las invierte en `direction` (Hacia dónde voy) y `drive` (Lo que me mueve), colocando visual a la izquierda y texto a la derecha. Ya no se usa `display: contents` ni se centra el gráfico verticalmente respecto a toda la prosa. `foundations` y `product` conservan texto a la izquierda y visual a la derecha. Por debajo de 1280px, las cuatro escenas vuelven a una columna, con título y texto antes del visual. El orden del DOM permanece igual.

## Apariencia y continuidad con el Hero

Tema `.section-theme-dark` con fondo carbón: comienza en `--section-dark-start` (`#050505`), igual que el fondo estructural del Hero, pasa a `#191919` durante `--ab-blend-height: clamp(10rem, 20svh, 14rem)`, después a `#121212` en la zona de lectura y a `#0d0d0d` al final. Reutiliza la imagen del Hero en un pseudo-elemento decorativo de hasta 1400px de alto, con grayscale(1), brightness(0.65), opacidad 0.55 y máscara que introduce la textura desde transparente durante ese mismo tramo y la desvanece al final. Ambos fondos coinciden en el borde para evitar una línea horizontal durante el fundido. La URL incorpora BASE_URL; no se genera otro asset. El filtro solo afecta al fondo, no a los textos o las tarjetas. Paleta neutra: texto `#f2f2f2`, texto secundario `#bdbdbd` y acento local `--ab-accent: #c9c9c9`; bordes y superficies usan blanco con opacidad. La portada mantiene título y biografía en una columna. Los diagramas tienen superficies discretas y pasan al lado del texto a ≥1280px; por debajo quedan debajo. El menú lateral general conserva su geometría, enlaces y timeline; detecta automáticamente el tema oscuro de About y usa una paleta monocroma cuando esta sección está activa.

La sección no crea un contexto aislado de capas. Su textura decorativa usa `z-index: 0`, el Hero fijado usa 2 y `.ab-inner` usa 3: el texto entra con el scroll por encima del fondo del Hero, sin esperar a que termine su fundido. No añadir `isolation`, `transform` u otro contexto al contenedor exterior sin revisar este orden con [[Hero-y-Sidebar]].

## Presentación de la prosa

`splitIntoBlocks(text, groupSizes = [2])` divide por espacios tras `.`, `!` o `?`. El último tamaño de grupo se repite: `[2]` agrupa por parejas; `foundations` usa `[2, 1]` para mantener la apertura junta y dar un párrafo a cada proyecto y a la conclusión. Preserva palabras y orden, pero normaliza los espacios en los puntos de unión — **una abreviatura con punto puede generar una separación no deseada** (p. ej. "Dr. Pérez", porque hay un espacio tras el punto). "Node.js" no se divide por su punto interno, ya que no va seguido de un espacio. Los tamaños son constantes positivas definidas en el componente; no pasar un array vacío ni ceros.

La prosa de las escenas se limita a 60ch, usa interlineado 1.7 y separa sus párrafos con 1.25rem. `SCENE_EMPHASIS` selecciona unas pocas expresiones de los textos en español e inglés. `emphasize()` genera segmentos de texto y nodos `<strong>`; no introduce HTML con `set:html` ni añade palabras. Si cambia una expresión en `site.js`, puede dejar de destacarse hasta ajustar esta configuración de presentación.

> [!tip] Caveat de uso real
> La portada **solo** consume `aboutMe.paragraphs[0]`. Otros elementos añadidos al array no aparecerían nunca, y un array vacío rompería esa llamada. Las escenas, en cambio, sí recorren **todos** sus párrafos — comportamiento distinto entre la portada y las escenas, fácil de olvidar al editar contenido.

## `TONE_COLORS` y visuales por escena

`TONE_COLORS` conserva las claves `cyan`, `violet`, `gold` y `coral`; todas apuntan a `--ab-accent`, el acento gris local. **No tiene fallback** para una clave desconocida — una escena con un `tone` no reconocido no degrada con gracia.

`SCENE_ICONS` usa los iconos monocromos Blocks, TrendingUp, Lightbulb y Zap de `lucide-astro`, ya instalado. Se eligen por ID de escena, son decorativos y una escena desconocida usa Blocks. El campo histórico `emoji` sigue en los datos, pero About ya no lo renderiza.

Los visuales se renderizan por **presencia de campos** (`networkBranches`, `pipeline`, `triangleVertices`, `words`) — el tipo no obliga a elegir exactamente uno. Si una escena rellena varios campos de visual a la vez, se mostrarán varios simultáneamente (no hay exclusión mutua): la distribución actual se ha comprobado con un solo visual por escena.

- `networkBranches`: tres tarjetas de proyectos, con tecnología y proyecto en la misma fila. Una línea vertical y pequeños conectores CSS las relacionan; ya no hay un organigrama horizontal.
- `pipeline`: tres etapas verticales de ancho idéntico y flechas centradas en su eje.
- `triangleVertices`: triángulo SVG de 16rem de alto; sus etiquetas se sitúan arriba y debajo de la figura, fuera de las líneas. Accede a tres posiciones fijas; los datos deben conservar exactamente tres vértices.
- `words`: seis conceptos con el mismo peso tipográfico, en una rejilla de dos columnas; ya no hay tamaños ni opacidades distintos por palabra.

## Responsive

Las tarjetas de proyectos y el pipeline permanecen verticales en todas las anchuras. A ≤640px el triángulo se convierte en una lista sin SVG. La rejilla de conceptos mantiene dos columnas. Los iconos de skills son decorativos (14px), acompañados siempre de nombre visible como texto. Un icono `null` en los datos omite la imagen limpiamente; un nombre de archivo inexistente en cambio produciría una imagen rota, porque **no hay manejador de error** en el `<img>`.

## Relacionado

[[Contenido-por-Seccion]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] · [[Hero-y-Sidebar]]
