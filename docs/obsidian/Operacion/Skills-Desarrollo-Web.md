---
tags: [operacion, skills, agentes]
actualizado: 2026-10-10
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

## Relacionado

[[Prompt-Auditoria-Web]] · [[Comandos-y-Pruebas]] · [[00-Empieza-Aqui]]
