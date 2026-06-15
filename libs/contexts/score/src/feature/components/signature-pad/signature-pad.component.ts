import {
  ChangeDetectionStrategy,
  Component,
  ElementRef,
  output,
  signal,
  viewChild,
} from '@angular/core';

@Component({
  selector: 'lib-signature-pad',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div class="flex flex-col gap-2 pt-2">
      <label
        class="text-slate-500 text-[10px] font-black uppercase tracking-[0.18em] px-1"
      >
        Firma del Atleta
      </label>
      <div
        #pad
        class="w-full h-32 rounded-2xl border-2 border-dashed border-slate-200 bg-white flex items-center justify-center relative overflow-hidden cursor-pointer active:bg-slate-50 transition-colors"
        role="button"
        tabindex="0"
        (click)="capture()"
        (keyup.enter)="capture()"
        (keyup.space)="capture()"
        [attr.aria-label]="'Capturar firma del atleta'"
      >
        <div
          class="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none"
          aria-hidden="true"
        >
          <svg
            class="w-16 h-16 text-slate-500"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.5"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <path
              d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 011.13-1.897L16.863 4.487zm0 0L19.5 7.125"
            />
          </svg>
        </div>
        @if (!signed()) {
          <span
            class="absolute bottom-4 left-1/2 -translate-x-1/2 w-3/4 h-px bg-slate-200"
            aria-hidden="true"
          ></span>
        } @else {
          <span
            class="text-slate-700 font-semibold text-sm relative z-10 px-3 py-1 rounded-full bg-white/80"
            >✓ Firma capturada</span
          >
        }
      </div>
    </div>
  `,
})
export class SignaturePadComponent {
  private readonly pad = viewChild<ElementRef<HTMLDivElement>>('pad');

  captured = output<string>();

  protected readonly signed = signal(false);

  capture(): void {
    if (this.signed()) return;
    this.signed.set(true);
    const stamp = new Date().toISOString();
    this.captured.emit(`signature-${stamp}`);
  }

  reset(): void {
    this.signed.set(false);
  }

  hasSignature(): boolean {
    return this.signed();
  }
}
