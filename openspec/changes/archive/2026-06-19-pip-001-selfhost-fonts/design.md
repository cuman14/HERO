## Context

La app Judge carga Inter, Space Grotesk y Material Symbols desde Google Fonts CDN en `index.html`. Estas son peticiones externas render-blocking que afectan el rendimiento inicial y la experiencia offline.

## Goals / Non-Goals

**Goals:**
- Eliminar dependencia de Google Fonts CDN para las 3 fuentes
- Servir fuentes desde `apps/judge/public/fonts/`
- Mantener mismo aspecto visual (mismos pesos, estilos, variaciones)

**Non-Goals:**
- No se cambian las fuentes utilizadas
- No se modifica el diseño ni el CSS existente más allá de las URLs de fuentes
- No se tocan las otras apps (admin, leaderboard)

## Decisions

| Decisión | Opción | Por qué |
|----------|--------|---------|
| Formato de fuentes | **WOFF2** | Mejor compresión, soporte moderno (Angular 21 target >95% browsers) |
| Descarga | **Google Fonts CSS + manual** | Conocer exactamente qué pesos se usan para no descargar innecesarios |
| Estrategia CSS | **@font-face blocks en styles.css** | Un solo punto de declaración, sin duplicar en componentes |
| Fallback | **system-ui stack** | `font-family: Inter, system-ui, sans-serif` si la fuente local falla |

## Riesgos / Trade-offs

- [Fuentes grandes] → Material Symbols pesa ~300 KB incluso en WOFF2. Aceptado: es necesario para iconos.
- [Pesos no usados] → Revisar solo los pesos realmente referenciados (Inter 400/600/700, Space Grotesk 400/600/700, Material Symbols todas las variantes de íconos usados).
