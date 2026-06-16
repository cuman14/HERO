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
import { ActivatedRoute, Router } from '@angular/router';
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
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

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
    const heatAthleteId = this.heatAthleteId;
    if (!heatAthleteId) {
      void this.router.navigate(['/heat-access']);
      return;
    }
    this.facade.loadHeat(heatAthleteId);
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds.update((seconds) => seconds + 1);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  onDigit(digit: string): void {
    const parsedValue = this.inputBuffer.appendDigit(digit, 999);
    if (parsedValue !== null) this.facade.updateRepetitionCount(parsedValue);
  }

  onBackspace(): void {
    const parsedValue = this.inputBuffer.removeLastDigit();
    this.facade.updateRepetitionCount(parsedValue);
  }

  onBack(): void {
    void this.router.navigate(['/heat-confirmation']);
  }

  onConfirm(): void {
    this.facade.submitRepetitionCount();
    this.inputBuffer.reset();
    if (!this.facade.canNavigateNext()) {
      this.facade.recordElapsedTime(this.elapsedSeconds());
      void this.router.navigate(['summary'], { relativeTo: this.route });
    }
  }
}
