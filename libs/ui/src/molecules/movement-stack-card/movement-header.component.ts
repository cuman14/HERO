import { Component, input, output } from '@angular/core';

@Component({
  selector: 'lib-movement-header',
  standalone: true,
  template: `
    <div class="flex items-center justify-center gap-2 absolute -top-10 left-1/2 -translate-x-1/2 z-[40]">
      <div class="flex items-center gap-1.5 bg-primary px-4 py-1.5 rounded-full shadow-lg shadow-primary/30 border border-white/20">
        <span class="material-symbols-outlined text-white text-[16px]">timer</span>
        <span class="text-white font-black text-sm tabular-nums tracking-wider">{{ timerDisplay() }}</span>
      </div>

      @if (showToggle()) {
        <button
          type="button"
          [attr.aria-expanded]="expanded()"
          [attr.aria-controls]="'completedList'"
          (click)="toggleExpanded.emit()"
          (keydown)="onKeydown($event)"
          class="h-12 w-12 rounded-full bg-slate-50 border border-slate-200 hover:bg-slate-100 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 transition-colors flex items-center justify-center shrink-0"
          aria-label="Toggle completed movements list"
        >
          <span
            class="material-symbols-outlined text-slate-500 text-lg transition-transform duration-200 ease-out"
            [class.rotate-180]="expanded()"
          >expand_more</span>
        </button>
      }
    </div>
  `,
})
export class MovementHeaderComponent {
  timerDisplay = input.required<string>();
  showToggle = input.required<boolean>();
  expanded = input.required<boolean>();
  readonly toggleExpanded = output<void>();

  onKeydown(event: KeyboardEvent): void {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      this.toggleExpanded.emit();
    }
  }
}
