import { CommonModule } from '@angular/common';
import { Component, computed, inject, input, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  type HeatConfirmationAthlete,
  type HeatConfirmationHeat,
  type HeatConfirmationPayload,
} from '@hero/heat';
import {
  AthleteCardComponent,
  ButtonComponent,
  TabOption,
  TabSwitcherComponent,
  WodInfoCardComponent,
} from '@hero/ui';

@Component({
  selector: 'app-heat-confirmation',
  standalone: true,
  imports: [
    CommonModule,
    AthleteCardComponent,
    ButtonComponent,
    TabSwitcherComponent,
    WodInfoCardComponent,
  ],
  templateUrl: './heat-confirmation.component.html',
  styles: [
    `
      :host {
        display: block;
        height: 100dvh;
      }
    `,
  ],
})
export class HeatConfirmationComponent {
  private readonly router = inject(Router);

  readonly heatPayload = input<HeatConfirmationPayload | null>(null);

  readonly judge = { id: '', name: '' };

  readonly tabs: TabOption[] = [
    { value: 'teams', label: 'Equipos' },
    { value: 'individual', label: 'Individual' },
  ];

  activeTab = signal<'individual' | 'teams'>('teams');
  searchQuery = signal<string>('');
  selectedId = signal<string | null>(null);
  isContinuing = signal<boolean>(false);

  readonly heat = computed<HeatConfirmationHeat | null>(
    () => this.heatPayload()?.heat ?? null,
  );

  private readonly teams = computed<HeatConfirmationAthlete[]>(
    () => this.heatPayload()?.athletes.filter((a) => a.type === 'team') ?? [],
  );

  private readonly individuals = computed<HeatConfirmationAthlete[]>(
    () =>
      this.heatPayload()?.athletes.filter((a) => a.type === 'individual') ?? [],
  );

  private readonly resolvedTab = computed<'individual' | 'teams'>(() => {
    if (this.activeTab() === 'teams' && this.teams().length === 0) {
      return 'individual';
    }
    return this.activeTab();
  });

  private readonly activeAthletes = computed<HeatConfirmationAthlete[]>(() =>
    this.resolvedTab() === 'individual' ? this.individuals() : this.teams(),
  );

  filteredAthletes = computed<HeatConfirmationAthlete[]>(() => {
    const query = this.searchQuery().toLowerCase().trim();
    const source = this.activeAthletes();
    if (!query) return source;
    return source.filter(
      (a) =>
        a.name.toLowerCase().includes(query) || a.bibNumber.includes(query),
    );
  });

  groupedAthletes = computed<
    { label: string; athletes: HeatConfirmationAthlete[] }[]
  >(() => {
    const map = new Map<string, HeatConfirmationAthlete[]>();
    for (const athlete of this.filteredAthletes()) {
      const key = `${athlete.categoryLabel} ${athlete.categoryDetail}`;
      if (!map.has(key)) map.set(key, []);
      const group = map.get(key);
      if (group) group.push(athlete);
    }
    return Array.from(map.entries()).map(([label, athletes]) => ({
      label,
      athletes,
    }));
  });

  canContinue = computed<boolean>(() => this.selectedId() !== null);

  get selectedCount(): number {
    return this.selectedId() ? 1 : 0;
  }

  isSelected(id: string): boolean {
    return this.selectedId() === id;
  }

  toggleSelection(id: string): void {
    this.selectedId.set(this.selectedId() === id ? null : id);
  }

  onTabChange(value: string): void {
    this.activeTab.set(value as 'individual' | 'teams');
    this.searchQuery.set('');
    this.selectedId.set(null);
  }

  onSearch(event: Event): void {
    this.searchQuery.set((event.target as HTMLInputElement).value);
  }

  onContinue(): void {
    if (!this.canContinue()) return;
    this.router.navigate(['/scoring']);
  }

  onBack(): void {
    this.router.navigate(['/heat-access']);
  }
}
