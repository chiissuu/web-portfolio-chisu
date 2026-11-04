---
tags: [operacion, mantenimiento, contacto]
actualizado: 2026-11-01
fuente: [src/content/site.js, src/lib/content-types.ts, src/components/ContactSection.astro, src/components/ContactForm.astro, src/components/ContactBridge.astro, src/lib/forms/validate.ts]
---

# Mantener la sección Contacto

Contacto es el final del recorrido: cabecera centrada, una tarjeta «Escríbeme directamente» (botón dorado de email, copiar, canales) y un formulario corto de cuatro campos. Todo el contenido está en `contact` de [site.js](../../../src/content/site.js) (ES y EN).

> Git lo ejecuta siempre el usuario: esta nota no incluye ni ejecuta comandos de Git.

## El formulario (con `mailto:`)

- Cuatro campos: **nombre**, **email**, **motivo** (chips, una opción) y **mensaje** (máx. 1500 caracteres). El asunto sale solo: `«motivo» · «nombre»`; el cuerpo es el mensaje más nombre y email.
- **No hay backend**: al enviar, tras validar, el navegador abre la aplicación de correo del visitante con el mensaje ya preparado (`mailto:` a `contact.links.email`). No se guarda nada en ningún servidor. Si el visitante no tiene aplicación de correo no se abre nada: por eso el texto de éxito remite al botón «Copiar» de al lado.
- Textos del formulario: `contact.form` (`notice`, `submitIdle`, `submitLoading`, `submitSuccess`, `submitError`, `fields`). Opciones del motivo: `fields.reasonOptions` (4 a 5 caben bien). La validación está en [validate.ts](../../../src/lib/forms/validate.ts) (`name`, `reason`, `message` obligatorios y email válido). El formulario sigue inerte (`fieldset disabled`) hasta que carga su script.

## Canales y botón dorado

- El botón dorado (`.ct-metal`, definido en [ContactSection.astro](../../../src/components/ContactSection.astro)) es el mismo acabado del sidebar y de Servicios; lo usan el botón de email y el de enviar.
- Textos de la tarjeta directa: `directTitle`, `emailIntro`, `emailButton`, `copyLabel`, `copiedLabel`, `channelsLabel`, y `formTitle` para la tarjeta del formulario.
- Canales: LinkedIn, GitHub y Redes sociales (de `contact.links`). **LinkedIn** se muestra apagado, como en la barra lateral, con su tooltip; en cuanto exista `links.linkedin` (URL) se convierte en enlace en esta sección (la barra lateral hay que cambiarla a la vez, está en [HeroExperience.astro](../../../src/components/HeroExperience.astro)). Para otro canal: añadir su objeto a `channels` en `ContactSection.astro` y su logo `public/assets/icons/social/<id>-gold.png`.

## La transición desde Tools

[ContactBridge.astro](../../../src/components/ContactBridge.astro) (Contacto usa `edge={false}` en su fondo):

- **Frontera estática («Horizonte», siempre):** degradado champán → oro → negro sobre el final de Tools (`.cb-fade`) y, en vez de una regla, un **horizonte**: el negro sube como una cúpula muy suave (`.cb-arc`, media elipse centrada en el hilo, `--cb-a` de semiancho) cuyo borde es una línea de luz, con un resplandor encima (`.cb-glow`) y **estrellas** que titilan justo debajo (`.cb-stars`). La barra lateral pasa a tema oscuro a mitad del degradado (`.cb-theme`). La regla con escala es de Servicios y el labio de metal es de Tools: no repetirlas aquí.
- **Hilo y señal (≥900px y con movimiento):** del pie del catálogo de Tools baja un hilo que llega al borde del horizonte en su vértice (el borde se enciende al cruzarlo) y sigue hasta un rombo-faro sobre el título; al encenderse, un anillo dorado (con otros dos más tenues detrás) crece desde el faro y va descubriendo el título, el lead y las dos tarjetas como un círculo. Por tiempo, disparado cuando el catálogo de Tools entra en pantalla (`bottom 82%`, `refreshPriority: -7`); reversible.
- El hueco bajo el catálogo de Tools (`margin-bottom` en `ToolsSection`) debe seguir siendo mayor que el degradado.
- La salida de Contacto hacia FAQ **sigue con la ola** (no se ha tocado).

## Comprobación

1. `npm run check` y `npm run build`.
2. Escritorio: hilo desde el catálogo, rombo-faro sobre el título, anillo que descubre cabecera y tarjetas; botón de email y «Copiar» («Copiado» un instante); enviar vacío marca los cuatro campos; con datos válidos se abre el correo.
3. <900px o «reducir movimiento»: solo degradado y regla; las dos tarjetas se apilan (la directa primero).

## Relacionado

[[Mantener-Tools]] · [[Comandos-y-Pruebas]] · [[Formularios]] · [[Otras-Secciones-y-Compartidos]]
