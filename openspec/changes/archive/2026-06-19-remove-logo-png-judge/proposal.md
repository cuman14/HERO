## Why

`apps/judge/public/logo.png` (192 KB) es un asset no referenciado que aumenta el peso inicial de la PWA sin aportar valor. `logo.svg` (vectorial, ~2 KB) ya existe y cubre todas las necesidades de logo.

## What Changes

- Eliminar `apps/judge/public/logo.png`
- No hay cambios de código — el PNG no tiene referencias en ningún archivo del judge app

## Capabilities

### New Capabilities
_Ninguna — es una eliminación de asset, no una nueva capacidad._

### Modified Capabilities
_Ninguna — no cambian requisitos de specs existentes._

## Impact

- **Eliminación:** `apps/judge/public/logo.png` (~192 KB)
- **Sin cambios de código:** No hay imports, referencias HTML, ni configs que apunten al PNG
- **Sin impacto en manifest:** Los icons del PWA (`icons/*.png`) no se tocan
