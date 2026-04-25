## 1. Domain Models & Value Objects

- [x] 1.1 Create `libs/core/src/lib/score/domain/movement.model.ts` with Movement entity and MovementId value object
- [x] 1.2 Create `libs/core/src/lib/score/domain/repetition-record.model.ts` with RepetitionRecord entity and RepetitionCount value object
- [x] 1.3 Create `libs/core/src/lib/score/domain/athlete-heat.model.ts` with AthleteHeat aggregate root
- [x] 1.4 Create `libs/core/src/lib/score/domain/index.ts` barrel export for all domain models

## 2. Application Layer - Facades & Signal Stores

- [x] 2.1 Create `libs/core/src/lib/score/application/register-repetitions.facade.ts` with methods: `loadHeat()`, `updateRepetitionCount()`, `submitRepetitionCount()`, `navigateToMovement()`
- [x] 2.2 Create `libs/core/src/lib/score/application/register-repetitions.store.ts` Signal Store with state: `currentHeat`, `currentMovement`, `repetitionCounts`, `isLoading`, `error`
- [x] 2.3 Create mock data file `libs/core/src/lib/score/application/mock-heat-data.ts` with sample heat, movements, and athlete data
- [x] 2.4 Create `libs/core/src/lib/score/application/index.ts` barrel export for facade and store
- [x] 2.5 Create unit tests `libs/core/src/lib/score/application/register-repetitions.store.spec.ts` for store logic
- [x] 2.6 Create unit tests `libs/core/src/lib/score/application/register-repetitions.facade.spec.ts` for facade methods

## 3. UI Components (Dumb Components)

- [x] 3.1 Create `libs/ui/src/lib/repetition-counter/repetition-counter.component.ts` with input/output for count and state
- [x] 3.2 Create `libs/ui/src/lib/repetition-counter/repetition-counter.component.html` template with increment/decrement buttons and input field
- [x] 3.3 Create `libs/ui/src/lib/repetition-counter/repetition-counter.component.css` with Tailwind styling
- [x] 3.4 Create unit tests `libs/ui/src/lib/repetition-counter/repetition-counter.component.spec.ts`
- [x] 3.5 Create `libs/ui/src/lib/movement-card/movement-card.component.ts` displaying movement name and description
- [x] 3.6 Create `libs/ui/src/lib/movement-card/movement-card.component.html` template
- [x] 3.7 Create `libs/ui/src/lib/movement-card/movement-card.component.css` with Tailwind styling
- [x] 3.8 Create unit tests `libs/ui/src/lib/movement-card/movement-card.component.spec.ts`
- [x] 3.9 Create `libs/ui/src/lib/athlete-header/athlete-header.component.ts` displaying athlete info
- [x] 3.10 Create `libs/ui/src/lib/athlete-header/athlete-header.component.html` template
- [x] 3.11 Create `libs/ui/src/lib/athlete-header/athlete-header.component.css` with Tailwind styling
- [x] 3.12 Create unit tests `libs/ui/src/lib/athlete-header/athlete-header.component.spec.ts`

## 4. Feature Page Component

- [x] 4.1 Create `apps/judge/src/app/features/score/pages/register-movement-repetitions/register-movement-repetitions.page.ts` smart component
- [x] 4.2 Create `apps/judge/src/app/features/score/pages/register-movement-repetitions/register-movement-repetitions.page.html` template
- [x] 4.3 Create `apps/judge/src/app/features/score/pages/register-movement-repetitions/register-movement-repetitions.page.css` with Tailwind styling
- [x] 4.4 Create unit tests `apps/judge/src/app/features/score/pages/register-movement-repetitions/register-movement-repetitions.page.spec.ts`
- [x] 4.5 Create route configuration in `apps/judge/src/app/app.routes.ts` for the new page
- [x] 4.6 Integrate page with RegisterRepetitionsFacade and Signal Store

## 5. Visual Validation & Testing (STOP_POINT)

- [ ] 5.1 Run the judge app and navigate to the register movement repetitions page
- [ ] 5.2 Verify all UI components render correctly with mock data
- [ ] 5.3 Test increment/decrement buttons functionality
- [ ] 5.4 Test direct input field for repetition count
- [ ] 5.5 Test movement navigation (next/previous buttons)
- [ ] 5.6 Test visual feedback for unsaved changes
- [ ] 5.7 Verify responsive design on mobile and tablet viewports
- [ ] 5.8 **STOP_POINT: Mandatory visual validation checkpoint - await user approval before proceeding to infrastructure**

## 6. Infrastructure Layer - Repositories & Supabase Integration

- [ ] 6.1 Create `libs/core/src/lib/score/infrastructure/repetition-record.repository.ts` with methods: `findByHeatAndMovement()`, `save()`, `subscribe()`
- [ ] 6.2 Create `libs/core/src/lib/score/infrastructure/movement.repository.ts` with methods: `findByHeat()`, `findById()`
- [ ] 6.3 Create `libs/core/src/lib/score/infrastructure/mappers/repetition-record.mapper.ts` to map between domain and Supabase models
- [ ] 6.4 Create `libs/core/src/lib/score/infrastructure/mappers/movement.mapper.ts` to map between domain and Supabase models
- [ ] 6.5 Update `libs/core/src/lib/score/application/register-repetitions.facade.ts` to use real repositories instead of mock data
- [ ] 6.6 Implement Supabase real-time subscriptions for repetition count synchronization
- [ ] 6.7 Create unit tests `libs/core/src/lib/score/infrastructure/repetition-record.repository.spec.ts`
- [ ] 6.8 Create unit tests `libs/core/src/lib/score/infrastructure/movement.repository.spec.ts`

## 7. Integration & End-to-End Testing

- [ ] 7.1 Create integration tests for the full flow: load heat → navigate movements → submit rep counts
- [ ] 7.2 Test real-time synchronization between multiple judge instances
- [ ] 7.3 Test error handling for network failures and validation errors
- [ ] 7.4 Test offline-first behavior with Supabase sync
- [ ] 7.5 Create E2E tests with Playwright for the complete user flow
- [ ] 7.6 Verify all accessibility requirements (48x48px touch targets, high contrast, etc.)

## 8. Documentation & Cleanup

- [ ] 8.1 Update `libs/core/README.md` with documentation for the new score domain
- [ ] 8.2 Update `libs/ui/README.md` with component documentation
- [ ] 8.3 Add JSDoc comments to all public APIs
- [ ] 8.4 Verify no contractions in file names or variable names
- [ ] 8.5 Run linting and formatting checks across all new files
- [ ] 8.6 Create git branch `feature/score-register-movement-reps` and commit all changes
