## Context

The movement repetitions registration screen is a critical component of the live scoring workflow in the judge app. During a heat, judges need to quickly and accurately record the number of repetitions completed for each movement. The current system lacks a dedicated interface optimized for this high-frequency, time-sensitive task.

The screen must integrate seamlessly with the existing live scoring heat management system and provide real-time synchronization with other judges and the leaderboard via Supabase.

## Goals / Non-Goals

**Goals:**
- Provide an intuitive, fast interface for judges to input and modify repetition counts
- Display current athlete information and active movement clearly
- Enable quick navigation between movements without losing state
- Support real-time synchronization of rep counts across all connected clients
- Provide visual feedback for rep count changes and submissions
- Optimize for mobile/tablet usage in a noisy competition environment

**Non-Goals:**
- Implementing complex rep validation rules (handled by domain logic)
- Building a leaderboard or results display on this screen
- Creating admin configuration UI for movement definitions
- Implementing offline-first caching (handled by existing infrastructure)

## Decisions

1. **Component Architecture**: Decompose into dumb UI components and a smart feature component
   - Dumb Components: `RepetitionCounter`, `MovementCard`, `AthleteHeader`, `SubmitButton`
   - Smart Component: `RegisterMovementRepetitionsPage` (feature page)
   - Domain Models: `Movement`, `RepetitionRecord`, `AthleteHeat`

2. **State Management**: Use Signal Store for local component state and Supabase real-time subscriptions
   - Store manages current heat, athlete, movement list, and rep counts
   - Real-time updates trigger store actions for synchronization
   - No direct repository access from components; all via facade service

3. **Counter Input Strategy**: Dual-mode counter supporting both increment/decrement buttons and direct numeric input
   - Large, easy-to-tap buttons for quick increments
   - Direct input field for fast manual entry or corrections
   - Visual indication of unsaved changes

4. **Navigation Pattern**: Horizontal swipe or button-based movement navigation
   - Maintains rep count state when switching movements
   - Prevents accidental navigation with confirmation on unsaved changes
   - Clear visual indicator of current movement position

5. **Styling**: Tailwind v4 CSS-first approach with high contrast for outdoor visibility
   - Large touch targets (minimum 44px) for mobile reliability
   - Bold typography for readability in bright conditions
   - Color-coded feedback (green for confirmed, amber for pending, red for errors)

## Risks / Trade-offs

**Risks:**
- Network latency could cause sync conflicts if multiple judges edit simultaneously
  - *Mitigation*: Implement optimistic updates with conflict resolution via Supabase policies
- Accidental rep count modifications without confirmation
  - *Mitigation*: Visual feedback and optional confirmation dialog for large changes
- Screen rotation on mobile devices could disrupt input
  - *Mitigation*: Lock orientation to portrait or handle rotation gracefully with state preservation

**Trade-offs:**
- Chose direct input field over pure button-based counter for speed, accepting slightly more complex UI
- Real-time sync adds network overhead but provides better judge coordination
- Mobile-first design may require responsive adjustments for tablet/desktop views
