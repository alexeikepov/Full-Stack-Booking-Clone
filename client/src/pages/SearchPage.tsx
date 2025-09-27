import { useMemo, useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import SearchTopBar from "@/components/search/HeroSearch";
import {
  FiltersSidebar,
  SearchHeader,
  HotelList,
  Breadcrumb,
} from "@/components/searchPage";
import type { FiltersState } from "@/components/searchPage/FiltersSidebar";
import { sortHotels, type SortKey } from "@/utils/sortHotels";
import { buildFacets, type FacetGroup } from "@/utils/buildFacets";
import { categoriesFacet } from "@/utils/facetsUtils";
import {
  nightsFromParams,
  fetchHotels,
  mergeSelected,
  filterHotels,
} from "@/utils/searchUtils";
import { priceOf } from "@/utils/hotelUtils";

type ViewMode = "list" | "grid";

export default function SearchPage() {
  const [params, setParams] = useSearchParams();
  const [view, setView] = useState<ViewMode>(
    params.get("view") === "grid" ? "grid" : "list"
  );
  const [sortKey, setSortKey] = useState<SortKey>(
    (params.get("sort") as SortKey) || "price_high"
  );

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
    setFilters((f: FiltersState) => ({
      ...f,
      priceMin: minBound,
      priceMax: maxBound,
    }));
  }, [minBound, maxBound]);

  const updateUrl = (next: Partial<{ sort: string; view: string }>) => {
    const entries = Object.fromEntries(params.entries());
    const merged = { ...entries, ...next };
    const sp = new URLSearchParams(merged);
    setParams(sp, { replace: true });
  };

  const handleFiltersChange = (next: FiltersState) => {
    setFilters((prev: FiltersState) => ({
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
    return filterHotels(sorted, filters);
  }, [sorted, filters]);

  return (
    <div className="min-h-screen bg-white">
      <section className="w-full bg-[#003b95] text-white">
        <div className="mx-auto max-w-6xl px-2">
          <div className="text-3xl font-bold md:text-[1px]">&nbsp;</div>
          <div className="text-2xl mt-2 text-white/90">&nbsp;</div>
        </div>
      </section>

      <div className="relative -mt-8 z-10">
        <SearchTopBar />
      </div>

      <Breadcrumb />

      <div className="mx-auto max-w-[1112px] px-2 sm:px-0">
        <SearchHeader
          isLoading={isLoading}
          filteredCount={filtered.length}
          sortKey={sortKey}
          view={view}
          onSortChange={(k) => {
            setSortKey(k);
            const sp = new URLSearchParams(
              Object.fromEntries(params.entries())
            );
            sp.set("sort", k);
            setParams(sp, { replace: true });
          }}
          onViewChange={(v) => {
            setView(v);
            updateUrl({ view: v });
          }}
        />

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
                ? "grid grid-cols-1 gap-x-[4px] gap-y-[10px] pt-[6px] sm:grid-cols-2 lg:grid-cols-3"
                : "space-y-3"
            }`}
          >
            <HotelList
              hotels={filtered}
              isLoading={isLoading}
              error={error}
              view={view}
              nights={nights}
              city={params.get("city")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
