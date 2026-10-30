---
tags: [contenido, i18n]
actualizado: 2026-10-10
fuente: [src/content/site.js]
---

# Contenido completo por sección

Qué muestra cada sección y cómo se presenta. El texto exacto, literal y actualizado vive siempre en [site.js](../../../src/content/site.js) (objeto `content.es`) — esta nota lo explica en prosa para no tener que leer el archivo entero cada vez, pero **no es una copia que se mantenga sincronizada automáticamente**. Si se edita `site.js`, esta nota puede quedar desactualizada hasta que alguien la revise.

## Portada / Hero

Wordmark rasterizado, retrato provisional, un `h1` de tres líneas (Software Engineer / Data Science / GFX), dos métricas (`2+` años, `10+` proyectos), cinco rasgos (Creative, Strategist, Efficient, Builder, Team-first), una descripción personal y una nota sobre inversión/mercados/negocio. Las tres líneas del título se presentan **juntas**, no hay rotación automática ni carrusel.

Dos botones llevan a Proyectos y a Sobre mí. Las métricas son contenido editorial fijo — no son contadores que consulten GitHub en vivo. El sidebar reutiliza marca, métricas, tagline y enlaces sociales del mismo objeto de datos (ver [[Hero-y-Sidebar]]).

> [!note] Tres nombres de marca distintos, a propósito
> `displayWordmark` ("CHISU"), `siteName` ("CHIISSUU") y `sidebarMark` ("CHISU®") significan cosas distintas. El Hero usa `displayWordmark` como nombre accesible del gráfico (la imagen contiene el dibujo real de la marca); el sidebar usa `sidebarMark`, un símbolo registrado independiente. Cambiar el texto de `displayWordmark` **no redibuja el PNG**. `siteName` no sustituye automáticamente a las otras dos etiquetas en ningún sitio.

## Sobre mí

Un único título «SOBRE MÍ» y siete párrafos de presentación:

Se presentan en dos grupos con h3: «/whoami» (los tres primeros) y «Qué me diferencia de la competencia» (los cuatro restantes). Desde el 23 de octubre cada párrafo es una tarjeta numerada (`01`–`08`) sobre un hilo dorado que se dibuja con el scroll (disposición y medidas en [[Sobre-Mi]]); la frase de cierre («proyectos con más profundidad…») es desde el 24 de octubre su propia tarjeta con un botón «Ver mis proyectos» (`aboutMe.projectsCta`), el paso 08, partida del final del último párrafo sin alterar el texto. No se cambia la redacción. Etiquetas y selector de cierre también existen en inglés.

- Formación y ubicación: Jesús León Romero Atienza, Ingeniería del Software con mención en Ingeniería de Datos (Big Data), U-TAD (Centro Universitario de Tecnología y Arte Digital), ciudad natal Madrid, España.
- Base técnica: tres años de formación, full-stack, bases de datos, arquitectura de software y programación de sistemas.
- Idiomas: «Domino totalmente el español, tengo un nivel C1 de inglés y un A2 de alemán».
- Valor diferencial frente a la competencia: conectar tecnología, diseño gráfico, análisis de negocios y finanzas.
- Esports: se conserva la frase original sobre equipo, disciplina y decisiones bajo presión.
- Moda, música y redes sociales: «La moda, la música y las redes sociales influyen en mi criterio visual y en la forma de comunicar mis proyectos».
- Varias capas por proyecto: una versión propia, soluciones que funcionan y transmiten identidad, y proyectos con profundidad, personalidad y una experiencia cuidada. Se retira la enumeración de disciplinas y el último párrafo de dirección hacia Data Science/machine learning.

Estos párrafos sustituyen a las cuatro escenas narrativas (Cimientos, Dirección, Producto e Impulso) y sus gráficos. Ya no se publica el título compuesto ni la línea independiente de ciudad e idiomas. Se retiran también los dos CTA de Drive que acompañaban a esas escenas. Detalle de render en [[Sobre-Mi]].

La biografía se presenta en Inter. Los cinco primeros párrafos conservan la redacción aprobada. La carrera/mención enlaza al grado y el nombre completo de U-TAD al mapa proporcionado. Madrid/España usa negrita sólida, sin degradado ni colores de bandera (se retiraron en la auditoría del 23 de octubre). La base técnica combina emoji 💻 y negritas en full-stack, bases de datos, arquitectura y sistemas. 📚 acompaña U-TAD y banderas locales acompañan los tres idiomas; 👋 y 🎮 conservan su papel. En el perfil, 👟 moda, 🎧 música y 📱 redes sociales; versión propia y varias capas en negrita. Se retiran todos los círculos/subrayados SVG y su animación; permanecen los subrayados funcionales de los enlaces. `aboutMe.accents` mantiene selectores y URLs en ES/EN. El perfil se separa después de la introducción.

«Mi base actual» se retiró por duplicar formación e idiomas. La sección cierra con «MI STACK DE TRABAJO»: filas de categorías y logos visibles, sin las antiguas tarjetas bento ni un CTA final hacia Proyectos.

| Grupo de skills | Elementos |
|---|---|
| Software | Java, Python, C, C++, JavaScript, PHP, TypeScript |
| Web | Astro, React, Node.js, GSAP |
| Bases de datos | MySQL, PostgreSQL, MariaDB, MongoDB, Qdrant, Redis, Neo4j |
| Data | Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Jupyter |
| Herramientas | Git, GitHub, Docker, Linux, Windows, n8n |
| Diseño | Photoshop, GIMP, Photopea, Canva, After Effects, Illustrator |
| Documentación y colaboración | Obsidian, Google Drive, Word, Excel, PowerPoint, Teams |

42 herramientas en total, todas con recurso de logo local. Los añadidos usan PNG de 96×96; se documentan sus fuentes en [[Logos-Stack]]. Los nombres acompañan siempre a sus imágenes. No son enlaces ni botones y no implican dependencias instaladas en el proyecto.

## Títulos de sección

En la portada, Proyectos, Servicios, Tools, Contacto y FAQ se presentan con un título gráfico (ver [[Otras-Secciones-y-Compartidos]]). El texto de cada `h2`, accesible pero no visible, es: «Proyectos destacados», «Servicios», «Tools», «Hablemos de tu próxima idea» y «Preguntas frecuentes». Las versiones inglesas no tienen arte y muestran la tarjeta de texto.

## Proyectos

Seis tarjetas **reales** (27 de octubre de 2026), elegidas entre los repositorios públicos de github.com/chiissuu y el proyecto en curso del usuario: 01 Clasificador de perros y gatos (notebook con Keras, exactitud de 0,99, «En desarrollo», sin enlace todavía), 02 MegatronixOS (simulador de caché en C, con Mario Viso Quito), 03 Plataforma de pedidos de restaurante (Java, siete patrones de diseño; fork de un proyecto universitario en equipo), 04 Tienda diaria de Fortnite (repo `M2-PWIC`, JavaScript/Vite, API pública), 05 Instagram Checker (Python/Playwright, todo en local) y 06 Aim Trainer (JavaScript puro). Cada una tiene categoría, título, `description`, `tags`, `status` (solo la 01 lo usa) y `href` opcional a su repositorio (se abre en pestaña nueva). Excluidos a propósito: `DDoS-Ripper` (herramienta ofensiva), `letterboxd-recomender` (en pausa, solo un inspector de ZIP), `github-checker` (parecido a Instagram Checker) y `web-portfolio-chisu` (esta web). Las imágenes siguen siendo el relleno de color por tarjeta. En el formato de Servicios/Tools, seguidas del stack de trabajo (que antes cerraba Sobre mí). Detalle estructural en [[Otras-Secciones-y-Compartidos]].

## Servicios y Tools en portada

Son dos secciones independientes (Servicios y, a continuación, Tools), cada una con título gráfico propio, una introducción y tarjetas con imagen provisional (ver [[Otras-Secciones-y-Compartidos]]). Las tarjetas reutilizan `services.page.articles` y `tools.page.items`; los textos no se han reescrito. Servicios explica desarrollo técnico y criterio visual, automatización, webs comerciales, asesoramiento previo y auditoría con el cliente. Tools explica la colección de utilidades y muestra como ejemplo la primera herramienta del catálogo. Detalle estructural en [[Otras-Secciones-y-Compartidos]].

## Servicios: página independiente

Título, introducción, y tres artículos con tags: automatización de procesos, páginas web comerciales y visuales, y auditoría y asesoramiento técnico/visual. Cierra con «Cuéntame tu proyecto».

## Tools: catálogo

- «Conversor de vídeo a MP3/MP4» — Disponible, tags Vídeo/Audio/Local, enlace real.
- «Comprobador de quién no te sigue en Instagram» — En desarrollo, sin enlace.

## Contacto y FAQ

Contacto: texto de disponibilidad, formulario, y los canales directos: `mailto:jesusleonromero233@gmail.com`, LinkedIn (deshabilitado), GitHub y «Redes Sociales» (Linktree). Sin cambios de texto en el rediseño; la disposición está en [[Otras-Secciones-y-Compartidos]].

FAQ: experiencia profesional, disponibilidad freelance, acceso al trabajo de diseño, mejor vía de contacto. La segunda respuesta es un placeholder; la cuarta menciona el formulario.

## Contenido existente pero no publicado

Ver [[Otras-Secciones-y-Compartidos]] (teasers y `ClosingStatement`) y [[Bilingue-ES-EN]] (estado del inglés).

## Frase de Proyectos (30 de octubre de 2026)

La introducción de Proyectos (`projects.note` en `src/content/site.js`) es ahora genérica para que no haya que tocarla al añadir proyectos: «Una selección de los proyectos más relevantes que he desarrollado en mi trayectoria como ingeniero tecnológico.» (EN: «A selection of the most relevant projects I have developed throughout my career as a technology engineer.»). Van en negrita «proyectos más relevantes» e «ingeniero tecnológico» (`projects.noteStrong`; cada frase debe aparecer literal en `note`). Copia previa: `backups/site.js.pre-frase-proyectos-2026-10-30.bak`.

## Relacionado

[[Sobre-Mi]] · [[Otras-Secciones-y-Compartidos]] · [[Hero-y-Sidebar]] · [[Bilingue-ES-EN]]
