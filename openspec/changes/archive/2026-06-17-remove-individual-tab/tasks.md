## 1. Remove Individual Tab and Simplify Component

- [x] 1.1 Remove `individual` entry from the `tabs` array (keep only `{ value: 'teams', label: 'Equipos' }`)
- [x] 1.2 Remove `activeTab` signal and `onTabChange` handler — no tab state needed with single tab
- [x] 1.3 Remove `individuals` computed signal and `resolvedTab` computed
- [x] 1.4 Replace `activeAthletes` computed with direct reference to `teams` computed
- [x] 1.5 Update `onTabChange` — remove or simplify since no tab switching exists
- [x] 1.6 Verify lint, typecheck, and test pass for the heat context
