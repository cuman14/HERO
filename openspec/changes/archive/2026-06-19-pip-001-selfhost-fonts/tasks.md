## 1. Descargar y colocar fuentes

- [x] 1.1 Descargar Inter (400, 600, 700) WOFF2 y guardar en `apps/judge/public/fonts/inter/`
- [x] 1.2 Descargar Space Grotesk (400, 600, 700) WOFF2 y guardar en `apps/judge/public/fonts/space-grotesk/`
- [x] 1.3 Descargar Material Symbols WOFF2 y guardar en `apps/judge/public/fonts/material-symbols/`

## 2. Declarar @font-face y limpiar HTML

- [x] 2.1 Añadir bloques `@font-face` en `apps/judge/src/styles.css` apuntando a las fuentes locales
- [x] 2.2 Eliminar `<link>` a Google Fonts de `apps/judge/src/index.html`
- [x] 2.3 Verificar que no hay peticiones a `fonts.googleapis.com` ni `fonts.gstatic.com`
