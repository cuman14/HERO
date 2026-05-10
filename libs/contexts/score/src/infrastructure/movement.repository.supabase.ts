import { type SupabaseClient } from '@supabase/supabase-js';
import { Movement } from '../domain/movement.model';
import { MovementMapper } from './mappers/movement.mapper';
import { type MovementRepository } from './movement.repository';

interface HeatWithWodRow {
  id: string;
  wod: {
    id: string;
    name: string;
    type: string;
    base_config: Record<string, unknown>;
  };
}

export class SupabaseMovementRepository implements MovementRepository {
  constructor(private readonly supabase: SupabaseClient) {}

  async findByHeat(heatId: string): Promise<Movement[]> {
    const { data, error } = await this.supabase
      .from('heats')
      .select('id, wod:wods!heats_wod_id_fkey(id, name, type, base_config)')
      .eq('id', heatId)
      .single<HeatWithWodRow>();

    if (error || !data?.wod) return [];
    return MovementMapper.fromBaseConfig(data.wod.base_config, data.wod.id);
  }

  async findById(id: string, heatId: string): Promise<Movement | null> {
    const movements = await this.findByHeat(heatId);
    return movements.find((m) => m.id === id) ?? null;
  }
}
