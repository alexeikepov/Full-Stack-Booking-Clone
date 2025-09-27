import { isAfter } from "date-fns";
import type { DateRange } from "react-day-picker";

export function monthsForward(count = 18) {
  const out: { key: string; date: Date }[] = [];
  const start = new Date();
  start.setDate(1);
  for (let i = 0; i < count; i++) {
    const d = new Date(start.getFullYear(), start.getMonth() + i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}`;
    out.push({ key, date: d });
  }
  return out;
}

export function normalizeRange(r?: DateRange): DateRange | undefined {
  if (!r?.from && !r?.to) return undefined;

  const today = new Date(new Date().setHours(0, 0, 0, 0));

  const from = r.from && r.from < today ? today : r.from;
  const to = r.to && r.to < today ? today : r.to;

  if (from && to && isAfter(from, to)) return { from: to, to: from };
  return from ? { from, to } : undefined;
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
