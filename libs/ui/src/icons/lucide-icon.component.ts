import { Component, computed, input } from '@angular/core';
import {
  LucideArrowLeft,
  LucideArrowRight,
  LucideBolt,
  LucideCheck,
  LucideCircleCheckBig,
  LucideChevronDown,
  LucideDynamicIcon,
  LucideEye,
  LucideFlag,
  LucideGripVertical,
  LucideLoaderCircle,
  LucideLock,
  LucidePencil,
  LucideTimer,
  LucideTrophy,
  LucideUnlock,
  LucideX,
} from '@lucide/angular';

const ICONS = {
  'arrow-left': LucideArrowLeft,
  'arrow-path': LucideLoaderCircle,
  'arrow-right': LucideArrowRight,
  'bolt': LucideBolt,
  'check': LucideCheck,
  'check-circle': LucideCircleCheckBig,
  'chevron-down': LucideChevronDown,
  'eye': LucideEye,
  'flag': LucideFlag,
  'grip-vertical': LucideGripVertical,
  'loader-2': LucideLoaderCircle,
  'lock': LucideLock,
  'lock-open': LucideUnlock,
  'pencil': LucidePencil,
  'timer': LucideTimer,
  'trophy': LucideTrophy,
  'x-mark': LucideX,
} as const;

export type IconName = keyof typeof ICONS;

@Component({
  selector: 'lib-icon',
  standalone: true,
  imports: [LucideDynamicIcon],
  template: `<svg [lucideIcon]="icon()" [class]="iconClass()" [size]="size()"></svg>`,
})
export class LucideIconComponent {
  name = input.required<IconName>();
  iconClass = input('w-5 h-5');
  size = input(20);

  icon = computed(() => ICONS[this.name()]);
}
