---
tags: [operacion, auditoria, contacto, diseno, formularios, accesibilidad]
actualizado: 2026-10-23
fuente: [src/components/ContactSection.astro, src/components/ContactForm.astro, comprobaciones locales]
---

# Auditoría y rediseño de Contacto — 23 de octubre de 2026

Objetivo: acercar Contacto (color de fondo, tipografía y organización) al resto de la página ya cerrada (nav, Hero, Sobre mí) y a Servicios/Tools. Alcance: solo `ContactSection.astro` y los estilos de `ContactForm.astro`. No se cambió ningún texto, dato ni la lógica del formulario (validación, foco, estados y envío simulado); Hero, About, Layout y el formulario de `/servicios/` no se tocaron.

## Hallazgos (estado previo, medido en 1280×800)

| # | Hallazgo | Consecuencia |
|---|---|---|
| 1 | Era la **única sección clara** (beige #d5cfbe, `section-theme-warm`) | Dos cortes secos (grafito de Tools → beige y beige → negro de FAQ) y el sidebar cambiaba a su tema claro solo aquí |
| 2 | Tipografía distinta: etiquetas de campo en JetBrains Mono de 0,78rem, texto de apoyo en gris frío, etiqueta «CONTACTO» repetida sobre el título gráfico | Registro «técnico» ajeno a Inter/Space Grotesk del resto; duplicación ya eliminada en Servicios/Tools |
| 3 | Organización en una sola columna de 5 bloques: tres tarjetas sociales, texto, formulario sin contenedor (campos blancos), y el correo al final tras una línea | El camino más corto para contactar (correo y redes) quedaba lejos y separado del formulario; los campos blancos no seguían el lenguaje de tarjetas |
| 4 | Botones y enlaces: píldora dorada plana para el correo y píldora de acento marrón (#8a6a1f) para enviar | Dos acabados distintos del metal dorado del nav y de las flechas de las tarjetas |
| 5 | Todo con `.rd-reveal`: invisible sin JavaScript (pendiente conocido A16) | Servicios, Tools y Sobre mí ya eran visibles de inmediato |
| 6 | Contrastes de la versión clara obtenidos con *overrides* locales (auditoría de octubre) | Al oscurecer la sección había que recalcularlos; se midieron de nuevo |

## Decisiones aplicadas

- **Fondo:** grafito cálido #24221f con el grano de 0,8 % (la receta de About y Servicios/Tools). Entra sin corte desde Tools y termina con un fundido a #050505 (`clamp(8rem, 16svh, 12rem)`), que es donde empieza FAQ. Tema `section-theme-dark` con las variables `--theme-*` de About y `color-scheme: dark` (selectores y barras nativos oscuros). El sidebar pasa a su tema oscuro también sobre Contacto (mecanismo genérico, sin tocar el Hero).
- **Título:** el PNG con el halo dorado estático de Servicios/Tools; se elimina la etiqueta repetida «CONTACTO» (`contact.eyebrow` queda en los datos sin usar). El texto de apoyo pasa a ser un párrafo de entrada en Inter, como el de Servicios/Tools.
- **Organización:** dos columnas desde 1100px y una por debajo. Izquierda, el **formulario** como panel de tarjeta (superficie, borde y radio 14px como las tarjetas); derecha, los **canales directos**: la frase sobre el correo, el correo (icono Mail de Lucide, el de los iconos del nav), y LinkedIn, GitHub y Redes Sociales con sus logos dorados del sidebar, como filas del mismo estilo. El orden del DOM es formulario → canales, así que el orden de tabulación coincide con el visual. Dentro del panel, los campos pasan a una columna cuando el propio panel mide menos de 340px (container query), con independencia del ancho de la página.
- **Tipografía:** Inter para etiquetas (0,86rem, 600), campos (0,95rem), mensajes y estado; Space Grotesk queda para títulos de las secciones. Se retira el monoespaciado de las etiquetas.
- **Color y estados:** campos con relleno `rgb(255 255 255 / 5%)` y **borde al 50 %** (los controles necesitan ≥3:1 contra el grafito; el borde de la tarjeta al 18 % es solo decorativo); foco con contorno dorado de 2px; error y borde inválido #ff9db9; éxito en dorado; aviso del formulario con filete dorado a la izquierda.
- **Botón de enviar:** metal dorado (#dfc357 / #c19b3d / #b08a32 con borde #efd683), el mismo de las flechas de las tarjetas y del nav, con texto #1a1406. Las filas de canales se elevan 3px y toman borde dorado al pasar el ratón, como las tarjetas; LinkedIn sigue siendo un `span` deshabilitado y enfocable con tooltip, sin URL.
- **Sin `.rd-reveal`:** todo visible sin JavaScript. El formulario sigue deshabilitado hasta que el script instala su manejador.

## Contraste calculado (sobre #24221f)

| Elemento | Relación |
|---|---|
| Etiquetas y texto de apoyo (#adb2b6) | 7,42:1 |
| Mensajes de error (#ff9db9) | 8,14:1 |
| Texto de los canales (#f3f4f5) | 14,41:1 |
| Texto del botón (#1a1406 sobre #c19b3d) | 7,0:1 |
| Borde de los campos (50 %) | ≈3,4:1 (cálculo, no medición en pantalla) |

## Verificación

- `npm run check`: 47 archivos, 0 errores, 0 avisos, 126 hints. `npm run build`: cuatro páginas, código 0.
- Compilación de producción en navegador: 1280, 1024, 390 y 320px sin desbordamiento horizontal. En 1280px formulario de 2 columnas dentro del panel (439px) y canales a la derecha (338px), con el correo en una línea; en 320px el correo ocupa dos líneas dentro de su fila. Envío con campos vacíos: errores por campo, foco en el primero, contrastes de la tabla. Sidebar con «Contacto» iluminado y tema oscuro sobre la sección. Frontera Tools → Contacto sin corte (hueco de 0px).
- Límites: no se probó el hover/foco con ratón y teclado reales ni el tooltip de LinkedIn, el movimiento reducido ni un lector de pantalla; el panel del navegador iba oculto (la entrada del Hero tarda 8 s en liberar el scroll en ese entorno). No se envió un formulario válido ni se probó el autorrelleno del navegador (queda cubierto por `color-scheme: dark`, sin verificar).

## Pendientes y recomendaciones

1. La receta de fondo grafito (#24221f + grano) está ya en tres sitios (About, `ShowcaseSection`, Contacto): centralizarla en un token de `Layout.astro` cuando se pueda tocar esa dependencia.
2. FAQ conserva su etiqueta sobre el título gráfico y su degradado oscuro propio; si se quiere el mismo criterio, aplicar lo mismo que aquí (quitar etiqueta y usar la receta grafito con fundido).
3. El correo (`mailto:`) sigue siendo el único canal real; el formulario continúa simulado (ver [[Formularios]]).

## Relacionado

[[Otras-Secciones-y-Compartidos]] · [[03-Sistema-de-Diseno|Sistema-de-Diseno]] · [[Formularios]] · [[Auditoria-Servicios-Tools]] · [[Auditoria-Sobre-Mi]]
