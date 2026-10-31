---
tags: [operacion, skills, agentes]
actualizado: 2026-10-23
fuente: [catálogo openai/skills, anthropics/skills, vercel-labs/agent-skills]
---

# Skills para desarrollar y auditar este portfolio

Selección histórica del 9 de octubre de 2026. El 10 de octubre las cuatro skills ya están disponibles en esta sesión y se leyeron para [[Auditoria-Web]], junto con computer-use. No se instaló ninguna automáticamente durante la auditoría. Son instrucciones de trabajo; no modifican el stack ni las dependencias npm de la web.

| Skill | Fuente | Utilidad en este proyecto |
|---|---|---|
| frontend-design | [Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Composición, jerarquía, tipografía y estados de interfaz; aplicar el diseño existente como briefing y limitar los cambios al alcance autorizado |
| web-design-guidelines | [Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | Revisar UI, accesibilidad, foco, formularios, interacción y consistencia con evidencia por archivo/línea |
| security-best-practices | [OpenAI](https://github.com/openai/skills/tree/main/skills/.curated/security-best-practices) | Revisión de seguridad solicitada explícitamente para JavaScript/TypeScript y React; usar referencias aplicables, sin inventar requisitos de backend |
| define-goal | [OpenAI](https://github.com/openai/skills/tree/main/skills/.curated/define-goal) | Definir una meta verificable, alcance y condición de cierre. No es un temporizador ni administra por sí sola la ejecución larga |

Computer Use e imagegen ya están disponibles en este Codex. Computer Use sirve para revisar la web real, scroll y responsive. Imagegen resulta útil cuando se necesite un asset raster; no sustituye CSS o SVG para una interfaz. Figma solo sería necesario si se trabajase a partir de archivos de Figma. Ricardo es un evaluador académico; esta auditoría de producto no requiere calificación ni plazo de entrega.

## Instalación manual en PowerShell

Ejecutar desde la terminal. El instalador del sistema está presente y Python funciona en este equipo:

```powershell
$portfolioSkillInstaller = "$env:USERPROFILE\.codex\skills\.system\skill-installer\scripts\install-skill-from-github.py"
python $portfolioSkillInstaller --repo anthropics/skills --path skills/frontend-design
python $portfolioSkillInstaller --repo vercel-labs/agent-skills --path skills/web-design-guidelines
python $portfolioSkillInstaller --repo openai/skills --path skills/.curated/security-best-practices skills/.curated/define-goal
```

Estas instrucciones descargan skills a `.codex/skills`. No se han ejecutado las instalaciones en esta sesión. El instalador se detiene si el destino ya existe; no sobrescribirlo automáticamente. Después de instalar, enviar un nuevo turno y comprobar que las skills aparecen entre las disponibles.

## Uso posterior

El encargo completo está en [[Prompt-Auditoria-Web]]. Las skills deben ayudar a cumplirlo, respetando sus exclusiones y su autorización de cambios de bajo riesgo. No cargar skills de despliegue, Figma, notebooks o backend por el mero hecho de estar disponibles.

Fuentes de funcionamiento: [skills de Codex](https://learn.chatgpt.com/docs/build-skills) y [orientaciones sobre skills y prompts](https://developers.openai.com/blog/rethinking-skills-and-prompts-for-gpt-6-astra). La selección prioriza procedimientos concretos y evita instrucciones redundantes.

## Claude Code: selección e instalación

Investigación comprobada el 23 de octubre de 2026 en los repositorios de los autores. Para este portfolio Astro bastan tres skills complementarias; no es un ranking universal y no conviene cargar colecciones enteras:

| Skill y descarga | Cuándo usarla |
|---|---|
| [frontend-design — Anthropic](https://github.com/anthropics/skills/tree/main/skills/frontend-design) | Composición, color, tipografía e implementación visual respetando la identidad aprobada |
| [web-design-guidelines — Vercel](https://github.com/vercel-labs/agent-skills/tree/main/skills/web-design-guidelines) | Revisión de UI/accesibilidad: semántica, foco, formularios, movimiento y legibilidad |
| [webapp-testing — Anthropic](https://github.com/anthropics/skills/tree/main/skills/webapp-testing) | Comprobación real del sitio con Playwright, capturas, responsive y consola; requiere las herramientas de navegador correspondientes |

Revisar sus SKILL.md antes de instalar y no sobrescribir una versión existente sin comparar. La [documentación de skills de Claude Code](https://code.claude.com/docs/en/skills) explica su carga bajo demanda. Las skills no cambian el modelo ni aportan por sí solas herramientas, calidad garantizada o más cuota. React no es el framework de toda esta web: no hace falta activar una colección de React/Next.js para retocar componentes Astro.

Instalación para Claude Code en Windows. **Estado comprobado el 23 de octubre de 2026:** las tres skills ya están instaladas en `~/.claude/skills` (`frontend-design` y `webapp-testing` de `anthropics/skills`; `web-design-guidelines` de `vercel-labs/agent-skills`) y `npx skills ls -g -a claude-code` las lista; no hace falta repetir los comandos ni sobrescribir nada. Los comandos se conservan como referencia para otra máquina. El modo global evita añadir archivos al proyecto y `--copy` evita depender de enlaces simbólicos. Son recursos del agente, no dependencias npm del portfolio:

```powershell
npx skills add anthropics/skills --skill frontend-design webapp-testing -a claude-code -g --copy
npx skills add vercel-labs/agent-skills --skill web-design-guidelines -a claude-code -g --copy
npx skills ls -g -a claude-code
```

Sintaxis contrastada con el [CLI oficial de Vercel](https://github.com/vercel-labs/skills/blob/main/docs/commands.md); el README pide Node >=22.20 (en esta sesión el equipo tiene v24.17). Si la sesión no detecta las skills instaladas, reiniciar Claude Code. No es necesario modificar package.json o astro.config.mjs.

### Modelos y consumo

Como reparto práctico, Claude Code puede llevar la implementación diaria y ChatGPT los estudios o la revisión visual de hitos. Es una recomendación según las preferencias del usuario, no una comparación medida de tokens incluidos. Hace falta conocer el plan concreto y el trabajo real para comparar cuotas.

La [documentación de precios de Codex](https://learn.chatgpt.com/docs/pricing) sitúa GPT-6 Luna por debajo de GPT-6.1 Sol en consumo/créditos. Sol no es el modelo más económico. La [guía de subagentes de OpenAI](https://learn.chatgpt.com/docs/agent-configuration/subagents) propone Luna para tareas estrechas y Sol para trabajo ambiguo o exigente. Usar velocidad Standard y esfuerzo proporcional; no extrapolar tarifas API a mensajes incluidos en una suscripción.

En Claude, la versión económica actual comprobada es [Haiku 5.5](https://www.anthropic.com/claude-haiku-5-5), identificador `claude-haiku-5-5`. Para implementación con criterio, Sonnet es el equilibrio recomendado; Haiku encaja en tareas acotadas y mecánicas. [Configuración oficial](https://code.claude.com/docs/en/model-config): comprobar disponibilidad real con `/model` antes de elegir. API y suscripción son formas de facturación distintas.

Los [límites Pro/Max de Claude](https://support.claude.com/es/articles/11145838-usa-claude-code-con-tu-plan-pro-o-max) se comparten entre Claude y Claude Code y tienen ventanas de sesión y semanales. La [guía de consumo](https://code.claude.com/docs/en/costs) explica que los subagentes también consumen cuota y recomienda contener el contexto. La solución propuesta es una lectura inicial completa por el coordinador, luego consultas selectivas; tareas pequeñas con un agente y equipos mínimos cuando aporten valor. No copiar todos los documentos a todos los agentes ni activar varias skills redundantes.

El prompt reutilizable está en [[Prompt-Continuidad-Claude]]. Las tres skills de Claude Code están instaladas (ver arriba); no se han cambiado modelos ni habilitado facturación adicional.

## Relacionado

[[Prompt-Auditoria-Web]] · [[Prompt-Continuidad-Claude]] · [[Comandos-y-Pruebas]] · [[00-Empieza-Aqui]]
