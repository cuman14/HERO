import { Score } from '../entities/score.entity';
import { IScoreRepository } from '../repositories/score.repository';
import { ScoreValue } from '../value-objects/score-value.vo';

export interface SubmitScoreCommand {
  wodId: string;
  athleteId: string;
  judgeId: string;
  value: { reps: number };
  penaltyReps: number;
}

/**
 * SubmitScoreUseCase
 *
 * One class, one responsibility, easy to test.
 * Only depends on domain interfaces (ports), never on infra.
 */
export class SubmitScoreUseCase {
  constructor(private readonly scoreRepo: IScoreRepository) {}

  async execute(command: SubmitScoreCommand): Promise<Score> {
    // Check for duplicate
    const existing = await this.scoreRepo.findByWodAndAthlete(
      command.wodId,
      command.athleteId,
    );
    if (existing) {
      throw new Error('Score already submitted for this athlete and WOD');
    }

    const scoreValue = ScoreValue.fromReps(command.value.reps);

    const score = Score.create(crypto.randomUUID(), {
      wodId: command.wodId,
      athleteId: command.athleteId,
      judgeId: command.judgeId,
      value: scoreValue,
      penaltyReps: command.penaltyReps,
      confirmed: false,
      createdAt: new Date(),
    });

    return this.scoreRepo.save(score);
  }
}
