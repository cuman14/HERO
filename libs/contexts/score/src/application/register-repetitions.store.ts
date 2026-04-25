import { computed, signal } from '@angular/core';
import { AthleteHeat } from '../domain/athlete-heat.model';
import { Movement } from '../domain/movement.model';
import {
  RepetitionCount,
  RepetitionRecord,
} from '../domain/repetition-record.model';

export interface RegisterRepetitionsState {
  athleteHeat: AthleteHeat | null;
  movements: Movement[];
  currentMovementIndex: number;
  repetitionRecords: Map<string, RepetitionRecord>;
  isLoading: boolean;
  isSubmitting: boolean;
  error: string | null;
}

export class RegisterRepetitionsStore {
  private readonly state = signal<RegisterRepetitionsState>({
    athleteHeat: null,
    movements: [],
    currentMovementIndex: 0,
    repetitionRecords: new Map(),
    isLoading: false,
    isSubmitting: false,
    error: null,
  });

  readonly athleteHeat = computed(() => this.state().athleteHeat);
  readonly movements = computed(() => this.state().movements);
  readonly currentMovementIndex = computed(
    () => this.state().currentMovementIndex,
  );
  readonly isLoading = computed(() => this.state().isLoading);
  readonly isSubmitting = computed(() => this.state().isSubmitting);
  readonly error = computed(() => this.state().error);

  readonly currentMovement = computed(() => {
    const movements = this.movements();
    const index = this.currentMovementIndex();
    return movements[index] ?? null;
  });

  readonly currentRepetitionRecord = computed(() => {
    const movement = this.currentMovement();
    if (!movement) return null;
    return this.state().repetitionRecords.get(movement.id) ?? null;
  });

  readonly currentRepetitionCount = computed(() => {
    return this.currentRepetitionRecord()?.count ?? RepetitionCount.zero();
  });

  readonly totalMovements = computed(() => this.movements().length);

  readonly canNavigateNext = computed(
    () => this.currentMovementIndex() < this.totalMovements() - 1,
  );

  readonly canNavigatePrevious = computed(
    () => this.currentMovementIndex() > 0,
  );

  readonly hasUnsavedChanges = computed(() => {
    const record = this.currentRepetitionRecord();
    return record !== null && !record.confirmed;
  });

  readonly movementProgress = computed(
    () => `${this.currentMovementIndex() + 1} / ${this.totalMovements()}`,
  );

  readonly totalReps = computed(() => {
    let total = 0;
    for (const record of this.state().repetitionRecords.values()) {
      total += record.count.value;
    }
    return total;
  });

  setLoading(isLoading: boolean): void {
    this.state.update((state) => ({ ...state, isLoading }));
  }

  setSubmitting(isSubmitting: boolean): void {
    this.state.update((state) => ({ ...state, isSubmitting }));
  }

  setError(error: string | null): void {
    this.state.update((state) => ({ ...state, error }));
  }

  loadHeatData(
    athleteHeat: AthleteHeat,
    movements: Movement[],
    repetitionRecords: RepetitionRecord[],
  ): void {
    const recordsMap = new Map<string, RepetitionRecord>();
    for (const record of repetitionRecords) {
      recordsMap.set(record.movementId, record);
    }
    this.state.update((state) => ({
      ...state,
      athleteHeat,
      movements: [...movements].sort((a, b) => a.order - b.order),
      currentMovementIndex: 0,
      repetitionRecords: recordsMap,
      isLoading: false,
      error: null,
    }));
  }

  navigateToMovement(index: number): void {
    const movements = this.movements();
    if (index < 0 || index >= movements.length) return;
    this.state.update((state) => ({ ...state, currentMovementIndex: index }));
  }

  navigateNext(): void {
    if (this.canNavigateNext()) {
      this.navigateToMovement(this.currentMovementIndex() + 1);
    }
  }

  navigatePrevious(): void {
    if (this.canNavigatePrevious()) {
      this.navigateToMovement(this.currentMovementIndex() - 1);
    }
  }

  updateRepetitionCount(movementId: string, count: RepetitionCount): void {
    this.state.update((state) => {
      const records = new Map(state.repetitionRecords);
      const existing = records.get(movementId);
      if (existing) {
        records.set(movementId, existing.updateCount(count));
      }
      return { ...state, repetitionRecords: records };
    });
  }

  confirmRepetitionRecord(movementId: string): void {
    this.state.update((state) => {
      const records = new Map(state.repetitionRecords);
      const existing = records.get(movementId);
      if (existing) {
        records.set(movementId, existing.confirm());
      }
      return { ...state, repetitionRecords: records, isSubmitting: false };
    });
  }
}
