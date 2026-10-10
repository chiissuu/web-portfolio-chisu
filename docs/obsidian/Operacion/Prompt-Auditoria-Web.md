---
tags: [operacion, auditoria, prompt, agentes]
actualizado: 2026-10-09
fuente: [alcance acordado con el usuario, docs/obsidian]
---

# Prompt para auditar y mejorar la web

Usar después de instalar las skills de [[Skills-Desarrollo-Web]]. Copiar el bloque siguiente en un agente con este proyecto abierto. Alternativamente, indicarle que ejecute el encargo del apartado «Prompt principal» de esta nota. Esta nota prepara una tarea futura; la auditoría no se ha ejecutado al crearla.

## Prompt principal

La primera ronda de este encargo se ejecutó el 10 de octubre de 2026: ver [[Auditoria-Web]] para el estado, correcciones verificadas y propuestas restantes. El bloque siguiente conserva el encargo original.

```text
Quiero una auditoría de producto y código de este portfolio Astro, seguida de las mejoras locales de bajo riesgo que puedas verificar. Trabaja hasta completar una ronda exhaustiva: no termines solo con un plan o una lista de sugerencias. Haz cambios incrementales, explica brevemente las decisiones y conserva el trabajo previo del usuario.

Si tienes herramientas de metas, usa $define-goal y crea una meta verificable: revisar las cuatro rutas y las áreas autorizadas, aplicar las correcciones de bajo riesgo, documentar las propuestas restantes y validar que Hero, Sobre mí y el nav lateral siguen intactos. No inventes un presupuesto de tokens o una duración. Si no existe esa herramienta, ejecuta igualmente el encargo hasta sus condiciones de cierre.

CONTEXTO Y SKILLS
1. Revisa AGENTS.md si existe, git status, la rama y el diff inicial. Trabaja en el checkout actual; no descartes cambios, no cambies de rama ni sustituyas el estado actual por otra copia del proyecto.
2. Lee docs/obsidian/00-Empieza-Aqui.md y el resto del vault. Comprueba las afirmaciones relevantes contra el código: las notas incluyen instantáneas históricas y el código actual manda. La carpeta recovery es referencia histórica, no la fuente activa. Lee después todo el código propio dentro del alcance; no hace falta recorrer código generado o de terceros.
3. Descubre qué skills están realmente disponibles. Usa frontend-design para criterio visual, web-design-guidelines para UI y accesibilidad, security-best-practices para la revisión de seguridad de JavaScript/TypeScript/React que autorizo expresamente, y computer-use para la web real. Usa solo referencias que encajen con el stack detectado. Si una skill falta, indícalo y continúa con las herramientas disponibles; no inventes haberla usado ni instales nada automáticamente.
4. Es un portfolio personal de Jesús León dirigido a dar a conocer su perfil profesional. Conserva su identidad visual, sus fuentes, sus textos reales y sus placeholders explícitos. Esta es una auditoría de producto, sin calificación académica ni fecha de entrega que haya que preguntar.

ALCANCE
Revisa Proyectos, Servicios/Tools en portada, Contacto y FAQ; las páginas /servicios/, /tools/ y /tools/video-converter/; sus componentes, formularios y librerías; accesibilidad, responsive, navegación de las subpáginas, estados de interacción, SEO, rendimiento, seguridad y mantenimiento. Comprueba el stack y las rutas desde el repositorio, sin asumir backend, API, autenticación o base de datos donde no existen.

PROTECCIÓN DE LO TERMINADO
Hero, Sobre mí, su transición y el nav lateral están terminados. No los rediseñes, no cambies sus textos, colores, tamaños, posición, animaciones, destinos o comportamiento.
- No edites src/components/HeroExperience.astro ni src/components/AboutSection.astro.
- Protege los datos hero, about y nav en ambos idiomas de src/content/site.js, los enlaces sociales que consume el sidebar, y los assets que usan estas secciones.
- Identifica y protege sus dependencias compartidas: Layout.astro, tokens globales, fuentes, anclas, contratos de tipos, helpers de rutas y capas de scroll. Un cambio en una dependencia compartida que pueda afectarlas es de riesgo medio y se propone, no se aplica.
- Puedes leer esos contratos y probar la integración para evitar regresiones. Los hallazgos que exijan modificar una zona protegida se registran como fuera de alcance.
- Guarda una referencia inicial del contenido y archivos protegidos, incluyendo los cambios sin commit. Compara con ese estado al finalizar, no solo con HEAD.

MÉTODO
Antes de corregir, reproduce o demuestra cada problema y explica su consecuencia. Distingue fallos, decisiones intencionadas y contenido provisional. Para cada hallazgo registra evidencia por archivo/línea o captura, severidad del problema, riesgo del cambio, actuación mínima y criterio de validación. No confundas una diferencia estética con un defecto ni presentes hipótesis como hechos.

Revisa también las relaciones entre componentes y datos. Los formularios pueden ser simulados y los proyectos pueden ser placeholders: verifica y comunica el estado real. No inventes proyectos, experiencia, CV, LinkedIn, enlaces definitivos o funcionalidades. El conversor debe continuar procesando archivos localmente, sin subirlos a un servidor.

AUTORIZACIÓN SEGÚN RIESGO
- Bajo: tienes autorización para aplicar cambios pequeños, reversibles y locales, con resultado comprobable y sin alterar contratos o zonas protegidas. Ejemplos: etiquetas y foco accesibles, correcciones de desbordamiento o contraste local, estados visuales, errores evidentes en enlaces internos no protegidos y simplificaciones puntuales demostradas. Hazlos uno por uno y verifica su efecto.
- Medio: prepara una propuesta concreta con archivos afectados, causa, solución o diff/patch separado, pruebas previstas y posibles regresiones; no la apliques al código activo. Incluye cambios de flujo, lógica del conversor, navegación estructural, contratos compartidos, dependencias, configuración, fuentes o reordenaciones importantes.
- Alto: documenta alternativas y qué decisión necesita el usuario. No ejecutes acciones destructivas, despliegues, commits, push, integraciones de envío real, cambios de credenciales o servicios externos.

No me pidas confirmación para lecturas o correcciones de bajo riesgo ya autorizadas. La autorización anterior también cubre las correcciones de seguridad de bajo riesgo; no detengas todo el trabajo solo para ofrecer comenzarlas. Completa lo independiente antes de solicitar decisiones sobre las propuestas restantes. Si una regla de skill o una restricción de herramientas bloquea algo, explica la regla concreta y continúa con lo que sí puedes hacer, sin eludirla.

VALIDACIÓN REAL
- Establece una línea base con npm run check y npm run build. Ejecuta npm audit como lectura de dependencias, sin audit fix automático. Contrasta versiones y recomendaciones técnicas con documentación primaria cuando haga falta.
- Abre la web local con las herramientas permitidas. Recorre las cuatro rutas y los enlaces relevantes, con escritorio, tablet y móvil (por ejemplo 1920, 1280, 768 y 390px). Comprueba también un ancho estrecho de 320px, foco/teclado, errores de consola, contenido largo, estados vacíos y errores de formularios. Prueba reduced motion y ausencia de JS solo cuando tus herramientas lo permitan; declara las limitaciones.
- Para el conversor, usa únicamente archivos sintéticos pequeños y locales. Autorizo cargarlos en la aplicación local para las pruebas. Verifica selección, validación, conversión, descarga, cancelación y sustitución de archivo cuando sean comprobables. No uses archivos personales ni los envíes a terceros.
- Añade pruebas solo donde tengan valor real, sobre todo si demuestran un fallo y su corrección. No añadas una batería que repita el código ni repitas pruebas generales ya correctas sin cambios nuevos o dudas pendientes.
- Guarda capturas de los cambios visuales. No afirmes haber medido Lighthouse, Core Web Vitals, compatibilidad entre navegadores o un flujo completo si no lo has ejecutado. Si falta una herramienta o una comprobación falla, registra la evidencia y el límite real.

ENTREGA Y CIERRE
Actualiza las notas de Obsidian afectadas y crea docs/obsidian/Operacion/Auditoria-Web.md. Incluye: matriz de cobertura por ruta/área; hallazgos con IDs y evidencia; cambios aplicados y por qué; propuestas de riesgo medio/alto; hallazgos fuera de alcance; pruebas y capturas; comparación del estado protegido; y prioridades recomendadas.

Trabaja de forma autónoma mientras exista avance útil dentro de este encargo. Si el contexto se compacta, retoma el estado existente y evita rehacer comprobaciones completadas. Mantén el informe al día para que se pueda continuar. No alargues la sesión con esperas artificiales o cambios de relleno.

Termina cuando la cobertura esté documentada, las correcciones de bajo riesgo estén verificadas, las propuestas restantes sean revisables y el contenido protegido permanezca intacto. Los checks deben pasar; si existe un fallo previo que exige intervenir fuera de alcance, documenta su reproducción y sus consecuencias y no presentes la validación como completa. Marca una meta como cumplida solo si sus criterios se han satisfecho. No hagas commit ni push. Al final resume en español el resultado, las pruebas, las limitaciones y las decisiones que necesitan mi revisión.
```

## Relacionado

[[Skills-Desarrollo-Web]] · [[00-Empieza-Aqui]] · [[Hallazgos-y-Pendientes]] · [[Comandos-y-Pruebas]]
