import { Injectable, computed, signal } from '@angular/core';
import { WeightEntry } from '@org/models';

const STORAGE_KEY = 'wt-entries';

@Injectable({ providedIn: 'root' })
export class WeightService {
  private readonly _all = signal<WeightEntry[]>(this.hydrate());

  readonly entries = computed(() =>
    [...this._all()].sort((a, b) => b.date.localeCompare(a.date))
  );

  private readonly _asc = computed(() =>
    [...this._all()].sort((a, b) => a.date.localeCompare(b.date))
  );

  readonly current = computed(() => this.entries()[0]?.weightLbs ?? null);
  readonly starting = computed(() => this._asc()[0]?.weightLbs ?? null);
  readonly totalChange = computed(() => {
    const c = this.current(), s = this.starting();
    return c != null && s != null ? +(c - s).toFixed(1) : null;
  });
  readonly count = computed(() => this._all().length);
  readonly chartPoints = computed(() => this._asc());

  add(date: string, weightLbs: number, note: string): void {
    const entry: WeightEntry = {
      id: crypto.randomUUID(),
      date,
      weightLbs: +weightLbs.toFixed(1),
      note: note.trim() || undefined,
    };
    this._all.update(e => [...e, entry]);
    this.persist();
  }

  remove(id: string): void {
    this._all.update(e => e.filter(x => x.id !== id));
    this.persist();
  }

  private hydrate(): WeightEntry[] {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]');
    } catch {
      return [];
    }
  }

  private persist(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this._all()));
  }
}
