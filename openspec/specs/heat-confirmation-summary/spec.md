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

## REQUISITOS MODIFICADOS

### REQ-HEAT-CONFIRMATION-NAVIGATION (modificado)

```
DADO QUE el juez ha seleccionado un atleta en heat-confirmation
  Y canContinue() es true

CUANDO pulsa "Continuar"

ENTONCES el sistema navega a /heat-confirmation-summary
  CON router state: { heatPayload, selectedAthleteId }
  (ANTES navegaba directamente a /scoring)
```
