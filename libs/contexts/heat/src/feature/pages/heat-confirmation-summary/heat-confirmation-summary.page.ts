import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  input,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import { ButtonComponent } from '@hero/ui';
import {
  type HeatConfirmationAthlete,
  type HeatConfirmationHeat,
} from '../../../domain/heat-confirmation.model';
import { type HeatConfirmationPayload } from '../../../infrastructure/heat.repository';
import { type HeatConfirmationSummaryData } from '../../resolvers/heat-confirmation-summary.resolver';

@Component({
  selector: 'app-heat-confirmation-summary',
  standalone: true,
  imports: [CommonModule, ButtonComponent],
  templateUrl: './heat-confirmation-summary.page.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  styles: [
    `
      :host {
        display: block;
        height: 100dvh;
      }
    `,
  ],
})
export class HeatConfirmationSummaryPage {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  // Resolver data input - bound via withComponentInputBinding
  readonly data = input<HeatConfirmationSummaryData>();

  readonly heatPayload = signal<HeatConfirmationPayload | null>(null);
  readonly selectedAthleteId = signal<string | null>(null);
  readonly isConfirming = signal<boolean>(false);

  // Mock movements data - not available in database yet
  readonly movements = signal<string[]>(['Thrusters', 'Pull-ups']);

  readonly heat = computed<HeatConfirmationHeat | null>(
    () => this.heatPayload()?.heat ?? null,
  );
  readonly athlete = computed<HeatConfirmationAthlete | null>(() => {
    const payload = this.heatPayload();
    const id = this.selectedAthleteId();
    if (!payload || !id) return null;
    return payload.athletes.find((a) => a.id === id) ?? null;
  });

  constructor() {
    // Sync input data to signals when resolver data changes
    effect(() => {
      const resolvedData = this.data();
      if (resolvedData?.heatPayload && resolvedData?.selectedAthleteId) {
        this.heatPayload.set(resolvedData.heatPayload);
        this.selectedAthleteId.set(resolvedData.selectedAthleteId);
      } else {
        // Redirect if no data available
        this.router.navigate(['/heat-access'], { replaceUrl: true });
      }
    });
  }

  onConfirm(): void {
    if (!this.athlete() || !this.heat()) return;
    this.isConfirming.set(true);
    this.router.navigate(['/scoring']);
  }

  onBack(): void {
    this.location.back();
  }
}
