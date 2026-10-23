---
tags: [hallazgos, pendientes, operacion]
actualizado: 2026-10-23
fuente: [análisis transversal del código del proyecto]
---

# Hallazgos y excepciones pendientes

Esta tabla prioriza futuras tareas. **No implica que se hayan corregido, ni que exista autorización para implementarlas** — es un registro de lo que se sabe, no una lista de trabajo aprobada.

La ronda autorizada del 10 de octubre está en [[Auditoria-Web]], con IDs, evidencia, cambios locales verificados y propuestas sin aplicar. Ese informe distingue riesgos del cambio y severidad; los pendientes protegidos se conservan.

## Prioridad Alta

| Hallazgo | Evidencia / actuación mínima propuesta | Nota relacionada |
|---|---|---|
| Formularios sin envío real | `submit.ts`; su estado ya se aclara antes de los campos. Destino real requiere decisión aparte | [[Formularios]] |
| Proyectos sin contenido real | `projects.items`; añadir proyectos reales y definir enlaces cuando existan | [[Otras-Secciones-y-Compartidos]] |

## Prioridad Media

| Hallazgo | Evidencia / actuación mínima propuesta | Nota relacionada |
|---|---|---|
| Regla del retrato tablet ausente en el CSS generado | Comentario mal delimitado en Hero (líneas ~1633–1727); corregir delimitadores y probar en tablet | [[03-Sistema-de-Diseno|Sistema-de-Diseno]], [[Hero-y-Sidebar]] |
| Reveals invisibles sin JS | `.rd-reveal`; establecer una mejora progresiva con contenido visible por defecto | [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] |
| Modo estático depende del historial de resize | `evaluateMode`, rama `else if`; comprobar tanto carga directa como transición entre modos | [[Hero-y-Sidebar]] |
| Navegación secundaria limitada en móvil | SimpleNav oculta la lista a ≤700px; solo queda el enlace de marca | [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]] |
| Peso elevado de recursos utilizados | Fondo alternativo ~2,34MB, wordmark ~1,99MB e iconos; optimizar los recursos que sí se usan | [[Recursos-Estaticos]] |
| FAQ provisional y referencias desactualizadas | `faq.items[1]` placeholder; `[2]` menciona Drive retirado de About y `[3]` formulario simulado. Propuesta A15 | [[Contenido-por-Seccion]], [[Auditoria-Web]] |
| Rutas CSS no preparadas para `base` | Fondo del Hero y `@font-face` con rutas absolutas; revisar si se despliega bajo subcarpeta | [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]], [[03-Sistema-de-Diseno|Sistema-de-Diseno]] |
| Metadatos sociales/dominio sin configurar | Layout/config; definir según publicación real | [[05-SEO-Comunicaciones-Persistencia|SEO-Comunicaciones-Persistencia]] |
| Contenido de Servicios y Tools sin actualizar tras separarlas | Las etiquetas «Servicios»/«Tools» repiten el título gráfico; el texto procede de la sección combinada. Siguiente tarea acordada | [[Contenido-por-Seccion]], [[Otras-Secciones-y-Compartidos]] |

## Prioridad Baja

| Hallazgo | Evidencia / actuación mínima propuesta | Nota relacionada |
|---|---|---|
| Inglés incompleto y sin publicar | Falta `hero.personalNote`; verificar contratos y etiquetas antes de crear rutas. Tampoco hay títulos gráficos EN para las cinco secciones (usan la tarjeta de texto) | [[Bilingue-ES-EN]] |
| Comentarios históricos contradicen el código actual | Fuente editorial sí presente, About warm, CTA final eliminado, uso de Lucide, raster de marca | [[00-Empieza-Aqui]] |
| Código y contenido no usados | Teasers, `ClosingStatement`, `fitWordmarkWidth`, `siteName`/SEO auxiliar según consumidor | [[Otras-Secciones-y-Compartidos]], [[Hero-y-Sidebar]] |
| Diagnósticos ruidosos del check | Se analiza JS generado de `public/ffmpeg`; 126 hints, sin errores | [[Comandos-y-Pruebas]] |
| Limpieza para una posible navegación parcial futura | Listeners y observers fuera del contexto de GSAP; no hay `ClientRouter` hoy | [[Hero-y-Sidebar]] |

> [!note]
> Una FAQ con cuatro preguntas no es un defecto por no tener cinco. No se necesitan mapas, reseñas, esquema de negocio local ni pagos para que este portfolio cumpla su función — esas exigencias genéricas de una auditoría anterior quedaron descartadas.

## Resueltos el 10 de octubre de 2026

- Corrección posterior autorizada del conversor: A08 (núcleo ESM), A09 (cachés Vite separadas), A10–A13 (cancelación desde carga, selecciones antiguas invalidadas, salida comprobada y limpieza al desmontar). Seis pruebas del motor real correctas con vídeo sintético; MP3/MP4 decodificables y MP3 descargado desde preview. Ver [[Conversor-de-Video]] y [[Comandos-y-Pruebas]]. No se midió rendimiento de archivos grandes ni se probó hosting final.
- A01: correo dentro de 320px, sin overflow.
- A02/A03: mensajes y foco accesibles; bloqueo de envío durante loading.
- A04/A05: campos/submit disabled sin scripts y aviso previo de simulación.
- A06: contraste de textos, etiquetas, errores y botones, con overrides locales.
- A07: ejemplo de Tools h2→h3.
- Al cerrar la auditoría: check/build pasan; 91 referencias locales válidas, cuatro rutas en cinco anchos y zonas protegidas idénticas al working tree inicial. Conversión/descarga aún estaban bloqueadas por A08; esa situación se corrigió en la intervención posterior descrita arriba.

## Resueltos el 6 de octubre de 2026

- Avisos de opciones esbuild obsoletas: actualización a Astro 7.3.5 y @astrojs/react 7.0.0; check, build y arranque dev sin esos avisos.
- Error de escaneo de dependencias en HeroExperience: el escáner interpretaba menciones literales de la etiqueta de apertura de script dentro de comentarios como bloques ejecutables. Se sustituyeron únicamente esas menciones por texto, conservando el bloque real y la lógica.
- Auditoría npm: fast-uri 3.1.8 y http-cache-semantics 4.3.0, actualizaciones transitivas compatibles; npm audit fix terminó con 0 vulnerabilidades notificadas.
## Relacionado

[[00-Empieza-Aqui]] · [[Comandos-y-Pruebas]]
