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
  if (r?.from && r?.to && isAfter(r.from, r.to))
    return { from: r.to, to: r.from };
  return r?.from ? { from: r.from, to: r.to } : undefined;
}

export function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
