---
tags: [contenido, i18n, pendiente]
actualizado: 2026-10-06
fuente: [src/content/site.js, src/lib/content-types.ts]
---

# Estado bilingüe ES/EN

[site.js](../../../src/content/site.js) exporta `{ es, en }`. Hoy, **todas** las rutas eligen `content.es` — el inglés existe en los datos pero no tiene ruta ni selector de idioma visible en ningún sitio del sitio.

## Qué le falta al inglés para poder publicarse

- Falta `content.en.hero.personalNote`, que es un campo **requerido** por el contrato `HeroContent` en [content-types.ts](../../../src/lib/content-types.ts). Si se intentara montar `/en` hoy tal cual, este campo faltante rompería el contrato.
- La tercera línea del `h1` del Hero dice «Applied visually.» en inglés, frente a «GFX» en español — no son traducciones literales una de la otra, es una adaptación deliberada, pero hay que saberlo antes de "corregir" una supuesta inconsistencia.
- El inglés replica las demás áreas del sitio en estructura, pero **los comentarios que afirman equivalencia completa entre ambos locales no deben tomarse como verificación real.** `site.js` es JavaScript plano sin una comprobación explícita e integral de que ambos objetos (`es` y `en`) cumplan la misma forma en todos los campos. Que `npm run check` pase hoy no demuestra que un futuro `/en` cumpla todos los contratos — `content-types.ts` tipa la forma de los datos, pero no hay una validación en tiempo de ejecución que compare ambos objetos campo a campo.

## Antes de crear rutas `/en`

1. Rellenar los campos que falten (empezando por `hero.personalNote`).
2. Verificar campo a campo contra `content-types.ts`, no solo confiar en que "se parece" al español.
3. Decidir cómo se expondría el selector de idioma — hoy no existe ninguno, ni en el Hero ni en el sidebar ni en SimpleNav.

Ver [[Hallazgos-y-Pendientes]] ("Inglés incompleto y sin publicar", prioridad Baja).

## Relacionado

[[Contenido-por-Seccion]] · [[Hallazgos-y-Pendientes]] · [[Rutas-y-Navegacion]]
