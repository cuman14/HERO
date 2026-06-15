import { ChangeDetectionStrategy, Component, input } from '@angular/core';
import { MovementSummaryItem } from '../../../domain/movement-summary-item.model';

@Component({
  selector: 'lib-round-breakdown-list',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="bg-white rounded-2xl p-5 shadow-[0_1px_3px_0_rgba(0,0,0,0.08)] border border-slate-100"
    >
      <h4
        class="text-slate-400 text-[10px] font-black uppercase tracking-[0.18em] mb-3"
      >
        {{ heading() }}
      </h4>
      <div class="space-y-1">
        @for (item of items(); track item.movementId) {
          <div
            class="flex justify-between items-center py-2 border-b border-slate-50 last:border-0"
          >
            <span class="text-slate-600 font-medium">{{ item.roundLabel || item.name }}</span>
            <span class="font-bold tabular-nums text-slate-900">
              {{ item.confirmedRepetitions }} / {{ item.targetRepetitions }}
            </span>
          </div>
        }
      </div>
    </div>
  `,
})
export class RoundBreakdownListComponent {
  heading = input<string>('Desglose por Rondas');
  items = input.required<MovementSummaryItem[]>();
}
