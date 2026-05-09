---
name: H.E.R.O
description: Real-time scoring platform for CrossFit & Hyrox competitions
colors:
  # Core palette
  primary: "#8b5cf6"
  on-primary: "#ffffff"
  primary-container: "#ede9fe"
  on-primary-container: "#5b21b6"
  inverse-primary: "#c4b5fd"

  secondary: "#334155"
  on-secondary: "#ffffff"
  secondary-container: "#e2e8f0"
  on-secondary-container: "#0f172a"

  tertiary: "#f59e0b"
  on-tertiary: "#ffffff"
  tertiary-container: "#fef3c7"
  on-tertiary-container: "#92400e"

  error: "#dc2626"
  on-error: "#ffffff"
  error-container: "#fee2e2"
  on-error-container: "#991b1b"

  # Surfaces — Light mode (Judge app primary context)
  background: "#f8fafc"
  on-background: "#0f172a"
  surface: "#f8fafc"
  surface-dim: "#e2e8f0"
  surface-bright: "#ffffff"
  surface-container-lowest: "#ffffff"
  surface-container-low: "#f1f5f9"
  surface-container: "#f8fafc"
  surface-container-high: "#ffffff"
  surface-container-highest: "#ffffff"
  surface-variant: "#f1f5f9"
  on-surface: "#0f172a"
  on-surface-variant: "#64748b"
  inverse-surface: "#1e293b"
  inverse-on-surface: "#f8fafc"
  outline: "#cbd5e1"
  outline-variant: "#e2e8f0"
  surface-tint: "#8b5cf6"

  # Dark mode surfaces (Admin & Leaderboard)
  dark-background: "#0a0e1a"
  dark-surface: "#1a2035"
  dark-border: "#1e2840"
  dark-on-surface: "#dae2fd"

  # App-specific primaries
  admin-primary: "#4f8ef7"
  judge-primary: "#a78bfa"
  board-primary: "#34d399"

  # Semantic — Competition levels
  level-rx: "#fbbf24"
  level-scaled: "#38bdf8"
  level-elite: "#f87171"
  level-adaptive: "#86efac"

  # Functional
  success: "#22c55e"
  on-success: "#ffffff"
  warning: "#f59e0b"
  on-warning: "#ffffff"

typography:
  display-lg:
    fontFamily: Inter
    fontSize: 48px
    fontWeight: "700"
    lineHeight: 56px
    letterSpacing: -0.03em
  headline-lg:
    fontFamily: Inter
    fontSize: 32px
    fontWeight: "700"
    lineHeight: 40px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Inter
    fontSize: 24px
    fontWeight: "600"
    lineHeight: 32px
    letterSpacing: -0.01em
  title-lg:
    fontFamily: Inter
    fontSize: 20px
    fontWeight: "600"
    lineHeight: 28px
  title-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "600"
    lineHeight: 24px
  body-lg:
    fontFamily: Inter
    fontSize: 18px
    fontWeight: "400"
    lineHeight: 28px
  body-md:
    fontFamily: Inter
    fontSize: 16px
    fontWeight: "400"
    lineHeight: 24px
  body-sm:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "400"
    lineHeight: 20px
  label-lg:
    fontFamily: Inter
    fontSize: 14px
    fontWeight: "600"
    lineHeight: 20px
    letterSpacing: 0.01em
  label-md:
    fontFamily: Space Grotesk
    fontSize: 12px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Space Grotesk
    fontSize: 11px
    fontWeight: "500"
    lineHeight: 16px
    letterSpacing: 0.04em
  mono:
    fontFamily: JetBrains Mono
    fontSize: 14px
    fontWeight: "500"
    lineHeight: 20px

rounded:
  none: 0
  sm: 0.25rem
  DEFAULT: 0.5rem
  md: 0.75rem
  lg: 1rem
  xl: 1.5rem
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
  none: "none"
  sm: "0 1px 2px 0 rgba(0, 0, 0, 0.05)"
  md: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -2px rgba(0, 0, 0, 0.1)"
  lg: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -4px rgba(0, 0, 0, 0.1)"
  card: "0 1px 3px 0 rgba(0, 0, 0, 0.08)"

motion:
  score-pop: "score-pop 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)"
  rank-up: "rank-up 0.5s ease-out"
  fast: "150ms ease-in-out"
  normal: "250ms ease-in-out"
  slow: "350ms ease-out"

components:
  # Keypad — the core scoring interaction
  keypad-button:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    typography: "{typography.headline-md}"
    rounded: "{rounded.full}"
    size: 72px
  keypad-button-pressed:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
  keypad-confirm:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 72px

  # Movement cards
  movement-card-active:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"
  movement-card-completed:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.md}"
    padding: "{spacing.sm}"

  # Primary action button
  button-primary:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.xl}"
    height: 48px
    padding: 0 24px
  button-primary-hover:
    backgroundColor: "#7c3aed"

  # Ghost / secondary button
  button-ghost:
    backgroundColor: transparent
    textColor: "{colors.primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.xl}"
    height: 48px
    padding: 0 24px

  # Score display chip
  score-chip:
    backgroundColor: "{colors.primary-container}"
    textColor: "{colors.on-primary-container}"
    typography: "{typography.title-md}"
    rounded: "{rounded.full}"
    padding: 4px 12px

  # Timer floating chip
  timer-chip:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    typography: "{typography.label-lg}"
    rounded: "{rounded.full}"
    padding: 6px 16px

  # Level badge
  level-badge-rx:
    backgroundColor: "{colors.level-rx}"
    textColor: "#451a03"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 2px 10px
  level-badge-scaled:
    backgroundColor: "{colors.level-scaled}"
    textColor: "#0c4a6e"
    typography: "{typography.label-sm}"
    rounded: "{rounded.full}"
    padding: 2px 10px

  # Athlete card
  athlete-card:
    backgroundColor: "{colors.surface-container-high}"
    textColor: "{colors.on-surface}"
    rounded: "{rounded.lg}"
    padding: "{spacing.md}"

  # Input field
  input-field:
    backgroundColor: "{colors.surface-container-low}"
    textColor: "{colors.on-surface}"
    typography: "{typography.body-md}"
    rounded: "{rounded.md}"
    padding: 12px 16px
    height: 48px

  # Step progress indicator
  step-indicator-active:
    backgroundColor: "{colors.primary}"
    textColor: "{colors.on-primary}"
    rounded: "{rounded.full}"
    size: 32px
  step-indicator-completed:
    backgroundColor: "{colors.success}"
    textColor: "{colors.on-success}"
    rounded: "{rounded.full}"
    size: 32px
  step-indicator-pending:
    backgroundColor: "{colors.outline}"
    textColor: "{colors.on-surface-variant}"
    rounded: "{rounded.full}"
    size: 32px

  # Dark mode card (admin / leaderboard)
  dark-card:
    backgroundColor: "{colors.dark-surface}"
    textColor: "{colors.dark-on-surface}"
    rounded: "{rounded.md}"
    padding: "{spacing.md}"
---

## Overview

H.E.R.O is a real-time scoring platform for CrossFit and Hyrox competitions. The design system prioritizes **legibility under physical stress**, **speed of interaction**, and **confidence in data entry**. Judges use the mobile app in loud, high-energy environments — the UI must be instantly readable, physically forgiving to tap, and reassuring when confirming scores.

The visual language is **Clean & High-Contrast** with a light foundation for mobile scoring and a dark foundation for desktop admin and TV leaderboards. The primary accent is Vibrant Violet (`#8b5cf6`), chosen for its distinctiveness against both light and dark surfaces.

## Colors

The color strategy serves three distinct contexts:

- **Judge (Mobile, Light):** `#f8fafc` background with `#8b5cf6` violet as the primary action color. High contrast between surface and text ensures scores are legible even in direct sunlight or dim gym lighting. Error states use saturated red (`#dc2626`) for immediate penalty recognition.
- **Admin (Desktop, Dark):** `#0a0e1a` background with `#4f8ef7` blue primary. The dark canvas reduces eye strain during long competition-management sessions. Tables and data grids use subtle `#1a2035` surface cards.
- **Leaderboard (TV/Projector, Dark):** `#0a0e1a` background with `#34d399` emerald accents. High-saturation colors for rank badges ensure readability from across a gym floor. Level badges (RX amber, Scaled sky, Elite red, Adaptive green) are never muted — they must pop at distance.

The tertiary amber (`#f59e0b`) is reserved exclusively for warnings and time-critical states (timer running low, penalties pending).

## Typography

**Inter** is the sole UI typeface across all three apps. Its tall x-height, open apertures, and tabular numerals make it ideal for number-heavy scoring interfaces. **Space Grotesk** is used sparingly for labels and metadata — its slightly condensed proportions help in tight spaces like badge labels and step indicators.

- **Score numerals:** Use `headline-lg` (32px/700) or larger. Judges must read rep counts without leaning in.
- **Body text:** `body-md` (16px/400) for descriptions, athlete info, and instructions.
- **Labels:** `label-md` (12px Space Grotesk) for metadata, timestamps, and secondary information.
- **Monospace:** `JetBrains Mono` for heat codes, BIB numbers, and any alphanumeric identifiers that benefit from character-width consistency.

Font weight is biased toward medium (500) and semibold (600). Regular (400) is only used for body paragraphs. Nothing below 11px appears in the UI.

## Layout & Spacing

An **8px base grid** governs all spacing. The mobile judge interface maximizes vertical real estate — compact headers, no wasted chrome — because every pixel below the fold costs a scroll during live scoring.

- **Judge mobile:** Single-column, 390px reference width. Card stacks fill the viewport width with 16px horizontal padding.
- **Admin desktop:** Sidebar (256px) + main content. Data tables use 24px cell padding for comfortable scanning.
- **Leaderboard TV:** Full-bleed 1280px+ layout. Generous 48–64px section margins so content "breathes" on large screens.

Containers use 16px gaps between sibling cards. Section breaks use 32–64px vertical spacing depending on context density.

## Elevation & Depth

Elevation is used sparingly. The judge app is intentionally flat — shadows and layering compete with the urgency of score entry. Depth cues come from **color contrast** (active card vs. completed stack) rather than shadows.

- **Level 0 (Background):** Page surface, no shadow.
- **Level 1 (Cards):** `0 1px 3px rgba(0,0,0,0.08)` — barely perceptible, just enough to separate from background.
- **Level 2 (Floating elements):** Timer chip, penalty overlay. `0 4px 6px rgba(0,0,0,0.1)` — clear float without heaviness.
- **Level 3 (Modals):** Full-screen overlays use a `rgba(0,0,0,0.5)` scrim, not shadow-based depth.

In dark mode (admin/leaderboard), elevation is achieved through surface-color stepping (`dark-surface` → `dark-border`) rather than shadows, which disappear against dark backgrounds.

## Shapes

The shape language is **rounded but not bubbly**. Default card radius is `0.75rem` (12px) — substantial enough to feel modern, restrained enough to avoid toy-like softness.

- **Cards & containers:** `rounded-md` (0.75rem).
- **Buttons:** `rounded-xl` (1.5rem) for primary CTAs, `rounded-md` for secondary.
- **Keypad buttons:** `rounded-full` (circles). The iPhone-dialer-inspired numeric keypad uses perfect circles to leverage muscle memory from phone use.
- **Badges & chips:** `rounded-full` for level badges, timer chips, and score pills.
- **Input fields:** `rounded-md` (0.75rem) — matching card radius for visual consistency.

## Components

### Keypad (Scoring Engine)

The centerpiece of the judge interface. A 3×4 numeric grid inspired by the iPhone dialer, using circular `72px` buttons with generous touch targets. The confirm button (checkmark) uses the primary violet fill. Buttons have a subtle scale animation (`score-pop`) on press for tactile feedback. No borders on keypad buttons — they float on the surface using background color alone.

### Movement Stack

An accordion-style card system where the active movement is fully expanded (showing round progress, rep count, and percentage) while completed and upcoming movements are collapsed into thin summary strips. The visual "push behind" effect creates a sense of physical progress through the workout.

### Timer Chip

A floating violet pill positioned above the active movement card. Uses `label-lg` typography with the primary color fill. The chip is always visible during scoring — it never scrolls off screen.

### Athlete Card

A horizontal card showing avatar (48px circle), athlete name (`title-md`), BIB number (`mono`), and category badge. Used in the selection step and in the scoring header. The card has a subtle left-border accent in the app's primary color when selected.

### Step Progress Indicator

A 4-step horizontal indicator (Heat Access → Athlete Select → Live Scoring → Summary). Active step uses primary fill, completed steps use success green with a checkmark icon, pending steps use outline gray. Connected by a thin line that fills as progress advances.

### Dark Cards (Admin & Leaderboard)

Admin and leaderboard use dark surface cards (`#1a2035`) on the deep background (`#0a0e1a`). Border separation uses `#1e2840` — a blue-tinted dark gray that avoids the flat lifelessness of pure gray borders.

## Do's and Don'ts

**Do:**
- Use the keypad circle buttons for all numeric entry — never text inputs for rep counts.
- Keep the timer chip visible at all times during live scoring.
- Use `score-pop` animation on successful rep entry for tactile confirmation.
- Use level-badge colors at full saturation — they must be readable from 10 meters away on a leaderboard.
- Use tabular numerals (Inter supports them) for any column of numbers — scores, reps, times.

**Don't:**
- Don't use shadows heavier than `elevation.md` in the judge mobile app — keep it flat and fast.
- Don't use custom CSS classes or inline styles — all styling through Tailwind v4 utilities.
- Don't mix light and dark mode within the same app. Judge is light, Admin and Leaderboard are dark.
- Don't use any font below 11px. Gym environments are not reading environments.
- Don't animate anything during active scoring entry that could delay or obscure the input confirmation.
