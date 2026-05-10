import { InjectionToken } from '@angular/core';
import { RepetitionRecord } from '../domain/repetition-record.model';

export interface RepetitionRecordRepository {
  findByHeatAndAthlete(
    heatId: string,
    athleteId: string,
  ): Promise<RepetitionRecord[]>;
  save(record: RepetitionRecord, scoreId: string): Promise<void>;
  subscribe(
    heatId: string,
    athleteId: string,
    callback: (records: RepetitionRecord[]) => void,
  ): () => void;
}

export const REPETITION_RECORD_REPOSITORY =
  new InjectionToken<RepetitionRecordRepository>(
    'REPETITION_RECORD_REPOSITORY',
  );
