## Context

`apps/judge/public/logo.png` (192 KB) existe pero no tiene referencias en el código del judge app. `logo.svg` ya está en el mismo directorio y es ~2 KB. Esta es una tarea de limpieza — eliminar el PNG muerto.

## Goals / Non-Goals

**Goals:**
- Eliminar `logo.png` del directorio `public/` del judge app
- Reducir peso de assets estáticos

**Non-Goals:**
- No tocar `icons/logo.png` — ese se usa en el manifest para iOS splash
- No modificar código existente
- No cambiar referencias a `logo.svg`

## Decisions

- **Eliminación directa:** No hay referencias al PNG en ningún `.ts`, `.html`, `.json` del judge app. Solo se requiere `git rm`.
- **No tocar `icons/logo.png`:** El directorio `icons/` contiene los iconos del PWA manifest, que son PNGs intencionalmente (requisito de formato para `image/png` en el manifest).

## Risks / Trade-offs

- **Riesgo bajo:** Si en el futuro se necesitara el PNG (ej. para CMS externo), habría que regenerarlo desde el SVG. La pérdida es trivial — el SVG es la fuente de verdad.
