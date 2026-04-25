import { CommonModule } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  MovementStackCardComponent,
  MovementStackItem,
  NumericKeypadComponent,
} from '@hero/ui';
import { RegisterRepetitionsFacade } from '../../../application/register-repetitions.facade';

@Component({
  selector: 'app-register-repetitions-page',
  standalone: true,
  imports: [CommonModule, MovementStackCardComponent, NumericKeypadComponent],
  template: `
    <body
      class="bg-background text-on-background font-body min-h-screen flex flex-col overflow-hidden"
    >
      <!-- TopAppBar -->
      <header
        class="fixed top-0 w-full bg-white shadow-sm border-b border-slate-200 z-50"
      >
        <div class="flex justify-between items-center w-full px-4 h-16">
          <div class="flex items-center gap-3 overflow-hidden">
            <button
              class="p-1.5 -ml-1 hover:bg-slate-50 transition-colors active:opacity-70 rounded-full shrink-0"
            >
              <span class="material-symbols-outlined text-slate-500 text-xl"
                >arrow_back</span
              >
            </button>
            <div class="flex flex-col min-w-0">
              <span
                class="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-none mb-0.5"
              >
                {{ facade.athleteHeat()?.heatName ?? 'HEAT' }}
              </span>
              <h1 class="text-sm font-black text-slate-900 truncate">
                {{ facade.athleteHeat()?.athleteName ?? '' }}
              </h1>
            </div>
          </div>
          <div class="flex items-center">
            <div
              class="flex items-center gap-1.5 bg-slate-900 text-white px-3 py-1.5 rounded-lg shrink-0"
            >
              <span class="material-symbols-outlined text-[14px]">reorder</span>
              <span class="text-xs font-black tabular-nums whitespace-nowrap"
                >{{ facade.totalReps() }} Reps</span
              >
            </div>
          </div>
        </div>
      </header>

      <!-- Main scrollable area -->
      <main
        class="flex-1 mt-16 mb-[380px] p-4 overflow-y-auto hide-scrollbar flex flex-col items-center"
      >
        @if (facade.athleteHeat()) {
          <!-- Movement Stack -->
          <lib-movement-stack-card
            [items]="stackItems()"
            [elapsedSeconds]="elapsedSeconds()"
          />

          <!-- Upcoming movements -->
          <div class="w-full max-w-sm space-y-3 mt-4 pb-12">
            @for (item of upcomingItems(); track item.id) {
              <div
                class="w-full bg-white/50 border border-slate-200 rounded-2xl p-4 flex justify-between items-center"
                [class.opacity-70]="$first"
                [class.opacity-40]="!$first"
              >
                <div class="flex flex-col">
                  <span
                    class="text-[10px] font-bold text-slate-500 uppercase tracking-widest"
                    >{{ item.roundLabel }}</span
                  >
                  <span class="text-sm text-slate-900 font-semibold"
                    >{{ item.targetReps }} {{ item.name }}</span
                  >
                </div>
                <span class="material-symbols-outlined text-slate-400 text-lg"
                  >lock</span
                >
              </div>
            }
          </div>
        } @else {
          <div class="flex items-center justify-center min-h-[400px]">
            <div class="text-center">
              <p class="text-slate-500 mb-4">Loading...</p>
              <div
                class="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto"
              ></div>
            </div>
          </div>
        }
      </main>

      <!-- Numeric Keypad (fixed bottom) -->
      <lib-numeric-keypad
        (digitPressed)="onDigit($event)"
        (backspacePressed)="onBackspace()"
        (confirmPressed)="onConfirm()"
      />
    </body>
  `,
  styles: [
    `
      :host {
        display: block;
      }
      .hide-scrollbar::-webkit-scrollbar {
        display: none;
      }
      .hide-scrollbar {
        -ms-overflow-style: none;
        scrollbar-width: none;
      }
    `,
  ],
  providers: [RegisterRepetitionsFacade],
})
export class RegisterRepetitionsPage implements OnInit, OnDestroy {
  facade = inject(RegisterRepetitionsFacade);

  elapsedSeconds = signal(0);
  private timerInterval: ReturnType<typeof setInterval> | null = null;

  private inputBuffer = signal('');

  stackItems = computed<MovementStackItem[]>(() => {
    const movements = this.facade.movements();
    const activeIdx = this.facade.currentMovementIndex();
    return movements.map((m, i) => {
      let status: 'completed' | 'active' | 'upcoming';
      if (i < activeIdx) status = 'completed';
      else if (i === activeIdx) status = 'active';
      else status = 'upcoming';

      const repsForMovement =
        i === activeIdx ? this.facade.currentRepetitionCount().value : 0;

      return {
        id: m.id,
        name: m.name,
        description: m.description,
        targetReps: m.targetReps,
        currentReps: repsForMovement,
        status,
        roundLabel: m.description,
        roundIndex: i,
      };
    });
  });

  upcomingItems = computed(() =>
    this.stackItems().filter((i) => i.status === 'upcoming'),
  );

  ngOnInit(): void {
    this.facade.loadHeat();
    this.timerInterval = setInterval(() => {
      this.elapsedSeconds.update((s) => s + 1);
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerInterval) clearInterval(this.timerInterval);
  }

  onDigit(digit: string): void {
    const current = this.inputBuffer();
    const next = current === '0' ? digit : current + digit;
    if (next.length > 3) return;
    this.inputBuffer.set(next);
    const value = parseInt(next, 10);
    if (!isNaN(value)) this.facade.updateRepetitionCount(value);
  }

  onBackspace(): void {
    const current = this.inputBuffer();
    const next = current.length > 1 ? current.slice(0, -1) : '0';
    this.inputBuffer.set(next);
    const value = parseInt(next, 10);
    this.facade.updateRepetitionCount(isNaN(value) ? 0 : value);
  }

  onConfirm(): void {
    this.facade.submitRepetitionCount();
    this.inputBuffer.set('0');
  }
}
