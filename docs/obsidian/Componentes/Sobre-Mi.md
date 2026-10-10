---
tags: [componente, about, layout]
actualizado: 2026-10-10
fuente: [src/components/AboutSection.astro, src/content/site.js]
---

# Sobre mí: estructura y excepciones

Fuente: [AboutSection.astro](../../../src/components/AboutSection.astro). Texto y traducción en [site.js](../../../src/content/site.js); resumen editorial en [[Contenido-por-Seccion]].

## Estructura actual

La sección tiene dos bloques: portada con un único h2 «SOBRE MÍ» y siete párrafos, y «MI STACK DE TRABAJO». «Mi base actual» se retiró porque duplicaba formación e idiomas ya incluidos en la biografía; se eliminaron también sus datos ES/EN, tipos y CSS sin consumidores. Las cuatro escenas narrativas anteriores y sus gráficos siguen retirados. No recuperar el título «Ingeniería, datos e identidad» ni la línea separada de ubicación e idiomas.

Los siete párrafos se conservan literalmente en ES/EN: nombre/carrera/U-TAD/Madrid, base técnica, idiomas, diferencia al conectar tecnología/diseño/negocio/finanzas, esports, moda/música/redes y cierre. Esta ronda cambia la presentación y el stack, no la biografía. No se añaden fotografías provisionales o imágenes genéricas; queda como propuesta futura una imagen personal o de trabajo entre los dos grupos si aporta contenido real.

## Datos y tipografía

La portada consume `aboutMe.title` y recorre todos los elementos de `aboutMe.paragraphs` en su orden original. Actualmente hay siete párrafos en ES y EN, con los saltos definidos explícitamente en el contenido. `introParagraphCount = 3` agrupa los tres primeros bajo «Quién soy» y los restantes bajo «Qué me diferencia de la competencia», ambos h3 con IDs ab-intro-heading y ab-difference-heading. Los rótulos vienen de `aboutMe.groupLabels`, también traducidos en EN. Los grupos vacíos se omiten; un array vacío deja el h2 sin biografía. El contrato correspondiente es `AboutMeCopy` en [[Archivos-del-Proyecto]].

`aboutMe.closingPhrase` selecciona la última frase exacta para mostrarla en una línea destacada dentro del párrafo, conservando todas las palabras y la puntuación. Si no coincide con el texto, no se dibuja el tratamiento especial. No se duplica la frase ni se crea otra tarjeta.

`aboutMe.accents` define frases exactas por idioma: `strong` (nombre, carrera, Big Data, base técnica, diseño gráfico, equipo, versión propia y varias capas), `emojis` (pares frase/símbolo), `location` (Madrid/España), `flags` (frase y código de país) y `links` (frase y URL). Se eliminan circle/underline del contenido y los tipos, además de sus ramas de render, CSS y animación. `decorateParagraph` divide el texto alrededor de las coincidencias y Astro escapa cada fragmento, sin inyectar HTML. Una cadena vacía se ignora; una frase ausente no genera decoración. Se consume la coincidencia más temprana y, si coinciden al principio, la más larga. Los enlaces procesan sus propias negritas con un subconjunto de reglas; así no se crean enlaces anidados. Los párrafos siguen siendo la única fuente del texto; al editar una frase destacada, actualizar su selector exacto.

La frase de carrera/mención enlaza a `https://u-tad.com/grados/ingenieria-software`; «Centro Universitario de Tecnología y Arte Digital» enlaza al mapa proporcionado por el usuario, `https://maps.app.goo.gl/Ppb4QnavdNihgWui9`. Ambos abren en otra pestaña con `noopener noreferrer`, subrayado visible y foco de teclado. Big Data ya no lleva círculo.

Título centrado: `clamp(3rem, 7vw, 5.5rem)`, display, peso 700. Biografía centrada como columna, pero con párrafos alineados a la izquierda: Inter, ancho máximo 62ch, `clamp(1.05rem, 1.25vw, 1.25rem)`, interlineado 1.85 y separación entre párrafos de 2–2.75rem. Lead: `clamp(1.15rem, 1.5vw, 1.5rem)`, interlineado 1.8. Los grupos tienen 4–6rem de margen, 2–3rem de padding y un separador discreto. Los h3 ahora usan display de 1.25–1.6rem, sentence case. Cierre: display de 1.4–2rem, máximo 32ch, separador y pausa propios. Cuerpo gris #d0d0d0; énfasis blanco #f2f2f2. Se mantienen familias existentes, emojis, banderas, links y negritas.

Se conservan negritas, enlaces y emojis; no hay círculos ni subrayados dibujados. Los subrayados CSS propios de los enlaces permanecen como señal de interacción. 👋 abre el primer párrafo y 💻 el segundo; 📚 acompaña U-TAD, 🎮 esports, 👟 moda, 🎧 música y 📱 redes sociales. Emojis y banderas llevan `aria-hidden`; las imágenes además tienen alt vacío. Los iconos con su palabra no se parten entre líneas; las negritas y enlaces largos sí permiten saltos en móvil. Versión propia y varias capas son strong normales, sin cajas que puedan aislar la puntuación.

Madrid/España usa negrita y letras con franjas rojo claro/amarillo/rojo claro mediante `background-clip: text`, con texto blanco como fallback fuera de `@supports`. Banderas pequeñas de España, Reino Unido y Alemania en `public/assets/icons/flags/{es,gb,de}.svg`, de 1.15em × 0.77em; las URLs incorporan BASE_URL. Son SVG locales simplificados para que su representación no dependa de los emojis de Windows. Los códigos de `flags.country` deben corresponder a esos archivos.

Se reutiliza `.rd-reveal` del layout por título, grupo de lectura y categoría de stack, para evitar que el threshold se calcule sobre una biografía completa demasiado alta. No se añade observador, listener de scroll, librería ni fuente remota.

## Layout y alineación

Desde 1200px, `.ab-inner` ocupa el espacio entre el borde visible de las tarjetas del sidebar y el borde derecho de la página, con 2rem de padding simétrico. Ese borde se calcula como `--hx-sidebar-width - --hx-sidebar-padding-inline`; el ancho del sidebar incluye padding transparente. `.ab-body` se centra, limitado a `--container - 4rem`. Esto equilibra las distancias nav–texto y texto–borde derecho. Móvil y tablet conservan sus reglas de espaciado. No existe un rail adicional de lectura.

## Fondo y continuidad con el Hero

Tema dark con fondo carbón: comienza en `--section-dark-start` (#050505), pasa a #191919 durante `--ab-blend-height: clamp(10rem, 20svh, 14rem)`, después a #121212 en 1400px y a #0d0d0d al final. Reutiliza la textura del Hero en un pseudo-elemento de hasta 1400px, con grayscale(1), brightness(0.65), opacidad 0.55 y máscara que introduce y desvanece la textura. La URL incorpora BASE_URL; no se crea otro asset. Paleta: texto #f2f2f2, texto secundario #bdbdbd, acento #c9c9c9 y superficies blancas con opacidad.

La sección no crea un contexto aislado de capas: textura con z-index 0, Hero fijado con 2 y `.ab-inner` con 3. El texto sube por encima del fondo del Hero mientras este se desvanece. No añadir isolation o transform al contenedor exterior sin comprobar este orden con [[Hero-y-Sidebar]]. La navegación principal mantiene su geometría y activa la paleta mono cuando About es la sección activa.

## Stack y responsive

Siete categorías y 42 herramientas, presentadas como filas sin tarjetas bento ni pills. Cada categoría es una section con h4 y una lista de logos/nombres, separados por líneas suaves. Desde 900px el título va a la izquierda y la lista a la derecha. Por debajo se apilan; a ≤640px la lista utiliza tres columnas. Los logos tienen soporte claro para conservar contraste, nombres visibles y alt vacío porque son decorativos; no son controles ni enlaces. Usan loading lazy y decoding async.

TypeScript va en Software por ser un lenguaje; React va en Web por ser una biblioteca de interfaces. HTML/CSS se retiraron del listado visible a petición del usuario. Bases de datos incorpora Qdrant, Redis y Neo4j. Diseño incorpora After Effects e Illustrator. Documentación y colaboración reúne Obsidian, Google Drive, Word, Excel, PowerPoint y Teams. Estos datos describen herramientas personales, no dependencias del runtime de la web.

Los 16 logos nuevos son PNG locales de 96×96; también se cubren Astro, GSAP y n8n que antes no tenían icono. Procedencia y licencias: [[Logos-Stack]]. No se añadió ninguna dependencia npm. Se comprobó la presentación en 320, 390, 768 y 1440px, sin overflow horizontal ni recursos ausentes. Se conservan la geometría del sidebar y la transición Hero/About.

## Relacionado

[[Contenido-por-Seccion]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] · [[Hero-y-Sidebar]]
