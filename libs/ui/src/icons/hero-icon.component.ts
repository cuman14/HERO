import { Component, effect, ElementRef, inject, input } from '@angular/core';
import { ICONS } from './icons';

export type IconName = 'check' | 'x-mark' | 'trophy' | 'arrow-path' | 'flag' | 'check-circle' | 'arrow-right' | 'bolt' | 'eye' | 'pencil' | 'arrow-left';

@Component({
  selector: 'lib-icon',
  standalone: true,
  template: '',
  host: { class: 'inline-flex' },
})
export class HeroIconComponent {
  name     = input.required<IconName>();
  variant  = input<'outline' | 'solid'>('outline');
  iconClass = input('w-5 h-5');

  private elRef = inject(ElementRef<HTMLElement>);

  private render = effect(() => {
    const path = ICONS[this.variant()][this.name()] || '';
    const fill = this.variant() === 'solid' ? 'currentColor' : 'none';
    const isOutline = this.variant() === 'outline';
    const attrs = [
      `class="${this.iconClass()}"`,
      `fill="${fill}"`,
      `viewBox="0 0 24 24"`,
      `aria-hidden="true"`,
      isOutline ? `stroke="currentColor" stroke-width="1.5"` : '',
    ].filter(Boolean).join(' ');
    this.elRef.nativeElement.innerHTML = `<svg ${attrs}>${path}</svg>`;
  });
}
