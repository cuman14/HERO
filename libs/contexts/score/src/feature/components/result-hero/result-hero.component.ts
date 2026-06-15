import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';

@Component({
  selector: 'lib-result-hero',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <div
      class="flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-primary/5 border-2 border-primary/20 text-center"
    >
      <p
        class="text-primary text-xs font-black uppercase tracking-widest leading-none"
      >
        {{ label() }}
      </p>
      <p
        class="text-primary font-mono text-5xl font-bold leading-none tabular-nums py-2"
      >
        {{ value() }} {{ unit() }}
      </p>
      @if (timeCap()) {
        <div class="flex items-center gap-2 text-primary/70 text-sm font-medium">
          <svg
            class="w-4 h-4"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="13" r="8" />
            <path d="M12 9v4l2 2" />
            <path d="M9 2h6" />
          </svg>
          <span>{{ timeCap() }} Time Cap</span>
        </div>
      }
    </div>
  `,
})
export class ResultHeroComponent {
  label = input<string>('Resultado Final');
  value = input.required<number>();
  unit = input<string>('REPS');
  timeCap = input<string>('');

  readonly displayValue = computed(() => this.value().toString());
}
