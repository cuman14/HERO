import { SupabaseMovementRepository } from './movement.repository.supabase';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeSupabase(returnData: unknown, returnError: unknown = null): any {
  const single = vi
    .fn()
    .mockResolvedValue({ data: returnData, error: returnError });
  const eq = vi.fn().mockReturnValue({ single });
  const select = vi.fn().mockReturnValue({ eq });
  const from = vi.fn().mockReturnValue({ select });
  return { from, select, eq, single };
}

describe('SupabaseMovementRepository', () => {
  describe('findByHeat', () => {
    it('returns mapped movements from wod base_config', async () => {
      const supabase = makeSupabase({
        id: 'heat-1',
        wod: {
          id: 'wod-1',
          name: 'Fran',
          type: 'for_time',
          base_config: {
            movements: [
              {
                id: 'mov-1',
                name: 'Thrusters',
                description: 'Round 1',
                order: 0,
                target_reps: 21,
              },
              {
                id: 'mov-2',
                name: 'Pull-ups',
                description: 'Round 2',
                order: 1,
                target_reps: 21,
              },
            ],
          },
        },
      });

      const repo = new SupabaseMovementRepository(supabase);
      const movements = await repo.findByHeat('heat-1');

      expect(movements).toHaveLength(2);
      expect(movements[0].name).toBe('Thrusters');
      expect(movements[0].targetReps).toBe(21);
      expect(movements[0].order).toBe(0);
      expect(movements[1].name).toBe('Pull-ups');
    });

    it('returns empty array when wod has no movements in base_config', async () => {
      const supabase = makeSupabase({
        id: 'heat-1',
        wod: { id: 'wod-1', name: 'Fran', type: 'for_time', base_config: {} },
      });

      const repo = new SupabaseMovementRepository(supabase);
      const movements = await repo.findByHeat('heat-1');

      expect(movements).toHaveLength(0);
    });

    it('returns empty array on supabase error', async () => {
      const supabase = makeSupabase(null, { message: 'Not found' });

      const repo = new SupabaseMovementRepository(supabase);
      const movements = await repo.findByHeat('heat-1');

      expect(movements).toHaveLength(0);
    });

    it('returns movements sorted by order', async () => {
      const supabase = makeSupabase({
        id: 'heat-1',
        wod: {
          id: 'wod-1',
          name: 'Test',
          type: 'for_time',
          base_config: {
            movements: [
              {
                id: 'mov-3',
                name: 'Burpees',
                description: 'Round 3',
                order: 2,
                target_reps: 9,
              },
              {
                id: 'mov-1',
                name: 'Thrusters',
                description: 'Round 1',
                order: 0,
                target_reps: 21,
              },
            ],
          },
        },
      });

      const repo = new SupabaseMovementRepository(supabase);
      const movements = await repo.findByHeat('heat-1');

      expect(movements[0].name).toBe('Thrusters');
      expect(movements[1].name).toBe('Burpees');
    });
  });

  describe('findById', () => {
    it('returns the movement with the matching id', async () => {
      const supabase = makeSupabase({
        id: 'heat-1',
        wod: {
          id: 'wod-1',
          name: 'Fran',
          type: 'for_time',
          base_config: {
            movements: [
              {
                id: 'mov-1',
                name: 'Thrusters',
                description: 'Round 1',
                order: 0,
                target_reps: 21,
              },
              {
                id: 'mov-2',
                name: 'Pull-ups',
                description: 'Round 2',
                order: 1,
                target_reps: 21,
              },
            ],
          },
        },
      });

      const repo = new SupabaseMovementRepository(supabase);
      const movement = await repo.findById('mov-2', 'heat-1');

      expect(movement).not.toBeNull();
      expect(movement?.name).toBe('Pull-ups');
    });

    it('returns null when movement id is not found', async () => {
      const supabase = makeSupabase({
        id: 'heat-1',
        wod: {
          id: 'wod-1',
          name: 'Fran',
          type: 'for_time',
          base_config: {
            movements: [
              {
                id: 'mov-1',
                name: 'Thrusters',
                description: '',
                order: 0,
                target_reps: 21,
              },
            ],
          },
        },
      });

      const repo = new SupabaseMovementRepository(supabase);
      const movement = await repo.findById('non-existent', 'heat-1');

      expect(movement).toBeNull();
    });
  });
});
