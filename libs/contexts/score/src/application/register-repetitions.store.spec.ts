import { AthleteHeat } from '../domain/athlete-heat.model';
import { Movement } from '../domain/movement.model';
import { RepetitionCount, RepetitionRecord } from '../domain/repetition-record.model';
import { RegisterRepetitionsStore } from './register-repetitions.store';

function createMockAthleteHeat(): AthleteHeat {
  return AthleteHeat.create({
    athleteId: 'athlete-001',
    athleteName: 'Test Athlete',
    bibNumber: '001',
    division: 'RX',
    heatId: 'heat-001',
    heatName: 'Heat 1',
    wodName: 'Test WOD',
    wodType: 'AMRAP',
    lane: 1,
  });
}

function createMockMovements(): Movement[] {
  return [
    Movement.create('mov-1', { name: 'Thrusters', description: '21 reps', order: 0, wodId: 'wod-1' }),
    Movement.create('mov-2', { name: 'Pull-ups', description: '15 reps', order: 1, wodId: 'wod-1' }),
    Movement.create('mov-3', { name: 'Box Jumps', description: '9 reps', order: 2, wodId: 'wod-1' }),
  ];
}

function createMockRecords(movements: Movement[]): RepetitionRecord[] {
  return movements.map((movement) =>
    RepetitionRecord.create(`record-${movement.id}`, {
      movementId: movement.id,
      athleteId: 'athlete-001',
      heatId: 'heat-001',
      count: RepetitionCount.zero(),
      judgeId: 'judge-001',
      confirmed: false,
      createdAt: new Date(),
    }),
  );
}

describe('RegisterRepetitionsStore', () => {
  let store: RegisterRepetitionsStore;

  beforeEach(() => {
    store = new RegisterRepetitionsStore();
  });

  describe('initial state', () => {
    it('should have null athleteHeat', () => {
      expect(store.athleteHeat()).toBeNull();
    });

    it('should have empty movements', () => {
      expect(store.movements()).toEqual([]);
    });

    it('should not be loading', () => {
      expect(store.isLoading()).toBe(false);
    });

    it('should have no error', () => {
      expect(store.error()).toBeNull();
    });
  });

  describe('loadHeatData', () => {
    it('should load athlete heat, movements, and records', () => {
      const athleteHeat = createMockAthleteHeat();
      const movements = createMockMovements();
      const records = createMockRecords(movements);

      store.loadHeatData(athleteHeat, movements, records);

      expect(store.athleteHeat()).toBe(athleteHeat);
      expect(store.movements()).toHaveLength(3);
      expect(store.currentMovementIndex()).toBe(0);
      expect(store.isLoading()).toBe(false);
    });

    it('should sort movements by order', () => {
      const athleteHeat = createMockAthleteHeat();
      const movements = [
        Movement.create('mov-2', { name: 'Pull-ups', description: '', order: 1, wodId: 'wod-1' }),
        Movement.create('mov-1', { name: 'Thrusters', description: '', order: 0, wodId: 'wod-1' }),
      ];
      const records = createMockRecords(movements);

      store.loadHeatData(athleteHeat, movements, records);

      expect(store.movements()[0].name).toBe('Thrusters');
      expect(store.movements()[1].name).toBe('Pull-ups');
    });

    it('should merge incoming records with existing records (Realtime partial update)', () => {
      const athleteHeat = createMockAthleteHeat();
      const movements = createMockMovements();
      const allRecords = createMockRecords(movements);
      allRecords[0] = allRecords[0].updateCount(RepetitionCount.create(21));

      store.loadHeatData(athleteHeat, movements, allRecords);

      store.navigateNext();
      store.updateRepetitionCount('mov-2', RepetitionCount.create(15));

      const partialUpdate = [allRecords[0].confirm()];
      store.loadHeatData(athleteHeat, movements, partialUpdate);

      expect(store.repetitionRecords().get('mov-1')?.count.value).toBe(21);
      expect(store.repetitionRecords().get('mov-1')?.confirmed).toBe(true);
      expect(store.repetitionRecords().get('mov-2')?.count.value).toBe(15);
      expect(store.currentMovementIndex()).toBe(1);
    });
  });

  describe('navigation', () => {
    beforeEach(() => {
      const athleteHeat = createMockAthleteHeat();
      const movements = createMockMovements();
      const records = createMockRecords(movements);
      store.loadHeatData(athleteHeat, movements, records);
    });

    it('should navigate to next movement', () => {
      store.navigateNext();
      expect(store.currentMovementIndex()).toBe(1);
    });

    it('should navigate to previous movement', () => {
      store.navigateNext();
      store.navigatePrevious();
      expect(store.currentMovementIndex()).toBe(0);
    });

    it('should not navigate past last movement', () => {
      store.navigateToMovement(2);
      store.navigateNext();
      expect(store.currentMovementIndex()).toBe(2);
    });

    it('should not navigate before first movement', () => {
      store.navigatePrevious();
      expect(store.currentMovementIndex()).toBe(0);
    });

    it('should navigate to specific movement by index', () => {
      store.navigateToMovement(2);
      expect(store.currentMovementIndex()).toBe(2);
      expect(store.currentMovement()?.name).toBe('Box Jumps');
    });

    it('should ignore invalid navigation indices', () => {
      store.navigateToMovement(-1);
      expect(store.currentMovementIndex()).toBe(0);

      store.navigateToMovement(99);
      expect(store.currentMovementIndex()).toBe(0);
    });
  });

  describe('repetition count updates', () => {
    beforeEach(() => {
      const athleteHeat = createMockAthleteHeat();
      const movements = createMockMovements();
      const records = createMockRecords(movements);
      store.loadHeatData(athleteHeat, movements, records);
    });

    it('should update repetition count for a movement', () => {
      store.updateRepetitionCount('mov-1', RepetitionCount.create(10));
      expect(store.currentRepetitionCount().value).toBe(10);
    });

    it('should mark record as unconfirmed when count changes', () => {
      store.confirmRepetitionRecord('mov-1');
      store.updateRepetitionCount('mov-1', RepetitionCount.create(5));
      expect(store.hasUnsavedChanges()).toBe(true);
    });
  });

  describe('confirmation', () => {
    beforeEach(() => {
      const athleteHeat = createMockAthleteHeat();
      const movements = createMockMovements();
      const records = createMockRecords(movements);
      store.loadHeatData(athleteHeat, movements, records);
    });

    it('should confirm a repetition record', () => {
      store.updateRepetitionCount('mov-1', RepetitionCount.create(10));
      expect(store.hasUnsavedChanges()).toBe(true);

      store.confirmRepetitionRecord('mov-1');
      expect(store.hasUnsavedChanges()).toBe(false);
    });
  });

  describe('computed values', () => {
    beforeEach(() => {
      const athleteHeat = createMockAthleteHeat();
      const movements = createMockMovements();
      const records = createMockRecords(movements);
      store.loadHeatData(athleteHeat, movements, records);
    });

    it('should report total movements', () => {
      expect(store.totalMovements()).toBe(3);
    });

    it('should report movement progress', () => {
      expect(store.movementProgress()).toBe('1 / 3');
      store.navigateNext();
      expect(store.movementProgress()).toBe('2 / 3');
    });

    it('should report canNavigateNext correctly', () => {
      expect(store.canNavigateNext()).toBe(true);
      store.navigateToMovement(2);
      expect(store.canNavigateNext()).toBe(false);
    });

    it('should report canNavigatePrevious correctly', () => {
      expect(store.canNavigatePrevious()).toBe(false);
      store.navigateNext();
      expect(store.canNavigatePrevious()).toBe(true);
    });
  });

  describe('elapsed time', () => {
    it('should start with zero elapsed seconds', () => {
      expect(store.elapsedSeconds()).toBe(0);
    });

    it('should update elapsed seconds', () => {
      store.setElapsedSeconds(125);
      expect(store.elapsedSeconds()).toBe(125);
    });

    it('should reset elapsed seconds when loading a different athlete', () => {
      store.setElapsedSeconds(125);
      const differentAthlete = AthleteHeat.create({
        athleteId: 'athlete-002',
        athleteName: 'Different',
        bibNumber: '002',
        division: 'RX',
        heatId: 'heat-002',
        heatName: 'Heat 2',
        wodName: 'Test WOD',
        wodType: 'AMRAP',
        lane: 2,
      });
      store.loadHeatData(differentAthlete, createMockMovements(), createMockRecords(createMockMovements()));
      expect(store.elapsedSeconds()).toBe(0);
    });

    it('should preserve elapsed seconds when reloading same athlete (e.g. Realtime update)', () => {
      store.loadHeatData(createMockAthleteHeat(), createMockMovements(), createMockRecords(createMockMovements()));
      store.setElapsedSeconds(125);
      store.loadHeatData(createMockAthleteHeat(), createMockMovements(), createMockRecords(createMockMovements()));
      expect(store.elapsedSeconds()).toBe(125);
    });
  });

  describe('all confirmed', () => {
    it('should be false when no records are loaded', () => {
      expect(store.allConfirmed()).toBe(false);
    });

    it('should be false when some records are unconfirmed', () => {
      const movements = createMockMovements();
      store.loadHeatData(createMockAthleteHeat(), movements, createMockRecords(movements));
      store.confirmRepetitionRecord(movements[0].id);
      expect(store.allConfirmed()).toBe(false);
    });

    it('should be true when all records are confirmed', () => {
      const movements = createMockMovements();
      store.loadHeatData(createMockAthleteHeat(), movements, createMockRecords(movements));
      for (const movement of movements) {
        store.confirmRepetitionRecord(movement.id);
      }
      expect(store.allConfirmed()).toBe(true);
    });
  });
});
