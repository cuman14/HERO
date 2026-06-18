/**
 * PATTERN: Mapper
 * REASON: Isolates the transformation logic from Movement (domain) to MovementStackItem (UI model).
 *         Keeps the page component free of mapping concerns and enables unit testing
 *         of this logic without an Angular component.
 * ALTERNATIVE CONSIDERED: Inline mapping inside computed() — rejected because it
 *   mixes presentation-layer transformation with component state management.
 */
import { MovementStackItem } from '@hero/ui';
import { Movement } from '../../../domain/movement.model';

export function mapMovementToStackItem(
  movement: Movement,
  movementIndex: number,
  activeMovementIndex: number,
  currentRepsValue: number,
): MovementStackItem {
  let status: 'completed' | 'active' | 'upcoming';
  if (movementIndex < activeMovementIndex) status = 'completed';
  else if (movementIndex === activeMovementIndex) status = 'active';
  else status = 'upcoming';

  return {
    id: movement.id,
    name: movement.name,
    description: movement.description,
    targetReps: movement.targetReps,
    currentReps: currentRepsValue,
    status,
    roundLabel: movement.description,
    roundIndex: movementIndex,
  };
}
