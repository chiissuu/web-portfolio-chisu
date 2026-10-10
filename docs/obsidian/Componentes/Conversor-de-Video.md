---
tags: [componente, video-converter, ffmpeg, react]
actualizado: 2026-10-10
fuente: [src/components/VideoConverter, src/lib/videoConverter]
---

# Conversor de vídeo

Fuentes: [VideoConverter.tsx](../../../src/components/VideoConverter/VideoConverter.tsx), [ffmpegClient.ts](../../../src/lib/videoConverter/ffmpegClient.ts), [utils.ts](../../../src/lib/videoConverter/utils.ts), [constants.ts](../../../src/lib/videoConverter/constants.ts).

Es la única parte del sitio que usa React, y la única con lógica de negocio no trivial. Todo ocurre en el navegador — no hay subida de vídeo a ningún servidor.

> [!important] Corrección posterior a la auditoría del 10 de octubre
> El núcleo ahora se copia desde ESM y el Worker lo importa desde URLs del propio sitio. Seis pruebas con el motor real pasan: carga/reutilización, MP3 y MP4 decodificables, archivo corrupto con reintento, cancelación durante carga y conversión con recarga/reintento. También se descargó un MP3 desde la interfaz de preview. A09 se diagnosticó como runtime JSX de producción dentro de la caché compartida de Vite; las cachés dev/build se separan en la configuración. No se validaron archivos grandes, dispositivos reales o hosting final. Ver [[Comandos-y-Pruebas]].

La auditoría corrigió contraste en el CSS Module. La intervención posterior ajustó TSX, el wrapper y la copia del núcleo; conserva límites, formatos, comandos de conversión y contratos de contenido.

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

La librería y utilidades de FFmpeg se importan dinámicamente **al iniciar una conversión**, no al seleccionar el archivo. `getFFmpeg()` reutiliza una instancia y una promesa de carga compartidas entre conversiones. Los archivos ESM del motor se obtienen del propio sitio en `/ffmpeg/` (con `withBase` y URL absoluta). No se crean copias Blob del núcleo. Se conserva también la instancia que todavía está cargando para poder terminarla.

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
- Cancelar invalida la operación y llama `terminate()` sobre la instancia cargada o todavía en carga. La UI vuelve inmediatamente a `file-ready` con aviso de cancelación. El siguiente intento carga un motor nuevo; una promesa antigua no puede publicarlo ni borrar la promesa de una carga posterior.
- Errores de carga muestran `engineLoadFailed`; de conversión, `conversionFailed`; de concurrencia, `alreadyConverting`. En todos los casos se conserva el archivo seleccionado para reintentar.
- `exec()` debe devolver cero y el archivo de salida debe tener bytes; en otro caso se rechaza la conversión y no se ofrece una descarga parcial como completada.
- El bloque `finally` intenta borrar el input y el output virtuales incluso si la conversión falló. El bloqueo global se mantiene hasta terminar esa limpieza. Los errores de borrado se silencian, porque el Worker puede haber terminado ya.
- La URL de objeto del resultado se revoca al reemplazarla, al resetear, o al desmontar la isla. Las URLs de metadatos también se revocan. Al desmontar se termina el motor y se invalidan las respuestas pendientes; el núcleo ya no utiliza URLs Blob internas.
- Reset borra archivo, nota, progreso y resultado, pero conserva el formato y bitrate ya elegidos. No termina el Worker ya cargado ni obliga a descargarlo de nuevo.

## Selección y límites de las pruebas

Cada selección lleva un contador: después de leer metadatos se descartan resultados antiguos si se seleccionó otro archivo, se reseteó o se desmontó. El aviso de memoria se limpia al empezar una selección. Estos dos cambios y el desmontaje se contrastaron en código; las seis pruebas del motor no simulan esos eventos de React.

En el estado `done`, los ajustes vuelven a estar habilitados. Cambiarlos **no** reconvierte el resultado ya generado; para otro proceso hay que usar reset explícitamente. La duración desconocida sigue permitiendo convertir con aviso, y la memoria disponible sigue siendo una heurística. No hay garantía de rendimiento o estabilidad con vídeos próximos al límite de 200MiB: hace falta probarlos en dispositivos reales.

## Relacionado

[[Hallazgos-y-Pendientes]] · [[01-Arquitectura-y-Stack|Arquitectura-y-Stack]] · [[02-Rutas-y-Navegacion|Rutas-y-Navegacion]]
