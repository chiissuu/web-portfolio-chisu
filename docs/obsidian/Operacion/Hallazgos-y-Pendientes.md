---
tags: [hallazgos, pendientes, operacion]
actualizado: 2026-10-06
fuente: [análisis transversal del código del proyecto]
---

# Hallazgos y excepciones pendientes

Esta tabla prioriza futuras tareas. **No implica que se hayan corregido, ni que exista autorización para implementarlas** — es un registro de lo que se sabe, no una lista de trabajo aprobada.

## Prioridad Alta

| Hallazgo | Evidencia / actuación mínima propuesta | Nota relacionada |
|---|---|---|
| Formularios sin envío real | `submit.ts`; conectar un destino real o aclarar su estado antes de invitarlos como contacto | [[Formularios]] |
| Fallback sin JS puede poner datos de formulario en la URL | Forms sin `action`/`method` y con `novalidate`; definir comportamiento seguro sin JS | [[Formularios]] |
| Proyectos sin contenido real | `projects.items`; añadir proyectos reales y definir enlaces cuando existan | [[Otras-Secciones-y-Compartidos]] |

## Prioridad Media

| Hallazgo | Evidencia / actuación mínima propuesta | Nota relacionada |
|---|---|---|
| Regla del retrato tablet ausente en el CSS generado | Comentario mal delimitado en Hero (líneas ~1633–1727); corregir delimitadores y probar en tablet | [[Sistema-de-Diseno]], [[Hero-y-Sidebar]] |
| Cancelación durante carga del motor no garantizada | Asignación tardía de `ffmpegInstance`; abortar la carga o comprobar cancelación antes de convertir | [[Conversor-de-Video]] |
| Reveals invisibles sin JS | `.rd-reveal`; establecer una mejora progresiva con contenido visible por defecto | [[Accesibilidad-y-Movimiento]] |
| Modo estático depende del historial de resize | `evaluateMode`, rama `else if`; comprobar tanto carga directa como transición entre modos | [[Hero-y-Sidebar]] |
| Check de salida de FFmpeg incompleto | Código de `exec()` ignorado, salida no validada | [[Conversor-de-Video]] |
| Lecturas de metadatos concurrentes | Sin identificador de selección; descartar respuestas antiguas al seleccionar rápido | [[Conversor-de-Video]] |
| Navegación secundaria limitada en móvil | SimpleNav oculta la lista a ≤700px; solo queda el enlace de marca | [[Rutas-y-Navegacion]] |
| Peso elevado de recursos utilizados | Fondo alternativo ~2,34MB, wordmark ~1,99MB e iconos; optimizar los recursos que sí se usan | [[Recursos-Estaticos]] |
| FAQ provisional y mención del formulario | `faq.items[1]` y `[3]`; ajustar el contenido a la disponibilidad real | [[Contenido-por-Seccion]] |
| Rutas CSS no preparadas para `base` | Fondo del Hero y `@font-face` con rutas absolutas; revisar si se despliega bajo subcarpeta | [[Rutas-y-Navegacion]], [[Sistema-de-Diseno]] |
| Metadatos sociales/dominio sin configurar | Layout/config; definir según publicación real | [[SEO-Comunicaciones-Persistencia]] |

## Prioridad Baja

| Hallazgo | Evidencia / actuación mínima propuesta | Nota relacionada |
|---|---|---|
| Inglés incompleto y sin publicar | Falta `hero.personalNote`; verificar contratos y etiquetas antes de crear rutas | [[Bilingue-ES-EN]] |
| Comentarios históricos contradicen el código actual | Fuente editorial sí presente, About warm, CTA final eliminado, uso de Lucide, raster de marca | [[00-Empieza-Aqui]] |
| Código y contenido no usados | Teasers, `ClosingStatement`, `fitWordmarkWidth`, `siteName`/SEO auxiliar según consumidor | [[Otras-Secciones-y-Compartidos]], [[Hero-y-Sidebar]] |
| Diagnósticos ruidosos del check | Se analiza JS generado de `public/ffmpeg`; 126 hints, sin errores | [[Comandos-y-Pruebas]] |
| Avisos de integración Vite | Opciones `esbuild` obsoletas indicadas por el plugin React; no cambiar dependencias sin tarea específica | [[Arquitectura-y-Stack]] |
| Limpieza para una posible navegación parcial futura | Listeners y observers fuera del contexto de GSAP; no hay `ClientRouter` hoy | [[Hero-y-Sidebar]] |

> [!note]
> Una FAQ con cuatro preguntas no es un defecto por no tener cinco. No se necesitan mapas, reseñas, esquema de negocio local ni pagos para que este portfolio cumpla su función — esas exigencias genéricas de una auditoría anterior quedaron descartadas.

## Relacionado

[[00-Empieza-Aqui]] · [[Comandos-y-Pruebas]]
