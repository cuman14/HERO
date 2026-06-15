import { computed, inject, Injectable, OnDestroy } from '@angular/core';
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
  athlete: { id: string; name: string; bib_number: string | null } | null;
}

interface ScoreRow {
  id: string;
  value: Record<string, unknown> | null;
}

@Injectable()
export class RegisterRepetitionsFacade implements OnDestroy {
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

  private unsubscribeRealtime: (() => void) | null = null;

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
          athlete:athletes!heat_athletes_athlete_id_fkey(id, name, bib_number)
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

      const [movements, existingRecords, scoreId] = await Promise.all([
        this.movementRepo.findByHeat(context.heat_id),
        this.repRecordRepo.findByHeatAndAthlete(context.heat_id, subjectId),
        this.findOrCreateScore(context, subjectId),
      ]);

      const initialRecords = this.mergeRecordsWithMovements(
        existingRecords,
        movements,
        subjectId,
        context.heat_id,
        context.judge_id ?? '',
        scoreId,
      );

      this.store.loadHeatData(athleteHeat, movements, initialRecords, scoreId);

      this.unsubscribeRealtime?.();
      this.unsubscribeRealtime = this.repRecordRepo.subscribe(
        context.heat_id,
        subjectId,
        (updated) =>
          this.store.loadHeatData(athleteHeat, movements, updated, scoreId),
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

  private async findOrCreateScore(
    ctx: HeatAthleteContext,
    subjectId: string,
  ): Promise<string> {
    const { data: existing } = await this.supabase
      .from('scores')
      .select('id, value')
      .eq('heat_id', ctx.heat_id)
      .or(`athlete_id.eq.${subjectId},team_id.eq.${subjectId}`)
      .maybeSingle<ScoreRow>();

    if (existing) return existing.id;

    const levelId = ctx.team?.level_id ?? '';
    const isTeam = !!ctx.team_id;

    const { data: created, error } = await this.supabase
      .from('scores')
      .insert({
        heat_id: ctx.heat_id,
        ...(isTeam ? { team_id: subjectId } : { athlete_id: subjectId }),
        wod_id: ctx.heat.wod_id,
        level_id: levelId,
        judge_id: ctx.judge_id,
        value: { movement_reps: {} },
        status: 'draft',
      })
      .select('id')
      .single<{ id: string }>();

    if (error || !created)
      throw new Error(`Cannot create score: ${error?.message}`);
    return created.id;
  }

  private mergeRecordsWithMovements(
    existing: RepetitionRecord[],
    movements: { id: string }[],
    athleteId: string,
    heatId: string,
    judgeId: string,
    scoreId: string,
  ): RepetitionRecord[] {
    const byMovementId = new Map(existing.map((r) => [r.movementId, r]));
    return movements.map(
      (m) =>
        byMovementId.get(m.id) ??
        RepetitionRecord.create(`${scoreId}-${m.id}`, {
          movementId: m.id,
          athleteId,
          heatId,
          count: RepetitionCount.zero(),
          judgeId,
          confirmed: false,
          createdAt: new Date(),
        }),
    );
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

  /** Confirms the current repetition record, persists via repository, and navigates to the next movement. */
  submitRepetitionCount(): void {
    const movement = this.currentMovement();
    if (!movement) return;
    this.store.setSubmitting(true);

    const record = this.store.currentRepetitionRecord();
    const scoreId = this.store.scoreId();

    if (!record || !scoreId) {
      const error = new Error('Cannot submit repetition: missing score context');
      this.store.setError(error.message);
      this.errorHandler?.handleError(error);
      this.store.setSubmitting(false);
      return;
    }

    this.repRecordRepo
      .save(record.confirm(), scoreId)
      .then(() => {
        this.store.confirmRepetitionRecord(movement.id);
        this.store.navigateNext();
      })
      .catch((err) => {
        const message = extractErrorMessage(err);
        this.store.setError(message);
        this.errorHandler?.handleError(err);
      })
      .finally(() => {
        this.store.setSubmitting(false);
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

  /** Finalizes the score by marking it submitted in Supabase and stores the athlete signature. */
  async finalizeScore(signature: string): Promise<void> {
    const scoreId = this.store.scoreId();
    if (!scoreId) {
      this.store.setError('No score to finalize');
      return;
    }

    this.store.setSubmitting(true);
    this.store.setError(null);

    try {
      const { error } = await this.supabase
        .from('scores')
        .update({ status: 'submitted', value: { signature } })
        .eq('id', scoreId);

      if (error) throw error;
      this.unsubscribeRealtime?.();
    } catch (err) {
      const message = `Failed to finalize score: ${extractErrorMessage(err)}`;
      this.store.setError(message);
      throw err;
    } finally {
      this.store.setSubmitting(false);
    }
  }

  ngOnDestroy(): void {
    this.unsubscribeRealtime?.();
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
