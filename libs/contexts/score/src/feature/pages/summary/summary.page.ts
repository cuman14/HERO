import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Input,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { HeroIconComponent } from '@hero/ui';
import { injectScoreErrorHandler } from '@hero/core';
import { RegisterRepetitionsFacade } from '../../../application/register-repetitions.facade';
import { ResultHeroComponent } from '../../components/result-hero/result-hero.component';
import { RoundBreakdownListComponent } from '../../components/round-breakdown-list/round-breakdown-list.component';
import { SignaturePadComponent } from '../../components/signature-pad/signature-pad.component';

@Component({
  selector: 'app-summary-page',
  standalone: true,
  imports: [
    CommonModule,
    HeroIconComponent,
    ResultHeroComponent,
    RoundBreakdownListComponent,
    SignaturePadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './summary.page.html',
})
export class SummaryPage implements OnInit {
  @Input() heatAthleteId?: string;

  protected readonly facade = inject(RegisterRepetitionsFacade);
  private readonly errorHandler = injectScoreErrorHandler();
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  protected readonly captured = signal<string | null>(null);

  protected readonly canSubmit = computed(
    () => !!this.captured() && !this.facade.isSubmitting(),
  );

  protected readonly formattedElapsedTime = computed(() => {
    const total = this.facade.elapsedSeconds();
    const minutes = Math.floor(total / 60)
      .toString()
      .padStart(2, '0');
    const seconds = (total % 60).toString().padStart(2, '0');
    return `${minutes}:${seconds}`;
  });

  ngOnInit(): void {
    if (!this.facade.athleteHeat()) {
      void this.router.navigate(['/heat-access']);
    }
  }

  onSignature(value: string): void {
    this.captured.set(value);
  }

  async onSubmit(): Promise<void> {
    const signature = this.captured();
    if (!signature) return;

    try {
      await this.facade.finalizeScore(signature);
      const heatCode = this.facade.athleteHeat()?.heatName;
      void this.router.navigate(['/heat-confirmation'], {
        queryParams: { heatCode },
      });
    } catch (err) {
      this.errorHandler?.handleError(err);
    }
  }

  onEdit(): void {
    this.location.back();
  }
}
