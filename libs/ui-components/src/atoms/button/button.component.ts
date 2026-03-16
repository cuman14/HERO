import { Component, computed, input, output } from '@angular/core';
import { HeroIconComponent } from '../../icons/hero-icon.component';

@Component({
  selector: 'lib-button',
  standalone: true,
  imports: [HeroIconComponent],
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="clicked.emit()"
    >
      @if (loading()) {
        <lib-icon name="arrow-path" iconClass="w-5 h-5 animate-spin" />
      }
      <ng-content />
    </button>
  `,
})
export class ButtonComponent {
  // Signal inputs — Angular 21
  variant = input<'primary' | 'ghost' | 'danger'>('primary');
  size = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  loading = input(false);

  // Signal output
  clicked = output();

  // Computed — Tailwind classes reactivas
  buttonClasses = computed(() => {
    const base =
      'w-[inherit] inline-flex items-center justify-center gap-2 rounded-2xl font-bold transition-all duration-150 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed';

    const variants = {
      primary:
        'bg-primary text-white shadow-lg shadow-primary/25 hover:brightness-110',
      ghost:
        'bg-transparent text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 border-2 border-slate-200 dark:border-slate-700',
      danger:
        'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-600/25',
    };

    const sizes = {
      sm: 'px-4 py-2 text-sm',
      md: 'px-6 py-4 text-base',
      lg: 'px-8 py-5 text-lg',
    };

    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  });
}
