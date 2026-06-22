## Context

`apps/judge/index.html` contiene un bloque CSS para `.material-symbols-outlined` y `apps/judge/src/styles.css` tiene un `@font-face` que carga `MaterialSymbolsOutlined.woff2`. Ningún template en `apps/judge/` usa la clase `material-symbols-outlined`. Es código muerto.

## Goals / Non-Goals

**Goals:**
- Eliminar el bloque CSS de `index.html`
- Eliminar el `@font-face` de `styles.css`
- Eliminar el archivo WOFF2 si existe en `public/fonts/`

**Non-Goals:**
- No reemplazar por otro sistema de iconos
- No modificar ningún template o componente

## Decisions

No hay decisiones de diseño. Es eliminación directa de código muerto.

## Risks / Trade-offs

- Si en el futuro se quisieran usar Material Symbols, habría que volver a agregarlos. No se anticipa necesario porque el proyecto usa Heroicons.
