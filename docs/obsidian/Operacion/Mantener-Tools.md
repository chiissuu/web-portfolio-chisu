---
tags: [operacion, mantenimiento, tools]
actualizado: 2026-11-01
fuente: [src/content/site.js, src/lib/content-types.ts, src/components/ToolsSection.astro, src/components/ToolsCatalog.astro, src/components/ToolsBridge.astro, src/components/ToolArt.astro]
---

# Mantener la sección Tools

Tools es el «banco de herramientas» de la home: un catálogo pensado para **crecer mucho** (se van añadiendo herramientas continuamente). Nada se cuenta ni se lista a mano: el contador, los filtros y «Ver todas» salen de los datos. Todo el contenido está en [site.js](../../../src/content/site.js) (ES y EN).

> Git lo ejecuta siempre el usuario: esta nota no incluye ni ejecuta comandos de Git.

## Añadir una herramienta

1. En `tools.page.items` de [site.js](../../../src/content/site.js) añadir un objeto (y **el mismo en `en.tools.page.items`**):

```js
{
  title: "Nombre de la herramienta",
  status: "Disponible",            // etiqueta visible (en cada idioma)
  state: "available",              // clave fija: available | building | soon
  category: "Vídeo",               // etiqueta de grupo (en cada idioma)
  text: "Qué hace, en una o dos frases.",
  tags: ["Vídeo", "Audio", "Local"],
  cta: "Abrir herramienta",        // texto de la acción (sin href: se muestra apagado)
  href: "/ruta/",                  // opcional; sin él la tarjeta no es un enlace
  featured: false,                 // opcional: sale en «Destacadas» (máx. 3 a la vez)
  art: "video",                    // opcional: video | social (icono; otro valor = engranaje)
},
```

2. Nada más: el contador (`N herramientas · M disponibles`), los chips de categoría y el límite de «Ver todas» se recalculan solos. Para que aparezca en la vista inicial, `featured: true` (solo caben las 3 primeras).

## Reglas del catálogo

| Cosa | Cómo se comporta |
|---|---|
| Vista inicial | **Destacadas**: solo las herramientas con `featured: true`, como máximo 3 (`featuredLimit` en [ToolsCatalog.astro](../../../src/components/ToolsCatalog.astro), por defecto 3; si hay más, salen las 3 primeras en el orden escrito). Así una lista larga nunca se abre en cascada. Sin ninguna destacada, el catálogo abre en la primera categoría |
| Categorías | Un chip por cada valor distinto de `category`, después de «Destacadas». Una categoría nueva crea su chip sin tocar código. Se escribe igual en todas las herramientas del grupo (es una cadena, no una clave). **No hay chip «Todas» ni filtros de estado** |
| «Ver todas (N)» | En una categoría se ven las primeras 6 (`limit`, por defecto 6) y el botón despliega el resto in situ; no depende de ninguna ruta. La vista «Destacadas» no lleva botón |
| Estado (`state`) | Clave fija (`available`, `building`, `soon`) que solo decide el color del LED y cuenta para «M disponibles» del contador; `status` es la etiqueta visible. Ya no se filtra por estado |
| Una sola herramienta en vista | Se muestra ancha, con el icono grande (clase `is-wide`, puesta por el script); varias se muestran como tarjetas compactas que se centran |
| Sin JavaScript | Se ven todas las tarjetas y se oculta la barra de chips |
| Iconos | [ToolArt.astro](../../../src/components/ToolArt.astro): añadir un bloque `{kind === "nombre" && (...)}` (viewBox 120×120, trazos `currentColor`) y usar `art: "nombre"` |

Los textos del catálogo (`Destacadas`, `Ver todas ({n})`, `Ver menos`, vacío, palabras del contador) están en `servicesTools.tools.catalog` (ES y EN). La página `/tools` **no existe** en esta rama; si se crea, «Ver todas» puede apuntar a ella.

## La transición desde Servicios

[ToolsBridge.astro](../../../src/components/ToolsBridge.astro) (slot `bridge`; Tools usa `edge="flat"` y `grid={false}`):

- **Frontera estática («Labio de metal», siempre):** degradado negro → oro → champán con **estrías de cepillado** sobre el final de Servicios (`.tb-fade`) y, en vez de una regla, un **labio biselado de metal cepillado** con una fila de remaches (`.tb-lip`; borde claro arriba, cara oscura abajo, sombra sobre la placa) por el que pasa un destello. El hilo central lo cruza en un **tornillo hexagonal** (`.tb-bolt`) que se enciende. La regla con escala es de Servicios y el horizonte es de Contacto: no repetirlas aquí. Con `data-theme-trim` en `#services` la barra lateral pasa a tema claro a mitad del degradado.
- **Hilo de luz (≥1200px y con movimiento):** de los dos rombos de cierre de Servicios salen dos hilos a ambos lados del botón dorado, giran hacia dentro, se juntan en un rombo, siguen como un solo hilo (marca de registro al cruzar la regla) hasta un rombo sobre el título, que se descubre de arriba abajo; después un destello metálico cruza la placa y suben la introducción y el catálogo. Todo por tiempo, disparado cuando el botón de Servicios entra en pantalla (`bottom 78%`, `refreshPriority: -6`); al subir se revierte.
- Posiciones medidas (rombos de cierre, botón, título); el hueco bajo el botón de Servicios (`margin-bottom` en `ServicesSection`) debe seguir siendo mayor que el degradado.

## Comprobación

1. `npm run check` y `npm run build`.
2. Escritorio ≥1200px: hilos rodeando el botón, rombo de unión, hilo central, título descubierto, destello, catálogo; los filtros (categoría, estado, «Todas») cambian las tarjetas; con herramientas de más, «Ver todas».
3. <1200px o «reducir movimiento»: solo degradado y regla. Móvil: sin desbordamiento horizontal.

## Relacionado

[[Mantener-Servicios]] · [[Comandos-y-Pruebas]] · [[Contenido-por-Seccion]] · [[Otras-Secciones-y-Compartidos]]
