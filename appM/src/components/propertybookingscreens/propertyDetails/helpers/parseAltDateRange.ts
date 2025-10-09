export function parseAltDateRange(dateRange: string) {
  if (!dateRange || typeof dateRange !== "string") return null;

  // Normalize dashes and collapse whitespace
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

    // If string is just a day number like "12", use refMonth/year
    const dayOnly = /^\d{1,2}$/.exec(s);
    if (dayOnly && typeof refMonth === "number") {
      const day = Number(dayOnly[0]);
      const d = new Date(currentYear, refMonth, day);
      if (!isNaN(d.getTime())) return d;
    }

    // Try common formats directly
    let d = new Date(s);
    if (!isNaN(d.getTime())) return d;

    // Try adding current year (e.g. "Aug 10")
    d = new Date(`${s} ${currentYear}`);
    if (!isNaN(d.getTime())) return d;

    // Try swapping day/month (e.g. "10 Aug")
    const dm = s.match(/^(\d{1,2})\s+([A-Za-z]+)$/);
    if (dm) {
      const day = dm[1];
      const monthName = dm[2];
      const d2 = new Date(`${monthName} ${day} ${currentYear}`);
      if (!isNaN(d2.getTime())) return d2;
    }

    return null;
  };

  // Parse check-in first to use its month as reference if second part omits month
  const rawIn = parts[0];
  const rawOut = parts[1];

  const checkIn = tryParse(rawIn);
  if (!checkIn) return null;

  // If out looks like just a day number, use checkIn's month/year
  const outDayOnly = /^\d{1,2}$/.test(rawOut.trim());
  let checkOut = outDayOnly
    ? tryParse(rawOut.trim(), checkIn.getMonth())
    : tryParse(rawOut);

  // If still null, attempt to append year and parse
  if (!checkOut) checkOut = tryParse(`${rawOut} ${currentYear}`);

  if (checkIn && checkOut) {
    // If checkOut appears before checkIn (no year specified), and it's
    // likely the next month/year, adjust year accordingly.
    if (checkOut.getTime() <= checkIn.getTime()) {
      // If months are different or same day, assume checkOut is after checkIn
      // by adding one month if that yields a later date with same day number.
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
