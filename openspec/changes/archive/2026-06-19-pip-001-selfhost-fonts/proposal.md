## Why

La app Judge carga fuentes desde Google Fonts CDN, generando peticiones externas render-blocking que degradan el rendimiento inicial y rompen la experiencia offline. Autoalojar las fuentes elimina esta dependencia externa.

## What Changes

- Descargar y almacenar Inter, Space Grotesk y Material Symbols en `apps/judge/public/fonts/`
- Eliminar referencias a Google Fonts en `index.html`
- Actualizar declaraciones `@font-face` en CSS para apuntar a las fuentes locales
- Añadir cabecera `Cache-Control` agresiva para fuentes locales (no aplica, son estáticas)

## Capabilities

### New Capabilities
- `selfhost-fonts`: Fuentes autoalojadas sin dependencia externa

### Modified Capabilities
*(ninguna — no hay specs existentes)*

## Impact

- **Afecta:** `apps/judge/public/fonts/`, `apps/judge/src/index.html`
- **Librerías:** Solo fuentes descargadas, sin nuevas dependencias npm
- **Sin cambios en lógica de negocio ni en APIs**
