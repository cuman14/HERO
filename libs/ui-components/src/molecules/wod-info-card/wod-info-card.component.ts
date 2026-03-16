import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-wod-info-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      class="relative rounded-2xl overflow-hidden border border-slate-200 shadow-sm bg-white"
    >
      <div class="relative z-10 p-5">
        <div class="flex justify-between items-start mb-4">
          <div>
            <p
              class="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1"
            >
              CÓDIGO HEAT
            </p>
            <span
              class="text-primary font-mono text-2xl font-bold tracking-tight"
            >
              {{ heatCode() }}
            </span>
          </div>
          <div
            class="bg-primary/10 text-primary px-3 py-2 rounded-xl flex items-center justify-center"
          >
            <span class="text-xl font-bold text-primary">&#9096;</span>
          </div>
        </div>

        <h2 class="text-slate-900 text-xl font-extrabold mb-4">
          {{ wodName() }}
        </h2>

        <div class="flex items-center gap-6 pt-4 border-t border-slate-100">
          <div>
            <p class="text-[10px] font-bold uppercase text-slate-400 mb-0.5">
              Categoría
            </p>
            <p class="text-slate-700 font-bold text-sm">{{ category() }}</p>
          </div>
          <div>
            <p class="text-[10px] font-bold uppercase text-slate-400 mb-0.5">
              Inicio
            </p>
            <div class="flex items-center gap-1">
              <p class="text-primary font-bold text-sm">&#9201;</p>
              <p class="text-slate-700 font-bold text-sm">{{ startTime() }}</p>
            </div>
          </div>
          @if (timeCap()) {
            <div>
              <p class="text-[10px] font-bold uppercase text-slate-400 mb-0.5">
                Time Cap
              </p>
              <p class="text-slate-700 font-bold text-sm">{{ timeCap() }}</p>
            </div>
          }
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }
    `,
  ],
})
export class WodInfoCardComponent {
  heatCode = input.required<string>();
  wodName = input.required<string>();
  category = input.required<string>();
  startTime = input.required<string>();
  timeCap = input<string>('');
}
