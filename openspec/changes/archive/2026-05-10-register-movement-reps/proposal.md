## Why

During live scoring at CrossFit competitions, judges need to efficiently record the number of repetitions completed for each movement within a heat. The current system lacks a dedicated, intuitive interface for this critical data entry task. Athletes need real-time feedback on their rep counts, and judges need a fast, accurate way to input and modify rep counts without navigation friction.

## What Changes

A new "Register Movement Repetitions" screen will be implemented that allows judges to:
- View the current athlete's information and the active movement
- Input and modify repetition counts for each movement in a heat
- See real-time updates reflected in the scoring system
- Navigate between movements efficiently
- Confirm and submit rep counts with clear visual feedback

This screen integrates with the live scoring workflow and provides a clean, focused interface for the most frequent action judges perform during competition.

## Capabilities

### New Capabilities
- `movement-rep-input`: Interface for judges to enter and modify repetition counts for individual movements during live scoring
- `rep-counter-ui`: Visual counter component with increment/decrement controls and direct input capability
- `movement-navigation`: Quick navigation between movements in a heat without losing rep count state
- `rep-submission-confirmation`: Confirmation flow for submitting rep counts with validation

### Modified Capabilities
- `live-scoring-workflow`: Integration point for the new rep registration screen into the existing live scoring flow

## Impact

- **Affected Code**: Judge app (`apps/judge/src/`), UI components (`libs/ui/src/`), core scoring logic (`libs/core/src/`)
- **New Dependencies**: None (uses existing Angular, Supabase, and Signal Store infrastructure)
- **APIs**: Supabase real-time updates for rep count synchronization
- **Systems**: Live scoring heat management, athlete tracking, movement progression
