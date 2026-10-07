---
tags: [componente, about, layout]
actualizado: 2026-10-08
fuente: [src/components/AboutSection.astro, src/content/site.js]
---

# Sobre mí: estructura y excepciones

Fuente: [AboutSection.astro](../../../src/components/AboutSection.astro). Texto y traducción en [site.js](../../../src/content/site.js); resumen editorial en [[Contenido-por-Seccion]].

## Estructura actual

La sección tiene tres bloques: portada con un único h2 «SOBRE MÍ» y ocho párrafos, «MI BASE ACTUAL» (formación e idiomas) y «MI SISTEMA DE TRABAJO» (skills). Las cuatro escenas narrativas y sus gráficos se sustituyeron por el resumen inicial a petición del usuario. Ya no existen sus anclas, campos de contenido, estilos, iconos ni funciones de división/énfasis de texto. No recuperar el título «Ingeniería, datos e identidad» ni la línea separada de ubicación e idiomas.

La presentación inicial se divide después de cada punto en tres párrafos: nombre/carrera/U-TAD/Madrid, tres años de formación y base técnica, e idiomas. La frase de idiomas es «Domino totalmente el español, tengo un nivel C1 de inglés y un A2 de alemán». Siguen cinco párrafos: diferencia frente a la competencia al conectar tecnología/diseño/negocio/finanzas; frase original de esports; facilidad con moda/música/redes sociales; síntesis de varias capas que aportan profundidad e identidad a los proyectos; y dirección hacia Data Science y machine learning.

## Datos y tipografía

La portada consume `aboutMe.title` y recorre todos los elementos de `aboutMe.paragraphs` en su orden original. Actualmente hay ocho párrafos en ES y EN, con los saltos definidos explícitamente en el contenido, sin dividir cada punto mediante una expresión regular. Añadir otro al array sí lo muestra; un array vacío deja el título sin biografía. El contrato correspondiente es `AboutMeCopy` en [[Archivos-del-Proyecto]].

`aboutMe.accents` define frases exactas por idioma: `strong` (nombre, carrera, Big Data, base técnica, equipo, criterio visual/negocio/cultura y Data Science/machine learning), `circle` (array: arquitectura de software y versión propia), `underline` (array: desarrollo full-stack, diseño gráfico y varias capas), `emojis` (pares frase/símbolo), `location` (Madrid/España), `flags` (frase y código de país) y `links` (frase y URL). `emojis` reemplaza los campos separados esports/study para reutilizar el mismo render en todas las palabras. `decorateParagraph` divide el texto alrededor de las coincidencias y Astro escapa cada fragmento, sin inyectar HTML. Una cadena vacía se ignora; una frase ausente no genera decoración. Se consume la coincidencia más temprana y, si coinciden al principio, la más larga. Los enlaces procesan sus propias negritas con un subconjunto de reglas; así no se crean enlaces anidados. Los párrafos siguen siendo la única fuente del texto; al editar una frase destacada, actualizar su selector exacto.

La frase de carrera/mención enlaza a `https://u-tad.com/grados/ingenieria-software`; «Centro Universitario de Tecnología y Arte Digital» enlaza al mapa proporcionado por el usuario, `https://maps.app.goo.gl/Ppb4QnavdNihgWui9`. Ambos abren en otra pestaña con `noopener noreferrer`, subrayado visible y foco de teclado. Big Data ya no lleva círculo.

Título: `clamp(3rem, 7vw, 5.5rem)`, fuente display, peso 700. Biografía: Inter (`--font-body`, ya cargada en el layout), `clamp(1.05rem, 1.4vw, 1.35rem)`, ancho máximo 60ch, interlineado 1.75, tracking -0.015em y separación entre párrafos de 1.25rem. El cuarto párrafo (índice 3), marcado `.ab-profile-start`, separa el perfil de los tres párrafos introductorios con 2.5rem; ya no se aplica ese margen al último párrafo. Si cambia el número de párrafos introductorios, actualizar ese índice. Cuerpo gris #d0d0d0; énfasis blanco #f2f2f2 con peso real 600 para las negritas. Todo el resumen se centra. Los encabezados de Mi base actual y Mi sistema de trabajo también se centran; el interior de sus tarjetas conserva su alineación de lectura.

Círculos y subrayados son SVG inline decorativos, plata #c9c9c9, con trazo de 1.6px independiente del escalado. Ajustan su ancho a la frase sin alterar el orden del texto. El selector de «versión propia,» incluye la coma para impedir que quede sola al inicio de otra línea en móvil. 👋 abre el primer párrafo y 💻 el segundo; 📚 acompaña U-TAD, 🎮 esports, 👟 moda, 🎧 música y 📱 redes sociales. Emojis, trazos y banderas llevan `aria-hidden`; las imágenes además tienen alt vacío. Las anotaciones e iconos con su palabra no se parten entre líneas, pero las negritas y enlaces largos sí permiten saltos en móvil.

Madrid/España usa negrita y letras con franjas rojo claro/amarillo/rojo claro mediante `background-clip: text`, con texto blanco como fallback fuera de `@supports`. Banderas pequeñas de España, Reino Unido y Alemania en `public/assets/icons/flags/{es,gb,de}.svg`, de 1.15em × 0.77em; las URLs incorporan BASE_URL. Son SVG locales simplificados para que su representación no dependa de los emojis de Windows. Los códigos de `flags.country` deben corresponder a esos archivos.

Los trazos se dibujan una vez al activarse `.ab-cover.rd-in`, aprovechando el reveal existente del layout. La animación CSS dura 0.7s, con retraso 0.3s para el círculo y 0.6s para el subrayado. Con `prefers-reduced-motion: reduce` se muestran completos sin animación. No se añade observador, listener de scroll, librería ni nueva fuente remota.

## Layout y alineación

Desde 1200px, `.ab-inner` ocupa el espacio entre el borde visible de las tarjetas del sidebar y el borde derecho de la página, con 2rem de padding simétrico. Ese borde se calcula como `--hx-sidebar-width - --hx-sidebar-padding-inline`; el ancho del sidebar incluye padding transparente. `.ab-body` se centra, limitado a `--container - 4rem`. Esto equilibra las distancias nav–texto y texto–borde derecho. Móvil y tablet conservan sus reglas de espaciado. No existe un rail adicional de lectura.

## Fondo y continuidad con el Hero

Tema dark con fondo carbón: comienza en `--section-dark-start` (#050505), pasa a #191919 durante `--ab-blend-height: clamp(10rem, 20svh, 14rem)`, después a #121212 en 1400px y a #0d0d0d al final. Reutiliza la textura del Hero en un pseudo-elemento de hasta 1400px, con grayscale(1), brightness(0.65), opacidad 0.55 y máscara que introduce y desvanece la textura. La URL incorpora BASE_URL; no se crea otro asset. Paleta: texto #f2f2f2, texto secundario #bdbdbd, acento #c9c9c9 y superficies blancas con opacidad.

La sección no crea un contexto aislado de capas: textura con z-index 0, Hero fijado con 2 y `.ab-inner` con 3. El texto sube por encima del fondo del Hero mientras este se desvanece. No añadir isolation o transform al contenedor exterior sin comprobar este orden con [[Hero-y-Sidebar]]. La navegación principal mantiene su geometría y activa la paleta mono cuando About es la sección activa.

## Responsive y tarjetas

Formación e idiomas pasan a dos columnas desde 900px. Por debajo de 900px los datos académicos se apilan y el bento usa dos columnas; a 640px o menos, una. Los iconos de skills son decorativos (14px), acompañados por su nombre: un icono null omite la imagen; un archivo inexistente produce una imagen rota, sin manejador de error.

## Relacionado

[[Contenido-por-Seccion]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] · [[Hero-y-Sidebar]]
