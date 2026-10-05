---
tags: [componente, formularios, validacion]
actualizado: 2026-10-06
fuente: [src/components/ContactForm.astro, src/components/ServicesForm.astro, src/lib/forms/validate.ts, src/lib/forms/submit.ts]
---

# Formularios

Fuentes: [ContactForm.astro](../../../src/components/ContactForm.astro), [ServicesForm.astro](../../../src/components/ServicesForm.astro), [validate.ts](../../../src/lib/forms/validate.ts), [submit.ts](../../../src/lib/forms/submit.ts).

> [!important]
> **Ningún formulario de este sitio envía nada de verdad.** Esto hay que tenerlo presente antes de referenciarlos como un canal de contacto real en cualquier otro sitio (README, LinkedIn, etc.).

## Campos

| Formulario | Campos obligatorios | Opcionales |
|---|---|---|
| Contacto | name, email, reason, subject, message, preferredResponse | Ninguno |
| Servicios | name, email, serviceType, problem | company, budget, timeline, message |

Contacto permite motivos: Colaboración, Proyecto, Pregunta general u Otro; y respuesta preferida: Email o Cualquiera. Servicios permite tipo de servicio: Automatización de procesos, Web comercial/visual, Auditoría y asesoramiento, u Otro. Presupuesto y plazo son texto libre, sin validación numérica ni de fechas.

## Flujo de envío (idéntico en ambos formularios)

1. El script intercepta `submit` y llama `preventDefault()`.
2. Lee `FormData`, convirtiendo todos los campos a strings; usa cadena vacía cuando falta alguno.
3. Quita marcas de error previas. Comprueba obligatorios con `trim()` y el email con `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
4. Si hay errores: pone `data-status="error"`, muestra un mensaje global y marca `data-invalid="true"` en los contenedores afectados.
5. Si es válido: pasa a estado `loading` y llama al placeholder de envío. Tras 500ms, ese placeholder devuelve **siempre** `{ ok: true }`, sin usar los datos para nada real.
6. Cambia a `success` y muestra: «Formulario preparado. El envío real se conectará próximamente.»

Los valores siguen en los inputs después del éxito — no se ejecuta `reset()`.

## Excepciones y límites, uno por uno

- `novalidate` desactiva la validación nativa del navegador. Los atributos `required` siguen presentes en el HTML, pero quién decide si se envía es el JS, no el navegador.
- El email se comprueba con `trim()`, pero el objeto de datos que se lee conserva los espacios originales sin recortar. El regex es una comprobación de forma básica, no una verificación de que el buzón exista.
- Los `<select>` solo se validan como "no vacíos" — no se comprueba que el valor pertenezca realmente a las opciones ofrecidas. No hay límites de longitud, CAPTCHA, honeypot ni limitación de frecuencia de envío.
- El estado `loading` reduce la opacidad y aplica `pointer-events: none` al botón; **no** establece `disabled` ni ningún bloqueo lógico contra un envío repetido por teclado.
- No hay `try/catch` alrededor del `await` del placeholder — si algún día se sustituye el stub por una petición real que pueda rechazar (`reject`), hay que añadir manejo de esa excepción o el formulario se queda congelado en `loading` para siempre.
- Los errores no añaden `aria-invalid`, ni descripción individual por campo, ni foco automático al primer campo erróneo. Solo hay texto global + bordes visuales.

### El caso sin JavaScript

Al no tener `action` ni `method` definidos, y con `novalidate` presente, un envío sin JS puede acabar como un **GET a la página actual con los campos como query string en la URL**. Es decir: «los datos nunca salen del navegador» **no es una garantía absoluta** para estos formularios tal como están hoy. Antes de exponerlos como el canal real de contacto, este flujo de fallback debe revisarse. Ver [[Hallazgos-y-Pendientes]] (prioridad Alta).

## Si se conecta un backend real

Un servicio externo de formularios puede recibir peticiones directamente desde un sitio estático sin que Astro deje de ser estático. La alternativa es añadir un endpoint propio dentro de Astro, lo cual exige elegir adaptador y modo de despliegue. Son dos caminos futuros alternativos — ninguno está conectado actualmente.

## Relacionado

[[Hallazgos-y-Pendientes]] · [[Accesibilidad-y-Movimiento]] · [[SEO-Comunicaciones-Persistencia]] · [[Otras-Secciones-y-Compartidos]]
