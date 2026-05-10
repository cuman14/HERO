import { AthleteHeat } from '../domain/athlete-heat.model';
import { Movement } from '../domain/movement.model';
import {
  RepetitionCount,
  RepetitionRecord,
} from '../domain/repetition-record.model';

export const MOCK_ATHLETE_HEAT = AthleteHeat.create({
  athleteId: 'athlete-001',
  athleteName: 'Carlos García',
  bibNumber: '042',
  division: 'RX',
  heatId: 'heat-001',
  heatName: 'Heat 1A',
  wodName: 'Fran',
  wodType: 'FOR_TIME',
  lane: 1,
});

export const MOCK_MOVEMENTS: Movement[] = [
  Movement.create('movement-001', {
    name: 'Thrusters',
    description: 'Round 1',
    order: 0,
    wodId: 'wod-001',
    targetReps: 21,
  }),
  Movement.create('movement-002', {
    name: 'Pull-ups',
    description: 'Round 2',
    order: 1,
    wodId: 'wod-001',
    targetReps: 21,
  }),
  Movement.create('movement-003', {
    name: 'Thrusters',
    description: 'Round 3',
    order: 2,
    wodId: 'wod-001',
    targetReps: 15,
  }),
  Movement.create('movement-004', {
    name: 'Chest-to-Bar',
    description: 'Round 4',
    order: 3,
    wodId: 'wod-001',
    targetReps: 15,
  }),
  Movement.create('movement-005', {
    name: 'Burpees',
    description: 'Round 5',
    order: 4,
    wodId: 'wod-001',
    targetReps: 9,
  }),
];

export const MOCK_REPETITION_RECORDS: RepetitionRecord[] = MOCK_MOVEMENTS.map(
  (movement) =>
    RepetitionRecord.create(`record-${movement.id}`, {
      movementId: movement.id,
      athleteId: MOCK_ATHLETE_HEAT.athleteId,
      heatId: MOCK_ATHLETE_HEAT.heatId,
      count: RepetitionCount.zero(),
      judgeId: 'judge-001',
      confirmed: false,
      createdAt: new Date(),
    }),
);
