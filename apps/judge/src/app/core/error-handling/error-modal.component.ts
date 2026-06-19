import {
  ChangeDetectionStrategy,
  Component,
  input,
  output,
} from '@angular/core';

/**
 * Dumb modal component for displaying application errors.
 *
 * The parent controls visibility and content via signals; this component only
 * renders them and emits the primary action.
 */
@Component({
  selector: 'app-error-modal',
  standalone: true,
  imports: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    @if (visible()) {
      <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
        role="dialog"
        aria-modal="true"
        [attr.aria-label]="title()"
      >
        <div
          class="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl"
        >
          <h3 class="text-lg font-bold text-slate-900">
            {{ title() }}
          </h3>
          <p class="mt-2 text-base text-slate-600">
            {{ message() }}
          </p>
          <button
            type="button"
            (click)="action.emit()"
            class="mt-6 w-full rounded-xl bg-primary py-3 text-center font-bold text-white transition-colors hover:bg-primary/90 active:scale-[0.98]"
          >
            {{ actionLabel() }}
          </button>
        </div>
      </div>
    }
  `,
})
export class ErrorModalComponent {
  visible = input.required<boolean>();
  title = input.required<string>();
  message = input.required<string>();
  actionLabel = input.required<string>();
  action = output<void>();
}
