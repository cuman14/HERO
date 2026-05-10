# Módulo Admin Panel

> `apps/admin` · Angular 21 · Desktop · Acento `blue-600`

## Propósito

El administrador configura toda la competición antes del día del evento y monitoriza los scores en tiempo real durante la competición.

---

## Flujo de configuración (6 pasos)

```
① Crear Evento
  → name, sport_type, date, ranking_method

② Definir Categorías
  → Masculino, Femenino, Equipos Mixed...
  → is_team, team_size_min/max

③ Definir Niveles (dentro de cada categoría)
  → RX, Scaled, Elite...
  → order_index, color para badge

④ Crear WODs
  → type (amrap/for_time/max_weight...)
  → base_config (JSONB)
  → wod_level_configs por nivel (peso, movimientos)

⑤ Registrar Atletas
  → Importar CSV o manual
  → Asignar category_id + level_id + bib_number

⑥ Crear Heats
  → Asociar a un WOD
  → Añadir atletas (composición libre — se pueden mezclar niveles)
  → Asignar juez a cada atleta (judge_id en heat_athletes)
```

---

## Features del MVP

### Dashboard
- KPIs: total atletas, heats activos, WODs configurados, scores pendientes
- Lista de heats con estado (pending / active / finished)
- Botón "Iniciar heat" → actualiza `heats.status = 'active'`

### Gestión de Heats
- Crear heat asociado a un WOD
- Añadir atletas al heat (selector multi-atleta)
- Asignar juez a cada atleta
- Iniciar / finalizar heat (cambia status + timestamps)

### Importación de Atletas
- Importar desde CSV (formato WodBuster)
- Asignar automáticamente categoría y nivel por columnas del CSV
- Idempotente: `ON CONFLICT (id) DO NOTHING`

> **WodBuster:** El scraping desde `arena.wodbuster.com` devuelve 403.  
> Workaround: abrir la consola del navegador en WodBuster y ejecutar  
> `fetch('/api/CompeticionUI/GetInfoAtleta/{id}')` desde dentro del dominio.  
> Los IDs `ShowInfo(XXXX)` están en el HTML de la página de categorías.

### Vista de Scores
- Tabla de scores por WOD/categoría/nivel
- Estado: `draft → submitted → confirmed → disputed → void`
- Confirmar score (admin confirma lo que el juez envió)
- Marcar como disputado + razón
- Editar score manualmente si es necesario

---

## Estructura de features

```
apps/admin/src/app/features/
├── events/
│   ├── components/
│   │   └── event-form/
│   ├── containers/
│   │   └── events-page/
│   └── events.routes.ts
│
├── categories/
│   └── ... (mismo patrón)
│
├── wods/
│   ├── components/
│   │   ├── wod-form/
│   │   └── wod-level-config-form/
│   └── ...
│
├── athletes/
│   ├── components/
│   │   ├── athlete-table/
│   │   └── csv-importer/
│   └── ...
│
├── heats/
│   ├── components/
│   │   ├── heat-card/
│   │   └── heat-athlete-assignment/
│   └── ...
│
└── scores/
    ├── components/
    │   └── score-review-table/
    └── ...
```

---

## RLS del Admin

```sql
-- El admin tiene acceso total a los datos de sus eventos
-- Verificado por: profiles.role = 'admin'
-- Scope: events donde events.created_by = auth.uid()
```

---

## Componentes UI específicos

| Componente | Descripción |
|------------|-------------|
| `HeatCardComponent` | Card con estado, atletas asignados, botón iniciar |
| `AthleteTableComponent` | Tabla paginada con filtros por nivel/categoría |
| `CsvImporterComponent` | Drag&drop de CSV + preview antes de importar |
| `WodLevelConfigFormComponent` | Formulario dinámico para config por nivel |
| `ScoreReviewTableComponent` | Tabla de scores con acciones confirmar/disputar |
