---
tags: [contenido, i18n]
actualizado: 2026-10-06
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

Portada «INGENIERÍA, DATOS E IDENTIDAD.», ubicación e idiomas, y biografía sobre Ingeniería del Software en U-TAD. Continúa con cuatro escenas (mecánica de render en [[Sobre-Mi]]):

| Escena | Contenido | Visual / enlace |
|---|---|---|
| Cimientos | Java y plataforma de pedidos; C y MegatronixOS; portfolio con Astro | Diagrama de producto digital con tres ramas |
| Dirección | Evolución desde software hacia Data Science y machine learning | Secuencia vertical de tres etapas |
| Producto | Tecnología, negocio, inversión y diseño gráfico | Triángulo + enlace externo al archivo de diseño (Drive) |
| Impulso | Esports, disciplina, equipo, presión, moda, música, cine y creatividad | Nube de palabras + enlace externo a trayectoria competitiva (Drive) |

«MI BASE ACTUAL» muestra formación (U-TAD, Ingeniería del Software, Mención en Ingeniería de Datos, Tercer curso) e idiomas (Español nativo, Inglés C1, Alemán A2). La tarjeta de formación enlaza al grado. «MI SISTEMA DE TRABAJO» cierra la sección — **sin** CTA final hacia Proyectos (se retiró deliberadamente en una corrección anterior).

| Grupo de skills | Elementos |
|---|---|
| Software | Java, Python, C, C++, JavaScript, PHP |
| Web | HTML, CSS, Astro, Node.js, GSAP |
| Bases de datos | MySQL, PostgreSQL, MariaDB, MongoDB |
| Data | Pandas, NumPy, Matplotlib, Seaborn, Scikit-learn, Jupyter |
| Herramientas | Git, GitHub, Docker, Linux, Windows, n8n |
| Diseño | Photoshop, GIMP, Photopea, Canva |

31 habilidades en total. Astro, GSAP y n8n no tienen icono propio y se muestran solo como texto — no son enlaces ni botones.

## Proyectos

Tres tarjetas provisionales (Full-stack, Data Science, Visual/UI), cada una «Próximamente». Detalle estructural en [[Otras-Secciones-y-Compartidos]].

## Servicios y Tools en portada

Servicios explica desarrollo técnico y criterio visual, automatización, webs comerciales, asesoramiento previo y auditoría con el cliente. Tools explica la colección de utilidades y muestra como ejemplo la primera herramienta del catálogo. Detalle estructural en [[Otras-Secciones-y-Compartidos]].

## Servicios: página independiente

Título, introducción, y tres artículos con tags: automatización de procesos, páginas web comerciales y visuales, y auditoría y asesoramiento técnico/visual. Cierra con «Cuéntame tu proyecto».

## Tools: catálogo

- «Conversor de vídeo a MP3/MP4» — Disponible, tags Vídeo/Audio/Local, enlace real.
- «Comprobador de quién no te sigue en Instagram» — En desarrollo, sin enlace.

## Contacto y FAQ

Contacto: LinkedIn (deshabilitado), GitHub, «Redes Sociales» (Linktree), texto de disponibilidad, formulario, y `mailto:jesusleonromero233@gmail.com`.

FAQ: experiencia profesional, disponibilidad freelance, acceso al trabajo de diseño, mejor vía de contacto. La segunda respuesta es un placeholder; la cuarta menciona el formulario.

## Contenido existente pero no publicado

Ver [[Otras-Secciones-y-Compartidos]] (teasers y `ClosingStatement`) y [[Bilingue-ES-EN]] (estado del inglés).

## Relacionado

[[Sobre-Mi]] · [[Otras-Secciones-y-Compartidos]] · [[Hero-y-Sidebar]] · [[Bilingue-ES-EN]]
