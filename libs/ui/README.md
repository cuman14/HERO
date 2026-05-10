# UI Components

Shared presentational components for H.E.R.O. apps. All components are standalone, use `ChangeDetectionStrategy.OnPush`, and accept signal inputs.

## Atoms

| Component         | Selector     | Description                                 |
| ----------------- | ------------ | ------------------------------------------- |
| `ButtonComponent` | `lib-button` | Primary/secondary button with loading state |
| `InputComponent`  | `lib-input`  | Text input with label and error message     |

## Molecules

| Component                    | Selector                  | Key inputs                                     | Key outputs                                          |
| ---------------------------- | ------------------------- | ---------------------------------------------- | ---------------------------------------------------- |
| `MovementStackCardComponent` | `lib-movement-stack-card` | `items: MovementStackItem[]`, `elapsedSeconds` | —                                                    |
| `NumericKeypadComponent`     | `lib-numeric-keypad`      | —                                              | `digitPressed`, `backspacePressed`, `confirmPressed` |
| `RepetitionCounterComponent` | `lib-repetition-counter`  | `count`, `max`                                 | `increment`, `decrement`                             |
| `AthleteHeaderComponent`     | `lib-athlete-header`      | `athleteName`, `bibNumber`, `heatName`         | —                                                    |
| `MovementCardComponent`      | `lib-movement-card`       | `movement`                                     | —                                                    |
| `AthleteCardComponent`       | `lib-athlete-card`        | `athlete`                                      | —                                                    |
| `SubmitButtonComponent`      | `lib-submit-button`       | `loading`, `disabled`                          | `submitted`                                          |
| `TabSwitcherComponent`       | `lib-tab-switcher`        | `tabs`, `activeTab`                            | `tabChange`                                          |
| `WodInfoCardComponent`       | `lib-wod-info-card`       | `wod`                                          | —                                                    |

### MovementStackItem

```typescript
interface MovementStackItem {
  id: string;
  name: string;
  description: string;
  targetReps: number;
  currentReps: number;
  status: 'completed' | 'active' | 'upcoming';
  roundLabel: string;
  roundIndex: number;
}
```

## Running tests

```bash
pnpm nx run ui:test
```
