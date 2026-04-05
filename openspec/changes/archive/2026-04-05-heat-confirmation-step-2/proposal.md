## Por qué

Después de que el juez selecciona un atleta en la pantalla Heat Confirmation (paso 1),
navega directamente a scoring sin ningún punto de verificación intermedio.
Esto aumenta el riesgo de puntuar al atleta equivocado, especialmente en heats
rápidos con muchos participantes.

Una pantalla de resumen (paso 2) da al juez un último checkpoint de confirmación:
ve los detalles del WOD, el nombre del atleta y el dorsal antes de iniciar.
Reduce el error humano y aumenta la confianza en el flujo de puntuación.

## Qué cambia

- Se añade una nueva página **HeatConfirmationSummaryPage** que muestra:
  - Header con flecha volver + nombre del atleta + bib · categoría · heat
  - Tarjeta WOD DETAILS con: nombre del WOD, timer (time cap), descripción,
    movimientos (chips por movimiento)
  - Banner de aviso amber: "Asegúrate de que el atleta ha validado su
    material antes de iniciar."
  - Botón primario violeta: "🏁 Iniciar WOD"
  - Subtítulo bajo el botón: "EL ATLETA DEBE ESTAR LISTO"
- El botón "Continuar" de HeatConfirmationPage navega a la nueva pantalla
  en vez de ir directamente a /scoring.
- La nueva pantalla recibe heatPayload + selectedAthleteId via router state.

## Capacidades nuevas

### HeatConfirmationSummaryPage
Pantalla de solo lectura que muestra el resumen del atleta seleccionado
y los detalles del WOD antes de iniciar el scoring.
Ruta: /heat-confirmation-summary

## Impacto

- **libs/contexts/heat/src/feature/pages/heat-confirmation-summary/** → página nueva
- **libs/contexts/heat/src/feature/heat.routes.ts** → nueva ruta sibling
- **libs/contexts/heat/src/feature/pages/heat-confirmation/heat-confirmation.page.ts**
  → onContinue() navega a /heat-confirmation-summary con router state
- **@hero/ui** → reutiliza ButtonComponent. WodInfoCardComponent y
  AthleteCardComponent en modo lectura (no interactivo)
- **Sin cambios de backend** — todos los datos ya están en HeatConfirmationPayload

## Fuera de alcance

- Cambios en heat-access page
- Selección múltiple de atletas
- Cambios en la página de scoring o el dominio score
- Persistencia en store global — los datos pasan por router state
