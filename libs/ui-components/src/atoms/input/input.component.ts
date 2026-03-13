import { Component, computed, input, output } from '@angular/core';
import { HeroIconComponent, IconName } from '../../icons/hero-icon.component';

@Component({
  selector: 'lib-input',
  standalone: true,
  imports: [HeroIconComponent],
  template: `
    <div class="flex flex-col gap-2">
      @if (label()) {
        <label 
          [for]="id()" 
          class="text-xs font-bold uppercase tracking-widest ml-1"
          [class.text-primary]="status() === 'active'"
          [class.text-slate-400]="status() === 'neutral'"
          [class.text-slate-500]="status() === 'disabled'"
        >
          {{ label() }}
        </label>
      }
      <div class="relative group">
        <input
          [id]="id()"
          [type]="type()"
          [value]="value()"
          [placeholder]="placeholder()"
          [readOnly]="readOnly()"
          [class]="inputClasses()"
          (input)="handleInput($event)"
        />
        @if (icon(); as iconName) {
          <div class="absolute right-4 top-1/2 -translate-y-1/2">
            <lib-icon [name]="iconName" [iconClass]="iconClasses()" [variant]="status() === 'success' ? 'solid' : 'outline'" />
          </div>
        }
      </div>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      width: 100%;
    }
  `]
})
export class InputComponent {
  id = input.required<string>();
  label = input<string>('');
  placeholder = input<string>('');
  value = input<string>('');
  type = input<string>('text');
  readOnly = input<boolean>(false);
  icon = input<IconName | null>(null);
  status = input<'neutral' | 'active' | 'success' | 'disabled'>('neutral');

  valueChange = output<string>();

  inputClasses = computed(() => {
    const base = 'w-full h-20 text-2xl font-semibold text-center rounded-2xl transition-all shadow-sm border-2';
    
    const statuses = {
      neutral: 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder:text-slate-300 dark:placeholder:text-slate-600',
      active: 'bg-white dark:bg-slate-800 border-primary ring-4 ring-primary/10 text-slate-900 dark:text-white',
      success: 'bg-slate-100 dark:bg-slate-800/40 border-transparent text-slate-900 dark:text-white shadow-inner',
      disabled: 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800 text-slate-400 cursor-not-allowed opacity-70'
    };

    return `${base} ${statuses[this.status()]}`;
  });

  iconClasses = computed(() => {
    const statuses = {
      neutral: 'text-slate-400',
      active: 'text-primary',
      success: 'text-emerald-500',
      disabled: 'text-slate-300'
    };
    return `w-6 h-6 ${statuses[this.status()]}`;
  });

  handleInput(event: Event) {
    const target = event.target as HTMLInputElement;
    this.valueChange.emit(target.value);
  }
}
