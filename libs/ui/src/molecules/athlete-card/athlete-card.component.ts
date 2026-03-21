import { CommonModule } from '@angular/common';
import { Component, computed, input, output } from '@angular/core';

export type AthleteCategoryLabel = 'RX' | 'SCALED' | 'TEAMS' | 'MASTERS';

@Component({
  selector: 'lib-athlete-card',
  standalone: true,
  imports: [CommonModule],
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
          <div class="relative w-12 h-12 flex items-center shrink-0">
            @if (teamMemberAvatars()[0]) {
              <img
                [src]="teamMemberAvatars()[0]"
                alt="Team member 1"
                class="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm z-10"
              />
            } @else {
              <div
                class="w-10 h-10 rounded-full bg-primary/20 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center text-primary z-10"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
            }
            @if (teamMemberAvatars()[1]) {
              <img
                [src]="teamMemberAvatars()[1]"
                alt="Team member 2"
                class="w-10 h-10 rounded-full object-cover border-2 border-white dark:border-slate-900 shadow-sm -ml-3"
              />
            } @else {
              <div
                class="w-10 h-10 rounded-full bg-slate-300 dark:bg-slate-700 border-2 border-white dark:border-slate-900 shadow-sm flex items-center justify-center text-slate-500 dark:text-slate-400 -ml-3"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="currentColor"
                  class="w-5 h-5"
                >
                  <path
                    fill-rule="evenodd"
                    d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
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
                class="w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-800 flex items-center justify-center text-slate-500 dark:text-slate-400 font-bold text-lg"
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
            <span [class]="badgeClasses()">{{ categoryLabel() }}</span>
          </div>
          <p class="text-slate-500 text-xs font-medium">
            #{{ bibNumber() }} &bull; {{ categoryDetail() }}
          </p>
        </div>
      </div>

      <div [class]="checkClasses()">
        @if (selected()) {
          <svg class="w-3.5 h-3.5 text-white" viewBox="0 0 14 14" fill="none">
            <path
              d="M2 7L5.5 10.5L12 3.5"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
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
  selected = input<boolean>(false);
  avatarUrl = input<string>('');
  teamMemberAvatars = input<[string?, string?]>([]);

  cardClick = output<string>();

  cardClasses = computed(() => {
    const base =
      'flex items-center justify-between p-4 rounded-2xl transition-all active:scale-[0.98] cursor-pointer';
    return this.selected()
      ? `${base} bg-white dark:bg-slate-900 border-2 border-primary shadow-md overflow-hidden`
      : `${base} bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm`;
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
    const base = 'w-12 h-12 rounded-full object-cover';
    return this.selected()
      ? `${base} ring-2 ring-primary/20 ring-offset-1`
      : base;
  });

  checkClasses = computed(() => {
    const base =
      'flex items-center justify-center w-6 h-6 rounded-full shrink-0 transition-all';
    return this.selected()
      ? `${base} bg-primary shadow-sm shadow-primary/40`
      : `${base} border-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50`;
  });
}
