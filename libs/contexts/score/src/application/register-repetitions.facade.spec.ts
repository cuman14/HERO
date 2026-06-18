import { setupTestBed } from '@analogjs/vitest-angular/setup-testbed';
import { TestBed } from '@angular/core/testing';
import { SUPABASE_CLIENT } from '@hero/core';
import { AthleteHeat } from '../domain/athlete-heat.model';
import { Movement } from '../domain/movement.model';
import {
  RepetitionCount,
  RepetitionRecord,
} from '../domain/repetition-record.model';
import { MOVEMENT_REPOSITORY } from '../infrastructure/movement.repository';
import { REPETITION_RECORD_REPOSITORY } from '../infrastructure/repetition-record.repository';
import { RegisterRepetitionsFacade } from './register-repetitions.facade';
import { clearScoreSession } from '../infrastructure/score-session-storage';

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

setupTestBed();

describe('RegisterRepetitionsFacade', () => {
  let facade: RegisterRepetitionsFacade;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      providers: [
        RegisterRepetitionsFacade,
        {
          provide: SUPABASE_CLIENT,
          useValue: {
            from: vi.fn().mockReturnValue({
              select: vi.fn().mockReturnThis(),
              eq: vi.fn().mockReturnThis(),
              single: vi.fn().mockResolvedValue({ data: null, error: null }),
            }),
          },
        },
        {
          provide: MOVEMENT_REPOSITORY,
          useValue: { findByHeat: vi.fn(), findById: vi.fn() },
        },
        {
          provide: REPETITION_RECORD_REPOSITORY,
          useValue: {
            findByHeatAndAthlete: vi.fn(),
            save: vi.fn().mockResolvedValue(undefined),
            subscribe: vi.fn(),
          },
        },
      ],
    }).compileComponents();
    facade = TestBed.inject(RegisterRepetitionsFacade);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  describe('loadHeat', () => {
    it('should set loading to true initially', () => {
      facade.loadHeat('ha-test');
      expect(facade.isLoading()).toBe(true);
    });
  });

  describe('repetition count operations', () => {
    beforeEach(() => {
      facade.store.loadHeatData(
        AthleteHeat.create({
          athleteId: 'athlete-1',
          athleteName: 'Test Athlete',
          bibNumber: '001',
          division: 'RX',
          heatId: 'heat-1',
          heatName: 'Heat 1',
          wodName: 'Test WOD',
          wodType: 'AMRAP',
          lane: 1,
        }),
        [
          Movement.create('mov-1', {
            name: 'Thrusters',
            description: 'Round 1',
            order: 0,
            wodId: 'wod-1',
            targetReps: 21,
          }),
        ],
        [
          RepetitionRecord.create('rec-1', {
            movementId: 'mov-1',
            athleteId: 'athlete-1',
            heatId: 'heat-1',
            count: RepetitionCount.zero(),
            judgeId: 'judge-1',
            confirmed: false,
            createdAt: new Date(),
          }),
        ],
        'score-1',
      );
    });

    it('should increment repetition count', () => {
      expect(facade.currentRepetitionCount().value).toBe(0);
      facade.incrementRepetitionCount();
      expect(facade.currentRepetitionCount().value).toBe(1);
    });

    it('should decrement repetition count', () => {
      facade.incrementRepetitionCount();
      facade.incrementRepetitionCount();
      facade.decrementRepetitionCount();
      expect(facade.currentRepetitionCount().value).toBe(1);
    });

    it('should not decrement below zero', () => {
      facade.decrementRepetitionCount();
      expect(facade.currentRepetitionCount().value).toBe(0);
    });

    it('should update repetition count directly', () => {
      facade.updateRepetitionCount(15);
      expect(facade.currentRepetitionCount().value).toBe(15);
    });

    it('should set error for invalid count', () => {
      facade.updateRepetitionCount(-5);
      expect(facade.error()).toBe('Invalid repetition count');
    });
  });

  describe('submission', () => {
    beforeEach(() => {
      // Clean sessionStorage before each test
      sessionStorage.clear();
      facade.store.loadHeatData(
        AthleteHeat.create({
          athleteId: 'athlete-1',
          athleteName: 'Test Athlete',
          bibNumber: '001',
          division: 'RX',
          heatId: 'heat-1',
          heatName: 'Heat 1',
          wodName: 'Test WOD',
          wodType: 'AMRAP',
          lane: 1,
        }),
        [
          Movement.create('mov-1', {
            name: 'Thrusters',
            description: 'Round 1',
            order: 0,
            wodId: 'wod-1',
            targetReps: 21,
          }),
          Movement.create('mov-2', {
            name: 'Pull-ups',
            description: 'Round 2',
            order: 1,
            wodId: 'wod-1',
            targetReps: 21,
          }),
        ],
        [
          RepetitionRecord.create('rec-1', {
            movementId: 'mov-1',
            athleteId: 'athlete-1',
            heatId: 'heat-1',
            count: RepetitionCount.zero(),
            judgeId: 'judge-1',
            confirmed: false,
            createdAt: new Date(),
          }),
          RepetitionRecord.create('rec-2', {
            movementId: 'mov-2',
            athleteId: 'athlete-1',
            heatId: 'heat-1',
            count: RepetitionCount.zero(),
            judgeId: 'judge-1',
            confirmed: false,
            createdAt: new Date(),
          }),
        ],
        'score-1',
        undefined,
        undefined,
        'ha-1',
      );
    });

    it('should not be submitting after completion', async () => {
      facade.incrementRepetitionCount();
      facade.submitRepetitionCount();
      await delay(10);
      expect(facade.isSubmitting()).toBe(false);
    });

    it('should confirm record and advance movement after submission', async () => {
      const initialIndex = facade.currentMovementIndex();
      facade.incrementRepetitionCount();
      facade.submitRepetitionCount();
      await delay(400);
      expect(facade.isSubmitting()).toBe(false);
      expect(facade.currentMovementIndex()).toBe(initialIndex + 1);
    });

    it('should navigate to next movement after submission', async () => {
      expect(facade.currentMovementIndex()).toBe(0);
      facade.submitRepetitionCount();
      await delay(400);
      expect(facade.currentMovementIndex()).toBe(1);
    });

    it('should retain confirmed repetition count in movementSummaryItems after navigation', async () => {
      facade.incrementRepetitionCount();
      expect(facade.currentRepetitionCount().value).toBe(1);
      facade.submitRepetitionCount();
      await delay(400);
      expect(facade.currentMovementIndex()).toBe(1);
      const summaries = facade.movementSummaryItems();
      expect(summaries).toHaveLength(2);
      const mov1Summary = summaries.find((s) => s.movementId === 'mov-1');
      expect(mov1Summary).toBeDefined();
      expect(mov1Summary!.confirmedRepetitions).toBe(1);
    });

    it('should NOT save to Supabase repository on submit', async () => {
      const repRecordRepo = TestBed.inject(REPETITION_RECORD_REPOSITORY);
      facade.incrementRepetitionCount();
      facade.submitRepetitionCount();
      await delay(100);
      expect(repRecordRepo.save).not.toHaveBeenCalled();
    });

    it('should persist to sessionStorage on submit', async () => {
      facade.incrementRepetitionCount();
      facade.incrementRepetitionCount();
      facade.submitRepetitionCount();
      await delay(100);
      const stored = sessionStorage.getItem('hero_scoring_ha-1');
      expect(stored).not.toBeNull();
      if (stored) {
        const parsed = JSON.parse(stored);
        expect(parsed.records).toBeDefined();
        const mov1 = parsed.records.find((r: any) => r.movementId === 'mov-1');
        expect(mov1).toBeDefined();
        expect(mov1.count).toBe(2);
        expect(mov1.confirmed).toBe(true);
      }
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      facade.store.loadHeatData(
        AthleteHeat.create({
          athleteId: 'athlete-1',
          athleteName: 'Test Athlete',
          bibNumber: '001',
          division: 'RX',
          heatId: 'heat-1',
          heatName: 'Heat 1',
          wodName: 'Test WOD',
          wodType: 'AMRAP',
          lane: 1,
        }),
        [
          Movement.create('mov-1', {
            name: 'Thrusters',
            description: 'Round 1',
            order: 0,
            wodId: 'wod-1',
            targetReps: 21,
          }),
          Movement.create('mov-2', {
            name: 'Pull-ups',
            description: 'Round 2',
            order: 1,
            wodId: 'wod-1',
            targetReps: 21,
          }),
          Movement.create('mov-3', {
            name: 'Burpees',
            description: 'Round 3',
            order: 2,
            wodId: 'wod-1',
            targetReps: 9,
          }),
        ],
        [
          RepetitionRecord.create('rec-1', {
            movementId: 'mov-1',
            athleteId: 'athlete-1',
            heatId: 'heat-1',
            count: RepetitionCount.zero(),
            judgeId: 'judge-1',
            confirmed: false,
            createdAt: new Date(),
          }),
          RepetitionRecord.create('rec-2', {
            movementId: 'mov-2',
            athleteId: 'athlete-1',
            heatId: 'heat-1',
            count: RepetitionCount.zero(),
            judgeId: 'judge-1',
            confirmed: false,
            createdAt: new Date(),
          }),
          RepetitionRecord.create('rec-3', {
            movementId: 'mov-3',
            athleteId: 'athlete-1',
            heatId: 'heat-1',
            count: RepetitionCount.zero(),
            judgeId: 'judge-1',
            confirmed: false,
            createdAt: new Date(),
          }),
        ],
        'score-1',
      );
    });

    it('should navigate to next movement', () => {
      facade.navigateNext();
      expect(facade.currentMovementIndex()).toBe(1);
    });

    it('should navigate to previous movement', () => {
      facade.navigateNext();
      facade.navigatePrevious();
      expect(facade.currentMovementIndex()).toBe(0);
    });

    it('should navigate to specific movement', () => {
      facade.navigateToMovement(2);
      expect(facade.currentMovementIndex()).toBe(2);
    });

    it('should report movement progress', () => {
      expect(facade.movementProgress()).toMatch(/1 \/ \d+/);
    });
  });
});

describe('RegisterRepetitionsFacade — real data integration', () => {
  const HEAT_ID = 'heat-1';
  const ATHLETE_ID = 'athlete-1';
  const HEAT_ATHLETE_ID = 'ha-1';

  /* eslint-disable @typescript-eslint/no-explicit-any */
  function makeMovements(): Movement[] {
    return [
      Movement.create('mov-1', {
        name: 'Deadlift',
        description: '',
        order: 0,
        wodId: 'wod-1',
        targetReps: 10,
      }),
      Movement.create('mov-2', {
        name: 'Box Jump',
        description: '',
        order: 1,
        wodId: 'wod-1',
        targetReps: 15,
      }),
    ];
  }

  function makeSupabaseMock(): any {
    const heatAthleteRow = {
      id: HEAT_ATHLETE_ID,
      heat_id: HEAT_ID,
      athlete_id: ATHLETE_ID,
      team_id: null,
      judge_id: 'judge-1',
      lane: 1,
      heat: {
        id: HEAT_ID,
        name: 'Heat A',
        wod_id: 'wod-1',
        wod: { id: 'wod-1', name: 'WOD 1', type: 'amrap' },
      },
      team: null,
      athlete: { id: ATHLETE_ID, name: 'John Doe', bib_number: '42' },
    };

    const makeChain = (resolveValue: any) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      or: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue({ data: resolveValue, error: null }),
      maybeSingle: vi.fn().mockResolvedValue({ data: resolveValue, error: null }),
      insert: vi.fn().mockReturnThis(),
    });

    return {
      from: vi.fn((table: string) => {
        if (table === 'heat_athletes') return makeChain(heatAthleteRow);
        if (table === 'scores') return makeChain(null);
        return makeChain(null);
      }),
    };
  }
  /* eslint-enable @typescript-eslint/no-explicit-any */

  let facade: RegisterRepetitionsFacade;
  let movementRepo: {
    findByHeat: ReturnType<typeof vi.fn>;
    findById: ReturnType<typeof vi.fn>;
  };
  let repRecordRepo: {
    findByHeatAndAthlete: ReturnType<typeof vi.fn>;
    save: ReturnType<typeof vi.fn>;
    subscribe: ReturnType<typeof vi.fn>;
  };

  beforeEach(async () => {
    sessionStorage.clear();
    movementRepo = {
      findByHeat: vi.fn().mockResolvedValue(makeMovements()),
      findById: vi.fn(),
    };
    repRecordRepo = {
      findByHeatAndAthlete: vi.fn().mockResolvedValue([]),
      save: vi.fn().mockResolvedValue(undefined),
      subscribe: vi.fn().mockReturnValue(() => undefined),
    };

    await TestBed.configureTestingModule({
      providers: [
        RegisterRepetitionsFacade,
        { provide: SUPABASE_CLIENT, useValue: makeSupabaseMock() },
        { provide: MOVEMENT_REPOSITORY, useValue: movementRepo },
        { provide: REPETITION_RECORD_REPOSITORY, useValue: repRecordRepo },
      ],
    }).compileComponents();
    facade = TestBed.inject(RegisterRepetitionsFacade);
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should load heat data from real repositories', async () => {
    facade.loadHeat(HEAT_ATHLETE_ID);
    await delay(100);
    expect(movementRepo.findByHeat).toHaveBeenCalledWith(HEAT_ID);
    expect(facade.movements()).toHaveLength(2);
    expect(facade.athleteHeat()?.athleteName).toBe('John Doe');
    expect(facade.isLoading()).toBe(false);
  });

  it('should NOT fetch existing records from DB on load', async () => {
    facade.loadHeat(HEAT_ATHLETE_ID);
    await delay(100);
    expect(repRecordRepo.findByHeatAndAthlete).not.toHaveBeenCalled();
  });

  it('should NOT subscribe to real-time updates on load', async () => {
    facade.loadHeat(HEAT_ATHLETE_ID);
    await delay(100);
    expect(repRecordRepo.subscribe).not.toHaveBeenCalled();
  });

  it('should NOT save record via repository on submit', async () => {
    facade.loadHeat(HEAT_ATHLETE_ID);
    await delay(100);
    facade.updateRepetitionCount(5);
    facade.submitRepetitionCount();
    await delay(100);
    expect(repRecordRepo.save).not.toHaveBeenCalled();
  });

  it('should advance movement after submit', async () => {
    facade.loadHeat(HEAT_ATHLETE_ID);
    await delay(100);
    expect(facade.currentMovementIndex()).toBe(0);
    facade.submitRepetitionCount();
    await delay(100);
    expect(facade.currentMovementIndex()).toBe(1);
  });

  it('should set error when loadHeat fails', async () => {
    const brokenSupabase = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        single: vi
          .fn()
          .mockResolvedValue({ data: null, error: { message: 'not found' } }),
      }),
    };
    TestBed.resetTestingModule();
    await TestBed.configureTestingModule({
      providers: [
        RegisterRepetitionsFacade,
        { provide: SUPABASE_CLIENT, useValue: brokenSupabase },
        { provide: MOVEMENT_REPOSITORY, useValue: movementRepo },
        { provide: REPETITION_RECORD_REPOSITORY, useValue: repRecordRepo },
      ],
    }).compileComponents();
    const brokenFacade = TestBed.inject(RegisterRepetitionsFacade);
    brokenFacade.loadHeat(HEAT_ATHLETE_ID);
    await delay(100);
    expect(brokenFacade.error()).toContain('not found');
  });

  it('should restore records from sessionStorage if available', async () => {
    sessionStorage.setItem(
      `hero_scoring_${HEAT_ATHLETE_ID}`,
      JSON.stringify({
        records: [
          { movementId: 'mov-1', count: 8, confirmed: true },
          { movementId: 'mov-2', count: 0, confirmed: false },
        ],
        currentMovementIndex: 1,
        elapsedSeconds: 42,
      }),
    );
    facade.loadHeat(HEAT_ATHLETE_ID);
    await delay(100);
    expect(facade.currentMovementIndex()).toBe(1);
    expect(facade.elapsedSeconds()).toBe(42);
    const records = facade.store.repetitionRecords();
    expect(records.get('mov-1')?.count.value).toBe(8);
    expect(records.get('mov-1')?.confirmed).toBe(true);
    expect(records.get('mov-2')?.count.value).toBe(0);
    expect(records.get('mov-2')?.confirmed).toBe(false);
  });
});

describe('RegisterRepetitionsFacade — summary operations', () => {
  let facade: RegisterRepetitionsFacade;
  let updateEqMock: ReturnType<typeof vi.fn>;
  let updateMock: ReturnType<typeof vi.fn>;
  let insertMock: ReturnType<typeof vi.fn>;
  let maybeSingleMock: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    sessionStorage.clear();
    maybeSingleMock = vi.fn();
    updateEqMock = vi.fn().mockResolvedValue({ error: null });
    updateMock = vi.fn().mockReturnValue({ eq: updateEqMock });
    insertMock = vi.fn().mockResolvedValue({ error: null });

    const supabaseMock = {
      from: vi.fn().mockReturnValue({
        select: vi.fn().mockReturnThis(),
        eq: vi.fn().mockReturnThis(),
        or: vi.fn().mockReturnThis(),
        maybeSingle: maybeSingleMock,
        update: updateMock,
        insert: insertMock,
      }),
    };

    await TestBed.configureTestingModule({
      providers: [
        RegisterRepetitionsFacade,
        { provide: SUPABASE_CLIENT, useValue: supabaseMock },
        {
          provide: MOVEMENT_REPOSITORY,
          useValue: { findByHeat: vi.fn(), findById: vi.fn() },
        },
        {
          provide: REPETITION_RECORD_REPOSITORY,
          useValue: {
            findByHeatAndAthlete: vi.fn(),
            save: vi.fn(),
            subscribe: vi.fn(),
          },
        },
      ],
    }).compileComponents();

    facade = TestBed.inject(RegisterRepetitionsFacade);
    facade.store.loadHeatData(
      AthleteHeat.create({
        athleteId: 'athlete-1',
        athleteName: 'Test Athlete',
        bibNumber: '001',
        division: 'RX',
        heatId: 'heat-1',
        heatName: 'Heat 1',
        wodName: 'Test WOD',
        wodType: 'AMRAP',
        lane: 1,
      }),
      [
        Movement.create('mov-1', {
          name: 'Thrusters',
          description: 'Round 1',
          order: 0,
          wodId: 'wod-1',
          targetReps: 21,
        }),
      ],
      [
        RepetitionRecord.create('rec-1', {
          movementId: 'mov-1',
          athleteId: 'athlete-1',
          heatId: 'heat-1',
          count: RepetitionCount.create(21),
          judgeId: 'judge-1',
          confirmed: true,
          createdAt: new Date(),
        }),
      ],
      'score-1',
      undefined,
      undefined,
      'ha-1',
      'wod-1',
      'level-1',
      false,
    );
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should record elapsed time in the store', () => {
    facade.recordElapsedTime(125);
    expect(facade.elapsedSeconds()).toBe(125);
  });

  it('should expose movement summary items', () => {
    const items = facade.movementSummaryItems();
    expect(items).toHaveLength(1);
    expect(items[0]).toMatchObject({
      movementId: 'mov-1',
      name: 'Thrusters',
      roundLabel: 'Round 1',
      confirmedRepetitions: 21,
      targetRepetitions: 21,
    });
  });

  it('should finalize score via Supabase update when score exists', async () => {
    maybeSingleMock.mockResolvedValue({ data: { id: 'score-1' }, error: null });
    await facade.finalizeScore('sig-1');
    expect(updateMock).toHaveBeenCalledWith({
      status: 'submitted',
      value: {
        movement_reps: { 'mov-1': { reps: 21, confirmed: true } },
        signature: 'sig-1',
      },
    });
    expect(updateEqMock).toHaveBeenCalledWith('id', 'score-1');
    expect(facade.isSubmitting()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should insert score when no existing score found', async () => {
    maybeSingleMock.mockResolvedValue({ data: null, error: null });
    await facade.finalizeScore('sig-2');
    expect(insertMock).toHaveBeenCalledWith({
      heat_id: 'heat-1',
      wod_id: 'wod-1',
      level_id: 'level-1',
      athlete_id: 'athlete-1',
      team_id: null,
      value: {
        movement_reps: { 'mov-1': { reps: 21, confirmed: true } },
        signature: 'sig-2',
      },
      status: 'submitted',
    });
    expect(facade.isSubmitting()).toBe(false);
    expect(facade.error()).toBeNull();
  });

  it('should clear sessionStorage after finalizing', async () => {
    maybeSingleMock.mockResolvedValue({ data: { id: 'score-1' }, error: null });
    sessionStorage.setItem('hero_scoring_ha-1', 'test-data');
    await facade.finalizeScore('sig-1');
    const stored = sessionStorage.getItem('hero_scoring_ha-1');
    expect(stored).toBeNull();
  });

  it('should set error and throw when finalize score fails', async () => {
    maybeSingleMock.mockResolvedValue({ data: { id: 'score-1' }, error: null });
    updateEqMock.mockResolvedValue({ error: { message: 'db error' } });
    await expect(
      facade.finalizeScore('sig-1'),
    ).rejects.toMatchObject({ message: 'db error' });
    expect(facade.error()).toContain('db error');
    expect(facade.isSubmitting()).toBe(false);
  });
});
