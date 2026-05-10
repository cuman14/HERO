import { InjectionToken } from '@angular/core';
import { Movement } from '../domain/movement.model';

export interface MovementRepository {
  findByHeat(heatId: string): Promise<Movement[]>;
  findById(id: string, heatId: string): Promise<Movement | null>;
}

export const MOVEMENT_REPOSITORY = new InjectionToken<MovementRepository>(
  'MOVEMENT_REPOSITORY',
);
