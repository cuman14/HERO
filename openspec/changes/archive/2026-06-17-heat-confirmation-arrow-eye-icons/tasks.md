## 1. Icon Registry

- [x] 1.1 Add `eye` SVG path to `libs/ui/src/icons/icons.ts` in both `outline` and `solid` variants
- [x] 1.2 Add `eye` to the `IconName` type in `libs/ui/src/icons/hero-icon.component.ts`

## 2. AthleteCardComponent

- [x] 2.1 Remove `selected` input from `AthleteCardComponent`
- [x] 2.2 Replace the checkbox div with conditional icon block:
      - When `scored()` is true: show eye icon (`lib-icon name="eye"`)
      - When `scored()` is false: show arrow icon (`lib-icon name="arrow-right"`)
- [x] 2.3 Update `cardClasses` computed: use `scored()` instead of `selected()` for accent border
      - Scored: `border-emerald-300 dark:border-emerald-700`
      - Not scored: `border-slate-200 dark:border-slate-800`
- [x] 2.4 Remove `checkClasses` computed (no longer needed)
- [x] 2.5 Import `HeroIconComponent` in the component's `imports` array
- [x] 2.6 Update `avatarClasses` computed: remove `selected()`-based ring styling

## 3. HeatConfirmationPage

- [x] 3.1 Remove `selectedId` signal
- [x] 3.2 Remove `canContinue` computed
- [x] 3.3 Remove `isSelected` method
- [x] 3.4 Remove `toggleSelection` method
- [x] 3.5 Remove `selectedCount` getter
- [x] 3.6 Update `onAthleteClick`: not-scored → navigate to `/heat-confirmation-summary` with `queryParams: { heatCode, athleteId }`; scored → navigate to `/scoring/:id/summary?readonly=true`
- [x] 3.7 Remove `onContinue` method
- [x] 3.8 Remove the sticky footer section from the template
- [x] 3.9 Update `onTabChange`: remove `selectedId.set(null)` since it no longer exists
- [x] 3.10 Update `onAthleteClick` to use `athlete.id` as heatAthleteId parameter

## 4. Tests — AthleteCardComponent

- [x] 4.1 Remove tests for `selected` input (selected state rendering, selected class)
- [x] 4.2 Add test: shows arrow icon when `scored` is false
- [x] 4.3 Add test: shows eye icon when `scored` is true
- [x] 4.4 Add test: card always emits `cardClick` regardless of scored state
- [x] 4.5 Add test: scored card has emerald border class
- [x] 4.6 Add test: non-scored card has default border class

## 5. Tests — HeatConfirmationPage

- [x] 5.1 Remove tests for `selectedCount`, `toggleSelection`, `isSelected`, `canContinue`
- [x] 5.2 Add test: clicking non-scored athlete navigates to `/heat-confirmation-summary`
- [x] 5.3 Add test: clicking scored athlete navigates to `/scoring/:id/summary?readonly=true`
- [x] 5.4 Add test: footer no longer contains "Continuar" button
- [x] 5.5 Update existing tests that referenced `selectedId` or `canContinue`

## 6. Documentation

- [x] 6.1 Update `apps/judge/AGENTS.md` section "Heat confirmation — scored indicator" to describe arrow/eye icons instead of checkbox selection
