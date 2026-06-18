import { Movement } from '../../../domain/movement.model';
import { MovementStackItem } from '@hero/ui';
import { mapMovementToStackItem } from './movement-stack-item.mapper';

function makeMovement(id: string, order: number, targetReps = 50): Movement {
  return Movement.create(id, {
    name: `Movement ${id}`,
    description: `Round ${order + 1}`,
    order,
    wodId: 'wod-1',
    targetReps,
  });
}

describe('mapMovementToStackItem', () => {
  it('should map active movement with current reps value', () => {
    const movement = makeMovement('m1', 0, 50);
    const result = mapMovementToStackItem(movement, 0, 0, 30);

    expect(result.currentReps).toBe(30);
    expect(result.status).toBe('active');
  });

  it('should map completed movement with its confirmed reps value', () => {
    const movement = makeMovement('m1', 0, 50);
    const result = mapMovementToStackItem(movement, 0, 1, 30);

    expect(result.currentReps).toBe(30);
    expect(result.status).toBe('completed');
    expect(result.targetReps).toBe(50);
  });

  it('should map upcoming movement with 0 reps', () => {
    const movement = makeMovement('m3', 0, 50);
    const result = mapMovementToStackItem(movement, 2, 1, 0);

    expect(result.currentReps).toBe(0);
    expect(result.status).toBe('upcoming');
  });

  it('should set roundLabel from movement description', () => {
    const movement = makeMovement('m1', 0);
    const result = mapMovementToStackItem(movement, 0, 0, 0);

    expect(result.roundLabel).toBe('Round 1');
  });
});
