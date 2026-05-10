import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-movement-card',
  standalone: true,
  template: `
    <div class="p-6 rounded-3xl bg-white border-2 border-slate-200 shadow-sm">
      <h3 class="text-2xl font-black text-slate-900 mb-2">
        {{ name() }}
      </h3>
      <p class="text-sm text-slate-600 font-medium">
        {{ description() }}
      </p>
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
export class MovementCardComponent {
  name = input.required<string>();
  description = input.required<string>();
}
