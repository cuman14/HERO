---
name: H.E.R.O
description: Real-time scoring platform for CrossFit & Hyrox competitions

colors:
  # ── Judge app (light surface) ──────────────────────────────────────────
  primary: '#8b5cf6'
  on-primary: '#ffffff'
  primary-container: '#ede9fe'
  on-primary-container: '#5b21b6'
  primary-pressed: '#7c3aed'
  inverse-primary: '#c4b5fd'

  secondary: '#334155'
  on-secondary: '#ffffff'
  secondary-container: '#e2e8f0'
  on-secondary-container: '#0f172a'

  tertiary: '#f59e0b'
  on-tertiary: '#ffffff'
  tertiary-container: '#fef3c7'
  on-tertiary-container: '#92400e'

  error: '#dc2626'
  on-error: '#ffffff'
  error-container: '#fee2e2'
  on-error-container: '#991b1b'

  success: '#22c55e'
  on-success: '#ffffff'

  background: '#f8fafc'
  on-background: '#0f172a'
  surface: '#f8fafc'
  surface-dim: '#e2e8f0'
  surface-bright: '#ffffff'
  surface-container-lowest: '#ffffff'
  surface-container-low: '#f1f5f9'
  surface-container: '#f8fafc'
  surface-container-high: '#ffffff'
  surface-variant: '#f1f5f9'
  on-surface: '#0f172a'
  on-surface-variant: '#64748b'
  inverse-surface: '#1e293b'
  inverse-on-surface: '#f8fafc'
  outline: '#cbd5e1'
  outline-variant: '#e2e8f0'
  surface-tint: '#8b5cf6'

  # ── Admin & Leaderboard (dark surface) ─────────────────────────────────
  dark-background: '#0a0e1a'
  dark-surface: '#1a2035'
  dark-border: '#1e2840'
  dark-on-surface: '#dae2fd'
  dark-on-surface-variant: '#94a3b8'
  admin-primary: '#4f8ef7'
  board-primary: '#34d399'

  # ── Competition level badges ────────────────────────────────────────────
  level-rx: '#fbbf24'
  level-rx-text: '#451a03'
  level-scaled: '#38bdf8'
  level-scaled-text: '#0c4a6e'
  level-elite: '#f87171'
  level-elite-text: '#7f1d1d'
  level-adaptive: '#86efac'
  level-adaptive-text: '#14532d'

typography:
  # ── Score & hero numerals ───────────────────────────────────────────────
  score-display:
    fontFamily: Inter
    fontSize: 64px
    fontWeight: '700'
    lineHeight: 72px
    letterSpacing: -0.03em
  display-lg:
    fontFamily: Inter
    fontSize: 40px
    fontWeight: '700'
    lineHeight: 48px
    letterSpacing: -0.02em

  # ── Screen headlines ────────────────────────────────────────────────────
  headline-lg:
    fontFamily: Inter
    fontSize: 28px
    fontWeight: '600'
    lineHeight: 36px
    letterSpacing: -0.01em
  headline-md:
    fontFamily: Inter
    fontSize: 22px
    fontWeight: '600'
    lineHeight: 28px

  # ── UI text ─────────────────────────────────────────────────────────────
  title-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: '600'
    lineHeight: 26px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '600'
    lineHeight: 24px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '400'
    lineHeight: 20px

  # ── Labels & metadata (Space Grotesk) ───────────────────────────────────
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: '600'
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: '500'
    lineHeight: 16px
    letterSpacing: 0.04em

  # ── Identifiers (JetBrains Mono) ────────────────────────────────────────
  mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px

rounded:
  none: 0
  sm: 0.25rem
  md: 0.5rem
  lg: 0.75rem
  xl: 1rem
  2xl: 1.5rem
  full: 9999px

spacing:
  unit: 8px
  xs: 4px
  sm: 8px
  md: 16px
  lg: 24px
  xl: 32px
  2xl: 48px
  section: 64px

elevation:
  none: 'none'
  card: '0 1px 3px 0 rgba(0, 0, 0, 0.08)'
  float: '0 4px 6px -1px rgba(0, 0, 0, 0.10), 0 2px 4px -2px rgba(0, 0, 0, 0.08)'
  modal-scrim: 'rgba(0, 0, 0, 0.50)'

motion:
  score-pop: 'score-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)'
  rank-up: 'rank-up 0.5s ease-out'
  fast: '150ms ease-in-out'
  normal: '250ms ease-in-out'
  slow: '350ms ease-out'

components:
  # ── Keypad buttons ──────────────────────────────────────────────────────
  keypad-button:
    backgroundColor: '{colors.surface-container-low}'
    textColor: '{colors.on-surface}'
    typography: '{typography.headline-md}'
    rounded: '{rounded.full}'
    size: 72px
  keypad-button-pressed:
    backgroundColor: '{colors.primary-container}'
    textColor: '{colors.on-primary-container}'
  keypad-confirm:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.headline-md}'
    rounded: '{rounded.full}'
    size: 72px
  keypad-confirm-pressed:
    backgroundColor: '{colors.primary-pressed}'
    textColor: '{colors.on-primary}'

  # ── Movement cards ──────────────────────────────────────────────────────
  movement-card-active:
    backgroundColor: '{colors.surface-container-high}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.xl}'
    padding: '{spacing.md}'
  movement-card-completed:
    backgroundColor: '{colors.surface-container-low}'
    textColor: '{colors.on-surface-variant}'
    rounded: '{rounded.lg}'
    padding: '{spacing.sm}'
  movement-card-upcoming:
    backgroundColor: '{colors.surface-dim}'
    textColor: '{colors.on-surface-variant}'
    rounded: '{rounded.lg}'
    padding: '{spacing.sm}'

  # ── Primary CTA button ──────────────────────────────────────────────────
  button-primary:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label-lg}'
    rounded: '{rounded.2xl}'
    height: 48px
    padding: 0 24px
  button-primary-pressed:
    backgroundColor: '{colors.primary-pressed}'
    textColor: '{colors.on-primary}'

  # ── Ghost / outline button ──────────────────────────────────────────────
  button-ghost:
    backgroundColor: transparent
    textColor: '{colors.primary}'
    typography: '{typography.label-lg}'
    rounded: '{rounded.2xl}'
    height: 48px
    padding: 0 24px

  # ── Destructive button (penalties, voids) ───────────────────────────────
  button-destructive:
    backgroundColor: '{colors.error-container}'
    textColor: '{colors.on-error-container}'
    typography: '{typography.label-lg}'
    rounded: '{rounded.2xl}'
    height: 48px
    padding: 0 24px

  # ── Score chip (accumulated reps display) ───────────────────────────────
  score-chip:
    backgroundColor: '{colors.primary-container}'
    textColor: '{colors.on-primary-container}'
    typography: '{typography.title-md}'
    rounded: '{rounded.full}'
    padding: 4px 12px

  # ── Timer floating chip ─────────────────────────────────────────────────
  timer-chip:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    typography: '{typography.label-lg}'
    rounded: '{rounded.full}'
    padding: 6px 16px
  timer-chip-warning:
    backgroundColor: '{colors.tertiary}'
    textColor: '{colors.on-tertiary}'

  # ── Athlete card ────────────────────────────────────────────────────────
  athlete-card:
    backgroundColor: '{colors.surface-container-high}'
    textColor: '{colors.on-surface}'
    rounded: '{rounded.xl}'
    padding: '{spacing.md}'
  athlete-card-selected:
    backgroundColor: '{colors.primary-container}'
    textColor: '{colors.on-primary-container}'
    rounded: '{rounded.xl}'
    padding: '{spacing.md}'

  # ── Level badges ────────────────────────────────────────────────────────
  level-badge-rx:
    backgroundColor: '{colors.level-rx}'
    textColor: '{colors.level-rx-text}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.full}'
    padding: 2px 10px
  level-badge-scaled:
    backgroundColor: '{colors.level-scaled}'
    textColor: '{colors.level-scaled-text}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.full}'
    padding: 2px 10px
  level-badge-elite:
    backgroundColor: '{colors.level-elite}'
    textColor: '{colors.level-elite-text}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.full}'
    padding: 2px 10px
  level-badge-adaptive:
    backgroundColor: '{colors.level-adaptive}'
    textColor: '{colors.level-adaptive-text}'
    typography: '{typography.label-sm}'
    rounded: '{rounded.full}'
    padding: 2px 10px

  # ── Input field ─────────────────────────────────────────────────────────
  input-field:
    backgroundColor: '{colors.surface-container-low}'
    textColor: '{colors.on-surface}'
    typography: '{typography.body-md}'
    rounded: '{rounded.lg}'
    padding: 12px 16px
    height: 48px
  input-field-focused:
    backgroundColor: '{colors.surface-container-low}'
    textColor: '{colors.on-surface}'

  # ── Step progress indicators ────────────────────────────────────────────
  step-indicator-active:
    backgroundColor: '{colors.primary}'
    textColor: '{colors.on-primary}'
    rounded: '{rounded.full}'
    size: 32px
  step-indicator-completed:
    backgroundColor: '{colors.success}'
    textColor: '{colors.on-success}'
    rounded: '{rounded.full}'
    size: 32px
  step-indicator-pending:
    backgroundColor: '{colors.outline}'
    textColor: '{colors.on-surface-variant}'
    rounded: '{rounded.full}'
    size: 32px

  # ── Dark surface card (admin / leaderboard) ─────────────────────────────
  dark-card:
    backgroundColor: '{colors.dark-surface}'
    textColor: '{colors.dark-on-surface}'
    rounded: '{rounded.lg}'
    padding: '{spacing.md}'

  # ── Leaderboard rank row ────────────────────────────────────────────────
  leaderboard-row-top3:
    backgroundColor: '{colors.dark-surface}'
    textColor: '{colors.dark-on-surface}'
    rounded: '{rounded.lg}'
    padding: 12px 24px
  leaderboard-row-rest:
    backgroundColor: 'transparent'
    textColor: '{colors.dark-on-surface}'
    rounded: '{rounded.none}'
    padding: 10px 24px
---

## Overview

H.E.R.O is a real-time scoring platform for CrossFit and Hyrox competitions. Three apps share one design language expressed at different volumes — **Judge (mobile, light)**, **Admin (desktop, dark)**, **Leaderboard (TV, dark)** — but the system, spacing rhythm, and the single violet accent are consistent across all three.

The design philosophy is **legibility under stress**. Judges operate their phones in loud, high-energy environments: bad lighting, gloves, adrenaline, no time. Every decision in this system starts from that constraint. Tap targets are large, typography is never subtle, color contrast is high, and motion is reserved for confirmation feedback — never decoration.

The judge interface is dominated by the **scoring keypad**: a 3×4 grid of circular 72px buttons inspired by the iPhone dialer. Its shape language (full circles, `{rounded.full}`) is the defining motif of the whole product. Everything else orbits this interaction.

Admin and leaderboard use a dark canvas (`{colors.dark-background}`) that reduces eye strain for operators running a full-day event. The leaderboard's emerald green (`{colors.board-primary}`) is chosen for TV-distance readability — it has the highest contrast against the dark surface of any brand-adjacent hue.

## Colors

> **Source:** two Stitch design systems — _Velocity Mono_ (judge, light) and _Score Design_ (admin/leaderboard, dark).

### Judge — Light Surface

- **Violet Primary** (`{colors.primary}` — #8b5cf6): Every interactive element in the judge app. Keypad confirm button, step indicators, CTA buttons, selected states. When the judge sees violet, they tap. There is no second brand color on this surface.
- **Primary Container** (`{colors.primary-container}` — #ede9fe): The pressed/active fill for keypad digit buttons and selected athlete cards. Soft violet tint — feedback without aggression.
- **Primary Pressed** (`{colors.primary-pressed}` — #7c3aed): Darker violet for active/pressed state on primary buttons. Applied via `transform: scale(0.97)` + background shift.
- **Tertiary / Warning** (`{colors.tertiary}` — #f59e0b): Timer chip when time is running low; pending penalty states. Amber is the only color that competes with violet for attention — used sparingly and only for urgency.
- **Error** (`{colors.error}` — #dc2626): Penalty confirmations, void states, dispute alerts. Full saturation — this is a stop signal.

### Surface Stepping (Light)

Apple-style: no decorative shadows in the judge app. Depth comes from surface-color stepping alone.

- `{colors.background}` (#f8fafc) — page canvas.
- `{colors.surface-container-low}` (#f1f5f9) — default card background, input fields.
- `{colors.surface-container-high}` (#ffffff) — active card, elevated modal content.
- `{colors.surface-dim}` (#e2e8f0) — upcoming/disabled movement cards.

The steps are subtle by design. The active movement card "pops" from the completed stack through whiteness, not shadow.

### Admin & Leaderboard — Dark Surface

- `{colors.dark-background}` (#0a0e1a) — deep navy-black page canvas. Not pure black — the slight blue cast prevents the oppressive flatness of #000.
- `{colors.dark-surface}` (#1a2035) — card and panel backgrounds.
- `{colors.dark-border}` (#1e2840) — separator lines. Blue-tinted, not gray — keeps the dark surfaces feeling "technical" rather than neutral.
- **Admin Primary** (`{colors.admin-primary}` — #4f8ef7): Blue CTA for admin actions. Distinct from judge violet so context is never ambiguous.
- **Board Primary** (`{colors.board-primary}` — #34d399): Emerald for leaderboard rankings and live status indicators. Maximum contrast against dark canvas at display distance.

### Competition Level Badges

All four badge colors are **full saturation**. They appear on the leaderboard TV — they must be readable from 10 meters. Never mute, never desaturate.

- RX: amber `{colors.level-rx}` on dark text `{colors.level-rx-text}`.
- Scaled: sky `{colors.level-scaled}` on dark text `{colors.level-scaled-text}`.
- Elite: red `{colors.level-elite}` on dark text `{colors.level-elite-text}`.
- Adaptive: green `{colors.level-adaptive}` on dark text `{colors.level-adaptive-text}`.

## Typography

**Inter** is the primary typeface across all three apps. Its tall x-height, open apertures, and tabular numerals make it optimal for number-heavy scoring interfaces. Tabular numerals (`font-variant-numeric: tabular-nums`) must be enabled on any column of scores, reps, or times — columns must not shift as digits change.

**Space Grotesk** is used exclusively for labels and metadata (`{typography.label-md}`, `{typography.label-sm}`). Its slightly condensed proportions help in constrained spaces — badge labels, step connectors, secondary timestamps.

**JetBrains Mono** (`{typography.mono}`) is reserved for identifiers that benefit from fixed-width rendering: heat codes (e.g. `X7R2-AB9C`), BIB numbers, and any alphanumeric value a judge reads character by character.

### Hierarchy Principles

- **Score numerals use `{typography.score-display}` (64px/700).** The judge's primary job is to enter and confirm a number. That number must be readable at arm's length in a dark gym. 64px is the floor.
- **Weight ladder is 400 / 500 / 600 / 700.** Weight 500 is used only for Space Grotesk labels; Inter uses only 400, 600, or 700. No 300 — this is a utility interface, not editorial.
- **Negative letter-spacing at display sizes.** `{typography.score-display}` and `{typography.display-lg}` carry `−0.02 → −0.03em` tracking for a tight, confident cadence.
- **Nothing below 11px.** Gym environments are not reading environments. `{typography.label-sm}` at 11px is the absolute floor.

## Layout & Spacing

An **8px base unit** governs all spacing. Sub-base values (4px) are used only for tight typographic adjustments; structural layout snaps to multiples of 8.

### Judge (Mobile, 390px reference)

Single-column full-width layout. The keypad fills the bottom half of the viewport; the movement stack fills the top. Headers are compact — every saved pixel is vertical space for scoring controls. Horizontal padding is `{spacing.md}` (16px). No sidebars, no drawers during active scoring.

### Admin (Desktop, 1280px+)

Fixed left sidebar (256px) + scrollable main content. Data tables use `{spacing.lg}` (24px) cell padding for comfortable scanning during competition management. Modals are centered overlays, max-width 640px, with `{elevation.modal-scrim}` behind.

### Leaderboard (TV, 1920px full-bleed)

Full-bleed layout. Content locks at ~1600px with auto margins. `{spacing.section}` (64px) vertical padding between sections. Rank rows use generous `{spacing.lg}` (24px) horizontal padding — the leaderboard is read at a distance, not scrolled.

## Elevation & Depth

Elevation is flat in the judge app. Shadows compete with the urgency of score entry — they add visual noise at the exact moment the judge needs clarity. Depth comes from **surface-color contrast**, not z-axis cues.

| Level               | Treatment                                      | Used for                                              |
| ------------------- | ---------------------------------------------- | ----------------------------------------------------- |
| Flat                | No shadow, no border                           | All judge surfaces, leaderboard rows                  |
| `{elevation.card}`  | `0 1px 3px rgba(0,0,0,0.08)`                   | Athlete cards, movement cards (light separation only) |
| `{elevation.float}` | `0 4px 6px rgba(0,0,0,0.10)`                   | Timer chip, penalty overlay, floating CTAs            |
| Scrim               | `{elevation.modal-scrim}` = `rgba(0,0,0,0.50)` | Full-screen overlays (confirmation, dispute)          |

In dark mode, elevation is surface-color stepping (`dark-background` → `dark-surface` → `dark-border`). Shadows are invisible against dark backgrounds and must not be used.

## Shapes

The shape language is **circular for inputs, rounded for containers, full-pill for chips**.

| Token            | Value   | Used for                                                     |
| ---------------- | ------- | ------------------------------------------------------------ |
| `{rounded.none}` | 0       | Full-bleed rows in leaderboard (no rounding)                 |
| `{rounded.sm}`   | 0.25rem | Tight utility elements (dividers, minor badges)              |
| `{rounded.md}`   | 0.5rem  | Secondary buttons, input fields                              |
| `{rounded.lg}`   | 0.75rem | Completed/upcoming movement cards, dark-mode cards           |
| `{rounded.xl}`   | 1rem    | Active movement card, athlete card, primary sections         |
| `{rounded.2xl}`  | 1.5rem  | Primary and ghost CTA buttons                                |
| `{rounded.full}` | 9999px  | Keypad buttons (circles), timer chip, score chip, all badges |

**The keypad circle is the system's signature shape.** Everything the judge touches most often — the 10 digit keys and the confirm button — is `{rounded.full}`. This is non-negotiable: it is the tactile identity of the product.

## Components

### Keypad

The scoring engine and primary interface of the judge app. A 3×4 grid of `{component.keypad-button}` (72px circles) covering digits 0–9, backspace, and the confirm checkmark (`{component.keypad-confirm}`). Buttons carry no border — they float on the surface using `{colors.surface-container-low}` background alone.

On press, digit buttons transition to `{component.keypad-button-pressed}` (primary container fill) with `transform: scale(0.95)` and the `{motion.score-pop}` animation. The confirm button transitions to `{component.keypad-confirm-pressed}`. Animation duration is `{motion.fast}` (150ms) — fast enough to feel responsive, not so fast it disappears.

Touch targets are 72px. Minimum for gym use with training gloves.

### Movement Stack

An accordion system of movement cards. The **active movement** renders as `{component.movement-card-active}` — full height, showing exercise name (`{typography.title-lg}`), round progress (`07/15`), rep target, and a progress bar. **Completed movements** collapse to `{component.movement-card-completed}` — thin summary strip with exercise name and total reps confirmed. **Upcoming movements** are `{component.movement-card-upcoming}` — dimmed strips, not interactive.

The visual effect of completed cards being "pushed behind" the active card is achieved through background-color contrast: active uses `{colors.surface-container-high}` (white), completed uses `{colors.surface-container-low}` (light gray), upcoming uses `{colors.surface-dim}` (dimmer gray). No z-index tricks needed.

### Timer Chip

A `{component.timer-chip}` pill that floats above the active movement card using `{elevation.float}`. Always visible — it must not scroll off screen. Uses `position: sticky` within the scoring pane. When time remaining drops below a threshold (e.g. 30 seconds), transitions to `{component.timer-chip-warning}` (amber fill) without animation — the color change alone is the urgency signal.

### Athlete Card

`{component.athlete-card}` is a horizontal card: 48px avatar circle (with fallback initials on `{colors.primary-container}` background), athlete name in `{typography.title-md}`, BIB number in `{typography.mono}`, and a `{component.level-badge-*}` on the right. When selected, transitions to `{component.athlete-card-selected}`.

### Step Progress Indicator

A 4-node horizontal indicator connecting: **Heat Access → Athlete Select → Live Scoring → Summary**. Nodes are 32px circles: `{component.step-indicator-active}` (current), `{component.step-indicator-completed}` (done, with checkmark icon), `{component.step-indicator-pending}` (future). Connector lines are 2px `{colors.outline}`, filling with `{colors.primary}` as progress advances. Uses `{motion.normal}` (250ms) for fill transition.

### Level Badges

Four variants — `{component.level-badge-rx}`, `{component.level-badge-scaled}`, `{component.level-badge-elite}`, `{component.level-badge-adaptive}` — all `{rounded.full}` pills in Space Grotesk `{typography.label-sm}`. Background and text colors are paired for WCAG AA contrast. Used in athlete cards, leaderboard rows, and admin tables. **Never mute or desaturate these colors** — they must be readable at leaderboard TV distance.

### Dark Card (Admin & Leaderboard)

`{component.dark-card}` uses `{colors.dark-surface}` on `{colors.dark-background}` with `{elevation.card}` elevation (barely perceptible against dark surfaces). Border separation where needed uses `1px solid {colors.dark-border}` — the blue-tinted dark gray keeps the surface feeling technical. No drop shadows on dark surfaces.

### Leaderboard Row

Top-3 rows use `{component.leaderboard-row-top3}` (surface card with slight elevation) to visually separate the podium. Remaining rows use `{component.leaderboard-row-rest}` (transparent background, horizontal rule separator). Rank number in `{typography.display-lg}` (40px), athlete name in `{typography.title-lg}`, score in `{typography.headline-md}`, level badge right-aligned.

## Do's and Don'ts

### Do

- Use `{rounded.full}` for every keypad button — circles are the product's tactile identity.
- Keep `{component.timer-chip}` sticky and always visible during live scoring. Never let it scroll off.
- Apply `transform: scale(0.95)` + `{motion.score-pop}` on keypad press — the animation IS the confirmation feedback.
- Use `font-variant-numeric: tabular-nums` on every column of numbers: scores, reps, times, rankings.
- Use `{colors.level-*}` badge colors at full saturation — they must be readable from 10 meters on a TV.
- Step surfaces using color (`surface-container-low` → `surface-container-high`) rather than shadows in the judge app.
- Use `{typography.mono}` for heat codes and BIB numbers — fixed-width prevents layout shifts.
- Use `{colors.tertiary}` (amber) only for urgency: low timer, pending penalties. It should feel alarming.

### Don't

- Don't introduce a second accent in the judge app. Every "tap here" signal is `{colors.primary}` (violet).
- Don't use `{elevation.float}` or higher on cards or buttons in the judge app — elevation competes with the content urgency.
- Don't use custom CSS classes or inline styles. All styling through Tailwind v4 utilities referencing these tokens.
- Don't mix light and dark mode within one app. Judge is light; Admin and Leaderboard are dark.
- Don't drop below `{typography.label-sm}` (11px) — gym environments are not reading environments.
- Don't animate anything during active keypad input that could delay or obscure the digit display.
- Don't use drop shadows on dark surfaces (`dark-background`, `dark-surface`) — they are invisible and add no depth.
- Don't mute or desaturate level badge colors for any reason — contrast at distance is non-negotiable.
- Don't use Inter at weight 300. The weight ladder is 400 / 600 / 700. Lighter weights read as uncertainty in a high-stress context.

## Responsive Behavior

### Judge (Mobile)

| Breakpoint  | Width   | Key change                                                                        |
| ----------- | ------- | --------------------------------------------------------------------------------- |
| Reference   | 390px   | Full keypad layout                                                                |
| Small phone | ≤ 360px | Keypad button size reduces from 72px → 64px                                       |
| Large phone | ≥ 430px | Keypad button size increases to 76px; extra vertical space goes to movement stack |

The judge app is a **mobile-only interface**. Tablet and desktop views are not supported. If rendered at ≥ 640px, the layout is capped at 390px centered with a neutral surround — never stretched to fill.

### Admin (Desktop)

| Breakpoint    | Width       | Key change                                                           |
| ------------- | ----------- | -------------------------------------------------------------------- |
| Small desktop | 1024–1279px | Sidebar collapses to icon-only (64px); tables drop secondary columns |
| Desktop       | 1280–1920px | Full sidebar (256px) + content                                       |
| Wide          | ≥ 1920px    | Content locks at 1600px; margins absorb extra width                  |

### Leaderboard (TV)

Full-bleed at all sizes. Content max-width 1600px. Designed for 1920×1080 primary, tested at 4K (3840×2160) and 720p. Font sizes are deliberately large — `{typography.display-lg}` for ranks, `{typography.headline-md}` for scores — because the room is the viewport.

## Iteration Guide

1. Reference component tokens by key (`{component.keypad-confirm}`, `{component.timer-chip-warning}`) — never inline hex.
2. Variants of a component (`-pressed`, `-selected`, `-warning`) are separate entries in `components:` — add them there first.
3. The keypad shape (`{rounded.full}`, 72px) is the system's non-negotiable identity. Any scoring-entry element must inherit this grammar.
4. When adding a new state to an existing component: default → pressed/active only. No hover states in the judge app — it is a touch interface.
5. New colors belong in `colors:` first; component tokens reference them via `{colors.*}`. Never add a raw hex to a component token.
6. Level badges are a closed set (RX, Scaled, Elite, Adaptive). Do not add new variants without updating the YAML and the leaderboard row component.
7. The dark surface stepping order is fixed: `dark-background` < `dark-surface` < `dark-border`. Maintain this hierarchy — reversing it breaks perceived depth.
