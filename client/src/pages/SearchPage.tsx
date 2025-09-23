import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import { api } from "@/lib/api";
import type { Hotel } from "@/types/hotel";
import SearchTopBar from "@/components/search/HeroSearch";
import FiltersSidebar, {
  type FiltersState,
} from "@/components/searchPage/FiltersSidebar";
import HotelCard from "@/components/searchPage/HotelCard";
import InfoNotice from "@/components/searchPage/InfoNotice";
import SortBar from "@/components/searchPage/SortBar";
import { sortHotels, type SortKey } from "@/utils/sortHotels";
import { buildFacets, type FacetGroup } from "@/utils/buildFacets";

type ViewMode = "list" | "grid";

const n = (v: unknown): number | null =>
  Number.isFinite(Number(v)) ? Number(v) : null;
const priceOf = (h: Hotel) =>
  n((h as any).totalPrice) ?? n((h as any).priceFrom);
const ratingOf = (h: Hotel) => n((h as any).averageRating) ?? 0;
const starsOf = (h: Hotel) => n((h as any).stars) ?? 0;

function toStringArray(val: unknown): string[] {
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

const catsSet = (h: Hotel) =>
  new Set<string>(
    toStringArray((h as any).categories).map((s) => s.toLowerCase())
  );

const typeOf = (h: Hotel) => {
  const fromField = String(
    (h as any).propertyType ?? (h as any).type ?? ""
  ).toLowerCase();
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

const amens = (h: Hotel) => {
  const base = Array.isArray((h as any).amenityIds)
    ? (h as any).amenityIds
    : (h as any).amenities ?? [];
  const normalized = base.map((x: any) => String(x).toLowerCase());
  const merged = new Set<string>([...normalized, ...catsSet(h)]);
  return Array.from(merged);
};

const meals = (h: Hotel) => {
  const fromField = new Set<string>(
    toStringArray((h as any).meals).map((s) => s.toLowerCase())
  );
  const c = catsSet(h);
  if (c.has("breakfast included")) fromField.add("breakfast included");
  if (c.has("all-inclusive")) fromField.add("all-inclusive");
  return fromField;
};

const pay = (h: Hotel) => {
  const p = (h as any).paymentOptions ?? {};
  const c = catsSet(h);
  return {
    free:
      Boolean((h as any).freeCancellation) ||
      Boolean((p as any).freeCancellation) ||
      c.has("free cancellation"),
    noPre:
      Boolean((h as any).noPrepayment) ||
      Boolean((p as any).noPrepayment) ||
      c.has("no prepayment"),
    online:
      Boolean((h as any).acceptsOnlinePayments) ||
      Boolean((p as any).acceptsOnlinePayments) ||
      Boolean((p as any).onlinePayments) ||
      c.has("accepts online payments"),
  };
};

const dist = (h: Hotel) =>
  n((h as any).distanceKm) ??
  n((h as any).distance_km) ??
  n((h as any).distanceFromCenterKm);
const hood = (h: Hotel) =>
  String((h as any).neighborhood ?? (h as any).area ?? "").toLowerCase();
const brand = (h: Hotel) =>
  String((h as any).brand ?? (h as any).chain ?? "").toLowerCase();

function nightsFromParams(params: URLSearchParams): number | null {
  const from = params.get("from");
  const to = params.get("to");
  if (!from || !to) return null;
  const s = new Date(from);
  const e = new Date(to);
  if (isNaN(+s) || isNaN(+e) || e <= s) return null;
  return Math.max(1, Math.ceil((+e - +s) / (1000 * 60 * 60 * 24)));
}

async function fetchHotels(params: URLSearchParams) {
  const { data } = await api.get<Hotel[] | { items: Hotel[] }>("/api/hotels", {
    params: Object.fromEntries(params.entries()),
  });
  if (Array.isArray(data)) return data;
  return (data as any)?.items ?? [];
}

function categoriesFacet(hotels: Hotel[]): FacetGroup {
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
  return { key: "categories", title: "Categories", items };
}

function selectedCategoryTokens(selected: FiltersState["selected"]): string[] {
  const tokens: string[] = [];
  for (const [, set] of Object.entries(selected)) {
    if (!set) continue;
    for (const id of Array.from(set)) {
      if (id.startsWith("cat_")) tokens.push(id.slice(4).toLowerCase());
    }
  }
  return tokens;
}

type SelectedMap = FiltersState["selected"];

function mergeSelected(prev: SelectedMap, next?: SelectedMap): SelectedMap {
  if (!next) return prev;
  const out: SelectedMap = { ...prev };
  for (const key of Object.keys(next)) {
    const s = next[key];
    if (s instanceof Set) out[key] = new Set(s);
  }
  return out;
}

function NoResultsPanel({ city }: { city: string | null }) {
  return (
    <div className="flex flex-1 items-center justify-center">
      <div className="mx-auto w-full max-w-[680px] rounded-xl border border-[#e7e7e7] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
        <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-muted-foreground/30 p-3">
          <svg viewBox="0 0 24 24" className="h-full w-full" aria-hidden="true">
            <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79L20 21.5 21.5 20l-6-6zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z" />
          </svg>
        </div>
        <h2 className="text-lg font-semibold">
          {city ? `${city}: 0 properties found` : "0 properties found"}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          There are no matching properties for your search criteria. Try
          updating your search.
        </p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="mt-4 inline-flex items-center rounded-md bg-[#0071c2] px-4 py-2 text-sm font-medium text-white hover:bg-[#005fa3]"
        >
          Update search
        </button>
      </div>
    </div>
  );
}

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<ViewMode>(
    params.get("view") === "grid" ? "grid" : "list"
  );
  const [sortKey, setSortKey] = useState<SortKey>(
    (params.get("sort") as SortKey) || "price_high"
  );

  // Scroll to top when component mounts or params change
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [params]);

  const nights = nightsFromParams(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels", Object.fromEntries(params.entries())],
    queryFn: () => fetchHotels(params),
    enabled: true,
    retry: 1,
    retryDelay: 1000,
  });

  // Debug logging
  if (process.env.NODE_ENV === "development") {
    console.log("SearchPage render:", {
      data,
      isLoading,
      error,
      params: Object.fromEntries(params.entries()),
    });
  }

  const [minBound, maxBound] = useMemo(() => {
    const prices = (data ?? [])
      .map(priceOf)
      .filter((v: number | null): v is number => v != null);
    if (!prices.length) return [0, 0] as const;
    return [Math.min(...prices), Math.max(...prices)] as const;
  }, [data]);

  const baseFacets: FacetGroup[] = useMemo(
    () => buildFacets(data ?? []),
    [data]
  );
  const catFacet: FacetGroup = useMemo(
    () => categoriesFacet(data ?? []),
    [data]
  );
  const facets: FacetGroup[] = useMemo(
    () => [...baseFacets, catFacet],
    [baseFacets, catFacet]
  );

  const [filters, setFilters] = useState<FiltersState>({
    priceMin: minBound,
    priceMax: maxBound,
    selected: {},
  });

  useMemo(() => {
    setFilters((f) => ({ ...f, priceMin: minBound, priceMax: maxBound }));
  }, [minBound, maxBound]);

  const updateUrl = (next: Partial<{ sort: string; view: string }>) => {
    const entries = Object.fromEntries(params.entries());
    const merged = { ...entries, ...next };
    const sp = new URLSearchParams(merged);
    setParams(sp, { replace: true });
  };

  const handleFiltersChange = (next: FiltersState) => {
    setFilters((prev) => ({
      priceMin: next.priceMin ?? prev.priceMin,
      priceMax: next.priceMax ?? prev.priceMax,
      selected: mergeSelected(prev.selected, next.selected),
    }));
  };

  const sorted = useMemo(
    () => (data ? sortHotels(data, sortKey) : []),
    [data, sortKey]
  );

  const filtered = useMemo(() => {
    const sel = filters.selected;
    const catTokens = selectedCategoryTokens(sel);

    const anyIn = (g: string, pred: (id: string) => boolean) =>
      (sel[g] ? Array.from(sel[g]!) : []).some(pred);

    return sorted.filter((h) => {
      const p = priceOf(h);
      if (p != null) {
        if (filters.priceMin != null && p < (filters.priceMin ?? -Infinity))
          return false;
        if (filters.priceMax != null && p > (filters.priceMax ?? Infinity))
          return false;
      }

      if (
        anyIn("review", (id) => {
          const r = ratingOf(h);
          if (id === "rv_9") return r >= 9;
          if (id === "rv_8") return r >= 8;
          if (id === "rv_7") return r >= 7;
          if (id === "rv_6") return r >= 6;
          return false;
        }) &&
        !(
          (sel.review?.has("rv_9") && ratingOf(h) >= 9) ||
          (sel.review?.has("rv_8") && ratingOf(h) >= 8) ||
          (sel.review?.has("rv_7") && ratingOf(h) >= 7) ||
          (sel.review?.has("rv_6") && ratingOf(h) >= 6)
        )
      )
        return false;

      if (sel.stars && sel.stars.size > 0) {
        if (
          ![...sel.stars].some(
            (id) => Number(id.replace("stars_", "")) === starsOf(h)
          )
        )
          return false;
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

      if (
        sel.meals?.has("meal_breakfast") &&
        !meals(h).has("breakfast included")
      )
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
        if (
          ![...sel.brands].some((id) => b.includes(id.replace(/^brand_/, "")))
        )
          return false;
      }

      if (catTokens.length > 0) {
        const cset = catsSet(h);
        const hasAll = catTokens.every((t) => cset.has(t));
        if (!hasAll) return false;
      }

      if (
        sel.popular?.has("popular_breakfast") &&
        !meals(h).has("breakfast included")
      )
        return false;
      if (sel.popular?.has("popular_parking") && !amens(h).includes("parking"))
        return false;
      if (sel.popular?.has("popular_hotels") && !typeOf(h).includes("hotel"))
        return false;
      if (
        sel.popular?.has("popular_apartments") &&
        !typeOf(h).includes("apartment")
      )
        return false;
      if (sel.popular?.has("popular_review8") && ratingOf(h) < 8) return false;
      if (sel.popular?.has("popular_hostels") && !typeOf(h).includes("hostel"))
        return false;
      if (sel.popular?.has("popular_review9") && ratingOf(h) < 9) return false;

      return true;
    });
  }, [sorted, filters]);

  return (
    <div className="min-h-screen bg-white">
      {/* Blue background section for spacing like on home page */}
      <section className="w-full bg-[#003b95] text-white">
        <div className="mx-auto max-w-6xl px-2">
          <div className="text-3xl font-bold md:text-[1px]">&nbsp;</div>
          <div className="text-2xl mt-2 text-white/90">&nbsp;</div>
        </div>
      </section>

      {/* Search Bar - Overlapping between blue and white */}
      <div className="relative -mt-8 z-10">
        <SearchTopBar />
      </div>

      {/* Breadcrumb */}
      <div className="bg-white">
        <div className="mx-auto max-w-6xl px-4 py-2">
          <nav className="text-sm text-gray-500">
            <Link to="/" className="text-[#0071c2] hover:underline">
              Home
            </Link>
            <span className="mx-2">›</span>
            <Link to="#" className="text-[#0071c2] hover:underline">
              Israel
            </Link>
            <span className="mx-2">›</span>
            <Link to="#" className="text-[#0071c2] hover:underline">
              {params.get("city") ?? "City"}
            </Link>
            <span className="mx-2">›</span>
            <span>Search results</span>
          </nav>
        </div>
      </div>

      <div className="mx-auto max-w-[1112px] px-2 sm:px-0">
        <h1 className="text-[18px] font-semibold">
          {params.get("city") ?? "city"}: {isLoading ? "…" : filtered.length}{" "}
          properties found
        </h1>

        <div className="mt-2 flex items-center justify-between">
          <SortBar
            value={sortKey}
            onChange={(k) => {
              setSortKey(k);
              const sp = new URLSearchParams(
                Object.fromEntries(params.entries())
              );
              sp.set("sort", k);
              setParams(sp, { replace: true });
            }}
          />
          <div className="hidden items-center gap-2 sm:flex">
            <button
              onClick={() => {
                setView("list");
                updateUrl({ view: "list" });
              }}
              className={`rounded-md border px-2 py-1 text-[12px] ${
                view === "list" ? "bg-muted" : ""
              }`}
            >
              List
            </button>
            <button
              onClick={() => {
                setView("grid");
                updateUrl({ view: "grid" });
              }}
              className={`rounded-md border px-2 py-1 text-[12px] ${
                view === "grid" ? "bg-muted" : ""
              }`}
            >
              Grid
            </button>
          </div>
        </div>

        <div className="mt-2">
          <InfoNotice>
            Please review any travel advisories provided by your government to
            make an informed decision about your stay in this area, which may be
            considered conflict-affected.
          </InfoNotice>
        </div>

        <div className="mt-3 flex items-start gap-4 pb-10">
          <FiltersSidebar
            bounds={{ min: minBound, max: maxBound }}
            value={filters}
            onChange={handleFiltersChange}
            facets={facets}
          />

          <div
            className={`flex-1 ${
              view === "grid"
                ? "grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-3"
            }`}
          >
            {error && (
              <div className="flex flex-1 items-center justify-center">
                <div className="mx-auto w-full max-w-[680px] rounded-xl border border-[#e7e7e7] bg-white p-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04)]">
                  <div className="mx-auto mb-4 h-14 w-14 rounded-full border border-red-500/30 p-3">
                    <svg
                      viewBox="0 0 24 24"
                      className="h-full w-full text-red-500"
                      aria-hidden="true"
                    >
                      <path
                        fill="currentColor"
                        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"
                      />
                    </svg>
                  </div>
                  <h2 className="text-lg font-semibold text-red-600">
                    Error loading hotels
                  </h2>
                  <p className="mt-1 text-sm text-gray-600">
                    {error.message ||
                      "Failed to load hotel data. Please try again."}
                  </p>
                  <button
                    onClick={() => window.location.reload()}
                    className="mt-4 inline-flex items-center rounded-md bg-[#0071c2] px-4 py-2 text-sm font-medium text-white hover:bg-[#005fa3]"
                  >
                    Retry
                  </button>
                </div>
              </div>
            )}

            {isLoading &&
              Array.from({ length: 4 }).map((_, i) =>
                view === "grid" ? (
                  <div key={i} className="rounded-xl border p-3">
                    <div className="h-44 w-full rounded-lg bg-muted" />
                    <div className="mt-3 h-5 w-1/2 rounded bg-muted" />
                    <div className="mt-2 h-4 w-2/3 rounded bg-muted" />
                    <div className="mt-4 h-8 w-28 rounded bg-muted" />
                  </div>
                ) : (
                  <div
                    key={i}
                    className="flex animate-pulse gap-4 rounded-xl border p-3 sm:flex-row"
                  >
                    <div className="h-40 w-full rounded-lg bg-muted sm:w-[260px]" />
                    <div className="flex w-full flex-1 flex-col gap-3">
                      <div className="h-6 w-1/2 rounded bg-muted" />
                      <div className="h-4 w-2/3 rounded bg-muted" />
                      <div className="mt-auto h-8 w-28 rounded bg-muted" />
                    </div>
                  </div>
                )
              )}

            {!isLoading &&
              !error &&
              filtered.length > 0 &&
              filtered.map((h) => (
                <HotelCard
                  key={h._id.$oid}
                  hotel={h}
                  nights={nights}
                  variant={view}
                />
              ))}

            {!isLoading && !error && filtered.length === 0 && (
              <NoResultsPanel city={params.get("city")} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
