---
tags: [operacion, mantenimiento, proyectos]
actualizado: 2026-10-31
fuente: [src/content/site.js, src/lib/content-types.ts, src/components/ProjectsSection.astro, src/components/ProjectCard.astro, src/components/ProjectArt.astro, src/components/ProjectMoreCard.astro, src/components/ShowcaseSection.astro]
---

# Mantener la sección Proyectos

La sección **Proyectos** se dio por terminada el 31 de octubre de 2026 (carrusel horizontal anclado, cabecera con hilo de luz, contador 01 / 06, cierre luminoso hacia «Mi stack de trabajo»). Esta nota explica cómo **añadir, quitar o modificar un proyecto sin tocar código de diseño ni romper las animaciones**. La regla de oro: *todo lo que cambia con los proyectos sale de los datos*; las animaciones se recalculan solas.

> Git lo ejecuta siempre el usuario: esta nota no incluye ni ejecuta comandos de Git.

## Dónde viven los datos

Un único archivo, en **dos sitios** (español e inglés): [site.js](../../../src/content/site.js) → `es.projects.items` y `en.projects.items`. El contrato de tipos está en [content-types.ts](../../../src/lib/content-types.ts) (`ProjectItem`, `ProjectsContent`). No hay que tocar `ProjectsSection.astro`, `ProjectCard.astro` ni `ShowcaseSection.astro` para añadir o quitar proyectos.

## Qué se recalcula solo

| Cosa | Cómo se adapta |
|---|---|
| Contador «NN / total» | Cuenta las tarjetas con `data-sc-card` (una por proyecto; la tarjeta final «Ver más en GitHub» **no** cuenta) |
| Barras de progreso (izquierda y derecha) | Avanzan con el recorrido del carrusel, con el número de proyectos que haya |
| Distancia del carrusel anclado | Se mide del ancho real de la fila: más proyectos = más scroll anclado |
| Rombos de la regla de cierre y camino de luz hasta el stack | Dependen de dónde termina el anclaje, no de cuántos proyectos hay |
| Tarjeta final «Ver más en GitHub» | Siempre es la última (texto y enlace en `moreLabel` / `moreHref`) |
| Móvil (<900px) y «reducir movimiento» | Sin anclaje: tira que se desliza con el dedo; todo sigue funcionando |
| Esquemas laterales de la cabecera | Son las ilustraciones de los **dos primeros proyectos que tengan `art`** (ver «Orden = destacados») |

## Añadir un proyecto

1. Abrir [site.js](../../../src/content/site.js) y duplicar un objeto de `es.projects.items` (por ejemplo el 02, que tiene enlace) al final de la lista.
2. Rellenar los campos (tabla siguiente). Usar el siguiente **id de dos cifras**: `"07"`, `"08"`…
3. Hacer **lo mismo en `en.projects.items`** con los textos en inglés (aunque el inglés aún no se sirva; mantenerlos sincronizados evita sorpresas el día que se publique, ver [[Bilingue-ES-EN]]).
4. Guardar y comprobar (ver «Comprobación»).

Plantilla:

```js
{
  id: "07",
  art: "graph",                       // opcional: network | cache | order | shop | graph | target
  category: "AUTOMATIZACIÓN",         // una o dos palabras, en mayúsculas
  tags: ["Python", "Playwright"],     // hasta 3 etiquetas cortas
  title: "Nombre del proyecto",
  description: "Qué hace, en una o dos frases (≈ 180 caracteres como máximo).",
  status: "",                         // "" = sin estado; "En desarrollo" muestra un punto que parpadea
  href: "https://github.com/chiissuu/repositorio", // opcional
  metric: { value: "0,99", label: "exactitud" },    // opcional (solo con art)
},
```

## Campos de cada proyecto

| Campo | Obligatorio | Qué hace / límites |
|---|---|---|
| `id` | Sí | Texto de dos cifras (`"01"`…). Es el número de la pastilla de la tarjeta y elige el **tinte** de color: `tintes[(id − 1) mod 6]`, es decir, los colores se repiten cada 6 proyectos. Mantenerlos correlativos |
| `category` | Sí | Etiqueta pequeña sobre el título («SISTEMAS»). Con `status` se muestra «CATEGORÍA · estado» |
| `tags` | Sí | Pastillas arriba a la derecha. Máximo 3 y cortas: no se parten y, si sobran, saltan de línea y pueden tapar la ilustración |
| `title` | Sí | Hasta dos líneas cómodas |
| `description` | Sí | Unos 180–190 caracteres como máximo (las más largas actuales tienen 182). Si es más larga el texto sube y se acerca a la ilustración; probar a 1280px de ancho |
| `status` | Sí (puede ser `""`) | Con texto aparece tras la categoría y un punto dorado que parpadea («En desarrollo»). Con `""` no se muestra nada |
| `href` | No | Sin `href` la tarjeta no es un enlace y su flecha se atenúa (útil para un notebook sin repositorio). Con `http(s)://` se abre en pestaña nueva |
| `art` | No | Ilustración de línea dorada. Valores válidos: `network`, `cache`, `order`, `shop`, `graph`, `target` (en [ProjectArt.astro](../../../src/components/ProjectArt.astro)). Un valor que no exista **dibuja la zona vacía**, así que omitir el campo o usar uno de la lista |
| `metric` | No | Cifra grande sobre la ilustración (hoy «0,99 exactitud»). Solo está pensada para proyectos con `art` |

### Orden = destacados
La lista se muestra tal cual está escrita. Los **dos primeros proyectos con `art`** dan los dibujos grandes y tenues a los lados del título (cabecera). Si en el futuro hay 20 proyectos pero solo quieres destacar unos pocos, ponlos **primero** y deja los demás después. Con menos de dos proyectos con `art` simplemente aparece un esquema o ninguno.

## Quitar un proyecto

1. Borrar su objeto en **los dos** arrays (`es` y `en`).
2. Renumerar los `id` siguientes para que sigan siendo correlativos (no es obligatorio para que funcione, pero evita saltos como 01, 02, 04 y que los tintes salgan descolocados).
3. Comprobar (ver más abajo). El contador, la distancia del carrusel y los esquemas laterales se ajustan solos.

Si se quedan **cero** proyectos, la fila solo mostraría la tarjeta «Ver más en GitHub» y el contador no tiene sentido: no vaciar la lista sin revisar el diseño.

## Modificar un proyecto

Editar el objeto en **los dos** idiomas. Cuidados:
- Cambiar la `art` cambia la ilustración de la tarjeta y, si es uno de los dos primeros con arte, también la del lateral de la cabecera.
- Añadir `status` a un proyecto lo marca «en desarrollo» con el punto que parpadea; quitarlo (`""`) lo apaga.
- La frase de la cabecera (`projects.note`) es genérica y **no depende de los proyectos**; `noteStrong` son frases que deben aparecer **literalmente** dentro de `note` (si se cambia el texto de `note` hay que cambiarlas también o dejan de ponerse en negrita).
- El texto de «Ver más en GitHub» y su enlace: `projects.moreLabel` y `projects.moreHref` (en los dos idiomas).

## Añadir una ilustración nueva (opcional)

En [ProjectArt.astro](../../../src/components/ProjectArt.astro): añadir un bloque `{kind === "nombre" && (...)}` dentro del `<svg viewBox="0 0 200 130">` con trazos en `currentColor` (el dorado lo pone la tarjeta). Las ilustraciones usan nodos con relleno oscuro `#0f0e0a` para tapar líneas; en la cabecera ese relleno se sustituye por el color del fondo (regla `.pj-motif circle[fill="#0f0e0a"]` en [ProjectsSection.astro](../../../src/components/ProjectsSection.astro)): usar ese mismo color de relleno en las ilustraciones nuevas. Después usar `art: "nombre"` en los datos.

Si se necesitan más de 6 colores de tarjeta, ampliar el array `tints` de [ProjectCard.astro](../../../src/components/ProjectCard.astro) (pares `[claro, oscuro]`).

## Comprobación tras cualquier cambio

1. `npm run check` → 0 errores (el contrato `ProjectItem` avisa de campos que falten o sobren).
2. `npm run build` → termina bien.
3. `npm run dev` y revisar en escritorio: (a) el contador «NN / total» marca el total correcto; (b) al terminar el recorrido se ve entera la última tarjeta (la de GitHub) antes de soltarse el anclaje; (c) los textos no se salen de las tarjetas; (d) los rombos de la regla de cierre se encienden y el camino de luz llega al título del stack.
4. Reducir la ventana a ≤899px: tira con deslizamiento, sin desbordamiento horizontal.
5. Si algo se ve «sin formato» en el servidor de desarrollo tras reescribir un archivo entero, reiniciar `astro dev` y recargar con Ctrl+F5 (ver [[Comandos-y-Pruebas]]).

## Síntomas habituales

| Síntoma | Causa probable |
|---|---|
| Una tarjeta sin dibujo | `art` con un valor que no está en `ProjectArt.astro` |
| El contador marca un total distinto | Se añadió una tarjeta a mano sin `data-sc-card`, o se olvidó borrar un proyecto |
| Colores repetidos | Hay más de 6 proyectos (comportamiento esperado; ampliar `tints`) |
| El texto sale por abajo de la tarjeta | `description` demasiado larga |
| La tarjeta no se abre | Falta `href` (es lo previsto) o el enlace no empieza por `http` |
| Frases sin negrita en la cabecera | `noteStrong` ya no coincide literalmente con `note` |
| El inglés no coincide | Se editó solo el array `es` |

## Lo que no hay que tocar

Constantes de animación en [ShowcaseSection.astro](../../../src/components/ShowcaseSection.astro) (`LIGHT_AT`, `RUN_TIME`, `BORN_AT`) y en [SkillsStack.astro](../../../src/components/SkillsStack.astro) (`START_AT`, `RUN_THREADS`, `RUN_RULES`): están medidas para el bloque anclado y no dependen del número de proyectos. Detalle de la historia y de los valores en [[Comandos-y-Pruebas]] y [[Otras-Secciones-y-Compartidos]].

## Relacionado

[[Contenido-por-Seccion]] · [[Otras-Secciones-y-Compartidos]] · [[Bilingue-ES-EN]] · [[Comandos-y-Pruebas]] · [[Logos-Stack]]
