import { SupabaseRepetitionRecordRepository } from './repetition-record.repository.supabase';

const HEAT_ID = 'heat-1';
const ATHLETE_ID = 'team-1';
const SCORE_ID = 'score-1';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function makeSupabase(overrides: Record<string, any> = {}): any {
  const defaultChain = {
    maybeSingle: vi.fn().mockResolvedValue({ data: null, error: null }),
    single: vi.fn().mockResolvedValue({ data: null, error: null }),
    update: vi.fn().mockResolvedValue({ error: null }),
    eq: vi.fn(),
    or: vi.fn(),
    select: vi.fn(),
    insert: vi.fn(),
    channel: vi.fn().mockReturnValue({
      on: vi.fn().mockReturnThis(),
      subscribe: vi.fn().mockReturnThis(),
    }),
    removeChannel: vi.fn(),
    ...overrides,
  };

  defaultChain.eq.mockReturnValue(defaultChain);
  defaultChain.or.mockReturnValue(defaultChain);
  defaultChain.select.mockReturnValue(defaultChain);
  defaultChain.insert.mockReturnValue(defaultChain);
  defaultChain.update.mockReturnValue(defaultChain);

  const from = vi.fn().mockReturnValue(defaultChain);
  return {
    from,
    channel: defaultChain.channel,
    removeChannel: defaultChain.removeChannel,
    _chain: defaultChain,
  };
}

describe('SupabaseRepetitionRecordRepository', () => {
  describe('findByHeatAndAthlete', () => {
    it('returns empty array when no score exists', async () => {
      const supabase = makeSupabase();
      const repo = new SupabaseRepetitionRecordRepository(supabase);

      const records = await repo.findByHeatAndAthlete(HEAT_ID, ATHLETE_ID);

      expect(records).toHaveLength(0);
    });

    it('returns mapped records from score.value.movement_reps', async () => {
      const supabase = makeSupabase({
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            id: SCORE_ID,
            athlete_id: null,
            team_id: ATHLETE_ID,
            heat_id: HEAT_ID,
            judge_id: 'judge-1',
            value: {
              movement_reps: {
                'mov-1': { reps: 21, confirmed: true },
                'mov-2': { reps: 15, confirmed: false },
              },
            },
          },
          error: null,
        }),
      });

      const repo = new SupabaseRepetitionRecordRepository(supabase);
      const records = await repo.findByHeatAndAthlete(HEAT_ID, ATHLETE_ID);

      expect(records).toHaveLength(2);
      const mov1 = records.find((r) => r.movementId === 'mov-1');
      expect(mov1?.count.value).toBe(21);
      expect(mov1?.confirmed).toBe(true);
      const mov2 = records.find((r) => r.movementId === 'mov-2');
      expect(mov2?.count.value).toBe(15);
      expect(mov2?.confirmed).toBe(false);
    });

    it('returns empty array when score value has no movement_reps', async () => {
      const supabase = makeSupabase({
        maybeSingle: vi.fn().mockResolvedValue({
          data: {
            id: SCORE_ID,
            athlete_id: null,
            team_id: ATHLETE_ID,
            heat_id: HEAT_ID,
            judge_id: null,
            value: {},
          },
          error: null,
        }),
      });

      const repo = new SupabaseRepetitionRecordRepository(supabase);
      const records = await repo.findByHeatAndAthlete(HEAT_ID, ATHLETE_ID);

      expect(records).toHaveLength(0);
    });
  });

  describe('save', () => {
    it('calls supabase update with merged movement_reps value', async () => {
      const existingValue = {
        movement_reps: { 'mov-1': { reps: 21, confirmed: true } },
      };
      const singleMock = vi
        .fn()
        .mockResolvedValue({ data: { value: existingValue }, error: null });
      const updateMock = vi.fn().mockResolvedValue({ error: null });

      const supabase = makeSupabase({ single: singleMock, update: updateMock });

      const repo = new SupabaseRepetitionRecordRepository(supabase);

      const { RepetitionCount, RepetitionRecord } = await import(
        '../domain/repetition-record.model'
      );
      const record = RepetitionRecord.create(`${SCORE_ID}-mov-2`, {
        movementId: 'mov-2',
        athleteId: ATHLETE_ID,
        heatId: HEAT_ID,
        count: RepetitionCount.create(15),
        judgeId: 'judge-1',
        confirmed: true,
        createdAt: new Date(),
      });

      await repo.save(record, SCORE_ID);

      expect(updateMock).toHaveBeenCalled();
    });

    it('throws when supabase update returns an error', async () => {
      const errorEq = vi
        .fn()
        .mockResolvedValue({ error: { message: 'DB error' } });
      const updateReturn = { eq: errorEq };

      const supabase = makeSupabase({
        single: vi.fn().mockResolvedValue({ data: { value: {} }, error: null }),
      });
      supabase._chain.update.mockReturnValue(updateReturn);

      const repo = new SupabaseRepetitionRecordRepository(supabase);

      const { RepetitionCount, RepetitionRecord } = await import(
        '../domain/repetition-record.model'
      );
      const record = RepetitionRecord.create(`${SCORE_ID}-mov-1`, {
        movementId: 'mov-1',
        athleteId: ATHLETE_ID,
        heatId: HEAT_ID,
        count: RepetitionCount.create(10),
        judgeId: '',
        confirmed: false,
        createdAt: new Date(),
      });

      await expect(repo.save(record, SCORE_ID)).rejects.toThrow('DB error');
    });
  });

  describe('subscribe', () => {
    it('subscribes to postgres_changes on the scores table', () => {
      const onMock = vi.fn().mockReturnThis();
      const subscribeMock = vi.fn().mockReturnThis();
      const channelObj = { on: onMock, subscribe: subscribeMock };
      const supabase = makeSupabase({
        channel: vi.fn().mockReturnValue(channelObj),
      });

      const repo = new SupabaseRepetitionRecordRepository(supabase);
      const unsubscribe = repo.subscribe(HEAT_ID, ATHLETE_ID, vi.fn());

      expect(supabase.channel).toHaveBeenCalledWith(
        `score-${HEAT_ID}-${ATHLETE_ID}`,
      );
      expect(onMock).toHaveBeenCalledWith(
        'postgres_changes',
        expect.objectContaining({
          table: 'scores',
          filter: `heat_id=eq.${HEAT_ID}`,
        }),
        expect.any(Function),
      );
      expect(typeof unsubscribe).toBe('function');
    });
  });
});
