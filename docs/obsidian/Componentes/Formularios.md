---
tags: [componente, formularios, validacion]
actualizado: 2026-10-10
fuente: [src/components/ContactForm.astro, src/components/ServicesForm.astro, src/lib/forms/validate.ts, src/lib/forms/submit.ts]
---

# Formularios

Fuentes: [ContactForm.astro](../../../src/components/ContactForm.astro), [ServicesForm.astro](../../../src/components/ServicesForm.astro), [validate.ts](../../../src/lib/forms/validate.ts), [submit.ts](../../../src/lib/forms/submit.ts).

> [!important]
> **Ningún formulario de este sitio envía nada de verdad.** Esto hay que tenerlo presente antes de referenciarlos como un canal de contacto real en cualquier otro sitio (README, LinkedIn, etc.).

## Aspecto

El formulario de **Contacto** está estilado para la sección oscura (panel de tarjeta, Inter, campos con borde al 50 % para el contraste, foco dorado y botón de metal dorado); esos estilos viven en `ContactForm.astro` y no afectan al formulario de `/servicios/`, que conserva el estilo compartido de `Layout.astro`. La lógica, los campos, la validación y el envío simulado no cambiaron. Detalle y contrastes en [[Auditoria-Contacto]].

## Campos

| Formulario | Campos obligatorios | Opcionales |
|---|---|---|
| Contacto | name, email, reason, subject, message, preferredResponse | Ninguno |
| Servicios | name, email, serviceType, problem | company, budget, timeline, message |

Contacto permite motivos: Colaboración, Proyecto, Pregunta general u Otro; y respuesta preferida: Email o Cualquiera. Servicios permite tipo de servicio: Automatización de procesos, Web comercial/visual, Auditoría y asesoramiento, u Otro. Presupuesto y plazo son texto libre, sin validación numérica ni de fechas.

## Flujo de envío (idéntico en ambos formularios)

1. HTML deshabilita fieldset y submit hasta que el script instala `preventDefault()`. Un aviso previo reutiliza el texto de envío provisional.
2. Lee `FormData`, convirtiendo todos los campos a strings; usa cadena vacía cuando falta alguno.
3. Quita marcas de error previas. Comprueba obligatorios con `trim()` y el email con `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`.
4. Si hay errores: muestra el mensaje global y marca data-invalid/aria-invalid; asocia un mensaje por campo mediante aria-describedby y enfoca el primer inválido en orden del DOM. Usa validationMessage del navegador o submitError existente. Al reenviar se limpian errores previos.
5. Si es válido: pasa a estado `loading` y llama al placeholder de envío. Tras 500ms, ese placeholder devuelve **siempre** `{ ok: true }`, sin usar los datos para nada real.
6. Cambia a `success` y muestra: «Formulario preparado. El envío real se conectará próximamente.»

Los valores siguen en los inputs después del éxito — no se ejecuta `reset()`.

## Excepciones y límites, uno por uno

- `novalidate` desactiva la validación nativa del navegador. Los atributos `required` siguen presentes en el HTML, pero quién decide si se envía es el JS, no el navegador.
- El email se comprueba con `trim()`, pero el objeto de datos que se lee conserva los espacios originales sin recortar. El regex es una comprobación de forma básica, no una verificación de que el buzón exista.
- Los `<select>` solo se validan como "no vacíos" — no se comprueba que el valor pertenezca realmente a las opciones ofrecidas. No hay límites de longitud, CAPTCHA, honeypot ni limitación de frecuencia de envío.
- Loading establece disabled en el botón y aria-busy en el formulario; un guard evita repetición también por teclado. Al resolver el stub se habilita de nuevo.
- No hay `try/catch` alrededor del `await` del placeholder — si algún día se sustituye el stub por una petición real que pueda rechazar (`reject`), hay que añadir manejo de esa excepción o el formulario se queda congelado en `loading` para siempre.
- Los errores tienen texto individual, ARIA y foco; no se ha probado lector de pantalla. Etiquetas, botones y mensajes usan contrastes locales corregidos.

### El caso sin JavaScript

Corregido el 10 de octubre: fieldset y submit parten deshabilitados y solo se habilitan después de instalar el handler. Se verificó el HTML generado en un fixture sin scripts, con todos los controles deshabilitados y el aviso previo visible. No se activó envío real ni se modificaron method/action. Los reveals invisibles sin JS siguen pendientes en Layout protegido. Ver [[Auditoria-Web]] A04/A16.

## Si se conecta un backend real

Un servicio externo de formularios puede recibir peticiones directamente desde un sitio estático sin que Astro deje de ser estático. La alternativa es añadir un endpoint propio dentro de Astro, lo cual exige elegir adaptador y modo de despliegue. Son dos caminos futuros alternativos — ninguno está conectado actualmente.

## Relacionado

[[Hallazgos-y-Pendientes]] · [[04-Accesibilidad-y-Movimiento|Accesibilidad-y-Movimiento]] · [[05-SEO-Comunicaciones-Persistencia|SEO-Comunicaciones-Persistencia]] · [[Otras-Secciones-y-Compartidos]]
