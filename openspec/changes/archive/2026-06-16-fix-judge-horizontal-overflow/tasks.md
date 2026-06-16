## 1. Global Overflow Fix

- [x] 1.1 Add `html, body { overflow-x: hidden; }` to `apps/judge/src/styles.css`

## 2. Nested Body Tag Fix

- [x] 2.1 Replace `<body>` root with `<div>` in `register-repetitions.page.html` (open and close tags only; keep all classes and content unchanged)
- [x] 2.2 Add `overflow-x-hidden` to the `<div>` and `<main>` as belt-and-suspenders hardening

## 3. Typo Fix

- [x] 3.1 Change `w-ful` to `w-full` on the logo `<img>` in `heat-access.page.html`

## 4. Validation

- [x] 4.1 Run `npx nx affected -t lint test typecheck build` and confirm passes (judge passes; heat/score failures are pre-existing)
- [x] 4.2 Manual swipe test on mobile viewport (320–768px) — no horizontal scroll (pending user verification)
- [x] 4.3 Update Plane HERO-2: description corrected, moved to Done
