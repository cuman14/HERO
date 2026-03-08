import { IScoreRepository, Score } from '@hero/domain';
import { ScoreMapper, SupabaseScoreRow } from '../mappers/score.mapper';

/**
 * SupabaseScoreRepository
 *
 * Implements the domain port. This is the ONLY place that
 * knows about the @supabase/supabase-js client details for scores.
 */
export class SupabaseScoreRepository implements IScoreRepository {
  // In a real app, this would be injected via Angular DI
  private supabase: any; // SupabaseClient

  constructor(supabaseClient: any) {
    this.supabase = supabaseClient;
  }

  async save(score: Score): Promise<Score> {
    const row = ScoreMapper.toPersistence(score);
    const { data, error } = await this.supabase
      .from('scores')
      .upsert(row)
      .select()
      .single();

    if (error) throw new Error(`Supabase error saving score: ${error.message}`);
    return ScoreMapper.toDomain(data as SupabaseScoreRow);
  }

  async findById(id: string): Promise<Score | null> {
    const { data, error } = await this.supabase
      .from('scores')
      .select()
      .eq('id', id)
      .maybeSingle();

    if (error) throw new Error(`Supabase error fetching score: ${error.message}`);
    if (!data) return null;
    return ScoreMapper.toDomain(data as SupabaseScoreRow);
  }

  async findByWodAndAthlete(wodId: string, athleteId: string): Promise<Score | null> {
    const { data, error } = await this.supabase
      .from('scores')
      .select()
      .eq('wod_id', wodId)
      .eq('athlete_id', athleteId)
      .maybeSingle();

    if (error) throw new Error(`Supabase error: ${error.message}`);
    if (!data) return null;
    return ScoreMapper.toDomain(data as SupabaseScoreRow);
  }

  async findByHeat(heatId: string): Promise<Score[]> {
    const { data, error } = await this.supabase
      .from('scores')
      .select()
      .eq('heat_id', heatId);

    if (error) throw new Error(`Supabase error: ${error.message}`);
    return (data as SupabaseScoreRow[]).map(ScoreMapper.toDomain);
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase
      .from('scores')
      .delete()
      .eq('id', id);

    if (error) throw new Error(`Supabase error deleting score: ${error.message}`);
  }
}
