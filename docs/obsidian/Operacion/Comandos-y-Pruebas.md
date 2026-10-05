---
tags: [operacion, comandos, testing]
actualizado: 2026-10-06
fuente: [package.json, scripts/copy-ffmpeg-core.mjs]
---

# Comandos y recorrido de pruebas

## Comandos del proyecto

Ejecutar desde `C:\Users\jesus\OneDrive\Escritorio\portfolio-web-chiissuu`:

```powershell
npm run dev
npm run check
npm run build
npm run preview
npm run copy:ffmpeg-core
```

`dev` inicia Astro. `preview` sirve el build ya existente — **no** sustituye al build, si no se ha compilado antes sirve lo que hubiera de una vez anterior. `npm run astro -- <comando>` expone la CLI de Astro directamente. En una instalación nueva, `npm ci` usa el lockfile y ejecuta `postinstall` automáticamente.

[copy-ffmpeg-core.mjs](../../../scripts/copy-ffmpeg-core.mjs) copia desde `node_modules/@ffmpeg/core/dist/umd/` el JS y el WASM a `public/ffmpeg/`. Crea el destino si no existe y **sobrescribe** esos dos archivos si ya estaban. Si falta el directorio fuente, avisa y retorna sin fallar la instalación; si falta solo un archivo, lo salta y avisa igual. Esto significa que hay que comprobar manualmente que ambos recursos existan después de instalar, aunque `npm install` termine en verde — un archivo anterior podría quedarse si falta su reemplazo.

Al publicar, `dist/` debe incluir las cuatro rutas, `_astro/`, `assets/` y `ffmpeg/`. Omitir el WASM permite que la página cargue pero rompe la conversión. No hay backend que arrancar aparte del propio servidor estático. `node_modules` debe instalarse en la misma plataforma donde se compila — una instalación hecha en Windows puede no servir en Linux por bindings nativos.

## Última ejecución registrada (10 de septiembre de 2026)

| Verificación | Resultado |
|---|---|
| Node / npm | v24.17.0 / 11.13.0 |
| `npm run check` | Código 0; 42 archivos, 0 errores, 0 warnings, 126 hints |
| `tsc --noEmit --pretty false` | Sin diagnósticos |
| `npm run build` | Código 0; cuatro páginas estáticas generadas en 4,40s |
| CSS generado | Confirmado el ajuste 900–1399; confirmada la ausencia de los valores de retrato tablet 641–899 (ver [[Sistema-de-Diseno]]) |
| Comparación con recovery | Diferencias descritas en [[00-Empieza-Aqui]] |
| Referencias locales del HTML generado | 66 referencias absolutas de href/src comprobadas, ninguna ausente |
| `git diff --check` | Sin errores de espacios; Git avisa de normalización futura LF/CRLF en los archivos ya modificados |

El primer intento de `check` en el entorno restringido falló con `EPERM` al crear `AppData/Roaming/astro/Config` — se repitió con permiso de ejecución fuera del sandbox y terminó bien; **no es un defecto del código**. Los avisos de Vite sobre opciones `esbuild` obsoletas aparecen durante check/build aunque el resumen final de Astro diga 0 warnings. Los 126 hints incluyen código generado de FFmpeg y una variable no usada del menú — no son 126 errores de la aplicación.

Esta ejecución **no** incluyó: conversión real en navegador, comprobación visual multi-viewport, lector de pantalla, ni medición de rendimiento. No se ha desplegado, hecho commit, push, instalado dependencias ni modificado código fuente como parte de esa revisión.

## Recorrido de prueba manual para próximos cambios

1. Cargar las cuatro rutas y verificar título, recursos y enlaces. En portada, recorrer las seis secciones y volver arriba.
2. Probar la entrada del Hero en scroll 0, con URL con ancla, con scroll antes de cargar fuentes, y con scroll durante la entrada. Revisar la frontera Hero/About y los temas independientes del sidebar (ver [[Hero-y-Sidebar]]).
3. Comprobar en 390×844, 768×1024, 900px de anchura, 1280×720, 1366×768, 1440×900 y escritorio ancho; probar resize cruzando 899/900px y alturas 850/950px.
4. Abrir el menú móvil con teclado: circular Tab/Shift+Tab, Escape, clic fuera, seleccionar un enlace, y resize con el menú abierto. Confirmar que el fondo se desbloquea correctamente.
5. Activar movimiento reducido antes de recargar y también durante la sesión; desactivar JS para revisar los reveals y el fallback de formularios (ver [[Accesibilidad-y-Movimiento]] y [[Formularios]]).
6. Formularios: campo vacío, solo espacios, email inválido, envío válido, campos opcionales, envío repetido, y qué pasa si el futuro backend rechaza la petición. No esperar recibir un correo real con el stub actual.
7. Conversor: archivo vacío, formato no admitido, límites exactos y superiores, metadatos no legibles, selección rápida de dos archivos, MP3 en los tres bitrates, y MP4; reproducir las descargas resultantes (ver [[Conversor-de-Video]]).
8. Cancelar durante la descarga del motor y durante la conversión; reintentar, resetear, repetir el mismo archivo, comprobar el aviso de memoria, y bloquear los recursos del motor para provocar el error de carga.

## Cómo mantener este vault al día

Actualizar junto al cambio de código: rutas, contratos, límites, estados, fuentes y hallazgos afectados. Volver a medir antes de copiar resultados de build o tamaños de archivo — no asumir que siguen igual. El contenido de [[Contenido-por-Seccion]] es una instantánea de `site.js`: al editar ese archivo, hay que regenerar o actualizar la nota — nunca debe convertirse en una segunda fuente de la aplicación. No dejar un hallazgo marcado como abierto en [[Hallazgos-y-Pendientes]] cuando el código y una prueba pertinente ya confirmen que está resuelto.

## Relacionado

[[Arquitectura-y-Stack]] · [[Hallazgos-y-Pendientes]] · [[Hero-y-Sidebar]] · [[Conversor-de-Video]]
