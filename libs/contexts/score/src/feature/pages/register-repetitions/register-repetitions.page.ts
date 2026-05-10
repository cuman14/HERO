import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  MovementStackCardComponent,
  MovementStackItem,
  NumericKeypadComponent,
} from '@hero/ui';
import { RegisterRepetitionsFacade } from '../../../application/register-repetitions.facade';
import { InputBufferStrategy } from './input-buffer.strategy';
import { mapMovementToStackItem } from './movement-stack-item.mapper';

@Component({
  selector: 'app-register-repetitions-page',
  standalone: true,
  imports: [CommonModule, MovementStackCardComponent, NumericKeypadComponent],
  templateUrl: './register-repetitions.page.html',
  styleUrl: './register-repetitions.page.css',
  providers: [InputBufferStrategy],
})
export class RegisterRepetitionsPage implements OnInit, OnDestroy {
  @Input() heatAthleteId?: string;
  protected readonly facade = inject(RegisterRepetitionsFacade);
  private readonly inputBuffer = inject(InputBufferStrategy);

  protected readonly elapsedSeconds = signal(0);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  protected readonly stackItems = computed<MovementStackItem[]>(() => {
    const movements = this.facade.movements();
    const activeMovementIndex = this.facade.currentMovementIndex();
    const currentRepsValue = this.facade.currentRepetitionCount().value;
    return movements.map((movement, movementIndex) =>
      mapMovementToStackItem(
        movement,
        movementIndex,
        activeMovementIndex,
        currentRepsValue,
      ),
    );
  });

  protected readonly upcomingItems = computed(() =>
    this.stackItems().filter((item) => item.status === 'upcoming'),
  );

  ngOnInit(): void {
    this.facade.loadHeat(this.heatAthleteId);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds.update((seconds) => seconds + 1);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  onDigit(digit: string): void {
    const maxReps = this.facade.currentMovement()?.targetReps ?? Infinity;
    const parsedValue = this.inputBuffer.appendDigit(digit, maxReps);
    if (parsedValue !== null) this.facade.updateRepetitionCount(parsedValue);
  }

  onBackspace(): void {
    const parsedValue = this.inputBuffer.removeLastDigit();
    this.facade.updateRepetitionCount(parsedValue);
  }

  onConfirm(): void {
    this.facade.submitRepetitionCount();
    this.inputBuffer.reset();
  }
}
