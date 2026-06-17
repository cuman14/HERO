## REQUISITOS AÑADIDOS

### REQ-HEAT-SUMMARY-01 — La pantalla muestra el resumen del atleta y el WOD

```
DADO QUE el juez ha seleccionado un atleta en heat-confirmation
  Y navega a /heat-confirmation-summary con router state válido
  conteniendo heatPayload y selectedAthleteId

CUANDO se carga la pantalla

ENTONCES se muestra el nombre del atleta en el header
  Y se muestra el bib number, categoría y código del heat bajo el nombre
  Y se muestra una tarjeta WOD con badge "WOD DETAILS"
  Y se muestra el nombre del WOD en tamaño grande
  Y se muestra el time cap en formato "MM:SS" en tamaño grande
  Y se muestra la sección DESCRIPCIÓN con el texto y los movimientos como chips
```

### REQ-HEAT-SUMMARY-02 — Banner de advertencia

```
DADO QUE la pantalla se ha cargado con datos válidos

CUANDO el juez visualiza la pantalla

ENTONCES ve un banner de fondo amber con ícono ⓘ
  Y el texto "Asegúrate de que el atleta ha validado su material antes de iniciar."
```

### REQ-HEAT-SUMMARY-03 — Acción confirmar e iniciar

```
DADO QUE la pantalla muestra el resumen correctamente

CUANDO el juez pulsa el botón "Iniciar WOD"

ENTONCES el sistema navega a /scoring
```

### REQ-HEAT-SUMMARY-04 — Acción volver

```
DADO QUE el juez está en /heat-confirmation-summary

CUANDO pulsa la flecha ← del header

ENTONCES el sistema navega de vuelta a /heat-confirmation
  Y los datos del heat anterior se preservan
```

### REQ-HEAT-SUMMARY-05 — Redirect si falta el router state

```
DADO QUE el juez accede a /heat-confirmation-summary directamente
  (sin router state, p.ej. recargando la página o acceso directo por URL)

CUANDO la pantalla intenta inicializarse

ENTONCES el sistema redirige a /heat-access
```

```
DADO QUE el router state existe pero selectedAthleteId es null o undefined

CUANDO la pantalla intenta inicializarse

ENTONCES el sistema redirige a /heat-access
```

## REMOVED Requirements

### REQ-HEAT-CONFIRMATION-NAVIGATION (eliminado)

**Reason**: The "Continuar" button is removed. Navigation now happens directly from card clicks — no intermediate "select → continue" step.
**Migration**: All navigation previously triggered by "Continuar" is replaced by direct card-click navigation. See REQ-HEAT-CONFIRMATION-ARROW-NAVIGATION and REQ-HEAT-CONFIRMATION-SCORED-CLICK below.

## MODIFIED Requirements

### REQ-HEAT-CONFIRMATION-SCORED-INDICATOR (modificado)

```
DADO QUE la pantalla heat-confirmation se ha cargado con datos del heat

CUANDO el sistema consulta los scores ya enviados para este heat
  Y existen atletas con scores en estado "submitted"

ENTONCES dichos atletas muestran un badge verde "Listo"
  Y el badge indica que el score ya fue registrado
  Y se muestra un icono de ojo (👁) en la parte derecha de la tarjeta
  Y la tarjeta tiene un borde de acento (emerald) para distinguir visualmente
```

### REQ-HEAT-CONFIRMATION-SCORED-CLICK (modificado)

```
DADO QUE un atleta en heat-confirmation tiene scored = true
  (ya tiene un score submitted en BD)

CUANDO el juez pulsa sobre ese atleta

ENTONCES el sistema navega directamente a /scoring/:heatAthleteId/summary?readonly=true
  Y no hay selección previa (no toggle, no "Continuar")
  (permite ver el resumen del score ya registrado en modo lectura)
```

## ADDED Requirements

### Requirement: REQ-HEAT-CONFIRMATION-ARROW-NAVIGATION

```
DADO QUE un atleta en heat-confirmation tiene scored = false
  (no tiene score registrado)

CUANDO el juez pulsa sobre ese atleta

ENTONCES el sistema navega directamente a /heat-confirmation-summary
  CON queryParams: { heatCode, athleteId }
  Y no hay selección previa (no toggle, no "Continuar")
  (flujo nuevo: card click directo al guardrail de confirmación)
```

### Requirement: REQ-HEAT-CONFIRMATION-ARROW-ICON

```
DADO QUE la pantalla heat-confirmation se ha cargado con datos del heat

CUANDO un atleta tiene scored = false

ENTONCES la tarjeta del atleta muestra un icono de flecha (→) en la parte derecha
  Y el icono usa el componente lib-icon con name="arrow-right"
  (el icono indica que se puede iniciar el scoring)
```

### Requirement: REQ-HEAT-CONFIRMATION-SELECTION-REMOVED

```
DADO QUE la pantalla heat-confirmation carga atletas

CUANDO se renderiza cada tarjeta

ENTONCES no hay checkbox de selección
  Y selectedId, canContinue, toggleSelection no existen
  Y el footer no muestra botón "Continuar"
```

## REQUISITOS MODIFICADOS (score-summary-screen change)

### REQ-SUMMARY-POST-FINALIZE-NAVIGATION (modificado)

```
DADO QUE el juez ha firmado y pulsado "Finalizar" en SummaryPage
  Y finalizeScore() se completa exitosamente

CUANDO el sistema completa la operación

ENTONCES navega a /heat-confirmation
  CON queryParam: heatCode = <código del heat>
  (antes navegaba a /heat-confirmation sin heatCode)
```
