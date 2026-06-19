## Context

La Judge App es una PWA Angular 21. El `<title>` en `apps/judge/index.html` actualmente es `judge`, que es el valor por defecto generado por el scaffolding. Al instalar la PWA en un dispositivo, el nombre que aparece es el del `<title>`.

## Goals / Non-Goals

**Goals:**
- Cambiar `<title>` de `judge` a `Hero Judge` en `apps/judge/index.html`

**Non-Goals:**
- No se modifica el manifest.webmanifest (el `name` ya está configurado aparte)
- No se modifica ningún otro metadata HTML
- No se cambia el `lang` ni otros atributos

## Decisions

No hay decisiones técnicas que tomar — es un cambio directo de 1 carácter en el HTML. El valor `Hero Judge` está definido en la tarea Plane y alineado con la documentación en `docs/pip-001-performance-judge.md`.

## Risks / Trade-offs

Sin riesgos identificados. Es un cambio puramente cosmético que no afecta lógica, rendimiento, ni funcionalidad.
