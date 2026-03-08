import { Component, computed, input, output } from '@angular/core';
import { HeroIconComponent } from '../../icons/hero-icon.component';

@Component({
  selector: 'ui-button',
  standalone: true,
  imports: [HeroIconComponent],
  template: `
    <button
      [class]="buttonClasses()"
      [disabled]="disabled() || loading()"
      (click)="clicked.emit()"
    >
      @if (loading()) {
        <ui-icon name="arrow-path" class="animate-spin w-4 h-4" />
      }
      <ng-content />
    </button>
  `
})
export class ButtonComponent {
  // Signal inputs — Angular 21
  variant = input<'primary' | 'ghost' | 'danger'>('primary');
  size     = input<'sm' | 'md' | 'lg'>('md');
  disabled = input(false);
  loading  = input(false);

  // Signal output
  clicked = output();

  // Computed — Tailwind classes reactivas
  buttonClasses = computed(() => {
    const base = 'inline-flex items-center justify-center gap-2 rounded-button font-semibold transition-all duration-150';
    
    // Default to admin-primary, could be customized per app or injected
    const variants = {
      primary: 'bg-admin-primary text-white hover:brightness-110 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
      ghost:   'bg-transparent text-slate-300 hover:bg-slate-800 border border-slate-700 disabled:opacity-40 disabled:cursor-not-allowed',
      danger:  'bg-red-600 text-white hover:bg-red-700 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed',
    };
    
    const sizes = {
      sm: 'px-3 py-1.5 text-sm',
      md: 'px-4 py-2 text-sm',
      lg: 'px-6 py-3 text-base',
    };
    
    return `${base} ${variants[this.variant()]} ${sizes[this.size()]}`;
  });
}
