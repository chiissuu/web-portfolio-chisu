---
tags: [componente, about, layout]
actualizado: 2026-10-23
fuente: [src/components/AboutSection.astro, src/content/site.js]
---

# Sobre mí: estructura y excepciones

Fuente: [AboutSection.astro](../../../src/components/AboutSection.astro). Texto y traducción en [site.js](../../../src/content/site.js); resumen editorial en [[Contenido-por-Seccion]].

## Estructura actual

La sección tiene dos bloques: portada con un único h2 «SOBRE MÍ» y siete párrafos, y «MI STACK DE TRABAJO». «Mi base actual» se retiró porque duplicaba formación e idiomas ya incluidos en la biografía; se eliminaron también sus datos ES/EN, tipos y CSS sin consumidores. Las cuatro escenas narrativas anteriores y sus gráficos siguen retirados. No recuperar el título «Ingeniería, datos e identidad» ni la línea separada de ubicación e idiomas.

Los siete párrafos se conservan literalmente en ES/EN: nombre/carrera/U-TAD/Madrid, base técnica, idiomas, diferencia al conectar tecnología/diseño/negocio/finanzas, esports, moda/música/redes y cierre. Esta ronda cambia la presentación y el stack, no la biografía. No se añaden fotografías provisionales o imágenes genéricas; queda como propuesta futura una imagen personal o de trabajo entre los dos grupos si aporta contenido real.

## Datos y tipografía

La portada consume `aboutMe.title` y el PNG opcional `aboutMe.titleImage`, y recorre todos los elementos de `aboutMe.paragraphs` en su orden original. Actualmente hay siete párrafos en ES y EN, con los saltos definidos explícitamente en el contenido. `introParagraphCount = 3` agrupa los tres primeros bajo «Quién soy» y los restantes bajo «Qué me diferencia de la competencia», ambos h3 con IDs ab-intro-heading y ab-difference-heading. Los rótulos vienen de `aboutMe.groupLabels`, también traducidos en EN. Los grupos vacíos se omiten; un array vacío deja el h2 sin biografía. El contrato correspondiente es `AboutMeCopy` en [[Archivos-del-Proyecto]].

El título visible se renderiza con `public/assets/images/about-title-es.png`, copia original de «SOBRE MÍ» proporcionada por el usuario. `about-title-en.png` conserva «ABOUT ME», también referenciado en `content.en`; aún no hay ruta inglesa. Ambos son PNG transparentes de 2446×1400. `titleImage` almacena src, dimensiones y crop (x/y/ancho/alto del contenido visible). Un marco con aspect-ratio y overflow hidden oculta solo los márgenes transparentes mediante CSS; los archivos no se recortan ni recolorean. Se muestra el dorado original del PNG, sin filtro de desaturación; se conservan metal cepillado y relieve. Las URLs incorporan BASE_URL. Se conserva el h2 con `aboutMe.title` como texto accesible oculto; la imagen es decorativa, con alt vacío y aria-hidden en su marco. Si falta `titleImage`, se muestra el título tipográfico anterior.

`aboutMe.closingPhrase` selecciona la última frase exacta para mostrarla en una línea destacada dentro del párrafo, conservando todas las palabras y la puntuación. Si no coincide con el texto, no se dibuja el tratamiento especial. No se duplica la frase ni se crea otra tarjeta.

`aboutMe.accents` define frases exactas por idioma: `strong` (nombre, carrera, Big Data, base técnica, diseño gráfico, equipo, versión propia y varias capas), `emojis` (pares frase/símbolo), `location` (Madrid/España), `flags` (frase y código de país) y `links` (frase y URL). Se eliminan circle/underline del contenido y los tipos, además de sus ramas de render, CSS y animación. `decorateParagraph` divide el texto alrededor de las coincidencias y Astro escapa cada fragmento, sin inyectar HTML. Una cadena vacía se ignora; una frase ausente no genera decoración. Se consume la coincidencia más temprana y, si coinciden al principio, la más larga. Los enlaces procesan sus propias negritas con un subconjunto de reglas; así no se crean enlaces anidados. Los párrafos siguen siendo la única fuente del texto; al editar una frase destacada, actualizar su selector exacto.

La frase de carrera/mención enlaza a `https://u-tad.com/grados/ingenieria-software`; «Centro Universitario de Tecnología y Arte Digital» enlaza al mapa proporcionado por el usuario, `https://maps.app.goo.gl/Ppb4QnavdNihgWui9`. Ambos abren en otra pestaña con `noopener noreferrer`, subrayado visible y foco de teclado. Big Data ya no lleva círculo.

Título gráfico alineado con el inicio del primer párrafo: ancho `min(100%, 40rem)` y proporción del contenido visible del PNG, sin deformación ni margen vacío. El fallback conserva `clamp(3rem, 7vw, 5.5rem)`, display, peso 700. Se conservan el markup, el recorte y la escala del título; su posición horizontal se ajusta para compartir alineación con la prosa. Tras la auditoría del 2026-10-23, el usuario autorizó recuperar el dorado original retirando solo su filtro.

La biografía usa Inter 400/600 en ambos grupos. `.ab-cover-prose` mide hasta 66rem y cada `.ab-prose-copy` hasta 58ch; el cuerpo va de 1.05 a 1.2rem con interlineado 1.8. El primer párrafo va de 1.2 a 1.5rem con interlineado 1.7; los idiomas usan 0.95em y color secundario. Los párrafos se separan 1.75–2.25rem; los grupos conservan su pausa de 4–6rem más padding y separador. Los h3 usan Space Grotesk 500 de 1.15–1.4rem. El cierre usa Space Grotesk 600 de 1.35–1.8rem, máximo 34ch y una línea dorada lateral. Paleta: cuerpo #d4d6d8, énfasis #f3f4f5, secundario #adb2b6 y acento compartido `var(--color-brand-gold)` (#e0c58b). Los dos h3 de la biografía y el encabezado del stack usan ese acento; las categorías y los párrafos siguen neutros. No se crean tarjetas ni rótulos nuevos.

La prueba de Milesdane se retiró del render durante la auditoría: mezclaba una fuente ornamental con la lectura y mostraba una marca Trial en «2». `public/assets/fonts/Milesdane-Trial.otf` (77.304 bytes) y el [aviso original](../../../public/assets/fonts/Milesdane-ReadMe.txt) se conservan archivados, sin `@font-face` ni petición de carga. La licencia indica uso personal, sin uso comercial ni audiencias amplias. No se ha alterado el archivo de fuente.

Se conservan negritas y enlaces con un subrayado fino visible y foco de 2px. Se retiraron los emojis de apertura; los asociados a U-TAD, esports, moda, música y redes siguen en escala menor y desaturados. Emojis y banderas llevan `aria-hidden`; las imágenes además tienen alt vacío. Se permiten saltos en las palabras con iconos y en Madrid para admitir pantallas estrechas y texto ampliado. Versión propia y varias capas siguen como strong normales, sin cajas que aíslen la puntuación.

Madrid/España usa negrita sólida, sin degradado ni texto transparente; así mantiene la lectura neutra y admite los colores forzados del sistema. Se conserva la bandera de España. Banderas de España, Reino Unido y Alemania en `public/assets/icons/flags/{es,gb,de}.svg`, de 1.15em × 0.77em; las URLs incorporan BASE_URL. Los códigos de `flags.country` deben corresponder a esos archivos.

Biografía y stack no llevan `.rd-reveal`: son legibles inmediatamente, sin esperar al observador global ni depender de JavaScript. El título protegido conserva su reveal anterior y su dependencia de ese observador. No se añade movimiento, observador, listener, librería ni fuente remota.

## Layout y alineación

Desde 1200px, `.ab-inner` ocupa el espacio entre el borde visible de las tarjetas del sidebar y el borde derecho de la página, con 2rem de padding simétrico. Ese borde se calcula como `--hx-sidebar-width - --hx-sidebar-padding-inline`; el ancho del sidebar incluye padding transparente. `.ab-body` se centra, limitado a `--container - 4rem`. Esta geometría permanece intacta. Dentro, el header y los grupos comparten exactamente dos columnas y el mismo gap de 2–4rem: h3 a la izquierda (hasta 14ch) y `.ab-prose-copy` a la derecha. El PNG ocupa la segunda columna y el contenedor de grupos abarca ambas; el cartel empieza en la misma coordenada horizontal que el primer párrafo. A menor ancho se apilan en una sola columna alineada a la izquierda. El primer grupo incorpora un borde superior fino, igual al separador entre grupos, para distinguir la cabecera de «Quién soy». El gap del cover (24–32px) y el padding del primer grupo (24–40px) se compensan para mantener la pausa de lectura. No hay rail, sticky, mediciones JavaScript ni copia duplicada.

## Fondo y continuidad con el Hero

Tema dark con grafito cálido uniforme #24221f: comienza en `--section-dark-start` (#050505) para conservar la unión con el Hero y alcanza el grafito durante `--ab-blend-height: clamp(10rem, 20svh, 14rem)`. Mantiene ese tono hasta el final del stack, sin oscurecer progresivamente a negro. Un grano CSS horizontal de opacidad 0.8% recorre la sección. Reutiliza además la textura del Hero en un pseudo-elemento de hasta 1400px, con grayscale(1), brightness(0.65), opacidad 0.12 y la máscara anterior que introduce y desvanece la textura. La URL incorpora BASE_URL; no se crea otro asset.

Un `::before` decorativo de `.ab-title` dibuja un halo radial dorado estático de 15% en el centro, 6% en el tramo intermedio y transparente en el exterior. Su ancho se limita al título (`inset: -55% 0 -70%`) para evitar overflow en móvil; la expansión es solo vertical. Tiene `pointer-events: none`, z-index -1 y no afecta a la geometría, el recorte o el reveal del PNG. Paleta de lectura sin cambios: texto #f3f4f5, secundario #adb2b6, cuerpo #d4d6d8, acento dorado #e0c58b y superficies blancas con opacidad.

La sección no crea un contexto aislado de capas: textura con z-index 0, Hero fijado con 2 y `.ab-inner` con 3. El texto sube por encima del fondo del Hero mientras este se desvanece. No añadir isolation o transform al contenedor exterior sin comprobar este orden con [[Hero-y-Sidebar]]. La navegación principal mantiene su geometría, metal y pulsación dorados en About, como en el Hero. Ya no activa la paleta mono ni desatura su logo; solo cambia qué enlace está seleccionado.

## Stack y responsive

Siete categorías y 42 herramientas, presentadas como filas sin tarjetas bento ni pills. Cada categoría es una section con h4 y una lista de logos/nombres, separados por líneas suaves. Desde 900px el título va a la izquierda y la lista a la derecha. Por debajo se apilan; las listas flexibles permiten saltos y a ≤640px utilizan dos columnas. Los logos tienen soporte claro para conservar contraste, nombres visibles y alt vacío porque son decorativos; no son controles ni enlaces. Usan loading lazy y decoding async.

El stack sigue secundario: encabezado alineado a la izquierda de 1.05–1.3rem, categorías de 0.95rem y nombres de 0.85rem. Los soportes de los logos miden 1.75rem (28px), con nombre a su derecha y gap de 0.5rem. Cada fila tiene 0.9rem de padding vertical; el encabezado conserva 1.25–1.75rem de separación. En la comprobación a 1280px el bloque completo mide aproximadamente 467px. Se mantienen todas las herramientas y las reglas de navegación y transición del Hero.

TypeScript va en Software por ser un lenguaje; React va en Web por ser una biblioteca de interfaces. HTML/CSS se retiraron del listado visible a petición del usuario. Bases de datos incorpora Qdrant, Redis y Neo4j. Diseño incorpora After Effects e Illustrator. Documentación y colaboración reúne Obsidian, Google Drive, Word, Excel, PowerPoint y Teams. Estos datos describen herramientas personales, no dependencias del runtime de la web.

Los 16 logos nuevos son PNG locales de 96×96; también se cubren Astro, GSAP y n8n que antes no tenían icono. Procedencia y licencias: [[Logos-Stack]]. No se añadió ninguna dependencia npm. Se comprobó la presentación en 320, 390, 768 y 1440px, sin overflow horizontal ni recursos ausentes. Se conservan la geometría del sidebar y la transición Hero/About.

## Relacionado

[[Auditoria-Sobre-Mi]] · [[Contenido-por-Seccion]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] · [[Hero-y-Sidebar]]
