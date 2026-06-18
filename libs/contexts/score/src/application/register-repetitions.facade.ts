import { computed, inject, Injectable } from '@angular/core';
import { SUPABASE_CLIENT } from '@hero/core';
import { type SupabaseClient } from '@supabase/supabase-js';
import { AthleteHeat } from '../domain/athlete-heat.model';
import { type MovementSummaryItem } from '../domain/movement-summary-item.model';
import {
  RepetitionCount,
  RepetitionRecord,
} from '../domain/repetition-record.model';
import { injectScoreErrorHandler } from '@hero/core';
import { MOVEMENT_REPOSITORY } from '../infrastructure/movement.repository';
import { REPETITION_RECORD_REPOSITORY } from '../infrastructure/repetition-record.repository';
import { RegisterRepetitionsStore } from './register-repetitions.store';
import {
  clearScoreSession,
  loadScoreSession,
  saveScoreSession,
} from '../infrastructure/score-session-storage';

interface HeatAthleteContext {
  id: string;
  heat_id: string;
  athlete_id: string | null;
  team_id: string | null;
  judge_id: string | null;
  lane: number | null;
  heat: {
    id: string;
    name: string;
    wod_id: string;
    wod: { id: string; name: string; type: string };
  };
  team: {
    id: string;
    name: string;
    bib_number: string | null;
    level_id: string;
  } | null;
  athlete: { id: string; name: string; bib_number: string | null; level_id: string | null } | null;
}

interface ScoreRow {
  id: string;
  value: Record<string, unknown> | null;
}

@Injectable()
export class RegisterRepetitionsFacade {
  readonly store = new RegisterRepetitionsStore();

  private readonly supabase = inject<SupabaseClient>(SUPABASE_CLIENT);
  private readonly movementRepo = inject(MOVEMENT_REPOSITORY);
  private readonly repRecordRepo = inject(REPETITION_RECORD_REPOSITORY);
  private readonly errorHandler = injectScoreErrorHandler();

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
  readonly allConfirmed = this.store.allConfirmed;
  readonly elapsedSeconds = this.store.elapsedSeconds;

  readonly movementSummaryItems = computed<MovementSummaryItem[]>(() => {
    const records = this.store.repetitionRecords();
    return this.store.movements().map((movement) => {
      const record = records.get(movement.id);
      return {
        movementId: movement.id,
        name: movement.name,
        roundLabel: movement.description,
        confirmedRepetitions: record?.count.value ?? 0,
        targetRepetitions: movement.targetReps,
      };
    });
  });

  /** Loads heat data for the given `heatAthleteId` from Supabase. */
  loadHeat(heatAthleteId: string): void {
    this.store.setLoading(true);
    this.loadRealData(heatAthleteId);
  }

  private async loadRealData(heatAthleteId: string): Promise<void> {
    try {
      const { data: context, error } = await this.supabase
        .from('heat_athletes')
        .select(
          `
          id, heat_id, athlete_id, team_id, judge_id, lane,
          heat:heats!heat_athletes_heat_id_fkey(
            id, name, wod_id,
            wod:wods!heats_wod_id_fkey(id, name, type)
          ),
          team:teams!heat_athletes_team_id_fkey(id, name, bib_number, level_id),
          athlete:athletes!heat_athletes_athlete_id_fkey(id, name, bib_number, level_id)
        `,
        )
        .eq('id', heatAthleteId)
        .single<HeatAthleteContext>();

      if (error || !context) {
        const message = `Heat assignment not found: ${error?.message ?? 'unknown'}`;
        this.store.setError(message);
        this.errorHandler?.handleError(new Error(message));
        this.store.setLoading(false);
        return;
      }

      const subjectId = context.team_id ?? context.athlete_id ?? '';
      const athleteHeat = this.buildAthleteHeat(context, subjectId);

      const movements = await this.movementRepo.findByHeat(context.heat_id);

      const isTeam = context.team_id !== null;
      const levelId = context.team?.level_id ?? context.athlete?.level_id ?? '';
      const wodId = context.heat.wod_id;

      const sessionData = loadScoreSession(heatAthleteId);
      const initialRecords = this.mergeRecordsWithMovements(
        sessionData?.records ?? [],
        movements,
        subjectId,
        context.heat_id,
        context.judge_id ?? '',
      );

      this.store.loadHeatData(
        athleteHeat,
        movements,
        initialRecords,
        undefined,
        sessionData?.currentMovementIndex,
        sessionData?.elapsedSeconds,
        heatAthleteId,
        wodId,
        levelId,
        isTeam,
      );
    } catch (err) {
      const message = `Failed to load heat data: ${String(err)}`;
      this.store.setError(message);
      this.errorHandler?.handleError(err);
      this.store.setLoading(false);
    }
  }

  private buildAthleteHeat(
    ctx: HeatAthleteContext,
    subjectId: string,
  ): AthleteHeat {
    const name = ctx.team?.name ?? ctx.athlete?.name ?? subjectId;
    const bib = ctx.team?.bib_number ?? ctx.athlete?.bib_number ?? '';
    return AthleteHeat.create({
      athleteId: subjectId,
      athleteName: name,
      bibNumber: bib,
      division: '',
      heatId: ctx.heat_id,
      heatName: ctx.heat.name,
      wodName: ctx.heat.wod?.name ?? '',
      wodType: ctx.heat.wod?.type ?? '',
      lane: ctx.lane ?? 0,
    });
  }

  private mergeRecordsWithMovements(
    entries: { movementId: string; count: number; confirmed: boolean }[],
    movements: { id: string }[],
    athleteId: string,
    heatId: string,
    judgeId: string,
  ): RepetitionRecord[] {
    const byMovementId = new Map(entries.map((e) => [e.movementId, e]));
    return movements.map((m) => {
      const entry = byMovementId.get(m.id);
      const id = `session-${m.id}`;
      if (entry) {
        return RepetitionRecord.create(id, {
          movementId: m.id,
          athleteId,
          heatId,
          count: RepetitionCount.create(entry.count),
          judgeId,
          confirmed: entry.confirmed,
          createdAt: new Date(),
        });
      }
      return RepetitionRecord.create(id, {
        movementId: m.id,
        athleteId,
        heatId,
        count: RepetitionCount.zero(),
        judgeId,
        confirmed: false,
        createdAt: new Date(),
      });
    });
  }

  /** Sets the repetition count for the current movement to an absolute value. */
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

  /** Increments the repetition count for the current movement by 1. */
  incrementRepetitionCount(): void {
    const current = this.currentRepetitionCount();
    const movement = this.currentMovement();
    if (!movement) return;
    this.store.updateRepetitionCount(movement.id, current.increment());
  }

  /** Decrements the repetition count for the current movement by 1 (floor: 0). */
  decrementRepetitionCount(): void {
    const current = this.currentRepetitionCount();
    const movement = this.currentMovement();
    if (!movement) return;
    this.store.updateRepetitionCount(movement.id, current.decrement());
  }

  /** Confirms the current repetition record, persists to sessionStorage, and navigates to the next movement. */
  async submitRepetitionCount(): Promise<void> {
    const movement = this.currentMovement();
    if (!movement) return;
    this.store.setSubmitting(true);

    try {
      this.store.confirmRepetitionRecord(movement.id);
      this.store.navigateNext();
      this.persistToSession();
    } catch {
      this.store.setError('Failed to submit repetition count');
    } finally {
      this.store.setSubmitting(false);
    }
  }

  private persistToSession(): void {
    const haId = this.store.heatAthleteId();
    if (!haId) return;
    const records = this.store.repetitionRecords();
    const entries = Array.from(records.values()).map((r) => ({
      movementId: r.movementId,
      count: r.count.value,
      confirmed: r.confirmed,
    }));
    saveScoreSession(haId, {
      records: entries,
      currentMovementIndex: this.store.currentMovementIndex(),
      elapsedSeconds: this.store.elapsedSeconds(),
    });
  }

  /** Navigates directly to the movement at the given 0-based index. */
  navigateToMovement(index: number): void {
    this.store.navigateToMovement(index);
  }

  /** Navigates to the next movement if available. */
  navigateNext(): void {
    this.store.navigateNext();
  }

  /** Navigates to the previous movement if available. */
  navigatePrevious(): void {
    this.store.navigatePrevious();
  }

  /** Records the elapsed time in the store so the summary page can read it. */
  recordElapsedTime(seconds: number): void {
    this.store.setElapsedSeconds(seconds);
  }

  /** Finalizes the score by persisting all records to Supabase, marking it submitted, and clearing sessionStorage. */
  async finalizeScore(signature: string): Promise<void> {
    const athleteHeat = this.store.athleteHeat();
    if (!athleteHeat) {
      this.store.setError('No athlete heat context');
      return;
    }

    this.store.setSubmitting(true);
    this.store.setError(null);

    try {
      const movementReps: Record<
        string,
        { reps: number; confirmed: boolean }
      > = {};
      for (const [movementId, record] of this.store.repetitionRecords()) {
        movementReps[movementId] = {
          reps: record.count.value,
          confirmed: record.confirmed,
        };
      }

      const { data: existing } = await this.supabase
        .from('scores')
        .select('id')
        .eq('heat_id', athleteHeat.heatId)
        .or(
          `athlete_id.eq.${athleteHeat.athleteId},team_id.eq.${athleteHeat.athleteId}`,
        )
        .maybeSingle<{ id: string }>();

      if (existing) {
        const { error } = await this.supabase
          .from('scores')
          .update({
            value: { movement_reps: movementReps, signature },
            status: 'submitted',
          })
          .eq('id', existing.id);

        if (error) throw error;
      } else {
        const isTeam = this.store.isTeam();
        const { error } = await this.supabase.from('scores').insert({
          heat_id: athleteHeat.heatId,
          wod_id: this.store.wodId()!,
          level_id: this.store.levelId()!,
          athlete_id: isTeam ? null : athleteHeat.athleteId,
          team_id: isTeam ? athleteHeat.athleteId : null,
          value: { movement_reps: movementReps, signature },
          status: 'submitted',
        });

        if (error) throw error;
      }

      clearScoreSession(this.store.heatAthleteId()!);
    } catch (err) {
      const message = `Failed to finalize score: ${extractErrorMessage(err)}`;
      this.store.setError(message);
      throw err;
    } finally {
      this.store.setSubmitting(false);
    }
  }
}

function extractErrorMessage(err: unknown): string {
  if (!err) return String(err);
  if (typeof err === 'string') return err;

  const errorObj = err as Record<string, unknown>;
  const nestedError = errorObj['error'];
  if (
    nestedError &&
    typeof nestedError === 'object' &&
    typeof (nestedError as Record<string, unknown>)['message'] === 'string'
  ) {
    return String((nestedError as Record<string, string>)['message']);
  }

  if (typeof errorObj['message'] === 'string') {
    return errorObj['message'];
  }

  return String(err);
}
