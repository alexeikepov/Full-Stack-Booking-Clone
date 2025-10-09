import type { Hotel } from "@/types/hotel";

export type SortKey =
  | "top_picks"
  | "price_high"
  | "price_low"
  | "rating_high"
  | "rating_low"
  | "reviews_high"
  | "distance_low";

export const SORT_LABEL: Record<SortKey, string> = {
  top_picks: "Top picks for solo travellers",
  price_high: "Price (highest first)",
  price_low: "Price (lowest first)",
  rating_high: "Property rating (high to low)",
  rating_low: "Property rating (low to high)",
  reviews_high: "Top reviewed",
  distance_low: "Distance from city centre",
};

function num(v: unknown): number | null {
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
}

function price(h: Hotel): number | null {
  const total = num((h as any).totalPrice);
  const perNight = num((h as any).priceFrom);
  return total ?? perNight ?? null;
}

function rating(h: Hotel): number | null {
  return num((h as any).averageRating);
}

function reviews(h: Hotel): number {
  return num((h as any).reviewsCount) ?? 0;
}

function distance(h: Hotel): number | null {
  return num((h as any).distanceKm);
}

export function sortHotels(hotels: Hotel[], key: SortKey): Hotel[] {
  const arr = [...hotels];

  const byNum = (a: number | null, b: number | null, dir: "asc" | "desc") => {
    if (a === null && b === null) return 0;
    if (a === null) return 1;
    if (b === null) return -1;
    return dir === "asc" ? a - b : b - a;
  };

  const cmp: Record<SortKey, (a: Hotel, b: Hotel) => number> = {
    top_picks: (a, b) =>
      byNum(rating(a), rating(b), "desc") || byNum(price(a), price(b), "asc") || reviews(b) - reviews(a),
    price_high: (a, b) => byNum(price(a), price(b), "desc"),
    price_low: (a, b) => byNum(price(a), price(b), "asc"),
    rating_high: (a, b) => byNum(rating(a), rating(b), "desc"),
    rating_low: (a, b) => byNum(rating(a), rating(b), "asc"),
    reviews_high: (a, b) => reviews(b) - reviews(a),
    distance_low: (a, b) => byNum(distance(a), distance(b), "asc"),
  };

  return arr.sort(cmp[key]);
}
