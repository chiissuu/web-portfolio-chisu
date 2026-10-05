---
tags: [inventario, assets]
actualizado: 2026-10-06
fuente: [public/assets, public/ffmpeg]
---

# Recursos estáticos

Tamaños exactos en bytes, tomados el 10 de septiembre de 2026. Todos los recursos de `public/` se copian al build aunque una página no los use — que un archivo aparezca en `dist/` no implica que se descargue al visitar la portada.

| Recurso | Bytes | Uso actual |
|---|---:|---|
| [public/assets/fonts/PPNeueMontreal-Book.woff2](../../../public/assets/fonts/PPNeueMontreal-Book.woff2) | 27.516 | Fuente editorial local |
| [public/assets/icons/logo-chiissuu.png](../../../public/assets/icons/logo-chiissuu.png) | 58.092 | Favicon |
| [public/assets/images/hero-background-gold-alternative.png](../../../public/assets/images/hero-background-gold-alternative.png) | 2.341.187 | Fondo activo del Hero mediante CSS |
| [public/assets/images/hero-background-gold.png](../../../public/assets/images/hero-background-gold.png) | 4.666.957 | Variante conservada, sin referencia activa encontrada |
| [public/assets/images/hero-wordmark-gold.png](../../../public/assets/images/hero-wordmark-gold.png) | 1.991.664 | Marca del Hero y sidebar |
| [public/assets/images/profile-cutout-alt.png](../../../public/assets/images/profile-cutout-alt.png) | 143.795 | Retrato activo, provisional |
| [public/assets/images/profile-cutout-trimmed.png](../../../public/assets/images/profile-cutout-trimmed.png) | 33.175 | Retrato alternativo conservado, sin referencia activa |
| [public/assets/images/profile-cutout.png](../../../public/assets/images/profile-cutout.png) | 44.383 | Retrato alternativo conservado, sin referencia activa |
| [public/assets/skills/c.png](../../../public/assets/skills/c.png) | 23.215 | Icono decorativo de habilidad |
| [public/assets/skills/canva.png](../../../public/assets/skills/canva.png) | 342.330 | Icono decorativo de habilidad |
| [public/assets/skills/cpp.png](../../../public/assets/skills/cpp.png) | 75.646 | Icono decorativo de habilidad |
| [public/assets/skills/css.png](../../../public/assets/skills/css.png) | 5.623 | Icono decorativo de habilidad |
| [public/assets/skills/docker.png](../../../public/assets/skills/docker.png) | 9.800 | Icono decorativo de habilidad |
| [public/assets/skills/gimp.png](../../../public/assets/skills/gimp.png) | 753.558 | Icono decorativo de habilidad |
| [public/assets/skills/git.png](../../../public/assets/skills/git.png) | 33.033 | Icono decorativo de habilidad |
| [public/assets/skills/github.svg](../../../public/assets/skills/github.svg) | 968 | Icono decorativo de habilidad |
| [public/assets/skills/html.png](../../../public/assets/skills/html.png) | 28.161 | Icono decorativo de habilidad |
| [public/assets/skills/java.png](../../../public/assets/skills/java.png) | 16.703 | Icono decorativo de habilidad |
| [public/assets/skills/javascript.png](../../../public/assets/skills/javascript.png) | 13.662 | Icono decorativo de habilidad |
| [public/assets/skills/jupyter.png](../../../public/assets/skills/jupyter.png) | 38.757 | Icono decorativo de habilidad |
| [public/assets/skills/linux.png](../../../public/assets/skills/linux.png) | 117.457 | Icono decorativo de habilidad |
| [public/assets/skills/mariadb.png](../../../public/assets/skills/mariadb.png) | 33.648 | Icono decorativo de habilidad |
| [public/assets/skills/matplotlib.png](../../../public/assets/skills/matplotlib.png) | 1.606 | Icono decorativo de habilidad |
| [public/assets/skills/mongodb.png](../../../public/assets/skills/mongodb.png) | 20.651 | Icono decorativo de habilidad |
| [public/assets/skills/mysql.png](../../../public/assets/skills/mysql.png) | 270.792 | Icono decorativo de habilidad |
| [public/assets/skills/nodejs.png](../../../public/assets/skills/nodejs.png) | 12.612 | Icono decorativo de habilidad |
| [public/assets/skills/numpy.png](../../../public/assets/skills/numpy.png) | 14.084 | Icono decorativo de habilidad |
| [public/assets/skills/pandas.png](../../../public/assets/skills/pandas.png) | 5.284 | Icono decorativo de habilidad |
| [public/assets/skills/photopea.png](../../../public/assets/skills/photopea.png) | 302.258 | Icono decorativo de habilidad |
| [public/assets/skills/photoshop.png](../../../public/assets/skills/photoshop.png) | 27.934 | Icono decorativo de habilidad |
| [public/assets/skills/php.png](../../../public/assets/skills/php.png) | 287.289 | Icono decorativo de habilidad |
| [public/assets/skills/postgresql.png](../../../public/assets/skills/postgresql.png) | 126.097 | Icono decorativo de habilidad |
| [public/assets/skills/python.png](../../../public/assets/skills/python.png) | 8.511 | Icono decorativo de habilidad |
| [public/assets/skills/scikit-learn.png](../../../public/assets/skills/scikit-learn.png) | 4.156 | Icono decorativo de habilidad |
| [public/assets/skills/seaborn.png](../../../public/assets/skills/seaborn.png) | 70.810 | Icono decorativo de habilidad |
| [public/assets/skills/windows.png](../../../public/assets/skills/windows.png) | 155.935 | Icono decorativo de habilidad |
| `public/ffmpeg/ffmpeg-core.js` | 112.059 | Motor generado; carga bajo demanda — no versionado, ver [[Arquitectura-y-Stack]] |
| `public/ffmpeg/ffmpeg-core.wasm` | 32.232.419 | WASM generado; carga bajo demanda — no versionado |

Los dos archivos de `public/ffmpeg/` no están en el repositorio Git (los regenera `npm run copy:ffmpeg-core`) — por eso no llevan enlace de archivo, a diferencia del resto de la tabla.

Los skills de Astro, GSAP y n8n (mencionados en [[Contenido-por-Seccion]]) no tienen icono — se muestran solo como texto, por lo que no aparecen en esta tabla de recursos.

El hallazgo de "peso elevado de recursos utilizados" (fondo alternativo ~2,34MB, wordmark ~1,99MB) está registrado en [[Hallazgos-y-Pendientes]].

## Relacionado

[[Archivos-del-Proyecto]] · [[Hallazgos-y-Pendientes]] · [[Sobre-Mi]]
