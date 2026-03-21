**H.E.R.O**

High Performance Event Result Organizer

**Arquitectura Backend --- Documento de Referencia MVP**

+----------------------+----------------------+-----------------------+
| **Stack** | **Base de datos** | **Demo** |
| | | |
| Angular · Astro · | PostgreSQL 17.6 · 11 | 11 de abril de 2026 · |
| Supabase · Vercel | tablas · RLS activo | BOX Madrid |
+----------------------+----------------------+-----------------------+

**1. Qué es el backend de H.E.R.O**

H.E.R.O no tiene servidor propio. El backend es Supabase, un
Backend-as-a-Service que proporciona de forma automática todos los
servicios necesarios sobre una base de datos PostgreSQL alojada en la
nube (región eu-west-3).

Esto significa que no hay que escribir ni mantener ningún servidor Node,
Python o similar. Las tres apps del proyecto (Admin Panel, Judge
Interface y Live Leaderboard) se conectan directamente a Supabase usando
el SDK de cliente oficial.

---

**CLAVE** Supabase = PostgreSQL + REST API automática + Auth + Realtime
WebSocket + RLS. Todo incluido, sin infraestructura que
gestionar.

---

**2. Servicios de Supabase utilizados**

**2.1 PostgREST --- API REST automática**

Supabase genera automáticamente una API REST sobre cada tabla de
PostgreSQL. Desde Angular y Astro se llama a esta API usando el SDK, sin
escribir endpoints manualmente.

> // Ejemplo de query desde Angular (Judge Interface)
>
> const { data, error } = await supabase
>
> .from(\'scores\')
>
> .select(\'id, value, status, athletes(name, bib_number)\')
>
> .eq(\'heat_id\', heatId);

**2.2 Auth --- Autenticación con roles**

Gestiona el login de administradores y jueces. Cada usuario tiene un rol
(admin o judge) almacenado en la tabla profiles, que está enlazada con
el sistema de Auth de Supabase.

---

**Rol** **Acceso** **Descripción**

---

admin Total Puede crear eventos, categorías,
WODs, atletas, heats y ver todos los
scores

judge Limitado Solo puede ver y actualizar scores
de su heat asignado

anon Solo lectura El leaderboard público lee los datos
sin autenticación

---

**2.3 Realtime --- Actualizaciones en tiempo real**

Cuando un juez envía un score, Supabase emite automáticamente un evento
WebSocket a todos los clientes suscritos. El Live Leaderboard (Astro)
escucha estos eventos y se actualiza sin necesidad de hacer polling.

> // Live Leaderboard --- suscripción realtime (Astro)
>
> supabase.channel(\'scores:wod-123\')
>
> .on(\'postgres_changes\', {
>
> event: \'\*\', schema: \'public\', table: \'scores\',
>
> filter: \'wod_id=eq.wod-uuid\'
>
> }, (payload) =\> {
>
> updateLeaderboard(payload.new); // se actualiza en \< 200ms
>
> })
>
> .subscribe();

**2.4 Row Level Security (RLS)**

RLS es el sistema de seguridad de PostgreSQL que restringe qué filas
puede ver o modificar cada usuario según su rol. Está activo en las 11
tablas del proyecto.

---

**IMPORTANTE** RLS actúa en la base de datos, no en el cliente. Aunque un
juez manipule el SDK desde el navegador, la BD rechazará
cualquier operación fuera de sus permisos.

---

Políticas mínimas para el MVP:

- admin: acceso completo a todas las tablas (SELECT, INSERT, UPDATE,

  > DELETE)

- judge: SELECT en heat_athletes donde judge_id = auth.uid() y UPSERT

  > en scores con la misma condición

- anon: SELECT en la vista leaderboard_view (sin acceso a tablas
  > directamente)

**3. Base de datos --- PostgreSQL en Supabase**

**3.1 Cómo se crea y gestiona**

No se instala PostgreSQL localmente. La base de datos ya existe en
Supabase (proyecto \"hero\", eu-west-3). El schema se aplica y versiona
mediante migraciones SQL ejecutadas desde el CLI de Supabase o el SQL
Editor del panel.

---

**Acción** **Cómo hacerlo**

---

Crear/modificar tablas supabase/migrations/001_initial.sql → supabase
db push

Ver el schema Panel Supabase → Table Editor o SQL Editor

Generar tipos TS supabase gen types typescript \--project-id
\<id\> \> libs/types/database.ts

Datos de prueba supabase/seed.sql → supabase db reset

---

**3.2 Las 11 tablas del MVP**

El schema está completamente desplegado y verificado en Supabase (todas
las tablas con RLS activo):

---

**Tabla** **Grupo** **Propósito**

---

events Setup Raíz de todo. Nombre, deporte
(crossfit/hyrox), fecha, estado

categories Setup Masculino, Femenino, Mixed\... con flag
is_team

levels Setup RX, Scaled, Elite\... dentro de cada
categoría

wods Setup Los workouts del evento (amrap, for_time,
max_weight\...)

wod_level_configs Setup Configuración específica por nivel (peso,
movimientos)

athletes Atletas Atletas con categoría, nivel, bib_number
y datos de equipo

heats Atletas Grupos de competición asociados a un WOD

heat_athletes Atletas Pivot atleta↔heat con juez asignado y
calle (lane)

scores Scoring El score de cada atleta por WOD.
UNIQUE(wod_id, athlete_id)

score_stations Scoring Parciales por estación (solo Hyrox Race)

profiles Auth Usuarios del sistema vinculados a
auth.users de Supabase

---

**3.3 Vista del leaderboard (SQL View)**

El ranking se calcula en SQL on-the-fly, no se guarda en una tabla. Esto
garantiza que siempre está actualizado y no hay datos desincronizados:

> CREATE VIEW leaderboard_view AS
>
> SELECT
>
> a.name,
>
> a.bib_number,
>
> a.box,
>
> l.name AS level_name,
>
> l.code AS level_code,
>
> s.value,
>
> s.status,
>
> RANK() OVER (
>
> PARTITION BY s.wod_id, a.level_id
>
> ORDER BY (s.value-\>\>\'numeric\')::float DESC
>
> ) AS rank
>
> FROM scores s
>
> JOIN athletes a ON s.athlete_id = a.id
>
> JOIN levels l ON a.level_id = l.id
>
> WHERE s.status IN (\'submitted\', \'confirmed\');

**4. Arquitectura de capas --- dónde va cada cosa**

El código del frontend sigue una arquitectura en capas. Las queries a
Supabase tienen un lugar exacto y nunca se escriben directamente en los
componentes.

---

**\#** **Capa** **Ubicación** **Responsabilidad**

---

1 Componente apps/\*/features/\*/components/ Solo renderiza. Lee
(template) signals del store, nunca
llama repositorios

2 Signal Store apps/\*/features/\*/store/ Estado de pantalla con
\@ngrx/signals. Llama a
los Use Cases

3 Use Case libs/domain/use-cases/ Lógica de negocio pura. No
conoce Supabase, solo
interfaces

4 Repository libs/domain/repositories/ Contrato TypeScript:
interface IScoreRepository,
IHeatRepository\...

5 ★ Supabase libs/infra/repositories/ ★ AQUÍ VAN LAS QUERIES.
Repository Implementa las interfaces
con el SDK

6 Mapper libs/infra/mappers/ Convierte row de BD ↔
entidad de dominio

7 Realtime listener libs/infra/realtime/ Suscripciones WebSocket.
Devuelve toSignal() para
Angular/Astro

8 Supabase client libs/infra/supabase/client.ts Instancia única del
cliente SDK con las
variables de entorno

---

---

**REGLA** Las queries con .from().select().eq()\... SOLO existen en
libs/infra/repositories/. Nunca en stores, componentes ni use
cases.

---

**4.1 Ejemplo completo --- flujo de submit de score**

Desde que el juez pulsa \"Confirmar\" hasta que el leaderboard se
actualiza:

> // 1. Componente (dumb) emite evento
>
> onConfirm.emit({ athleteId, value });
>
> // 2. Store recibe y llama al Use Case
>
> async submitScore(dto: ScoreDto) {
>
> await this.submitScoreUC.execute(dto);
>
> patchState(store, { submitted: true });
>
> }
>
> // 3. Use Case --- lógica pura sin Supabase
>
> async execute(dto: ScoreDto): Promise\<void\> {
>
> const score = Score.create(dto); // validación de dominio
>
> await this.scoreRepo.upsert(score); // llama a la interfaz
>
> }
>
> // 4. Supabase Repository --- ÚNICA query
>
> async upsert(score: Score): Promise\<void\> {
>
> const { error } = await supabase
>
> .from(\'scores\')
>
> .upsert(ScoreMapper.toPersistence(score));
>
> if (error) throw new HeroError(error.message);
>
> }
>
> // 5. Leaderboard se actualiza solo via Realtime (\< 200ms)

**5. Tipos TypeScript --- sincronizados con la BD**

Los tipos TypeScript se generan automáticamente desde el schema real de
Supabase. Esto garantiza que el código refleja exactamente la estructura
de la base de datos sin escribirlos a mano.

**5.1 Generar los tipos**

> \# Ejecutar en la raíz del proyecto (una vez configurado el CLI)
>
> npx supabase gen types typescript \\
>
> \--project-id blgssvpsobfpfxghigca \\
>
> \> libs/types/src/database.types.ts

**5.2 Qué genera**

El archivo generado contiene la forma exacta de cada tabla con tres
variantes:

- Row: lo que devuelve un SELECT (todos los campos con sus tipos

  > reales)

- Insert: lo que se manda en un INSERT (campos opcionales si tienen

  > default)

- Update: lo que se manda en un UPDATE (todos los campos opcionales)

> // libs/types/src/database.types.ts (extracto generado)
>
> export type Database = {
>
> public: {
>
> Tables: {
>
> scores: {
>
> Row: {
>
> id: string;
>
> status: \'draft\' \| \'submitted\' \| \'confirmed\' \| \'disputed\' \|
> \'void\';
>
> value: Json;
>
> tiebreak_seconds: number \| null;
>
> // \...
>
> }
>
> Insert: { wod_id: string; athlete_id: string; value: Json; id?:
> string; }
>
> Update: { value?: Json; status?: ScoreStatus; }
>
> }
>
> // \... las 11 tablas
>
> }
>
> }
>
> }

---

**BENEFICIO** Con los tipos generados, el editor muestra autocompletado
completo y errores en tiempo real si se usa un campo
inexistente o con el tipo incorrecto. Los bugs se detectan
antes de ejecutar el código.

---

**6. Estructura de carpetas del back**

> hero/ \# NX monorepo
>
> ├── supabase/
>
> │ ├── migrations/
>
> │ │ └── 001_initial.sql \# schema completo
>
> │ └── seed.sql \# datos de prueba
>
> │
>
> └── libs/
>
> ├── types/src/
>
> │ └── database.types.ts \# ← generado por CLI
>
> │
>
> ├── domain/
>
> │ ├── entities/ \# Score, Athlete, Heat, Wod
>
> │ ├── value-objects/ \# ScoreValue, BibNumber
>
> │ ├── repositories/ \# IScoreRepo, IHeatRepo (interfaces)
>
> │ └── use-cases/ \# SubmitScoreUC, GetHeatAthletesUC
>
> │
>
> └── infra/
>
> ├── supabase/
>
> │ └── client.ts \# createClient() singleton
>
> ├── repositories/ \# SupabaseScoreRepo (queries aquí)
>
> ├── mappers/ \# ScoreMapper, AthleteMapper
>
> └── realtime/ \# score.realtime.ts → toSignal()

**7. Checklist para la demo del 11 de abril**

---

       **Tarea**                               **Estado**

---

✅ Proyecto Supabase creado (hero · Hecho
eu-west-3)

✅ 11 tablas desplegadas con RLS activo Hecho

⬜ Generar tipos TypeScript con el CLI Pendiente

⬜ Configurar políticas RLS (admin / judge Pendiente
/ anon)

⬜ Crear vista SQL leaderboard_view Pendiente

⬜ Activar Realtime en tabla scores Pendiente

⬜ Implementar libs/infra/repositories/ Pendiente
(queries)

⬜ Implementar libs/infra/realtime/ Pendiente
(WebSocket)

⬜ Seed con datos de prueba para la demo Pendiente

⬜ Variables de entorno en Vercel Pendiente
(SUPABASE_URL + KEY)

---

H.E.R.O · Arquitectura Backend MVP · Angular · Astro · Supabase · Vercel
· 2026
