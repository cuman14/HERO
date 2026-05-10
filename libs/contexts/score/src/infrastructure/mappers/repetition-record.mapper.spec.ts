import { RepetitionCount, RepetitionRecord } from '../../domain/repetition-record.model';
import { RepetitionRecordMapper } from './repetition-record.mapper';

const BASE_ROW = {
  movementId: 'mov-1',
  athleteId: 'team-1',
  heatId: 'heat-1',
  judgeId: 'judge-1',
  scoreId: 'score-1',
  reps: 21,
  confirmed: true,
};

describe('RepetitionRecordMapper', () => {
  describe('toDomain', () => {
    it('creates RepetitionRecord with correct count and confirmation status', () => {
      const record = RepetitionRecordMapper.toDomain(BASE_ROW);

      expect(record.movementId).toBe('mov-1');
      expect(record.athleteId).toBe('team-1');
      expect(record.heatId).toBe('heat-1');
      expect(record.judgeId).toBe('judge-1');
      expect(record.count.value).toBe(21);
      expect(record.confirmed).toBe(true);
    });

    it('uses scoreId and movementId as composite record id', () => {
      const record = RepetitionRecordMapper.toDomain(BASE_ROW);
      expect(record.id).toBe('score-1-mov-1');
    });

    it('maps reps = 0 to RepetitionCount.zero()', () => {
      const record = RepetitionRecordMapper.toDomain({ ...BASE_ROW, reps: 0 });
      expect(record.count.value).toBe(0);
    });
  });

  describe('toScoreValue', () => {
    it('merges new record into existing score value map', () => {
      const existing = { 'mov-1': { reps: 21, confirmed: true } };
      const record = RepetitionRecord.create('score-1-mov-2', {
        movementId: 'mov-2',
        athleteId: 'team-1',
        heatId: 'heat-1',
        count: RepetitionCount.create(15),
        judgeId: 'judge-1',
        confirmed: false,
        createdAt: new Date(),
      });

      const result = RepetitionRecordMapper.toScoreValue(existing, record);

      expect(result['mov-1']).toEqual({ reps: 21, confirmed: true });
      expect(result['mov-2']).toEqual({ reps: 15, confirmed: false });
    });

    it('overwrites existing entry for the same movement', () => {
      const existing = { 'mov-1': { reps: 21, confirmed: false } };
      const record = RepetitionRecord.create('score-1-mov-1', {
        movementId: 'mov-1',
        athleteId: 'team-1',
        heatId: 'heat-1',
        count: RepetitionCount.create(18),
        judgeId: 'judge-1',
        confirmed: true,
        createdAt: new Date(),
      });

      const result = RepetitionRecordMapper.toScoreValue(existing, record);

      expect(result['mov-1']).toEqual({ reps: 18, confirmed: true });
    });
  });
});
