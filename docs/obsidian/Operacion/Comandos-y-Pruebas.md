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

## Cómo mantener este vault al día

Actualizar junto al cambio de código: rutas, contratos, límites, estados, fuentes y hallazgos afectados. Volver a medir antes de copiar resultados de build o tamaños de archivo — no asumir que siguen igual. El contenido de [[Contenido-por-Seccion]] es una instantánea de `site.js`: al editar ese archivo, hay que regenerar o actualizar la nota — nunca debe convertirse en una segunda fuente de la aplicación. No dejar un hallazgo marcado como abierto en [[Hallazgos-y-Pendientes]] cuando el código y una prueba pertinente ya confirmen que está resuelto.

## Relacionado

[[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] · [[Hallazgos-y-Pendientes]] · [[Hero-y-Sidebar]] · [[Conversor-de-Video]]
