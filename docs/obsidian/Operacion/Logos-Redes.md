---
tags: [recursos, logos, redes, sidebar]
actualizado: 2026-10-23
---

# Logos de redes del sidebar

Tres PNG locales transparentes de 96×96 para acompañar los nombres LinkedIn, GitHub y Redes Sociales. Este último utiliza la marca de Linktree porque identifica el destino existente del enlace. Las etiquetas y los destinos no se sustituyen por imágenes.

## Fuentes y licencias

| Archivo en `public/assets/icons/social/` | Silueta utilizada | Licencia del recurso |
|---|---|---|
| `linkedin-gold.png` | [LinkedIn plain, Devicon](https://raw.githubusercontent.com/devicons/devicon/7330accdbc47e2dc0c19789a48533c4a3c50fe58/icons/linkedin/linkedin-plain.svg), commit `7330accdbc47e2dc0c19789a48533c4a3c50fe58` | [MIT](https://github.com/devicons/devicon/blob/7330accdbc47e2dc0c19789a48533c4a3c50fe58/LICENSE), Copyright (c) 2015 konpa |
| `github-gold.png` | SVG existente `public/assets/skills/github.svg`; marca [mark-github de GitHub Octicons](https://primer.style/octicons/icon/mark-github-16/). Se conserva su viewBox y `transform="scale(64)"` | [MIT de Octicons](https://github.com/primer/octicons/blob/main/LICENSE), Copyright (c) 2026 GitHub Inc. |
| `linktree-gold.png` | [Linktree, Simple Icons](https://raw.githubusercontent.com/simple-icons/simple-icons/c71c69e3a27e4436936b831c72643e6513b9f49b/icons/linktree.svg), commit `c71c69e3a27e4436936b831c72643e6513b9f49b` | [CC0 1.0 Universal](https://github.com/simple-icons/simple-icons/blob/c71c69e3a27e4436936b831c72643e6513b9f49b/LICENSE.md) |

Los enlaces de licencia conservan los avisos y condiciones originales de cada colección. Las marcas pertenecen a sus titulares; su presencia identifica enlaces a los perfiles y no implica afiliación, patrocinio ni que el acabado dorado sea una variante oficial.

## Tratamiento y validación

Se reutilizan las siluetas vectoriales sin inventar logos ni modificar sus proporciones. Cada viewBox se ajusta uniformemente a 84×84 dentro de un lienzo de 96×96, con 6px de margen. Una máscara mantiene la transparencia y los huecos originales. El material usa `#c19b3d` como oro base, `#dfc357` como luz, `#b08a32` como sombra y `#efd683` como reflejo de borde, con un bisel interior y grano horizontal discretos. Es una rasterización de SVG con Sharp ya disponible, sin IA generativa, instalaciones ni dependencias nuevas.

| Archivo | Tamaño | Píxeles totalmente transparentes |
|---|---:|---:|
| `linkedin-gold.png` | 7.664 bytes | 4.147 |
| `github-gold.png` | 7.314 bytes | 5.924 |
| `linktree-gold.png` | 5.935 bytes | 6.364 |

Los tres archivos se decodifican como PNG de 96×96 con canal alfa. La comparación de su alfa con la rasterización de la silueta fuente, usando la misma escala, da diferencia máxima 0 en los tres: el acabado cambia el color, no el contorno ni los huecos. Se revisó una muestra ampliada y otra a 20px sobre carbón. Para accesibilidad se deben integrar como imágenes decorativas con alt vacío y mantener el nombre visible del enlace.

El script de preparación, los SVG intermedios, la vista previa y `social-gold-validation.json` se conservan en `C:\Users\jesus\.codex\visualizations\2026\09\10\01a08adb-b7e2-7893-81b8-f4d1c3a19596`; no son dependencias del proyecto ni se necesitan en producción. No se modifican los SVG existentes.

Relacionado: [[Hero-y-Sidebar]] · [[Recursos-Estaticos]] · [[Logos-Stack]].
