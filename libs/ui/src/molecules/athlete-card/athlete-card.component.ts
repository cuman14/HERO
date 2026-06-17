import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';
import { HeroIconComponent } from '../../icons/hero-icon.component';

export type AthleteCategoryLabel = 'RX' | 'SCALED' | 'TEAMS' | 'MASTERS';

@Component({
  selector: 'lib-athlete-card',
  standalone: true,
  imports: [CommonModule, HeroIconComponent],
  template: `
    <div
      [class]="cardClasses()"
      (click)="cardClick.emit(id())"
      (keyup.enter)="cardClick.emit(id())"
      (keyup.space)="cardClick.emit(id())"
      tabindex="0"
      role="button"
    >
      <div class="flex items-center gap-4">
        @if (type() === 'team') {
          <div class="relative flex items-center shrink-0">
            @for (member of teamMembers(); track $index) {
              @if (member.avatarUrl; as avatar) {
                <img
                  [src]="avatar"
                  [alt]="member.name"
                  class="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm"
                  [class.-ml-3]="!$first"
                />
              } @else {
                <div
                  class="w-10 h-10 rounded-full border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center text-sm font-bold"
                  [class.bg-primary/20]="$first"
                  [class.text-primary]="$first"
                  [class.bg-slate-300]="!$first"
                  [class.dark:bg-slate-700]="!$first"
                  [class.text-slate-500]="!$first"
                  [class.dark:text-slate-400]="!$first"
                  [class.-ml-3]="!$first"
                >
                  {{ member.name.charAt(0) }}
                </div>
              }
            }
          </div>
        } @else {
          <div class="relative shrink-0">
            @if (avatarUrl()) {
              <img
                [src]="avatarUrl()"
                [alt]="name()"
                [class]="avatarClasses()"
              />
            } @else {
              <div
                class="h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-lg"
              >
                {{ name().charAt(0) }}
              </div>
            }
          </div>
        }

        <div class="flex-1 min-w-0">
          <div class="flex items-center gap-2 mb-0.5">
            <p
              class="text-slate-900 dark:text-white font-bold text-base truncate"
            >
              {{ name() }}
            </p>
            @if (scored()) {
              <span
                class="text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0 bg-emerald-100 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400"
              >Listo</span>
            }
            <span [class]="badgeClasses()">{{ categoryLabel() }}</span>
          </div>
          <p class="text-slate-500 text-xs font-medium">
            #{{ bibNumber() }} &bull; {{ categoryDetail() }}
          </p>
        </div>
      </div>

      <div class="shrink-0">
        @if (scored()) {
          <lib-icon name="eye" variant="outline" iconClass="w-5 h-5 text-slate-400 dark:text-slate-500" />
        } @else {
          <lib-icon name="arrow-right" variant="outline" iconClass="w-5 h-5 text-slate-400 dark:text-slate-500" />
        }
      </div>
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
export class AthleteCardComponent {
  id = input.required<string>();
  name = input.required<string>();
  bibNumber = input.required<string>();
  categoryLabel = input.required<AthleteCategoryLabel>();
  categoryDetail = input.required<string>();
  type = input<'individual' | 'team'>('individual');
  scored = input<boolean>(false);
  avatarUrl = input<string>('');
  teamMembers = input<{ name: string; avatarUrl?: string }[]>([]);

  cardClick = output<string>();

  cardClasses = computed(() => {
    const base =
      'flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98] cursor-pointer bg-white dark:bg-slate-900 shadow-sm';
    return this.scored()
      ? `${base} border-2 border-emerald-300 dark:border-emerald-700`
      : `${base} border border-slate-200 dark:border-slate-800`;
  });

  badgeClasses = computed(() => {
    const base =
      'text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter shrink-0';
    const map: Record<AthleteCategoryLabel, string> = {
      RX: 'bg-primary/10 dark:bg-primary/20 text-primary',
      SCALED:
        'bg-amber-100 dark:bg-amber-500/20 text-amber-700 dark:text-amber-400',
      TEAMS: 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900',
      MASTERS:
        'bg-emerald-100 dark:bg-emerald-500/20 text-emerald-700 dark:text-emerald-400',
    };
    return `${base} ${map[this.categoryLabel()]}`;
  });

  avatarClasses = computed(() => {
    return 'w-12 h-12 rounded-full object-cover';
  });
}
