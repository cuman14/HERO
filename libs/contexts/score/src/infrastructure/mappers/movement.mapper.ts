import { Movement } from '../../domain/movement.model';

export interface WodMovementConfig {
  id: string;
  name: string;
  description: string;
  order: number;
  target_reps: number;
}

export class MovementMapper {
  static toDomain(config: WodMovementConfig, wodId: string): Movement {
    return Movement.create(config.id, {
      name: config.name,
      description: config.description,
      order: config.order,
      wodId,
      targetReps: config.target_reps,
    });
  }

  static fromBaseConfig(
    baseConfig: Record<string, unknown>,
    wodId: string,
  ): Movement[] {
    const movements = (baseConfig?.['movements'] ?? []) as WodMovementConfig[];
    return movements
      .map((m) => MovementMapper.toDomain(m, wodId))
      .sort((a, b) => a.order - b.order);
  }
}
