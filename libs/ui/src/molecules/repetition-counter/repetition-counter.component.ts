import { Component, computed, input, output } from '@angular/core';

export type RepetitionCounterState = 'idle' | 'unsaved' | 'saved' | 'loading';

@Component({
  selector: 'lib-repetition-counter',
  standalone: true,
  template: `
    <div class="flex flex-col items-center gap-4">
      <div class="flex items-center gap-6">
        <button
          type="button"
          [class]="decrementButtonClasses()"
          [disabled]="disabled() || count() === 0"
          (click)="decremented.emit()"
          aria-label="Decrement repetition count"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-7 h-7"
          >
            <path
              fill-rule="evenodd"
              d="M4.25 12a.75.75 0 0 1 .75-.75h14a.75.75 0 0 1 0 1.5H5a.75.75 0 0 1-.75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>

        <div
          [class]="countDisplayClasses()"
          tabindex="0"
          role="button"
          (click)="onCountDisplayClick()"
          (keyup.enter)="onCountDisplayClick()"
        >
          @if (isEditing()) {
            <input
              #inputElement
              type="number"
              [value]="count()"
              min="0"
              class="w-24 text-center text-5xl font-black bg-transparent outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              (blur)="onInputBlur($event)"
              (keydown.enter)="onInputBlur($event)"
            />
          } @else {
            <span class="text-5xl font-black tabular-nums select-none">
              {{ count() }}
            </span>
          }
        </div>

        <button
          type="button"
          [class]="incrementButtonClasses()"
          [disabled]="disabled()"
          (click)="incremented.emit()"
          aria-label="Increment repetition count"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            class="w-7 h-7"
          >
            <path
              fill-rule="evenodd"
              d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
              clip-rule="evenodd"
            />
          </svg>
        </button>
      </div>

      @if (state() === 'unsaved') {
        <span class="text-xs font-semibold text-amber-600"
          >Unsaved changes</span
        >
      }
      @if (state() === 'saved') {
        <span class="text-xs font-semibold text-emerald-600">Saved</span>
      }
      @if (state() === 'loading') {
        <span class="text-xs font-semibold text-slate-400">Saving...</span>
      }
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
export class RepetitionCounterComponent {
  count = input.required<number>();
  state = input<RepetitionCounterState>('idle');
  disabled = input<boolean>(false);

  incremented = output();
  decremented = output();
  countChanged = output<number>();

  isEditing = input<boolean>(false);
  editingStarted = output();

  private readonly buttonBase =
    'flex items-center justify-center w-14 h-14 rounded-full transition-all active:scale-[0.92] disabled:opacity-30 disabled:cursor-not-allowed';

  decrementButtonClasses = computed(() => {
    return `${this.buttonBase} bg-slate-100 text-slate-700 hover:bg-slate-200 shadow-sm`;
  });

  incrementButtonClasses = computed(() => {
    return `${this.buttonBase} bg-primary/10 text-primary hover:bg-primary/20 shadow-sm`;
  });

  countDisplayClasses = computed(() => {
    const base =
      'flex items-center justify-center w-32 h-32 rounded-3xl cursor-text transition-all';
    const stateClasses: Record<RepetitionCounterState, string> = {
      idle: 'bg-white border-2 border-slate-200 text-slate-900',
      unsaved: 'bg-amber-50 border-2 border-amber-400 text-amber-900',
      saved: 'bg-emerald-50 border-2 border-emerald-400 text-emerald-900',
      loading: 'bg-slate-50 border-2 border-slate-300 text-slate-400',
    };
    return `${base} ${stateClasses[this.state()]}`;
  });

  onCountDisplayClick(): void {
    if (!this.disabled()) {
      this.editingStarted.emit();
    }
  }

  onInputBlur(event: Event): void {
    const target = event.target as HTMLInputElement;
    const value = parseInt(target.value, 10);
    if (!isNaN(value) && value >= 0) {
      this.countChanged.emit(value);
    }
  }
}
