import type { Hotel } from "@/types/hotel";
import type { FiltersState } from "@/components/searchPage/FiltersSidebar";
import {
  priceOf,
  ratingOf,
  starsOf,
  typeOf,
  amens,
  meals,
  pay,
  dist,
  hood,
  brand,
  catsSet,
} from "./hotelUtils";

export function nightsFromParams(params: URLSearchParams): number | null {
  const from = params.get("from");
  const to = params.get("to");
  if (!from || !to) return null;
  const s = new Date(from);
  const e = new Date(to);
  if (isNaN(+s) || isNaN(+e) || e <= s) return null;
  return Math.max(1, Math.ceil((+e - +s) / (1000 * 60 * 60 * 24)));
}

export async function fetchHotels(params: URLSearchParams) {
  const { api } = await import("@/lib/api");
  const { data } = await api.get<Hotel[] | { items: Hotel[] }>("/api/hotels", {
    params: Object.fromEntries(params.entries()),
  });
  if (Array.isArray(data)) return data;
  return (data as any)?.items ?? [];
}

export function selectedCategoryTokens(
  selected: FiltersState["selected"]
): string[] {
  const tokens: string[] = [];
  const set = selected["categories"];
  if (!set) return tokens;
  for (const raw of Array.from(set)) {
    const id = String(raw);
    const token = id.startsWith("cat_") ? id.slice(4) : id;
    const t = token.trim().toLowerCase();
    if (t) tokens.push(t);
  }
  return tokens;
}

export function mergeSelected(
  prev: FiltersState["selected"],
  next?: FiltersState["selected"]
): FiltersState["selected"] {
  if (!next) return prev;
  const out: FiltersState["selected"] = { ...prev };
  for (const key of Object.keys(next)) {
    const s = next[key];
    if (s instanceof Set) out[key] = new Set(s);
  }
  return out;
}

export function filterHotels(hotels: Hotel[], filters: FiltersState): Hotel[] {
  const sel = filters.selected;
  const catTokens = selectedCategoryTokens(sel);

  const anyIn = (g: string, pred: (id: string) => boolean) =>
    (sel[g] ? Array.from(sel[g]!) : []).some(pred);

  return hotels.filter((h) => {
    const p = priceOf(h);
    if (p != null) {
      if (filters.priceMin != null && p < (filters.priceMin ?? -Infinity))
        return false;
      if (filters.priceMax != null && p > (filters.priceMax ?? Infinity))
        return false;
    }

    if (sel.review && sel.review.size > 0) {
      let minRequired = 0;
      for (const raw of Array.from(sel.review)) {
        const v = String(raw).toLowerCase();
        if (v.includes("9")) minRequired = Math.max(minRequired, 9);
        else if (v.includes("8")) minRequired = Math.max(minRequired, 8);
        else if (v.includes("7")) minRequired = Math.max(minRequired, 7);
        else if (v.includes("6")) minRequired = Math.max(minRequired, 6);
        if (v.includes("superb")) minRequired = Math.max(minRequired, 9);
        if (v.includes("very good")) minRequired = Math.max(minRequired, 8);
        if (v === "good" || v.includes("good:"))
          minRequired = Math.max(minRequired, 7);
        if (v.includes("pleasant")) minRequired = Math.max(minRequired, 6);
      }
      if (minRequired > 0 && ratingOf(h) < minRequired) return false;
    }

    if (sel.stars && sel.stars.size > 0) {
      const hotelStarsRaw = starsOf(h);
      const hotelStarsFloored = Math.floor(hotelStarsRaw);
      const match = [...sel.stars].some((id) => {
        const token = String(id).toLowerCase();
        const val = Number(token.replace("stars_", ""));
        if (Number.isFinite(val)) {
          return hotelStarsFloored === val;
        }
        if (token.includes("plus")) {
          const base = Number(token.replace(/[^0-9]/g, ""));
          return Number.isFinite(base) && hotelStarsFloored >= base;
        }
        return false;
      });
      if (!match) return false;
    }

    if (sel.ptype && sel.ptype.size > 0) {
      const t = typeOf(h);
      if (![...sel.ptype].some((id) => t.includes(id.replace(/^pt_/, ""))))
        return false;
    }

    if (sel.facilities && sel.facilities.size > 0) {
      const a = amens(h);
      if (
        ![...sel.facilities].every((id) =>
          a.includes(id.replace(/^amen_/, "").toLowerCase())
        )
      )
        return false;
    }

    if (sel.meals?.has("meal_breakfast") && !meals(h).has("breakfast included"))
      return false;
    if (sel.meals?.has("meal_all") && !meals(h).has("all-inclusive"))
      return false;

    const payFlags = pay(h);
    if (sel.payment?.has("pay_free_cxl") && !payFlags.free) return false;
    if (sel.payment?.has("pay_no_prepay") && !payFlags.noPre) return false;
    if (sel.payment?.has("pay_online") && !payFlags.online) return false;

    if (sel.distance && sel.distance.size > 0) {
      const d = dist(h);
      const need =
        (sel.distance.has("dist_<1") && d != null && d < 1) ||
        (sel.distance.has("dist_<3") && d != null && d < 3) ||
        (sel.distance.has("dist_<5") && d != null && d < 5);
      if (!need) return false;
    }

    if (sel.neighborhood && sel.neighborhood.size > 0) {
      const hv = hood(h);
      if (
        ![...sel.neighborhood].some((id) =>
          hv.includes(id.replace(/^hood_/, ""))
        )
      )
        return false;
    }

    if (sel.brands && sel.brands.size > 0) {
      const b = brand(h);
      if (![...sel.brands].some((id) => b.includes(id.replace(/^brand_/, ""))))
        return false;
    }

    if (catTokens.length > 0) {
      const cset = catsSet(h);
      const catsArr = Array.from(cset);
      const hasAll = catTokens.every((t) => catsArr.some((c) => c.includes(t)));
      if (!hasAll) return false;
    }

    if (sel.popular && sel.popular.size > 0) {
      for (const raw of Array.from(sel.popular)) {
        const v = String(raw).toLowerCase();
        if (v.includes("breakfast") && !meals(h).has("breakfast included"))
          return false;
        if (v.includes("parking") && !amens(h).includes("parking"))
          return false;
        if (v.includes("hotels") && !typeOf(h).includes("hotel")) return false;
        if (v.includes("apartments") && !typeOf(h).includes("apartment"))
          return false;
        if (v.includes("hostels") && !typeOf(h).includes("hostel"))
          return false;
        if (v.includes("9+") || v.includes("superb")) {
          if (ratingOf(h) < 9) return false;
        }
        if (v.includes("8+") || v.includes("very good")) {
          if (ratingOf(h) < 8) return false;
        }
      }
    }

    return true;
  });
}
