import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { WeightService } from '@org/weight-tracker-data';

type Unit = 'lbs' | 'kg';
const KG_FACTOR = 2.20462;

@Component({
  selector: 'weight-tracker-feature-dashboard',
  imports: [FormsModule],
  templateUrl: './feature-dashboard.html',
  styleUrl: './feature-dashboard.css',
})
export class FeatureDashboard {
  protected readonly svc = inject(WeightService);

  protected unit = signal<Unit>('lbs');
  protected dateInput = signal(new Date().toISOString().slice(0, 10));
  protected weightInput = signal('');
  protected noteInput = signal('');

  protected readonly entriesWithDelta = computed(() => {
    const entries = this.svc.entries();
    return entries.map((entry, i) => ({
      ...entry,
      delta: i < entries.length - 1
        ? +(entry.weightLbs - entries[i + 1].weightLbs).toFixed(1)
        : null,
    }));
  });

  protected readonly motivationalQuote = computed(() => {
    const change = this.svc.totalChange();
    if (change === null) return null;
    if (change === 0) return 'Maintenance is a win too.';
    if (change < 0) return `Down ${Math.abs(change).toFixed(1)} lbs. Keep going.`;
    return 'Every day is a new start.';
  });

  protected readonly chartData = computed(() => {
    const points = this.svc.chartPoints();
    if (points.length < 2) return null;

    const W = 900, H = 280;
    const pad = { l: 76, r: 20, t: 20, b: 36 };
    const plotW = W - pad.l - pad.r;
    const plotH = H - pad.t - pad.b;

    const weights = points.map(p => p.weightLbs);
    const rawMin = Math.min(...weights);
    const rawMax = Math.max(...weights);
    const step = this.niceStep((rawMax - rawMin || 1) / 5);
    const minY = Math.floor(rawMin / step) * step;
    const maxY = Math.ceil(rawMax / step) * step + step;

    const toX = (i: number) =>
      pad.l + (points.length > 1 ? (i / (points.length - 1)) * plotW : plotW / 2);
    const toY = (w: number) =>
      pad.t + (1 - (w - minY) / (maxY - minY)) * plotH;

    const coords = points.map((p, i) => ({ x: toX(i), y: toY(p.weightLbs), id: p.id }));

    const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x.toFixed(1)},${c.y.toFixed(1)}`).join(' ');
    const bottom = pad.t + plotH;
    const areaPath = [
      `M${coords[0].x.toFixed(1)},${bottom}`,
      ...coords.map(c => `L${c.x.toFixed(1)},${c.y.toFixed(1)}`),
      `L${coords[coords.length - 1].x.toFixed(1)},${bottom}`,
      'Z',
    ].join(' ');

    const yTicks: { y: number; label: string }[] = [];
    for (let v = minY; v <= maxY + 0.0001; v = +(v + step).toFixed(10)) {
      yTicks.push({ y: toY(v), label: `${+v.toFixed(2)} lbs` });
    }

    const xTicks = coords.map((c, i) => ({
      x: c.x,
      label: new Date(points[i].date + 'T00:00:00').toLocaleDateString('en-US', {
        month: 'numeric', day: 'numeric',
      }),
    }));

    return { W, H, coords, linePath, areaPath, yTicks, xTicks, pad, bottom };
  });

  protected display(lbs: number): string {
    const val = this.unit() === 'kg' ? lbs / KG_FACTOR : lbs;
    return val.toFixed(1);
  }

  protected totalChangeDisplay = computed(() => {
    const c = this.svc.totalChange();
    if (c === null) return '—';
    const val = this.unit() === 'kg' ? c / KG_FACTOR : c;
    return (val >= 0 ? '+' : '') + val.toFixed(1);
  });

  protected deltaDisplay(delta: number | null): string | null {
    if (delta === null) return null;
    const val = this.unit() === 'kg' ? delta / KG_FACTOR : delta;
    return (val >= 0 ? '+' : '') + val.toFixed(1);
  }

  protected formatDate(iso: string): string {
    return new Date(iso + 'T00:00:00').toLocaleDateString('en-US', {
      month: 'short', day: 'numeric', year: 'numeric',
    });
  }

  protected log(): void {
    const raw = parseFloat(this.weightInput());
    if (isNaN(raw) || !this.dateInput()) return;
    const lbs = this.unit() === 'kg' ? raw * KG_FACTOR : raw;
    this.svc.add(this.dateInput(), lbs, this.noteInput());
    this.weightInput.set('');
    this.noteInput.set('');
  }

  private niceStep(rough: number): number {
    const mag = Math.pow(10, Math.floor(Math.log10(rough)));
    const n = rough / mag;
    if (n <= 1) return mag;
    if (n <= 2) return 2 * mag;
    if (n <= 5) return 5 * mag;
    return 10 * mag;
  }
}
