---
tags: [auditoria, tablet, responsive, operacion]
actualizado: 2026-11-17
fuente: [medidas y capturas a 768×1024 y 1024×768 sobre el build de producción]
---

# Auditoría de la versión tableta (17 de noviembre de 2026)

**Solo es un informe: no se ha cambiado nada.** Estado de partida: la web de producción tras cerrar la versión móvil (ver [[Comandos-y-Pruebas]], «Móvil: estado de cierre»).

## Qué es «tableta» en este proyecto

El corte del diseño está en **900 px**: de 641 a 899 px de ancho se usa el menú de hamburguesa y el cajón (sin menú lateral); desde 900 px, el diseño de escritorio con menú lateral. El rango 641–899 px hereda casi todo del móvil o de reglas de escritorio sueltas, sin composición propia.

Formatos para probar en DevTools (Dimensiones → «Responsive» → escribir ancho × alto, o elegir el dispositivo):

| Dispositivo | Tamaño (vertical) | Tramo |
|---|---|---|
| **iPad Mini (el principal para empezar)** | **768 × 1024** | tableta (641–899) |
| iPad 10,2" | 810 × 1080 | tableta |
| iPad Air | 820 × 1180 | tableta |
| iPad Pro 11" | 834 × 1194 | tableta |
| Extremos del tramo | 641 × 900 y 899 × 1200 | tableta |
| iPad Pro 12,9" (vertical) | 1024 × 1366 | **escritorio** (≥ 900) |
| iPads en horizontal | 1024 × 768, 1180 × 820, 1194 × 834 | **escritorio** (≥ 900) |

## Hallazgos a 768 × 1024

| Zona | Estado actual | Oportunidad |
|---|---|---|
| **Hero** | La frase «Fuera del código…» queda **arriba, pisando el wordmark** (sin regla de posición entre 641 y 899 px). El wordmark ocupa ~250 px de alto. Tarjetas de cifras a la izquierda, rasgos y lema a la derecha, título centrado sobre el retrato en tinta oscura, botones abajo. No hay fila superior (ES \| EN, animaciones) | Composición propia: reutilizar la móvil con más aire, o la de escritorio corregida; fila superior de controles |
| **Sobre mí** | Una sola columna con el hilo a la izquierda; las tarjetas ocupan casi todo el ancho (~700 px) y **las ilustraciones satélite están ocultas** (`.ab-sat` en ≤ 899 px). 2.203 px de alto | Alternar tarjetas izquierda/derecha como en escritorio y/o recuperar las ilustraciones |
| **Proyectos** | Bien: la tira muestra dos tarjetas a la vez, con contador y barra. Tabla del stack a 6 por fila, bien | Nada urgente |
| **Servicios** | Tres tarjetas apiladas a todo el ancho con banner de ilustración: 2.472 px de alto. «Cómo trabajo» en lista vertical (< 1000 px) | Rejilla de 2 columnas o tarjetas horizontales (imagen \| texto); «Cómo trabajo» en 2 × 2 |
| **Tools** | Bien: dos tarjetas en fila | Nada urgente |
| **Contacto** | Todo apilado (correo, enlaces, formulario): 1.442 px de alto | Dos columnas (correo y enlaces \| formulario) |
| **FAQ** | Una columna, correcta | Nada urgente |
| Navegación | Solo hamburguesa + cajón; la fila superior móvil no se dibuja por encima de 640 px | Mostrar ES \| EN y animaciones también en tableta |

Sin desbordamiento horizontal a 768 px (la página mide 11.128 px de alto).

## Hallazgo extra: iPad en horizontal (1024 × 768)

Cae en el diseño de escritorio con menú lateral, y **el Hero se agolpa**: el título «Software Engineer / Data Science / GFX» queda **tapado por las tarjetas de cifras y la de rasgos**, y la fila de enlaces cruza el retrato. Sobre mí y el resto se ven bien (zig-zag, ilustraciones, menú lateral). Revisar el tramo 900–1100 px con alturas de 768 a 850.

## Propuesta de orden (sin aprobar)

1. Hero de tableta (arreglar el fallo y elegir composición) y fila superior.
2. Hero en horizontal 900–1100 px.
3. Sobre mí: zig-zag y/o ilustraciones.
4. Contacto en dos columnas.
5. Servicios y «Cómo trabajo».

Fuera de alcance por coste o riesgo: el carrusel fijado con scroll y la guía de luz de Servicios (desktop ≥ 1200 px), que ya tienen alternativas ligeras.

## Relacionado

[[Hallazgos-y-Pendientes]] · [[Hero-y-Sidebar]] · [[Comandos-y-Pruebas]]
