import { ActivatedRoute } from '@angular/router';
import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { LucideIconComponent } from '@hero/ui';
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
    LucideIconComponent,
    ResultHeroComponent,
    RoundBreakdownListComponent,
    SignaturePadComponent,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './summary.page.html',
})
export class SummaryPage implements OnInit {
  protected readonly facade = inject(RegisterRepetitionsFacade);
  private readonly errorHandler = injectScoreErrorHandler();
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);

  protected readonly captured = signal<string | null>(null);

  protected readonly isReadOnly = signal(false);
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

  private get heatAthleteId(): string | undefined {
    return this.route.snapshot.params['heatAthleteId'] ?? undefined;
  }

  ngOnInit(): void {
    const id = this.heatAthleteId;
    const isReadOnlyFlow =
      this.route.snapshot.queryParams['readonly'] === 'true';

    if (!id) {
      void this.router.navigate(['/heat-access']);
      return;
    }

    this.isReadOnly.set(isReadOnlyFlow);

    if (!this.facade.athleteHeat()) {
      this.facade.loadHeat(id);
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
    if (this.isReadOnly()) {
      void this.router.navigate(['/scoring', this.heatAthleteId]);
    } else {
      this.location.back();
    }
  }

  onBack(): void {
    const heatCode = this.facade.athleteHeat()?.heatName;
    void this.router.navigate(['/heat-confirmation'], {
      queryParams: heatCode ? { heatCode } : undefined,
    });
  }
}
