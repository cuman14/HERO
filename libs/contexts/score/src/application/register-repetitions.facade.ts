import { Injectable } from '@angular/core';
import { RepetitionCount } from '../domain/repetition-record.model';
import {
  MOCK_ATHLETE_HEAT,
  MOCK_MOVEMENTS,
  MOCK_REPETITION_RECORDS,
} from './mock-heat-data';
import { RegisterRepetitionsStore } from './register-repetitions.store';

@Injectable()
export class RegisterRepetitionsFacade {
  readonly store = new RegisterRepetitionsStore();

  readonly athleteHeat = this.store.athleteHeat;
  readonly movements = this.store.movements;
  readonly currentMovement = this.store.currentMovement;
  readonly currentMovementIndex = this.store.currentMovementIndex;
  readonly currentRepetitionCount = this.store.currentRepetitionCount;
  readonly totalMovements = this.store.totalMovements;
  readonly movementProgress = this.store.movementProgress;
  readonly canNavigateNext = this.store.canNavigateNext;
  readonly canNavigatePrevious = this.store.canNavigatePrevious;
  readonly hasUnsavedChanges = this.store.hasUnsavedChanges;
  readonly totalReps = this.store.totalReps;
  readonly isLoading = this.store.isLoading;
  readonly isSubmitting = this.store.isSubmitting;
  readonly error = this.store.error;

  loadHeat(): void {
    this.store.setLoading(true);
    // Phase 2: Using mock data. Phase 4 (Infrastructure) will replace with real repository calls.
    setTimeout(() => {
      this.store.loadHeatData(
        MOCK_ATHLETE_HEAT,
        MOCK_MOVEMENTS,
        MOCK_REPETITION_RECORDS,
      );
    }, 300);
  }

  updateRepetitionCount(count: number): void {
    const movement = this.currentMovement();
    if (!movement) return;
    try {
      const repetitionCount = RepetitionCount.create(count);
      this.store.updateRepetitionCount(movement.id, repetitionCount);
    } catch {
      this.store.setError('Invalid repetition count');
    }
  }

  incrementRepetitionCount(): void {
    const current = this.currentRepetitionCount();
    const movement = this.currentMovement();
    if (!movement) return;
    this.store.updateRepetitionCount(movement.id, current.increment());
  }

  decrementRepetitionCount(): void {
    const current = this.currentRepetitionCount();
    const movement = this.currentMovement();
    if (!movement) return;
    this.store.updateRepetitionCount(movement.id, current.decrement());
  }

  submitRepetitionCount(): void {
    const movement = this.currentMovement();
    if (!movement) return;
    this.store.setSubmitting(true);
    // Phase 2: Mock submission. Phase 4 (Infrastructure) will replace with real repository calls.
    setTimeout(() => {
      this.store.confirmRepetitionRecord(movement.id);
    }, 200);
  }

  navigateToMovement(index: number): void {
    this.store.navigateToMovement(index);
  }

  navigateNext(): void {
    this.store.navigateNext();
  }

  navigatePrevious(): void {
    this.store.navigatePrevious();
  }
}
