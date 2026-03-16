import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';

export interface TabOption {
  value: string;
  label: string;
}

@Component({
  selector: 'lib-tab-switcher',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="flex p-1 bg-slate-100 rounded-xl">
      @for (tab of tabs(); track tab.value) {
        <button [class]="tabClasses(tab.value)" (click)="onTabClick(tab.value)">
          {{ tab.label }}
        </button>
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
export class TabSwitcherComponent {
  tabs = input.required<TabOption[]>();
  activeValue = input.required<string>();

  tabChange = output<string>();

  tabClasses(value: string): string {
    const base = 'flex-1 py-2 text-sm font-bold rounded-lg transition-all';
    const active =
      'bg-white text-slate-900 shadow-sm border border-slate-200/50';
    const inactive = 'text-slate-500 hover:text-slate-700';
    return `${base} ${this.activeValue() === value ? active : inactive}`;
  }

  onTabClick(value: string): void {
    this.tabChange.emit(value);
  }
}
