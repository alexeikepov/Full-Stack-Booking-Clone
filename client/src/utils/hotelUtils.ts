export const n = (v: unknown): number | null =>
  Number.isFinite(Number(v)) ? Number(v) : null;

export const priceOf = (h: any) => n(h.totalPrice) ?? n(h.priceFrom);

export const ratingOf = (h: any) => n(h.averageRating) ?? 0;

export const starsOf = (h: any) => n(h.stars) ?? 0;

export function toStringArray(val: unknown): string[] {
  if (Array.isArray(val)) return val.map(String);
  if (val instanceof Set) return Array.from(val).map(String);
  if (typeof val === "string")
    return val
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  if (val && typeof val === "object") {
    return Object.entries(val as Record<string, any>)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k);
  }
  return [];
}

export const catsSet = (h: any) =>
  new Set<string>(toStringArray(h.categories).map((s) => s.toLowerCase()));

export const typeOf = (h: any) => {
  const fromField = String(h.propertyType ?? h.type ?? "").toLowerCase();
  if (fromField) return fromField;
  const c = catsSet(h);
  if (c.has("hotels")) return "hotel";
  if (c.has("apartments") || c.has("entire homes & apartments"))
    return "apartment";
  if (c.has("hostels")) return "hostel";
  if (c.has("villas")) return "villa";
  if (c.has("guest houses")) return "guest house";
  if (c.has("motels")) return "motel";
  if (c.has("bed and breakfasts")) return "bed and breakfast";
  if (c.has("campsites")) return "campsite";
  return "";
};

export const amens = (h: any) => {
  const base = Array.isArray(h.amenityIds) ? h.amenityIds : h.amenities ?? [];
  const normalized = base.map((x: any) => String(x).toLowerCase());
  const merged = new Set<string>([...normalized, ...catsSet(h)]);
  return Array.from(merged);
};

export const meals = (h: any) => {
  const fromField = new Set<string>(
    toStringArray(h.meals).map((s) => s.toLowerCase())
  );
  const rawCats = toStringArray(h.categories);
  for (const raw of rawCats) {
    const parts = String(raw)
      .split("|")
      .map((s) => s.trim().toLowerCase())
      .filter(Boolean);
    for (const p of parts) {
      if (p === "breakfast included") fromField.add("breakfast included");
      if (p === "all-inclusive" || p === "all inclusive")
        fromField.add("all-inclusive");
    }
  }
  return fromField;
};

export const pay = (h: any) => {
  const p = h.paymentOptions ?? {};
  const c = catsSet(h);
  return {
    free:
      Boolean(h.freeCancellation) ||
      Boolean(p.freeCancellation) ||
      c.has("free cancellation"),
    noPre:
      Boolean(h.noPrepayment) ||
      Boolean(p.noPrepayment) ||
      c.has("no prepayment"),
    online:
      Boolean(h.acceptsOnlinePayments) ||
      Boolean(p.acceptsOnlinePayments) ||
      Boolean(p.onlinePayments) ||
      c.has("accepts online payments"),
  };
};

export const dist = (h: any) =>
  n(h.distanceKm) ?? n(h.distance_km) ?? n(h.distanceFromCenterKm);

export const hood = (h: any) =>
  String(h.neighborhood ?? h.area ?? "").toLowerCase();

export const brand = (h: any) => String(h.brand ?? h.chain ?? "").toLowerCase();
