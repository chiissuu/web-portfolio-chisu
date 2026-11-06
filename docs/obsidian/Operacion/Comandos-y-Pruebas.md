---
tags: [operacion, comandos, testing]
actualizado: 2026-10-10
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

[copy-ffmpeg-core.mjs](../../../scripts/copy-ffmpeg-core.mjs) copia desde `node_modules/@ffmpeg/core/dist/esm/` el JS y el WASM a `public/ffmpeg/`. Crea el destino si no existe y **sobrescribe** esos dos archivos si ya estaban. Si falta el directorio fuente, avisa y retorna sin fallar la instalación; si falta solo un archivo, lo salta y avisa igual. Esto significa que hay que comprobar manualmente que ambos recursos existan después de instalar, aunque `npm install` termine en verde — un archivo anterior podría quedarse si falta su reemplazo.

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

### Prueba reproducible del conversor — 10 de octubre de 2026

Desde la raíz del repositorio:

```powershell
npm run copy:ffmpeg-core
node scripts/test-video-converter.mjs
```

Abrir `http://localhost:4324/__converter-check.html` y pulsar «Verificar motor, MP3, MP4, errores y cancelación». Detener con Ctrl+C. El script sirve solo dos rutas de prueba adicionales mientras está activo; no se copian al build. Usa el wrapper real, el núcleo ESM local y `sintetico.avi` de las evidencias de auditoría. No requiere instalar paquetes.

Resultado obtenido: **6/6** — carga/reutilización, MP3 decodificado (10.701 bytes, 1s, mono), MP4 decodificado (6.549 bytes, 1s, 32×32), corrupto/reintento, cancelación durante carga/recarga y cancelación durante conversión/reintento. Se descargó además `sintetico.mp3` desde el preview de la interfaz. La prueba no mide rendimiento con 200MiB, compatibilidad entre navegadores o hosting real.

La configuración separa `node_modules/.vite-astro-dev` y `.vite-astro-build` mediante el hook `astro:config:setup`: una optimización de producción ya no sustituye el runtime JSX de un dev abierto. Es importante distinguir el comando de **Astro**, porque el build también crea un servidor interno de Vite. El fallo `_jsxDEV` se reprodujo con el runtime de producción en la caché compartida; una caché independiente monta la isla correctamente. Reiniciar `npm run dev` y recargar la pestaña si sigue usando módulos de una sesión anterior.

### Recorrido general

1. Cargar las cuatro rutas y verificar título, recursos y enlaces. En portada, recorrer las seis secciones y volver arriba.
2. Probar la entrada del Hero en scroll 0, con URL con ancla, con scroll antes de cargar fuentes, y con scroll durante la entrada. Revisar la frontera Hero/About y los temas independientes del sidebar (ver [[Hero-y-Sidebar]]).
3. Comprobar en 390×844, 768×1024, 900px de anchura, 1280×720, 1366×768, 1440×900 y escritorio ancho; probar resize cruzando 899/900px y alturas 850/950px.
4. Abrir el menú móvil con teclado: circular Tab/Shift+Tab, Escape, clic fuera, seleccionar un enlace, y resize con el menú abierto. Confirmar que el fondo se desbloquea correctamente.
5. Activar movimiento reducido antes de recargar y también durante la sesión; desactivar JS para revisar los reveals y el fallback de formularios (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] y [[Formularios]]).
6. Formularios: campo vacío, solo espacios, email inválido, envío válido, campos opcionales, envío repetido, y qué pasa si el futuro backend rechaza la petición. No esperar recibir un correo real con el stub actual.
7. Conversor: archivo vacío, formato no admitido, límites exactos y superiores, metadatos no legibles, selección rápida de dos archivos, MP3 en los tres bitrates, y MP4; reproducir las descargas resultantes (ver [[Conversor-de-Video]]).
8. Cancelar durante la descarga del motor y durante la conversión; reintentar, resetear, repetir el mismo archivo, comprobar el aviso de memoria, y bloquear los recursos del motor para provocar el error de carga.

> [!note] Registro histórico de About (6–9 de octubre)
> Las secciones fechadas siguientes (hasta «Dos grupos, introducción y cierre destacados») describen estados **ya superados**: fondo bronce, paleta monocroma del sidebar, escenas y diagramas, rail, trazos SVG y Mi base actual. El estado vigente de About (grafito cálido #24221f, dorado, sidebar `brand`, siete párrafos y 42 herramientas) está en [[Sobre-Mi]], [[Hero-y-Sidebar]] y [[Auditoria-Sobre-Mi]]. Se conservan como bitácora de verificación, no como descripción actual.

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

## Márgenes equilibrados de About (7 de octubre de 2026)

- Corrección local desde 1200px: el contenido se centra entre el borde visible del nav y el borde derecho de la página. `.ab-inner` ocupa esa área con padding simétrico y `.ab-body` conserva el ancho máximo de lectura.
- `--hx-sidebar-padding-inline` comparte el padding horizontal del sidebar con el cálculo de su borde visible. No cambia las dimensiones del menú ni el comportamiento de las otras secciones.
- Navegador real: márgenes de biografía de 177.10/177.35px en 1280×720 y 414.02/414.27px en 1920×1080. Diferencia inferior a 1px por redondeo del navegador. En 1024×768 y 390×844 se conserva el layout previo; sin desbordamiento horizontal en las cuatro vistas.
- `npm run build`: cuatro páginas, código 0. `git diff --check`: sin errores de espacios. No se repitió `astro check` para este ajuste exclusivo de CSS.
- Captura: `sobre-mi-margenes-equilibrados.jpg` en la carpeta de visualizaciones de este chat. Se restaura el tamaño del navegador y se cierra la pestaña temporal de comprobación.

## Marca y redes centradas en el sidebar (7 de octubre de 2026)

- PNG CHISU y descripción centrados en la tarjeta superior; LinkedIn, GitHub, Redes Sociales y botón Contacto centrados en la inferior. Ajuste de CSS, sin cambios de textos, enlaces ni orden del DOM.
- Navegador real, 1280×720: centros del logo y de los cuatro elementos sociales a menos de 0.01px del centro de sus tarjetas; descripción con `text-align: center`. Sidebar sin desbordamiento vertical. Revisada la bajada desde el Hero y la vuelta, sin errores de consola registrados.
- `npm run build`: cuatro páginas, código 0. `git diff --check`: sin errores de espacios.
- Captura: `sidebar-marca-y-redes-centradas.jpg` en la carpeta de visualizaciones de este chat. Pestaña temporal cerrada tras la comprobación.

## Resumen de Sobre mí y coincidencia del PNG (8 de octubre de 2026)

- «SOBRE MÍ» pasa a ser el único h2, de hasta 5.5rem. Se retiran el título compuesto y la línea de ciudad/idiomas; Madrid, español nativo e inglés C1 se integran en la introducción.
- Dos párrafos presentan formación, mención en Ingeniería de Datos (Big Data), U-TAD, tres años de trayectoria, base técnica y valor diferencial en diseño, negocio, finanzas y equipo competitivo. Incluyen la dirección hacia Data Science y machine learning. Se actualiza también la traducción EN.
- El usuario confirmó sustituir las cuatro escenas por este resumen. Se eliminan sus gráficos, contenido específico, tipos, helpers y estilos; permanecen Mi base actual y Mi sistema de trabajo.
- Durante el fundido, el logo animado corrige su centro horizontal con la posición real del PNG del sidebar. Comprobado alrededor del 70% de scroll en 1920px y 1280px, incluida la vuelta desde móvil: diferencias de centro inferiores a 0.01px. Sin errores de consola registrados.
- Navegador real: título de 88px en escritorio y 48px en 390×844; un único h2 y dos párrafos, sin desbordamiento horizontal. Revisado el cambio de tamaño y el enlace lateral About.
- El servidor dev retenía CSS antiguo incluso al recargar. Se confirmó su proceso Astro de este proyecto y se reinició únicamente ese servidor en localhost:4321; vuelve a servir los estilos correctos. Permanece activo en segundo plano.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `npm run build`: cuatro páginas, código 0. Comparación del HTML: resumen idéntico a `site.js`, sin escenas ni metadatos retirados, y formación/skills presentes. `git diff --check`: sin errores de espacios.
- Captura: `sobre-mi-resumen-nuevo.jpg` en la carpeta de visualizaciones de este chat. Se restaura el tamaño del navegador y se cierra la pestaña temporal de pruebas.

## Énfasis y tipografía de la biografía (8 de octubre de 2026)

- Inter para la biografía, aprovechando la fuente ya cargada: cuerpo 400, anotaciones 500 y negritas 600. Interlineado 1.75 y separación de párrafos 1.75rem, con gris claro para el cuerpo y blanco para los énfasis.
- Tres negritas, círculo SVG en `(Big Data)`, subrayado SVG en diseño gráfico y dos emojis decorativos. El círculo incluye paréntesis para impedir su salto aislado en móvil. Los selectores de las frases quedan en `aboutMe.accents` en ES/EN; no se modifica la redacción.
- Animación CSS de los trazos al activarse el reveal existente; estáticos con movimiento reducido. Sin dependencias nuevas ni cambios en el nav, el morph o las capas de fondo.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `npm run build`: cuatro páginas, código 0. Comprobación puntual del HTML generado: ambos párrafos idénticos a la fuente al retirar la decoración, tres strong y dos SVG; todos los selectores ES/EN coinciden una vez.
- Navegador real en 1920, 1280, 768 y 390px: sin desbordamiento horizontal. En 1280px, márgenes desde la tarjeta del nav y hasta el borde de contenido de 168.43/168.68px. Las negritas calculan peso 600; revisado el scroll desde el Hero y los trazos completos. Sin errores de consola registrados.
- Capturas: `sobre-mi-anotaciones-escritorio.jpg` y `sobre-mi-anotaciones-movil.jpg` en la carpeta de visualizaciones del chat. Se cierra la pestaña temporal y se restablece el viewport.

## Enlaces, ubicación e idiomas en la presentación (8 de octubre de 2026)

- La presentación inicial se separa en tres párrafos explícitos, después de cada punto: formación/ubicación, base técnica e idiomas. El párrafo diferencial posterior conserva su redacción y sus énfasis. Los cambios se reflejan en ES/EN.
- Carrera y mención enlazan al grado indicado por el usuario; el nombre completo de U-TAD enlaza a su URL de Maps. Los enlaces conservan negritas internas, permiten saltos de línea y tienen subrayado y foco visible. Big Data ya no lleva círculo.
- 📚 junto a U-TAD; Madrid/España en negrita y con franjas de color en las letras. 💻 inicia la base técnica, con full-stack subrayado, bases de datos/sistemas en negrita y arquitectura de software rodeada.
- Frase ES exacta: «Domino totalmente el español, tengo un nivel C1 de inglés y un A2 de alemán». Banderas decorativas locales es/gb/de junto a los idiomas; incorporan BASE_URL, alt vacío y aria-hidden. Se añaden tres SVG pequeños, sin nuevas dependencias.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `npm run build`: cuatro páginas, código 0. Comprobación del HTML: cuatro párrafos idénticos a la fuente al retirar la decoración, enlaces con las URLs solicitadas, círculo solo en arquitectura, selectores válidos en ES/EN y las tres banderas presentes en dist.
- Navegador en 390, 768, 1280 y 1920px: sin desbordamiento horizontal; banderas cargadas y de aproximadamente 19px en móvil. En 1280px, márgenes respecto al nav y borde derecho de 168.43/168.68px. El nav conserva su geometría y comportamiento.
- El servidor dev servía CSS antiguo, confirmado por la ausencia de reglas ab-flag en el navegador y su presencia en el build. Se identificó su proceso Astro de este checkout y se reinició solo ese servidor. Permanece en segundo plano en localhost:4321.
- Capturas: `sobre-mi-enlaces-y-banderas.jpg` y `sobre-mi-enlaces-y-banderas-movil.jpg` en la carpeta de visualizaciones del chat. Se restablece el viewport y se cierra la pestaña temporal.

## Perfil diferencial y disciplinas creativas (8 de octubre de 2026)

- El inicio dice «Lo que me diferencia de la competencia es la forma de conectar…». Se conserva literalmente la frase de esports sobre equipo, disciplina y decisiones bajo presión.
- Moda, música y redes sociales se relacionan con tendencias, estética, comunicación y conexión con una audiencia. El cierre expresa la idea de varias capas — técnica, visual, negocio y cultura — para dar profundidad y personalidad a los proyectos, sin añadir logros o métricas inventados. La dirección hacia Data Science y machine learning permanece.
- Ocho párrafos explícitos en ES/EN: tres introductorios y cinco de perfil. El cuarto lleva ab-profile-start con margen 2.5rem; se usa el selector p + p.ab-profile-start para superar la especificidad de p + p tras el scoping de Astro. Los demás párrafos mantienen 1.25rem.
- Círculo adicional en versión propia, subrayado en varias capas, negritas en las disciplinas y dirección técnica, emojis 👟/🎧/📱 junto a moda/música/redes. circle pasa a array y emojis reúne pares frase/símbolo; conserva los anteriores 📚 y 🎮 sin renders duplicados. Sin dependencias nuevas.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `npm run build`: cuatro páginas, código 0. HTML comprobado: ocho párrafos idénticos a site.js al retirar la decoración, esports exacto, dos círculos, tres subrayados, dos enlaces existentes y selectores válidos en ES/EN.
- Capturas del perfil: `sobre-mi-perfil-disciplinas.jpg` y `sobre-mi-perfil-disciplinas-movil.jpg` en la carpeta de visualizaciones del chat. Se revisa el scroll, se cierra la pestaña de pruebas y se restablece el viewport.
- Navegador real en 1920, 1280 y 390px: sin desbordamiento; en 1280px se mantienen márgenes de 168.43/168.68px respecto al nav y al borde derecho. El perfil se separa 40px (2.5rem) y el reveal muestra el texto en móvil. La coma se mantiene dentro del selector de versión propia para que no salte sola de línea. Sin errores de consola registrados.

## Biografía concisa y retirada de trazos (9 de octubre de 2026)

- Se conservan literalmente los cinco párrafos aprobados (presentación, base técnica, idiomas, diferenciación y esports). Moda/música/redes se resume en una frase sobre criterio visual y comunicación. El cierre mantiene versión propia, varias capas e identidad, sin la enumeración de disciplinas ni el último párrafo sobre Data Science/machine learning.
- Siete párrafos en ES/EN. Se retiran circle/underline de los datos y tipos, sus ramas SVG, estilos y keyframes. Los términos seleccionados pasan a negrita; se mantienen emojis, banderas y los subrayados funcionales de los enlaces. Sin cambios de fuentes, dependencias o navegación.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `npm run build`: cuatro páginas, código 0. Comparación SHA-256 antes/después de los cinco primeros párrafos, formación, idiomas y skills: idénticos en ambos idiomas. HTML generado: siete párrafos exactos, dos enlaces y ningún trazo SVG ni los textos retirados. Selectores de énfasis válidos en ES/EN.
- Navegador real en 1920, 1280 y 390px: sin desbordamiento horizontal; arquitectura de software con peso 600 y cero SVG de anotación en la biografía. Entrada al hacer scroll visible en móvil. Sin errores de consola registrados.
- Capturas: `sobre-mi-texto-limpio-portada.jpg`, `sobre-mi-texto-limpio.jpg` y `sobre-mi-texto-limpio-movil.jpg` en la carpeta de visualizaciones del chat. Se cierra la pestaña temporal y se restablece el viewport.
- Ideas de diseño propuestas, pendientes de elección: rótulos pequeños para agrupar el contenido, primer párrafo con más jerarquía y cierre destacado tipográficamente. No están implementadas en este cambio.

## Dos grupos, introducción y cierre destacados (9 de octubre de 2026)

- Se agrupan los siete párrafos, sin cambiar ninguna palabra, en «Quién soy» y «Qué me diferencia de la competencia». Ambos son h3 con aria-labelledby para su sección. groupLabels y closingPhrase se mantienen en ES/EN en site.js; los grupos vacíos se omiten.
- Primer párrafo de hasta 1.55rem y frase final destacada de hasta 1.65rem en fuente display. La frase se presenta dentro del mismo p, sin duplicación. Se mantienen enlaces, negritas, emojis, fondo, transición y geometría del nav.
- `npm run check`: 42 archivos, 0 errores, 0 warnings y 126 hints. `npm run build`: cuatro páginas, código 0. HTML comprobado: siete párrafos exactos, dos grupos y una frase destacada. SHA-256 del texto completo de los siete párrafos idéntico antes/después en ES/EN.
- Navegador real: 1920px, lead/body/cierre de 24.8/21.6/26.4px; en 1280px, 21.12/17.92/24.32px; en 390px, lead 18.4px y cierre 19.2px. Rótulo completo en una línea a 390px y dos a 320px, sin overflow interno de About. Revisadas también las vistas de 768px.
- A 320px hay overflow global existente por ct-email-btn de Contacto: x=20 a x=325, mientras About scrollWidth/clientWidth coinciden en 305. Registrado en Hallazgos-y-Pendientes para la auditoría posterior; ContactSection no se modifica en este cambio.
- Capturas guardadas antes de la interrupción de red del navegador integrado: `sobre-mi-dos-grupos-portada.jpg` y `sobre-mi-grupos-y-cierre-movil.jpg`. La última recarga de escritorio devolvió ERR_NETWORK_IO_SUSPENDED; no se tomó una nueva captura de escritorio del cierre tras esa interrupción.
- Preparados Skills-Desarrollo-Web y Prompt-Auditoria-Web: catálogo y fuentes verificados, instalación manual de cuatro skills y auditoría futura con exclusiones y autorización según riesgo. No se instalan skills ni se ejecuta la auditoría en esta sesión.

## Auditoría de las cuatro rutas (10 de octubre de 2026)

- Informe, cobertura, propuestas y capturas: [[Auditoria-Web]]. Correcciones locales en formularios, correo, contrastes y h3 del ejemplo Tools; Hero/About/sidebar intactos por SHA-256.
- Check inicial: 42 archivos; final: 43 por el servidor de diagnóstico, ambos 0 errores, 0 warnings, 126 hints. Build final: cuatro páginas, exit 0. El sandbox dio EPERM en el Worker; fuera de él compila sin cambios de configuración.
- npm audit: cero vulnerabilidades conocidas; sin audit fix. Un primer ENOTFOUND del entorno restringido se resolvió al repetir la lectura autorizada.
- Navegador en 1920, 1280, 768, 390 y 320px en cada ruta: sin overflow final. Errores/válido simulado, teclado, campos opcionales y texto largo comprobados; formulario sin scripts probado como fixture separado.
- Preview monta React; dev existente registra `_jsxDEV is not a function`. El motor de producción falla por core UMD/Worker módulo; ESM carga en diagnóstico separado, sin aplicar la propuesta. No se completó conversión/descarga/cancelación efectiva.
- No se probó reduced motion real ni desactivación global de JS, no se midió Lighthouse/CWV ni otros navegadores. Los servidores de prueba temporales se detienen al finalizar.

## Servicios y Tools separadas y títulos gráficos (23 de octubre de 2026)

- La sección combinada se divide en `#services` y `#tools` (componentes nuevos; el combinado se elimina). Cinco títulos WebP aportados por el usuario sustituyen al texto en Proyectos, Servicios, Tools, Contacto y FAQ mediante `SectionHeadingCard`. El sidebar usa siete grupos de sección activa en lugar de seis. Contenido, estilos del resto del Hero, morph y temas por artículo no cambian.
- `npm run check`: 45 archivos, 0 errores, 0 avisos y 126 hints. `npm run build`: cuatro páginas, código 0. HTML generado: `home > about > projects > services > tools > contact > faq`, sin ids duplicados ni `services-tools`, y las cinco imágenes presentes en `dist`.
- Navegador (servidor dev del usuario en 4321; Astro no admite un segundo servidor del mismo proyecto): en 1280px, tras recorrer about, projects, services, tools, contact y faq, exactamente un enlace del sidebar activo en cada una, con cambio de Servicios a Tools justo en la frontera del 45%. Títulos a la misma altura de letra (128px en 1280, 80px en 390/320), sin deformar y sin desbordamiento horizontal de página ni de las secciones en 1280, 390 y 320px. Los enlaces `#services`/`#tools` del menú móvil apuntan a las nuevas secciones.
- Límites: el navegador integrado iba a ~2 fps, así que los recorridos usan esperas largas. No se probó 768/1920px, el menú móvil abierto, teclado, movimiento reducido, lector de pantalla ni el contraste del título dorado sobre el fondo beige de Contacto. No se hizo commit ni push.

## Auditoría y tarjetas de Servicios y Tools (23 de octubre de 2026)

- Informe, decisiones y pendientes: [[Auditoria-Servicios-Tools]]. Nuevos `ShowcaseSection` y `ShowcaseCard`; fondo grafito como About; mini títulos eliminados; tarjetas con imagen provisional para los tres servicios y las dos herramientas.
- `npm run check`: 47 archivos, 0 errores, 0 avisos y 126 hints. `npm run build`: cuatro páginas, código 0. HTML: 5 tarjetas (3 a `/servicios/`, 1 al conversor, 1 inerte).
- Navegador sobre la compilación de producción (vista previa en 4322): 1280, 768, 390 y 320px sin desbordamiento. El servidor dev del usuario (4321) sirvió CSS desfasado de los componentes nuevos: reiniciar `npm run dev`. El panel del navegador se ocultó durante la ronda: no se repitió el seguimiento del enlace activo del sidebar (sin cambios en su lógica) ni se probó el foco con teclado real.

## Bloqueo de scroll durante la entrada del Hero (23 de octubre de 2026)

- Implementación y razonamiento en [[Hero-y-Sidebar]]: clase `hx-intro-locked`, liberación por `entranceSettled`, red de seguridad de 8 s. Cambios solo en `HeroExperience.astro` (un bloque CSS global y un bloque de script antes de `playEntrance()` más una línea en la limpieza).
- `npm run check`: 47 archivos, 0 errores, 0 avisos y 126 hints. `npm run build`: cuatro páginas, código 0.
- Probado cargando la compilación en un iframe y registrando la clase cada 2 ms: bloqueo a ~54 ms y liberación a ~2,2 s con fotogramas forzados (propiedades de la animación limpias y sidebar activo en «home» después); con ancla, ~30 ms; con el panel oculto, liberación por el temporizador a los 8 s.
- Límites: no se probó con una rueda de ratón, táctil ni teclado reales (el bloqueo es el mismo `overflow: hidden` del menú móvil), ni con `prefers-reduced-motion` real (el camino se revisó en código), ni en Safari/Firefox. Con un navegador real y conexión lenta, el bloqueo durará lo que tarden fuentes y retrato en cargar, con tope de 8 s.

## Auditoría y rediseño de Contacto (23 de octubre de 2026)

- Informe y decisiones: [[Auditoria-Contacto]]. Contacto pasa de beige a grafito, se reorganiza en formulario (panel) + canales directos y se re-estila el formulario (solo `ContactSection.astro` y el bloque de estilos de `ContactForm.astro`).
- `npm run check`: 47 archivos, 0 errores, 0 avisos y 126 hints. `npm run build`: cuatro páginas, código 0.
- Navegador sobre la compilación de producción: 1280, 1024, 390 y 320px sin desbordamiento; error con campos vacíos (foco en el primero, contrastes 7,4:1 a 14,4:1); sidebar con «Contacto» iluminado; frontera Tools → Contacto sin hueco. Límites: sin hover/teclado reales, movimiento reducido, lector de pantalla, envío válido ni autorrelleno.

## Efecto del ratón en el Hero y hilo dorado de Sobre mí (23 de octubre de 2026)

- Detalle en [[Hero-y-Sidebar]] (efecto del ratón, nuevo `src/lib/heroFluid.ts`, un bloque al final del script del Hero) y [[Sobre-Mi]] (hilo dorado, reescritura de la biografía en `AboutSection.astro`). Sin dependencias nuevas.
- `npm run check`: 48 archivos, 0 errores, 0 avisos y 126 hints. `npm run build`: cuatro páginas, código 0. Comparación del HTML generado con `site.js`: los siete párrafos idénticos (se descuentan solo los emojis decorativos).
- Navegador sobre la compilación de producción: efecto del ratón medido con eventos de puntero sintéticos (cifras en [[Hero-y-Sidebar]]); hilo con 9/9 nodos encendidos al final, sin desbordamiento a 1280, 1024, 390 y 320px; con fotogramas forzados en un iframe, el Hero arranca, el scroll se libera y el sidebar marca Inicio, Sobre mí y Tools.
- Límites: el panel del navegador iba tan lento que las lecturas directas de la animación del Hero no eran fiables (se repitieron en iframe). No se vio el efecto del ratón con un cursor real ni en un monitor de alta frecuencia; sin pruebas en GPU integrada o portátil.

## Agua en los elementos sueltos del Hero (24 de octubre de 2026)

- Detalle y razonamiento en [[Hero-y-Sidebar]]. Nuevo `src/lib/heroWater.ts`, una regla CSS global (`.hx-water-on`) y un bloque en el script del Hero. Sin dependencias.
- `npm run check`: 49 archivos, 0 errores, 0 avisos. `npm run build`: cuatro páginas, código 0.
- Se calibró el filtro con pruebas aisladas (ruido directo, ruido opaco y `feImage`) y se comprobó sobre el wordmark real; a escala 30–40 la deformación es suave y localizada bajo el «blob». Una primera versión (ruido de dos octavas, frecuencia alta) daba un zigzag poco acuoso y se suavizó.
- Límites: el efecto se vio con un puntero sintético en un iframe y capturas, no con un ratón real; no se midió el coste en GPU integrada ni en Safari/Firefox (el filtro `feImage` dinámico puede comportarse distinto en Safari). Los textos pequeños (chips, métricas) se comprobaron por estado y no con captura ampliada.

## Tarjetas apagadas, más separación y chispas en el hilo de Sobre mí (24 de octubre de 2026)

- Detalle en [[Sobre-Mi]] (sección «Hilo dorado»). Solo cambió `AboutSection.astro` (CSS y script); ningún texto ni dependencia.
- `npm run check`: 49 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- En un iframe con fotogramas forzados: 0 nodos encendidos al cargar, 9/9 al final (escritorio y móvil), sin chispas residuales, sin desbordamiento, sin explosión al subir. Se capturó el estallido congelado a ~100ms.
- Se corrigió un detalle real durante la prueba: al activar el modo apagado las tarjetas habrían hecho un fundido visible de encendidas a apagadas; ahora nacen apagadas (`ab-nt`).
- Límites: no se vio a velocidad real (las transiciones CSS se detienen en el navegador de pruebas, se verificó con ellas desactivadas) ni con una rueda de ratón; no se probó movimiento reducido real (revisado en código).

## Hilo de Sobre mí al centro de la pantalla, paso 08 y tarjetas doradas (24 de octubre de 2026)

- Detalle en [[Sobre-Mi]]. Cambian `AboutSection.astro` (marcado, CSS, script) y `site.js` (el rótulo `groupLabels.intro` pasa a «/whoami» en ES y EN; en inglés antes era «Who I am»).
- `npm run check`: 49 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobación nodo a nodo en la compilación de producción: cada uno de los 10 nodos se enciende al cruzar el centro de la pantalla (a 1280 y 390px). Dos trampas del entorno de pruebas: el panel oculto no emite eventos `scroll` para `scrollTo` programático (se disparan a mano) y `requestAnimationFrame` debe parchearse **antes** de que cargue la página (se inyecta en un `srcdoc`), porque GSAP captura la función original.
- Límites: no se vio con una rueda de ratón real ni a velocidad real de las transiciones.

## Ilustraciones satélite en Sobre mí (24 de octubre de 2026)

- Detalle en [[Sobre-Mi]]. Nuevo `AboutSatellite.astro`; `AboutSection.astro` solo importa el componente y añade la lista `satelliteKinds`. Copia de seguridad previa en `backups/`.
- `npm run check`: 50 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado en iframe (`requestAnimationFrame` parcheado, transiciones desactivadas): las ocho ilustraciones se encienden con su tarjeta; se detectó y corrigió que las capas de la 07 se veían tenues aun apagadas (el relleno no se ocultaba con el trazo).
- Límites: no se vieron las animaciones de dibujado a velocidad real (las transiciones CSS se detienen en el navegador de pruebas), ni el ecualizador en movimiento; el aspecto final se juzgó por capturas reducidas.

## Fondo de obsidiana, placas de subtítulo y borde del Hero (24 de octubre de 2026)

- Detalle en [[Sobre-Mi]]. Cambios: `AboutSection.astro` (fondo, placas, script), asset `about-veins.webp` y su script generador. Copias previas en `backups/` (`*.pre-obsidiana-2026-10-24`).
- `npm run check`: 51 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado en iframe: los 10 nodos siguen encendiéndose al cruzar el centro (30px antes apagados, 6px después encendidos); 10 brillos, todos encendidos al final; sin desbordamiento a 1440, 1100 y 390px; el stack de herramientas sigue legible sobre las venas; la placa del segundo subtítulo no cruza el hilo.
- Borde del Hero: se reprodujo escalando el iframe (zoom fraccionario) y se vio que la línea clara desaparece con el arreglo.
- Límites: el brillo en movimiento (la ventana de venas siguiendo el haz) se juzgó por capturas fijas, no a velocidad real; el rendimiento de las capas con máscara en GPU integrada y móvil no está medido.

## Proyectos con el nuevo formato, stack movido, iconos y enlace (24 de octubre de 2026, noche)

- Detalle en [[Sobre-Mi]] y [[Otras-Secciones-y-Compartidos]]. Nuevo `SkillsStack.astro`; reescrito `ProjectsSection.astro`; `ShowcaseSection` con CTA opcional y slot `after`; contenido `aboutMe.projectsCta`. Copias previas en `backups/` (`*.pre-proyectos-2026-10-24`).
- `npm run check`: 52 archivos, 0 errores y 0 avisos (126 sugerencias previas). `npm run build`: cuatro páginas, código 0.
- Comprobado en iframe: el CTA apunta a `#projects`; 5 iconos dibujados; el stack está en `#projects` y no en `#about`; Proyectos queda marcado en el sidebar durante el stack; la placa `/whoami` termina con 7 caracteres de ancho; sin la línea clara en los límites Hero/Sobre mí y Sobre mí/Proyectos al escalar la página.
- Límites: no se vio el tecleo ni los resplandores en movimiento; no se probó en un móvil real.

## Carrusel horizontal de Proyectos (25 de octubre de 2026)

- Detalle en [[Otras-Secciones-y-Compartidos]]. Nuevos `ProjectCard.astro` y modo `rail` de `ShowcaseSection.astro`; seis proyectos de relleno en `site.js`.
- `npm run check`: 53 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado en iframe cargando la página ya desplazada a varias posiciones (el navegador de pruebas no entrega eventos de scroll a ScrollTrigger): antes del anclaje la fila está en x=0; durante, el panel pasa a `position: fixed` y la fila se desplaza 1:1 con el scroll (0, −500, −1000, −1318px); a los 1318px la última tarjeta queda en el borde derecho y después se libera. Sin desbordamiento horizontal en la página a 1440 y 390px; a 390px no hay pin ni espaciadores y la fila se desliza con `overflow-x: auto`.
- Se vio y corrigió que las tarjetas pasaban por debajo del sidebar translúcido (el texto se transparentaba): máscara de desvanecimiento a la izquierda.
- Límites: no se probó con rueda de ratón real ni con `prefers-reduced-motion` real; el easing del `scrub` y la sensación del anclaje solo se pueden juzgar en directo.
- Para inspeccionar el vídeo de referencia se sirvió una copia temporal (`python -m http.server`) y se miraron fotogramas en el navegador de pruebas; el servidor se cerró.

## Cinco fondos nuevos, alternando claro y oscuro (25 de octubre de 2026)

- Detalle en [[03-Sistema-de-Diseno|Sistema-de-Diseno]]. Nuevo `SectionBackdrop.astro`; cambios en `ShowcaseSection`, `ShowcaseCard`, `SkillsStack`, `ProjectsSection`, `ServicesSection`, `ToolsSection`, `ContactSection` y `FaqSection`. Copias previas en `backups/` (`*.pre-fondos-2026-10-25`).
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado en iframe (escala 0,556, página cargada a la posición de cada sección): los cinco fondos se dibujan, las costuras claro/oscuro se ven, el carrusel de Proyectos funciona sobre el fondo claro, el stack es legible sobre champán y los acordeones del FAQ sobre marfil.
- Límites: los movimientos (deriva de las venas, pulsos, linterna del puntero, polvo) no se vieron en vivo; el contraste del sidebar sobre las secciones claras solo se miró en capturas reducidas; no se probó en móvil real.

## Ajustes de fondos tras la primera revisión (26 de octubre de 2026)

- Petición del usuario: Proyectos con venas doradas en lugar de casi negras; Servicios con líneas más tenues (tapaban textos y carteles); Tools cambiado por completo (blanco con puntos grises, sin dorado ni coherencia); Contacto se queda; FAQ más complejo. Detalle en [[03-Sistema-de-Diseno|Sistema-de-Diseno]]. Copias previas en `backups/` (`*.pre-ajuste-fondos-2026-10-26`).
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado en capturas reducidas: venas doradas visibles sobre el champán; cuadrícula de Servicios casi imperceptible con tarjetas legibles; Tools con dorado cepillado y anillos grabados; FAQ con «?» de oro y contornos flotando.
- Límites: los movimientos (brillo diagonal y reflejo de Tools, deriva de los «?» y brillo del pan de oro) no se vieron en vivo; el contraste del texto de la tarjeta de marca del sidebar sobre Tools sigue flojo cuando el límite con Servicios pasa por detrás (problema del sidebar, no tocado).

## Transiciones entre secciones (26 de octubre de 2026)

- Detalle en [[03-Sistema-de-Diseno|Sistema-de-Diseno]]. Cambios en `SectionBackdrop.astro`, `AboutSection.astro` (nodo de salida + horizonte) y `ShowcaseSection.astro` (revelado del título). Copias previas en `backups/` (`*.pre-transiciones-2026-10-26`).
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado en capturas reducidas de los cinco pasos: degradados continuos; `ab-arrived` activo al llegar el hilo; el revelado del título pasa de `inset(0 53 % 0 0)` a `inset(0 0 0 0)` según el scroll. Se vio una hebra tenue en el paso Sobre mí → Proyectos aun tras el solape de 2px (zoom fraccionario del banco de pruebas).
- Límites: el efecto en movimiento (sol que sube, revelado al hacer scroll con rueda) no se vio en vivo.

## Marco del sidebar sobre fondos dorados (26 de octubre de 2026)

- Detalle en [[Hero-y-Sidebar]]. Solo CSS de `.hx-sidebar-article` en `HeroExperience.astro`. `npm run check` 0 errores y 0 avisos; `npm run build` cuatro páginas.
- Comprobado en capturas: sobre Tools las tarjetas se separan del oro; sobre Contacto (oscuro) no hay diferencia apreciable.

## Transiciones: iris y ondas de oro (26 de octubre de 2026, tarde)

- Detalle en [[03-Sistema-de-Diseno|Sistema-de-Diseno]]. Cambios en `SectionBackdrop.astro` (ondas), `ShowcaseSection.astro` (iris), `AboutSection.astro` (se quita la franja de amanecer; el nodo de salida se mantiene) y `ProjectsSection.astro`. Copias previas en `backups/` (`*.pre-iris-ondas-2026-10-26`).
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado cargando la página a distintos puntos del anclaje (el navegador de pruebas no entrega scroll a ScrollTrigger): la luz baja por el hilo, se enciende el punto, el círculo crece descubriendo el champán con el aro dorado, y a continuación aparece el título de Proyectos; las cuatro ondas se ven nítidas sobre los límites con Servicios, Tools, Contacto y FAQ. A 390px el iris está apagado (panel oculto, onda visible, sin espaciadores y sin desbordamiento horizontal).
- Límites: no se vio el movimiento a velocidad real con la rueda; el coste de repintado de la máscara del iris en GPU integrada no está medido.

## Iris, segunda versión (26 de octubre de 2026, noche)

- Petición del usuario (contando pasos de rueda): el haz tardaba ~7 pasos en reaccionar, el sidebar quedaba con texto negro sobre el panel oscuro y el título de Proyectos no aparecía hasta ~7 pasos después de abrirse el círculo. Rehecho como se describe en [[03-Sistema-de-Diseno|Sistema-de-Diseno]]. Copia previa: `backups/ShowcaseSection.astro.pre-iris-v2-2026-10-26`.
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado cargando la página a S0+130, +380, +530, +680 y +1068px: la luz baja por el hilo, el círculo se abre sobre el título y las tarjetas reales de Proyectos, el sidebar cambia de blanco a negro al ser alcanzado, y el carrusel (anclado) arranca sin salto justo al terminar (la fila se desplaza 351px tras 350px de scroll); sin desbordamiento horizontal.
- Límites: no se vio con rueda real ni con scroll suave; el recuento de pasos es una estimación (≈100px por paso).

## Iris, tercera versión (26 de octubre de 2026, noche)

- Petición del usuario: el trazo del hilo se veía antes de llegar al último nodo; y al abrirse el círculo, Proyectos aparecía cortado por la sección anterior (borde plano arriba y franja negra). Detalle en [[03-Sistema-de-Diseno|Sistema-de-Diseno]]. Copia previa: `backups/ShowcaseSection.astro.pre-iris-v3-2026-10-26`.
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado a S0−120, +330, +470 y +585px (S0 = último nodo a mitad de pantalla, recorrido total 606px): sin trazo antes de S0; el círculo es redondo también por arriba; sin franja de Sobre mí; a +585px todo es champán, también tras el sidebar.
- Límites: no se vio con rueda real; el recuento en pasos de rueda es una estimación.

## Iris, cuarta versión (26 de octubre de 2026, noche)

- Petición del usuario (tres fallos): el siguiente recorrido se pintaba antes de que el hilo llegara al nodo y éste hiciera su animación; al seguir, se quitaba todo lo de arriba y el recorrido quedaba cortado; y el trazo seguía pintado hasta llegar a Proyectos. Detalle en [[03-Sistema-de-Diseno|Sistema-de-Diseno]]. Copias previas: `backups/ShowcaseSection.astro.pre-iris-v4-2026-10-26` y `AboutSection.astro.pre-iris-v4-2026-10-26`.
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado: a S0−150 y saltando a S0+320 el nodo se enciende a ~0,4s y la línea sigue en 0; con el evento `ab-exit-lit` reproducido a mano (el banco de pruebas no entrega scroll a ScrollTrigger) la secuencia sale en orden: 0,7s de espera, línea 0 → 1, punto 0,45 → 1, círculo y desvanecimiento de la línea; a S0+230 la tarjeta 08 y el hilo siguen enteros y la luz baja hasta el punto; a S0+560 queda todo champán sin ningún trazo.
- Límites: no se vio con rueda real ni con el scroll suave del navegador; los tiempos de las compuertas (0,7 / 0,5 / 0,25 / 0,7s) son una primera estimación.

## Proyectos reales y ajuste final del iris (27 de octubre de 2026)

- Contenido: ver [[Contenido-por-Seccion]]. `ProjectItem` gana `description` y `href?`; `ProjectsSection` pasa `description` como texto, `categoría · estado` como eyebrow y `href` a `ProjectCard`, que abre los enlaces externos en pestaña nueva. Copias previas en `backups/` (`*.pre-proyectos-reales-2026-10-26`, `ShowcaseSection.astro.pre-padding-2026-10-26`).
- Iris: con el iris activo la sección Proyectos pierde el padding superior (`.sc-section[data-iris="on"] .sc-inner`), así el título ya está donde lo ancla el carrusel cuando termina el círculo (sección y bloque empiezan en el mismo punto: 3757px); y Sobre mí deja de contar como sección oscura para el sidebar al 90 % del recorrido, para que el texto de las tarjetas pase a negro un paso antes.
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0. Comprobado: seis tarjetas, cinco enlaces `_blank`, título y texto de las tarjetas legibles en el carrusel, título anclado arriba tras el iris.
- Pendiente de confirmar con el usuario: que la exactitud de 0,99 del clasificador sea ya un resultado medido.

## Iris, quinta versión (27 de octubre de 2026)

- Petición del usuario: el haz del punto final se cortaba plano en el límite con la sección anterior; y al llegar a Proyectos el texto de las tarjetas del sidebar seguía en blanco hasta el siguiente scroll (y al volver arriba ya salía negro). Detalle en [[03-Sistema-de-Diseno|Sistema-de-Diseno]] y [[Hero-y-Sidebar]]. Copias: `backups/ShowcaseSection.astro.pre-glow-2026-10-27`, `HeroExperience.astro.pre-theme-check-2026-10-27`.
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: cuatro páginas, código 0.
- Comprobado: a S0+230, +560 y en el inicio del anclaje las tarjetas del sidebar quedan en `dark`, `warm` y `warm`; forzando el cambio de clases y emitiendo `hx-theme-check` pasan de `dark` a `warm` sin mover el scroll; el resplandor continúa sobre el límite sin corte ni línea clara.
- Límites: no se vio con rueda real.

## Subpáginas eliminadas y conversor en /video-converters/ (29 de octubre de 2026)

- Detalle en [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]]. Eliminadas `src/pages/servicios/index.astro` y `src/pages/tools/index.astro`; `tools/video-converter/index.astro` se movió a `src/pages/video-converters/index.astro` (importaciones ajustadas). El sidebar apunta ahora a `#services` y `#tools`; se quitaron los botones finales y los enlaces de las tarjetas de Servicios; el único enlace de Tools es el del conversor (`/video-converters/`, en ES y EN). Copias previas en `backups/` (`*.pre-rutas-2026-10-29` y `paginas-eliminadas-2026-10-29/`).
- `npm run check`: 52 archivos, 0 errores y 0 avisos. `npm run build`: **dos páginas** (`/` y `/video-converters/`).
- Comprobado con el servidor de vista previa: `/`, `/video-converters/` y `/video-converters` dan 200; `/servicios/`, `/tools/` y `/tools/video-converter/` dan 404; la portada no contiene enlaces a `/servicios` ni `/tools`; en `/video-converters/` carga la isla React (zona de arrastre presente, sin errores de consola) y su barra enlaza a las anclas de la portada.
- Nota: los respaldos de páginas deben guardarse con extensión `.bak` (un `.astro` dentro de `backups/` lo revisa `astro check` y falla por sus importaciones relativas).

## Pulido de Proyectos (29 de octubre de 2026)

- Detalle en [[Otras-Secciones-y-Compartidos]]. Nuevos `ProjectArt.astro` y `ProjectMoreCard.astro`; reescritos `ProjectCard.astro`, `ProjectsSection.astro` y `SkillsStack.astro`; `ShowcaseSection` gana `center`, contador/progreso/foco; contenido con `art`, `metric`, `noteStrong`, `moreLabel`, `moreHref` (ES y EN).
- `npm run check`: 54 archivos, 0 errores y 0 avisos. `npm run build`: dos páginas.
- Comprobado en iframe: panel de 868px que cabe en 900; a los 380px de recorrido el contador marca 02, la barra 24 %, el foco está en la tarjeta 02; al final del recorrido marca 06 y se ve la tarjeta de GitHub (borde derecho a 1382px); el stack muestra 7 tarjetas y 42 logos cargados; a 390px no hay anclaje, contador oculto, tarjetas del stack a todo el ancho y sin desbordamiento horizontal.
- Corregido sobre la marcha: el texto de las tarjetas heredaba el centrado de la cabecera (`text-align: left` en `.pj-card`).
- Límites: no se vieron las animaciones en directo (entrada escalonada del stack, elevación al pasar el cursor, pulso del estado); las capturas son reducidas.

## Cabecera de Proyectos fuera del anclaje (29 de octubre de 2026, tarde)

- Petición del usuario: (a) al terminar el iris el título debía verse centrado con su texto, no cortado arriba; (b) con la fila anclada solo deben verse el contador/progreso y las tarjetas; (c) el stack se veía sin formato en su servidor de desarrollo.
- Cambio en `ShowcaseSection.astro`: cabecera (`.sc-head`) separada del bloque anclado (`.sc-pin`), `PIN_TOP = 28`, punto del iris en el centro del título. Detalle en [[Otras-Secciones-y-Compartidos]]. `npm run check`: 54 archivos, 0 errores, 0 avisos; `npm run build`: dos páginas.
- (c) no era un fallo del código: el servidor de Vite del usuario (puerto 4321) servía una hoja de estilos antigua de `SkillsStack`; el build y la vista previa salen formateados. Solución: parar `npm run dev`, borrar `node_modules/.vite-astro-dev` y volver a arrancar.
- Límites: comprobado con cargas estáticas a distintos puntos del scroll, no con la rueda en directo.

## Sidebar: cifras en oro y enlaces con flecha (29 de octubre de 2026, tarde)

- Petición del usuario: las cifras «2+» y «10+» perdían el formato de la página (oro lavado sobre fondo claro), los enlaces del último bloque (GitHub, Redes Sociales) no parecían enlaces y la tipografía del sidebar se veía fina.
- Cambios en `HeroExperience.astro` (copia previa: `backups/HeroExperience.astro.pre-nav-oro-2026-10-29.bak`): (1) `.hx-metric-value` y `.hx-compact-metric-value` con cara dorada degradada (`background-clip: text`) y borde de bronce extruido con `drop-shadow`, sin imágenes; se quitó el contorno negro fino del tema cálido; cifra del sidebar a 1.55rem. (2) Nav con Space Grotesk 700, 0.86rem, `letter-spacing: 0.07em`; etiquetas de cifras en 600; tagline en 500. (3) Bloque social en Space Grotesk 600 a 0.84rem (antes JetBrains Mono 400) con un disco dorado con flecha ↗ (`.hx-compact-social-arrow`) en GitHub y Redes Sociales; LinkedIn sigue atenuado y sin flecha por no tener URL.
- Comprobado en iframe a 1440×900 sobre tema oscuro (Sobre mí) y cálido (Proyectos): el sidebar mide 873px y cabe en 900. `npm run check`: 0 errores, 0 avisos; build correcto.
- Límites: no revisado a otras alturas de ventana ni en el menú móvil (no cambia).

## Sidebar sin barra de desplazamiento (29 de octubre de 2026, noche)

- Petición del usuario: con las cifras y la tipografía nuevas el sidebar no cabía en su ventana (zoom/ventana baja) y mostraba una barra lateral; pedía una auditoría para que cupiera como antes.
- Primer intento descartado: pasar todo el interior a `em` con `font-size: clamp(10px, 1.65svh, 15px)`. Cabía, pero a ventanas altas (1887×882) todo quedaba un 7–15 % más pequeño que el resto de la página (el `em` anidado encogía además los botones) y el usuario lo vio feo. Copia: `backups/HeroExperience.astro.fit-v1-descartado-2026-10-29.bak`.
- Solución adoptada (parte de la versión con cifras doradas y flechas; copia previa `backups/HeroExperience.astro.pre-nav-fit-2026-10-29.bak`): `.hx-compact-sidebar` define `--u: clamp(0.62rem, 1.82svh, 1rem)` y los `rem` de su interior pasan a `calc(N * var(--u))` (alto de botones: `2.75 * --u` = 44px a tamaño pleno). Con 1.82svh ≥ 1rem a partir de ~880px de alto: ahí el sidebar queda idéntico a antes; por debajo se encoge en proporción. Se mantienen los tramos de ≤950px y ≤850px. La barra queda oculta (`scrollbar-width: none`) solo como red de seguridad.
- Medido (altura de contenido frente a altura útil): 1887×882 → 821/856; 1440×900 → 819/873; 1536×730 (equivale a 1920×1080 con zoom 125 %) → 625/706; 1366×768 → 637/744. En todos caben sin desbordar.
- Límites: 1280×720 y 1920×1080 no medidos con esta versión; no probado con el zoom real del navegador; el menú móvil no cambia.

## Sidebar rellena toda la altura (29 de octubre de 2026, noche)

- Petición del usuario: en su ventana quedaba una franja vacía bajo el bloque de Contacto; el sidebar debía ocupar todo el alto expandiendo alguna celda.
- Cambio en `HeroExperience.astro` (copia previa: `backups/HeroExperience.astro.pre-nav-relleno-2026-10-29.bak`): el espacio sobrante se reparte con `flex-grow`: el bloque de nav crece 3 partes (sus siete botones se estiran, `flex: 1`) y el bloque social 1 parte (filas y botón Contacto con `justify-content: space-evenly`); marca y cifras no crecen. `--u` sube su tope a 1.12rem para ventanas muy altas.
- Medido (borde inferior del último bloque + padding = borde inferior del sidebar): 1887×882, 1920×1080 y 1536×730 → sin hueco ni desbordamiento; botones de nav de 48px, 52px y 45px de alto.
- Límites: el reparto no se ha probado durante la animación de entrada del Hero (las posiciones del morph se miden en vivo, pero no lo vi en movimiento).

## Sidebar con el aspecto original y «Mi stack» sin formato (29 de octubre de 2026, mediodía)

- Sidebar (petición del usuario, con foto del estado anterior): se devuelven a los valores originales la frase de presentación, la etiqueta de las cifras, los botones del nav (Inter 600, 0.82rem, `letter-spacing: 0.02em`) y el bloque de redes (JetBrains Mono 0.72rem, sin huecos extra); se conservan las cifras doradas (1.3rem), las flechas junto a GitHub y Redes Sociales y el relleno de la altura. `--u` pasa a `clamp(0.62rem, 2.3svh, 1rem)`: vale 1rem a partir de ~700px de alto (sidebar idéntico al original en la ventana del usuario, ~1477×693 en CSS) y solo se encoge por debajo. Medido: 1477×693 y 1887×882 sin desbordamiento ni hueco inferior. Copia previa: `backups/HeroExperience.astro.pre-nav-original-2026-10-29.bak`.
- «Mi stack de trabajo» seguía viéndose sin formato en el navegador del usuario. Auditoría: el servidor de desarrollo del usuario (`astro dev`, PID 29496, arrancado a las 9:36) devolvía el HTML nuevo (inline, con `sk-card`) pero el módulo de estilos `/src/components/SkillsStack.astro?astro&type=style&index=0&lang.css` seguía siendo el antiguo (`sk-group`/`sk-title`, sin `sk-card`). Un servidor nuevo (`astro dev --ignore-lock` en otro puerto) y el build servían el CSS correcto; los demás componentes del servidor del usuario también estaban al día. Es decir: el código y el build estaban bien; el servidor de desarrollo había dejado de invalidar ese único módulo CSS tras reescribirse el archivo entero (10:30), probablemente por el vigilante de archivos sobre OneDrive. Un `touch` del archivo bastó para refrescarlo y se comprobó en `localhost:4321`: siete tarjetas oscuras en mosaico, 42 logos cargados.
- Cómo evitarlo: tras reescribir un archivo entero, reiniciar `astro dev` (o `astro dev --force`); si algo se ve «sin formato» en desarrollo, comprobar primero con `npm run build && npm run preview` y mirar el módulo `?astro&type=style` del componente.

## Agua solo en el fondo (30 de octubre de 2026)

- Petición del usuario: revertir el efecto de agua en los elementos sueltos del Hero (wordmark CHISU, titular, métricas, nota personal, chips y lema) y dejarlo únicamente en el fondo.
- Cambio en `HeroExperience.astro`: fuera el `import`, el bloque `createHeroWater([...])` y la regla global `.hx-water-on`; se borró `src/lib/heroWater.ts`. El efecto del fondo (`createHeroFluid`) no se toca. Copias previas en `backups/*.pre-sin-agua-elementos-2026-10-30.bak`.
- `npm run check`: 0 errores, 0 avisos; `npm run build`: correcto; sin referencias restantes a `heroWater` ni `hx-water` en `src/`.
- Límites: no vi el movimiento con el puntero en vivo; el sidebar nunca tuvo el efecto.

## Agua más visible en el fondo del Hero (30 de octubre de 2026)

- Petición del usuario: el movimiento del ratón sobre el fondo se notaba poco y debía parecer agua.
- Cambio en `src/lib/heroFluid.ts` (copia previa: `backups/heroFluid.ts.pre-agua-visible-2026-10-30.bak`): además del arrastre/desenfoque de antes, la textura de simulación guarda ahora un campo de alturas (`z` = altura, `w` = altura anterior) que avanza con la ecuación de onda (amortiguación 0.988 por paso). Cada movimiento deja una gota (`min(|velocidad| × 1.6, 0.8)`) que se propaga en anillos; el pase de dibujo desvía la imagen según la pendiente de la superficie (refracción, `g × 0.5`) y la ilumina desde arriba a la izquierda (brillo de hasta 5× en las pendientes que miran a la luz, oscurecimiento de hasta 0.4 en las contrarias). El efecto se mantiene 4.2 s tras el último movimiento (antes 2.6 s) para que se vean los anillos expandirse. La textura se limpia ahora a `(0,0,0,0)`.
- Solo afecta al fondo (el canvas de `#hx-pin-fade`); título, wordmark y textos siguen sin efecto.
- Comprobado en la página compilada a 1440×900: se crea el canvas, el shader compila y, con una trayectoria circular simulada, se capturan fotogramas con anillos concéntricos con refracción y brillo (composición del canvas sobre la imagen del fondo).
- Límites: probado con eventos simulados, no con un ratón real (la sensación de intensidad hay que confirmarla a mano); los valores a ajustar son `1.6`/`0.8` (altura de la gota), `0.5` (refracción) y `5.0` (brillo) en `heroFluid.ts`; la velocidad de las ondas depende de la frecuencia de refresco del monitor.

## Agua del fondo más pequeña y ligera (30 de octubre de 2026)

- Petición del usuario: una sola pasada del ratón producía ondas enormes que ocupaban casi toda la pantalla y generaban mucho lag.
- Causa: gotas demasiado fuertes y anchas (`min(|v| × 1.6, 0.8)`, radio ×1.5), amortiguación muy baja (0.988 por paso, las ondas rebotaban por toda la pantalla), refracción 0.5, 4.2 s de simulación tras cada movimiento y un pase de dibujo que muestreaba la imagen (hasta 9 lecturas) en todos los píxeles aunque el agua estuviera en calma.
- Cambios en `src/lib/heroFluid.ts` (copias previas: `backups/heroFluid.ts.pre-agua-visible-2026-10-30.bak` y `...pre-agua-pequena-2026-10-30.bak`): gota `min(|v| × 1.3, 0.65)` con radio ×0.85; amortiguación 0.955 (los anillos mueren a ~70px del origen); refracción 0.38; brillo ×3 y sombra máx. 0.25; simulación activa 2.2 s tras el último movimiento. Rendimiento: el pase de dibujo sale pronto con alfa 0 donde no hay agua ni arrastre (sin lecturas de imagen) y el desenfoque de 8 muestras solo se calcula donde hay arrastre.
- Medido con una pasada rápida simulada de lado a lado (900px en 0.84 s) a 1440×900, comparando el canvas con la imagen de fondo: ~7 % de la pantalla cambia de forma apreciable (antes ocupaba rangos mucho mayores) y se ven hoyuelos con borde brillante de ~70–120px.
- Límites: el lag real depende de la GPU del usuario y no se pudo medir aquí (el panel de pruebas no da tiempos fiables de fotograma); si aún va justo, bajar la resolución del lienzo (`rect.width * 0.5` en `resize()`) o la simulación (`sw = 192`).

## Agua del fondo: tercer ajuste, menos tamaño y menos coste (30 de octubre de 2026)

- Petición del usuario: el efecto gusta pero hay que reducirlo uno o dos puntos y que la ola no se intensifique ni llegue hasta el final de la página; en un PC peor se atasca.
- Cambios en `src/lib/heroFluid.ts` (copia previa: `backups/heroFluid.ts.pre-agua-mas-pequena-2026-10-30.bak`): amortiguación de las ondas 0.955 → 0.925; el rastro de arrastre se desvanece más rápido (0.982 → 0.95); gota `min(|v| × 0.9, 0.42)` con radio ×0.7 (y radio general de la gota ×0.7); la altura se limita a ±0.5 para que un movimiento continuo no acumule una ola cada vez mayor; refracción 0.28, arrastre 0.05, desenfoque 0.01, brillo ×2.4; simulación activa 1.5 s tras el último movimiento. Coste: lienzo al 35 % de la resolución (antes 50 %) y campo de simulación de 144 px de ancho (antes 192).
- Medido con la misma pasada rápida simulada que la vez anterior: el área de pantalla que cambia de forma apreciable baja de ~6.9 % a ~2.6 %; se siguen viendo hoyuelos pequeños con borde brillante.
- Límites: el rendimiento real en un PC modesto no se pudo medir aquí; si aún va justo, bajar `0.35` y `144` en `resize()`, acortar los 1500 ms de `activeUntil` o desactivar el efecto por debajo de cierta potencia.

## Stack como tabla periódica (30 de octubre de 2026)

- Petición del usuario: el stack (siete cajas oscuras) desentonaba con el resto de la web; tras la auditoría y cuatro propuestas eligió la A, «tabla periódica» (la B, constelación de hilo dorado, queda como opción futura).
- Auditoría resumida: otro lenguaje visual (cajas iguales a las de Servicios), sin foco (42 logos con el mismo peso, contadores sin información), cajas pegadas sobre el champán, movimiento pobre (solo entrada y elevación) y datos planos (`[nombre, logo]`, sin niveles ni relaciones; no se inventan).
- Reescrito `src/components/SkillsStack.astro` (copia previa: `backups/SkillsStack.astro.pre-tabla-periodica-2026-10-30.bak`): una columna por grupo (G1–G7, cabecera con código y nombre) y una casilla por herramienta con número correlativo (01–42), símbolo de dos letras en dorado, logo en placa clara y nombre; cada grupo con su tinte (los de las tarjetas de proyectos más un séptimo); huecos vacíos de contorno discontinuo hasta completar siete filas; pie «42 / 07» y pista. Símbolos: tabla `symbols` explícita en el componente y, para herramientas nuevas, primeras dos letras (añadir una herramienta a `site.js` no rompe nada).
- Interacción: al pasar el cursor por un grupo (o enfocarlo) los demás bajan al 28 % de opacidad y en gris (solo CSS, `:has()`); la casilla bajo el cursor sube y brilla; una luz dorada suave sigue al puntero por el tablero (una variable CSS por fotograma); al verla por primera vez las casillas se encienden en onda desde el centro (retardo = distancia ponderada, ~0.5 s en total). Sin script o con `prefers-reduced-motion` todo es visible y quieto.
- Contenido nuevo: `about.skillsHint` (opcional) en `site.js` (ES/EN) y `content-types.ts`; `ProjectsSection.astro` se lo pasa al componente como `hint`.
- Responsive: ≥900px siete columnas; por debajo cada grupo es un bloque de casillas en 3 columnas (los huecos vacíos se ocultan y el atenuado por hover se desactiva en táctil).
- Comprobado en la página compilada: 7 columnas, 42 casillas + 7 huecos, 42 logos cargados, tablero de 942×837 a 1440×900 sin desbordamiento; el atenuado por grupo funciona; a 390px sin desbordamiento (documento de 390px) y tablero de 1696px de alto. `npm run check`: sin errores en el componente.
- Límites: no se vio el movimiento a velocidad real (onda de entrada, luz del puntero), ni el aspecto en otras alturas de ventana; la altura total (~840px en escritorio) obliga a hacer scroll dentro de la sección.

## Tabla periódica: ajustes y flecha del sidebar (30 de octubre de 2026)

- Petición del usuario: quitar el pie de la tabla («42 / 07» y la pista) y los códigos G1…G7; marco dorado más grueso, como una placa incrustada; esquinas totalmente cuadradas en el recuadro; nuevo formato para el título; y que al pasar el cursor por las flechas redondas de GitHub y Redes Sociales solo se ilumine la flecha.
- `SkillsStack.astro` (copia previa: `backups/SkillsStack.astro.pre-ajustes-placa-2026-10-30.bak`): fuera el pie, el contador de grupo y el contenido asociado (`about.skillsHint` desaparece de `site.js`, `content-types.ts` y `ProjectsSection.astro`); tablero con `border-radius: 0`, bisel dorado de 6px (antes 2px) con degradado más contrastado, un surco oscuro interior (sombra interior de 8px) y un filete exterior de bronce, para que parezca una placa embutida; el relleno interior crece a `clamp(1.3rem, 2.4vw, 1.9rem)`. Las casillas conservan su esquina redondeada de 9px.
- Título: sin recuadro; texto en mayúsculas (Space Grotesk 700, `letter-spacing: 0.2em`, tinta oscura) con el cursor de terminal en dorado y dos filetes dorados de 3px que corren hacia las esquinas del tablero y terminan en un rombo (guiño al hilo de Sobre mí).
- Sidebar (`HeroExperience.astro`, copia previa: `backups/HeroExperience.astro.pre-flecha-hover-2026-10-30.bak`): se quita el subrayado dorado y el desplazamiento al pasar el cursor por GitHub y Redes Sociales; ahora solo se ilumina el disco (brillo ×1.18 y halo dorado). Comprobado: sin subrayado, sin transformación, con filtro y sombra activos al estar encima.
- Comprobado en la página compilada a 1440×900: tablero cuadrado de 942px, sin pie ni códigos, título con filetes visibles. `npm run check`: sin errores en los archivos tocados.
- Límites: no se vio el movimiento en directo; la altura del tablero queda en ~800px.

## Tabla periódica: sin cursor ni huecos (30 de octubre de 2026)

- Petición del usuario: quitar el cursor de terminal parpadeante junto al título (ya no tiene sentido con el nuevo formato), recentrar el título y quitar las casillas vacías de contorno discontinuo.
- `SkillsStack.astro` (copia previa: `backups/SkillsStack.astro.pre-sin-cursor-huecos-2026-10-30.bak`): fuera el `<span>` del cursor, su CSS, la animación `pt-caret` y la regla de `prefers-reduced-motion` asociada; fuera las casillas fantasma (`pt-ghost`) y el cálculo de filas vacías; las columnas cortas simplemente terminan antes. El texto del título lleva `margin-right: -0.2em` para anular el espacio de `letter-spacing` tras la última letra.
- Medido a 1440×900: filetes izquierdo y derecho de 307.1 y 307.2px, centro visual del texto a 890.1px y centro del tablero a 890.1px (centrado exacto); 42 casillas, 0 huecos, sin cursor.
- Límites: no se probó en otros anchos más allá de la comprobación de números (los filetes se reparten por igual en cualquier ancho).

## Cabecera de Proyectos: descripción y decoración lateral (30 de octubre de 2026)

- Petición del usuario: la descripción parecía de fuente predeterminada y los lados de la cabecera quedaban vacíos frente al resto de la web. Descartó las fichas con cifras (6 proyectos, 1 en desarrollo, lenguajes) por no aportar y quedar obsoletas; pidió algo mantenible o la opción B, y aprobó la C.
- Descripción (`ShowcaseSection.astro`, copias previas: `backups/*.pre-deco-lateral-2026-10-30.bak`): pasa a Space Grotesk 500 (`clamp(1.15rem, 1.6vw, 1.4rem)`, `letter-spacing: -0.012em`) y las frases en negrita llevan un trazo de rotulador dorado detrás (degradado que cubre del 56 % al 90 % de la altura, `box-decoration-break: clone`).
- Decoración (slot nuevo `deco` dentro de `.sc-head`; la rellena `ProjectsSection.astro`): (1) línea gigante de contorno dorado (Space Grotesk 800, hasta 10rem, contorno de 1.5px al 30 %) con las categorías de los proyectos sin repetir (`category` en `site.js`: «DEEP LEARNING · SISTEMAS · BACKEND / POO · …»), recortada a la cabecera con bordes desvanecidos y desplazándose lateralmente con el scroll (−30 % del ancho); (2) a cada lado, la ilustración de línea de los dos primeros proyectos con `art` (`ProjectArt`, ancho `clamp(7rem, 11vw, 13rem)`, dorado al 62 %), con una deriva suave de posición y giro ligados al scroll. Todo sale de los datos: las categorías, y los dos proyectos listados primero (los destacados), así que se mantiene al añadir proyectos sin tocar el diseño; si hay menos de dos proyectos con arte, no se pinta ese lado.
- Detalles: los nodos de la red neuronal usaban un relleno oscuro para tapar líneas (`#0f0e0a`); en la decoración se sobrescribe con el color del fondo (`#e6dcc2`). Solo en escritorio (`≥900px` y sin reducción de movimiento para la deriva); por debajo la capa está oculta.
- Comprobado en la página compilada a 1440×900: motivos a 403–562px y 1218–1377px, título a 590–1190px (sin solaparse), documento de 1425px sin desbordamiento horizontal; a 390px la capa no se muestra y el documento mide 390px. `npm run check`: sin errores en los archivos tocados.
- Límites: no se vio la deriva en directo; la altura del panel de pruebas desplazaba el scroll y solo se pudo revisar un fotograma; a pantallas muy anchas (≥1920px) los motivos crecen con `vw` hasta 13rem; la línea de categorías se nota poco a propósito y puede subirse cambiando el 30 % del contorno.

## Decoración de la cabecera de Proyectos: segunda auditoría (30 de octubre de 2026)

- Petición del usuario: la descripción nueva gusta, pero los elementos de relleno se veían raros con el scroll (capturas durante todo el recorrido): tapaban el título y se leían mal.
- Auditoría: (1) la línea gigante de categorías en contorno dorado (hasta 10rem) tenía casi la misma altura que la cabecera y quedaba exactamente detrás del título: sus letras cortadas (`BA…`, `ID`, `7`) asomaban por debajo de las letras del título y se leían como un doble texto sucio; el contorno dorado tenía además un tono parecido al del título, y al desplazarse lateralmente cruzaba también la descripción; (2) los motivos laterales se movían ±34px y giraban ±5° mientras el título y el texto subían con el scroll, así que cambiaban de posición respecto a ellos y parecían descolocados; (3) en conjunto había movimiento de tres capas distintas sobre una cabecera que ya se mueve.
- Cambios (copias previas: `backups/*.pre-deco-limpia-2026-10-30.bak`): se elimina la línea gigante y su deriva (`pj-ghost`, `data-deco-ghost`); las categorías de los proyectos pasan a una línea pequeña en mono bajo la descripción (JetBrains Mono 0.7rem, mayúsculas, `letter-spacing: 0.16em`, separadas por rombos dorados, texto equilibrado en dos líneas como máximo 40rem), dentro del slot `intro` y sin movimiento; los motivos laterales siguen siendo las ilustraciones de los dos primeros proyectos pero con una deriva mínima (±12px, sin giro).
- Comprobado en la página compilada a 1440×900 en tres posiciones (fin del iris, cabecera ya subiendo y carrusel anclado): título limpio, motivos a 403–562px y 1218–1377px con el título en 590–1190px (sin solaparse), sin desbordamiento horizontal (documento de 1425px).
- Nota de pruebas: tras un `scrollTo` programático el panel de pruebas tarda unos 3–5 s en asentar la posición (el primer fotograma puede mostrar el carrusel anclado), por eso las capturas se toman con esa espera.
- Límites: no se vio la deriva en directo; con muchas categorías la línea de áreas ocupa más de dos líneas.

## Cabecera de Proyectos: hilo, regla y cierre (30 de octubre de 2026)

- Petición del usuario: la línea de categorías no es sostenible (crece con cada proyecto) y queda rara; proponía una línea que separe cabecera y fila (y otra inferior). Tras la auditoría con opciones se aplicaron la A (hilo dorado) y la B (indicación de scroll), más sus dos líneas.
- Cambios (copias previas: `backups/ShowcaseSection.astro.pre-hilo-reglas-2026-10-30.bak`, `ProjectsSection.astro.pre-hilo-reglas-...` y `site.js.pre-scrollhint-...`): (1) fuera la línea de categorías y su CSS; (2) **hilo dorado** (`.sc-thread`, al final de `.sc-head` cuando `center`): filete de 2px y ~70px con un rombo en la punta que baja de la descripción hasta el contador; se dibuja con el scroll (`scaleY` 0→1 entre `top 100%` y `top 62%`, el rombo aparece entre 70 % y 55 %); (3) **indicación de scroll** (`.sc-cue`): «DESLIZA ↓» en mono junto al hilo (flecha con rebote suave), se desvanece al irse la cabecera (`top 30%`→`top 8%`); el texto es `projects.scrollHint` en `site.js` (ES «Desliza», EN «Scroll») y `content-types.ts`, y entra por el slot `cue`; (4) **regla superior**: la fila del contador ocupa todo el ancho: filete fijo a la izquierda (degradado dorado), «01 / 06» en el centro y a la derecha la barra de progreso (ahora ocupa el resto de la fila, con el final desvanecido); (5) **regla inferior** (`.sc-foot`, dentro del bloque anclado): filete de 1px con rombos a ambos lados (8 % y 92 %), más fino que los de 3px del título del stack para que se lea como cierre de la fila. Hilo, cue y regla superior solo con anclaje (≥900px y con movimiento); la regla inferior se ve también en móvil bajo la tira.
- Medido a 1440×900: hilo 70px (346–416) con el contador pegado debajo (418–445) y las tarjetas a 462px; bloque anclado de 590px de alto (con el margen superior de 28px: 618px, cabe en 693px de ventana).
- Nota de pruebas: tras recargar, el navegador restauraba el scroll de la visita anterior (el panel saltaba a 4668px); hay que repetir `scrollTo` varias veces con esperas de ~1.5 s para que se asiente.
- Límites: no se vio el dibujado del hilo ni el desvanecimiento de «DESLIZA» en movimiento (solo fotogramas); en producción no existe la barra de herramientas de Astro que tapaba parte de las capturas del usuario (se apaga en desarrollo con `devToolbar: { enabled: false }`).

## Sin «Desliza» y motivos laterales más grandes (30 de octubre de 2026)

- Petición del usuario: quitar «Desliza ↓» (el hilo dorado ya basta y recarga la estética) y hacer más grandes los elementos laterales de la cabecera de Proyectos, que seguía escueta (o, alternativamente, agrandar el título y la descripción).
- Cambios (copias previas: `backups/ShowcaseSection.astro.pre-sin-cue-2026-10-30.bak` y `ProjectsSection.astro.pre-sin-cue-...`): se elimina el aviso (marcado, CSS, animación, tween de opacidad, slot `cue`) y el texto `scrollHint` de `site.js` y `content-types.ts`. Los motivos laterales pasan de `clamp(7rem, 11vw, 13rem)` a `clamp(8.5rem, 17vw, 19rem)`, adelantados hacia los márgenes (`left: -4.5rem`, `right: -3rem`) y alineados con la banda del título (`top: 4 %` y `10 %`).
- Decisión: se agrandan los motivos y no el título: el título ya ocupa ~64 % del ancho de la cabecera y agrandarlo reduciría justo el espacio lateral que se quería llenar.
- Medido a 1440×900: motivos a 347–592px y 1164–1409px, título a 590–1190px (solo se rozan en el margen en blanco de la propia ilustración, que ocupa ~70 % de su caja), documento de 1425px sin desbordamiento horizontal.
- Límites: comprobado en fotogramas sueltos; no se probó a anchos mayores de 1920px.

## Motivos sin solape y nacimiento del contador 01 / 06 (30 de octubre de 2026)

- Petición del usuario: (1) el segundo esquema lateral se solapaba con el título de Proyectos; (2) el hilo dorado debía tener un pequeño recorrido, como en Sobre mí, y al llegar al punto «nacer» el contador 01 / 06, que hasta entonces no debía verse.
- Motivos (`ProjectsSection.astro`, copia previa `...pre-motivos-sin-solape-2026-10-30.bak`): su ancho pasa a ser relativo a la cabecera (`clamp(7rem, 21%, 20rem)`, antes en `vw`), con `left: -5rem` y `right: -3.5rem`. El título mide ~600px fijos, así que una caja que crece con el ancho de la cabecera deja siempre hueco. Medido: 1440px → motivos 339–537 / 1219–1417 con el título en 590–1190; 1536px → 342–559 / 1295–1513 con el título en 639–1239; 1900px → 353–587 / 1367–1601 con el título en 689–1289; sin desbordamiento horizontal en ninguno.
- Hilo y contador (`ShowcaseSection.astro`, copia previa `...pre-hilo-revela-2026-10-30.bak`): el dibujado del hilo se controla con una variable CSS `--p` (0→1): `transform: scaleY(var(--p))` en la línea y una chispa luminosa (`.sc-thread-spark`) que viaja por la punta mientras se dibuja y se apaga al llegar. El recorrido es proporcional al scroll entre `top 330px` y `top 150px` (en píxeles porque, al terminar el iris, el hilo está siempre a ~345px de la parte superior, sea cual sea el alto de la ventana). Al llegar (`top 150px`) se dispara una línea de tiempo temporizada (≈1 s): el rombo hace un destello (`is-hit`), el «01 / 06» entra con rebote y las dos mitades de la regla crecen desde él. Antes de eso el contador y la regla no se ven. Si se recarga ya pasado el punto (scroll restaurado, redimensionado) el contador aparece directamente; al volver hacia arriba se invierte.
- Comprobado a 1440×900: al terminar el iris (scroll 3770) no hay hilo ni contador; a 3880 el hilo va por la mitad (`--p: 0.51`) con la chispa visible; a 4010 el hilo está completo, el rombo con `is-hit` y el contador y la regla visibles. `npm run check`: sin errores en los archivos tocados.
- Nota de pruebas: con el panel del navegador de pruebas oculto, ScrollTrigger y las líneas de tiempo no avanzan (el ticker espera `requestAnimationFrame`); hay que hacer una captura entre el `scrollTo` y la lectura para «despertarlo».
- Límites: no se vio el rebote del contador ni el destello en movimiento; no se probó a alturas de ventana por debajo de 693px.

## Iris: reproducción automática al bajar (30 de octubre de 2026)

- Problema (usuario): al bajar muy rápido de Sobre mí a Proyectos el iris se saltaba y aparecía Proyectos directamente. Causa: las «puertas» temporales (línea, ignición, apertura) avanzan con el tiempo, pero el iris está anclado a una posición de la página; con un scroll rápido el usuario llega a la zona de Proyectos antes de que terminen y la secuencia se reproduce fuera de su vista.
- Decisión del usuario: aplicar la opción B (bloqueo y autoscroll), pero **siempre** (no solo al bajar rápido), sin bloqueo al subir.
- Implementación (`ShowcaseSection.astro`, `initIris`; copia previa `backups/ShowcaseSection.astro.pre-autoplay-iris-2026-10-30.bak`): un ScrollTrigger sin fin (`start: s0 + 6`) detecta el cruce hacia abajo del punto S0 (el último nodo del hilo en el centro de la pantalla). Entonces: se bloquean rueda, táctil y teclado (`preventDefault` en `wheel`, `touchmove` y teclas de desplazamiento; clase `sc-iris-lock` en `html` con `overscroll-behavior: none`); si el usuario lo pasó de largo, el scroll se devuelve a S0 en 0.2–0.6 s; y una línea de tiempo lleva el scroll de S0 al final del iris (`s0 + dist`) en 2.5 s (`sine.inOut`, con `window.scrollTo` instantáneo para esquivar el `scroll-behavior: smooth` global). El dibujado sigue siendo el de antes (mínimo entre el scroll y las puertas temporales), así que el ritmo de las escenas no cambia. Si el último nodo de Sobre mí aún no se ha encendido (scroll muy rápido), el autoplay arranca las puertas por su cuenta (retraso 0.3 s) y se ignora el evento `ab-exit-lit` mientras dura.
- Salvaguardas: no se bloquea al subir; los clics en enlaces ancla (sidebar, «Ver mis proyectos»…) desactivan el autoplay 3 s y liberan cualquier bloqueo, para que el salto a otra sección no se frene en el iris; saltos de más de 15000 px/s (teclas Inicio/Fin, barra de scroll) no se consideran scroll; no actúa si la página se carga o restaura ya pasado S0 hasta que el usuario sube por encima; tiempo de seguridad que desbloquea siempre a los 5.5 s; sin efecto con `prefers-reduced-motion` ni por debajo de 900px (el iris no existe ahí); al desmontar se desbloquea y se retiran los escuchadores. Constantes al principio del bloque: `MIN_SPEED` (0 = siempre; poner p. ej. 1500 para la variante «solo si llega rápido»), `MAX_SPEED` y `DURATION`.
- Comprobado a 1440×900 simulando un salto de 2800 → 3600 px: el scroll se devuelve a ~3176 y avanza a 3758 en ~2.5 s con la clase de bloqueo activa y una rueda simulada con `defaultPrevented = true`; al terminar se libera (scroll 3758, sin clase). Subir a 2900 no se bloquea. Un clic en «Servicios» del sidebar no bloquea y llega a la sección (7397 px).
- Límites: no probado con una rueda ni un trackpad reales (la inercia del trackpad puede dejar eventos de rueda en cola al liberar), ni con pantalla táctil ≥900px, ni arrastrando la barra de scroll; tras liberar, el scroll de suavizado (`scrub: 0.35`) tarda unos 0.35 s en igualar la posición.

## Hilo y regla siempre presentes, el rombo se convierte en el 01 / 06 (30 de octubre de 2026)

- Petición del usuario: el hilo y la línea horizontal no deben ir apareciendo; deben estar ahí desde el principio y solo iluminarse; el rombo debe estar donde irá el «01 / 06» y convertirse en él cuando la luz llegue.
- Cambios (`ShowcaseSection.astro`, copia previa `backups/ShowcaseSection.astro.pre-hilo-iluminado-2026-10-30.bak`): (1) el hilo vertical tiene una base tenue siempre visible (`.sc-thread::before`, dorado al 58–72 %) y la parte iluminada (`.sc-thread-line`, con la chispa) crece con `--p` encima; (2) el rombo (`.sc-thread-node`) ya no aparece con el scroll: está desde el principio en el centro de la fila del contador (`top: calc(100% + 0.875rem)`, con la fila de altura fija 1.75rem y sin hueco entre hilo y fila), y el hilo llega hasta él; (3) la fila del contador tiene una regla tenue continua de lado a lado (`.sc-progress::before`, 55 %) con una máscara que abre un hueco en el centro (`--m`, 0→1, ancho `--w: 3.4rem`); las mitades iluminadas (`.sc-rule` y `.sc-bar`) están ocultas (`scaleX: 0`) hasta el nacimiento; (4) al llegar la luz (`top 150px`) una línea de tiempo de ≈1 s: destello del rombo, el rombo se encoge y desaparece (`--ns` 1→0 con `autoAlpha`), el hueco se abre en la regla, el «01 / 06» entra con rebote y las dos mitades se iluminan hacia fuera. Al subir se invierte.
- Comprobado a 1440×900: al terminar el iris se ven el hilo tenue, la regla tenue de lado a lado y el rombo en el cruce, sin contador; a 3880 la luz va por la mitad del hilo con la chispa; a 4040 el rombo está oculto (`opacity 0`, `visibility hidden`), el contador visible (`opacity 1`), `--m: 1` y las dos mitades a escala ≈1.
- Nota de pruebas: con el reproductor automático del iris activo, un salto programático por encima de S0 lo dispara; para inspeccionar posiciones posteriores se simuló un clic en un enlace ancla (desactiva el autoplay 3 s). En el panel de pruebas oculto el temporizador de seguridad (5.5 s) puede soltar el autoplay a medias porque los fotogramas no avanzan; en un navegador visible no ocurre.
- Límites: no se vio el destello ni el rebote en movimiento a velocidad real.

## Autoplay también al subir y ranura del 01 / 06 en seis pasos (30 de octubre de 2026)

- Petición del usuario: (1) el bloqueo con autoscroll también debe actuar al volver hacia arriba de Proyectos a Sobre mí; (2) repasar la animación del 01 / 06 con la secuencia de seis pasos de rueda (s1…s6): el cruce debe ser un rectángulo (no un cruce sin más), el contador debe nacer un scroll más tarde (en s5, ya en la zona de proyectos), el hilo que cortaba el contador debe quitarse antes, el rectángulo debe estar oscuro y encenderse cuando llegue la bolita (el siguiente scroll aparece el 01 / 06), y el hilo y la bolita deben ser algo más grandes.
- Causa del cruce «sin más»: el rombo del paso anterior era invisible. GSAP lee una propiedad CSS personalizada sin definir (`--ns`) como 0 y su valor inicial dejaba el elemento a escala 0. Se fija con `gsap.set(slot, { "--ns": 1 })` antes de crear la animación (regla general: dar siempre valor inicial a las variables CSS que se animen).
- Autoplay hacia arriba (`ShowcaseSection.astro`, `initIris`; copia previa `backups/ShowcaseSection.astro.pre-ranura-subida-2026-10-30.bak`): un segundo ScrollTrigger (`start: s0 + dist − 6`) detecta el cruce hacia arriba del final del iris. Bloquea la entrada (mismos escuchadores) y lleva el scroll hasta `s0 − 24` (justo encima del punto de entrada) en 2.5 s; si la sacudida se pasó de largo hacia arriba, primero se devuelve el scroll al final del iris. Las puertas siguen en 1 hasta que se apaga el último nodo de Sobre mí, así que el iris se cierra a la vez que sube el scroll. Misma lógica de anclas, velocidad y reinicio que al bajar. La red de seguridad ahora termina la escena (`progress(1)`) en vez de soltarla a medias.
- Ranura (rectángulo oscuro `.sc-thread-node`, 4.8rem × 1.75rem, borde dorado al 60 %, degradado casi negro) al final del hilo: tapa la regla que pasa por detrás. Con las constantes actuales (un paso de rueda ≈ 100px; el extremo superior del hilo está a ~350px al terminar el iris): s1 (350px) hilo tenue + ranura oscura + regla; s2–s3 la luz con la chispa baja por el hilo (`--p`, de `top 340px` a `top 50px`); s4 (≈50px) la luz llega y la ranura se enciende (clase `is-lit`, de `top 60px`: borde y relleno dorados, halo y destello); s5 (≈−40px, donde se ancla la fila) la ranura se desvanece y nace el 01 / 06 (hueco en la regla, rebote del contador, mitades iluminadas). El hilo acaba ahora en el borde superior de la ranura (antes llegaba al centro de la fila y cortaba el contador).
- Tamaños: hilo de 3px (antes 2), chispa de 11px (antes 5) con halo mayor, regla horizontal y mitades iluminadas de 3px (antes 2).
- Comprobado a 1440×900: s1 (3770) `--p 0`, ranura 77×28 oscura; 3870 `--p 0.31`; 3970 `--p 0.66`; 4070 `--p 1` y ranura encendida, contador a 0; 4170 contador a 1, ranura oculta, hilo ya fuera de pantalla sin cortar el contador. Subida simulada de 3600 px: bloqueo activo, iris cerrándose y desbloqueo con el scroll en 3128 (`s0 − 24`).
- Notas de pruebas: con el panel oculto o poco repintado los fotogramas no avanzan y GSAP aplica su suavizado de retardos, por lo que el autoplay se alarga; hay que intercalar capturas. El salto de scroll tras recargar (restauración) obliga a esperar 5 s, volver a 0 y repetir los `scrollTo`.
- Límites: no se vio el destello ni la subida a velocidad real; no probado con rueda ni trackpad reales.

## Rombo marrón→dorado y bolita por tiempo (30 de octubre de 2026)

- Aclaración del usuario: el «rectángulo» era el rombo que ya existía (un cuadrado girado 45°, con el interior marrón), no la ranura oscura; y «más brillante» al llegar la bolita significa que el marrón interior pase a dorado. Además, la bolita iba muy lenta.
- Causa de la lentitud: el recorrido de la luz estaba ligado al scroll: 70px de hilo repartidos en ~290px de scroll (≈3 pasos de rueda), es decir ~0.24px por cada px de scroll. Si se acelera con el scroll, el contador llegaría antes.
- Cambios (`ShowcaseSection.astro`, copia previa `backups/ShowcaseSection.astro.pre-rombo-rapido-2026-10-30.bak`): (1) el rectángulo se sustituye por el rombo de 0.95rem con borde de 2px (`#8f6c24`) y relleno marrón (`#7d5d26`→`#4a3817`) que, al llegar la luz (clase `is-lit`), pasa a dorado claro (`#fff3c4`→`#efd683`→`#c9a443`) con halo y un destello; (2) el recorrido de la luz pasa a **tiempo**: al bajar el cabecero lo justo (`LIGHT_AT = 270` px de la parte superior de pantalla, la primera rueda tras el iris) la luz recorre el hilo en `RUN_TIME = 0.9` s (`power1.inOut`), vaya el usuario despacio o deprisa; al llegar enciende el rombo; al subir por encima de ese punto se deshace hacia atrás; (3) el nacimiento del 01 / 06 sigue ligado al scroll (`BORN_AT = −40` px, donde se ancla la fila) pero espera a que la luz haya llegado (no puede nacer antes aunque el scroll sea muy rápido); (4) hilo de 3px, bolita de 11px y regla de 3px como antes. Las tres constantes están juntas al principio del bloque.
- Medido a 1440×900: s1 (3770) rombo marrón de 21px en el cruce, hilo tenue y contador a 0; al cruzar 3860 el avance de la luz muestreado cada 150 ms fue 0.00→0.08→0.27→0.56→0.82→0.96→1.00 (≈0.95 s) y el rombo pasó a dorado; a 4170 el contador a 1 y el rombo oculto.
- Límites: no se ve a velocidad real en el panel de pruebas (solo capturas y mediciones); el ajuste fino de `RUN_TIME` y `LIGHT_AT` depende de la sensación del usuario.

## El 01 / 06 nace en s5 (30 de octubre de 2026)

- Petición del usuario: en el quinto paso de rueda (s5) todavía se veía el rombo y el 01 / 06 solo aparecía en el siguiente, cuando ya se estaba en el segundo proyecto.
- Causa: el nacimiento se disparaba con el extremo superior del hilo a −40px de la pantalla, y con los pasos de rueda reales del usuario (algo menores de 100px) s5 quedaba en torno a −33px, a unos 7px del umbral.
- Cambio (`ShowcaseSection.astro`, copia previa `backups/ShowcaseSection.astro.pre-nace-antes-2026-10-30.bak`): `BORN_AT = 0` (antes −40), en mitad de la ventana entre s4 (hilo a ~51–63px) y s5 (≈ −33…−49px), con unos 35–50px de margen por cada lado.
- Comprobado: con el hilo a 59px (s4) el rombo sigue visible y encendido y el contador a 0; con el hilo a −11px (s5) el rombo está oculto y el contador a 1.
- Límites: la posición exacta de cada paso depende del tamaño de paso de la rueda del usuario; si en otro ratón cae del lado equivocado, ajustar `BORN_AT` (más positivo = antes, más negativo = después).

## Cierre luminoso de la fila y camino de luz hasta «Mi stack» (30 de octubre de 2026)

- Petición del usuario: (1) los dos rombos de la regla bajo los proyectos deben encenderse (como el rombo del 01 / 06) cuando se terminan de ver los proyectos y se sale del scroll horizontal; (2) continuar el recorrido luminoso: conectar esa regla con las líneas del título de «Mi stack de trabajo» e ir iluminando, con el scroll, las conexiones, las líneas y, al final, los rombos del título.
- Rombos de la regla de cierre (`ShowcaseSection.astro`, copia previa `backups/ShowcaseSection.astro.pre-cierre-luminoso-2026-10-30.bak`): con la fila anclada (`data-rail-on`) empiezan tenues (marrón `#7d5d26`→`#4a3817`) y pasan a dorado con halo (clase `is-done`) cuando termina el recorrido de la fila: el ScrollTrigger del carrusel pone la clase en `onLeave`, la quita en `onEnterBack` y la ajusta en `onRefresh` (progreso ≥ 1) por si se recarga más abajo. Sin anclaje (móvil, sin movimiento) conservan su color de siempre.
- Camino de luz (`SkillsStack.astro`, copia previa `...pre-cierre-luminoso-...`): con script, escritorio y movimiento, el título se «cablea» (`pt-wired`): dos hilos tenues (`.pt-link`) bajan desde las posiciones de los dos rombos de la regla de cierre (8 % y 92 % de su ancho, medidas con JS en cada refresco/redimensionado y guardadas como `--lx`/`--rx`) hasta las reglas del título, que ahora son tenues y tienen encima una capa dorada recortada (`clip-path`) que crece desde donde aterriza cada hilo hacia el texto. Un ScrollTrigger con `scrub` (de `top 78%` a `top 50%` del título; `refreshPriority: -3` para medirse después del anclaje del carrusel) mueve tres etapas encadenadas: la luz baja por los hilos (`--c`, con una bolita en la punta, 30 % del recorrido), recorre las reglas hacia el texto (`--t`, 50 %) y al final se encienden los rombos del título (`is-lit`, 20 %). Sin script, en móvil o con `prefers-reduced-motion` el título es simplemente dorado como antes y los hilos no se muestran.
- Comprobado a 1440×900 (título del stack a 6432 px de la página): a 4200 px el estado es inicial (`--c 0`, `--t 0`, rombos de cierre apagados); a 5900 px (título al 59 % de la pantalla) los rombos de cierre están encendidos, `--c 1` y `--t 0.75`, y en la captura se ve el marco: rombos arriba, hilos hacia abajo y reglas del título iluminadas hasta mitad de camino; a 6050 px todo a 1 y los rombos del título encendidos; al volver a 5400 px todo vuelve a 0 y los rombos de cierre se apagan.
- Decisión a confirmar: los hilos aterrizan justo debajo de los rombos de la regla de cierre (8 % y 92 %), no en las líneas rojas del boceto del usuario (más hacia dentro); se puede mover cambiando `0.08` y `0.92` en `layout()`.
- Límites: no se vio el recorrido a velocidad real; con ventanas muy anchas el ancho del título del stack (68rem máx.) puede ser menor que el de la fila y por eso las posiciones se miden con JS en lugar de usar porcentajes.

## Progreso simétrico y camino de luz por tiempo (31 de octubre de 2026)

- Petición del usuario: (1) la barra de progreso de la izquierda del contador debe rellenarse igual que la de la derecha (progresión simétrica); (2) corregir el camino de luz de la regla de cierre al título del stack: los rombos se encendían sin efecto, los hilos aparecían de golpe (el derecho desalineado), el punto iba demasiado inmediato y los rombos del título se llenaban «mágicamente»; tomar como modelo el hilo de la cabecera de Proyectos (recorrido por tiempo con chispa, destello al llegar).
- Progreso simétrico (`ShowcaseSection.astro`, copias previas `backups/*.pre-progreso-simetrico-2026-10-31.bak`): la mitad izquierda (`.sc-rule`) pasa de ser una línea dorada fija a una barra de progreso con relleno que crece alejándose del contador (`transform-origin: right`, degradado a 270°, desvanecido en el extremo), igual que la derecha, y `follow()` escala ambos rellenos con el mismo progreso. Al nacer el contador las mitades ya no «crecen»: la regla tenue de la fila y el hueco que se abre bastan. Medido: contador 06 con ambos rellenos a 0.94 y 0.99 en las posiciones 5640 y 5720 px, y a 1 al terminar.
- Rombos de la regla de cierre: se encienden con un destello (`sc-foot-flash`, brillo ×2.2 → 1 en 0.8 s) al terminar el carrusel; ahora se anuncia con un evento `sc-rail-done` para que el título del stack espere a que estén encendidos.
- Alineación: los hilos aterrizaban a `+3px`/`+3px` del 8 % y el 92 %; el rombo derecho termina (no empieza) en el 92 %, así que su centro está a `−3.2px`. Corregido (`lx = 8 % + 3.2px`, `rx = 92 % − 3.2px`).
- Camino de luz (`SkillsStack.astro`): pasa de scrub a TIEMPO. Cuando los rombos de cierre están encendidos (`done`) y el título ha subido hasta `START_AT = 665px` desde la parte superior (entre su posición al soltarse el anclaje, ~710px, y un paso de rueda más, ~610px), una línea de tiempo recorre los hilos en `RUN_THREADS = 1.2` s con la chispa, las reglas hacia el texto en `RUN_RULES = 0.9` s y al terminar se encienden los rombos del título (`is-lit`) con su propio destello (`pt-diamond-flash`). Nunca empieza antes de que los rombos de cierre estén encendidos aunque se haga scroll muy rápido (`sync()` con `done && inRange`); al subir se deshace al revés a velocidad 2.5×; si se recarga más abajo, aparece ya completo. `refreshPriority: -3` para medirse después del anclaje.
- Comprobado a 1440×900 con scrolls simulados: 5750 px → rombos de cierre encendidos (`done`), `--c 0`; 5790 px (título a 643px) → `--c` sube a 1.00 (chispa en el hilo), después `--t` hasta 1.00 y por último `is-lit` verdadero con el rombo del título encendido. Aviso de pruebas: en el navegador de pruebas con el panel oculto los fotogramas avanzan muy despacio, por lo que la animación real (≈2.1 s) se vio más lenta.
- Límites: no se vio a velocidad real; el efecto de subida no se probó con rueda real.

## Proyectos: fase cerrada y guía de mantenimiento (31 de octubre de 2026)

- El usuario da por terminada la fase de Proyectos; lo pendiente es añadir y editar proyectos en el futuro. Se crea [[Mantener-Proyectos]] (campos de `ProjectItem`, plantilla, límites, qué se recalcula solo, cómo quitar o modificar, ilustraciones nuevas, comprobación y síntomas habituales) y se enlaza desde [[00-Empieza-Aqui|Empieza-Aqui]], [[Otras-Secciones-y-Compartidos]] y [[Contenido-por-Seccion]]; la fila «Proyectos» de la tabla de áreas de Empieza-Aqui pasa de «tres tarjetas provisionales» a «terminado».
- Comprobado contra el código: el contador cuenta las tarjetas con `data-sc-card` (solo `ProjectCard`, no `ProjectMoreCard`); el tinte se elige con `(id − 1) mod 6`; `art` desconocido dibuja la zona vacía; los esquemas laterales salen de los dos primeros proyectos con `art`; las descripciones más largas actuales miden 182 caracteres (ES y EN) y los dos idiomas tienen los mismos seis ids y artes.

## Transición Proyectos → Servicios: «la luz entra en el plano» (31 de octubre de 2026)

- El usuario eligió la propuesta **A (la luz entra en el plano) con un toque de la D (el escáner)**. Nuevo componente [ServicesBridge.astro](../../../src/components/ServicesBridge.astro), montado en Servicios con `<ServicesBridge slot="bridge" />` en [ServicesSection.astro](../../../src/components/ServicesSection.astro); [ShowcaseSection.astro](../../../src/components/ShowcaseSection.astro) tiene ahora un `<slot name="bridge" />` justo después del `SectionBackdrop`.
- Secuencia (por TIEMPO, como la cabecera de Proyectos): dos hilos bajan desde las esquinas inferiores de la placa del stack (base tenue siempre presente + capa iluminada `scaleY(--c)` + bolita de 11px), cruzan el borde dorado ondulado y llegan a dos rombos marrón que se vuelven dorados con destello (`LIT_AT = 1.2` s); desde ahí una línea de escáner baja por la sección (`--sb-p` de 0 a 1, 1.7 s) y la rejilla del plano (`.bd-grid` y `.bd-pulse`) se descubre con `clip-path` a su paso; el título se descubre de izquierda a derecha.
- Disparo: ScrollTrigger sobre `.pt-board`, `start: "bottom 62%"`, `refreshPriority: -4` (después del pin del carrusel y del hilo del stack). Al subir se revierte con `timeScale(2.5)`; si se carga ya pasado (scroll restaurado) se muestra terminado (`onRefresh`).
- Las posiciones de hilos y rombos se **miden** de la placa y de la sección (`--up`, `--lx`, `--rx`) y se recalculan en cada `refresh` y `resize`; no hay cifras fijas de página. Solo con `(min-width: 900px)` y sin «reducir movimiento»; en móvil / reduced-motion el componente no se activa (`display: none`) y Servicios queda estático.
- Regla recordada: las propiedades CSS animadas por GSAP (`--c`, `--so`, `--sb-p`) llevan un `gsap.set` inicial; si no, GSAP las lee como 0.
- Verificado (build de producción, puerto 4325, 1440×900): `npm run check` 0 errores; hilo de la placa al rombo cruzando el borde, rombo dorado con destello, escáner, rejilla y título revelados, reversión al subir. En 390px: sin desbordamiento horizontal, `ServicesBridge` oculto y sin recortes. **No verificado:** el ritmo real a 60 fps (el panel de pruebas va estrangulado) ni el hilo derecho completo a 1440 (el panel recortaba la derecha).
- Copias de seguridad: `backups/ShowcaseSection.astro.pre-puente-servicios-2026-10-31.bak` y `backups/ServicesSection.astro.pre-puente-servicios-2026-10-31.bak`.

## Servicios: puente reformado y esqueleto nuevo (31 de octubre de 2026)

- Tras la primera versión de la transición el usuario pidió: centrar título e introducción, quitar el «separador» bugeado y poner algo de la transición, y que el título se descubra **a la par del escáner** (arriba a abajo, no de izquierda a derecha). Elegida la opción **A (carriles laterales)** y el **esqueleto completo**. Guía de mantenimiento: [[Mantener-Servicios]].
- Cambios: `ServicesBridge` ahora prolonga los hilos como dos raíles hasta el cierre (segundo par de rombos) y descubre título, introducción, tarjetas, franja y cierre con `clip-path` ligado a la posición del escáner (`--sb-p`, `--rt` por elemento); `ServicesSection` pasa a `center`, con introducción corta, tarjetas con ilustración (`ServiceArt`, campo `art`), franja «Cómo trabajo» (`ServicesProcess`, `process` en `site.js`) y enlace de cierre a `#contact`; `ShowcaseSection` centra el modo no-rail y tiene variante oscura de la introducción; `ShowcaseCard` admite slot `media` y `arrow={false}`.
- «Separador»: se quita la línea de rejilla que cruzaba bajo el título (la rejilla empieza bajo la cabecera y se oculta el pulso de la fila 1); el cierre pasa a ser una regla dorada sobre la que terminan los raíles. La franja clara a todo ancho en el borde superior que el usuario pudo ver **no se reprodujo** en el panel de pruebas: pendiente de confirmar con el usuario.
- Decisión de ancho: los raíles recortan el contenido, así que el puente solo se activa desde 1200px (a 900–1199px las tarjetas quedaban de ~90px); la franja «Cómo trabajo» pasa a lista vertical por debajo de 1000px.
- La ruta `/servicios` no existe en esta rama (solo `index` y `video-converters`), por eso el cierre enlaza a `#contact` y `ctaLabel` pasa a «Cuéntame tu proyecto» / «Tell me about your project».
- Verificado (build de producción, puerto 4325): `npm run check` 0 errores (antes de los últimos ajustes de CSS, que solo tocaron `ServicesSection`) y `npm run build` correcto; 1280px: raíles, tarjetas (≈231px), franja encendida y cierre con rombos finales; 1440px: geometría medida (título, introducción y raíles centrados en el mismo eje); sincronía medida a lo largo del escáner (borde visible del título = posición de la línea); 390px: sin desbordamiento, puente oculto, franja en lista vertical. **No verificado:** ritmo real a 60 fps, el hilo derecho y la zona derecha a 1440 en pantalla (el panel recorta ~800px de ancho), 900–1199px tras los últimos cambios, inglés.
- Copias de seguridad: `backups/*.pre-servicios-esqueleto-2026-10-31.bak` (`ShowcaseSection`, `ShowcaseCard`, `ServicesBridge`, `ServicesSection`, `site.js`, `content-types.ts`).

## Servicios: banda clara bajo la ola y botón dorado (31 de octubre de 2026)

- **Causa de la «línea»**: el resplandor dorado (`drop-shadow(0 -3px 8px …)`) del `.bd-edge-svg` se derramaba **por debajo** del borde de la ola y quedaba sobre el principio de la sección como una franja clara a todo el ancho. Arreglo en [SectionBackdrop.astro](../../../src/components/SectionBackdrop.astro): `.bd-edge { clip-path: inset(-3rem 0 0 0) }` (el brillo sigue saliendo hacia arriba, pero no por debajo). Afecta a todos los bordes ondulados de la página (Tools, Contacto, FAQ…), solo para quitarles ese derrame.
- **Botón de cierre**: «Cuéntame tu proyecto» pasa a botón dorado metálico con el mismo acabado que el «Contacto» de la barra lateral (cara con bisel inclinado `skewX(-4deg)`, canto fijo debajo, estado pulsado). Los estilos están copiados en [ShowcaseSection.astro](../../../src/components/ShowcaseSection.astro) bajo `.sc-section--center .sc-cta` (los de la barra lateral están acotados al componente del Hero y no se pueden reutilizar tal cual). Solo afecta a secciones centradas.
- **Regla de cierre**: al ser ahora un botón centrado, la regla dorada sobre la que terminan los raíles es un elemento propio (`.sv-rule`, en `ServicesSection`); `ServicesBridge` mide dónde acaba por él.
- Pendiente de decidir con el usuario: sustituir la ola («nube») de la entrada a Servicios por algo que concrete mejor el cambio de página del escáner (propuestas enviadas en el chat).

## Servicios: borde recto «hoja de plano» en lugar de la ola (31 de octubre de 2026)

- Elegida la opción **B** de las tres propuestas (A «el plano se revela», B «hoja de plano», C «compuerta»), **solo en Servicios**: Tools y el resto de secciones conservan su ola.
- Servicios ya no dibuja la ola: `SectionBackdrop` tiene la prop `edge` (por defecto `true`), `ShowcaseSection` la recibe como `edge="wave" | "flat"` y `ServicesSection` pasa `edge="flat"`.
- El borde es ahora una **regla dorada recta** al principio de la sección con una **escala graduada** debajo (marcas cada 16px y más largas cada 80px), en [ServicesBridge.astro](../../../src/components/ServicesBridge.astro) (`.sb-sheet`, `.sb-rule`, `.sb-ruler`). Es parte siempre visible del componente: en móvil (<1200px) o con reducir movimiento se ve estática y encendida.
- Con el puente activo (≥1200px y con movimiento): la regla empieza **atenuada** y la escala oculta; cuando los hilos llegan y los rombos se encienden (`.sb.is-lit`) la regla se ilumina y aparece la escala. Los rombos (`--ny: 0`) están **sobre la regla**, dentro de unas **marcas de registro** (anillo con cruz, `.sb-reg`), y el escáner nace en la propia regla (`--sb-p` empieza en 0). Los raíles y el cierre no cambian.
- Verificado (build de producción, puerto 4325): a 1280px, borde recto con regla, escala, marca de registro y rombo; el hilo de la placa baja hasta la regla; secuencia (regla atenuada → hilos → rombo → regla encendida → escáner y título); a 390px regla estática con escala, sin desbordamiento horizontal. `npm run check` 0 errores. **No verificado:** ritmo real a 60 fps, el lado derecho a 1440px en pantalla, inglés.
- Cosas a tener en cuenta: la separación entre la placa del stack y la regla es la antigua (≈110px) pero ahora es champán liso, sin ola; si se ve demasiado vacía se puede acercar la regla bajando `--up`.

## Servicios: degradado champán → dorado → negro en la entrada (1 de noviembre de 2026)

- El usuario no quería un corte inmediato de color en la regla recta («pierde profesionalidad»). Se aplica la propuesta principal: un **degradado por encima del inicio de Servicios**, sobre el hueco entre la placa del stack y la regla.
- En [ServicesBridge.astro](../../../src/components/ServicesBridge.astro): `.sb-fade` (dentro de `.sb-sheet`, altura `--fade-h: clamp(8rem, 12vw, 10.5rem)`), degradado de transparente a `#1b1a17` **pasando por oro** (paradas suavizadas: 0 → 14% → 42% → 72% → 92% → 100%), para que el punto medio sea un metal oscureciéndose y no un gris. La regla, la escala, los rombos y las marcas de registro quedan justo donde el degradado ya es negro; el escáner sale de ahí. Los hilos de la placa atraviesan el degradado.
- Es parte siempre visible (también en móvil y con reducir movimiento).
- Barra lateral: `.sb-theme` (`section-theme-dark`, sin fondo) cubre la **mitad inferior** del degradado para que las tarjetas del sidebar pasen a tema oscuro al llegar al tramo dorado y no solo en la regla.
- Espacio: [SkillsStack.astro](../../../src/components/SkillsStack.astro) `.pt` tiene ahora margen inferior `clamp(3.5rem, 6vw, 5.5rem)` (antes 0) para que el hueco (≈180px a 1280) sea mayor que el degradado (≈154px) y no tape la placa.
- Verificado (build de producción, puerto 4325): a 1280px, degradado champán → dorado → negro sin escalón, hilos y rombos con marca de registro sobre la regla, títulos y rejilla como antes; a ~700px (versión estática) el degradado y la escala se ven bien; medido: degradado 154px dentro de un hueco de 179px (no solapa la placa). `npm run check` 0 errores. **No verificado:** ritmo a 60 fps, el cambio de tema del sidebar en pantalla paso a paso, lado derecho a 1440px, inglés.

## Servicios cerrado; texto de la segunda herramienta de Tools (1 de noviembre de 2026)

- El usuario da por **terminada la sección Servicios** (ver [[Mantener-Servicios]]) y pasa a Tools: se le entrega una auditoría de Tools y de la transición Servicios → Tools (la lista de herramientas va a crecer mucho, a diferencia de Servicios).
- Cambio de contenido en `tools.page.items[1]` (ES y EN, [site.js](../../../src/content/site.js)): «Comprobador de quién no te sigue en Instagram» pasa a **«Herramientas de boosting para redes sociales»** (EN: «Social media boosting tools»), con texto de colección («empezando por Instagram») y etiquetas «Redes sociales · Boosting · Próximamente». Se interpretó «booting» del usuario como *boosting* (crecer/potenciar cuentas); si quería decir otra cosa (p. ej. *bots*) basta cambiar esas tres cadenas por idioma.
- No se ha tocado el diseño de Tools todavía.

## Tools: «banco de herramientas» y transición T1 + T2 + T3 desde Servicios (1 de noviembre de 2026)

- Elegido el **banco completo** con las tres capas de transición (T1 «amanecer», T2 «el hilo continúa», T3 «encendido del banco»). Guía de mantenimiento: [[Mantener-Tools]].
- **Catálogo** ([ToolsCatalog.astro](../../../src/components/ToolsCatalog.astro), [ToolArt.astro](../../../src/components/ToolArt.astro)): contador, chips de categoría y de estado (se omiten si tienen un solo valor), destacadas a ancho completo y tarjetas compactas centradas, «Ver todas (N)» tras 6, estado vacío; sin JavaScript se ve todo. Datos nuevos por herramienta (`state`, `category`, `featured?`, `art?`) y `servicesTools.tools.catalog` (textos, ES/EN) en `site.js` y `content-types.ts`. Intro de Tools reducida a dos frases y centrada. `ShowcaseSection` gana la prop `grid` (por defecto `true`; Tools la apaga y usa el slot `after`).
- **T1**: Tools usa `edge="flat"` (sin ola). [ToolsBridge.astro](../../../src/components/ToolsBridge.astro) pone sobre el final de Servicios un degradado negro → oro → champán y una regla dorada recta con escala graduada. `HeroExperience` lee `data-theme-trim` de la sección oscura (aquí `#services`) para que las tarjetas de la barra lateral pasen a tema claro a mitad del degradado (única línea tocada del Hero).
- **T2**: de los rombos de cierre de Servicios salen hilos a ambos lados del botón dorado, se juntan bajo él en un rombo y siguen como uno solo (marca de registro al cruzar la regla) hasta un rombo sobre el título, que se descubre de arriba abajo. **T3**: después, un destello metálico cruza la placa una vez y suben la intro y el catálogo. Por tiempo, disparado cuando el botón de Servicios entra en pantalla; reversible; solo ≥1200px y con movimiento (donde existen los raíles de Servicios).
- Servicios: el botón dorado lleva `margin-bottom: clamp(6rem, 9vw, 8rem)` para dejar hueco al degradado y a los hilos.
- Verificado (build de producción, puerto 4325): a 1280px, tarjeta destacada y tarjeta compacta centradas, contador «2 herramientas · 1 disponible», chips; filtros por categoría y estado y «Todas» (probados por script: social → 1 tarjeta, social + disponible → vacío con mensaje, restablecer → 2); lógica de «Ver todas» probada con límite 1 (`Ver todas (2)` → `Ver menos`); hilos alrededor del botón con rombo de unión, hilo central con marca de registro, rombo sobre el título y título descubierto; secuencia por tiempo completa en el registro (clases `is-m`, `is-x`, `is-e`, `--sh`, `--tb-t`, `--tb-c` llegan a 1); barra lateral en tema claro sobre Tools; a 390px sin desbordamiento horizontal y puente oculto (solo degradado y regla). `npm run check` 0 errores. **No verificado:** ritmo real a 60 fps, el destello metálico en pantalla, «Ver todas» con más de 6 herramientas reales, lado derecho a 1440px, inglés.
- Copias de seguridad: no se pudo copiar el estado anterior de `site.js`, `content-types.ts`, `ShowcaseSection` y `HeroExperience` antes de editarlos (quedan en Git); solo hay `backups/ToolsSection.astro.pre-banco-2026-11-01.bak` (reconstruido del original).

## Tools: filtros simplificados, abre en «Destacadas» (1 de noviembre de 2026)

- Petición del usuario: con 30 herramientas todas saldrían en cascada. El catálogo ahora **abre en «Destacadas»** (solo `featured: true`, máximo 3) y los demás chips son las categorías (Vídeo, Redes sociales…); se **quitan el chip «Todas» y los filtros de estado** (Disponible / En desarrollo). Detalle y reglas en [[Mantener-Tools]].
- Cambios: [ToolsCatalog.astro](../../../src/components/ToolsCatalog.astro) (chips, script, prop `featuredLimit`, clase `is-wide` para una sola herramienta en vista), `ToolsCatalogCopy` (`filterAll` → `filterFeatured`; se elimina `statusLabel`) en `content-types.ts` y en `site.js` (ES/EN). El estado sigue mostrándose como LED en cada tarjeta.
- Con los datos actuales solo el conversor es `featured`, así que «Destacadas» muestra una tarjeta ancha y la de redes sociales aparece en su chip; marcarla `featured: true` la añade a la vista inicial.
- Verificado (build de producción, puerto 4325): `npm run check` 0 errores; por script en la página: abre en Destacadas con 1 tarjeta ancha, «Redes sociales» y «Vídeo» muestran una tarjeta cada una, ya no hay chips de estado; simulación con 30 herramientas: Destacadas muestra 3 de 5 sin botón, una categoría de 10 muestra 6 con «Ver todas» y 10 al expandir. **No verificado:** captura visual de la barra con los chips nuevos (el panel de pruebas saltó de posición), vista con 2 o 3 destacadas en pantalla, inglés.

## Tools cerrado; «boosting» pasa a Destacadas (1 de noviembre de 2026)

- `featured: true` en «Herramientas de boosting para redes sociales» (ES y EN, [site.js](../../../src/content/site.js)): «Destacadas» muestra ahora las dos herramientas actuales (conversor y boosting) como tarjetas compactas. Cambio de datos solamente, sin comprobar en pantalla.
- El usuario da por **terminada la sección Tools** (ver [[Mantener-Tools]]) y pasa a Contacto: se le entrega una auditoría de Contacto y de la transición Tools → Contacto.

## Contacto rediseñado: «señal», formulario con mailto y 4 campos (1 de noviembre de 2026)

- Elegida la transición **A «Señal»**, el formulario con **`mailto:`**, **4 campos** y **LinkedIn apagado como en el sidebar**. Guía: [[Mantener-Contacto]].
- **Esqueleto** ([ContactSection.astro](../../../src/components/ContactSection.astro)): cabecera centrada con lead corto; tarjeta «Escríbeme directamente» (botón dorado de email, dirección, «Copiar» con aviso «Copiado» y canales) y tarjeta «O déjame un mensaje». LinkedIn sale apagado (opacidad, sin enlace, con tooltip) hasta que exista `links.linkedin`. Botón dorado `.ct-metal` (global en `ContactSection`) con el acabado del sidebar y de Servicios; lo usan el botón de email y el de enviar.
- **Formulario** ([ContactForm.astro](../../../src/components/ContactForm.astro)): nombre, email, motivo (chips con radios) y mensaje (máx. 1500). Se eliminan `subject` y `preferredResponse` de la interfaz de datos, la validación (`lib/forms`), `content-types.ts` y `site.js`. Al enviar, tras validar, abre el correo del visitante con `mailto:` (asunto `motivo · nombre`, cuerpo con el mensaje, nombre y email); el aviso superior lo explica y el texto de éxito remite al botón «Copiar» por si no hay cliente de correo. Contacto deja de estar «simulado».
- **Transición** ([ContactBridge.astro](../../../src/components/ContactBridge.astro); el fondo usa `edge={false}`): degradado champán → oro → negro sobre el final de Tools, regla con escala y marca de registro; del pie del catálogo baja un hilo hasta un rombo-faro sobre el título y de él sale un anillo dorado (con dos más tenues) que descubre título, lead y tarjetas con `clip-path: circle` (cierra el círculo del iris de Proyectos). Por tiempo, ≥900px y con movimiento, reversible. La barra lateral pasa a oscuro a mitad del degradado. En `ToolsSection` el catálogo lleva `margin-bottom` para dejar hueco.
- Verificado (build de producción, puerto 4325): `npm run check` 0 errores; a 1280px título, lead y catálogo de Tools centrados en el mismo eje (mismo eje que el hilo), tarjetas directa y formulario con motivo en chips y 4 campos, hilo desde el catálogo con rombo de origen, degradado y regla con marca de registro, rombo-faro sobre el título, `cb-revealed` al terminar; enviar vacío marca los 4 campos con sus mensajes y enfoca el primero; «Copiar» cambia a «Copiado» y vuelve; 390px: tarjetas apiladas (directa primero), sin puente (solo degradado y regla). **No verificado:** el anillo de señal a mitad de animación en pantalla, el envío válido real (abrir el cliente de correo), ritmo a 60 fps, inglés, el lado derecho a 1440px. El desbordamiento horizontal que mide el panel a 390px viene del menú móvil del Hero, no de Contacto.
- Copias de seguridad: `backups/*.pre-contacto-2026-11-01.bak` (`ContactSection`, `ContactForm`, `site.js`, `content-types.ts`, `ToolsSection`, `ToolsCatalog`); `lib/forms/types.ts` y `validate.ts` no se copiaron (cambios de dos líneas, en Git).

## Fronteras con personalidad propia y FAQ rediseñada (1 de noviembre de 2026)

- **Motivo:** la regla con escala, el degradado y la marca de registro se repetían en Servicios, Tools y Contacto; el usuario quiere que cada sección tenga su personalidad. Principio: **el camino de luz (hilo, rombo, chispa) es común; la frontera es propia de cada sección.** Elegido: Servicios sin cambios (regla, escala y marcas = el plano), Tools «Labio de metal», Contacto «Horizonte», FAQ «Amanecer».
- **Tools** ([ToolsBridge.astro](../../../src/components/ToolsBridge.astro)): se quitan regla, escala y marca de registro; el degradado lleva estrías de cepillado y la frontera es un labio biselado de metal cepillado con remaches (`.tb-lip`), con un destello que lo recorre (`--sh`) y un tornillo hexagonal (`.tb-bolt`) donde lo cruza el hilo.
- **Contacto** ([ContactBridge.astro](../../../src/components/ContactBridge.astro)): se quitan regla, escala y marca; el negro sube como una cúpula muy suave con el borde de luz (`.cb-arc`, media elipse, recortada en horizontal con `overflow-x: clip` para no ensanchar la página), un resplandor (`.cb-glow`) y estrellas que titilan (`.cb-stars`). El hilo llega al vértice del horizonte, que se enciende al cruzarlo. Las variables de posición (`--cx`, `--cb-a`, etc.) pasan a la sección.
- **FAQ** ([FaqSection.astro](../../../src/components/FaqSection.astro), [FaqBridge.astro](../../../src/components/FaqBridge.astro)): frontera «Amanecer» (sol que sube con el scroll, mismo resplandor reflejado a ambos lados de la línea, motas y «?» que suben; sin regla ni hilo); cabecera centrada con lead; **una columna** de 7 preguntas numeradas con apertura animada y **solo una abierta a la vez**; atajos (`link`) a otras secciones dentro de las respuestas; «¿No está tu pregunta? Escríbeme»; cierre «Gracias por llegar hasta aquí. — chiissuu» con botón redondo dorado de «volver arriba» (`#home`). La frase anterior («Construyendo, un proyecto cada vez.») se sustituye. Datos nuevos en `content-types.ts` y `site.js` (ES/EN): `faq.lead`, `faq.more`, `FaqItem.link`, `closing.topLabel`; `FaqSectionContent` incluye `closing`. Preguntas nuevas apoyadas en lo que ya dice la web (stack, cómo empezamos, privacidad del conversor); la respuesta de freelance deja de ser un placeholder y pasa a ser no comprometida. Guía: [[Mantener-FAQ]].
- Contacto: `margin-bottom` en `.ct-layout` para dejar sitio al amanecer; `data-theme-trim` en `#contact` para el cambio de tema de la barra lateral.
- Verificado (build de producción, puerto 4325): `npm run check` 0 errores; a 1280px Tools muestra el labio con remaches, el tornillo bajo el hilo y el degradado estriado; Contacto el horizonte con el borde de luz y las estrellas, sin desbordamiento horizontal (medido: ancho de página = ancho de ventana, tras añadir el recorte); FAQ el degradado negro → oro → marfil con el sol, motas y «?» y la lista en una columna; abrir una pregunta cierra la anterior (estado medido durante la animación) y se abre/cierra otra vez; cierre con firma (el botón queda dentro de la ventana; la captura del panel recorta la parte baja); a 390px FAQ con el sol centrado y las preguntas a ancho completo. **No verificado:** el sol en su punto más alto en pantalla (se midió `--sun`=1 pero la captura se tomó a mitad de subida), el destello del labio en movimiento, ritmo a 60 fps, el cambio de tema de la barra lateral paso a paso, inglés, el lado derecho a 1440px.
- Copias de seguridad: `backups/*.pre-fronteras-faq-2026-11-01.bak` (`ToolsBridge`, `ContactBridge`, `ContactSection`, `FaqSection`, `site.js`, `content-types.ts`).

## Auditoría previa a la publicación (1 de noviembre de 2026)

- **Corregido:** a 1024 px de ancho la página ganaba 18 px de scroll horizontal. Causa: `#tools` (y `#services`) no recortaban sus elementos decorativos laterales; solo lo hacía `.sc-section--rail`. Arreglo: `overflow-x: clip` en todas las `.sc-section` de [ShowcaseSection.astro](../../../src/components/ShowcaseSection.astro) (el eje vertical sigue sin recorte, así que puentes e iris no cambian). Medido tras el cambio: `scrollWidth` = ancho de ventana y no se puede desplazar en horizontal. No verificado visualmente (la captura del panel sale en negro).
- **Estado medido:** `npm run check` 0 errores y 0 avisos en `src/`; `npm run build` OK (2 páginas); un solo `h1`; 61 imágenes, todas con `alt`; sin IDs duplicados ni anclas `#` rotas; enlaces externos con `noopener`; sin errores en consola.
- **Pendientes detectados antes de publicar:** resueltos o decididos el 3 de noviembre de 2026 (sección siguiente).

## Preparación para publicar: limpieza, 404, SEO y cifras (3 de noviembre de 2026)

- **Borrado (sin uso, comprobado por búsqueda de referencias):** fuente `Milesdane-Trial.otf` y su aviso (licencia solo personal), `hero-background-gold.png` (4,6 MB), `profile-cutout.png`, `profile-cutout-trimmed.png`, logos `html.png` y `css.png`; componentes `ClosingStatement`, `ServicesPageContent`, `ServicesForm`, `ServicesTeaser`, `ToolsPageContent`, `ToolsTeaser`; `lib/forms/submit.ts`, `validateServicesForm`, `ServicesFormData` y `SubmitResult`. Se mantiene `about-title-en.png` (lo usa el inglés, aún no publicado) y las banderas `gb`/`de` (se cargan por país). Quedan datos inertes en `site.js`/`content-types.ts` (p. ej. `services.form`), por podar.
- **Añadido:** 404, `robots.txt`, `sitemap.xml`, `site`, canonical, Open Graph, Twitter Card y su imagen (detalle en [[05-SEO-Comunicaciones-Persistencia|SEO-Comunicaciones-Persistencia]]). El botón dorado `.ct-metal` pasó de `ContactSection` al layout global para compartirlo con la 404.
- **Contenido:** métricas del Hero «3+» años y «20+» proyectos (ES/EN); `imageAlt` del retrato ya no dice «provisional». Tarjetas de Proyectos y LinkedIn apagado se dejan como están a propósito.
- **Verificado:** `npm run check` 0 errores y 0 avisos; `npm run build` genera `404.html`, `robots.txt`, `sitemap.xml`, `index.html` y `video-converters/index.html` con canonical y metadatos correctos (la 404 con `noindex`); en el navegador la 404 se ve con el estilo del sitio y la home carga todos sus recursos con 200, con el botón dorado, las cifras nuevas y sin scroll horizontal. **No verificado:** la tarjeta real al compartir en redes (depende del dominio publicado), la 404 en el hosting final, la web en móvil tras estos cambios.

## Publicación, dependencias y CSP (4 de noviembre de 2026)

- **Publicada** en https://chiissuu.com (Netlify desde la rama `master` de GitHub; dominio comprado en Cloudflare con los registros A y CNAME en «Solo DNS»; certificado de Let’s Encrypt). `www` redirige a `chiissuu.com`. Registros SPF y DMARC restrictivos (el dominio no envía correo).
- **Dependencias:** `npm audit` pasó de 4 avisos (Vite, undici, fast-uri, zod; solo herramientas de desarrollo) a 0 con `npm audit fix` (solo cambió `package-lock.json`). Pendientes sin aplicar: menores de `astro` 7.4.5, `@astrojs/react` 7.1.2, `@astrojs/check` 0.9.12 y `gsap` 3.15.1; mayores (React 19, TypeScript 7, lucide) no recomendados por ahora.
- **CSP y cabeceras:** ver [[05-SEO-Comunicaciones-Persistencia|SEO-Comunicaciones-Persistencia]]. Configuración de preview añadida a `.claude/launch.json` (puerto 4330).
- **Fuente PP Neue Montreal: retirada** (4 de noviembre de 2026). Su versión gratuita es solo de uso personal y se servía en producción. Se borraron el archivo y su `@font-face`; `--font-editorial` es ahora Inter. Medido a 16 px: Inter es un 15 % más ancha (669 frente a 582 px la misma frase) y un 8 % más alta de «x» que PP Neue, así que no hizo falta ajustar tamaños. En la home los intros de Servicios y Tools ya usaban Space Grotesk (su estilo centrado lo fuerza): el único texto que cambió es el de la 404.

## Compatibilidad: animaciones siempre activas con interruptor (4 de noviembre de 2026)

- **Origen:** en el PC de torre del usuario la web se veía estática. Causa confirmada con `matchMedia("(prefers-reduced-motion: reduce)")` = `true` (Windows con los efectos de animación apagados). Chrome de esa torre además dibujaba por software (`about:gpu`: «Software only», pese a tener una RTX 4070 Ti); eso solo afecta al efecto de agua del Hero. heynesh.com se veía animada porque ni consulta esa preferencia ni usa WebGL.
- **Hecho:** interruptor de animaciones (ver [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]]): `public/motion-init.js`, botón en el Hero y el menú móvil, CSS reescrito a `html[data-motion]`, `hero.motion` en los datos y arreglo del menú lateral en modo apagado.
- **Fallo previo corregido:** si la página cargaba ya desplazada, `HTMLImageElement.decode()` del retrato nunca se resolvía (la imagen está fuera de pantalla) y el Hero no llegaba a inicializar menú lateral, temas ni enlace activo (también con animaciones activas). Ahora la espera tiene un límite de 1,2 s (`decodeWithTimeout`).
- **Verificado** (build de producción con CSP, puerto 4330, panel visible): activado = botón visible, `matchMedia` responde «no reducir», menú lateral por scroll de rueda, sin violaciones de CSP ni errores; apagado = `data-motion="off"`, botón «no», menú lateral aparece en las seis secciones con el enlace activo correcto y se oculta arriba, recarga mantiene el scroll; móvil (375 px): píldora oculta, botón al final del menú, sin desbordamiento horizontal; el botón cambia el estado en los dos sentidos. `check` 0 errores y `build` correcto.
- **No verificado:** en el PC de torre real, el ritmo a 60 fps, el inglés, la 404 y el conversor con el modo apagado, y el comportamiento con el panel de pruebas oculto (los eventos de scroll reales no llegan: es una limitación del entorno de pruebas, no de la web).
- Copias de seguridad: `backups/*.pre-motion-toggle-2026-11-04.bak`.

## Web en inglés (4 de noviembre de 2026)

- **Hecho:** `/en/` y `/en/video-converters/` (+ 404 inglesa), selector «ES | EN» arriba a la izquierda (simétrico al botón de animaciones), `hreflang`, canonical y `og:locale` por idioma, sitemap con alternativas, reglas de Netlify (`/es/` → raíz y 404 inglesa), títulos gráficos en inglés (Projects, Services, Contact), `hero.personalNote` en inglés (la «clave ausente»). Detalle: [[Bilingue-ES-EN]].
- **Fallo previo corregido:** los enlaces con ancla (`/#contact`) no aterrizaban en la sección ni en producción; ahora el Hero salta al ancla (también al cambiar de idioma).
- **Verificado** (build de producción con CSP, puerto 4330, panel visible): `npm run check` 0 errores (el inglés cumple los tipos); 6 páginas generadas con `<html lang>`, canonical, `hreflang` y `og:locale` correctos; sitemap con las cuatro URLs y alternativas; en `/en/`: Hero, menú lateral y secciones en inglés con los títulos nuevos, el selector se desplaza a la derecha del menú lateral, el botón ES lleva a `/#contact` conservando la sección y aterriza en ella; `/en/video-converters/` con textos, enlaces y selector en inglés; móvil (375 px): menú con «ES | EN» y «Animations: on», etiquetas «Open/Close menu», sin desbordamiento; sin violaciones de CSP.
- **No verificado:** la regla de Netlify de la 404 inglesa y la redirección `/es/` (solo existen en producción), el conversor funcionando en inglés (solo se vio la interfaz), la página en Safari/Firefox, el sitemap en Search Console.
- Copias de seguridad: `backups/*.pre-i18n-2026-11-04.bak`.

## Servicios, carrusel sin animaciones y GFX (4 de noviembre de 2026)

- **Texto:** el primer paso de «Cómo trabajo» deja de estar en plural de equipo: «Se valora qué necesitas…» / «What you need is assessed…». Se dejaron las frases de la FAQ que incluyen al cliente («¿Cómo empezamos un proyecto?», «valoramos juntos…»), que no afirman un equipo. El tercer renglón del título del Hero en inglés vuelve a ser «GFX».
- **Fallo corregido:** con las animaciones apagadas no había forma de ver los proyectos que no cabían: el carril es una tira con scroll nativo, pero con la barra casi invisible, sin controles y con la rueda moviendo solo la página. Ahora ([ShowcaseSection.astro](../../../src/components/ShowcaseSection.astro)), **solo con `html[data-motion="off"]`**: barra de desplazamiento visible, dos flechas doradas con contador «01 / 06» que avanzan una tarjeta (`sc-nav`, `initRailNav`), y el carril enfocable con teclado (`tabindex`, `role="region"`, nombre desde `projects.railNav` en ES/EN). Con las animaciones encendidas no cambia nada (carrusel anclado).
- **Verificado** (build de producción, 1280 px): apagado = 6 tarjetas, cada flecha avanza 341 px, el contador llega a 06 / 06, «siguiente» se desactiva al final y «anterior» vuelve; encendido = flechas ocultas y carril anclado; textos y «GFX» correctos en español y en inglés; `check` 0 errores y `build` correcto. **No verificado:** las flechas del teclado con una pulsación real (el navegador de pruebas solo emite eventos sintéticos), el arrastre táctil, el móvil con las animaciones apagadas.
- Copias de seguridad: `backups/*.pre-rail-nav-2026-11-04.bak`.

## LinkedIn enlazado (4 de noviembre de 2026)

- `contact.links.linkedin` = perfil de LinkedIn del usuario (ES y EN). La barra lateral ([HeroExperience.astro](../../../src/components/HeroExperience.astro)) y el canal de Contacto pasan de tarjeta apagada a enlace (`target="_blank"`, `rel="noopener noreferrer"`, flecha dorada como GitHub). Sin URL siguen apareciendo apagados con su tooltip.
- Verificado en el HTML generado: 2 enlaces por página (barra lateral y Contacto) en español e inglés, ninguno apagado; `check` 0 errores. No verificado en el navegador a mano.

## Móvil: menú en cajón lateral (5 de noviembre de 2026)

- **Decisión del usuario:** menú abierto como **cajón lateral** (opción B de las maquetas), botón de hamburguesa **metálico dorado** y las **redes** debajo.
- **Hecho** ([HeroExperience.astro](../../../src/components/HeroExperience.astro), solo <900 px): el panel claro de pantalla completa pasa a ser un cajón que entra desde la derecha (`.hx-drawer`, ancho `min(21rem, 88vw)`, fondo grafito como las secciones oscuras) con la página oscurecida detrás. Cuatro tarjetas de cristal con el marco dorado del menú lateral del ordenador (`.hx-sidebar-article.hx-glass`, tema oscuro fijo): marca CHISU® con el lema; **siete botones dorados metálicos** con icono (los mismos `sidebarNavItems`, ahora **con FAQ**, que el menú móvil antiguo no tenía) de 44 px de alto como mínimo; selector «ES | EN» y botón de animaciones; y las redes (LinkedIn, GitHub, Redes sociales). El botón de la sección actual se muestra elevado y brillante (`.is-active`, igual que en el ordenador): `navLinkEls` del script ahora recoge los `[data-nav-id]` de todo el documento (menú lateral y cajón).
- **Botón de hamburguesa:** círculo de 48 px de metal dorado (mismo degradado y borde que los botones), con las barras en tinta oscura; sigue convirtiéndose en la X de cierre y queda sobre el cajón (la tarjeta de marca le deja hueco con `padding-inline-end`).
- **Comportamiento conservado:** bloqueo del scroll de fondo, fondo inerte, Escape (devuelve el foco al botón), clic en el fondo, cierre al pulsar un enlace y trampa de foco (ahora incluye también los botones: el de animaciones). Primer foco: el botón «Inicio».
- **Animaciones:** solo con `html:not([data-motion="off"])`: el fondo se desvanece, el cajón se desliza (300 ms) y las tarjetas suben escalonadas; con las animaciones apagadas aparece de golpe.
- **Error propio corregido durante la prueba:** al reescribir el panel se quitó su `display`, y la regla base de escritorio (`.hx-mobile-nav { display: none }`) lo dejaba en 0 × 0. Ahora `display: block`.
- **Verificado** (build de producción, panel visible): 390 × 844 = cajón de 336 px, todo cabe sin scroll, botones de 44 px, sin desbordamiento horizontal; abrir/cerrar (botón, Escape, clic fuera, enlace) y navegación al ancla; el botón activo sigue la sección (`aria-current`); 320 × 568 = el cajón (282 px) se desplaza por dentro; 844 × 390 horizontal en inglés = etiquetas en inglés y desplazamiento hasta las redes; animaciones apagadas = aparece al instante; 1280 px = botón y cajón ocultos, menú lateral intacto, sin errores en consola. `check` 0 errores y `build` correcto.
- **No verificado:** el aspecto exacto del lado derecho en 320 px (el panel de capturas recorta a ese ancho; las medidas sí son correctas), la fluidez de la entrada en un móvil real y Safari de iPhone.
- **Pendiente visto de paso:** a 320 px el wordmark del Hero parece recortado por la derecha; se revisará con la siguiente ronda de adaptación a móvil.
- Copias de seguridad: `backups/HeroExperience.astro.pre-drawer-2026-11-05.bak`.

## Móvil: el cajón cabe en pantalla, por alturas (5 de noviembre de 2026)

- **Motivo:** el cajón medía el 100 % de la altura y su contenido ~844 px: en un móvil real (Safari y Chrome pierden espacio con sus barras; visibles ~660-750 px) siempre se desplazaba y se cortaba la navegación. Criterio: **los siete botones deben verse siempre enteros**; solo lo secundario puede quedar abajo.
- **Hecho** (solo dentro de `@media (max-width: 899px)`; el ordenador no se toca):
  - **Alto (más de 800 px de alto):** versión completa (marca con lema, botones, controles, redes con texto). Necesita ~765 px.
  - **Medio y bajo (hasta 800 px):** compacta: la tarjeta de marca solo lleva el logo (sin lema), las redes pasan a **tres iconos redondos de 44 px** con su nombre solo para lectores de pantalla, y se aprietan espacios. Botones de navegación en 44 px.
  - **Muy bajo o en horizontal:** el cajón se desplaza por dentro, con la X siempre visible y un **degradado abajo** (`.hx-drawer::after`, la clase `has-more` la pone `updateDrawerHint` mientras quede contenido por debajo).
- **Verificado** (medidas en build de producción): 390 × 844 = versión completa, cabe (sobran ~100 px), también en inglés (lema de 4 líneas, sobran 91 px); 390 × 700 = compacta, cabe con 114 px de sobra; 375 × 667 en inglés = compacta, cabe con 85 px de sobra; 320 × 568 = los siete botones se ven enteros arriba y el cajón se desplaza 52 px por dentro; botones de 44 px en todos; la regla `.has-more::after` existe y coincide. `check` 0 errores y `build` correcto.
- **No verificado:** el degradado inferior en movimiento y su actualización al desplazarse (el panel de pruebas quedó sin foco y con el reloj de la página parado), y la activación del menú lateral del ordenador tras este último cambio (no se tocó; las medidas de su geometría coinciden con las anteriores). Móvil real y Safari de iPhone.
- Aviso para futuras pruebas: inyectar `<style>` desde la consola **lo bloquea la CSP** (por eso un experimento de depuración parecía no aplicar); usar clases/atributos existentes.
- Copias de seguridad: `backups/HeroExperience.astro.pre-drawer-fit-2026-11-05.bak`.

## Móvil: auditoría, imágenes en WebP y Hero en pantallas bajas (6 de noviembre de 2026)

- **Método de auditoría:** extensión de Claude en el Chrome real del usuario (render real, JS y capturas; `resize_window` solo baja a 390 de ancho y no emula táctil ni abre DevTools) y panel del navegador integrado (tamaños exactos, pero **el reloj de la página se para si el panel está oculto**: no sirve para scroll, transiciones ni tiempos de fotograma). Los tiempos de fotograma no se pudieron medir con fiabilidad en ninguno; solo inventarios de DOM/CSS.
- **Imágenes (hecho):** PNG pesados pasados a WebP con `sharp`, con control de calidad (PSNR contra el original, sobre negro y sobre blanco; ≥ 45 dB = idéntico a la vista). Wordmark del Hero 757 KB, títulos de Sobre mí 568/554 KB (casi sin pérdida), fondo del Hero 25 KB, 41 iconos de skills a ≤ 160 px (1–8 KB; se muestran a 40 px). Carga de la portada medida: **9,9 MB → 2,1 MB**. Referencias cambiadas en `HeroExperience.astro`, `site.js` (82 iconos, títulos), `scripts/generate-og-image.mjs` y `scripts/generate-about-veins.mjs`. Los PNG originales están en `backups/images-originales-2026-11-06/` (sin versionar) y en el historial de Git.
- **Hero en pantallas bajas (hecho):** el Hero móvil estaba afinado para 844 px de alto; el título quedaba a 1 px de la segunda cifra y con menos altura todo se apilaba. Regla nueva `@media (max-width: 640px) and (max-height: 760px)`: las dos cifras pasan a **una fila compacta bajo el wordmark** y se quita la lista de rasgos (`.hx-aside-right`). Alturas de 761 px o más no cambian (la regla no se aplica). Verificado en Chrome real a 390 × 604: fila de cifras, título y botones sin solapes. **No verificado:** 700 px exactos ni móvil real.
- **Cajón:** el lema de la marca se conserva hasta 700 px de alto (antes se quitaba a ≤ 800); por debajo de 700 px se quita.
- **Rechazado por el usuario (no aplicar):** agrandar objetivos táctiles, agrandar textos pequeños y ocultar la hamburguesa al desplazar.
- **Hallazgos para el informe de animaciones:** en móvil ya hay 35 animaciones CSS infinitas (puntos de FAQ ×10, ecualizador de Sobre mí ×9, pulsos de Servicios/Proyectos…) y **24 `backdrop-filter` en Proyectos** (las tarjetas del carrusel): ese es el coste móvil más probable, no las animaciones de escritorio. Puertas de las animaciones de escritorio: Proyectos (carrusel fijado, contador, iris) ≥ 900 px; Servicios (puente de luz) y Tools ≥ 1200 px; Contacto ≥ 900 px; «Cómo trabajo» ≥ 1000 px; Stack ≥ 900 px.
- Copias de seguridad: `backups/HeroExperience.astro.pre-hero-short-2026-11-06.bak`.

## Móvil: Hero nuevo y animaciones alternativas (6 de noviembre de 2026, segunda parte)

- **Hero (hecho):** composición propia hasta 640 px, tomada de heynesh.com; ver [[Hero-y-Sidebar]] (sección «Hero en móvil»). Sustituye a la regla de pantallas bajas de la primera parte (`max-height: 760px`), que se retira: ahora hay una sola composición y la tarjeta de rasgos se oculta con menos de 800 px de alto. **Verificado:** 390×844 (con la entrada completa), 390×667 y 360×640 en inglés (medidas sin solapes: cifras/título/botones/nota; ancho de documento = ancho de pantalla). **No verificado:** móvil real, Safari de iPhone.
- **Animaciones para móvil (hecho).** Módulo común `src/lib/mobileReveal.ts` (`revealOnEnter`: un `IntersectionObserver`, una transición de opacidad/`transform` —o de `clip-path`, una vez— por elemento y limpieza de las clases al terminar; clases `.m-rev`/`.m-iris` en `Layout.astro`). Cada alternativa va dentro de `gsap.matchMedia()` con la consulta **complementaria** de la de escritorio y con `prefers-reduced-motion: no-preference` (que `motion-init.js` contesta con el botón), así que con el botón apagado o al cruzar el ancho se deshace sola:
  - **Proyectos** (≤ 899 px): el carrusel sigue siendo una tira nativa; contador 01/06, barra de progreso, tarjeta enfocada y rombos de cierre siguen su `scrollLeft` (un listener pasivo, solo `transform`). La cabecera se abre una vez como iris (`m-iris`). Atributo `data-m-rail`.
  - **Servicios** (≤ 1199 px): la regla dorada se enciende con un pulso al entrar (`sb-m`, clase `is-lit` en `[data-sb]`), y título, introducción, tarjetas y botón suben una vez.
  - **«Cómo trabajo»** (≤ 999 px): cada paso se enciende una vez al llegar a él y dibuja su tramo de hilo (`is-m-wired`, `scaleY`).
  - **Tools** (≤ 1199 px): el labio metálico se enciende con un destello (`tb-m`) y suben título, introducción y catálogo.
  - **Contacto** (≤ 899 px): el borde del horizonte se enciende y sale una señal de tres aros que crecen una vez con `transform: scale` (`cb-m`, `cb-m-fire`); suben título, línea y tarjetas.
  - **`backdrop-filter`:** en `ProjectCard.astro`, hasta 899 px, las 24 píldoras (número y etiquetas) pasan a fondo plano `rgb(5 5 5 / 62%)` sin desenfoque (la tira se desplaza de lado y el desenfoque se repinta en cada fotograma).
  - Escritorio sin cambios: a 1440×900 siguen activos `sb-wired`, `tb-wired`, `cb-wired`, `data-rail-on` y `is-wired`, y no hay clases `m-*`.
- **Verificado:** `check` 0 errores y `build` correcto; a 390×844 todas las alternativas se activan al llegar a cada sección (clases comprobadas por script), el contador y la barra de Proyectos siguen la tira (01→06, rombos de cierre encendidos al final), los cuatro pasos de «Cómo trabajo» se encienden; con las animaciones apagadas no queda nada oculto y reaparecen las flechas de la tira. **No verificado:** el aspecto en movimiento de cada efecto (el panel va a muy pocos fotogramas por segundo), el rendimiento real en un móvil (sin medición de fotogramas), tablets en horizontal.
- **Entre 900 y 1199 px** (tablets): Servicios y Tools usan ahora la alternativa de una vez (antes no tenían nada); el resto sigue con la versión de escritorio.
- Copias de seguridad: `backups/*.pre-mobile-motion-2026-11-06.bak` (Layout, ServicesProcess, ServicesBridge, ToolsBridge, ContactBridge, ShowcaseSection, ProjectCard).
- **Fondo del Hero en móvil (hecho):** el fondo de escritorio es apaisado (2048×1172) y `cover` en una pantalla vertical solo conserva su 26 % central (rayos verticales, sin remolinos): se veía lineal. Recurso nuevo `public/assets/images/hero-background-gold-mobile.webp` (12 KB, 780×1688): la misma imagen, su 62 % central ajustado a un marco vertical (se conservan la luz de arriba, los remolinos de la derecha y el bucle de abajo). Se aplica con `@media (max-width: 899px) and (orientation: portrait)` sobre `.hx-pin-fade`; en móvil solo se descarga esa imagen. El efecto de agua de `heroFluid.ts` ya solo funciona con puntero fino y no se tocó. Se probaron también giros de 90° (más remolinos, pero la luz pasa al lado y cambia el carácter): descartados. Verificado a 390×844 (fondo cargado, solo se descarga el móvil) y a 1440 (sigue el original). No verificado: móvil real, banda de color (*banding*) en pantallas OLED. Copia previa: `backups/HeroExperience.astro.pre-mobile-bg-2026-11-06.bak`.

## Móvil: fila superior del Hero con logo, idioma y animaciones (6 de noviembre de 2026, tercera parte)

- **Qué es:** hasta 640 px de ancho, en el hueco superior del Hero (antes vacío a la izquierda del botón de menú) hay una fila `.hx-topbar` dentro de `.hx-full-hero-intro-motion`: a la izquierda la marca pequeña (la misma imagen del wordmark con la ® dorada, clases propias `.hx-top-mark*`), y a la izquierda del botón redondo de menú el selector **ES | EN** y la píldora de **animaciones** abreviada a «ON/OFF + interruptor» (la etiqueta se oculta; `aria-label` y `title` la dicen). Los mismos controles siguen en el cajón.
- **Comportamiento:** la fila forma parte del Hero y se va con él al desplazarse; solo el botón de menú es fijo (no se añade nada más tapando el contenido). Los scripts finales ya enlazaban todos los `[data-lang-link]` y `[data-motion-toggle]`, así que no hizo falta código nuevo. Por debajo de 360 px de ancho la marca se oculta y quedan los dos controles. De 641 px en adelante la fila no se dibuja (las tabletas siguen con los controles solo en el cajón).
- **Verificado:** 390 px (marca 20–106, idioma 172–242, animaciones 248–317, menú 326–374: sin solapes) y 360 px en inglés (idioma y animaciones a la misma altura, sin desbordar); el enlace ES apunta a `/` y el botón de animaciones cambia `chiissuu:motion` (`off` → `on`). `check` 0 errores y `build` correcto. **No verificado:** el cambio real de idioma por clic en un móvil, 320–340 px de ancho, Safari de iPhone.

## Móvil: la fila superior pasa a ser fija, y cursor de la terminal de Sobre mí (6 de noviembre de 2026, cuarta parte)

- **Fila superior fija:** `.hx-topbar` sale del Hero y se coloca junto al botón de menú (fuera de `.hx-wrap`), con `position: fixed` y el mismo `z-index: 110`: el selector ES | EN y la píldora de animaciones se quedan en pantalla al desplazarse, como la hamburguesa. Se oculta (`visibility: hidden`) mientras el menú está abierto (clase `hx-mobile-nav-open` de `html`) porque el cajón tiene su propia copia. Sustituye a la versión «dentro del Hero» de la tercera parte.
- **Logo CHISU®:** en el Hero estaba justo sobre el wordmark grande y se veía duplicado. Ahora solo aparece al salir del Hero (clase `is-past-hero`, puesta por un `IntersectionObserver` sobre `.hx-wrap` con margen superior de −70 px; se vuelve a ocultar al subir), con un fundido de 0,3 s solo si las animaciones están encendidas. Como en escritorio, donde la marca del menú lateral aparece cuando el wordmark grande ya no está.
- **Verificado** (390×844, panel a la vista): `position: fixed` y la misma posición en cualquier desplazamiento; el logo oculto en 0 y 200 px y visible a 1200 y 1500 px; la fila se oculta con el menú abierto y vuelve al cerrarlo; `check` 0 errores y `build` correcto. **No verificado:** el aspecto del logo sobre las secciones claras (no se pudo hacer captura en ese momento), 320–340 px de ancho, Safari de iPhone. Nota de prueba: con el panel oculto el `IntersectionObserver` no dispara; hay que mostrarlo para comprobarlo.
- **Terminal de Sobre mí (escritorio):** el cursor del título «/whoami» (`.ab-cursor`) y el de la terminal (`.cursor`, en `AboutSatellite.astro`) parpadeaban con animaciones distintas (retraso de 1 s y de 1,4 s, y arrancan cuando se enciende cada pieza), así que nunca coincidían y la terminal parecía seguir esperando. **Se quita el cursor de la terminal** (el resultado ya está escrito; el único cursor es el del título, que es lo que se «escribe») y se centran sus tres líneas en la ventana (y 62/84/106 → 71/93/115). Retirados también su animación `ab-sat-blink` y las reglas asociadas. Copia previa: `backups/AboutSatellite.astro.pre-terminal-cursor-2026-11-06.bak`. **No verificado** a simple vista el aspecto final de la terminal (la captura no llegó a mostrar la ilustración encendida a tiempo): conviene mirarlo en el punto de ancho en que lo viste.

## Móvil: logo en píldora con barrido, icono de destellos y aviso al pulsar (6 de noviembre de 2026, quinta parte)

- **Logo CHISU® (`.hx-top-mark`):** ahora es una **píldora de cristal oscuro** igual que ES | EN y animaciones (fondo `rgb(14 12 8 / 74%)`, borde dorado, desenfoque de 8 px, 2,1 rem de alto), con la ® dentro. Se **descubre de izquierda a derecha** con `clip-path` (0,6 s, como la entrada del wordmark grande) y un **destello** cruza la píldora una vez (`hx-mark-glint`, 0,9 s con 0,45 s de retraso); con las animaciones apagadas aparece sin transición. Cambio de umbral: sale solo cuando **todo el Hero ya está por encima de la pantalla** (`boundingClientRect.bottom <= 0`, margen 0; antes −70 px), para que no quede texto del Hero debajo. Se oculta de nuevo al subir.
- **Píldora de animaciones:** en la fila móvil lleva el **icono de destellos** (`Sparkles` de `lucide-astro`, 14 px) y el interruptor; el texto («Animaciones:» y sí/no/on/off) se oculta (queda en `aria-label`/`title`). En «apagado» el icono se atenúa y se tacha con una línea diagonal. Las otras copias del botón (escritorio, cajón) no cambian.
- **Aviso al pulsar:** al cambiar el interruptor se guarda `chiissuu:motion-toast` en `sessionStorage` y, tras la recarga, `#hx-motion-toast` muestra 2,6 s «Animaciones activadas/desactivadas» («Animations on/off»), bajo el botón de menú, solo hasta 899 px (en escritorio el botón ya lleva etiqueta y estado). Textos nuevos en `site.js` (`hero.motion.toastOn/toastOff`, ES y EN) y tipo en `content-types.ts`. Si `sessionStorage` está bloqueado no hay aviso y todo lo demás funciona.
- **Verificado** (390×844, panel a la vista): el logo oculto con el Hero visible y a 300 px de su final, visible con el Hero ya fuera (altura del Hero −60 px) con `clip-path: inset(0 round 999px)`; los tres controles y el menú se ven alineados en la captura; el botón de animaciones cambia el modo, el aviso se rellena con el texto correcto, aparece en pantalla y la marca se consume. `check` 0 errores y `build` correcto. **No verificado:** el movimiento del barrido y del destello (solo estados), el aspecto en 320–359 px (la marca se oculta), Safari de iPhone, lectores de pantalla. Copias: `backups/HeroExperience.astro.pre-topbar-v3-2026-11-06.bak`, `site.js.pre-motion-toast-…bak`, `content-types.ts.pre-motion-toast-…bak`.

## Certificado no confiable desde la red de la institución (6 de noviembre de 2026)

- **Síntoma:** desde la red de la institución de Jesús (y de un amigo en una red similar) Chrome muestra `ERR_CERT_AUTHORITY_INVALID` en `https://chiissuu.com`, con el aviso de que falta el certificado raíz de «Fortinet».
- **Causa (confirmada, no está en la web):** un cortafuegos FortiGate de esa red intercepta el HTTPS y vuelve a firmar con su propia autoridad; los equipos sin esa autoridad instalada ven el error. FortiGuard clasifica `chiissuu.com` como **«Newly Registered Domain»** (riesgo «Suspicious», grupo «Security Risk»), que muchas políticas bloquean o inspeccionan. El dominio se registró el **4 de noviembre de 2026 a las 11:20 UTC** (RDAP, registrador Cloudflare); la documentación de Fortinet da 10 días para esa categoría, así que debería dejar de aplicarse hacia el **14 de noviembre**. Después puede quedar como «Newly Observed Domain» o «Not Rated» durante un tiempo no documentado.
- **El sitio está bien:** SSL Labs da **A+** (6 nov, 12:43 UTC): certificado Let's Encrypt (EC 256, emitido el 4 de noviembre, caduca el 2 de febrero de 2027, renovación automática de Netlify), cadena completa sin problemas, confiable en Mozilla, Apple, Android, Java y Windows, TLS 1.3, HSTS de 1 año, transparencia de certificados. Prueba global con check-host.net: HTTP 200 desde 12 servidores en 10 países. DNS: servidores de Cloudflare, `A 75.2.60.5` (Netlify, sin proxy de Cloudflare) y `www` como CNAME a `chiissuu.netlify.app`.
- **Decisión:** no se cambia nada en el código ni en Cloudflare. No se instala el certificado de la institución en el equipo personal (solo valdría en esa red y permite leer el tráfico cifrado). Alternativas: datos móviles, o que el administrador de esa red permita el dominio. Volver a consultar fortiguard.com/webfilter y a probar desde esa red después del 14 de noviembre.
- **Opcional, no urgente:** registro DNS CAA en Cloudflare (`0 issue "letsencrypt.org"`; si se pone, debe permitir a Let's Encrypt o fallaría la renovación) y precarga de HSTS (`includeSubDomains; preload`; difícil de deshacer, mejor más adelante).

## Móvil: nav superior con huecos iguales (6 de noviembre de 2026, sexta parte)

- **Problema:** con el Hero a la vista, los dos controles quedaban pegados al botón de menú y dejaban un hueco grande a la izquierda; al aparecer el logo, quedaba otro hueco entre el logo y ES | EN.
- **Solución:** `.hx-topbar` ocupa desde el margen izquierdo (1,25 rem) hasta el borde derecho del botón de menú (un marcador de 48 px, `.hx-top-end`, ocupa su sitio) y entre los elementos van **espaciadores** (`.hx-top-sp`, `flex: 1 1 0`) que reparten el espacio libre a partes iguales; `.hx-top-tools` pasa a `display: contents` para que sus dos controles sean elementos de la fila. Con el Hero a la vista, el logo mide 0 y su espaciador (`--a`) también, así que los tres elementos que hay (ES | EN, destellos, menú) se reparten por todo el ancho; al salir del Hero el logo crece de 0 a 5,9 rem (se descubre de izquierda a derecha, ahora con `width` en lugar de `clip-path`; el aro es una sombra interior, no un borde, para que a ancho 0 no quede nada) y su espaciador pasa de 0 a 1 (`flex-grow`, 0,6 s), de modo que los demás se deslizan en vez de saltar. Por debajo de 360 px el logo y su espaciador no se dibujan.
- **Medido** (huecos entre elementos, en px): 390 px → Hero 84/84, con logo 25/24/24; 360 px → Hero 69/68, con logo 15/14/14; sin desbordamiento horizontal. Al volver arriba se recupera el reparto del Hero. **No verificado:** el movimiento de la transición (solo estados), 320–340 px, Safari de iPhone. Copia previa: `backups/HeroExperience.astro.pre-topbar-even-2026-11-06.bak`.

## Móvil: resumen de «Sobre mí» en el Hero, bloque central, botón de menú metálico y bordes iluminados (6 de noviembre de 2026, séptima parte)

- **Frase en el Hero (solo móvil):** hasta 640 px, `.hx-personal-note` muestra una frase corta sobre cómo trabaja Jesús (redactada con la skill `redaccion-personal`) en lugar de «Fuera del código…». Campo nuevo `hero.personalNoteShort` (ES y EN) en `site.js` y `content-types.ts`; el `<p>` lleva los dos textos (`.hx-pn-full`, `.hx-pn-short`) y el CSS elige uno, así que **escritorio y tabletas siguen con el texto de siempre**. Texto actual (ES): «Desarrollo proyectos visuales y funcionales: uno la ingeniería de software con el diseño gráfico para darles más personalidad y una experiencia cuidada.» (EN: «I develop visual, functional projects: I combine software engineering with graphic design to give them more personality and a thoughtfully designed experience.»). Sale de la conclusión de «Sobre mí» (más personalidad, experiencia cuidada). Una primera versión resumía todo «Sobre mí» (estudios, stack, idiomas, influencias) y se descartó por repetir lo que ya cuenta esa sección y por alargar el bloque (7 líneas en inglés a 360 px).
- **Bloque central:** título, botones y resumen van centrados y ahora **fluyen desde abajo** (`.hx-foreground` pasa a columna flex con `order` título → botones → resumen) en vez de estar anclados con `bottom` fijo: un resumen más largo, o una pantalla estrecha que lo parta en más líneas, empuja el resto hacia arriba. Las tarjetas de cifras y la de rasgos siguen colocadas de forma absoluta. Degradado oscuro inferior al 66 % de alto.
- **Botón de menú:** 50 px (antes 48), borde de 3 px con el degradado del borde de los botones del menú lateral, cara dorada con brillo suave arriba a la izquierda y veteado circular, borde inferior extruido en dos capas de bronce y barras de 3 px grabadas (la animación a «X» usa 8 px). `.hx-top-end`, la fila superior y el aviso se ajustaron al nuevo tamaño.
- **Bordes iluminados:** las tarjetas de cifras y la de rasgos (`.hx-frosted-card`, solo ≤ 640 px) llevan el mismo aro de 2 px con degradado de oro metálico que las tarjetas de «Sobre mí» (máscara compuesta) y un resplandor suave alrededor; el borde fino antiguo pasa a transparente.
- **Medido** (360×640 en inglés, el caso más ajustado): con la primera versión larga del resumen **el título pisaba 14 px la segunda tarjeta**; con la frase actual hay **42 px de margen** entre las tarjetas y el título, sin desbordamiento horizontal, y a 390×844 y a 667 de alto también cabe. **Pendiente de decisión del usuario:** quitar o no los botones «Ver proyectos / Sobre mí» en móvil (recuperaría ~62 px). Copias: `backups/HeroExperience.astro.pre-hero-round2-2026-11-06.bak`, `site.js.pre-note-short-…bak`, `content-types.ts.pre-note-short-…bak`.

## Móvil: se quitan los botones «Ver proyectos / Sobre mí» del Hero (6 de noviembre de 2026, octava parte)

- **Decisión del usuario** tras la opinión: en móvil (hasta 640 px) el Hero no dibuja `.hx-actions` (`display: none`). Motivos: el botón de menú está siempre a la vista, el gesto natural en móvil es desplazarse, y los dos botones ocupaban ~62 px en una pantalla cargada. **Siguen en tabletas (641–899 px) y escritorio.** El marcado y la línea de entrada no cambian (la animación de entrada sigue escribiendo sobre un elemento oculto, sin efecto).
- **Resultado medido** (390×844): tarjetas de cifras y rasgos arriba, título centrado y la frase corta debajo, que acaba a 14 px del borde inferior; entre la tarjeta de rasgos y el título quedan ~160 px de aire. A 360×640 en inglés el margen entre las tarjetas y el título pasa de 42 px a ~100 px. `check` 0 errores y `build` correcto. **No verificado:** móvil real y Safari de iPhone. Si se quiere volver a ponerlos solo en móvil, basta quitar el `display: none` de `.hx-actions` en el bloque de 640 px.

## Móvil: los rasgos pasan a una fila de píldoras y la pila sube (6 de noviembre de 2026, novena parte)

- **Qué se vio:** la tarjeta de rasgos (Creative, Strategist, Efficient, Builder, Team-first) solo aparecía con 800 px de alto o más (a zoom 100 % en el panel del usuario no salía; a 75 % sí). Gustaba, pero como tarjeta a la izquierda dejaba un hueco a su lado y ocupaba ~160 px.
- **Solución:** hasta 640 px los rasgos son una **fila centrada de píldoras** (`.hx-chip` con aro dorado, `border-radius: 999px`), la **primera pieza de la pila inferior** sobre el título (`.hx-aside-right` pasa a `position: static; order: 0`, `.hx-chip-card` a fila con `flex-wrap` sin fondo ni aro). Ocupa ~64 px en dos filas y **ya no se oculta a ninguna altura**. El lema (`.hx-tagline`) sigue sin dibujarse en móvil.
- **Pila más arriba:** la separación inferior de `.hx-foreground` sube de 0,9 a 2,25 rem (1,4 rem con 680 px de alto o menos) para que la frase no quede pegada al borde ni bajo las barras del navegador; el degradado oscuro inferior sube al 74 % de alto.
- **Medido:** 390×844 → píldoras a 195 px de las tarjetas de cifras y 16 px sobre el título; 360×640 en inglés (el caso más ajustado) → 21 px de margen con las tarjetas, 16 px hasta el título, sin desbordamiento horizontal. Nota de prueba: la superposición oscura con iconos «A ✦ ≡ ⚙» que se ve abajo en las capturas del panel **no es de la web** (no hay ningún elemento fijo abajo; lo comprobé por script): es del propio panel.
- **No verificado:** móvil real y Safari de iPhone. Copia previa: `backups/HeroExperience.astro.pre-hero-pills-2026-11-06.bak`.

## Móvil: ajuste de las píldoras en 320 px y recuadro fantasma (6 de noviembre de 2026, décima parte)

- **Dos fallos vistos por el usuario:** (1) a 390 px se veía un recuadro tenue detrás de las píldoras: la tarjeta de rasgos seguía heredando la **sombra y el radio** de `.hx-frosted-card` (esa regla, más abajo en el mismo bloque, ganaba a la de `.hx-chip-card`); (2) a **320×640** las píldoras ocupaban tres filas y pisaban la tarjeta «20+».
- **Arreglo:** `.hx-chip-card.hx-frosted-card` (mayor especificidad) sin sombra ni radio; y un bloque `@media (max-width: 359px)` con píldoras más pequeñas (0,64 rem, relleno 0,28 × 0,55 rem), título a 1,6 rem, tarjetas de cifras algo más compactas (cifra 1,35 rem, etiqueta 0,68 rem) y frase a 0,76 rem.
- **Medido a 320×640:** dos filas de píldoras, 55 px de margen con las tarjetas de cifras y 16 px hasta el título, sin desbordamiento horizontal; la sombra de la tarjeta de rasgos es `none`. Comprobado también a 360×640 en inglés. `check` 0 errores y `build` correcto. **No verificado:** móvil real y Safari de iPhone. Copia previa: `backups/HeroExperience.astro.pre-narrow-2026-11-06.bak`.

## Móvil: hueco de 320×640 y pendiente de tableta (6 de noviembre de 2026, undécima parte)

- **Hueco a 320×640:** con todo más compacto sobraba espacio entre las tarjetas de cifras y las píldoras (55 px). Bloque nuevo `@media (max-width: 359px) and (max-height: 680px)` con la separación inferior de la pila en 3 rem (la pila sube): el hueco baja a **30 px**, 16 px hasta el título y 48 px de aire bajo la frase. Las demás medidas no cambian (360×640 en inglés: 21 px). `check` 0 errores y `build` correcto.
- **Pendiente tras cerrar móvil — tableta (641–899 px):** el usuario vio el Hero en ese rango y está sin tratar: la nota «Fuera del código…» queda en flujo normal **arriba, sobre el wordmark**; el título (tinta oscura) cae sobre el retrato; los botones y el lema quedan tapados por la figura y el lema; no hay fila superior con ES | EN ni animaciones (solo en el cajón). Es la composición de escritorio comprimida, no una pensada para tableta. Registrado en [[Hallazgos-y-Pendientes]]. **No se toca hasta que el usuario cierre la versión móvil.**

## Móvil: nav superior alineado y con el borde iluminado (6 de noviembre de 2026, duodécima parte)

- **Alineación:** la fila superior ocupa de 20 a 60 px (40 px de alto, centrada en y = 40). Las píldoras ES | EN y animaciones, que medían 33,6 px, pasan a **40 px** (`height: 2.5rem`), y el logo también. El botón de menú pasa de 50 a **36 px de cara** (con el borde de bronce de 4 px de debajo suma 40 px, igual que las píldoras): empieza en y = 20 como ellas y termina en 60. Las barras son de 15 × 2,5 px con 3,5 px de hueco (la «X» usa 6 px). `.hx-top-end` (36 × 40 px) y el aviso (`top: calc(20px + 40px + 0.8rem)`) se ajustaron.
- **Bordes:** las tres píldoras (ES | EN, animaciones y el logo cuando aparece) llevan el mismo **aro de 2 px con degradado de oro metálico y resplandor suave** que las tarjetas «3+» y «20+» (máscara compuesta); el borde fino pasa a transparente. En el logo el aro va por dentro (`inset: 0`) para que el recorte de su `overflow: hidden` no lo corte.
- **Medido** (390×844): píldoras 20–60 px, llave 20–56 px más 4 px de borde = 60; con el Hero visible y con el logo, los tres elementos comparten fila; abrir el menú deja las barras como «X» centrada; sin desbordamiento horizontal. `check` 0 errores y `build` correcto. **No verificado:** móvil real, Safari de iPhone y la zona táctil de la llave (36 px de cara, más pequeña que los 44 px recomendados; las píldoras ahora miden 40). Copia previa: `backups/HeroExperience.astro.pre-align-nav-2026-11-06.bak`.

## Cómo mantener este vault al día

Actualizar junto al cambio de código: rutas, contratos, límites, estados, fuentes y hallazgos afectados. Volver a medir antes de copiar resultados de build o tamaños de archivo — no asumir que siguen igual. El contenido de [[Contenido-por-Seccion]] es una instantánea de `site.js`: al editar ese archivo, hay que regenerar o actualizar la nota — nunca debe convertirse en una segunda fuente de la aplicación. No dejar un hallazgo marcado como abierto en [[Hallazgos-y-Pendientes]] cuando el código y una prueba pertinente ya confirmen que está resuelto.

## Relacionado

[[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] · [[Hallazgos-y-Pendientes]] · [[Hero-y-Sidebar]] · [[Conversor-de-Video]]
