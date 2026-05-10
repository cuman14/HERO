# AGENTS.md — H.E.R.O Agent Skills Reference

> Skills available in this monorepo for AI agents (Windsurf / Antigravity / Claude).  
> Reference the skill name in your prompt to activate it.

---

## Angular Skills

### `angular-component`

**When to use:**

- Creating a new Angular standalone component
- Refactoring class-based `@Input`/`@Output` decorators to signal-based `input()` / `output()`
- Adding `host` bindings (replacing `@HostBinding` / `@HostListener`)
- Implementing accessible interactive components (toggle, button, etc.)

**Key patterns enforced:**

- Standalone by default — do **not** set `standalone: true` explicitly (Angular v20+)
- `ChangeDetectionStrategy.OnPush` — always
- Signal inputs: `input<T>()`, `input.required<T>()`, `input(default, { transform })`
- Signal outputs: `output<T>()`
- `host` object for bindings and listeners — never `@HostBinding` / `@HostListener`
- Native control flow (`@if`, `@for`, `@switch`) — never `*ngIf`, `*ngFor`, `*ngSwitch`
- Direct class/style bindings — never `ngClass` / `ngStyle`
- `NgOptimizedImage` for static images

**Do NOT use for:**

- E2E tests or Playwright interactions
- Service-only or state-only changes

---

### `angular-forms`

**When to use:**

- Implementing a form with validation
- Adding conditional fields (hidden, disabled, readonly)
- Building multi-step or dynamic forms
- Adding cross-field or async validation

**Key patterns enforced:**

- Signal Forms API (`@angular/forms/signals`) — experimental, recommended for new work
- Form model is a `signal<T>()` — single source of truth
- `form(model, schemaFn)` creates the typed form tree
- Built-in validators: `required`, `email`, `min`, `max`, `minLength`, `maxLength`, `pattern`
- Custom validators: `validate(field, fn)`
- Async validators: `validateHttp(field, { request, onSuccess, onError })`
- Conditional logic: `hidden()`, `disabled()`, `readonly()`
- Submission: `submit(form, callback)` — marks fields touched before running callback

**Do NOT use for:**

- Template-driven forms without signals
- Third-party form libraries (Formly, ngx-formly)

---

### `angular-testing`

**When to use:**

- Writing unit tests for components, services, or directives
- Testing signal-based components with `OnPush`
- Mocking dependencies in `TestBed`
- Testing HTTP interactions

**Key patterns enforced:**

- **Vitest** with `@angular/build:unit-test` (Angular v20+ native support)
- `TestBed.configureTestingModule({ imports: [StandaloneComponent] })`
- Signal inputs set via `fixture.componentRef.setInput('name', value)`
- Service mocks via `{ provide: ServiceClass, useValue: mockObject }`
- Vitest mocks: `vi.fn()`, `vi.clearAllMocks()`
- Async: `fakeAsync` + `tick()` for timers, `waitForAsync` for promises
- HTTP: `provideHttpClientTesting()` + `HttpTestingController`

**Do NOT use for:**

- E2E testing with Cypress or Playwright
- Testing non-Angular TypeScript code (use plain Vitest)

---

## Architecture Skills

### `clean-ddd-hexagonal`

**When to use:**

- Designing domain models, aggregates, entities, or value objects
- Defining repository interfaces (ports) or infrastructure adapters
- Implementing use cases / application services
- Working with bounded contexts, domain events, CQRS, or the outbox pattern
- Any time the question is "where does this code go?" across layers

**Key patterns enforced:**

- Dependency Rule: `Infrastructure → Application → Domain` — never inward-to-outward
- One repository per **aggregate**, not per table
- Domain layer has **zero** external dependencies (no Angular, no Supabase)
- Use cases = one class, one `execute()` method, injected via DI tokens
- Cross-aggregate consistency via domain events (eventual consistency)
- Model **behavior**, not data — avoid anemic domain models

**Decision trees enforced:**

| Question                               | Answer                       |
| -------------------------------------- | ---------------------------- |
| Pure business logic, no I/O            | `domain/`                    |
| Orchestrates domain + has side effects | `application/`               |
| Talks to external systems              | `infrastructure/`            |
| Defines _how_ to interact (interface)  | port (domain or application) |
| Implements a port                      | adapter (infrastructure)     |

**Do NOT use for:**

- Simple CRUD with no business rules
- Prototypes or throwaway scripts
- Angular component or UI concerns

---

## Project-Specific Rules (always apply)

These override or extend the generic skill defaults for this repo:

| Rule                | Value                                                                                                                                                                                                                                              |
| ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Angular version     | 20+ (skills aligned to v20+)                                                                                                                                                                                                                       |
| Test runner         | Vitest (Jest API-compatible)                                                                                                                                                                                                                       |
| Styling             | Tailwind CSS v4 only — no inline styles                                                                                                                                                                                                            |
| State               | Angular Signals — no NgRx, no BehaviorSubject for new state                                                                                                                                                                                        |
| Component placement | Reusable → `libs/ui/`, Feature-specific → `apps/{app}/features/`                                                                                                                                                                                   |
| Page components     | Must use `templateUrl` + `styleUrl` — no inline `template`/`styles`                                                                                                                                                                                |
| Variable naming     | Descriptive always — no single-letter names (e.g. `movement`, not `m`)                                                                                                                                                                             |
| Design patterns     | Propose + await approval before implementing (Repository, Command, etc.)                                                                                                                                                                           |
| DI style            | Always use `inject()` — **never** `@Inject()` constructor injection. Test services/facades via `TestBed.inject()` with mocked providers, not direct `new ClassName(...)`                                                                           |
| TestBed bootstrap   | Call `setupTestBed()` from `@analogjs/vitest-angular/setup-testbed` at **module level** in each spec file that uses `TestBed` (not in `test-setup.ts`). Use `async beforeEach` + `await TestBed.configureTestingModule({...}).compileComponents()` |

See `@.windsurf/rules/app-rules.md` for the full ruleset.
