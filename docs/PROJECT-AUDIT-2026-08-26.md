# Auditoría técnica integral — Portfolio web de chiissuu

**Fecha del informe:** 2026-08-26
**Rama auditada:** `feat/lower-sections-redesign`
**HEAD auditado:** `8176afa97b0b2807a46031a81812ebdb5122e3a7`
**Estado del working tree auditado (incluido en esta auditoría, no solo HEAD):**

```text
 M src/components/AboutSection.astro
 M src/content/site.js
 M src/lib/content-types.ts
```

Estas tres modificaciones ya fueron implementadas y validadas por el usuario en su navegador real (Windows) en una tarea anterior. Esta auditoría las trata como parte del estado actual del proyecto, no como HEAD puro.

**Alcance de esta tarea:** exclusivamente análisis y documentación. No se ha modificado código, contenido, estilos, configuración, dependencias ni assets. No se ha hecho commit ni push. La única escritura de esta tarea es este mismo archivo.

**Metodología de evidencia.** Cada afirmación relevante de este documento se etiqueta como una de las siguientes categorías:

- **[Hecho comprobado en código]** — confirmado leyendo el código fuente real, con cita `archivo:línea`.
- **[Medición real]** — confirmado ejecutando un comando real (tamaño de archivo, hash, salida de comando) en el entorno de este agente o en el dispositivo del usuario.
- **[Inferencia]** — deducido razonablemente a partir del código, pero no verificado de forma mecánica (p. ej. comparar manualmente un objeto JS contra una interfaz TypeScript sin ejecutar `tsc`).
- **[Recomendación]** — opinión/sugerencia del auditor, no un hecho del código.
- **[No verificable en este entorno]** — no se pudo comprobar aquí (típicamente: renderizado visual real, porque `astro dev`/`astro build` no funcionan en este entorno cloud).
- **[Validación manual comunicada por el usuario]** — el usuario ha informado que comprobó algo visualmente en su navegador real (Windows); se registra como tal, nunca como una validación realizada por este agente.

Este informe fue construido combinando lectura directa de archivos por el agente principal y cuatro subagentes de investigación de solo lectura (misma sesión, mismo repositorio montado, sin escritura), cada uno enfocado en una porción del repositorio. Todas las citas de línea proceden de lecturas reales de archivo, no de memoria ni de suposición.

---

## 1. Resumen ejecutivo

**Estado general.** Es un portfolio personal (no una web comercial) construido con Astro 7 + islas React puntuales, en pleno proceso de rediseño ("redesign"). La página de inicio (`/`) tiene 5 secciones ya rediseñadas visualmente (Hero, Sobre mí, Proyectos, Servicios y Tools, Contacto, FAQ), con una experiencia de scroll/GSAP compleja y cuidadosamente documentada en `HeroExperience.astro`. Existen además 3 subpáginas (`/servicios/`, `/tools/`, `/tools/video-converter/`) que usan un layout más simple (`SimpleNav` + contenido estático). El proyecto es monolingüe en producción (español) pero tiene contenido en inglés completamente escrito y tipado, listo para una futura ruta `/en` que aún no existe.

**Rama y commit base.** `feat/lower-sections-redesign` @ `8176afa97b0b2807a46031a81812ebdb5122e3a7` **[Hecho comprobado, medición real vía `git rev-parse HEAD`]**. Historial completo del repositorio (5 commits en total, un solo autor): `e35f359` Initial commit → `dd4c83c` refine hero layout → `261e19a` fix responsive hero → `d9e2ab5` improve accessible mobile navigation → `8176afa` feat: finalize desktop portfolio experience (HEAD) **[Medición real, `git log --oneline --all`]**. No existe configuración de CI en el repositorio (sin `.github/`, ver §18); el historial de pull requests no puede demostrarse desde el repositorio local — un repositorio Git local no conserva ese dato aunque hubiera existido en un remoto/plataforma (GitHub, etc.), por lo que no se afirma ni se descarta su existencia, solo que no es verificable desde aquí.

**Estado del working tree.** Exactamente las 3 modificaciones de About descritas arriba, ya validadas por el usuario. Ningún otro archivo tiene cambios sin confirmar.

**Nivel de madurez actual.** Visualmente avanzado y con una arquitectura de animación inusualmente bien documentada para un proyecto personal. Funcionalmente, es una **maqueta con partes reales y partes explícitamente placeholder**: el conversor de vídeo es una herramienta real y funcional (procesamiento 100% en el navegador, sin backend); los dos formularios de contacto son interfaz completa con validación real pero **no envían datos a ningún sitio** (stub documentado); la sección de Proyectos está marcada como "en construcción" en su propio contenido; una respuesta de la FAQ es literalmente el texto "Placeholder"; no existe infraestructura SEO más allá de `<title>`/`<meta description>`; no hay build funcional en este entorno cloud (aunque sí en el entorno Windows del usuario, ver §5).

**Qué partes parecen estables:**
- El sistema de tokens de diseño y el layout compartido (`Layout.astro`).
- El conversor de vídeo (`/tools/video-converter/`) — lógica cuidada, límites, manejo de errores, 100% cliente.
- La nueva estructura editorial de About (validada por el usuario).
- La navegación por anclas en subpáginas (`SimpleNav.astro`).

**Qué partes están claramente en desarrollo o son placeholder:**
- Proyectos (3 ítems "(placeholder)", sin enlaces, `status: "Próximamente"`).
- Formularios de Contacto y Servicios (interfaz completa, envío simulado).
- Segundo ítem de Tools ("Instagram unfollowers checker", "En desarrollo").
- Una respuesta de FAQ ("Placeholder — se actualizará...").
- `ClosingStatement.astro` — componente completo pero no renderizado en ninguna ruta.
- Fuente editorial "PP Neue Montreal Book": el archivo `.woff2` **sí existe** en `public/assets/fonts/`, pero el comentario en `Layout.astro:230` sigue afirmando que "no está incluida en este proyecto" — documentación desactualizada, ver §5 y §21.

**Principales riesgos técnicos:**
1. `HeroExperience.astro` (3169 líneas) concentra toda la animación de scroll/morph Hero→sidebar; es el archivo de mayor riesgo del proyecto por lejos (ver §10 y §22).
2. El build (`astro build`/`astro check`/`astro dev`) no funciona en este entorno cloud por un `node_modules` instalado en Windows (binding nativo de rolldown equivocado) — no es un defecto del código, ver §5.
3. Los formularios no envían datos realmente; un visitante real puede creer erróneamente que ha contactado al propietario del sitio.
4. Cero infraestructura SEO (sin OG, sin canonical, sin sitemap, sin robots.txt, sin JSON-LD, sin `site` configurado en `astro.config.mjs`).
5. Imágenes de fondo del Hero muy pesadas (hasta 4,5 MB) sin optimización de Astro (`astro:assets` no se usa en ningún punto del proyecto).

**Principales tareas pendientes antes de un lanzamiento real:**
- Decidir y conectar un backend real para los formularios (o quitar la promesa implícita de contacto).
- Completar o retirar la sección Proyectos.
- Añadir infraestructura SEO mínima (title/description por página, OG, sitemap, robots.txt, favicon completo/manifest).
- Decidir si/cuándo publicar `/en`.
- Optimizar imágenes pesadas del Hero.
- Retirar el párrafo de depuración "PRUEBA DE SECCIÓN" en `VideoConverterPageContent.astro:24` (ver §7 y §21 — está también en el `dist/` generado).

**Qué no se pudo comprobar en este entorno:** todo renderizado visual real (los 6 viewports, el comportamiento del scroll/morph, el color del sidebar, la reproducción del video converter en un navegador real), cualquier medición de rendimiento real (LCP, CLS, Lighthouse), y cualquier prueba con lector de pantalla. Ver el detalle exhaustivo en §12, §14 y §18.

### Tabla de estado por área

| Área | Estado |
|---|---|
| Hero (animación, morph, sidebar) | Funcional pendiente de validación (código completo y documentado; sin ejecución real posible aquí) |
| Sobre mí (About) | Estable (implementado y validado manualmente por el usuario) |
| Proyectos | Placeholder (contenido explícitamente "(placeholder)"/"Próximamente") |
| Servicios y Tools (teaser home) | Estable |
| Página /servicios/ | Estable (contenido); formulario en desarrollo (no envía datos) |
| Página /tools/ | Estable (contenido); 1 de 2 herramientas en desarrollo |
| Video converter | Estable y funcional (100% cliente, sin backend) |
| Contacto (home) | Estable (contenido/tarjetas); formulario en desarrollo (no envía datos) |
| FAQ | En desarrollo (1 de 4 respuestas es un placeholder literal) |
| Bilingüe (ES/EN) | En desarrollo (EN completo en datos, sin ruta que lo sirva; con un desajuste de tipos, ver §13) |
| SEO | No implementado (más allá de title/description básicos) |
| Formularios — backend | No implementado (placeholder documentado explícitamente) |
| Seguridad (sinks XSS, secretos, rel=noopener) | Estable en lo auditable estáticamente |
| Rendimiento (imágenes del Hero) | Riesgo técnico |
| Build en este entorno cloud | Riesgo técnico / bloqueado por plataforma (no por código) |
| Accesibilidad general | Funcional pendiente de validación (buenos patrones ARIA en código; sin prueba con lector de pantalla real) |

---

## 2. Estado autorizado y checkpoint de esta tarea

**[Medición real]**

```
GIT_OPTIONAL_LOCKS=0 git branch --show-current  → feat/lower-sections-redesign
GIT_OPTIONAL_LOCKS=0 git rev-parse HEAD          → 8176afa97b0b2807a46031a81812ebdb5122e3a7
ls .git/index.lock                               → No such file or directory (ausente)
GIT_OPTIONAL_LOCKS=0 git status --short:
 M src/components/AboutSection.astro
 M src/content/site.js
 M src/lib/content-types.ts
```

**Cronología real del uso de `GIT_OPTIONAL_LOCKS=0` en esta tarea (corregido tras una entrega anterior que lo describía de forma inexacta):** el checkpoint inicial y el checkpoint final de esta tarea se ejecutaron con `GIT_OPTIONAL_LOCKS=0` en todos sus comandos Git de solo lectura. Durante la fase de investigación se usaron 4 subagentes de solo lectura sobre el mismo repositorio montado; a **uno** de ellos no se le instruyó explícitamente usar `GIT_OPTIONAL_LOCKS=0`, y ese subagente ejecutó `git status`/`git log -p`/`git diff --stat` sin esa variable — esto generó un `.git/index.lock` huérfano de 0 bytes (el punto de montaje no permite que `git` se autolimpie el lock tras usarlo). El lock fue detectado en el siguiente checkpoint de esta misma tarea, se detuvo el trabajo sin borrarlo ni ignorarlo, y el usuario lo eliminó manualmente desde su equipo. El checkpoint final que precedió a la escritura del informe, y todas las comprobaciones Git posteriores, sí se ejecutaron con `GIT_OPTIONAL_LOCKS=0` de forma obligatoria, sin excepción.

---

## 3. Stack y configuración

**[Hecho comprobado + Medición real]** Versiones resueltas realmente instaladas, leídas de `package-lock.json` (no del rango semver de `package.json`, que puede no coincidir):

| Paquete | Rango en `package.json` | Versión resuelta real (`package-lock.json`) |
|---|---|---|
| astro | `^7.1.3` | **7.1.3** |
| typescript (dev) | `^5.7.3` | **5.9.3** |
| gsap | `^3.12.5` | **3.15.0** |
| react | `^18.3.1` | **18.3.1** |
| react-dom | `^18.3.1` | **18.3.1** |
| @astrojs/react | `^4.4.2` | **4.4.2** |
| @astrojs/check (dev) | `^0.9.4` | **0.9.9** |
| @ffmpeg/core | `^0.12.6` | **0.12.10** |
| @ffmpeg/ffmpeg | `^0.12.15` | **0.12.15** |
| @ffmpeg/util | `^0.12.2` | **0.12.2** |
| lucide-astro | `^0.469.0` | **0.469.0** |
| @types/react (dev) | `^18.3.31` | **18.3.31** |
| @types/react-dom (dev) | `^18.3.7` | **18.3.7** |
| rolldown (transitivo, bundler interno de Vite 8/Astro 7) | — | **1.1.5** |
| vite (transitivo) | — | **8.1.5** |

Node/npm reales en este entorno: `node v22.23.2`, `npm 10.9.8` **[Medición real]**; `package.json:6-8` exige `"engines": {"node": ">=22.12.0"}` — se cumple.

**GSAP y ScrollTrigger.** GSAP 3.15.0 se importa directamente (sin paquete `gsap/ScrollTrigger` separado en `package.json` porque `ScrollTrigger` viene incluido en el paquete `gsap` y se importa como submódulo) — uso confirmado en `src/components/HeroExperience.astro` (ver §10, inventario completo de animaciones). No se detectó ningún otro plugin de GSAP (no hay `SplitText`, `Draggable`, etc.) **[Inferencia por ausencia en package.json/lockfile]**.

**Frameworks de frontend.** Astro (SSG/islands, `output` no configurado → estático por defecto, `astro.config.mjs:1-16`) + React 18 **solo** para el conversor de vídeo (`@astrojs/react`, integración registrada en `astro.config.mjs:14`, uso confirmado exclusivamente en `src/components/VideoConverter/*.tsx` montado con `client:only="react"`). Ningún otro componente del proyecto usa React **[Hecho comprobado, confirmado por los 4 subagentes al recorrer todos los `.astro`]**.

**Dependencias de producción:** `@astrojs/react`, `@ffmpeg/core`, `@ffmpeg/ffmpeg`, `@ffmpeg/util`, `astro`, `gsap`, `lucide-astro`, `react`, `react-dom` (`package.json:16-24`). Nota: `lucide-astro` está declarado pero **no se encontró ningún uso real de sus iconos** en los archivos auditados por los 4 subagentes — posible dependencia sin usar; no se hizo una comprobación exhaustiva independiente adicional de esto, se marca como **[Inferencia]**, a confirmar con un grep dedicado si se quiere depurar dependencias.

**Dependencias de desarrollo:** `@astrojs/check`, `@types/react`, `@types/react-dom`, `typescript` (`package.json:26-30`).

**Scripts de `package.json`** (`:9-15`):
```json
"dev": "astro dev",
"build": "astro build",
"preview": "astro preview",
"check": "astro check",
"astro": "astro",
"postinstall": "node scripts/copy-ffmpeg-core.mjs",
"copy:ffmpeg-core": "node scripts/copy-ffmpeg-core.mjs"
```
`postinstall` copia el núcleo WASM de ffmpeg desde `node_modules/@ffmpeg/core/dist/umd/` a `public/ffmpeg/` (motivo por el que ese directorio está en `.gitignore`, ver §17).

**Configuración de Astro** (`astro.config.mjs`, 16 líneas, leído completo): solo registra la integración `react()`. **No** define `site`, `base`, `output` ni `adapter` — por lo tanto Astro genera un sitio 100% estático (`output: "static"` implícito), sin `base` (rutas raíz `/`), y sin URL canónica configurada para ninguna herramienta de sitemap/canonical de Astro **[Hecho comprobado]**.

**Configuración TypeScript** (`tsconfig.json`, leído completo): extiende `astro/tsconfigs/strict`, con `jsx: "react-jsx"` / `jsxImportSource: "react"` sobreescrito explícitamente (comentario explica que es solo para el conversor de vídeo). `include: [".astro/types.d.ts", "**/*"]`, `exclude: ["dist"]`.

**Sistema de módulos:** ESM puro (`"type": "module"` en `package.json:3`); `src/content/site.js` es JavaScript plano (no `.ts`), tipado externamente vía `content-types.ts` — de ahí el desajuste de tipos detectado en §13 (imposible de detectar por el propio archivo, al no ser TypeScript).

**Fuentes:** Google Fonts cargadas vía `<link>` en `Layout.astro:26-28` (Space Grotesk, Archivo Black, Inter Tight, Inter, JetBrains Mono). Una fuente adicional autoalojada, "PP Neue Montreal Book", declarada vía `@font-face` en `Layout.astro:236-242` apuntando a `/assets/fonts/PPNeueMontreal-Book.woff2`. **[Medición real]** ese archivo **sí existe** en disco (`public/assets/fonts/PPNeueMontreal-Book.woff2`, 27.516 bytes, `mtime` 2026-08-05). Sin embargo el comentario en `Layout.astro:230-235` sigue diciendo textualmente *"licensed font, not bundled with this project ... until it's added, every `var(--font-editorial)` consumer falls back to 'Inter'"* — **esto es documentación desactualizada**: el archivo ya fue añadido después de escribirse ese comentario, pero el comentario no se actualizó. Recomendación en §19 (hallazgo D11).

**Procesamiento de CSS:** sin preprocesador (no Sass/Less/PostCSS plugins declarados) — CSS nativo con custom properties, dentro de `<style>` de cada `.astro` (con scoping automático de Astro) más un bloque `<style is:global>` en `Layout.astro` para tokens y utilidades compartidas. El único CSS Module real del proyecto es `src/components/VideoConverter/video-converter.module.css` (React, no Astro).

**Herramientas de build:** Astro 7 usa Vite 8 internamente, y Vite 8 usa **rolldown** (el nuevo bundler Rust de Vite) en lugar de esbuild/Rollup clásico — de ahí el error conocido.

### El problema conocido: `Cannot find module '@rolldown/binding-linux-x64-gnu'`

**[Hecho comprobado — evidencia definitiva, no inferencia]**. Se comprobó el contenido real de `node_modules/@rolldown/`:

```
$ ls node_modules/@rolldown/
binding-win32-x64-msvc
pluginutils
```

Y el `optionalDependencies` declarado por el paquete `rolldown@1.1.5` en `package-lock.json` incluye 15 bindings nativos por plataforma, entre ellos `@rolldown/binding-linux-x64-gnu` (el que este entorno Linux x64 necesita) — **pero ese paquete no está instalado en disco**; solo lo está `@rolldown/binding-win32-x64-msvc` (el binding de Windows). El propio `uname -a`/`node -e "console.log(process.platform, process.arch)"` de este entorno confirma `linux x64`.

**Esto es una prueba directa, no una suposición: `node_modules` de este repositorio fue instalado con `npm install` ejecutándose en Windows** (npm resuelve `optionalDependencies` según la plataforma donde corre `npm install`, y solo descargó el binding de Windows), y esa carpeta `node_modules` se sincronizó/montó tal cual en este entorno Linux, en vez de reinstalarse aquí. Por tanto:

- **No es un problema del código del proyecto** (ni de `astro.config.mjs`, ni de `package.json`, ni de ninguna dependencia mal declarada).
- **Es un problema de plataforma/entorno**: `node_modules` de Windows usado desde Linux.
- Confirmado también contra `npm run check`, `npm run build`, y `npm run dev` — los tres fallan con el mismo stack trace exacto terminando en `Cannot find module '../rolldown-binding.linux-x64-gnu.node'`.
- **No se ha intentado reparar** (`npm install`/`npm update`/borrar `node_modules` están fuera del alcance de esta tarea de auditoría, y ya estaban prohibidos explícitamente en la tarea anterior).
- **[Medición real, hallazgo nuevo de esta auditoría]**: existe un `dist/` en el repositorio (gitignored, no versionado) con `mtime` 2026-08-26 19:23 — **posterior** a las modificaciones de About en el working tree — y una comprobación de texto (`grep -c "Base técnica" dist/index.html` → 1 coincidencia) confirma que ese `dist/` **sí contiene la nueva copia de About**. Esto es evidencia indirecta consistente con que el usuario ejecutó `npm run build` con éxito en su propio equipo Windows (donde el binding nativo correcto sí está disponible), generando ese `dist/` — pero esto es una **inferencia**, no algo que este agente haya ejecutado o verificado directamente; no se afirma que ese `dist/` sea idéntico byte a byte a lo que un build real produciría hoy.

**Entorno esperado para desarrollar este proyecto:** Linux/macOS/Windows con Node ≥22.12, ejecutando `npm install` en la misma plataforma/arquitectura donde luego se ejecutará `astro dev`/`build`/`check` — el problema descrito aquí es exactamente lo que ocurre al romper esa invariante (instalar en una plataforma, ejecutar en otra, sin reinstalar).

---

## 4. Mapa del repositorio

**[Hecho comprobado]** — 39 archivos fuente en `src/` (8.077 líneas totales), 38 archivos en `public/`, 1 script en `scripts/`. `node_modules/`, `.git/`, `.astro/` (tipos generados) y `dist/` (build output) excluidos de este mapa por instrucción.

| Directorio | Responsabilidad | Archivos principales | Dependencias | Riesgo de modificación | Código compartido |
|---|---|---|---|---|---|
| `src/pages/` | 4 rutas reales del sitio (ver §7) | `index.astro`, `servicios/index.astro`, `tools/index.astro`, `tools/video-converter/index.astro` | Todas importan `Layout.astro` + `content/site.js` | Bajo-medio: son "orquestadores" finos, la lógica vive en los componentes que importan | No — cada página es su propio punto de entrada |
| `src/layouts/` | Único layout HTML del sitio: `<html>/<head>/<body>`, tokens de diseño globales, reveal-on-scroll genérico, guard de auto-scroll con botón central, formularios compartidos (`.rd-form*`) | `Layout.astro` (532 líneas, único archivo) | Ninguna (solo Google Fonts externas) | **Alto** — cualquier cambio a los tokens `--color-*`/`--font-*`/`.section-theme-*`/`.glass-panel`/`.rd-*` repinta las 4 rutas enteras | Sí — es la fuente de verdad de todo el sistema de diseño |
| `src/content/` | Única fuente de contenido/copy del sitio, bilingüe (es/en), objeto plano JS | `site.js` (898 líneas) | Tipado externamente por `src/lib/content-types.ts` (no es TS él mismo) | Alto — toda página/componente lee de aquí; un campo renombrado rompe silenciosamente cualquier componente que lo consuma (JS plano, sin chequeo de tipos en el propio archivo) | Sí — consumido por las 4 páginas y prácticamente todos los componentes |
| `src/components/` | Toda la UI: Hero, secciones de home, páginas de subrutas, conversor de vídeo, primitivas compartidas | 16 `.astro` + 6 `.tsx` + 1 `.module.css` (ver inventario completo en §8) | Layout.astro (tokens), content-types.ts (tipos), unos a otros | Variable por componente — ver §8 y §22 (`HeroExperience.astro` es el de mayor riesgo con diferencia) | `SectionHeadingCard.astro` y `RollLink.astro` son las piezas realmente reutilizadas entre secciones |
| `src/lib/` | Utilidades y tipos: contrato de contenido, helpers de rutas, lógica de formularios, lógica del conversor de vídeo | `content-types.ts` (527 líneas), `paths.js` (4 líneas), `forms/{submit,types,validate}.ts`, `videoConverter/{constants,ffmpegClient,types,utils}.ts` | `content-types.ts` es el contrato que `site.js` debe cumplir (sin chequeo automático posible aquí, ver §13) | Alto para `content-types.ts` (cambia el contrato de toda la web); medio para el resto | Sí — `paths.js`/`forms/*` se comparten entre `ContactForm`/`ServicesForm`; `videoConverter/*` es privado al conversor |
| `src/data` | No existe como directorio independiente — el contenido vive en `src/content/site.js` | — | — | — | — |
| `src/styles` | No existe como directorio independiente — todo el CSS vive dentro de `<style>` de cada `.astro` más el bloque global de `Layout.astro`, salvo el único `.module.css` de React | — | — | — | — |
| `public/` | Assets estáticos servidos tal cual: imágenes, iconos de skills, fuente autoalojada, núcleo WASM de ffmpeg (generado, no versionado) | Ver inventario completo en §19 | `scripts/copy-ffmpeg-core.mjs` regenera `public/ffmpeg/` en cada `npm install` | Bajo (assets estáticos), salvo que renombrar/mover un archivo referenciado rompe la referencia (no hay `astro:assets`, ver §18) | No |
| `scripts/` | Un único script de postinstall | `copy-ffmpeg-core.mjs` | `node_modules/@ffmpeg/core` | Bajo | No |
| Configuración raíz | Build/tipos/paquete | `astro.config.mjs`, `tsconfig.json`, `package.json`, `package-lock.json`, `.gitignore` | — | Alto (afecta todo el proyecto) | — |
| Workflows | **No existe** `.github/` en el repositorio — sin CI configurada **[Hecho comprobado]** | — | — | — | — |

---

## 5. Mapa de rutas

**[Hecho comprobado]** — 4 rutas reales, extraídas de `find src/pages -type f`. Las 4 son `.astro` estáticas; no existe `src/pages/api/` ni ningún endpoint de servidor.

### `/` (home) — `src/pages/index.astro`
- **Layout:** `Layout.astro`, `bodyClass="redesign redesign-home"`, `lang="es"`.
- **Componentes principales, en orden de render:** `HeroExperience` → `<main class="home-main">` → `AboutSection`, `ProjectsSection`, `ServicesToolsSection`, `ContactSection`, `FaqSection`. `ClosingStatement` existe pero **no se importa ni renderiza** aquí (confirmado por comentario explícito en el propio archivo, `index.astro:19-22`, y por ausencia de import).
- **Idioma:** español (`const t = content.es`, `index.astro:14`; comentario propio confirma que `content.en` "existe completo y traducido... listo para un futuro selector de idioma, pero ninguna ruta `/en` lo renderiza aún").
- **Título/meta:** `t.seo.title` = "chiissuu | Jesús León — Software Engineer & Data Science"; `t.seo.description` = "Portfolio de Jesús León: Ingeniería del Software, Data Science y diseño visual." (`site.js:14-16`).
- **Estado funcional:** Completo en código; formularios de Contacto no envían datos (placeholder, ver §16); Proyectos es contenido placeholder.
- **Placeholders:** Sí — Proyectos (3 ítems), 1 respuesta de FAQ, mensajes de éxito de formulario que admiten que no hay envío real.
- **Navegación a otras rutas:** vía CTAs internos hacia `/servicios/` y `/tools/` (`ServicesToolsSection.astro`), y vía el nav propio del Hero.
- **Formularios/interacciones:** `ContactForm` (dentro de `ContactSection`), toda la maquinaria de scroll/morph de `HeroExperience`, acordeón nativo `<details>` en FAQ.
- **Riesgos conocidos:** ver §10/§22 sobre `HeroExperience.astro`.

### `/servicios/` — `src/pages/servicios/index.astro`
- **Layout:** `Layout.astro`, `bodyClass="redesign"` (sin `redesign-home`, por tanto sin sidebar fijo ni compensación de márgenes), `lang="es"`.
- **Componentes:** `SimpleNav` → `ServicesPageContent` → `ServicesForm`.
- **Idioma:** español.
- **Título/meta:** `"Servicios | chiissuu | Jesús León — Software Engineer & Data Science"`; descripción = `t.services.page.intro` ("Desarrollo web full-stack, automatización de procesos y asesoramiento técnico/visual para empresas.").
- **Estado funcional:** contenido estático completo; formulario de 8 campos con validación real pero **envío simulado** (ver §16).
- **Placeholders:** ninguno en el contenido propio de la página (los placeholders del sitio están en Proyectos/FAQ/home).
- **Navegación:** solo vía `SimpleNav` hacia anclas de la home (`/#about`, `/#contact`, `/#projects`, `/#services`, `/#tools`) — **no hay enlace de vuelta a `/tools/`**.
- **Formularios:** `ServicesForm` (8 campos, 3 obligatorios estrictos + email siempre validado).
- **Riesgos:** el formulario no envía datos realmente (ver §16); `SimpleNav` se oculta por completo bajo 700px sin alternativa de navegación móvil (ver §12).

### `/tools/` — `src/pages/tools/index.astro`
- **Layout:** `Layout.astro`, `bodyClass="redesign"`, `lang="es"`.
- **Componentes:** `SimpleNav` → `ToolsPageContent`.
- **Idioma:** español.
- **Título/meta:** `"Tools | chiissuu | ..."`; descripción = *"Plantilla visual de herramientas propias. Se irán añadiendo a medida que estén listas."* — el propio contenido admite que la página es una plantilla en construcción.
- **Estado funcional:** 2 ítems — Video converter (`status: "Disponible"`, enlaza a `/tools/video-converter/`) e "Instagram unfollowers checker" (`status: "En desarrollo"`, sin `href`, renderizado como `<span aria-disabled="true">` inerte).
- **Placeholders:** el segundo ítem es un placeholder honesto (etiquetado como tal, sin enlace roto).
- **Navegación:** `SimpleNav` + 1 enlace funcional a `/tools/video-converter/`.
- **Formularios:** ninguno.

### `/tools/video-converter/` — `src/pages/tools/video-converter/index.astro`
- **Layout:** `Layout.astro`, `bodyClass="redesign"`, `lang="es"`.
- **Componentes:** `SimpleNav` → `VideoConverterPageContent` → isla React `VideoConverter` (`client:only="react"`).
- **Idioma:** español.
- **Título/meta:** `"Conversor de vídeo | chiissuu | ..."`; descripción afirma explícitamente *"Nada se sube a ningún servidor"* — afirmación **confirmada por el código** (ver §16-bis más abajo y el detalle completo del subagente 3, resumido en §9).
- **Estado funcional:** completo y cuidado (validación de tamaño/duración, manejo de errores, limpieza de memoria).
- **⚠️ Hallazgo — texto de depuración en producción:** `src/components/VideoConverterPageContent.astro:24` contiene literalmente:
  ```html
  <p style="color: red; font-size: 2rem;">PRUEBA DE SECCIÓN</p>
  ```
  **[Hecho comprobado]** presente desde el commit inicial `e35f359` (nunca tocado después, confirmado con `git log -p` sobre ese archivo) y **[Medición real]** también presente en el `dist/` generado (`dist/tools/video-converter/index.html`, entre el párrafo introductorio y el punto de montaje de la isla React) — si ese `dist/` se desplegara tal cual, un visitante real vería ese banner rojo de prueba en la página. Es el hallazgo de "código sin terminar" más claro de todo el repositorio.
- **Placeholders:** solo el banner de depuración de arriba.
- **Navegación:** `SimpleNav`; sin enlace de "volver a Tools" en la propia página.
- **Formularios:** no es un formulario HTML, es un flujo de selección/arrastre de archivo (ver §9/§16-bis).

### Confirmaciones específicas solicitadas

| Elemento | Existe | Evidencia |
|---|---|---|
| `/en` | **No** | Sin ruta `src/pages/en/*`; `content.en` existe en datos pero ningún `.astro` lo importa **[Hecho comprobado]** |
| Página 404 personalizada | **No** | `find src/pages -iname "404*"` → vacío **[Medición real]** |
| Thank-you page | **No** | No existe ninguna ruta de ese tipo; tampoco tendría sentido hoy, dado que los formularios no envían nada |
| Privacy Policy | **No** | Sin ruta ni referencia en el contenido |
| Términos / avisos legales | **No** | Sin ruta ni referencia en el contenido |
| Sitemap | **No** | Sin `sitemap.xml` en `public/`, sin integración `@astrojs/sitemap` en `package.json`/`astro.config.mjs` **[Medición real: `find` + grep sobre `astro.config.mjs`/`package.json`]** |
| `robots.txt` | **No** | `find public -maxdepth 1 -type f` → vacío **[Medición real]** |

**Anchors internos relevantes** (todos dentro de la home, consumidos por `SimpleNav` desde las subpáginas): `#about`, `#projects`, `#services-tools` (wrapper) con `#services`/`#tools` (columnas internas), `#contact`, `#faq`. **Nota de coherencia:** `SimpleNav.astro` enlaza a `#services`/`#tools` (las columnas internas), no a `#services-tools` (el wrapper) — coherente porque son los ids reales dentro de `ServicesToolsSection.astro`, pero es un acoplamiento por cadena de texto sin verificación en tiempo de compilación (ver §22).

**Enlaces externos del sitio** (inventario completo, ver también §13): 2 carpetas de Google Drive (capítulos 03/04 de About), `https://u-tad.com/grados/ingenieria-software`, `https://github.com/chiissuu`, `https://linktr.ee/chiissuu`. Ninguno con apariencia de placeholder (`#`, `example.com`).

---

## 6. Arquitectura de componentes

**[Hecho comprobado]** — inventario completo de los 16 componentes `.astro` + 6 componentes `.tsx` del conversor de vídeo. Fuente: lectura completa de cada archivo por el agente principal (`Layout.astro`, `HeroExperience.astro`, `AboutSection.astro`) y por los subagentes de investigación (resto), con citas línea a línea verificadas.

### Componentes de sección de la home

**`HeroExperience.astro`** (3169 líneas — con diferencia el componente más grande y complejo del proyecto). Responsabilidad: Hero completo + sidebar compacto persistente + nav móvil + toda la orquestación GSAP/ScrollTrigger. Props: `{ t: HeroExperienceContent }`. Consume: `t.hero.*`, `t.nav.*`. Usa `RollLink.astro`. Estilos: enorme bloque `<style>` local (cientos de reglas + ~10 media queries, ver §10/§12). Scripts: un único `<script>` de ~1150 líneas con toda la lógica GSAP. Selectores/ids clave: `#hx-pin`, `.hx-wrap`, `.hx-compact-sidebar`, `data-morph-source`/`data-morph-target`, `data-theme`. Dependencias externas: `gsap`, `gsap/ScrollTrigger`. Consumido solo por `index.astro`. **Riesgo: máximo** (ver §22).

**`AboutSection.astro`** (328 líneas). Responsabilidad: sección "Sobre mí" — intro editorial + 4 capítulos narrativos + Skills + Formación + Idiomas (ver auditoría dedicada en §9). Props: `{ t: AboutSectionContent }`. Usa `SectionHeadingCard`. Sin `<script>`. Consumido solo por `index.astro`. Riesgo: medio (recién modificado y validado; comparte tokens con `Layout.astro`/`HeroExperience.astro` vía `--section-dark-start` y `.section-theme-dark`).

**`ProjectsSection.astro`** (118 líneas). Grid de 3 tarjetas de proyecto (placeholder). Props: `{ t: ProjectsSectionContent }`. `id="projects"` consumido por `SimpleNav`. Riesgo: bajo.

**`ServicesToolsSection.astro`** (191 líneas). Teaser combinado de Servicios+Tools en la home, 2 columnas, expone 3 ids (`services-tools`, `services`, `tools`). Props: `{ t: ServicesToolsSectionContent }`. Lee `t.tools.page.items[0]` directamente para mostrar un ejemplo de herramienta (acoplamiento silencioso, sin fallback más allá de un guard `&&`). Riesgo: medio (los 2 ids internos son el contrato de navegación entre-páginas).

**`ContactSection.astro`** (158 líneas). 3 tarjetas de contacto (LinkedIn deshabilitada con patrón de tooltip accesible, GitHub, Linktree) + texto de cierre + `ContactForm` embebido + fallback `mailto:`. `id="contact"`. Riesgo: medio-alto (envuelve el formulario).

**`FaqSection.astro`** (78 líneas). Acordeón nativo `<details>`/`<summary>`, sin JS. `id="faq"`. **Nota:** `SimpleNav.astro` no incluye un enlace a `#faq` (solo el nav del propio Hero sí lo referencia). Riesgo: bajo.

**`ClosingStatement.astro`** (32 líneas). Texto de cierre + firma. **No se renderiza en ninguna ruta actualmente** (confirmado por ausencia de import en las 4 páginas). Usa tokens de diseño "legacy" (`--color-border`/`--color-text-dim` directamente en vez del sistema `--theme-*`), consistente con predatar el rediseño. Riesgo: nulo al código vivo; deuda de mantenimiento si se reactiva sin actualizar sus tokens.

### Componentes de páginas secundarias

**`SimpleNav.astro`** (68 líneas). Nav sticky minimalista para las 3 subpáginas. Enlaza por texto plano a anclas de la home (`${home}#about`, etc.) — sin verificación en tiempo de compilación de que esos ids existan. Fondo hardcodeado (`rgba(231,232,236,0.86)`) en vez de un token `--color-*`. Se oculta por completo bajo 700px sin alternativa móvil. Consumido por las 3 subpáginas. Riesgo: medio.

**`ServicesPageContent.astro`** (96 líneas) / **`ServicesTeaser.astro`** (54 líneas) — contenido completo de `/servicios/` y el teaser correspondiente embebido en `ServicesToolsSection.astro`. Riesgo: bajo-medio (el primero envuelve `ServicesForm`).

**`ToolsPageContent.astro`** (114 líneas) / **`ToolsTeaser.astro`** (19 líneas) — igual patrón para `/tools/`. Riesgo: bajo.

**`VideoConverterPageContent.astro`** (39 líneas). Envoltorio de la página del conversor; monta `<VideoConverter client:only="react">`. Contiene el hallazgo del párrafo de depuración (§5/§21). Riesgo: bajo salvo por ese hallazgo.

### Componentes/primitivas compartidas

**`SectionHeadingCard.astro`** (56 líneas). El componente más reutilizado del proyecto — **8 puntos de uso en 5 secciones distintas** (`AboutSection` ×4, `ContactSection`, `FaqSection`, `ProjectsSection`, `ServicesToolsSection`). Depende de la clase compartida `.glass-panel` definida en `Layout.astro`. **Riesgo: alto** — cualquier regresión aquí se propaga a las 5 secciones simultáneamente.

**`RollLink.astro`** (64 líneas). Primitiva de link con efecto "rollover" de texto vertical, accesible (`aria-label` + duplicado `aria-hidden`), con `@media (prefers-reduced-motion: reduce)` que desactiva la transición. Único consumidor: `HeroExperience.astro` (2 usos, en su propio nav). Riesgo: bajo-medio (acoplado a un solo componente, pero ese componente es el de mayor visibilidad del sitio).

### Formularios

**`ContactForm.astro`** (118 líneas) y **`ServicesForm.astro`** (137 líneas) — ver auditoría exhaustiva en §16. Ambos siguen el mismo patrón: `novalidate` + validación JS propia (`src/lib/forms/validate.ts`) + envío simulado (`src/lib/forms/submit.ts`).

### Reutilizables vs. específicos

- **Reutilizables:** `SectionHeadingCard.astro` (muy reutilizado), `RollLink.astro` (un solo consumidor pero genérico por diseño), `Layout.astro` (todas las páginas), primitivas CSS compartidas de `Layout.astro` (`.rd-*`, `.glass-panel`, `.section-theme-*`, `.editorial-text`).
- **Específicos de una sola sección/página:** `HeroExperience.astro`, `AboutSection.astro`, `ProjectsSection.astro`, `ServicesToolsSection.astro`, `ContactSection.astro`, `FaqSection.astro`, `ClosingStatement.astro`, `ContactForm.astro`, `ServicesForm.astro`, `ServicesPageContent/Teaser.astro`, `ToolsPageContent/Teaser.astro`, `VideoConverterPageContent.astro`, todo `VideoConverter/*.tsx`.

---

## 7. Auditoría sección por sección (home)

Orden real de render en `index.astro:25-31`: Hero → About → Proyectos → Servicios y Tools → Contacto → FAQ (sin `ClosingStatement`).

### Hero (`#home`, dentro de `HeroExperience.astro`)
- **Objetivo:** presentación inicial + wordmark + título rotatorio + métricas + acceso rápido, con transición de scroll hacia un sidebar compacto persistente.
- **Contenido:** `t.hero.*` — wordmark, `title[]` (3 frases rotadas visualmente, sin JS de rotación automática detectado — es una composición estática de 3 líneas, no un carrusel), `tagline`, `metrics[]` (2), `chips`, `personalNote`, imagen de retrato.
- **HTML/jerarquía de encabezados:** el `<h1>` del sitio vive aquí (no confirmado línea exacta por el subagente, pero es el único componente candidato a llevarlo, ya que `AboutSection` usa `<h2>` para su propio título — **[Inferencia razonable, no confirmada con cita de línea exacta; recomendación: verificar con un grep dedicado a `<h1`**).
- **Layout:** posicionamiento absoluto/fijo complejo (`.hx-pin` pineado por ScrollTrigure durante 1 viewport de scroll), ver §8.
- **Responsive:** el tier más elaborado del proyecto — 10 media queries distintas solo en este archivo (ver tabla completa en §10).
- **Animaciones:** todas — ver inventario exhaustivo en §8.
- **CTAs:** nav propio (vía `RollLink`), acciones del hero (`.hx-actions`).
- **Assets:** `hero-wordmark-gold.png` (2,0 MB), `hero-background-gold.png` (4,5 MB) + variante alternativa (2,3 MB) vía `background-image` CSS, `profile-cutout-alt.png` (144 KB, con comentario `HeroExperience.astro:60-64` que la marca explícitamente como "Placeholder cutout").
- **Estado real:** funcional en código, validado visualmente solo por el usuario en Windows (**[Validación manual comunicada por el usuario]**, no verificado por este agente).
- **Placeholders:** el propio retrato está señalado como placeholder en un comentario del código.
- **Dependencias:** `gsap`, `RollLink.astro`, tokens de `Layout.astro`.
- **Riesgos:** máximos del proyecto — ver §22.
- **Archivos a tocar para un rediseño:** únicamente `HeroExperience.astro` (todo autocontenido), salvo que el rediseño cambie los ids/anclas que otras páginas consumen (`SimpleNav.astro`) o el token `--section-dark-start` compartido con `AboutSection.astro`.

### Sobre mí (`#about`, `AboutSection.astro`) — apartado específico solicitado
Implementado y validado en una tarea anterior de esta misma serie de trabajo; se resume aquí con fines de auditoría, sin volver a modificarlo.
- **Introducción editorial:** un único párrafo por idioma (`about.aboutMe.paragraphs`, 1 elemento), presentado bajo el único `<h2>` de la sección (vía `SectionHeadingCard as="h2"`).
- **Cuatro capítulos:** `about.chapters[]` — "01 Base técnica", "02 Dirección profesional", "03 Visión de producto" (con CTA "Ver archivo de diseño"), "04 Mentalidad e identidad" (2 párrafos, con CTA "Ver trayectoria competitiva"). Cada uno es su propio `<section class="ab-chapter">` con `h3` único (`id="ab-chapter-{n}-heading"`) + `aria-labelledby`, número decorativo `aria-hidden="true"`.
- **Seis párrafos por idioma:** confirmado — 1 (intro) + 1+1+1+2 (capítulos) = 6, verificado en tiempo de ejecución en la tarea anterior.
- **Skills:** grid de 6 grupos (software/web/databases/data/tools/design), ahora con GSAP y n8n añadidos (`icon: null`, sin asset nuevo).
- **Formación:** una tarjeta-enlace única, texto normalizado a "U-TAD".
- **Idiomas:** 3 chips, sin cambios.
- **CTAs:** 2 (capítulos 03 y 04), ambos `target="_blank" rel="noopener noreferrer"`, con `aria-label` explícito distinto del texto visible.
- **Inglés preparado pero no renderizado:** `content.en.about` existe completo y con la misma forma (mismo número de capítulos/párrafos), pero ninguna ruta lo consume — confirmado en §13.
- **Relación geométrica con el sidebar:** `AboutSection` no interactúa directamente con el sidebar del Hero, pero **sí** comparte contrato con `HeroExperience.astro` de dos formas documentadas en ese archivo (ver §8/§22): (1) es la sección `.section-theme-dark` más alta de la página, lo que provoca el degradado de 3 paradas de `Layout.astro` y un ajuste de color de fondo específico en `.hx-wrap` (`HeroExperience.astro:311-351`); (2) su elemento raíz con `id="about"` es observado por el `ScrollTrigger` de sincronización de nav activo del sidebar (`HeroExperience.astro:3110`, `start:"top 45%"`/`end:"bottom 45%"`).
- **Riesgo:** medio — cualquier cambio de altura total de esta sección desplaza la posición del degradado visual documentado en `HeroExperience.astro`, aunque el mecanismo es dinámico (se recalcula solo).

### Proyectos (`#projects`, `ProjectsSection.astro`)
- **Objetivo:** mostrar proyectos destacados — actualmente una plantilla.
- **Contenido:** eyebrow "Proyectos — en construcción", nota que admite explícitamente que son "plantillas visuales... placeholder... sin enlaces definitivos", 3 tarjetas con título "(placeholder)" y `status: "Próximamente"`.
- **HTML:** `<section class="section-theme-warm" id="projects">` con `SectionHeadingCard as="h2"`? — no, el h2 único del sitio ya se documentó en About; aquí `SectionHeadingCard` se usa igualmente pero el `as` por defecto de ese componente es `"h2"` **[Hecho comprobado que el componente lo permite; no confirmado si esta instancia concreta pasa `as="h2"` u otro valor — el subagente no citó ese detalle exacto, se recomienda revisar `ProjectsSection.astro:15` directamente si la jerarquía exacta de encabezados es crítica]**.
- **Layout:** grid de 3 columnas (`.rd-projects-grid`), colapsa responsive (breakpoint compartido con Skills, ver §10).
- **Animaciones:** solo el reveal genérico `.rd-reveal`/`IntersectionObserver` de `Layout.astro` — nada propio.
- **CTAs/enlaces:** ninguno real (sin `href` en `ProjectItem`, por diseño del tipo).
- **Assets:** ninguno — la "imagen" de cada tarjeta es una caja con degradado CSS, no una imagen real.
- **Estado real:** placeholder, honesto sobre serlo.
- **Dependencias:** `SectionHeadingCard`.
- **Riesgos:** bajo técnicamente; alto de producto (es la sección más incompleta cara al usuario final).
- **Archivos a tocar para un rediseño:** solo `ProjectsSection.astro` + `site.js` (contenido) + `content-types.ts` si cambia la forma de `ProjectItem`.

### Servicios y Tools (`#services-tools`, `ServicesToolsSection.astro`)
- **Objetivo:** teaser combinado que dirige a `/servicios/` y `/tools/`.
- **Contenido:** 2 columnas — descripción enriquecida de Servicios (segmentos con `strong` opcional) + CTA; descripción de Tools + 1 ejemplo de herramienta (leído en vivo de `t.tools.page.items[0]`) + CTA.
- **HTML:** `<section class="section-theme-dark" id="services-tools">` con dos `<div id="services">`/`<div id="tools">` internos.
- **Layout:** 2 columnas con separador (`.st-divider`), colapsa en responsive.
- **Animaciones:** solo reveal genérico.
- **CTAs/enlaces:** 2 enlaces internos (`withBase("/servicios/")`, `withBase("/tools/")`).
- **Estado real:** estable, sin placeholders propios (el "ejemplo de herramienta" que muestra es el conversor de vídeo, que sí es real).
- **Dependencias:** `paths.js` (`withBase`), `SectionHeadingCard`, y una lectura directa de `t.tools.page.items[0]` (acoplamiento silencioso con el contenido de Tools).
- **Riesgos:** medio — expone 2 ids (`#services`/`#tools`) consumidos por `SimpleNav.astro` en 3 páginas distintas sin verificación de tipos.

### Contacto (`#contact`, `ContactSection.astro` + `ContactForm.astro`)
- **Objetivo:** ofrecer vías de contacto + formulario.
- **Contenido:** 3 tarjetas (LinkedIn deshabilitada con tooltip accesible, GitHub, Linktree), texto de cierre, formulario, fallback `mailto:`.
- **HTML:** `<section class="section-theme-warm" id="contact">`; patrón de tooltip accesible con `aria-describedby`/`role="tooltip"` en la tarjeta de LinkedIn.
- **Animaciones:** solo reveal genérico; el tooltip es CSS puro (`:hover`/`:focus-visible`).
- **CTAs/enlaces:** GitHub y Linktree con `target="_blank" rel="noopener noreferrer"` correcto; `mailto:` real.
- **Estado real:** contenido estable; **formulario no envía datos** (ver §14).
- **Dependencias:** `ContactForm.astro`, `SectionHeadingCard`.
- **Riesgos:** medio-alto — ver §14/§17.

### FAQ (`#faq`, `FaqSection.astro`)
- **Objetivo:** preguntas frecuentes.
- **Contenido:** 4 pares pregunta/respuesta; **la segunda respuesta es literalmente el texto "Placeholder — se actualizará en cuanto la disponibilidad esté confirmada."**
- **HTML:** acordeón nativo `<details>`/`<summary>`, sin JS.
- **Animaciones:** ninguna propia (ni siquiera el reveal genérico fue confirmado explícitamente por el subagente para este archivo — revisar si `.rd-reveal` se aplica aquí; el resto de secciones sí lo usa).
- **CTAs/enlaces:** ninguno.
- **Estado real:** contenido con un placeholder real y visible al usuario.
- **Dependencias:** `SectionHeadingCard`.
- **Riesgos:** bajo técnicamente; el placeholder de contenido es visible a cualquier visitante.
- **Nota de navegación:** sin enlace desde `SimpleNav.astro` (solo el nav del Hero la referencia).

---

## 8. Inventario de animaciones

**[Hecho comprobado]** — inventario completo construido leyendo secuencialmente las 3169 líneas de `HeroExperience.astro` (único archivo del proyecto con animaciones no triviales, salvo el reveal genérico de `Layout.astro` y transiciones CSS puras en varios componentes). Todo el código vive en un único bloque `gsap.context(...)` (línea 2249) dentro del `<script>` del archivo.

### Comentarios de invariantes citados textualmente (selección)
- `HeroExperience.astro:87-100` — `.hx-pin-fade` es un hijo DOM real, no el `background` de `.hx-pin`, "deliberadamente, ya que ScrollTrigger pinea `.hx-pin` directamente... y su fondo debe permanecer intacto/sin animar".
- `:209-214` — "NO hay intencionalmente un único `data-bg-theme` en este `<aside>`; cada `<article>` sigue y anima su PROPIO `data-theme`... impulsado por solapamiento real de `getBoundingClientRect()` contra cada sección `.section-theme-dark`".
- `:311-351` — documenta un bug ya corregido (franja pálida durante el crossfade dorado↔negro), depende de que `.hx-wrap` tenga `background: var(--section-dark-start)` — el mismo token que usa `AboutSection.astro`.
- `:2606-2628` — advierte explícitamente que `playEntrance()` "está congelada (fuera de alcance tocarla)".
- `:2699-2712` — `anticipatePin: 1` evita un salto de un frame al empezar el pineo; `pinSpacing: false` es deliberado para que `AboutSection` suba en flujo normal debajo del hero fijo.

### Tabla resumen de animaciones/ScrollTriggers

| # | Nombre | Archivo:línea | Trigger/evento | start/end | scrub/pin | Duración/easing | Reversible | `prefers-reduced-motion` |
|---|---|---|---|---|---|---|---|---|
| 1 | Entrada del Hero (`playEntrance`) | `:2375-2528` | Carga de página, tras `document.fonts.ready` | — (no ScrollTrigger) | no scrub, timeline `paused` reproducida una vez | 0,5–0,75s por tween, stagger 0,05–0,08, `ease: power3.out`/`power2.out` | **No** — one-shot; interrupción fuerza-completa, no revierte | **Sí, completo** — se salta enteramente si `prefersReducedMotion` |
| 2 | Blur de retrato en scroll | `:2725-2738` | Parte del timeline maestro (#6) | progreso local 0,00–0,12 | `scrub: 0.35` (heredado) | 0,12 | Sí (scrub) | Sí, vía gate del padre (#6) |
| 3 | Fade de separador de nav | `:2740-2751` | Parte del timeline maestro | 0,10–0,28 | scrub heredado | 0,18 | Sí | Sí, vía padre |
| 4 | Fade-out grupo "sin destino" | `:2758-2764` | Parte del timeline maestro | 0,10–0,40 | scrub heredado | 0,30 | Sí | Sí, vía padre |
| 5 | Morph FLIP hero→sidebar (por par) | `:2588-2661, 2766-2793` | Parte del timeline maestro | travel 0,10–0,60; fade fuente 0,62–0,86 | scrub heredado | 0,5 (travel) / 0,24 (fade) | Sí | Sí, vía padre |
| 6 | **Timeline maestro pin/scroll** (`buildScrollTimeline`) | `:2685-2846` | `ScrollTrigger` sobre `.hx-wrap` | `start:"top top"`, `end:"+=1 viewport"` | `scrub:0.35`, `pin:#hx-pin`, `pinSpacing:false`, `anticipatePin:1`, `invalidateOnRefresh:true` | `ease:"none"` (scrub puro) | Sí (scrub) | Sí — solo se construye si `!prefersReducedMotion && isDesktopViewport()`; si no, se destruye y se limpia todo estado inline |
| 7 | Crossfade fondo dorado→negro | `:2814-2833` | Parte del timeline maestro | 0,75–0,98 | scrub heredado | 0,23 | Sí | Sí, vía padre |
| 8 | Sincronía tema claro/oscuro del sidebar (`checkArticleThemes`) | `:2957-3046` | `ScrollTrigger.create({start:0,end:"max"})`, cada tick de scroll | — | sin pin/scrub propio | tween GSAP de 0,3s, `ease:"power1.out"` | Sí (continuo, bidireccional) | **Parcial** — el trigger corre siempre; solo la duración del tween se pone a 0 bajo reduced-motion (no se salta el cambio de color, solo su transición) |
| 9 | Nav activo del sidebar (`createNavActiveTriggers`) | `:3049-3151` | 6 `ScrollTrigger.create` por sección (`home/about/projects/services-tools/contact/faq`) | `start:"top 45%"`, `end:"bottom 45%"` | sin scrub/pin | — (toggle de clase, no tween) | Sí (`onEnter`/`onEnterBack`) | N/A — no es una animación visual, es toggling de clases; se crea igual en móvil aunque el sidebar esté oculto (ineficiencia menor, no bug) |

### Dependencias geométricas frágiles (invariantes a vigilar)
- `computeMorph()`/`contentRect()` (`:2559-2661`) — miden `getBoundingClientRect()` de cada par `data-morph-source`/`data-morph-target`; una key sin pareja se descarta en silencio (`:2593`).
- `checkArticleThemes()` (#8) — recalcula `getBoundingClientRect()` de **todas** las `.section-theme-dark` de la página en cada tick de scroll; depende de que cualquier sección futura mantenga esa clase.
- `end: () => `+=${window.innerHeight}`` (#6) — función viva reevaluada por ScrollTrigger; cualquier cambio de altura de viewport requiere refresh.
- `fitWordmarkWidth()` (`:2270-2288`) — código semi-muerto: consulta `.hx-wordmark-row`, selector que ya no existe en el marcado actual (el wordmark ahora es un único `<img>`); retorna temprano sin efecto (`:2274`), pero sigue ejecutándose en cada boot/resize — inofensivo pero deuda técnica.

### Listeners globales (fuera de ScrollTrigger)
`scroll` (×2, temporales, para interrupción de la entrada), `resize` (debounced 120ms, reconstruye el timeline maestro **entero** desde cero), `change` en `matchMedia(prefers-reduced-motion)`, `keydown`/`click` del menú móvil, y `astro:before-swap` (`ctx.revert()` — nota: los listeners del menú móvil están declarados **fuera** del `gsap.context` y no se limpian en ese evento).

### Otras animaciones del proyecto (fuera de `HeroExperience.astro`)
- **Reveal genérico `.rd-reveal`/`.rd-in`** (`Layout.astro:38-58`) — `IntersectionObserver` con `threshold:0.15`, aplicado vía clase a la mayoría de secciones/tarjetas (transición CSS `opacity`/`translateY(14px)`, 0,55s). Respeta `prefers-reduced-motion` globalmente vía la regla `@media (prefers-reduced-motion: reduce)` en `Layout.astro:224-233` que anula duraciones a `0.001ms` para `:where(*)`.
- **Hovers/focus CSS puros:** `RollLink.astro` (rollover de texto, con excepción explícita de reduced-motion), tarjetas `.ab-skill-card`/`.ab-formacion-card`/`.rd-project-card` (`translateY` en hover), tooltip de LinkedIn en `ContactSection.astro` (CSS `:hover`/`:focus-visible`), marcadores `+`/`–` del acordeón FAQ.
- **`FaqSection.astro`:** expansión/colapso 100% nativa del navegador (`<details>`), sin JS ni transición.

### `HeroExperience.astro` — archivo de riesgo elevado (marcado explícitamente per instrucción)
No se ha modificado en esta auditoría. Sus invariantes conocidas (repetidas aquí a modo de resumen operativo, detalle completo arriba y en §22): (1) el timeline maestro se reconstruye entero en cada resize, nunca se usa `.invalidate()`; (2) `pinSpacing:false` es deliberado; (3) el color de fondo de `.hx-wrap` debe coincidir con `--section-dark-start` de `AboutSection`; (4) `checkArticleThemes` depende de que toda sección oscura futura conserve la clase `.section-theme-dark`; (5) `playEntrance()` está marcada en el propio código como "fuera de alcance tocar".

---

## 9. Diseño y sistema visual

**[Hecho comprobado]** — leído `Layout.astro` completo (532 líneas), fuente única de todos los tokens globales.

**Tokens de color** (`Layout.astro:118-152`, dentro de `.redesign`): primitivos `--p-black/gray-950/900/800/600/400/200/100/white/gold-700/gold-500/gold-300/pink-500`; semánticos `--color-bg/surface/surface-2/border/text/text-muted/text-dim/accent/accent-soft/accent-2/accent-3`; tokens de marca `--color-brand-gold/brand-gold-strong/ink/paper/line`; y un sistema de tema por sección (`--theme-text/text-muted/border/surface/surface-strong`) que cambia de valor según `.section-theme-warm` (`:266-272`) o `.section-theme-dark` (`:274-282`) — este es el mecanismo central que permite que componentes como `SectionHeadingCard`/`.editorial-text`/`.rd-*` sean "agnósticos de tema" y solo lean `var(--theme-*)`.

**Tipografías:** `--font-display` (Space Grotesk), `--font-wordmark` (Archivo Black), `--font-title` (Inter Tight), `--font-body` (Inter), `--font-mono` (JetBrains Mono) — todas de Google Fonts; `--font-editorial` (PP Neue Montreal Book, autoalojada, con fallback a Inter — ver hallazgo de documentación desactualizada en §5).

**Escalas de tamaño:** tipografía fluida vía `clamp()` en casi todos los tamaños de fuente relevantes (`.rd-title`, `.editorial-text`, `.ab-subheading`, etc.) — no hay una escala tipográfica nombrada/tokenizada (tipo `--text-sm/md/lg`), cada regla define su propio `clamp()` local.

**Espaciados:** también mayormente `clamp()` ad-hoc por componente (`.section-inner` padding `clamp(4.5rem, 8vw, 7rem) clamp(1.25rem, 6vw, 4rem)`) — no hay una escala de espaciado tokenizada tipo `--space-1/2/3`.

**Radios/bordes/sombras:** valores hardcodeados por componente (`border-radius: 8px/10px/12px/999px` según el elemento), sin token compartido de radio. Sombra compartida solo en `.glass-panel` (`box-shadow: 0 6px 24px rgba(8,9,11,0.1)`, `Layout.astro:341`).

**Fondos/gradientes:** `--section-dark-start/center/end` (3 paradas, `Layout.astro:185-187`) alimentan el único degradado del sitio (`.section-theme-dark`, `:274-282`) — comentado explícitamente como "valores provisionales, centralizados aquí para un único cambio cuando se dé una imagen de referencia final" (`:181-183`).

**Sistema de tarjetas:** `.glass-panel` (`:336-345`) es la única definición compartida de "cristal opaco" (fondo translúcido + `backdrop-filter: blur(10px)` + borde + sombra); reutilizada por `SectionHeadingCard` y, según su propio comentario, pensada para las tarjetas de métricas/chips del Hero y los artículos del sidebar también.

**Contenedores/anchuras máximas:** `--container: 1240px` (`:188`), usado por `.section-inner` (secciones redesign) y `.rd-section` (subpáginas) — dos contenedores con el mismo `max-width` pero implementados como reglas separadas (duplicación menor, ver más abajo).

**Relación del contenido con el sidebar:** `body.redesign-home .section-inner` (`:317-320`, min-width 900px) desplaza el inicio del contenido con `margin-inline-start: calc(var(--hx-sidebar-width) + var(--sidebar-content-gap))` — fuente única de verdad compartida con `--hx-sidebar-width` que `HeroExperience.astro` también lee desde `<body>`. Documentado extensamente en el propio archivo (`:196-224`) como el mecanismo que evita que el ancho del sidebar y el hueco reservado para él diverjan.

**Breakpoints globales de `Layout.astro`:** un único breakpoint de ancho, `(min-width: 900px)` (`:317`), usado para activar la compensación de sidebar. La inmensa mayoría de los demás breakpoints del proyecto viven dentro de `HeroExperience.astro` (ver tabla en §10).

**Temas claro/oscuro:** el proyecto no tiene un modo claro/oscuro de sistema operativo (`prefers-color-scheme`) — "claro/oscuro" aquí se refiere exclusivamente al sistema de temas por sección (`.section-theme-warm`/`.section-theme-dark`), que es un tema de **diseño editorial fijo por sección**, no una preferencia de usuario.

**Clases compartidas vs. locales:** compartidas y globales (`Layout.astro`, `<style is:global>`): `.section-theme-warm/dark`, `.section-inner`, `.glass-panel`, `.editorial-text(-muted)`, `.rd-section/eyebrow/title/note/btn(-primary/-ghost)/reveal(.rd-in)/form*`. Locales (scoped por Astro, un archivo cada una): prácticamente todo lo demás — cada componente define su propio prefijo (`.ab-*` en About, `.hx-*` en Hero, `.st-*` en ServicesTools, `.ct-*` en Contact, `.rd-project-*`/`.rd-faq-*` en Proyectos/FAQ — estos últimos dos reutilizan el prefijo `rd-` de las utilidades globales, lo cual es una convención de nombres compartida pero no clases compartidas reales).

### Inconsistencias/riesgos identificados
- **Duplicación de contenedor:** `.section-inner` (redesign) y `.rd-section` (subpáginas) definen el mismo `max-width: var(--container)` + padding casi idéntico como dos reglas separadas en vez de una sola — **[Recomendación]** unificar si se retoma el sistema de diseño.
- **`SimpleNav.astro`** usa un color de fondo hardcodeado (`rgba(231,232,236,0.86)`) en vez de un token `--color-*`/`--theme-*` — el único componente del proyecto con un color "roto" del sistema de tokens.
- **Regla global de alto riesgo:** cualquier cambio a `.section-theme-dark`/`.section-theme-warm` o a `--section-dark-*` en `Layout.astro` repinta simultáneamente Hero (fondo `.hx-wrap`), About, Servicios y Tools (home) y FAQ — 4 componentes distintos dependen del mismo valor.
- **`SectionHeadingCard.astro`** es el componente que más depende de un token global compartido (`.glass-panel`) fuera de su propio archivo — ya señalado como de riesgo alto en §6.
- **Elementos que no deberían modificarse desde una sola sección [Recomendación]:** `--container`, `--section-dark-*`, `--hx-sidebar-width`/`--sidebar-content-gap`, `.section-theme-*`, `.glass-panel` — todos viven en `Layout.astro` y afectan a más de un componente; un cambio "solo para About" o "solo para Contacto" en cualquiera de estos tokens rompería silenciosamente otras secciones.

---

## 10. Responsive

**[Hecho comprobado]** — extracción completa de cada `@media` real del proyecto (ancho y alto). La inmensa mayoría vive en `HeroExperience.astro`; el resto en `Layout.astro` y componentes individuales.

| Archivo | Media query | Componentes afectados | Comportamiento | Motivo aparente |
|---|---|---|---|---|
| `Layout.astro:317` | `(min-width: 900px)` | `.section-inner` (todas las secciones redesign de la home) | Desplaza el contenido para dejar hueco al sidebar fijo | Compensación de sidebar |
| `Layout.astro:474` | `(max-width: 700px)` | `.rd-form-grid` (ContactForm/ServicesForm) | Colapsa el grid de 2 columnas del formulario a 1 | Formularios en móvil |
| `HeroExperience.astro:1388` | `(min-width: 900px) and (max-width: 1599px)` | Wordmark, título, métricas, chip, retrato | Tier tablet/escritorio pequeño — recorte de retrato "torso arriba" | Ajuste de composición por rango de ancho |
| `HeroExperience.astro:1446` | `(min-width: 1600px)` | Retrato, título | Recorte de retrato "protagonista" más grande, tipografía mayor | Pantallas grandes |
| `HeroExperience.astro:1469` | `(max-height: 950px) and (min-width: 900px)` | `.hx-compact-sidebar` y sus hijos | Compactación de sidebar, paso 1 | **Tier de escritorio de poca altura** (evitar overflow) |
| `HeroExperience.astro:1503` | `(min-width: 900px) and (max-height: 850px)` | `.hx-compact-sidebar` y sus hijos | Compactación de sidebar, paso 2 (más agresivo) | Medido explícitamente contra 1280×720 real (según comentario del código) |
| `HeroExperience.astro:1546` | `(min-width: 900px)` | `--hx-metrics-offset`/`--hx-traits-offset`, métricas, nota personal, tagline, chip | Composición estática de escritorio | Layout base de escritorio |
| `HeroExperience.astro:1671` | `(min-width: 900px) and (max-width: 1399px)` | Mismas custom properties que el bloque anterior + título | Corrección de colisión en escritorio estrecho (1280×720, 1366×768) | **Debe ir después del bloque 1546 por cascada** — advertencia explícita en el código |
| `HeroExperience.astro:1700` | `(min-width: 641px) and (max-width: 899px)` | Wordmark, retrato (rutas normal y `.hx-static`) | Tier tablet-vertical pequeño | Corrección medida en navegador real, según comentario |
| `HeroExperience.astro:1729` | `(max-width: 899px)` | `.hx-nav`/`.hx-compact-sidebar` (ocultos), `.hx-mobile-toggle`/`.hx-mobile-nav` (mostrados) | **Sidebar oculto por completo en móvil**; aparece el menú hamburguesa | Tier móvil |
| `HeroExperience.astro:1849` | `(max-width: 899px) and (prefers-reduced-motion: no-preference)` | Menú móvil | Solo las transiciones/animaciones del menú (no su estado abierto/cerrado) | Respeto a reduced-motion sin duplicar reglas de layout |
| `HeroExperience.astro:1920` | `(max-width: 640px)` | Título, aside derecho, tagline, acciones, nota personal | Ajustes finos de layout móvil (según comentario, portada/retrato quedan explícitamente fuera de este ajuste) | Móvil estrecho |

**Sidebar oculto/visible:** visible y fijo desde 900px (con 2 niveles de compactación adicionales por altura, 950px y 850px); completamente `display:none` por debajo de 900px, sustituido por un menú hamburguesa a pantalla completa.

**Tier de escritorio de poca altura:** cubierto explícitamente por dos breakpoints (`max-height:950px`/`max-height:850px`, ambos `min-width:900px`) — un caso de diseño deliberadamente atendido, no accidental.

**Grids:** `.ab-skills-grid`/`.ab-chapter` (About) y `.rd-form-grid` (formularios) colapsan a 1 columna bajo 900px/700px respectivamente. No se detectó ningún otro grid con breakpoint propio fuera de estos.

**Tipografía fluida:** generalizada vía `clamp()` (ver §9) — no depende de breakpoints discretos salvo en los ajustes puntuales de `HeroExperience.astro` señalados en la tabla.

**Navegación móvil:** solo existe una implementación real de menú móvil, la de `HeroExperience.astro` (home). **`SimpleNav.astro`, usado en las 3 subpáginas, no tiene ninguna alternativa móvil** — su regla `@media (max-width: 700px) { .rd-simple-nav-links { display: none; } }` **[Hecho comprobado según el subagente 2]** oculta los enlaces sin ofrecer ningún menú hamburguesa sustituto, dejando esas 3 subpáginas sin navegación utilizable por debajo de 700px salvo el logo/enlace a home. **Esto es un hallazgo real de UX/accesibilidad, no una inferencia.**

**Formularios:** `.rd-form-grid` colapsa a 1 columna bajo 700px (única adaptación responsive específica de formularios).

**Imágenes:** sin `srcset`/`sizes` en ningún punto del proyecto (no se usa `astro:assets`) — las imágenes pesadas del Hero se sirven al mismo tamaño de archivo en todos los viewports (ver §16).

**Overflow:** no se detectó ninguna regla `overflow-x`/`overflow: hidden` sospechosa fuera de lo esperable en los archivos auditados; no se pudo verificar overflow horizontal real en navegador (ver limitación abajo).

**[No verificable en este entorno]** No se puede afirmar que ningún viewport concreto "funciona" visualmente — no se pudo ejecutar `astro dev`/`build` en este entorno cloud (ver §5). El usuario ha comunicado que validó visualmente el nuevo About en su navegador real de Windows tras la tarea anterior — se registra como **[Validación manual comunicada por el usuario]**, no como algo comprobado por este agente, y no se extiende esa validación a ninguna otra sección del sitio.

---

## 11. Contenido e idiomas

**[Hecho comprobado]** — `src/content/site.js` (898 líneas) leído completo; `src/lib/content-types.ts` (527 líneas) leído completo.

**Fuente central del contenido:** un único archivo, `src/content/site.js`, objeto plano JavaScript (no TypeScript) con dos claves raíz `es`/`en`, exportado como `content`. **Forma de los tipos:** tipada externamente por `src/lib/content-types.ts` — `SiteContent` compone 12 interfaces de sección (`seo, nav, hero, about, projects, services, tools, servicesTools, contact, faq, closing, videoConverter`), y `LocalizedSiteContent = { es: SiteContent; en: SiteContent }` exige que **ambos** locales cumplan la **misma** forma completa (sin `Partial<>`).

**Contenido español:** completo en las 12 secciones, es el único que se renderiza en producción.

**Contenido inglés:** completo en 11 de 12 secciones. **Diferencia estructural real encontrada:** `content.en.hero` **no tiene la clave `personalNote`**, que `content.es.hero` sí tiene y que `HeroContent.personalNote` (`content-types.ts:84`) declara **obligatoria** (sin `?`). **[Inferencia, no verificada con `tsc` real por estar `astro check` roto en este entorno, pero es una comparación manual directa de ambos objetos línea por línea]** — si `content.en` se asignara alguna vez a `SiteContent`/`HeroContent`, esto fallaría la compilación. Hoy es inofensivo porque ninguna página consume `content.en` (confirmado por grep: solo `content.es` se importa en las 4 páginas).

**Rutas que renderizan cada idioma:** solo español, en las 4 rutas existentes (`const t = content.es` en cada `.astro` de página). Ninguna ruta renderiza `content.en`.

**Textos duplicados/no traducidos deliberadamente:** `seo.title`, `hero.displayWordmark` ("CHISU"), `hero.siteName` ("CHIISSUU"), `hero.sidebarMark` ("CHISU®") son idénticos en ambos locales — nombres propios/marca, no un error de traducción.

**Placeholders de contenido (listado consolidado, con ubicación exacta):**
- `projects.eyebrow` = "Proyectos — en construcción" + los 3 `projects.items[].title` contienen literalmente "(placeholder)" + `note` que lo admite explícitamente (`site.js` ~179-210, y su equivalente en `en` ~623-650).
- `faq.items[1].a` = "Placeholder — se actualizará en cuanto la disponibilidad esté confirmada." (es, ~línea 374) y su equivalente en inglés (~812) — **texto de cara al usuario, no un comentario interno**.
- `tools.page.items[1]` (Instagram unfollowers checker) — `status: "En desarrollo"`, sin `href`, con texto propio que dice "La lógica y el script se conectarán próximamente".
- `contact.form.submitSuccess` y `services.page.form.submitSuccess` — ambos admiten en su propio texto que el envío real "se conectará próximamente" (ver detalle en §14).
- `hero.imageAlt` — tanto es como en califican el retrato como "provisional"/"Temporary" en el propio `alt`.

**Enlaces externos (inventario completo del archivo, ambos locales incluyen los mismos):** 2 carpetas de Google Drive (About, capítulos 03/04), `https://u-tad.com/grados/ingenieria-software`, `https://github.com/chiissuu`, `https://linktr.ee/chiissuu`. Ninguno con apariencia de placeholder (`#`/`example.com`).

**Contenido potencialmente desactualizado:** cifras/fechas hardcodeadas que envejecerán con el tiempo — "En septiembre de 2026 comenzaré mi tercer curso" (About, ya conocido de la tarea anterior), y **nuevo hallazgo de esta auditoría**: `hero.metrics` = `[{value:"2+", label:"años..."}, {value:"10+", label:"proyectos..."}]` — mismo tipo de riesgo de obsolescencia, en una sección distinta (Hero) no cubierta por la auditoría anterior de About.

**Nombres/marcas cuya capitalización debe mantenerse:** "chiissuu" (minúscula, usada en `seo.title`, URLs de GitHub/Linktree, firma de cierre), "CHIISSUU" (mayúscula, `hero.siteName`), "CHISU"/"CHISU®" (`hero.displayWordmark`/`sidebarMark`) — las tres variantes son **intencionadas y documentadas en un comentario del propio archivo** como wordmarks estilizados distintos, no una inconsistencia de tecleo — a diferencia de "U-TAD", que sí fue corregida en la tarea anterior por ser el nombre de un tercero citado literalmente (no un wordmark propio con variantes de marca).

**Sistema necesario para publicar el inglés en el futuro [Recomendación, no implementado hoy]:** haría falta, como mínimo: (1) completar `content.en.hero.personalNote` para que `content.en` cumpla `SiteContent` en TypeScript real; (2) crear rutas `/en/`, `/en/servicios/`, etc. (o un enrutamiento basado en `astro:i18n`, no usado actualmente); (3) un selector de idioma en la UI (no existe ninguno hoy — ni siquiera un enlace oculto); (4) decidir la estrategia de `hreflang`/SEO bilingüe (inexistente hoy, ver §13).

No se ha reescrito ningún texto de contenido como parte de esta auditoría.

---

## 12. Accesibilidad

**[Hecho comprobado]** salvo donde se indique lo contrario. Auditoría estática de código; sin lector de pantalla ni navegador real disponibles en este entorno.

**Jerarquía de encabezados (home, `/`):** 1× `<h1>` real (`HeroExperience.astro:159`, `.hx-title-block`) → 5× `<h2>` vía `SectionHeadingCard as="h2" size="lg"` (uno por sección: About `AboutSection.astro:19`, Proyectos `ProjectsSection.astro:15`, Servicios y Tools `ServicesToolsSection.astro:18`, Contacto `ContactSection.astro:17`, FAQ `FaqSection.astro:15`) → `<h3>` de subsección/tarjeta (About: Skills/Formación/Idiomas ×3 vía `SectionHeadingCard as="h3"`, más 4 capítulos con id dinámico; Proyectos: 1 por tarjeta, `ProjectsSection.astro:25`) → 1× `<h4>` anidado (`ServicesToolsSection.astro:46`, título del ejemplo de herramienta). Estructura limpia y sin saltos de nivel detectados en la home.

**Subpáginas:** cada una tiene su propio `<h1 class="rd-title">` (`ServicesPageContent.astro:16`, `ToolsPageContent.astro:16`, `VideoConverterPageContent.astro:19`) — patrón correcto para páginas independientes. **Posible salto de nivel a revisar [Riesgo, no confirmado como defecto]:** `ServicesForm.astro:22` tiene un `<h3 class="rd-form-title">` dentro de `/servicios/`; no se confirmó con cita exacta si existe un `<h2>` intermedio en `ServicesPageContent.astro` entre el `<h1>` y ese `<h3>` — recomendado revisar directamente antes de dar por buena o mala la jerarquía de esa página concreta.

**Landmarks:** uso de `<section>` semántico en todas las secciones de home y en los capítulos de About (cada uno con `aria-labelledby` propio); `<main class="home-main">` envuelve las 5 secciones de contenido de la home (`index.astro:26`); `<nav>` no confirmado explícitamente por los subagentes en `HeroExperience.astro`/`SimpleNav.astro` con esa etiqueta exacta — **[No verificado con cita de línea exacta, recomendado confirmar con grep dedicado a `<nav`]**.

**`lang`:** `Layout.astro:20` — `<html lang={lang}>`, con `lang="es"` pasado explícitamente por las 4 páginas reales. Correcto y consistente (nunca se pasa `lang="en"` en ningún punto, coherente con que no existe ruta en inglés).

**`aria-label`/`aria-labelledby`:** uso extenso y consistente — cada `<section>` de contenido tiene `aria-labelledby` apuntando a su propio heading (`id="ab-skills-heading"`, `id="ab-formacion-heading"`, etc., y los 4 `id="ab-chapter-{n}-heading"` de About); los CTAs externos de About llevan `aria-label` explícito distinto del texto visible (p. ej. "Ver archivo de diseño; se abre en una pestaña nueva"); `RollLink.astro` usa `aria-label={label}` sobre el enlace real y `aria-hidden="true"` sobre su duplicado visual.

**`aria-current`:** usado en el sistema de nav-activo del sidebar del Hero (`setActiveSections`, `HeroExperience.astro:3081-3100`) — `aria-current="location"` se aplica solo a enlaces de ancla de la propia página, deliberadamente omitido para Servicios/Tools (que apuntan a subpáginas reales) según el comentario del propio código.

**Alt de imágenes:** `t.hero.imageAlt` se usa como `alt` del retrato (`HeroExperience.astro:155`) y describe el retrato como "provisional" (coherente con el hallazgo de placeholder de §11). El wordmark (`<img loading="eager">`, `:117-123`) — no se confirmó el valor exacto de su `alt` por los subagentes; recomendado verificar que no quede vacío/decorativo por error, dado que es contenido de marca, no puramente decorativo. Iconos de skills en About: `{icon && <img ... alt="" aria-hidden="true" />}` (`AboutSection.astro:69`, confirmado por el subagente 1) — **correcto**, son decorativos y el nombre del skill ya está en texto visible adyacente.

**Elementos decorativos:** consistentemente marcados `aria-hidden="true"` — números de capítulo de About, flechas de `ContactSection`/`ServicesToolsSection`, icono de flecha de Formación, iconos de skills.

**Navegación por teclado / focus visible:** `:focus-visible` usado de forma consistente en CTAs/tarjetas/enlaces (`.ab-cta-btn`, `.ab-formacion-card`, `RollLink`, campos de formulario en `Layout.astro:490-494`). El menú móvil del Hero implementa un trap de foco real con `Tab`/`Escape` (`HeroExperience.astro:2151`, `handleMenuKeydown`). El conversor de vídeo es totalmente operable por teclado a través del `<label>`/`<input type="file">` oculto-pero-enfocable (confirmado por el subagente 3, con anillo de foco visible en CSS) aunque la zona de arrastre en sí no es interactiva por teclado (inherente al drag-and-drop, no un defecto).

**Contraste:** **[No verificable en este entorno]** — no se pudo calcular contraste real (requiere renderizado). Los tokens de color sugieren buen contraste por diseño (texto casi negro sobre fondo cálido claro, texto casi blanco sobre fondo oscuro) pero esto es una observación de los valores hex, no una medición de contraste real **[Inferencia]**.

**Enlaces que abren pestañas nuevas:** 6 usos de `target="_blank"` en todo el proyecto, **los 6 con `rel="noopener noreferrer"` presente** (`AboutSection.astro:48-49,85-86`; `ContactSection.astro:33,38`; `HeroExperience.astro:284-285`) — sin hallazgos de "tabnabbing" en ningún punto.

**Formularios y labels:** ambos formularios (`ContactForm`, `ServicesForm`) tienen `<label>` real para cada campo, `novalidate` (validación custom vía `validate.ts`), estado de error por campo con `data-invalid="true"` (dispara el borde rojo compartido de `Layout.astro:495-499`), y una región de estado accesible correcta: `<p role="status" aria-live="polite">` para el mensaje de éxito/error/carga.

**Mensajes de error:** genéricos por campo (`data-invalid`, sin texto de error específico por campo más allá del borde rojo) — **[Recomendación]** añadir texto de error específico asociado vía `aria-describedby` mejoraría la experiencia con lector de pantalla, hoy solo hay una señal visual (borde) + un mensaje global de estado, no un mensaje por campo.

**Reduced motion — tratamiento consolidado (cruce de hallazgos de §8/§9):**
- **Completo (se salta la animación entera):** entrada del Hero (`playEntrance`), timeline maestro de scroll/morph (`buildScrollTimeline`), transiciones del menú móvil (bloque `@media (max-width: 899px) and (prefers-reduced-motion: no-preference)`), y la regla global de `Layout.astro:224-233` que anula duraciones a 0 para `:where(*)`.
- **Parcial (la animación sigue ejecutándose, solo se acorta su duración):** sincronía de tema del sidebar (`checkArticleThemes`, #8 en §8) — el cambio de color sigue "animándose" con GSAP a duración 0 en vez de aplicarse instantáneamente por CSS o quedar completamente fuera del sistema de animación. Es una implementación válida (el resultado visual final es instantáneo) pero **arquitectónicamente distinta** del resto — vale la pena unificarla si se retoma este archivo.
- `RollLink.astro` tiene su propia regla `@media (prefers-reduced-motion: reduce)` local que desactiva su transición — correcto y redundante-mente seguro con la regla global.

**Orden de lectura / elementos ocultos:** no se detectaron casos de contenido reordenado visualmente por CSS de forma que contradiga el orden DOM (`order`, `flex-direction: row-reverse` con contenido semánticamente importante, etc.) en los archivos auditados — **[Inferencia por ausencia, no una revisión exhaustiva dedicada de cada regla `order`/`flex-direction`]**.

**Botones vs. enlaces:** uso correcto observado — `<a>` para navegación (incluida la tarjeta de LinkedIn deshabilitada, que usa `aria-disabled="true"` + `tabindex="0"` en vez de quitarla del DOM, patrón de tooltip accesible correcto), `<button>` para acciones (envío de formulario, submit).

**Tamaños mínimos de interacción:** `Layout.astro:395,489` define `min-height: 46px` para `.rd-btn`/campos de formulario — cumple holgadamente la recomendación habitual de ≥44px de WCAG 2.5.5 (AAA)/Target Size. No se verificó el ancho mínimo de cada control individualmente.

**Clasificación de hallazgos de esta sección:**

| Hallazgo | Clasificación |
|---|---|
| Jerarquía de encabezados de la home (h1→h2×5→h3/h4) | Sin defecto — estructura correcta |
| Posible salto h1→h3 en `/servicios/` (`ServicesForm.astro:22`) | Riesgo (a confirmar) |
| `SimpleNav.astro` sin alternativa de navegación móvil bajo 700px | **Defecto demostrado** (código leído directamente, §10) |
| Ausencia de texto de error específico por campo en formularios | Recomendación |
| Contraste de color real | No verificable sin navegador real |
| Tratamiento "parcial" de reduced-motion en `checkArticleThemes` | Riesgo/recomendación de unificación, no un defecto de accesibilidad en sí (el resultado final respeta la preferencia) |
| Zona de arrastre del conversor de vídeo sin rol/anuncio de estado de arrastre | Recomendación (el control real ya es accesible por otra vía) |
| Todo lo demás auditado (alt, aria-*, rel=noopener, focus-visible, labels, `role="status"`) | Sin defecto demostrado |

---

## 13. SEO y preparación para lanzamiento

**[Hecho comprobado + Medición real]** — combinación de lectura de `Layout.astro` (único `<head>` del proyecto) y búsquedas exhaustivas (`grep -rn`) sobre todo el repositorio, excluyendo `node_modules`/`.git`/`dist`.

| Punto | Estado | Archivo/evidencia | Impacto | Recomendación | Prioridad |
|---|---|---|---|---|---|
| Custom 404 page | **Ausente** | `find src/pages -iname "404*"` → vacío | Usuario ve el 404 genérico del hosting | Añadir `src/pages/404.astro` | P2 |
| CTA above the fold | **Presente** | Hero tiene `.hx-actions`/nav visibles sin scroll | — | — | — |
| Internal links | **Presente** | Nav del Hero + `SimpleNav` + CTAs cruzados (`/servicios/`, `/tools/`) | — | — | — |
| Thank-you page | **No aplicable** | Los formularios no envían datos realmente (§14) — no tiene sentido hasta que exista backend | — | Añadir junto con el backend real | P3 (ligado a P1 de formularios) |
| Breadcrumbs | **Ausente** | No encontrado en ningún componente | Bajo impacto — sitio de 4 rutas, jerarquía plana | No prioritario para un portfolio de este tamaño | P3 |
| Case studies | **Ausente** | Proyectos es placeholder (§7/§11) | Alto impacto para credibilidad profesional | Completar sección Proyectos | P1 |
| Al menos 5 FAQs | **Parcial** | Solo 4 ítems, uno de ellos placeholder (§11) | Bajo | Completar el placeholder y valorar añadir una 5ª | P2 |
| Promesa de tiempo de respuesta | **Ausente** | No encontrada en `contact`/`services` content | Bajo-medio para conversión | Añadir si se conecta backend real | P3 |
| Sticky mobile CTA | **Ausente** (y `SimpleNav` ni siquiera tiene nav móvil, §10/§12) | — | Medio en subpáginas móviles | Evaluar si aplica al formato portfolio | P3 |
| `robots.txt` | **Ausente** | `find public` → vacío | Sin control explícito de crawling | Añadir uno mínimo | P2 |
| Títulos únicos por página | **Presente** | Cada página construye `${page.title} | ${seo.title}` (§7) | — | — | — |
| Meta descriptions | **Parcial** | Solo `seo.description` global + descripciones específicas de `/servicios/`, `/tools/`, `/tools/video-converter/` vía `intro`; la home reutiliza la misma `seo.description` para todo | Medio | Meta description específica por página si se prioriza SEO | P2 |
| Open Graph / imagen social | **Ausente** | Cero coincidencias `<meta property="og:` en todo el repo | Alto para compartir en redes | Añadir OG tags + imagen | P1 |
| Canonical URLs | **Ausente** | Cero coincidencias `rel="canonical"` | Medio | Añadir, junto con `site` en `astro.config.mjs` | P2 |
| Sitemap | **Ausente** | Sin `sitemap.xml`, sin integración `@astrojs/sitemap` | Medio | Añadir integración oficial de Astro | P2 |
| Maps and directions | **No aplicable** | Portfolio personal, no negocio local con ubicación física — **este ítem parece orientado a una web comercial local, no a este proyecto** | — | No aplicable | — |
| Reseñas reales | **No aplicable** | Portfolio personal — no es un servicio con reseñas de clientes verificables hoy | — | No aplicable a menos que se posicione como agencia | — |
| Alt text en imágenes | **Parcial** | Presente y correcto donde se verificó (retrato, iconos decorativos); wordmark no verificado con cita exacta (§12) | Bajo-medio | Confirmar/completar | P3 |
| Local business schema | **No aplicable** | No es un negocio local | — | No aplicable | — |
| Person schema (JSON-LD) | **Ausente** | Cero coincidencias `application/ld+json` en todo el repo | Medio — encajaría bien en un portfolio personal | Añadir `Person` schema | P2 |
| WebSite schema | **Ausente** | Igual que arriba | Bajo | Opcional | P3 |
| Privacy Policy | **Ausente** | Sin ruta ni referencia (§7) | Medio-alto si se activa un backend real de formularios que recoja datos personales | Añadir antes de activar cualquier backend real | P1 (condicionado) |
| Cookie management | **No aplicable hoy** | Sin analítica ni cookies de terceros detectadas (§15) | — | Revisar si se añade analítica en el futuro | — |
| Google Analytics | **Ausente** | Cero coincidencias de scripts de analítica de ningún proveedor | — | Decisión de producto, no un defecto | — |
| Team photo | **No aplicable** | Portfolio individual, no un equipo | — | No aplicable | — |
| Favicon | **Parcial** | `Layout.astro:29` enlaza `logo-chiissuu.png` (60 KB) como único `rel="icon"` — sin `favicon.ico` clásico ni tamaños múltiples (16×16/32×32/apple-touch-icon) | Bajo | Generar set completo de favicons | P3 |
| Manifest (PWA) | **Ausente** | Sin `site.webmanifest`/`manifest.json` en `public/` | Bajo — no es una PWA | No prioritario salvo que se busque instalabilidad | P3 |
| Enlaces rotos deducibles desde el repositorio | **Ninguno encontrado** | Todos los `href` externos e internos revisados apuntan a destinos con apariencia real (§11); los únicos "enlaces ausentes" (Proyectos, Instagram checker) son placeholders honestos sin `href`, no enlaces rotos | — | — | — |
| Página de contacto | **Presente** (aunque el envío es simulado) | `ContactSection`/`ContactForm` en home, `ServicesForm` en `/servicios/` | Ver §14 | Conectar backend real | P1 |
| Información del dominio | **No verificable en este entorno** | `astro.config.mjs` no define `site` (§3/§5); no hay evidencia en el repo de qué dominio se usará | — | Definir `site` cuando el hosting final esté decidido (nota ya presente en el propio comentario de `astro.config.mjs`) | P2 |

**Nota general:** buena parte de la checklist estándar de "preparación SEO para lanzamiento" (maps/directions, reseñas, local business schema, team photo, sticky mobile CTA agresivo) está pensada para una web comercial local, no para un portfolio personal — se han marcado explícitamente como "No aplicable" en vez de tratarlas como carencias, tal como pide la instrucción de esta auditoría.

---

## 14. Formularios y backend

**[Hecho comprobado]** — los dos formularios del sitio, más `src/lib/forms/{types,validate,submit}.ts` completos.

**No existe backend en este proyecto.** `find src/pages -type f` devuelve únicamente 4 archivos `.astro`; no hay `src/pages/api/`, ningún endpoint `.ts`/`.js` bajo `pages/`, ninguna función serverless (`netlify/functions`, etc.), y `astro.config.mjs` no define `output`/`adapter` — Astro genera un sitio 100% estático. **Un backend real es hoy estructuralmente imposible con la configuración actual**, no simplemente "no implementado".

### `ContactForm.astro` (home)
| Campo | Tipo | Requerido (HTML) | Requerido (JS) |
|---|---|---|---|
| `name` | text | sí | sí |
| `email` | email | sí | sí (vía `validateEmail`) |
| `reason` (select: Colaboración/Proyecto/Pregunta general/Otro) | select | sí | sí |
| `subject` | text | sí | sí |
| `message` | textarea | sí | sí |
| `preferredResponse` (Email/Cualquiera) | select | sí | sí |

### `ServicesForm.astro` (`/servicios/`)
| Campo | Tipo | Requerido (HTML) | Requerido (JS) |
|---|---|---|---|
| `name` | text | sí | sí |
| `email` | email | sí | sí |
| `company` | text | no | no |
| `serviceType` (select, 4 opciones) | select | sí | sí |
| `budget` | text | no | no |
| `timeline` | text | no | no |
| `problem` | textarea | sí | sí |
| `message` | textarea | no | no |

**Validación cliente:** real y funcional, `src/lib/forms/validate.ts` (52 líneas, leído completo) — `requireField` genérico + `validateEmail` con regex `^[^\s@]+@[^\s@]+\.[^\s@]+$` (sanity check razonable, no RFC-5322 completo). `novalidate` en ambos `<form>` desactiva deliberadamente la validación nativa del navegador para que esta lógica custom sea la única puerta.

**Validación servidor:** **no existe** (no hay servidor).

**Endpoint / método:** ninguno. `src/lib/forms/submit.ts` (12 líneas, contenido completo):
```ts
export async function submitFormPlaceholder<T extends Record<string, string>>(
  _data: T
): Promise<SubmitResult> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return { ok: true };
}
```
El propio comentario del archivo dice: *"Placeholder submit — no backend/service is wired up yet (no Formspree/EmailJS/Getform). Swap the body of this function for a real request once a backend is chosen."* No hay `fetch`/`XMLHttpRequest`/ninguna llamada de red — los datos (`_data`, parámetro sin usar) se descartan por completo. **Los datos introducidos por el usuario nunca se envían ni se almacenan en ningún sitio.**

**Gestión de errores / estado de éxito:** genuina, no es una simulación instantánea — ambos formularios implementan una máquina de estados real (`idle → loading → success/error`) con `await` real sobre la promesa de 500ms, actualizando `data-status` (que dispara el CSS compartido `.rd-form[data-status="..."]` de `Layout.astro`) y un `<p role="status" aria-live="polite">`. Es decir: la UX de carga/éxito es real, pero **lo que hay detrás es un stub que siempre devuelve éxito**, sin importar los datos introducidos.

**Transparencia con el usuario:** el propio texto que ve el usuario al "enviar" ya lo admite — `submitSuccess`: *"Formulario preparado. El envío real se conectará próximamente."* (ambos formularios, ambos idiomas) — el sitio no engaña activamente sobre esto en su copy, pero un usuario que no lea con atención puede creer que el mensaje se envió.

**Protección antispam:** **ausente** — sin honeypot, sin CAPTCHA/hCaptcha/reCAPTCHA/Turnstile (cero coincidencias en un grep dedicado sobre todo `src/`).

**CSRF:** **ausente** — no aplica hoy (no hay servidor que proteger), pero tampoco hay ningún campo/token preparado para cuando lo haya.

**Rate limiting:** **ausente** — imposible de todos modos sin backend.

**Almacenamiento:** **ninguno** — no se persiste nada, ni local (`localStorage`) ni remoto.

**Datos personales recogidos:** en el estado actual, **ninguno realmente se recoge/almacena** (se descartan). Si se conectara un backend real, `ContactForm` recogería nombre, email, motivo, asunto, mensaje y método de respuesta preferido; `ServicesForm` recogería nombre, email, empresa (opcional), tipo de servicio, presupuesto/plazo (opcionales), descripción del problema y mensaje.

**Consentimiento:** **ausente** — ningún checkbox de consentimiento ni enlace a una política de privacidad en ninguno de los dos formularios.

**Estado real, clasificado explícitamente:**

| Aspecto | Estado |
|---|---|
| Interfaz preparada (HTML, labels, validación cliente, estados de carga/éxito/error) | **Sí, completa y bien hecha** |
| Backend funcional | **No existe** |
| Simulación de envío | **Sí — es lo que hay actualmente en producción** |
| Funcionalidad de envío real | **Ausente** |

---

## 15. Seguridad

**[Hecho comprobado + Medición real]** — auditoría defensiva/estática únicamente, sin escaneo externo ni pruebas de credenciales, según instrucción. Barrido `grep -rn` sobre todo el repo excluyendo `node_modules`/`.git`/`dist`.

**Posibles secretos versionados:** **ninguno encontrado.** Barrido de patrones `API_KEY|SECRET|PASSWORD|TOKEN|sk-|AKIA` sin coincidencias de valores reales (solo ruido: nombres de dependencias transitivas en `package-lock.json` como `js-tokens`, y comentarios CSS sobre "design tokens"). No existe ningún archivo `.env*` en el repositorio ni en su índice Git (`find`/`git ls-files` vacíos).

**Uso de variables de entorno:** solo `import.meta.env.BASE_URL` (la variable integrada de Astro, no un secreto), en 4 puntos: `AboutSection.astro:10`, `HeroExperience.astro:16`, `Layout.astro:30`, `paths.js:2`. Cero usos de `process.env` en todo el proyecto.

**Exposición de datos personales:** un valor real de PII en texto plano en el código fuente — el email personal del propietario (`contact.links.email` en `site.js`, ambos locales) — es información de contacto pública e intencionada, no una fuga; se señala igualmente por transparencia del informe.

**HTML sin sanitizar / `set:html` / XSS:** **cero coincidencias** de `set:html` (Astro), `dangerouslySetInnerHTML` (React), `innerHTML =`, `eval(`, o `document.write` en todo el proyecto. Todo el contenido dinámico se renderiza vía interpolación segura de Astro/JSX (auto-escapado por defecto). **No se identificó ningún vector de XSS basado en estos patrones.**

**Enlaces externos / `noopener`/`noreferrer`:** los 6 usos de `target="_blank"` del proyecto llevan `rel="noopener noreferrer"` — sin hallazgos.

**Formularios / validación:** ver §14 — sin CSRF/antispam, pero también sin backend al que atacar hoy; el riesgo es prospectivo (para cuando se conecte un backend real).

**Dependencias declaradas:** inventario completo en §3. Ninguna dependencia con nombre sospechoso o inusual; todas son paquetes ampliamente conocidos (Astro, React, GSAP, ffmpeg.wasm, lucide). No se ejecutó ningún escaneo de vulnerabilidades (`npm audit`) como parte de esta auditoría — **[No verificable en este entorno]** sin ejecutar ese comando, que no se realizó por no ser una lectura pasiva del código y quedar fuera del alcance estrictamente definido para esta tarea.

**Headers / CSP:** **ausente por completo** — cero coincidencias de `Content-Security-Policy` en meta tags, `astro.config.mjs`, o cualquier archivo de configuración de hosting. **No existe ningún archivo de configuración de despliegue** (`vercel.json`, `netlify.toml`, `wrangler.toml`, `_headers`, `Dockerfile`) en el repositorio — confirmado por `find` dedicado.

**HTTPS/dominio:** no configurado en el repositorio (no hay `site` en `astro.config.mjs`, ver §5/§13) — no verificable qué dominio/HTTPS se usará hasta que se decida el hosting.

**Analytics y privacidad:** sin analítica de ningún tipo (Google Analytics/GA4/gtag/Plausible/PostHog — cero coincidencias), por lo que no hay superficie de privacidad relacionada con analítica hoy.

**Carga de scripts externos:** únicamente las hojas de estilo de Google Fonts (`fonts.googleapis.com`/`fonts.gstatic.com`, vía `<link>`, no `<script>`) — ningún script de terceros se carga en el sitio.

**Riesgos asociados a contenido de terceros:** mínimos — las únicas dependencias de red en tiempo de ejecución son Google Fonts y (solo dentro del conversor de vídeo, bajo demanda) los propios assets estáticos del sitio (`ffmpeg-core.js`/`.wasm`, autoalojados, no de un CDN de terceros).

**Archivos de configuración sensibles:** ninguno encontrado en el repositorio.

**Reglas de `.gitignore`** (24 líneas, leído completo): ignora `dist/`, `.astro/`, `public/ffmpeg/` (con comentario explicativo — binario WASM regenerado en cada install), `node_modules/`, logs, `.env`/`.env.production`, `.DS_Store`, `.idea/`. **Hallazgo:** no incluye `.env.local` ni `.env.*.local` (convención habitual de Vite/Astro) — hoy no supone una fuga real porque no existe ningún `.env*` en el repo, pero es un hueco de cobertura a corregir preventivamente antes de que alguna vez se cree uno de esos archivos.

**Conclusión de seguridad:** superficie de ataque estática muy limpia (sin sinks de XSS, sin secretos, sin `rel` faltante) — los riesgos reales del proyecto son de **ausencia de infraestructura** (sin CSP, sin backend que proteger aún) más que de código inseguro presente.

---

## 16. Rendimiento

**[Hecho comprobado + Medición real]** — sin ejecutar Lighthouse ni ninguna herramienta de medición de rendimiento real (no disponible en este entorno); toda cifra de tamaño de archivo es una medición real de disco.

**Tamaño de imágenes (medición real, `du -h`):**

| Archivo | Tamaño | Uso |
|---|---|---|
| `hero-background-gold.png` | **4,5 MB** | Fondo del Hero (`background-image` CSS) |
| `hero-background-gold-alternative.png` | 2,3 MB | Fondo alternativo del Hero |
| `hero-wordmark-gold.png` | 2,0 MB | Wordmark del Hero (`<img loading="eager">`) |
| `profile-cutout-alt.png` | 144 KB | Retrato (placeholder, según comentario del código) |
| `profile-cutout.png` / `-trimmed.png` | 44 KB / 36 KB | Variantes de retrato no confirmadas como usadas en el render actual |
| `logo-chiissuu.png` | 60 KB | Favicon |
| `gimp.png` (icono de skill) | 736 KB | El icono de skill más pesado, con diferencia |
| `canva.png`/`photopea.png`/`php.png`/`mysql.png` (iconos de skills) | 336/296/284/268 KB cada uno | Iconos de skills notablemente pesados para su tamaño de render (probablemente sobredimensionados) |

**Imágenes potencialmente sobredimensionadas:** con alta probabilidad, sí — íconos de 30–40px de renderizado (`.ab-skill-tags img { width:14px; height:14px }` en la variante de auditoría previa de About, similar en el resto) pesando cientos de KB apunta a que son capturas/exportaciones sin comprimir ni redimensionar **[Inferencia razonable a partir del tamaño de archivo vs. tamaño de render conocido, no una medición de dimensiones de píxel real de cada PNG]**.

**Formatos:** 100% PNG/SVG para imágenes propias — ningún WebP/AVIF en ningún punto del proyecto.

**Lazy loading:** el wordmark del Hero usa explícitamente `loading="eager"` (correcto, es contenido crítico above-the-fold); el retrato (`HeroExperience.astro:155`) **no tiene atributo `loading`** (por defecto del navegador, `"auto"`, efectivamente eager en la mayoría de navegadores) — dado que también está above-the-fold esto es razonable, pero no está siendo explícito. El fondo del Hero (4,5 MB) se carga vía `background-image` CSS, que **no admite `loading="lazy"`** — siempre se descarga con el resto del CSS, sin importar el viewport.

**`astro:assets` (optimización de imágenes de Astro):** **no se usa en ningún punto del proyecto** — cero coincidencias de `astro:assets`/`<Image` en todo `src/`. Esto significa que Astro **no** redimensiona, no convierte de formato, ni genera `srcset` responsive para ninguna imagen — todas se sirven al operador tal cual están en `public/`, al mismo tamaño de archivo en todos los viewports (incluido móvil, donde 4,5 MB de fondo de Hero es un coste real de datos).

**Fuentes / número de pesos tipográficos:** Google Fonts carga 4 familias con múltiples pesos cada una en una sola petición combinada (`Layout.astro:26-28`): Space Grotesk (500/600/700), Archivo Black (900 por defecto), Inter Tight (600/700/800), Inter (400/500/600/700), JetBrains Mono (400/500/600) — **16 combinaciones peso/familia en total** en una sola hoja de estilos externa, más 1 fuente autoalojada (PP Neue Montreal Book, 27,5 KB, peso único 400). Es un número relativamente alto de pesos para un sitio de este tamaño — **[Recomendación]** revisar si todos esos pesos se usan realmente en el CSS final.

**Scripts globales / GSAP:** GSAP + ScrollTrigger se cargan en la home (necesarios para `HeroExperience.astro`) — no se confirmó si se cargan también, innecesariamente, en las 3 subpáginas que no usan animación de scroll (`/servicios/`, `/tools/`, `/tools/video-converter/`) **[No verificado — recomendado comprobar el bundle real de cada página cuando el build funcione, ver §5]**. Dado que Astro por defecto solo incluye el JS de los componentes realmente importados por cada página, y `HeroExperience` solo se importa en `index.astro`, **es razonable esperar [Inferencia]** que GSAP no viaje a las subpáginas, pero no se confirmó con una medición real del bundle.

**Scroll listeners / medición de layout por frame:** el `ScrollTrigger` de sincronía de tema del sidebar (`checkArticleThemes`, §8) recalcula `getBoundingClientRect()` de **todas** las secciones `.section-theme-dark` de la página en cada tick de scroll (`start:0, end:"max"`) — es el punto de mayor coste de layout-thrashing potencial del sitio, aunque estructuralmente acotado (solo tantas secciones como existan, no una lista sin límite) y ya documentado como tal en el propio código.

**Assets duplicados:** 3 variantes de retrato (`profile-cutout.png`/`-alt.png`/`-trimmed.png`) coexisten en `public/`, con evidencia (comentario del código) de que solo `-alt.png` es la usada activamente hoy — las otras 2 son candidatas a limpieza si de verdad no se usan en ningún otro punto **[Inferencia — no se confirmó exhaustivamente que ningún otro archivo referencie las otras dos variantes]**.

**CSS repetido:** duplicación menor detectada en §9 (`.section-inner` vs `.rd-section`, mismo `max-width` definido dos veces).

**Recursos externos:** solo Google Fonts (con `preconnect` correctamente configurado, `Layout.astro:24-25`) — sin otros recursos de terceros.

**Preload/preconnect:** `preconnect` presente para Google Fonts; **sin `preload`** para ningún asset crítico propio (ni el wordmark ni el fondo del Hero, ambos candidatos naturales a `<link rel="preload">` dado su peso y su rol above-the-fold).

**Posibles layout shifts / elementos que podrían afectar LCP:** el candidato más probable a elemento LCP de la home es el wordmark o el título del Hero — ambos dependen de la carga de Google Fonts (con `font-display: swap`, lo cual evita un bloqueo total pero puede causar un reflow de texto) y, en el caso del wordmark, de una imagen de 2 MB. **[Inferencia — no es una medición de LCP real, que requeriría un navegador]**.

**Código no utilizado que pueda demostrarse:** `fitWordmarkWidth()` en `HeroExperience.astro` (ya señalado en §8) es la única pieza de código confirmada como efectivamente muerta/sin efecto (consulta un selector que ya no existe en el marcado y retorna temprano) — sigue ejecutándose en cada boot y cada resize sin ningún efecto útil.

---

## 17. Assets

**[Hecho comprobado + Medición real]** — inventario de `public/` (38 archivos) vía `find`/`du -h`.

**Imágenes principales / fondos / retratos / wordmarks** (todas en `public/assets/images/`): `hero-background-gold.png` (4,5 MB), `hero-background-gold-alternative.png` (2,3 MB), `hero-wordmark-gold.png` (2,0 MB), `profile-cutout.png` (44 KB), `profile-cutout-alt.png` (144 KB, la usada activamente), `profile-cutout-trimmed.png` (36 KB).

**Wordmark/logo adicional:** `public/assets/icons/logo-chiissuu.png` (60 KB) — usado como favicon.

**Iconos de skills:** 34 archivos en `public/assets/skills/` (33 `.png` + 1 `.svg`, GitHub) — cubren los lenguajes/herramientas listados en `about.skillGroups` de `site.js`, incluidos GSAP/n8n que **no tienen icono** por diseño (`icon: null`, decisión tomada explícitamente en la tarea anterior para no añadir assets nuevos).

**Fuentes:** 1 archivo autoalojado, `PPNeueMontreal-Book.woff2` (27,5 KB) — existe en disco pero su comentario de origen en `Layout.astro` está desactualizado (§5).

**Vídeos:** ninguno en `public/`.

**Documentos descargables:** ninguno en `public/` — los 2 "archivos" enlazados desde About (diseño, trayectoria competitiva) son carpetas externas de Google Drive, no assets propios del repositorio.

**Núcleo WASM de ffmpeg (generado, no versionado):** `public/ffmpeg/ffmpeg-core.js` (112 KB) + `public/ffmpeg/ffmpeg-core.wasm` (~31 MB) — regenerados en cada `npm install` por `scripts/copy-ffmpeg-core.mjs`, correctamente excluidos de Git.

**Assets referenciados vs. aparentemente no referenciados:**
- Referenciados y confirmados en uso: `hero-background-gold.png`, `hero-wordmark-gold.png`, `profile-cutout-alt.png`, `logo-chiissuu.png`, todos los iconos de skills que aparecen en `site.js` con un nombre de archivo no-null, `PPNeueMontreal-Book.woff2`.
- **Aparentemente no referenciados o de uso incierto [Inferencia, no confirmado exhaustivamente]:** `hero-background-gold-alternative.png` (el propio nombre "alternative" sugiere una variante de respaldo, uso condicional no confirmado con cita de línea), `profile-cutout.png` y `profile-cutout-trimmed.png` (candidatas si solo `-alt.png` está en uso real).

**Duplicados probables:** las 3 variantes de retrato (mencionado también en §16) son el caso más claro.

**Nombres inconsistentes:** ninguna inconsistencia de nomenclatura grave detectada — los nombres de archivo son descriptivos y consistentes (`kebab-case` en imágenes, nombre-de-tecnología-en-minúscula en skills).

**Formatos:** PNG casi universal (salvo 1 SVG de GitHub y 1 WOFF2 de fuente) — ningún formato moderno de imagen (WebP/AVIF) en uso.

**Riesgos de licencia:** la fuente "PP Neue Montreal Book" está explícitamente descrita en el propio código como "licensed font" (`Layout.astro:230`) — **[No verificable en este entorno]** si la licencia de esa fuente permite legalmente el autoalojamiento tal como está configurado; es una afirmación del propio comentario del código, no algo que este agente pueda verificar de forma independiente. Ningún otro asset tiene indicios de restricción de licencia en el código o nombres de archivo.

**Alt text asociado:** cubierto en detalle en §12.

No se ha borrado ni movido ningún asset como parte de esta auditoría.

---

## 18. Build, despliegue y operaciones

**[Hecho comprobado + Medición real]**

**Scripts de build:** `npm run build` → `astro build` (`package.json:11`). Directorio de salida: por defecto de Astro, `dist/` (confirmado existente en disco, gitignored). **Adaptador de Astro:** ninguno configurado (`astro.config.mjs` no importa ni registra ningún `@astrojs/*-adapter`) — el proyecto está configurado para salida estática pura, desplegable en cualquier hosting de archivos estáticos (Netlify, Vercel estático, GitHub Pages, Cloudflare Pages, S3+CDN, etc.) sin necesidad de un runtime de servidor.

**Hosting previsto:** **no decidido en el repositorio** — sin `vercel.json`, `netlify.toml`, `wrangler.toml` ni ningún otro indicio de plataforma elegida. El propio comentario de `astro.config.mjs:2-4` dice explícitamente: *"Set `site` (and `base`...) once final hosting is decided."*

**Workflows de GitHub / CI:** **no existen** — no hay directorio `.github/` en el repositorio.

**Rama de despliegue:** no aplica — sin CI/CD configurado, no hay una rama designada como "de despliegue" en el repositorio; el despliegue (si ocurre) sería manual, probablemente desde el propio equipo Windows del usuario donde el build sí funciona.

**Dominio configurado:** ninguno (ver `site` sin definir, arriba).

**Variables requeridas:** ninguna — confirmado en §15 que no se usa `process.env` en ningún punto y que `import.meta.env` solo lee la variable integrada `BASE_URL`.

**Manejo de errores en build:** no aplicable a nivel de código propio del proyecto — el único error de build reproducible en este entorno es el ya documentado en §5 (`@rolldown/binding-linux-x64-gnu` ausente, problema de plataforma, no de código).

**Cachés:** `.astro/` (tipos generados por Astro) está gitignored y se regenera en cada `astro sync`/`dev`/`build`. Sin otra caché de build detectada en el repositorio.

**Artefactos generados:** `dist/` (build de producción, gitignored, presente en disco con `mtime` posterior a los cambios de About — evidencia indirecta de un build reciente exitoso en Windows, ver §5) y `public/ffmpeg/` (regenerado por `postinstall`, gitignored).

**Dependencias del entorno:** Node ≥22.12 (declarado en `package.json:6-8`, cumplido en este entorno con Node 22.23.2), `npm install` debe ejecutarse en la **misma plataforma/arquitectura** donde luego se ejecute `dev`/`build`/`check` — la lección directa del hallazgo de §5.

**Problema de plataforma actual:** documentado en detalle en §5 — `node_modules` instalado en Windows, usado desde Linux, sin el binding nativo correcto de `rolldown`. No se ha intentado reparar ni desplegar nada como parte de esta auditoría.

---

## 19. Deuda técnica y riesgos

**[Hecho comprobado]** para "Evidencia"; **[Recomendación]** para "Recomendación"; prioridades asignadas según la escala pedida (P0 seguridad/pérdida de datos/rotura crítica; P1 bloquea lanzamiento o funcionalidad principal; P2 mejora importante; P3 mantenimiento/opcional). Ningún ítem mezcla preferencia estética con defecto técnico.

| ID | Hallazgo | Evidencia | Tipo | Probabilidad | Impacto | Prioridad | Archivos | Recomendación | ¿Bloquea lanzamiento? |
|---|---|---|---|---|---|---|---|---|---|
| D1 | Formularios no envían datos realmente | `src/lib/forms/submit.ts:3-11` | Funcional | Certeza (ya ocurre) | Alto — pérdida de leads reales | **P1** | `submit.ts`, `ContactForm.astro`, `ServicesForm.astro` | Conectar un backend real (Formspree/EmailJS/Getform/función propia) antes de promocionar el sitio como "contáctame" | **Sí** |
| D2 | Sin infraestructura SEO (OG, canonical, sitemap, robots.txt, JSON-LD, `site` sin configurar) | §13, múltiples greps con 0 coincidencias | Producto/SEO | Certeza | Medio-alto para descubribilidad | **P1** | `astro.config.mjs`, `Layout.astro`, nuevo `public/robots.txt` | Añadir paquete mínimo de SEO antes de compartir el enlace ampliamente | Recomendado antes de lanzamiento público amplio |
| D3 | Sección Proyectos 100% placeholder | `site.js` (`projects.*`), §7/§11 | Contenido | Certeza | Alto para credibilidad profesional | **P1** | `src/components/ProjectsSection.astro`, `site.js` | Completar con proyectos reales antes de compartir el portfolio como CV | **Sí**, para el propósito declarado del sitio |
| D4 | `node_modules` de Windows usado en este entorno cloud → build roto aquí | §5, evidencia definitiva (`@rolldown/binding-win32-x64-msvc` presente, `-linux-x64-gnu` ausente) | Plataforma/entorno | Certeza en este entorno concreto | Alto para trabajar desde aquí; nulo en Windows | **P2** (no bloquea el sitio en sí, solo el flujo de trabajo en este entorno) | `node_modules/` (no versionado) | Reinstalar (`npm install`) en la plataforma donde se vaya a ejecutar `dev`/`build`/`check` | No bloquea el lanzamiento (el sitio se construye bien en Windows) |
| D5 | Imágenes del Hero muy pesadas (hasta 4,5 MB), sin `astro:assets`, sin `srcset` | §16, medición real de tamaño | Rendimiento | Certeza | Medio-alto (tiempo de carga, especialmente móvil) | **P2** | `HeroExperience.astro`, `public/assets/images/*` | Comprimir/redimensionar; adoptar `astro:assets` o generar variantes manualmente | No bloquea, pero afecta la primera impresión |
| D6 | Texto de depuración "PRUEBA DE SECCIÓN" en producción (`dist/` incluido) | `VideoConverterPageContent.astro:24` | Defecto de código | Certeza | Medio (visible a cualquier visitante de esa página) | **P1** | `src/components/VideoConverterPageContent.astro` | Eliminar la línea | **Sí**, es trivial de arreglar y muy visible |
| D7 | Sin protección antispam/CSRF en formularios (prospectivo, hoy sin backend) | §14/§15 | Seguridad | Baja hoy (no hay backend); alta el día que lo haya | Medio (una vez haya backend) | **P2** (condicionado a D1) | `ContactForm.astro`, `ServicesForm.astro`, futuro backend | Añadir honeypot/CAPTCHA + validación servidor cuando se resuelva D1 | Bloquea el lanzamiento del backend real, no el sitio estático actual |
| D8 | `content.en.hero` no cumple `HeroContent` (falta `personalNote`) | §11, comparación manual `content-types.ts:84` vs `site.js` | Tipos/datos | Certeza (inerte hoy) | Bajo hoy, medio si se activa `/en` | **P3** | `src/content/site.js` | Añadir la clave faltante antes de activar cualquier ruta en inglés | No bloquea (nadie consume `content.en` aún) |
| D9 | `SimpleNav.astro` sin alternativa de navegación móvil bajo 700px | §10/§12 | UX/accesibilidad | Certeza | Medio (3 subpáginas afectadas en móvil) | **P2** | `SimpleNav.astro` | Añadir un menú hamburguesa equivalente al del Hero, o al menos un enlace de vuelta visible | No bloquea, pero degrada la experiencia móvil de 3 rutas |
| D10 | 1 respuesta de FAQ es el texto literal "Placeholder" | `site.js` (`faq.items[1].a`) | Contenido | Certeza | Medio (visible al usuario) | **P2** | `site.js` | Redactar la respuesta real o retirar la pregunta | No bloquea técnicamente, sí de cara a producto |
| D11 | Comentario de `Layout.astro` sobre la fuente "PP Neue Montreal Book" desactualizado (dice que no está incluida, pero sí lo está) | `Layout.astro:230-235` vs `public/assets/fonts/PPNeueMontreal-Book.woff2` presente | Documentación | Certeza | Bajo | **P3** | `Layout.astro` | **Aplazado** — `Layout.astro` es un archivo protegido en el protocolo vigente de este proyecto (§20); actualizar el comentario requiere primero una autorización explícita para editar ese archivo, fuera del alcance de las fases de este plan | No |
| D12 | `ClosingStatement.astro` completo pero huérfano, con tokens de diseño "legacy" | §6 | Deuda de código | Certeza | Bajo | **P3** | `ClosingStatement.astro` | Decidir: reactivar (actualizando tokens) o eliminar | No |
| D13 | Duplicación de contenedor (`.section-inner` vs `.rd-section`, mismo `max-width`) | §9 | Deuda de CSS | Certeza | Bajo | **P3** | `Layout.astro` | Unificar en una sola regla si se retoma el sistema de diseño | No |
| D14 | `fitWordmarkWidth()` código semi-muerto que sigue ejecutándose sin efecto | `HeroExperience.astro:2270-2288` (comentario en `:379-383`) | Deuda de código | Certeza | Muy bajo (coste de CPU marginal) | **P3** | `HeroExperience.astro` | Eliminar la función y sus llamadas, o restaurar el selector que consulta | No |
| D15 | `.gitignore` no cubre `.env.local`/`.env.*.local` | `.gitignore` completo | Seguridad preventiva | Baja (no hay `.env*` hoy) | Medio si se crea uno sin darse cuenta | **P3** | `.gitignore` | Añadir los patrones que faltan | No, es preventivo |
| D16 | Iconos de skills sobredimensionados en peso de archivo respecto a su tamaño de render | §16 | Rendimiento | Media-alta (inferencia por tamaño de archivo) | Bajo-medio (acumulativo, 34 archivos) | **P3** | `public/assets/skills/*` | Comprimir/redimensionar en lote | No |
| D17 | Sincronía de tema del sidebar (`checkArticleThemes`) recalcula geometría de todas las secciones oscuras en cada tick de scroll | `HeroExperience.astro:2957-3046` | Rendimiento/arquitectura | Certeza (así está escrito) | Bajo-medio (ya acotado a un número fijo de secciones) | **P3** | `HeroExperience.astro` | Vigilar si se añaden más secciones `.section-theme-dark`; considerar throttling si se detecta jank real | No |

---

## 20. Elementos protegidos e invariantes

**[Hecho comprobado]** — documentado sin modificar ninguno de los archivos implicados.

| Invariante | Qué lo consume | Qué podría romperlo | Cómo verificarlo tras una modificación |
|---|---|---|---|
| Transición Hero → sidebar → About (pin + scrub de 1 viewport) | `HeroExperience.astro` (`buildScrollTimeline`, §8) | Cambiar `pinSpacing`, el `trigger`/`start`/`end`, o la altura de `.hx-wrap` sin actualizar la lógica que depende de `window.innerHeight` | Hacer scroll manual en un navegador real desde `#home` hasta pasar `#about`; comprobar que el sidebar aparece hacia el 58% del recorrido y que no hay salto visual al pinear/despinear |
| Timeline GSAP maestro (scrub 0,35, 8 segmentos internos) | Ídem | Reordenar los segmentos sin ajustar sus posiciones locales (0.10, 0.28, 0.40, 0.58, 0.60, 0.62, 0.75, 0.86, 0.90, 0.98) | Revisar visualmente cada tramo del scroll; comparar contra la tabla de §8 |
| Morph FLIP por pares `data-morph-source`/`data-morph-target` | `computeMorph`/`contentRect` (`HeroExperience.astro:2559-2661`) | Renombrar o eliminar un `data-morph-source`/`data-morph-target` sin actualizar su pareja; vaciar de hijos un elemento medido (rompe `contentRect`'s fallback) | Comprobar en consola que `collectMorphPairs()` no descarta ningún par (`:2593`); inspección visual del recorrido de cada elemento |
| Hashes/checkpoints estables disponibles | Todo este flujo de trabajo (protocolo de checkpoint de la conversación) | N/A — es un mecanismo de proceso, no de código | Recalcular `sha256sum` de los archivos protegidos y compararlo contra el valor registrado en §21 de este mismo informe |
| `id="about"` | `HeroExperience.astro:3110` (ScrollTrigger de nav activo), `SimpleNav.astro`-style anchors, la propia URL con ancla `#about` | Renombrar el id en `AboutSection.astro` sin actualizar `HeroExperience.astro` | Grep de `id="about"` y `sectionId`/sección `about` en `NAV_TRIGGER_GROUPS` |
| Anchors de navegación (`#about`, `#projects`, `#services`, `#tools`, `#contact`, sin `#faq` en `SimpleNav`) | `SimpleNav.astro` (3 subpáginas), nav propio del Hero | Renombrar cualquier `id` de sección de la home sin actualizar ambos consumidores | Grep de cada `id="..."` contra los `href`/`navIds` que lo referencian |
| Estructura bilingüe de `site.js` (`content.es`/`content.en`, misma forma `SiteContent`) | `content-types.ts` (contrato), cualquier futura ruta `/en` | Añadir una clave a un locale sin añadirla al otro (ya ocurrió una vez, D8) | Comparación manual campo a campo, o activar `tsc`/`astro check` en un entorno donde funcione y anotar `content.es`/`content.en` explícitamente como `SiteContent` para forzar el chequeo |
| Tokens globales compartidos (`--container`, `--section-dark-*`, `--hx-sidebar-width`, `--sidebar-content-gap`, `.section-theme-*`, `.glass-panel`) | Múltiples componentes simultáneamente (§9) | Cambiar el valor o el nombre de cualquiera de estos en `Layout.astro` sin repasar todos sus consumidores | Grep de cada token en todo `src/`; revisión visual de las 5 secciones de la home tras el cambio |
| Componentes usados por varias secciones (`SectionHeadingCard`, 8 puntos de uso) | About ×4, Contact, FAQ, Projects, ServicesTools | Cambiar su contrato de props (`text`/`as`/`size`) o su CSS local | Grep de `SectionHeadingCard` en `src/components/*.astro`; revisión visual de las 5 secciones |
| Breakpoint de escritorio de poca altura (`max-height:950px`/`850px`, ambos `min-width:900px`) | `HeroExperience.astro` (compactación del sidebar) | Eliminar o reordenar estas reglas respecto al bloque de 900px general | Probar en un viewport real de 1280×720 (el caso citado explícitamente en el propio código) |
| Comportamiento de `prefers-reduced-motion` | Entrada del Hero, timeline maestro, menú móvil, reveal genérico de `Layout.astro`, `RollLink`, `checkArticleThemes` (parcial) | Añadir una animación nueva sin gatear su duración/ejecución bajo esta media query | Activar "reducir movimiento" del sistema operativo y repetir la navegación completa del sitio |
| `playEntrance()` marcada explícitamente como "fuera de alcance" en el propio código | `HeroExperience.astro:2606-2628` | Modificarla directamente en vez de rodearla, como ya se hizo una vez según el propio comentario | Revisar el historial de comentarios de esa función antes de tocarla |
| Color de fondo de `.hx-wrap` = `--section-dark-start` (mismo token que usa `AboutSection`) | `HeroExperience.astro:311-351` | Cambiar `--section-dark-start` en `Layout.astro`, o el color de fondo de `.hx-wrap`, de forma independiente | Comprobar visualmente que no reaparece la "franja pálida" documentada en el historial del código |

---

## 21. Plan recomendado

**[Recomendación]** — ninguna fase se ha implementado como parte de esta auditoría.

**1. Estabilización y documentación.** Objetivo: cerrar los hallazgos triviales/documentales que no requieren tocar ningún archivo protegido (D6, D8, D15). Archivos: `VideoConverterPageContent.astro`, `site.js`, `.gitignore`. Dependencias: ninguna. Riesgos: mínimos, cambios puntuales y acotados. Pruebas: `git diff --check`; revisión visual manual (fuera de este entorno) de la página del conversor de vídeo. Criterio de fin: los 3 hallazgos cerrados, cero archivos protegidos tocados. **D11 queda explícitamente fuera de esta fase y aplazado**: su archivo (`Layout.astro`) está protegido bajo el protocolo vigente de este proyecto (§20), y esta fase no puede proponer su modificación mientras esa protección siga vigente — D11 solo debería abordarse en una tarea futura que autorice expresamente editar `Layout.astro`.

**2. Rediseño de secciones inferiores.** Objetivo: completar Proyectos (D3) y decidir el destino de `ClosingStatement.astro` (D12). Archivos: `ProjectsSection.astro`, `site.js`, `content-types.ts` (si cambia la forma de `ProjectItem`), opcionalmente `ClosingStatement.astro`/`index.astro`. Dependencias: contenido real de proyectos (fuera del alcance técnico). Riesgos: bajo, sección autocontenida. Pruebas: revisión visual, `git diff --check`. Criterio de fin: sin texto "(placeholder)" ni "Próximamente" en Proyectos.

**3. Animaciones.** Esta fase **no programa ninguna modificación de `HeroExperience.astro`** en el plan actual. D14 (`fitWordmarkWidth()` semi-muerta) y D17 (recálculo de geometría de `checkArticleThemes` en cada tick de scroll) son deuda técnica P3 **sin defecto demostrado** — ambas describen un comportamiento subóptimo pero funcionalmente correcto, no una rotura — y permanecen deliberadamente aplazadas, sin fecha ni fase asignada. Si en el futuro se decide abordarlas, esa decisión requeriría, como mínimo: autorización explícita para editar `HeroExperience.astro` (archivo protegido, §20), entender completamente el inventario de animaciones de §8 y los invariantes de §20 antes de tocar nada, y un recorrido de scroll completo en un navegador real (varios viewports, con y sin reduced-motion) como prueba de no regresión — pero nada de esto se planifica como parte de las fases numeradas de este plan.

**4. Responsive móvil.** Objetivo: cerrar D9 (nav móvil de `SimpleNav`). Archivos: `SimpleNav.astro` — esta fase no programa ninguna modificación de `HeroExperience.astro`. `SimpleNav.astro` está actualmente protegido; esta fase requerirá una autorización explícita para modificarlo, aunque no necesitará tocar `HeroExperience.astro`. Solo si en el futuro se autorizara explícitamente extraer el patrón de menú móvil de `HeroExperience.astro` a algo compartido cambiaría este alcance. Riesgos: medio (3 páginas afectadas). Pruebas: navegación real en viewports <700px en las 3 subpáginas. Criterio de fin: las 3 subpáginas tienen una forma de navegar bajo 700px.

**5. Backend de formularios.** Objetivo: cerrar D1 y, condicionalmente, D7. Archivos: `src/lib/forms/submit.ts` (reemplazar el stub), posiblemente un nuevo `astro.config.mjs` con `output`/`adapter` si se opta por una función serverless propia en vez de un servicio de terceros (Formspree/EmailJS/Getform). Dependencias: decisión de producto sobre qué backend usar. Riesgos: cambia la configuración de build/despliegue si se elige una función propia. Pruebas: envío real de prueba, verificación de recepción, prueba de antispam. Criterio de fin: un envío real desde el formulario llega a un destino real; `submitSuccess` dice la verdad.

**6. SEO y accesibilidad.** Objetivo: cerrar D2 y los hallazgos de accesibilidad menores de §12 (mensajes de error por campo, confirmar `<nav>`/heading de `/servicios/`). Archivos: `astro.config.mjs` (`site`), `Layout.astro` (OG/canonical/JSON-LD), nuevo `public/robots.txt`, opcionalmente `@astrojs/sitemap`. Dependencias: dominio final decidido (§18). Riesgos: bajos. Pruebas: validador de OG/Twitter Card, `Lighthouse` (fuera de este entorno), lector de pantalla real. Criterio de fin: checklist de §13 sin ítems "Ausente" evitables para un portfolio personal.

**7. Seguridad.** Objetivo: preparar el terreno para D7 en cuanto exista backend (fase 5); cerrar D15 antes. Archivos: `.gitignore`, formularios, futuro backend. Dependencias: fase 5. Riesgos: bajos si se hace en el orden correcto (antes de exponer un endpoint real). Pruebas: intento de envío automatizado/spam en un entorno de pruebas. Criterio de fin: honeypot o CAPTCHA activo antes de que el backend real reciba tráfico público.

**8. Rendimiento.** Objetivo: cerrar D5 y D16. Archivos: `public/assets/images/*`, `public/assets/skills/*`, posiblemente adoptar `astro:assets`. Dependencias: ninguna técnica; depende de decidir si vale la pena migrar a `astro:assets` (cambio más profundo) o solo comprimir los archivos actuales (cambio superficial). Riesgos: bajos si solo se comprime; medios si se migra a `astro:assets` (cambia cómo se referencian las imágenes en varios componentes). Pruebas: comparación de tamaño de archivo antes/después; Lighthouse real (fuera de este entorno). Criterio de fin: el fondo del Hero pesa una fracción de los 4,5 MB actuales sin pérdida visual perceptible.

**9. Bilingüe.** Objetivo: cerrar D8 y, si se decide, publicar `/en`. Archivos: `site.js` (añadir `personalNote` a `en.hero`), nuevas rutas `src/pages/en/*` o adopción de `astro:i18n`, un selector de idioma en la UI. Dependencias: decisión de producto sobre si realmente se quiere publicar en inglés ahora. Riesgos: medios (duplicar 4 rutas, mantener sincronía es-en a futuro). Pruebas: `tsc`/`astro check` real anotando `content.es`/`content.en` como `SiteContent` explícitamente. Criterio de fin: `/en` renderiza sin errores de tipos, con selector de idioma visible.

**10. Preparación para dominio y lanzamiento.** Objetivo: cerrar el resto de §13 (`site` en `astro.config.mjs`, favicon completo, manifest si aplica) y confirmar el build real en la plataforma de despliegue elegida. Archivos: `astro.config.mjs`, `public/` (favicons), configuración de hosting (nueva). Dependencias: todas las fases anteriores relevantes para lanzamiento (1, 2, 5, 6 como mínimo). Riesgos: bajos, es la fase de cierre. Pruebas: build real y despliegue de prueba en la plataforma final. Criterio de fin: el sitio construye y se sirve correctamente desde el dominio final, con HTTPS.

Ninguna fase se ha implementado como parte de esta tarea de auditoría.

---

## 22. Futuros documentos (propuesta, no creados en esta tarea)

Por instrucción explícita, **no se han creado** `README.md`, `AGENTS.md` ni `docs/ARCHITECTURE.md` en esta tarea. Propuesta de contenido para cuando se decida separarlos:

**`README.md`** (solo información dirigida a personas): presentación del proyecto y su autor, capturas de pantalla del sitio, stack (tabla de §3), instrucciones de instalación (`npm install` — con una nota explícita sobre el problema de plataforma de §5 si se documenta para colaboradores multiplataforma), scripts disponibles (`dev`/`build`/`preview`/`check`), estructura general de carpetas (versión resumida de §4), estado actual del proyecto (versión resumida del §1), licencia, enlaces (repositorio, sitio en vivo cuando exista).

**`AGENTS.md`** (solo instrucciones estables para agentes/IA que trabajen en este repo): flujo Git usado en este proyecto (rama activa, política de commits), el uso obligatorio de `GIT_OPTIONAL_LOCKS=0` para comandos de solo lectura en este montaje concreto (evita el `.git/index.lock` huérfano documentado repetidamente en esta serie de tareas), el protocolo de checkpoint (branch/HEAD/status/hashes antes de editar), la lista de archivos protegidos vigente en cada momento (hoy: `HeroExperience.astro`, `Layout.astro`, `SectionHeadingCard.astro`, `index.astro`, `SimpleNav.astro`, más cualquiera que se añada), acciones prohibidas (sin commit/push salvo petición explícita, sin `npm install`/`update` salvo petición explícita), pruebas obligatorias antes de entregar (`git diff --check`, intentos de `check`/`build` con el resultado esperado documentado), convenciones de código observadas en el proyecto (patrón `Props`/`Astro.props`, nomenclatura de prefijos CSS por componente), y el procedimiento de entrega (informe estructurado, verificación final, sin avanzar sin autorización).

**`docs/ARCHITECTURE.md`** (solo arquitectura técnica mantenible, sin lenguaje dirigido a personas): mapa de rutas (§7), inventario de componentes (§6), forma de los datos (`content-types.ts`, §11), inventario de animaciones (§8), sistema de tokens (§9), tabla de breakpoints (§10), estado de formularios (§14), configuración de build/despliegue (§18), tabla de dependencias con versiones resueltas (§3).

No se ha creado ninguno de estos tres documentos en esta tarea.

---

## 23. Verificación final

**[Medición real]** — checkpoint ejecutado inmediatamente antes de escribir este documento, con `GIT_OPTIONAL_LOCKS=0` en todos los comandos Git de solo lectura, sin excepción.

**Rama y HEAD:**
```
GIT_OPTIONAL_LOCKS=0 git branch --show-current → feat/lower-sections-redesign
GIT_OPTIONAL_LOCKS=0 git rev-parse HEAD          → 8176afa97b0b2807a46031a81812ebdb5122e3a7
```
Coinciden con el estado autorizado al inicio de esta tarea (§2) — sin cambios de rama ni de HEAD en ningún momento.

**Estado final del working tree:**
```
GIT_OPTIONAL_LOCKS=0 git status --short:
 M src/components/AboutSection.astro
 M src/content/site.js
 M src/lib/content-types.ts
?? docs/
```
Las 3 modificaciones son exactamente las mismas ya validadas por el usuario antes de que empezara esta auditoría, sin ningún cambio adicional. `?? docs/` es el directorio nuevo que contiene únicamente este informe.

**`git diff --check`:**
```
GIT_OPTIONAL_LOCKS=0 git diff --check → sin salida, código de salida 0
```
Sin errores de espacios en blanco ni conflictos en ninguno de los 3 archivos modificados.

**`git diff --name-only`:**
```
GIT_OPTIONAL_LOCKS=0 git diff --name-only:
src/components/AboutSection.astro
src/content/site.js
src/lib/content-types.ts
```
Exactamente los 3 archivos ya autorizados de la implementación anterior — ningún archivo de código, configuración o asset fue tocado durante esta tarea de auditoría (ni en su primera entrega ni en esta corrección).

**Hashes SHA-256 — los tres archivos modificados** (idénticos al valor registrado al inicio de esta tarea, en la anterior y en esta corrección; sin ninguna deriva):

| Archivo | SHA-256 |
|---|---|
| `src/components/AboutSection.astro` | `c51379cff68180f71eea81ba8e1b1512b8daf963a4710b7a30ab258af0b37369` |
| `src/content/site.js` | `1641f366fc69352c9eed1d1b5d3471ec361abdfd19df18d927c196cd4f2e48d7` |
| `src/lib/content-types.ts` | `2a322226af99a56b54959e5abe993ca67ad71126687374820cd1bd5ed26bdf65` |

**Hashes SHA-256 — los cinco archivos protegidos** (idénticos al checkpoint original de todo este flujo de trabajo; ninguno se ha abierto para escritura en ningún turno, incluida esta corrección):

| Archivo | SHA-256 |
|---|---|
| `src/components/HeroExperience.astro` | `a42a745960c9ceeb49d0f99c084940aa16ae9d6e6a2a6a08cc6b23d8db4776c1` |
| `src/layouts/Layout.astro` | `56c3a12fa634bf1ba2f6091f999ef92b1bddcbafce61502d5c9b2279bd0e17bc` |
| `src/components/SectionHeadingCard.astro` | `9b8eafca772eb11af07122762a4696651ce5ea2f20cba57e281ac7424e162330` |
| `src/pages/index.astro` | `9e9065db2fee7c4773224c2af8a7c8fd6fb34c6e73c513a01f9f8cb7c464e6f8` |
| `src/components/SimpleNav.astro` | `e9cbb2f1bd2d01f746378b35a69e483ea41136626eec9776cd6dc0f6c30b8edf` |

**Confirmación de que solo se creó el informe:** la única escritura nueva de esta tarea (incluida esta corrección) es `docs/PROJECT-AUDIT-2026-08-26.md`. No se creó `README.md`, `README.txt`, `AGENTS.md`, `AGENTS.txt`, `docs/ARCHITECTURE.md`, ningún otro informe, ningún script auxiliar dentro del repositorio, ni ninguna captura dentro del repositorio.

**Ausencia de `.git/index.lock`:** confirmada antes y después de esta corrección (`ls .git/index.lock` → "No such file or directory" en ambos casos). El único lock huérfano que apareció durante todo el desarrollo de esta tarea quedó documentado con su cronología real en §3 y fue resuelto por el usuario, sin que este agente lo borrara ni lo ignorara en ningún momento.

**Ausencia de commit y push:** no se ejecutó `git add`, `git commit`, `git push`, `git pull`, `git merge`, `git rebase`, `git reset`, `git checkout` ni `git switch` en ningún momento de esta tarea ni de su corrección. No se instaló ninguna dependencia (`npm install`/`npm update`) en ningún momento.

**Limitaciones reales de `check`/`build`/`dev` y de validación visual (repetidas aquí a modo de cierre, detalle completo en §3 y §10):** `astro check`, `astro build` y `astro dev` no se ejecutaron como parte de esta tarea de auditoría (no era necesario para un trabajo de solo documentación), pero su comportamiento conocido en este entorno cloud concreto —fallo por `Cannot find module '@rolldown/binding-linux-x64-gnu'`, causado por un `node_modules` instalado en Windows y usado desde Linux, no por el código del proyecto— ya estaba confirmado de una tarea anterior de este mismo flujo de trabajo y se documenta como tal en §3. Ningún renderizado visual real del sitio (en ningún viewport, en ningún navegador) se ha realizado por este agente en esta tarea ni en la anterior; la única validación visual del nuevo About fue comunicada por el usuario desde su propio navegador en Windows, y se registra en este documento exclusivamente como **[Validación manual comunicada por el usuario]**, nunca como una validación realizada por este agente.

Esta corrección ha sido exclusivamente documental: no se ha repetido la auditoría, no se ha modificado ningún archivo de `src/`, de configuración ni de assets, y las secciones 1 a 22 permanecen con el mismo contenido sustantivo de la entrega anterior salvo las correcciones puntuales indicadas por el usuario (cronología real de `GIT_OPTIONAL_LOCKS=0` en §3, fraseo sobre CI/PRs en §1, referencia corregida de §21/§24 a §19 en §3, aplazamiento explícito de D11 y ausencia de programación de cambios en `HeroExperience.astro` en §21).
