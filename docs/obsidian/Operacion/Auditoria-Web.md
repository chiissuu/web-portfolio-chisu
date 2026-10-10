---
tags: [operacion, auditoria, producto, accesibilidad, seguridad]
actualizado: 2026-10-10
fuente: [checkout actual, build local, navegador integrado, npm audit]
---

# Auditoría de producto y código — 10 de octubre de 2026

La ronda queda documentada y las correcciones locales están verificadas. **Al cerrar la auditoría**, el conversor no podía convertir: su motor UMD no se importaba desde el Worker de tipo módulo. Se dejó una propuesta ESM separada, contrastada en un diagnóstico aislado. Los formularios continúan siendo simulaciones, ahora con aviso previo, errores accesibles y protección ante la ausencia de su script.

> [!update] Corrección posterior autorizada — 10 de octubre
> A08, A09 y los problemas de ciclo de vida A10–A13 se corrigieron después de esta auditoría. Se copia ESM, el Worker usa las URLs del propio sitio, se comprueba la salida y se invalidan operaciones canceladas/selecciones antiguas. Las cachés de Vite se separan por comando. Se verificaron seis casos con el wrapper y motor reales en navegador: carga/reutilización, MP3 decodificable (10.701 bytes), MP4 decodificable (6.549 bytes, 32×32, 1s), archivo corrupto/reintento, cancelar carga/recargar y cancelar conversión/reintentar. También se descargó un MP3 desde la interfaz compilada. Los resultados originales y hashes siguientes son evidencia histórica de la auditoría, no del estado posterior. Prueba reproducible: [[Comandos-y-Pruebas]]. No implica validación de vídeos grandes, dispositivos reales o hosting final.

Hero, Sobre mí, transición, sidebar, datos ES/EN y dependencias compartidas permanecen idénticos a la referencia inicial, incluidos los cambios sin commit del usuario. No se hizo commit, push, despliegue, instalación ni actualización de dependencias.

## Contexto y referencia inicial

- Checkout activo: `portfolio-web-chiissuu`; rama `feat/lower-sections-redesign`; HEAD `a642dc5bcde7110b1a17907695f3a9365631f864`. La carpeta recovery no se utilizó para sustituir archivos.
- No había un AGENTS.md físico en los archivos listados; se siguieron las instrucciones aportadas por el usuario. Se revisaron el vault, código propio de las áreas autorizadas, tipos, rutas y contratos compartidos. No se auditó como fuente propia el código generado de FFmpeg.
- Estado inicial: siete notas modificadas, AboutSection, site.js y content-types modificados, Prompt-Auditoria-Web y Skills-Desarrollo-Web sin seguimiento. [Estado Git](auditoria-evidencias/git-inicial.txt) y [diff inicial](auditoria-evidencias/estado-inicial.diff) conservan esa referencia.
- [SHA-256 inicial](auditoria-evidencias/sha256-inicial.json): 84 archivos de src, assets, scripts y configuración. La comparación usa el working tree inicial, **no HEAD**.
- Stack contrastado: Astro 7.3.5 estático, React/React DOM 18.3.1 solo en el conversor, @astrojs/react 7.0.0, GSAP 3.15.0, FFmpeg 0.12.15/core 0.12.10, TypeScript 5.9.3. Node 24.17.0 y npm 11.13.0. No hay backend, API, autenticación, BD ni Docker implementados.
- Skills disponibles y leídas: define-goal, frontend-design, web-design-guidelines, security-best-practices, computer-use. La referencia de React menciona React 19; se aplicaron únicamente pautas generales compatibles con React 18. No existe referencia específica de Astro en esa skill. Ricardo se consultó para resolver su trigger, pero su evaluación académica queda excluida por el encargo explícito de producto.
- Criterio visual: conservar carbón/dorado/warm, tipografías, contenido y composición existente. Los cambios de contraste usan selectores locales; no se crean tokens, fuentes ni un nuevo diseño.

## Matriz de cobertura

| Ruta / área | Código y datos | Navegador e interacción | Resultado / límite |
|---|---|---|---|
| `/` — Proyectos | ProjectItem, cards, estilos, placeholders, heading compartido | Tres tarjetas; cinco anchos; navegación desde Hero | Provisionales reales, sin enlaces inventados. Nota con contraste corregido |
| `/` — Servicios/Tools | Columnas, segmentos strong, ejemplo items[0], withBase | CTA de servicios/tools y jerarquía h2→h3; responsive | Enlaces reales; ejemplo sin enlace directo es decisión existente |
| `/` — Contacto | Cards, links compartidos con sidebar, correo y formulario | Error vacío, espacios, email inválido, texto largo, envío simulado, foco; correo a 320px | Aviso previo y errores accesibles; sin envío real; correo dentro del viewport |
| `/` — FAQ | details/summary y cuatro respuestas | Apertura con Enter y foco nativo visible | Interacción correcta; respuesta provisional conservada; dos afirmaciones desactualizadas A15 |
| `/servicios/` | Página, tres artículos, ServicesForm, validadores/stub | Cinco anchos; vacío, opcionales vacíos, descripción larga, envío con Enter | Éxito simulado comprobado; aviso previo, foco y bloqueo durante loading |
| `/tools/` | Catálogo, CTA según href, estado provisional | Cinco anchos; acceso a conversor con teclado; marca de vuelta | Conversor enlazado; Instagram inert y sin ruta. Navegación móvil limitada A14 |
| `/tools/video-converter/` | Siete TSX, CSS Module, constantes, utils, cliente FFmpeg, copia del core | Cinco anchos; vacío/no admitido, AVI sintético, metadatos ilegibles, ajustes, reintento, reset | Isla de producción monta; carga del motor falla A08. Conversión, descarga y cancelación efectiva bloqueadas |
| Protección e integración | Hero/About, Layout, RollLink, fuentes, anclas, tipos, rutas, assets | Portada, scroll y sidebar en escritorio; menú móvil; About con siete párrafos y paleta mono | Hashes intactos. Pendientes previos A16/A21/A22 no modificados |
| SEO / rendimiento / seguridad / mantenimiento | Cuatro pages, metadatos, salida, comunicaciones, lockfile, configuración, código no montado | 91 referencias locales; h1/lang/descripciones/IDs; consola; npm audit | Sin enlaces internos/recursos HTML ausentes. No se midieron Lighthouse/CWV ni hosting remoto |

Pruebas responsive: 1920×1080, 1280×720, 768×1024, 390×844 y 320×844. [Matriz final medida](auditoria-evidencias/responsive-final.json): veinte combinaciones con ancho efectivo igual al solicitado, sin overflow horizontal. Los 15px de scrollbar de escritorio explican clientWidth menor que innerWidth. Las medidas iniciales parciales y una muestra con resize aún no aplicado quedan separadas en [línea base](auditoria-evidencias/responsive-inicial.json); no se cuentan como validaciones finales.

## Hallazgos corregidos

Severidad describe el problema; riesgo describe la modificación. Todos los cambios de esta tabla son de riesgo bajo, locales y reversibles.

| ID | Severidad | Evidencia / consecuencia antes | Actuación mínima y validación |
|---|---|---|---|
| A01 | Baja | ContactSection.astro:136; correo x=20→325,02 en viewport 320; scrollWidth=325 | max-width 100% + overflow-wrap anywhere. Después x=20→284,76; scrollWidth=clientWidth=305. Texto y mailto conservados |
| A02 | Media | ContactForm/ServicesForm, submit: solo data-invalid; seis/cuatro errores sin aria-invalid y foco permanecía en botón | aria-invalid, aria-describedby, mensajes por campo y foco al primer inválido. DOM/teclado: contact-name/services-name, mensajes nativos y fallback existente para validación custom; limpieza al reenviar |
| A03 | Baja | Loading solo pointer-events en CSS global; no disabled ni guard lógico | Botón disabled, aria-busy y guard del estado loading en ambos forms. Observado loading+disabled, después success+enabled; no cambia el stub ni los datos |
| A04 | Media, seguridad | Forms iniciales sin action/method: el navegador indica method=get; sin handler un envío podía poner datos en URL/historial/logs | Fieldset y submit disabled desde HTML; habilitar tras registrar preventDefault. HTML generado sin scripts: todos los controles y submit deshabilitados. No se añade endpoint ni envío POST |
| A05 | Alta, producto | Envío simulado solo se aclaraba tras completar el formulario; submit.ts:8 espera 500ms y siempre devuelve ok | Mostrar antes de los campos el submitSuccess existente en ES/EN. En ambos formularios el aviso ya aparece en estado idle; no se inventa texto ni canal real |
| A06 | Media | Colores calculados: labels/notas #71757f sobre #d5cfbe=2,96:1; texto de botón #08090b/#8a6a1f=3,95:1; error #ef6cae/warm=1,82:1; nota de Proyectos=4,42:1; prosa muted de Contacto=4,15:1 | Overrides scoped de formularios, páginas, Proyectos/Contacto y CSS Module del conversor. Medidos: label/prosa #3a3e48/warm=6,88:1; botón #f8f7f3/#8a6a1f=4,71:1; error #8f1e53/warm=5,45:1. Proyecto usa theme-muted de su tema dark. Se verificó el color calculado, incluida la cascada CSS final |
| A07 | Baja | ServicesToolsSection.astro:46 mostraba h4 inmediatamente después de h2 | h3 con misma clase/texto/estilos. DOM final h2→h3; sin alterar IDs ni navegación |

Archivos tocados: ContactForm, ContactSection, ProjectsSection, ServicesForm, ServicesPageContent, ServicesToolsSection, ToolsPageContent, VideoConverterPageContent y video-converter.module.css. Las librerías de formularios/conversor, los contratos y site.js se conservaron enteros.

El fieldset es un cambio local de markup para deshabilitar conjuntamente los campos mientras el handler no existe; no altera la arquitectura de datos. Los errores se crean con textContent y APIs DOM seguras. Las descripciones individuales usan validationMessage del navegador cuando aplica y el submitError existente para casos como espacios o email que no cumple el regex del proyecto.

## Propuestas pendientes de riesgo medio

No aplicar estos cambios sin una revisión posterior. Cada propuesta define archivos, causa, solución, prueba y riesgo de regresión.

### A08 — Motor incompatible en producción (Alta)

- Evidencia: scripts/copy-ffmpeg-core.mjs:23 copia `dist/umd`; ffmpegClient.ts:79–84 crea URLs Blob y carga ese core. El Worker de @ffmpeg/ffmpeg/dist/esm/classes.js:115 es `type: module`; worker.js:18–30 cae a import dinámico y espera `.default`, que el core UMD no exporta.
- Reproducción real: seleccionar sintetico.avi de 31.766 bytes e iniciar en preview; aparece engineLoadFailed en dos intentos. No depende de decodificar el AVI: falla antes de convertir.
- Contraste aislado: la misma librería y URLs Blob en diagnostico-motor.html devuelven `Error: failed to import ffmpeg-core.js` con UMD; con ESM devuelven `OK: esm; motor cargado`. Capturas UMD/ESM abajo.
- Solución propuesta: [patch revisable](auditoria-evidencias/propuesta-motor-esm.patch), tres sustituciones UMD→ESM en el script de copia y sus mensajes. `git apply --check --unidiff-zero` pasa. **No se aplicó ni se regeneró public/ffmpeg con ESM.**
- Tras aprobar: aplicar el patch, ejecutar `npm run copy:ffmpeg-core`, check/build/preview; probar MP3 a 128/192/256, MP4, reproducción de descargas, error corrupto, cancelación durante carga/conversión y reintento. Validar también URLs Blob y BASE_URL.
- Riesgo: cambia el formato de un recurso ejecutable del motor y afecta al empaquetado, caché y despliegue; la prueba aislada solo valida carga, no conversión completa.

### A09 — Hidratación fallida en el dev existente (Alta)

En localhost:4321 se obtuvo `_jsxDEV is not a function`, VideoConverter.tsx:164 en el JS transformado, y la isla quedó vacía. [Consola registrada](auditoria-evidencias/consola.json). Preview de producción monta correctamente. La causa exacta del dev no quedó determinada; un servidor/caché desactualizado o una transformación de JSX inconsistente son hipótesis, no hechos.

Propuesta: reproducir con `npm run dev -- --host 127.0.0.1 --port 4323` en una sesión limpia y registrar modo de ejecución; comparar renderer React y runtime JSX con el servidor existente antes de considerar cambios a astro.config.mjs, tsconfig o dependencias. Primero intentar reiniciar únicamente el servidor confirmado de este checkout. No se detuvo el dev del usuario ni se cambió configuración. Riesgo: invalidar una sesión activa o introducir diferencias dev/build; verificar montaje y consola de las cuatro rutas tras cualquier corrección.

### A10–A13 — Ciclo de vida del conversor (Media salvo A13 Baja)

Hallazgos de código; no se presentan como reproducción end-to-end porque A08 impide llegar a conversión.

| ID | Evidencia y causa | Propuesta concreta | Prueba / regresión |
|---|---|---|---|
| A10 | ffmpegClient.ts:83–84,167; instancia global asignada después de load. VideoConverter.tsx:110–120 no comprueba cancelación después de getFFmpeg | Gestionar instancia pendiente y una generación/token de carga; terminate de la instancia pendiente y descartar resolución obsoleta antes de runConversion | Cancelar durante descarga e inicialización; reintentar sin Worker viejo ni resultado tardío. Riesgo de rechazos/promise compartida y doble instancia |
| A11 | VideoConverter.tsx:60–98; lecturas async de metadatos sin identidad de selección | Ref monotónica de selección; incrementar al seleccionar/resetear y verificar después de await readVideoMetadata; limpiar showMemoryWarning al inicio | Dos archivos en orden inverso de resolución; reset durante metadata. Última selección gana; no validar con archivos personales |
| A12 | ffmpegClient.ts:139 y lectura posterior: se ignora retorno de exec y tamaño de salida | Exigir exitCode===0 y bytes.byteLength>0 antes de crear resultado; rechazar salida string inesperada; mantener finally de borrado | Stub con exit 1 y bytes parciales, salida vacía, conversión válida/corrupta real. Evitar anunciar done de una salida inválida |
| A13 | URLs del core creadas en ffmpegClient.ts:79–80 sin revoke; efecto de VideoConverter.tsx:53 solo limpia resultUrl | Revocar URLs de core en finally tras load y terminar trabajo activo al desmontar con control de generación | Ciclos cargar/cancelar/reset/desmontar; resultado descargable mientras sea válido. No revocar prematuramente URL de descarga |

Además, cambiar ajustes después de done no reconvierte el resultado. Es el comportamiento actual, no un error confirmado; una mejora de flujo podría bloquear los selectores o mostrar qué ajustes generaron la salida. Dejar formato/bitrate al reset también es una decisión actual. No se modificó esa lógica.

### A14 — Navegación de subpáginas limitada en móvil (Media)

SimpleNav.astro:63–65 oculta la lista a ≤700px. Medido en 390/320; solo queda CHIISSUU para volver a portada. Sus enlaces desktop Servicios/Tools vuelven a las columnas de portada, deliberadamente distintos del sidebar.

Propuesta en SimpleNav.astro: conservar destinos, añadir un details/summary de navegación en móvil con las cinco entradas actuales y nombre accesible derivado de datos; decidir primero si se desea ese menú o navegación directa entre subpáginas. Probar teclado, 320/390/768, sticky y vuelta a portada. Riesgo: navegación estructural y posible confusión de destinos. No se cambió por ser una decisión documentada, no un enlace roto.

### A15 — FAQ describe estados anteriores (Media)

site.js:381 dice que el archivo de diseño está en Sobre mí; los CTA Drive se retiraron y About solo enlaza grado/Maps. site.js:385 (y equivalentes EN) permite contactar con el formulario, aunque el envío es simulado. La respuesta freelance sigue siendo un placeholder explícito y se conserva.

Propuesta de contenido, pendiente de revisión: sustituir ambas respuestas en ES/EN por una declaración de que el archivo de diseño todavía no está enlazado y que el correo/enlaces de Contacto son los canales disponibles; el formulario es una vista previa. No añadir URL de Drive, LinkedIn ni disponibilidad sin datos reales. Probar ambas traducciones y details. Archivo afectado: site.js, exclusivamente faq; comparación de hero/about/nav/contact.links obligatoria. Riesgo: alterar copy real del usuario; no se aplicó automáticamente.

### A17/A18/A20 — Fallback, SEO y configuración (Baja–Media)

| ID | Evidencia / severidad | Solución propuesta y archivos | Prueba / riesgo |
|---|---|---|---|
| A17 | VideoConverterPageContent.astro:24; client:only sin fallback/noscript (Media) | Añadir mensaje localizado «necesita JavaScript» y estado de carga/error visible; requerir keys en copy y tipo | Sin JS, carga lenta e hidratación fallida. Evitar afirmar que el motor se descarga antes de iniciar. Riesgo de contrato compartido/copy |
| A18 | Layout:head y astro.config sin canonical/OG/site/sitemap; videoConverter.seo.title no se consume (Baja) | Una vez elegido dominio/base, configurar site y metadatos por ruta; usar seo.title específico en la página del conversor, revisar robots/sitemap | Build y URLs reales de las cuatro rutas; compartir enlace en vista previa. No inventar dominio ni métricas SEO; riesgo de configuración/Layout protegido |
| A20 | .gitignore:26–27 solo cubre .env y .env.production (Baja, seguridad preventiva) | Proponer .env.* con excepción !.env.example si se va a usar; mantener ejemplos sin secretos | git check-ignore con nombres sintéticos. No se encontró un secreto ni se añadieron variables de aplicación. Riesgo bajo técnicamente, clasificado medio por afectar configuración |

## Hallazgos fuera de alcance y decisiones de riesgo alto

| ID | Severidad / evidencia | Límite y actuación propuesta |
|---|---|---|
| A16 | Media: Layout.astro:430 opacity 0; sin JS no se añade rd-in. Threshold 0.15 también limita reveals extremadamente altos | Dependencia compartida protegida. Proponer contenido visible por defecto y opt-in de animación; probar no-JS, reduced motion y transición antes de autorizar cambios globales |
| A19 | Media: assets activos del Hero, fondo 2.341.187 B y wordmark 1.991.664 B; core WASM 32.232.419 B bajo demanda | Assets del Hero/About y fuentes protegidos. Proponer variantes comprimidas preservando geometría/calidad y cargar solo lo usado; no afirmar ahorro de red/CWV sin medición. Google Fonts sigue siendo comunicación externa real |
| A21 | Media: HeroExperience.astro:1649 comentario anidado y texto CORRECTED:1708; CSS final sin 185svh/1900px. evaluateMode:2902–2926 añade static solo si había timeline | Hero explícitamente protegido. Reparar comentario y modo inicial en una tarea autorizada, comprobar 768×1024 y reduced motion directo/resize. No se tocó aquí |
| A22 | Baja: EN sin hero.personalNote; comentarios afirman equivalencia completa; no hay rutas EN | Datos/contratos protegidos. Verificar antes de publicar EN. No inventar texto ni habilitar traducciones parciales |

Decisiones de riesgo alto que requieren al usuario: elegir destino real y tratamiento de datos para formularios (servicio externo frente a endpoint propio); aportar proyectos/documentación reales; confirmar disponibilidad y enlaces definitivos; elegir hosting/dominio/base antes de desplegar. Alternativa actual segura: conservar vista previa y canal mailto. No se implementan envío real, credenciales, backend o despliegue dentro de esta ronda.

## Seguridad: alcance y resultado

**A04 / SEC-FORM-GET**, severidad Media: riesgo de exposición accidental de datos en query, no un exploit de autenticación. Evidencia inicial: formulario sin method/action e informe del navegador method=get. Mitigación aplicada: controles disabled desde HTML, habilitados únicamente tras instalar el handler; captura y fixture sin scripts. La prueba no cubre a un usuario que edite deliberadamente el DOM o ejecute submit() por su cuenta.

Se buscaron sinks XSS, eval/Function, set:html, dangerouslySetInnerHTML, URLs dinámicas, almacenamiento, mensajes cross-window, APIs de red y secretos en fuente propia. No se encontraron rutas de entrada no confiable hacia esos sinks, ni backend autenticado, ni persistencia propia. Los nombres de archivo se renderizan escapados; FFmpeg recibe argumentos en array con nombres virtuales saneados, sin shell. Metadatos usan video/Blob y no insertan HTML/SVG. Validación por MIME **o** extensión y duración desconocida que permite continuar son limitaciones de UX/recursos, no una subida insegura a servidor inexistente.

GitHub/Linktree usan noopener noreferrer; placeholders sin href no se convierten en enlaces. Google Fonts es externo y no tiene SRI; no se inventó un hash para CSS variable. CSP/cabeceras de hosting no se han comprobado en un despliegue real: propuesta de defensa en profundidad futura, compatible con Worker/Blob/WASM y fuentes, sin desactivar protecciones. No se reporta ausencia de CSRF, auth o BD como vulnerabilidad de este sitio estático.

`npm audit --json` terminó con **0 vulnerabilidades conocidas**, 376 dependencias informadas. Primer intento restringido ENOTFOUND; repetición de lectura autorizada fuera del sandbox exit 0. No se ejecutó audit fix. [JSON](auditoria-evidencias/npm-audit.json).

## Pruebas y límites reales

| Verificación | Resultado |
|---|---|
| Check inicial | Exit 0; 42 archivos, 0 errores, 0 warnings, 126 hints |
| Build inicial restringido | Falló por EPERM realpath de node_modules/@ffmpeg/ffmpeg/dist/esm/worker.js; limitación de sandbox |
| Primera compilación fuera del sandbox | Exit 0, cuatro rutas. Ya contenía A01/A07; no se presenta como build idéntico al estado inicial |
| Check final | Exit 0; 43 archivos (incluye servidor de diagnóstico), 0 errores, 0 warnings, 126 hints |
| Build final | Exit 0; cuatro rutas. [Log](auditoria-evidencias/build-final.log) |
| Referencias del build | 91 href/src locales existentes, anclas existentes; una h1 por ruta, lang es, descripción no vacía, sin IDs duplicados. [Resultado](auditoria-evidencias/verificacion-build.json) |
| Responsive final | 20 combinaciones; sin overflow. Textarea de 2.500 caracteres en Contacto y descripción larga en Servicios sin overflow; controles y formularios conservan layout |
| Formularios | Vacío, espacios/email inválido en Contacto; campos opcionales vacíos en Servicios; loading deshabilita, éxito vuelve a habilitar; URL sin datos; estado sigue siendo simulado |
| Formularios sin scripts | Fixture extraído del HTML del build: 0 scripts, campos/submit disabled en ambos. No equivale a desactivar JS en las cuatro páginas completas |
| FAQ / teclado | Enter abre details, foco nativo visible; navegación Tools→Conversor con Enter |
| Conversor | Vacío/no admitido rechazados; AVI local aceptado con metadatos ilegibles, ajustes presentes, reset correcto. Dos intentos de carga fallan. Cancelar durante carga se intentó pero el fallo de carga impide concluir que cancelación funciona |
| Diagnóstico separado | UMD falla y ESM carga con URLs Blob; no se generó ni descargó resultado en la aplicación ni en este diagnóstico |
| Protección | 84 hashes comparados; 75 archivos intactos, nueve cambios locales permitidos. Hero/About/site.js/Layout/tipos/helpers/config/assets intactos |
| Diff | git diff --check sin errores; avisos LF/CRLF de Git no son defectos de la web |

Los logs de check conservan diagnósticos y resumen, truncando únicamente líneas enormes de código generado a 350 caracteres para evitar dos artefactos de 20 MB. El test de referencias trabaja con la salida real, no asume una ruta de build externa.

Limitaciones: el navegador disponible no expone emulación de prefers-reduced-motion, desactivación global de JS ni interceptación/red de DevTools. Se revisó el CSS/código de esos casos y se probó el fixture sin scripts; no se afirma haber probado reduced motion real. Tampoco se usó lector de pantalla, Lighthouse, CWV, dispositivos físicos, otros navegadores, hosting remoto, permisos de enlaces externos o conversión/descarga completas. El fallo dev y el fallo del motor se diferencian de los checks exitosos; **build verde no garantiza conversor funcional**.

## Capturas y reproducción

- [Contacto inicial a 320px](auditoria-evidencias/contacto-320-antes.jpg): formulario y scrollbar horizontal inicial; geometría del correo está en responsive-inicial.json.
- [Correo corregido](auditoria-evidencias/contacto-320-despues.jpg) y [errores accesibles](auditoria-evidencias/contacto-errores-despues.jpg).
- [Servicios](auditoria-evidencias/servicios-formulario-320.jpg), [Tools escritorio](auditoria-evidencias/tools-1280.jpg), [About y sidebar conservados](auditoria-evidencias/about-sidebar-1280.jpg).
- [Fallo de motor real](auditoria-evidencias/conversor-error-motor.jpg), [UMD aislado](auditoria-evidencias/diagnostico-umd.jpg), [ESM aislado](auditoria-evidencias/diagnostico-esm.jpg), [formularios sin scripts](auditoria-evidencias/formularios-sin-scripts.jpg).

Desde la raíz del proyecto:

```powershell
npm run check
npm run build
npm audit --json
npm run preview -- --host 127.0.0.1 --port 4322
python docs/obsidian/Operacion/auditoria-evidencias/verificar-build.py
node docs/obsidian/Operacion/auditoria-evidencias/servidor-diagnostico.mjs
# Abrir http://127.0.0.1:4324/diagnostico-motor.html
# Abrir http://127.0.0.1:4324/forms-sin-scripts.html
git apply --check --unidiff-zero docs/obsidian/Operacion/auditoria-evidencias/propuesta-motor-esm.patch
```

Para regenerar los medios sintéticos: `python docs/obsidian/Operacion/auditoria-evidencias/generar-video-sintetico.py`. El AVI contiene un segundo de cinco frames 32×32 RGB y tono PCM de 440 Hz; no contiene material personal. Los dos servidores temporales se detienen al cerrar esta ronda; el dev existente del usuario se conserva.

## Comparación del estado protegido y prioridades

[Comparación final](auditoria-evidencias/comparacion-final.json): todos los archivos protegidos conservan su SHA-256, incluido site.js completo (hero/about/nav/contact.links en ES/EN), HeroExperience, AboutSection, Layout, RollLink, SectionHeadingCard, content-types, paths, los 39 assets, package/lock/config y script de copia. El cambio h4→h3 y los estilos de las secciones inferiores no cambian los IDs de sección ni las clases de tema que consume el sidebar. En escritorio se comprobaron siete párrafos de About, paleta mono, enlace #about con aria-current location y sidebar 281,60×696 en 1280×720. Al navegar a Proyectos recupera paleta brand y el enlace lateral Servicios abre /servicios/.

Prioridad recomendada: aprobar primero A08 y completar los flujos reales del conversor; diagnosticar A09; endurecer A10–A13 con pruebas de carrera/cancelación; revisar FAQ y navegación móvil; escoger contenido/canales reales antes de publicar; abordar SEO/recursos/reveals/pendientes del Hero solo en una tarea con autorización para las dependencias protegidas.

## Fuentes primarias de criterio

[Web Interface Guidelines](https://raw.githubusercontent.com/vercel-labs/web-interface-guidelines/main/command.md) se consultó para foco, semántica y formularios. [FFmpeg API](https://ffmpegwasm.netlify.app/docs/api/ffmpeg/classes/ffmpeg/) documenta load, terminate y el código de retorno de exec; se contrastó además el código exacto instalado. [MDN fieldset](https://developer.mozilla.org/en-US/docs/Web/HTML/Reference/Elements/fieldset) respalda el estado disabled de sus controles. Los hallazgos concretos proceden del código y las pruebas locales.

## Relacionado

[[Prompt-Auditoria-Web]] · [[Hallazgos-y-Pendientes]] · [[Comandos-y-Pruebas]] · [[Formularios]] · [[Conversor-de-Video]] · [[04-Accesibilidad-y-Movimiento]]
