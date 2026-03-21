import { CommonModule, Location } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { Router } from '@angular/router';
import {
  AthleteCardComponent,
  ButtonComponent,
  WodInfoCardComponent,
} from '@hero/ui';
import {
  type HeatConfirmationAthlete,
  type HeatConfirmationHeat,
} from '../../../domain/heat-confirmation.model';
import { type HeatConfirmationPayload } from '../../../infrastructure/heat.repository';

@Component({
  selector: 'app-heat-confirmation-summary',
  standalone: true,
  imports: [
    CommonModule,
    AthleteCardComponent,
    ButtonComponent,
    WodInfoCardComponent,
  ],
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
export class HeatConfirmationSummaryPage implements OnInit {
  private readonly router = inject(Router);
  private readonly location = inject(Location);

  readonly heatPayload = signal<HeatConfirmationPayload | null>(null);
  readonly selectedAthleteId = signal<string | null>(null);
  readonly isConfirming = signal<boolean>(false);

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
    // Retrieve state passed during navigation
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as {
      heatPayload?: HeatConfirmationPayload;
      selectedAthleteId?: string;
    };

    if (state?.heatPayload && state?.selectedAthleteId) {
      this.heatPayload.set(state.heatPayload);
      this.selectedAthleteId.set(state.selectedAthleteId);
    } else {
      // Fallback to history state if accessing directly or via refresh
      const historyState = this.location.getState() as {
        heatPayload?: HeatConfirmationPayload;
        selectedAthleteId?: string;
      } | null;
      if (historyState?.heatPayload && historyState?.selectedAthleteId) {
        this.heatPayload.set(historyState.heatPayload);
        this.selectedAthleteId.set(historyState.selectedAthleteId);
      }
    }
  }

  ngOnInit(): void {
    if (!this.heatPayload() || !this.selectedAthleteId()) {
      this.router.navigate(['/heat-access'], { replaceUrl: true });
    }
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
