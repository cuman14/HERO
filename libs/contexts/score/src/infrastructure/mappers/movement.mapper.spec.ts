import { MovementMapper } from './movement.mapper';

const WOD_ID = 'wod-1';

describe('MovementMapper', () => {
  describe('toDomain', () => {
    it('maps WodMovementConfig to Movement domain entity', () => {
      const config = {
        id: 'mov-1',
        name: 'Thrusters',
        description: '21-15-9',
        order: 0,
        target_reps: 21,
      };

      const movement = MovementMapper.toDomain(config, WOD_ID);

      expect(movement.id).toBe('mov-1');
      expect(movement.name).toBe('Thrusters');
      expect(movement.description).toBe('21-15-9');
      expect(movement.order).toBe(0);
      expect(movement.targetReps).toBe(21);
      expect(movement.wodId).toBe(WOD_ID);
    });
  });

  describe('fromBaseConfig', () => {
    it('extracts and maps all movements from base_config', () => {
      const baseConfig = {
        movements: [
          { id: 'mov-1', name: 'Thrusters', description: '', order: 0, target_reps: 21 },
          { id: 'mov-2', name: 'Pull-ups', description: '', order: 1, target_reps: 21 },
        ],
      };

      const movements = MovementMapper.fromBaseConfig(baseConfig, WOD_ID);

      expect(movements).toHaveLength(2);
      expect(movements[0].name).toBe('Thrusters');
      expect(movements[1].name).toBe('Pull-ups');
    });

    it('returns empty array when movements key is missing', () => {
      const movements = MovementMapper.fromBaseConfig({}, WOD_ID);
      expect(movements).toHaveLength(0);
    });

    it('sorts movements by order ascending', () => {
      const baseConfig = {
        movements: [
          { id: 'mov-2', name: 'Pull-ups', description: '', order: 1, target_reps: 21 },
          { id: 'mov-1', name: 'Thrusters', description: '', order: 0, target_reps: 21 },
        ],
      };

      const movements = MovementMapper.fromBaseConfig(baseConfig, WOD_ID);

      expect(movements[0].order).toBe(0);
      expect(movements[1].order).toBe(1);
    });
  });
});
