// Utility functions for property details

export function parseAltDateRange(dateRange: string) {
  if (!dateRange || typeof dateRange !== "string") return null;
  const normalized = dateRange
    .replace(/[–—]/g, "-")
    .replace(/\s+/g, " ")
    .trim();
  const parts = normalized.split(/\s*-\s*/);
  if (parts.length !== 2) return null;
  const now = new Date();
  const currentYear = now.getFullYear();
  const tryParse = (s: string, refMonth?: number): Date | null => {
    if (!s) return null;
    s = s.trim();
    const dayOnly = /^\d{1,2}$/.exec(s);
    if (dayOnly && typeof refMonth === "number") {
      const day = Number(dayOnly[0]);
      const d = new Date(currentYear, refMonth, day);
      if (!isNaN(d.getTime())) return d;
    }
    let d = new Date(s);
    if (!isNaN(d.getTime())) return d;
    d = new Date(`${s} ${currentYear}`);
    if (!isNaN(d.getTime())) return d;
    const dm = s.match(/^(\d{1,2})\s+([A-Za-z]+)$/);
    if (dm) {
      const day = dm[1];
      const monthName = dm[2];
      const d2 = new Date(`${monthName} ${day} ${currentYear}`);
      if (!isNaN(d2.getTime())) return d2;
    }
    return null;
  };
  const rawIn = parts[0];
  const rawOut = parts[1];
  const checkIn = tryParse(rawIn);
  if (!checkIn) return null;
  const outDayOnly = /^\d{1,2}$/.test(rawOut.trim());
  let checkOut = outDayOnly
    ? tryParse(rawOut.trim(), checkIn.getMonth())
    : tryParse(rawOut);
  if (!checkOut) checkOut = tryParse(`${rawOut} ${currentYear}`);
  if (checkIn && checkOut) {
    if (checkOut.getTime() <= checkIn.getTime()) {
      const maybe = new Date(checkOut.getTime());
      maybe.setFullYear(checkOut.getFullYear() + 1);
      if (maybe.getTime() > checkIn.getTime()) {
        checkOut = maybe;
      }
    }
    return { checkIn, checkOut };
  }
  return null;
}

export function normalizeImageSource(img: any) {
  return typeof img === "number"
    ? img
    : typeof img === "string"
      ? { uri: img }
      : img;
}
