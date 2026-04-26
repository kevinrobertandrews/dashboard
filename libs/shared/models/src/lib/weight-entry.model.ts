export interface WeightEntry {
  id: string;
  date: string; // ISO 8601 date string, e.g. "2026-04-26"
  weightLbs: number;
  note?: string;
}
