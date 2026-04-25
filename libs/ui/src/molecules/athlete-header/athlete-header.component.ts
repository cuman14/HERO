import { Component, input } from '@angular/core';

@Component({
  selector: 'lib-athlete-header',
  standalone: true,
  template: `
    <div class="bg-white border-b-2 border-slate-200 p-6">
      <h1 class="text-3xl font-black text-slate-900 mb-1">
        {{ athleteName() }}
      </h1>
      <div class="flex items-center gap-4 text-slate-600 font-semibold">
        <span>Bib #{{ bibNumber() }}</span>
        <span>•</span>
        <span>{{ division() }}</span>
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
export class AthleteHeaderComponent {
  athleteName = input.required<string>();
  bibNumber = input.required<string>();
  division = input.required<string>();
}
