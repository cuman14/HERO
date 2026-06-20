## Context

`apps/judge/index.html` carga Google Fonts CSS desde `https://fonts.googleapis.com/css2?...` sin preconexión. El navegador descubre estos recursos en el CSS y luego hace DNS lookup + TCP + TLS handshake. Añadir `<link rel="preconnect">` adelanta esa negociación al parsing inicial del HTML.

## Goals / Non-Goals

**Goals:**
- Añadir preconnect hints para `fonts.googleapis.com` y `fonts.gstatic.com`
- Cero impacto funcional — solo HTML markup

**Non-Goals:**
- Auto-hosting de fuentes (ya existe, pero necesita fallback)
- Cambios en otros apps (admin, leaderboard)
- Optimización de otras métricas de carga

## Decisions

- **Preconnect, no prefetch/preload**: preconnect solo negocia la conexión sin descargar recursos, suficiente para acelerar sin desperdiciar ancho de banda ni competir con recursos críticos
- **`crossorigin` en `fonts.gstatic.com`**: Google Fonts sirve desde `fonts.gstatic.com` con CORS; sin el atributo el navegador no reusa la conexión preconnecteada para las descargas de fuentes
- **Orden**: ambos preconnects antes que cualquier `<link href="https://fonts.googleapis.com/css2?..."` para que el navegador los procese primero

## Risks / Trade-offs

- Sin riesgos. No hay breaking changes, no hay comportamiento nuevo.
