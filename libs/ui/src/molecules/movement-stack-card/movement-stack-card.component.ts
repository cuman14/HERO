import { Component, computed, input } from '@angular/core';

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
  template: `
    <div class="relative w-full max-w-sm mx-auto mt-12 mb-4">

      <!-- Floating Timer Chip -->
      <div class="absolute -top-10 left-1/2 -translate-x-1/2 z-[40] flex items-center gap-1.5 bg-primary px-4 py-1.5 rounded-full shadow-lg shadow-primary/30 border border-white/20">
        <span class="material-symbols-outlined text-white text-[16px]">timer</span>
        <span class="text-white font-black text-sm tabular-nums tracking-wider">{{ timerDisplay() }}</span>
      </div>

      <!-- Stacked Card -2 (oldest completed) -->
      @if (stackedCard2()) {
        <div class="absolute inset-x-0 mx-auto w-full bg-slate-100 border border-slate-200 rounded-2xl p-3 flex justify-between items-center opacity-40"
          style="transform: translateY(-40px) scale(0.85); z-index: 10;">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ stackedCard2()!.roundLabel }}</span>
            <span class="text-sm text-slate-600 font-semibold">{{ stackedCard2()!.targetReps }} {{ stackedCard2()!.name }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[10px] font-bold text-emerald-600">COMPLETED</span>
            <span class="material-symbols-outlined text-emerald-500 text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          </div>
        </div>
      }

      <!-- Stacked Card -1 (most recent completed) -->
      @if (stackedCard1()) {
        <div class="absolute inset-x-0 mx-auto w-full bg-slate-50 border border-slate-200 rounded-2xl p-3 flex justify-between items-center shadow-sm opacity-80"
          style="transform: translateY(-20px) scale(0.92); z-index: 20;">
          <div class="flex flex-col">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{{ stackedCard1()!.roundLabel }}</span>
            <span class="text-sm text-slate-600 font-semibold">{{ stackedCard1()!.targetReps }} {{ stackedCard1()!.name }}</span>
          </div>
          <div class="flex items-center gap-1">
            <span class="text-[10px] font-bold text-emerald-600">COMPLETED</span>
            <span class="material-symbols-outlined text-emerald-500 text-sm" style="font-variation-settings: 'FILL' 1;">check_circle</span>
          </div>
        </div>
      }

      <!-- Active Card -->
      @if (activeItem()) {
        <div class="relative w-full bg-white border-2 border-primary rounded-3xl p-5 shadow-xl" style="z-index: 30;">
          <div class="flex justify-between items-start mb-4">
            <div>
              <span class="inline-block px-1.5 py-0.5 bg-primary text-white text-[9px] font-extrabold rounded mb-1 tracking-widest">ACTIVE ROUND</span>
              <h2 class="text-xl font-black text-slate-900">{{ activeItem()!.targetReps }} {{ activeItem()!.name }}</h2>
              <p class="text-xs text-slate-500 font-semibold">{{ activeItem()!.roundLabel }} of {{ totalItems() }}</p>
            </div>
            <!-- Circular progress ring -->
            <div class="w-12 h-12 rounded-full border-2 border-primary/20 flex items-center justify-center relative shrink-0">
              <svg class="absolute inset-0 w-full h-full -rotate-90" viewBox="0 0 48 48">
                <circle
                  class="text-primary"
                  cx="24" cy="24" fill="transparent" r="20"
                  stroke="currentColor"
                  stroke-dasharray="125.6"
                  [attr.stroke-dashoffset]="circleOffset()"
                  stroke-width="3"
                />
              </svg>
              <span class="text-[10px] font-black text-primary">{{ progressPercent() }}%</span>
            </div>
          </div>

          <!-- Large rep count display -->
          <div class="flex items-baseline justify-center gap-2 py-2">
            <span class="text-6xl font-black text-slate-900 tracking-tighter tabular-nums">{{ currentRepsDisplay() }}</span>
            <span class="text-2xl font-bold text-slate-400">/</span>
            <span class="text-2xl font-bold text-slate-400 tabular-nums">{{ activeItem()!.targetReps }}</span>
          </div>

          <!-- Progress bar -->
          <div class="w-full bg-slate-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div class="bg-primary h-full rounded-full transition-all duration-300" [style.width.%]="progressPercent()"></div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`:host { display: block; }`],
})
export class MovementStackCardComponent {
  items = input.required<MovementStackItem[]>();
  elapsedSeconds = input<number>(0);

  timerDisplay = computed(() => {
    const s = this.elapsedSeconds();
    const m = Math.floor(s / 60).toString().padStart(2, '0');
    const sec = (s % 60).toString().padStart(2, '0');
    return `${m}:${sec}`;
  });

  totalItems = computed(() => this.items().length);

  activeItem = computed(() => this.items().find((i) => i.status === 'active') ?? null);

  completedItems = computed(() => this.items().filter((i) => i.status === 'completed'));

  stackedCard1 = computed(() => {
    const completed = this.completedItems();
    return completed.length > 0 ? completed[completed.length - 1] : null;
  });

  stackedCard2 = computed(() => {
    const completed = this.completedItems();
    return completed.length > 1 ? completed[completed.length - 2] : null;
  });

  currentRepsDisplay = computed(() => {
    const active = this.activeItem();
    if (!active) return '00';
    return active.currentReps.toString().padStart(2, '0');
  });

  progressPercent = computed(() => {
    const active = this.activeItem();
    if (!active || active.targetReps === 0) return 0;
    return Math.min(100, Math.round((active.currentReps / active.targetReps) * 100));
  });

  circleOffset = computed(() => {
    const pct = this.progressPercent();
    const circumference = 125.6;
    return circumference - (pct / 100) * circumference;
  });
}
