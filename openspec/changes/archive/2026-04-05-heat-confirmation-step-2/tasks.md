## Referencia visual

Diseño de Stitch — usar el MCP de Stitch al inicio de la implementación:

- Project ID: 13066618688962361429
- Screen ID: 96868ddb998d444dadb56809ed18b17f
- Screen: "Heat Confirmation Step 2 of 4"

---

## Definición de hecho por tarea

Una tarea está completa cuando:

- El archivo existe en la ruta indicada
- El `.spec.ts` co-localizado existe y todos los `it()` pasan
- `nx typecheck hero-judge` no muestra errores
- Cobertura ≥ 80% se mantiene tras la adición

---

## Capa 1 — Página nueva

- [x] **T-1.1** Crear `libs/contexts/heat/src/feature/pages/heat-confirmation-summary/heat-confirmation-summary.page.ts`
  - Standalone, OnPush, inject(Router)
  - Lee router state en constructor: `router.getCurrentNavigation()?.extras.state`
  - Expone signals: `heat`, `athlete`, `isReady` (computed: ambos existen)
  - Si falta state o selectedAthleteId → redirect a /heat-access en ngOnInit
  - `onConfirm()` → navega a /scoring
  - `onBack()` → navega a /heat-confirmation

- [x] **T-1.2** Crear `libs/contexts/heat/src/feature/pages/heat-confirmation-summary/heat-confirmation-summary.page.html`
  - Sigue exactamente el diseño Stitch (obtener via MCP antes de implementar)
  - Header: botón ← (aria-label="Volver") + nombre atleta + bib · categoría · heat
  - Tarjeta WOD DETAILS:
    - Badge "WOD DETAILS" con fondo violeta/primary
    - Nombre WOD en texto grande y negrita
    - Time cap en formato "MM:SS" — tipografía grande tipo timer
    - Separador horizontal
    - Label "DESCRIPCIÓN" + texto de descripción
    - Chips por movimiento: label "MOVIMIENTO N" + nombre del movimiento
  - Banner amber: ícono ⓘ + texto advertencia
  - Footer sticky: ButtonComponent variant="primary" con "🏁 Iniciar WOD"
  - Subtítulo bajo botón: "EL ATLETA DEBE ESTAR LISTO" en mayúsculas pequeñas
  - Accent color: violet (--color-primary del tema)
  - Todos los elementos interactivos ≥ 48px touch target

- [x] **T-1.3** Crear `libs/contexts/heat/src/feature/pages/heat-confirmation-summary/heat-confirmation-summary.page.spec.ts`
  - Renderiza nombre del atleta, bib, categoría y código heat en el header
  - Renderiza el nombre del WOD y el time cap
  - Muestra el banner amber de advertencia
  - "Iniciar WOD" llama a router.navigate(['/scoring'])
  - Botón back llama a router.navigate(['/heat-confirmation'])
  - Redirect a /heat-access cuando no hay router state
  - Redirect a /heat-access cuando selectedAthleteId es null

---

## Capa 2 — Routing

- [x] **T-2.1** Actualizar `libs/contexts/heat/src/feature/heat.routes.ts`
  - Añadir ruta sibling `heat-confirmation-summary` con loadComponent lazy
  - Sin resolver — los datos vienen del router state

- [x] **T-2.2** Actualizar `onContinue()` en `heat-confirmation.page.ts`
  - Cambiar navigate(['/scoring']) por navigate(['/heat-confirmation-summary'])
  - Pasar NavigationExtras.state: `{ heatPayload: this.heatPayload(), selectedAthleteId: this.selectedId() }`

---

## Capa 3 — Tests actualizados

- [x] **T-3.1** Actualizar `heat-confirmation.page.spec.ts`
  - Test existente de onContinue() → verificar que navega a /heat-confirmation-summary
  - Verificar que el router state incluye heatPayload y selectedAthleteId
  - (El test que verificaba navigate a /scoring debe actualizarse)

---

## Progreso

```
Capa 1 — Página  [ ] T-1.1  [ ] T-1.2  [ ] T-1.3
Capa 2 — Routing [ ] T-2.1  [ ] T-2.2
Capa 3 — Tests   [ ] T-3.1

Total:  6 tareas
Hecho:  0 / 6
```

---

## Secuencia de commits al completar

```bash
git add libs/contexts/heat/src/feature/pages/heat-confirmation-summary/
git commit -m "feat(judge): add heat-confirmation-summary page (step 2 of 4)"

git add libs/contexts/heat/src/feature/heat.routes.ts
git add libs/contexts/heat/src/feature/pages/heat-confirmation/heat-confirmation.page.ts
git commit -m "feat(heat): update routing — confirmation navigates to summary step"

git add libs/contexts/heat/src/feature/pages/heat-confirmation/heat-confirmation.page.spec.ts
git commit -m "test(heat): update onContinue spec — navigation target is summary"
```

---

## Trigger de archive

Hacer archive cuando:

- [ ] Las 6 tareas están marcadas [x]
- [ ] `nx test heat --coverage` pasa con ≥ 80%
- [ ] Test manual en dispositivo móvil real: flujo completo access → confirmation → summary → scoring funciona

Comando: `/opsx:archive heat-confirmation-step-2`
