import { Component, input, output } from '@angular/core';
import { LucideIconComponent } from '../../icons/lucide-icon.component';

@Component({
  selector: 'lib-numeric-keypad',
  standalone: true,
  imports: [LucideIconComponent],
  template: `
    <div class="fixed bottom-0 left-0 w-full bg-background/80 backdrop-blur-md z-50 px-6 pt-2 pb-10">
      <div class="max-w-[280px] mx-auto grid grid-cols-3 gap-y-4 gap-x-6">
        @for (key of keys; track key.value) {
          @if (key.type === 'digit') {
            <button
              class="keypad-btn w-16 h-16 mx-auto rounded-full bg-slate-200/60 flex flex-col items-center justify-center transition-all active:scale-[0.92] active:bg-slate-300"
              (click)="digitPressed.emit(key.value)"
              [attr.aria-label]="key.value"
            >
              <span class="text-2xl font-semibold text-slate-900 leading-none">{{ key.value }}</span>
              @if (key.label) {
                <span class="text-[8px] font-bold text-slate-500 tracking-widest uppercase">{{ key.label }}</span>
              } @else {
                <span class="text-[8px] opacity-0"> </span>
              }
            </button>
          } @else if (key.type === 'complete') {
            <button
              class="keypad-btn col-span-2 w-full h-16 rounded-full bg-emerald-500 flex flex-col items-center justify-center transition-all shadow-lg shadow-emerald-500/40 active:scale-[0.95]"
              (click)="completePressed.emit(targetReps())"
              aria-label="Complete"
            >
              <span class="text-[9px] font-bold text-white leading-none">COMPLETE</span>
              <span class="text-lg font-black text-white leading-tight">{{ targetReps() }}</span>
            </button>
          } @else if (key.type === 'confirm') {
            <button
              class="keypad-btn w-16 h-16 mx-auto rounded-full bg-primary flex items-center justify-center transition-all shadow-lg shadow-primary/40 active:scale-[0.95]"
              (click)="confirmPressed.emit()"
              aria-label="Confirm"
            >
              <lib-icon name="check" iconClass="w-7 h-7 text-white" />
            </button>
          }
        }
      </div>
    </div>
  `,
  styles: [
    `
      :host { display: block; }
    `,
  ],
})
export class NumericKeypadComponent {
  digitPressed = output<string>();
  confirmPressed = output<void>();
  completePressed = output<number>();

  targetReps = input(0);

  readonly keys: { value: string; label?: string; type: 'digit' | 'confirm' | 'complete' }[] = [
    { value: '1', type: 'digit' },
    { value: '2', label: 'abc', type: 'digit' },
    { value: '3', label: 'def', type: 'digit' },
    { value: '4', label: 'ghi', type: 'digit' },
    { value: '5', label: 'jkl', type: 'digit' },
    { value: '6', label: 'mno', type: 'digit' },
    { value: '7', label: 'pqrs', type: 'digit' },
    { value: '8', label: 'tuv', type: 'digit' },
    { value: '9', label: 'wxyz', type: 'digit' },
    { value: 'complete', type: 'complete' },
    { value: 'confirm', type: 'confirm' },
  ];
}
