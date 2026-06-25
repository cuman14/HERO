import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from './icons';

export type IconName = 'check' | 'x-mark' | 'trophy' | 'arrow-path' | 'flag' | 'check-circle' | 'arrow-right' | 'bolt' | 'eye' | 'pencil' | 'arrow-left';

@Component({
  selector: 'lib-icon',
  standalone: true,
  template: `
    <span [innerHTML]="svgContent()" class="inline-flex"></span>
  `
})
export class HeroIconComponent {
  name    = input.required<IconName>();
  variant = input<'outline' | 'solid'>('outline');
  iconClass = input('w-5 h-5');

  private sanitizer = inject(DomSanitizer);

  svgContent = computed(() => {
    const path = ICONS[this.variant()][this.name()] || '';
    const fill = this.variant() === 'solid' ? 'currentColor' : 'none';
    const stroke = this.variant() === 'outline' ? 'currentColor' : undefined;
    const strokeWidth = this.variant() === 'outline' ? '1.5' : undefined;
    const svg = `<svg class="${this.iconClass()}" fill="${fill}" viewBox="0 0 24 24" stroke-width="${strokeWidth ?? ''}" stroke="${stroke ?? ''}" aria-hidden="true">${path}</svg>`;
    return this.sanitizer.bypassSecurityTrustHtml(svg);
  });
}
