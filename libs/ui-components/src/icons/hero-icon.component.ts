import { Component, computed, inject, input } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { ICONS } from './icons';

export type IconName = 'check' | 'x-mark' | 'trophy' | 'arrow-path';

@Component({
  selector: 'ui-icon',
  standalone: true,
  template: `
    <svg
      [class]="class()"
      [attr.fill]="variant() === 'solid' ? 'currentColor' : 'none'"
      [attr.viewBox]="'0 0 24 24'"
      [attr.stroke-width]="variant() === 'outline' ? '1.5' : undefined"
      [attr.stroke]="variant() === 'outline' ? 'currentColor' : undefined"
      [attr.aria-hidden]="true"
      [innerHTML]="svgContent()"
    ></svg>
  `
})
export class HeroIconComponent {
  name    = input.required<IconName>();
  variant = input<'outline' | 'solid'>('outline');
  class   = input('w-5 h-5');

  private sanitizer = inject(DomSanitizer);

  svgContent = computed(() => {
    const svgPath = ICONS[this.variant()][this.name()] || '';
    return this.sanitizer.bypassSecurityTrustHtml(svgPath);
  });
}
