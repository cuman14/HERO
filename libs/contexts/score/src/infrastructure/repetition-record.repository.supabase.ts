import {
  type RealtimeChannel,
  type SupabaseClient,
} from '@supabase/supabase-js';
import { RepetitionRecord } from '../domain/repetition-record.model';
import {
  RepetitionRecordMapper,
  type ScoreValueMovementReps,
} from './mappers/repetition-record.mapper';
import { type RepetitionRecordRepository } from './repetition-record.repository';

interface ScoreRow {
  id: string;
  athlete_id: string | null;
  team_id: string | null;
  heat_id: string;
  judge_id: string | null;
  value: { movement_reps?: ScoreValueMovementReps } | null;
}

export class SupabaseRepetitionRecordRepository
  implements RepetitionRecordRepository
{
  constructor(private readonly supabase: SupabaseClient) {}

  async findByHeatAndAthlete(
    heatId: string,
    athleteId: string,
  ): Promise<RepetitionRecord[]> {
    const { data: score, error } = await this.supabase
      .from('scores')
      .select('id, athlete_id, team_id, heat_id, judge_id, value')
      .eq('heat_id', heatId)
      .or(`athlete_id.eq.${athleteId},team_id.eq.${athleteId}`)
      .maybeSingle<ScoreRow>();

    if (error || !score) return [];

    const movementReps = score.value?.movement_reps ?? {};
    return Object.entries(movementReps).map(([movementId, repData]) =>
      RepetitionRecordMapper.toDomain({
        movementId,
        athleteId,
        heatId,
        judgeId: score.judge_id ?? '',
        scoreId: score.id,
        reps: repData.reps,
        confirmed: repData.confirmed,
      }),
    );
  }

  async save(record: RepetitionRecord, scoreId: string): Promise<void> {
    const { data: existing } = await this.supabase
      .from('scores')
      .select('value')
      .eq('id', scoreId)
      .single<Pick<ScoreRow, 'value'>>();

    const existingReps: ScoreValueMovementReps =
      existing?.value?.movement_reps ?? {};

    const updatedValue = {
      ...existing?.value,
      movement_reps: RepetitionRecordMapper.toScoreValue(existingReps, record),
    };

    const { error } = await this.supabase
      .from('scores')
      .update({ value: updatedValue })
      .eq('id', scoreId);

    if (error) throw new Error(`Error saving repetition record: ${error.message}`);
  }

  subscribe(
    heatId: string,
    athleteId: string,
    callback: (records: RepetitionRecord[]) => void,
  ): () => void {
    const channel: RealtimeChannel = this.supabase
      .channel(`score-${heatId}-${athleteId}`)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'scores',
          filter: `heat_id=eq.${heatId}`,
        },
        () => {
          this.findByHeatAndAthlete(heatId, athleteId).then(callback);
        },
      )
      .subscribe();

    return () => {
      this.supabase.removeChannel(channel);
    };
  }
}
