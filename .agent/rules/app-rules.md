# ScoreApp — AI Editor Rules & Development Guidelines

> These rules apply to **Antigravity** and **Windsurf** AI editors.  
> Every code generation, refactor, or suggestion MUST follow this document.

---

## 1. Project Context

ScoreApp is a SaaS platform for managing results in high-intensity fitness competitions (CrossFit, Hyrox). It consists of three modules in a **Nx monorepo**:

| Module | Tech | Target |
|--------|------|--------|
| `apps/admin` | Angular 17+ | Desktop / Tablet |
| `apps/judge` | Angular 17+ PWA | Mobile-first |
| `apps/leaderboard` | Astro | TV / Projector / Mobile |
| `libs/*` | Shared domain libs | All apps |

**Backend:** Supabase (PostgreSQL + Realtime)  
**Hosting:** Vercel  
**Goal:** MVP demo on April 11, 2026.

---

## 2. Monorepo Structure (Nx)

```
scoreapp/
├── apps/
│   ├── admin/                    # Angular Admin Panel
│   ├── judge/                    # Angular PWA Judge Interface
│   └── leaderboard/              # Astro Live Leaderboard
├── libs/
│   ├── domain/                   # Pure domain: entities, value objects, interfaces
│   │   ├── athlete/
│   │   ├── competition/
│   │   ├── heat/
│   │   └── score/
│   ├── application/              # Use cases, ports (interfaces for repos/services)
│   │   ├── score/
│   │   ├── competition/
│   │   └── leaderboard/
│   ├── infrastructure/           # Supabase adapters, HTTP clients, realtime
│   │   ├── supabase/
│   │   └── realtime/
│   └── ui/                       # Shared Angular components (design system)
│       ├── components/
│       └── tokens/               # Design tokens (Tailwind CSS vars)
├── nx.json
├── package.json
└── tailwind.config.ts
```

### Naming conventions

| Layer | Suffix | Example |
|-------|--------|---------|
| Entity | `.entity.ts` | `score.entity.ts` |
| Value Object | `.vo.ts` | `rep-count.vo.ts` |
| Use Case | `.use-case.ts` | `submit-score.use-case.ts` |
| Repository interface | `.repository.ts` | `score.repository.ts` |
| Supabase adapter | `.repository.supabase.ts` | `score.repository.supabase.ts` |
| Angular Service | `.service.ts` | `score-state.service.ts` |
| Component | `.component.ts` | `score-input.component.ts` |
| Test | `.spec.ts` | `score-input.component.spec.ts` |

---

## 3. Domain-Driven Design (DDD) — Layer Rules

### 3.1 Domain Layer (`libs/domain/*`)

- **Zero dependencies** on Angular, Supabase, or any framework.
- Contains: Entities, Value Objects, Domain Events, Repository interfaces.
- All domain logic lives here. No side effects.

```typescript
// libs/domain/score/score.entity.ts
export class Score {
  constructor(
    public readonly id: string,
    public readonly athleteId: string,
    public readonly heatId: string,
    public readonly reps: RepCount,
    public readonly submittedAt: Date,
  ) {}

  isValid(): boolean {
    return this.reps.value >= 0;
  }
}

// libs/domain/score/rep-count.vo.ts
export class RepCount {
  constructor(public readonly value: number) {
    if (value < 0) throw new Error('RepCount cannot be negative');
  }
}

// libs/domain/score/score.repository.ts  ← PORT (interface)
export interface ScoreRepository {
  save(score: Score): Promise<void>;
  findByHeat(heatId: string): Promise<Score[]>;
}
```

### 3.2 Application Layer (`libs/application/*`)

- Contains Use Cases only. Each use case = one class with one `execute()` method.
- Depends only on Domain interfaces (ports). Never imports infrastructure directly.
- Injected via Angular DI tokens.

```typescript
// libs/application/score/submit-score.use-case.ts
import { inject, Injectable } from '@angular/core';
import { SCORE_REPOSITORY } from './score.tokens';
import { Score } from '@scoreapp/domain/score';
import { RepCount } from '@scoreapp/domain/score';

@Injectable()
export class SubmitScoreUseCase {
  private readonly repo = inject(SCORE_REPOSITORY);

  async execute(athleteId: string, heatId: string, reps: number): Promise<void> {
    const score = new Score(
      crypto.randomUUID(),
      athleteId,
      heatId,
      new RepCount(reps),
      new Date(),
    );
    await this.repo.save(score);
  }
}
```

### 3.3 Infrastructure Layer (`libs/infrastructure/*`)

- Implements repository interfaces using Supabase.
- Provided at app level via `InjectionToken`.

```typescript
// libs/infrastructure/supabase/score.repository.supabase.ts
import { inject, Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { ScoreRepository } from '@scoreapp/domain/score';
import { Score } from '@scoreapp/domain/score';

@Injectable()
export class ScoreRepositorySupabase implements ScoreRepository {
  private readonly supabase = inject(SupabaseClient);

  async save(score: Score): Promise<void> {
    await this.supabase.from('scores').insert({
      id: score.id,
      athlete_id: score.athleteId,
      heat_id: score.heatId,
      reps: score.reps.value,
      submitted_at: score.submittedAt.toISOString(),
    });
  }

  async findByHeat(heatId: string): Promise<Score[]> {
    const { data } = await this.supabase
      .from('scores')
      .select('*')
      .eq('heat_id', heatId);
    return (data ?? []).map(/* map to domain entity */);
  }
}
```

### 3.4 UI / Presentation Layer (`apps/*` + `libs/ui/*`)

- Angular Standalone Components only. No NgModules.
- Components are **dumb** (receive inputs, emit outputs) or **smart** (inject services/use cases).
- Smart components live in `apps/*/features/`. Dumb components live in `libs/ui/components/`.

#### Component placement decision rule:

```
Is this component reused across apps?
  YES → libs/ui/components/
  NO  → Is it feature-specific with business logic?
          YES → apps/{app}/features/{feature}/
          NO  → apps/{app}/shared/components/
```

---

## 4. State Management — Signals + Services

Use Angular Signals for all state. No NgRx. No BehaviorSubject unless wrapping external observables.

```typescript
// apps/judge/features/score-input/score-input.state.service.ts
import { Injectable, signal, computed } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ScoreInputStateService {
  // State
  private readonly _reps = signal<number>(0);
  private readonly _submitting = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);

  // Public read-only signals
  readonly reps = this._reps.asReadonly();
  readonly submitting = this._submitting.asReadonly();
  readonly error = this._error.asReadonly();
  readonly isValid = computed(() => this._reps() > 0);

  setReps(value: number): void {
    this._reps.set(value);
    this._error.set(null);
  }

  setSubmitting(value: boolean): void {
    this._submitting.set(value);
  }

  setError(message: string): void {
    this._error.set(message);
  }

  reset(): void {
    this._reps.set(0);
    this._submitting.set(false);
    this._error.set(null);
  }
}
```

### Rules for Signals:

- State is **private**, exposed as `asReadonly()`.
- Derived state uses `computed()`.
- Side effects use `effect()` only for DOM/external sync. Never for business logic.
- Service methods mutate state. Components call service methods only.

---

## 5. Angular Component Rules

### Always use Standalone Components

```typescript
@Component({
  selector: 'app-score-input',
  standalone: true,                        // ← ALWAYS
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './score-input.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,  // ← ALWAYS
})
export class ScoreInputComponent {
  protected readonly state = inject(ScoreInputStateService);
  protected readonly submitUseCase = inject(SubmitScoreUseCase);

  async onSubmit(): Promise<void> {
    this.state.setSubmitting(true);
    try {
      await this.submitUseCase.execute(/* ... */);
    } catch (e) {
      this.state.setError('Error al guardar');
    } finally {
      this.state.setSubmitting(false);
    }
  }
}
```

### Component rules checklist:

- `standalone: true` — always.
- `ChangeDetectionStrategy.OnPush` — always.
- `inject()` function — always (no constructor injection).
- `protected` visibility for template-bound members.
- No business logic in templates. No complex expressions in `{{ }}`.
- Inputs typed with `input<T>()` signal API (Angular 17+).
- Outputs typed with `output<T>()` signal API (Angular 17+).

```typescript
// Signal-based inputs/outputs (Angular 17+)
readonly athleteId = input.required<string>();
readonly onScoreSubmitted = output<void>();
```

---

## 6. Styling — Tailwind CSS v4

- **Tailwind v4** is the only styling system. No custom CSS unless absolutely necessary.
- Design tokens are defined in `tailwind.config.ts` and consumed via CSS variables.
- Module accent colors:
  - Admin Panel → `blue-*`
  - Judge Interface → `violet-*`
  - Live Leaderboard → `emerald-*`

### Rules:

- No `style=""` inline attributes. Use Tailwind utilities only.
- Responsive prefixes: `sm:`, `md:`, `lg:`. Mobile-first always.
- Dark mode: `dark:` prefix when needed.
- Extract repeated class combinations into a component. Do not duplicate long class strings.
- Use `@apply` in `.css` files sparingly — only for base element resets or design tokens.

```html
<!-- ✅ Correct -->
<button class="w-full bg-violet-600 text-white font-semibold py-4 rounded-2xl 
               text-lg active:scale-95 transition-transform disabled:opacity-50"
        [disabled]="state.submitting()">
  Enviar Score
</button>

<!-- ❌ Wrong: inline styles -->
<button style="background: purple; width: 100%">Enviar Score</button>
```

---

## 7. Testing — Vitest + Angular Testing Library

### Scope for MVP: Component rendering tests only.

Every component in `apps/*/features/` and `libs/ui/components/` must have a `.spec.ts` file.

### Setup

```typescript
// vitest.config.ts (app level)
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test-setup.ts'],
  },
});
```

### Component test template

```typescript
// score-input.component.spec.ts
import { render, screen } from '@testing-library/angular';
import { ScoreInputComponent } from './score-input.component';
import { ScoreInputStateService } from './score-input.state.service';

describe('ScoreInputComponent', () => {
  it('should render the submit button', async () => {
    await render(ScoreInputComponent, {
      providers: [ScoreInputStateService],
    });
    expect(screen.getByRole('button', { name: /enviar score/i })).toBeInTheDocument();
  });

  it('should disable submit button when submitting', async () => {
    const stateService = new ScoreInputStateService();
    stateService.setSubmitting(true);

    await render(ScoreInputComponent, {
      providers: [{ provide: ScoreInputStateService, useValue: stateService }],
    });

    expect(screen.getByRole('button', { name: /enviar score/i })).toBeDisabled();
  });
});
```

### Test rules:

- Test behaviour, not implementation. Never test private methods.
- One `describe` per component. One `it` per user-visible behaviour.
- Use `@testing-library/angular` queries: `getByRole`, `getByText`, `queryByTestId`.
- Avoid `fixture.detectChanges()` patterns — use Testing Library's `render()`.
- Mock services with `{ provide: ServiceClass, useValue: mockObject }`.
- Minimum: one render test + one per interactive state (disabled, loading, error).

---

## 8. Design Patterns — Evaluation & Justification

For each pattern, the AI agent must justify its use before implementing it.

### Patterns to evaluate on every feature:

#### Repository Pattern ✅ ALWAYS USE
**Why:** Decouples domain from Supabase. Allows swapping backend without touching use cases or UI. Critical for testability.

#### Observer / Reactive (Signals) ✅ ALWAYS USE
**Why:** Angular Signals provide fine-grained reactivity without RxJS complexity. Leaderboard real-time updates use Supabase Realtime → converted to Signals at the infrastructure boundary.

```typescript
// Converting Supabase Realtime to Signal
effect(() => {
  const channel = this.supabase
    .channel('scores')
    .on('postgres_changes', { event: '*', schema: 'public', table: 'scores' },
      (payload) => this._scores.set(payload.new as Score[]))
    .subscribe();

  return () => channel.unsubscribe(); // cleanup
});
```

#### Command Pattern — EVALUATE PER FEATURE
**When to use:** When a user action needs to be queued, retried, or logged (e.g., offline score submission in Judge PWA).  
**When NOT to use:** Simple CRUD operations that don't need queuing.

```typescript
// Use for offline-first judge score submission
interface ScoreCommand {
  type: 'SUBMIT_SCORE';
  payload: { athleteId: string; heatId: string; reps: number };
  timestamp: number;
  retries: number;
}
```

#### Factory Pattern — EVALUATE PER FEATURE
**When to use:** Creating domain entities with complex construction logic or variants.  
**When NOT to use:** Simple object creation that a constructor handles fine.

```typescript
// Only if Score creation has multiple complex variants
export class ScoreFactory {
  static createForIndividual(athleteId: string, heatId: string, reps: number): Score { }
  static createForTeam(teamId: string, heatId: string, memberReps: number[]): Score { }
}
```

### Agent instruction: Before implementing any pattern, output a comment block:

```typescript
/**
 * PATTERN: Repository
 * REASON: ScoreRepository decouples Supabase from use cases.
 *         Enables unit testing without DB connection.
 * ALTERNATIVE CONSIDERED: Direct Supabase calls in service — rejected
 *   because it couples presentation to infrastructure.
 */
```

---

## 9. Performance Rules

### Angular

- `ChangeDetectionStrategy.OnPush` on every component — no exceptions.
- Use `trackBy` on every `*ngFor` / `@for`.
- Lazy-load feature routes: `loadComponent: () => import(...)`.
- `@defer` for below-fold content in admin and leaderboard.
- Avoid large Angular bundles: use `ng build --stats-json` + `webpack-bundle-analyzer`.

### Leaderboard (Astro)

- Astro Islands for interactive score updates only. Static shell renders on server.
- Supabase Realtime subscription only active when leaderboard is visible (`IntersectionObserver`).
- Use `preload` for critical fonts. Avoid layout shift (CLS < 0.1).

### Supabase / Data

- Real-time subscriptions filtered by `heat_id` — never subscribe to full table.
- Use Supabase Row Level Security (RLS) on all tables.
- Debounce score updates on the leaderboard: 300ms minimum between re-renders.
- Paginate athlete lists in admin: 50 per page max.

### Judge PWA

- Service Worker caches score submission queue for offline support.
- Touch targets minimum **48×48px** on all interactive elements.
- Input response < 16ms (no heavy computation on main thread).

---

## 10. Commit Convention

Use **Conventional Commits** enforced by `commitlint`.

```
<type>(<scope>): <description>

Types: feat | fix | refactor | test | chore | docs | perf | style
Scopes: admin | judge | leaderboard | domain | application | infra | ui | nx

Examples:
feat(judge): add numpad score input component
test(judge): add rendering tests for score-input component  
fix(infra): handle supabase realtime reconnection on network loss
perf(leaderboard): debounce score update signal by 300ms
refactor(domain): extract RepCount value object from Score entity
```

---

## 11. Code Generation Checklist

Before generating any code, the AI agent must verify:

- [ ] Layer is correct: domain / application / infrastructure / presentation
- [ ] Component is standalone with `OnPush`
- [ ] State is managed with Signals, not BehaviorSubject
- [ ] Tailwind v4 classes only, no inline styles
- [ ] A `.spec.ts` file is created alongside every new component
- [ ] Pattern usage is justified with a comment block
- [ ] Nx path aliases used (`@scoreapp/domain/score`, not relative `../../`)
- [ ] No business logic in templates
- [ ] Touch targets ≥ 48px in Judge and Leaderboard
- [ ] Commit message follows Conventional Commits format

---

## 12. Module Accent Color Quick Reference

| Module | Primary | Accent | Background |
|--------|---------|--------|------------|
| Admin Panel | `blue-600` | `blue-500` | `blue-50` |
| Judge Interface | `violet-600` | `violet-500` | `violet-50` |
| Live Leaderboard | `emerald-600` | `emerald-500` | `emerald-50` |

---

*Last updated: March 2026 — MVP target: April 11, 2026*
