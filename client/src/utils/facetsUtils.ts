import type { Hotel } from "@/types/hotel";
import type { FacetGroup } from "@/utils/buildFacets";
import { catsSet } from "./hotelUtils";

export function categoriesFacet(hotels: Hotel[]): FacetGroup {
  const counts = new Map<string, number>();
  for (const h of hotels) {
    const set = catsSet(h);
    for (const c of set) counts.set(c, (counts.get(c) ?? 0) + 1);
  }
  const items = Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([label, count]) => ({
      id: `cat_${label}`,
      label,
      count,
    }));
  return { key: "categories", title: "categories", items };
}
