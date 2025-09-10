import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Hotel } from "@/types/hotel";
import HotelCard from "@/components/HotelCard";
import FiltersSidebar from "@/components/FiltersSidebar";

function parseNights(params: URLSearchParams): number | null {
  const from = params.get("from");
  const to = params.get("to");
  if (!from || !to) return null;
  const s = new Date(from);
  const e = new Date(to);
  if (isNaN(+s) || isNaN(+e) || e <= s) return null;
  const diff = Math.ceil((+e - +s) / (1000 * 60 * 60 * 24));
  return Math.max(1, diff);
}

function fetchHotels(params: URLSearchParams) {
  return api
    .get<Hotel[]>("/api/hotels", { params: Object.fromEntries(params.entries()) })
    .then((r) => r.data);
}

export default function SearchPage() {
  const [params] = useSearchParams();
  const nights = parseNights(params);

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels", Object.fromEntries(params.entries())],
    queryFn: () => fetchHotels(params),
    enabled: Boolean(params.get("city")),
  });

  if (!params.get("city")) return <div>Enter search parameters and click Search.</div>;
  if (isLoading) return <SearchSkeleton />;
  if (error) return <div>Failed to load hotels.</div>;

  return (
    <div className="mx-auto max-w-[1100px] space-y-4">
      {/* top controls like Booking */}
      <div className="sticky top-14 z-10 flex items-center justify-between rounded-lg border bg-background/90 px-3 py-2 backdrop-blur">
        <div className="text-lg font-semibold">
          {params.get("city")}: {data?.length ?? 0} properties found
        </div>
        <button className="inline-flex items-center gap-2 rounded-md border px-3 py-1.5 text-sm hover:bg-muted">
          Sort by: <span className="font-medium text-[#0071c2]">Price (highest first)</span>
        </button>
      </div>

      <div className="flex items-start gap-4">
        <FiltersSidebar />

        <div className="flex-1 space-y-3">
          {data && data.length > 0 ? (
            data.map((h) => <HotelCard key={h.id} hotel={h} nights={nights} />)
          ) : (
            <div>No results.</div>
          )}
        </div>
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="mx-auto max-w-[1100px] space-y-3">
      <div className="h-10 rounded-lg border bg-muted/40" />
      <div className="flex gap-4">
        <div className="hidden w-72 rounded-lg border p-3 lg:block" />
        <div className="flex-1 space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="flex animate-pulse gap-4 rounded-xl border p-3 sm:flex-row">
              <div className="h-40 w-full rounded-lg bg-muted sm:w-[260px]" />
              <div className="flex w-full flex-1 flex-col gap-3">
                <div className="h-6 w-1/2 rounded bg-muted" />
                <div className="h-4 w-2/3 rounded bg-muted" />
                <div className="mt-auto h-8 w-28 rounded bg-muted" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
