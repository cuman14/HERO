import { Component, computed, input, signal } from '@angular/core';
import { MovementHeaderComponent } from './movement-header.component';

export interface MovementStackItem {
  id: string;
  name: string;
  description: string;
  targetReps: number;
  currentReps: number;
  status: 'completed' | 'active' | 'upcoming';
  roundLabel: string;
  roundIndex: number;
}

@Component({
  selector: 'lib-movement-stack-card',
  standalone: true,
  imports: [MovementHeaderComponent],
  template: `
    <div class="relative w-full max-w-md mx-auto mt-12 mb-4">
      <lib-movement-header
        [timerDisplay]="timerDisplay()"
        [showToggle]="completedItems().length > 0"
        [expanded]="expanded()"
        (toggleExpanded)="toggleExpanded()"
      />

      <!-- Expanded Completed Movements List -->
      <div
        id="completedList"
        class="overflow-hidden transition-all duration-300 ease-out"
        [class.max-h-0]="!expanded()"
        [class.max-h-96]="expanded()"
        [class.opacity-0]="!expanded()"
        [class.opacity-100]="expanded()"
      >
        <div class="space-y-2 mt-2">
          @for (card of completedItems(); track card.id) {
            <div class="flex items-center gap-3 px-4 py-3 bg-white border border-slate-200 rounded-xl shadow-sm">
              <span
                class="material-symbols-outlined text-emerald-500 text-base shrink-0"
                style="font-variation-settings: 'FILL' 1;"
                >check_circle</span
              >
              <div class="flex-1 min-w-0">
                <span class="text-sm font-semibold text-slate-900 truncate block"
                  >{{ card.name }}</span
                >
                <span class="text-xs text-slate-500"
                  >{{ card.currentReps }} / {{ card.targetReps }} reps  •  {{ card.roundLabel }}</span
                >
              </div>
            </div>
          }
        </div>
      </div>

      <!-- Stacked Card -2 (oldest completed) — track by id forces recreation → animation -->
      @if (!expanded()) {
        @for (card of stackedCard2AsArray(); track card.id) {
          <div
            class="absolute inset-x-0 mx-auto w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 flex justify-between items-center card-to-stack2"
            style="z-index: 10;"
          >
            <div class="flex flex-col">
              <span
                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                >{{ card.roundLabel }}</span
              >
              <span class="text-sm text-slate-600 font-semibold"
                >{{ card.targetReps }} {{ card.name }}</span
              >
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[10px] font-bold text-emerald-600"
                >COMPLETED</span
              >
              <span
                class="material-symbols-outlined text-emerald-500 text-sm"
                style="font-variation-settings: 'FILL' 1;"
                >check_circle</span
              >
            </div>
          </div>
        }

        <!-- Stacked Card -1 (most recent completed) — track by id forces recreation → animation -->
        @for (card of stackedCard1AsArray(); track card.id) {
          <div
            class="absolute inset-x-0 mx-auto w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 flex justify-between items-center shadow-sm card-to-stack1"
            style="z-index: 20;"
          >
            <div class="flex flex-col">
              <span
                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                >{{ card.roundLabel }}</span
              >
              <span class="text-sm text-slate-600 font-semibold"
                >{{ card.targetReps }} {{ card.name }}</span
              >
            </div>
            <div class="flex items-center gap-1">
              <span class="text-[10px] font-bold text-emerald-600"
                >COMPLETED</span
              >
              <span
                class="material-symbols-outlined text-emerald-500 text-sm"
                style="font-variation-settings: 'FILL' 1;"
                >check_circle</span
              >
            </div>
          </div>
        }
      }

      <!-- Active Card — track by id forces recreation on movement change → entrance animation -->
      @for (card of activeItemAsArray(); track card.id) {
        <div
          class="relative w-full bg-white border-2 border-primary rounded-3xl p-5 shadow-xl card-enter"
          style="z-index: 30;"
        >
          <!-- Unlock flash overlay -->
          <div
            class="card-unlock-overlay absolute inset-0 rounded-3xl flex items-center justify-center pointer-events-none"
          >
            <span
              class="material-symbols-outlined text-primary text-5xl card-unlock-icon"
              >lock_open</span
            >
          </div>

          <div class="flex justify-between items-start mb-4">
            <div>
              <span
                class="inline-block px-1.5 py-0.5 bg-primary text-white text-[9px] font-extrabold rounded mb-1 tracking-widest"
                >ACTIVE ROUND</span
              >
              <h2 class="text-xl font-black text-slate-900">
                {{ card.targetReps }} {{ card.name }}
              </h2>
              <p class="text-xs text-slate-500 font-semibold">
                {{ card.roundLabel }} of {{ totalItems() }}
              </p>
            </div>
            <!-- Circular progress ring -->
            <div
              class="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center relative shrink-0"
            >
              <svg
                class="absolute inset-0 w-full h-full -rotate-90"
                viewBox="0 0 48 48"
              >
                <circle
                  class="text-primary"
                  cx="24"
                  cy="24"
                  fill="transparent"
                  r="20"
                  stroke="currentColor"
                  stroke-dasharray="125.6"
                  [attr.stroke-dashoffset]="circleOffset()"
                  stroke-width="3"
                />
              </svg>
              <span class="text-[10px] font-black text-primary"
                >{{ progressPercent() }}%</span
              >
            </div>
          </div>

          <!-- Large rep count display -->
          <div class="flex items-baseline justify-center gap-2 py-2">
            <span
              class="text-6xl font-black text-slate-900 tracking-tighter tabular-nums"
              >{{ currentRepsDisplay() }}</span
            >
            <span class="text-2xl font-bold text-slate-400">/</span>
            <span class="text-2xl font-bold text-slate-400 tabular-nums">{{
              card.targetReps
            }}</span>
          </div>

          <!-- Progress bar -->
          <div
            class="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden"
          >
            <div
              class="bg-primary h-full rounded-full transition-all duration-300"
              [style.width.%]="progressPercent()"
            ></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [
    `
      :host {
        display: block;
      }

      @keyframes cardToStack1 {
        from {
          transform: translateY(0px) scale(1);
          opacity: 1;
        }
        to {
          transform: translateY(-20px) scale(0.92);
          opacity: 0.8;
        }
      }

      @keyframes cardToStack2 {
        from {
          transform: translateY(-20px) scale(0.92);
          opacity: 0.8;
        }
        to {
          transform: translateY(-40px) scale(0.85);
          opacity: 0.4;
        }
      }

      .card-to-stack1 {
        transform: translateY(-20px) scale(0.92);
        opacity: 0.8;
        animation: cardToStack1 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      .card-to-stack2 {
        transform: translateY(-40px) scale(0.85);
        opacity: 0.4;
        animation: cardToStack2 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      }

      @keyframes cardUnlockEnter {
        0% {
          transform: translateY(72px) scale(0.88);
          opacity: 0;
        }
        55% {
          transform: translateY(-6px) scale(1.02);
          opacity: 1;
        }
        75% {
          transform: translateY(3px) scale(0.995);
        }
        100% {
          transform: translateY(0) scale(1);
          opacity: 1;
        }
      }

      @keyframes unlockOverlayFade {
        0% {
          opacity: 1;
        }
        40% {
          opacity: 0.7;
        }
        100% {
          opacity: 0;
        }
      }

      @keyframes unlockIconPop {
        0% {
          transform: scale(0.6) rotate(-15deg);
          opacity: 0;
        }
        40% {
          transform: scale(1.2) rotate(5deg);
          opacity: 1;
        }
        70% {
          transform: scale(0.9) rotate(0deg);
          opacity: 1;
        }
        100% {
          transform: scale(0.7) rotate(0deg);
          opacity: 0;
        }
      }

      .card-enter {
        animation: cardUnlockEnter 0.45s cubic-bezier(0.34, 1.2, 0.64, 1)
          forwards;
      }

      .card-unlock-overlay {
        background: rgba(255, 255, 255, 0.75);
        z-index: 2;
        animation: unlockOverlayFade 0.45s 0.05s ease-out forwards;
      }

      .card-unlock-icon {
        animation: unlockIconPop 0.45s 0.05s cubic-bezier(0.34, 1.3, 0.64, 1)
          forwards;
        opacity: 0;
      }
    `,
  ],
})
export class MovementStackCardComponent {
  items = input.required<MovementStackItem[]>();
  elapsedSeconds = input<number>(0);

  timerDisplay = computed(() => {
    const s = this.elapsedSeconds();
    const m = Math.floor(s / 60)
      .toString()
      .padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  });

  totalItems = computed(() => this.items().length);

  activeItem = computed(
    () => this.items().find((i) => i.status === 'active') ?? null,
  );

  completedItems = computed(() =>
    this.items().filter((i) => i.status === 'completed'),
  );

  stackedCard1 = computed(() => {
    const completed = this.completedItems();
    return completed.length > 0 ? completed[completed.length - 1] : null;
  });

  stackedCard2 = computed(() => {
    const completed = this.completedItems();
    return completed.length > 1 ? completed[completed.length - 2] : null;
  });

  stackedCard1AsArray = computed(() => {
    const c = this.stackedCard1();
    return c ? [c] : [];
  });

  stackedCard2AsArray = computed(() => {
    const c = this.stackedCard2();
    return c ? [c] : [];
  });

  activeItemAsArray = computed(() => {
    const c = this.activeItem();
    return c ? [c] : [];
  });

  currentRepsDisplay = computed(() => {
    const active = this.activeItem();
    if (!active) return '00';
    return active.currentReps.toString().padStart(2, '0');
  });

  progressPercent = computed(() => {
    const active = this.activeItem();
    if (!active || active.targetReps === 0) return 0;
    return Math.min(
      100,
      Math.round((active.currentReps / active.targetReps) * 100),
    );
  });

  circleOffset = computed(() => {
    const pct = this.progressPercent();
    const circumference = 125.6;
    return circumference - (pct / 100) * circumference;
  });

  expanded = signal(false);

  toggleExpanded = (): void => {
    this.expanded.set(!this.expanded());
  };

}
