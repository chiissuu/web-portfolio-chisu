---
tags: [componente, video-converter, ffmpeg, react]
actualizado: 2026-10-06
fuente: [src/components/VideoConverter, src/lib/videoConverter]
---

# Conversor de vídeo

Fuentes: [VideoConverter.tsx](../../../src/components/VideoConverter/VideoConverter.tsx), [ffmpegClient.ts](../../../src/lib/videoConverter/ffmpegClient.ts), [utils.ts](../../../src/lib/videoConverter/utils.ts), [constants.ts](../../../src/lib/videoConverter/constants.ts).

Es la única parte del sitio que usa React, y la única con lógica de negocio no trivial. Todo ocurre en el navegador — no hay subida de vídeo a ningún servidor.

## Interfaz y estados

[VideoConverterPageContent.astro](../../../src/components/VideoConverterPageContent.astro) monta `<VideoConverter client:only="react" copy={copy} />`. El encabezado es HTML de Astro; la herramienta en sí se crea en el navegador y **no tiene fallback `noscript`** ni contenido alternativo mientras carga la isla.

Máquina de estados: `idle → file-ready → loading-engine → converting → done`. Los errores y avisos son un estado `note` separado, no una etapa `error` dedicada. Formato inicial: MP3 a 192 kbps.

| Componente React | Responsabilidad |
|---|---|
| VideoConverter | Estado, selección, inicio, cancelación, reset, errores y URLs |
| DropZone | Arrastrar/soltar y selector de archivos |
| FileSummary | Nombre, tamaño, duración y extensión/MIME |
| OutputSettings | MP3/MP4 y bitrate MP3 |
| ConversionProgress | Estado, progreso determinado/indeterminado y cancelar |
| ConversionResult | Descargar y empezar con otro archivo |

DropZone toma solo el **primer** archivo si se sueltan varios a la vez. Restablece el valor del input para permitir volver a seleccionar el mismo archivo. Una vez hay un archivo aceptado, la zona de drop se oculta y se ofrece reset — no hay cola ni conversión por lotes.

## Validación exacta

| Condición | Resultado |
|---|---|
| Tamaño 0 | Error `emptyFile` |
| Tamaño > 200×1024×1024 bytes | Error `tooLarge` |
| MIME no empieza por `video/` **y** extensión no reconocida | Error `unsupportedFormat` |
| Duración conocida > 900 segundos | Error `tooLong` |
| Duración desconocida o metadatos ilegibles | Aviso; permite continuar sin comprobar el límite temporal |
| Tamaño > 80×1024×1024 y memoria declarada ≤4GB o viewport ≤899px | Aviso de memoria; no bloquea |

Puntos finos de la validación:
- Los límites son binarios (**MiB**), aunque la interfaz visible escribe "MB". Exactamente 200MiB y 900s se **permiten** (límite inclusivo).
- Extensiones aceptadas: `mp4`, `webm`, `mov`, `mkv`, `avi`, `m4v`, `ogv` — comparación insensible a mayúsculas.
- La validación es **MIME O extensión**, no ambas a la vez: una extensión admitida pasa aunque el MIME sea distinto, y cualquier MIME `video/*` pasa aunque la extensión no esté en la lista. **No** inspecciona la firma real del archivo (magic bytes).
- Los metadatos se leen con un `<video>` oculto + URL de objeto. A los 8 segundos, o ante error, o si la duración no es finita, devuelve `null` (limpia temporizador, fuente y URL). No usa FFprobe para esto.
- Que el navegador no entienda un contenedor no impide necesariamente que FFmpeg sí pueda convertirlo — por eso ese caso es solo un **aviso**, aunque como efecto colateral el límite de 15 minutos deja de estar garantizado en ese caso concreto.
- El aviso de memoria usa `navigator.deviceMemory` cuando existe, y el ancho de viewport como alternativa. Es una heurística basta: el archivo completo, la salida y las copias intermedias en memoria pueden consumir mucho más que el tamaño en disco del archivo original.

## Motor y transformación

La librería y utilidades de FFmpeg se importan dinámicamente **al iniciar una conversión**, no al seleccionar el archivo. `getFFmpeg()` reutiliza una instancia y una promesa de carga compartidas entre conversiones. Los archivos del motor se obtienen del propio sitio en `/ffmpeg/` (con `withBase`) y se convierten en URLs blob para inicializar el Worker.

Se usa `@ffmpeg/core` **monohilo**. No hay configuración de núcleo multihilo ni requisito añadido de SharedArrayBuffer/COOP/COEP por parte de la aplicación. Sí necesita un navegador que permita Worker, WebAssembly, lectura de archivos y URLs de objeto — no hay una comprobación preventiva completa de compatibilidad antes de intentarlo.

El vídeo seleccionado se copia al sistema de archivos virtual como `input.<extensión saneada>` o `input.bin`. Comandos ejecutados:

```text
MP3: -i input.ext -vn -c:a libmp3lame -b:a 128k|192k|256k output.mp3
MP4: -i input.ext -c:v libx264 -c:a aac -movflags +faststart output.mp4
```

MP3 extrae solo el audio; MP4 **recodifica** H.264/AAC — no es un simple cambio de extensión/contenedor. No hay control de resolución, CRF, preset, recorte, selección de pistas, volumen, subtítulos, ni garantía de que el resultado pese menos que el original. El motor puede fallar por códec no soportado, archivo corrupto, ausencia de audio, o memoria insuficiente.

El resultado se lee del FS virtual, se copia a `Uint8Array`, se crea un Blob (`audio/mpeg` o `video/mp4`) y se genera un enlace de descarga. El nombre de salida elimina la extensión original, normaliza acentos, sustituye caracteres no ASCII alfanuméricos/guion/guion bajo, y usa `"video"` como fallback si no queda ningún carácter válido del nombre. **Los nombres originales nunca se interpolan en un comando de shell** — FFmpeg recibe un array de argumentos dentro del Worker, no una cadena construida a mano (esto descarta inyección de comandos por nombre de archivo).

## Progreso, cancelación, errores y limpieza

- Durante la carga del motor se muestra un `<progress>` indeterminado. Durante la conversión, el progreso finito se limita a 0–1 y se presenta redondeado a porcentaje — no es un estimador de tiempo restante.
- Los ajustes se deshabilitan durante carga/conversión. La UI evita iniciar mientras está ocupada, y `runConversion` añade además un bloqueo global `isRunning` que lanza `ConversionInProgressError` si se intenta de nuevo.
- Cancelar marca una referencia interna y llama `terminate()` sobre la instancia compartida si existe. La promesa rechazada resultante devuelve el estado a `file-ready` y muestra el aviso de cancelación; el siguiente intento recarga el motor desde cero.
- Errores de carga muestran `engineLoadFailed`; de conversión, `conversionFailed`; de concurrencia, `alreadyConverting`. En todos los casos se conserva el archivo seleccionado para reintentar.
- El bloque `finally` intenta borrar el input y el output virtuales incluso si la conversión falló. Los errores de ese borrado se silencian, porque el Worker puede haber terminado ya.
- La URL de objeto del resultado se revoca al reemplazarla, al resetear, o al desmontar la isla. Las URLs de metadatos también se revocan. **Las URLs blob internas del núcleo FFmpeg no se revocan explícitamente** en el wrapper actual.
- Reset borra archivo, nota, progreso y resultado, pero conserva el formato y bitrate ya elegidos. No termina el Worker ya cargado ni obliga a descargarlo de nuevo.

## Casos límite no reproducidos en navegador (deducidos del código)

Esta lista viene de leer el código, no de probarlo en vivo — tenerlo presente si se reporta cualquiera de estos como "bug confirmado".

1. **Cancelar mientras carga el motor:** `ffmpegInstance` solo se asigna *después* de `load()`. Si todavía está descargando/inicializando, cancelar no alcanza esa instancia local ni aborta la descarga en curso. El código posterior a `await getFFmpeg()` no vuelve a comprobar si se canceló antes de empezar a convertir — puede seguir adelante pese al clic de cancelar.
2. **Seleccionar dos archivos rápido:** no hay token de invalidación para lecturas de metadatos anteriores. La lectura que termine más tarde puede sobrescribir la selección más reciente del usuario.
3. **Código de salida de FFmpeg ignorado:** el valor numérico que devuelve `exec()` no se comprueba. No se valida que sea cero ni que la salida tenga bytes — una salida parcial podría llegar a ofrecerse como "completada".
4. **Desmontaje del componente:** el efecto de limpieza revoca la URL del resultado, pero no cancela explícitamente una carga o conversión todavía en curso.
5. **Aviso de memoria obsoleto:** empezar a validar un segundo archivo no limpia inmediatamente el aviso del anterior; si el nuevo archivo se rechaza, puede quedar visible el aviso del archivo previo.
6. **Cambiar ajustes tras completar:** en el estado `done`, los ajustes vuelven a estar habilitados. Cambiarlos **no** reconvierte el resultado ya generado — para otro proceso hay que usar reset explícitamente.

Ver [[Hallazgos-y-Pendientes]] para las entradas de prioridad Media relacionadas con esta lista.

## Relacionado

[[Hallazgos-y-Pendientes]] · [[Arquitectura-y-Stack]] · [[Rutas-y-Navegacion]]
