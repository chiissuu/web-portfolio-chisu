---
tags: [operacion, comandos, testing]
actualizado: 2026-10-06
fuente: [package.json, scripts/copy-ffmpeg-core.mjs]
---

# Comandos y recorrido de pruebas

## Comandos del proyecto

Ejecutar desde `C:\Users\jesus\OneDrive\Escritorio\portfolio-web-chiissuu`:

```powershell
npm run dev
npm run check
npm run build
npm run preview
npm run copy:ffmpeg-core
```

`dev` inicia Astro. `preview` sirve el build ya existente — **no** sustituye al build, si no se ha compilado antes sirve lo que hubiera de una vez anterior. `npm run astro -- <comando>` expone la CLI de Astro directamente. En una instalación nueva, `npm ci` usa el lockfile y ejecuta `postinstall` automáticamente.

[copy-ffmpeg-core.mjs](../../../scripts/copy-ffmpeg-core.mjs) copia desde `node_modules/@ffmpeg/core/dist/umd/` el JS y el WASM a `public/ffmpeg/`. Crea el destino si no existe y **sobrescribe** esos dos archivos si ya estaban. Si falta el directorio fuente, avisa y retorna sin fallar la instalación; si falta solo un archivo, lo salta y avisa igual. Esto significa que hay que comprobar manualmente que ambos recursos existan después de instalar, aunque `npm install` termine en verde — un archivo anterior podría quedarse si falta su reemplazo.

Al publicar, `dist/` debe incluir las cuatro rutas, `_astro/`, `assets/` y `ffmpeg/`. Omitir el WASM permite que la página cargue pero rompe la conversión. No hay backend que arrancar aparte del propio servidor estático. `node_modules` debe instalarse en la misma plataforma donde se compila — una instalación hecha en Windows puede no servir en Linux por bindings nativos.

## Ejecución histórica (10 de septiembre de 2026)

| Verificación | Resultado |
|---|---|
| Node / npm | v24.17.0 / 11.13.0 |
| `npm run check` | Código 0; 42 archivos, 0 errores, 0 warnings, 126 hints |
| `tsc --noEmit --pretty false` | Sin diagnósticos |
| `npm run build` | Código 0; cuatro páginas estáticas generadas en 4,40s |
| CSS generado | Confirmado el ajuste 900–1399; confirmada la ausencia de los valores de retrato tablet 641–899 (ver [[03-Sistema-de-Diseno|Sistema-de-Diseno]]) |
| Comparación con recovery | Diferencias descritas en [[00-Empieza-Aqui]] |
| Referencias locales del HTML generado | 66 referencias absolutas de href/src comprobadas, ninguna ausente |
| `git diff --check` | Sin errores de espacios; Git avisa de normalización futura LF/CRLF en los archivos ya modificados |

El primer intento de `check` en el entorno restringido falló con `EPERM` al crear `AppData/Roaming/astro/Config` — se repitió con permiso de ejecución fuera del sandbox y terminó bien; **no es un defecto del código**. Los avisos de Vite sobre opciones `esbuild` obsoletas aparecen durante check/build aunque el resumen final de Astro diga 0 warnings. Los 126 hints incluyen código generado de FFmpeg y una variable no usada del menú — no son 126 errores de la aplicación.

Esta ejecución **no** incluyó: conversión real en navegador, comprobación visual multi-viewport, lector de pantalla, ni medición de rendimiento. No se ha desplegado, hecho commit, push, instalado dependencias ni modificado código fuente como parte de esa revisión.

## Verificación del 6 de octubre de 2026 tras actualizar dependencias

- Astro 7.3.5, integración React 7.0.0 y check 0.9.10.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints.
- `npm run build`: cuatro páginas, código de salida 0.
- `npm audit fix`: 0 vulnerabilidades notificadas; fast-uri 3.1.8 y http-cache-semantics 4.3.0.
- Arranque temporal mediante la API `dev` de Astro en el puerto 4322: reoptimización sin error de escaneo; GET de `/` y `/tools/video-converter/` con HTTP 200. Servidor temporal detenido al finalizar; el servidor del usuario no se detuvo.
- No se probó la conversión real ni el aspecto visual en navegador. Reiniciar el servidor del usuario tras los cambios de dependencias.
## Recorrido de prueba manual para próximos cambios

1. Cargar las cuatro rutas y verificar título, recursos y enlaces. En portada, recorrer las seis secciones y volver arriba.
2. Probar la entrada del Hero en scroll 0, con URL con ancla, con scroll antes de cargar fuentes, y con scroll durante la entrada. Revisar la frontera Hero/About y los temas independientes del sidebar (ver [[Hero-y-Sidebar]]).
3. Comprobar en 390×844, 768×1024, 900px de anchura, 1280×720, 1366×768, 1440×900 y escritorio ancho; probar resize cruzando 899/900px y alturas 850/950px.
4. Abrir el menú móvil con teclado: circular Tab/Shift+Tab, Escape, clic fuera, seleccionar un enlace, y resize con el menú abierto. Confirmar que el fondo se desbloquea correctamente.
5. Activar movimiento reducido antes de recargar y también durante la sesión; desactivar JS para revisar los reveals y el fallback de formularios (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] y [[Formularios]]).
6. Formularios: campo vacío, solo espacios, email inválido, envío válido, campos opcionales, envío repetido, y qué pasa si el futuro backend rechaza la petición. No esperar recibir un correo real con el stub actual.
7. Conversor: archivo vacío, formato no admitido, límites exactos y superiores, metadatos no legibles, selección rápida de dos archivos, MP3 en los tres bitrates, y MP4; reproducir las descargas resultantes (ver [[Conversor-de-Video]]).
8. Cancelar durante la descarga del motor y durante la conversión; reintentar, resetear, repetir el mismo archivo, comprobar el aviso de memoria, y bloquear los recursos del motor para provocar el error de carga.

## Revisión visual de Sobre mí (6 de octubre de 2026)

- Fondo bronce local, textos marfil y acentos dorados. Portada en una columna; indicador lateral retirado y diagramas junto al texto desde 1280px.
- Navegador real: escritorio 1440×900, móvil 390×844 y ancho intermedio 1024×768. Sin desbordamiento horizontal en las dos vistas reducidas comprobadas.
- Scroll hacia abajo y de regreso al Hero; continuidad de la transición sin el fondo beige previo. El enlace lateral Sobre mí llega al inicio de la sección y conserva `aria-current="location"` y sidebar visible.
- `npm run check`: 0 errores, 0 warnings, 126 hints. `npm run build`: cuatro páginas, código 0. `git diff --check`: sin errores.
- No se midió FPS ni se hizo una auditoría completa de accesibilidad. Los pendientes históricos del Hero/tablet y movimiento reducido siguen abiertos.
## Transición del dorado al carbón (6 de octubre de 2026)

- Las capturas del usuario muestran un corte horizontal durante el pin. Se coloca `.hx-pin` encima del fondo aislado de About y se añade desaturación y oscurecimiento del fondo antes del fundido final; el glow desaparece durante esa primera etapa.
- Se conservan los tiempos del morph y del sidebar. El filtro del fondo se limpia al pasar de modo animado a estático.
- `npm run check`: 42 archivos, 0 errores, 0 warnings, 126 hints. `npm run build`: cuatro páginas, código 0. `git diff --check`: sin errores de espacios.
- Verificación visual del cambio pendiente: la conexión al navegador agotó el tiempo de espera. Revisar el recorrido completo hacia abajo y arriba, resize y movimiento reducido; no se han medido FPS.

## Texto de Sobre mí durante la transición (7 de octubre de 2026)

- Las nuevas capturas del usuario confirman una regresión del ajuste anterior: el fondo del Hero ocultaba el texto de About hasta el tramo final. La sección seguía desplazándose en el flujo, pero quedaba debajo de una capa opaca.
- Se retira `isolation: isolate` de `.ab-section` y `.ab-inner` pasa a `z-index: 3`, por encima del pin (2) y por debajo del sidebar (90). Se mantienen el filtro, el fundido, `pinSpacing: false` y los tiempos del morph.
- `npm run build`: cuatro páginas, código 0. `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `git diff --check`: sin errores de espacios. Verificación visual pendiente: la conexión al navegador volvió a agotar el tiempo de espera. Revisar que el texto entre desde abajo antes de terminar el pin y conserve su luminosidad al bajar y subir.

## Borde superior del fondo de About (7 de octubre de 2026)

- La captura del usuario muestra que el texto ya entra correctamente, pero queda una frontera horizontal entre el fondo estructural del Hero y el de About durante el fundido.
- El degradado de About comienza ahora en el mismo `--section-dark-start` del Hero. El carbón y la textura aparecen gradualmente durante `clamp(10rem, 20svh, 14rem)`, sin cambiar las capas del contenido, el scroll ni el sidebar.
- `npm run build`: cuatro páginas, código 0. `git diff --check`: sin errores de espacios. Cambio limitado a CSS y documentación; la corrección visual aún debe comprobarse en navegador, cuya conexión falló en el intento anterior.

## Paleta monocroma de About y sidebar (7 de octubre de 2026)

- About usa texto blanco/gris, acentos `#c9c9c9` y superficies neutras. El sidebar activa `data-palette="mono"` con el mismo seguimiento de sección activa: PNG gris oscuro, métricas y botones grises, tarjetas sin tinte cálido.
- Navegador real en una pestaña nueva, 1280×720: comprobados el logo filtrado, título y enlace activo grises, sin desbordamiento horizontal. Al navegar a Proyectos el sidebar recupera `data-palette="brand"`, el logo sin filtro y el botón dorado; al volver a About recupera la paleta mono. La pestaña temporal se cerró; se conserva la del usuario.
- Captura local: `C:/Users/jesus/.codex/visualizations/2026/09/10/01a08adb-b7e2-7893-81b8-f4d1c3a19596/sobre-mi-monocromo.jpg`.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `npm run build`: cuatro páginas, código 0. `git diff --check`: sin errores de espacios. No se volvió a medir FPS ni a realizar una auditoría completa de accesibilidad.

## Alineación de los bloques de About (7 de octubre de 2026)

- Introducción completa centrada dentro del área de contenido; biografía limitada a 62ch. Títulos de Mi base actual y Mi sistema de trabajo centrados.
- En `direction` y `drive`, a partir de 1280px, visual a la izquierda y encabezado, destacado y prosa a la derecha. Las escenas `foundations` y `product` mantienen su distribución. El orden del DOM y los textos se conservan.
- Navegador real: revisados ambos bloques alternados y la introducción en 1280×720; comprobados centrado y orden apilado de las cuatro escenas en 390×844. Sin desbordamiento horizontal en ambas vistas. Se restauró el tamaño del navegador y se cerró la pestaña temporal.
- Capturas locales en la carpeta de visualizaciones de este chat: `sobre-mi-introduccion-centrada.jpg` y `sobre-mi-texto-derecha.jpg`.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `npm run build`: cuatro páginas, código 0. `git diff --check`: sin errores de espacios.

## Tipografía y visuales compactos de About (7 de octubre de 2026)

- Portada ampliada: título hasta 4.6rem (antes 3.9rem), biografía hasta 1.35rem (antes 1.2rem), ancho de lectura 60ch. Etiqueta y ubicación/idiomas ligeramente mayores.
- Las cuatro escenas comparten una rejilla de texto y visual alineados arriba. Se mantiene la alternancia acordada: `direction` y `drive` llevan el gráfico a la izquierda en escritorio. Por debajo de 1280px, texto primero y visual después.
- Tarjetas de proyectos conectadas, etapas de pipeline de igual ancho con flechas centradas, etiquetas del triángulo fuera de las líneas y seis conceptos en una rejilla uniforme. Iconos de encabezado Lucide monocromos. Ver [[Sobre-Mi]] para la implementación.
- Navegador real en 1280×720, 1920×1080, 1024×768 y 390×844: sin desbordamiento horizontal; verificadas las columnas de escritorio, el orden apilado de tablet/móvil, las etapas de igual ancho y los conceptos dentro de sus celdas. Revisada la entrada desde el Hero y el menú móvil. El enlace lateral About llega al inicio de la sección, mantiene `aria-current="location"` y paleta mono. Se restaura el tamaño del navegador y se cierra la pestaña temporal. No se midieron FPS ni se repitió una auditoría completa de accesibilidad.
- Comparación del HTML compilado con `content.es.about`: la introducción y la prosa de las cuatro escenas conservan todas las palabras y su orden. Solo cambian agrupación de párrafos y énfasis. No se modifica `site.js`.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `npm run build`: cuatro páginas, código 0. `git diff --check`: sin errores de espacios.
- Capturas en la carpeta de visualizaciones de este chat: `sobre-mi-tipografia-ampliada.jpg`, `sobre-mi-proyectos-compactos.jpg`, `sobre-mi-conceptos-ordenados.jpg` y `sobre-mi-portada-movil-ampliada.jpg`.

## Cómo mantener este vault al día

Actualizar junto al cambio de código: rutas, contratos, límites, estados, fuentes y hallazgos afectados. Volver a medir antes de copiar resultados de build o tamaños de archivo — no asumir que siguen igual. El contenido de [[Contenido-por-Seccion]] es una instantánea de `site.js`: al editar ese archivo, hay que regenerar o actualizar la nota — nunca debe convertirse en una segunda fuente de la aplicación. No dejar un hallazgo marcado como abierto en [[Hallazgos-y-Pendientes]] cuando el código y una prueba pertinente ya confirmen que está resuelto.

## Relacionado

[[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] · [[Hallazgos-y-Pendientes]] · [[Hero-y-Sidebar]] · [[Conversor-de-Video]]
