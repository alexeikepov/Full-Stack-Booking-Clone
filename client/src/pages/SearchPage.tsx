import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Hotel } from "@/types/hotel";
import HotelCard from "@/components/HotelCard";

function fetchHotels(params: URLSearchParams) {
  return api
    .get<Hotel[]>("/api/hotels", { params: Object.fromEntries(params.entries()) })
    .then((r) => r.data);
}

export default function SearchPage() {
  const [params] = useSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels", Object.fromEntries(params.entries())],
    queryFn: () => fetchHotels(params),
    enabled: Boolean(params.get("city")),
  });

  if (!params.get("city")) return <div>Enter search parameters and click Search.</div>;
  if (isLoading) return <SearchSkeleton />;
  if (error) return <div>Failed to load hotels.</div>;

  return (
    <div className="mx-auto max-w-6xl space-y-4">
      <header className="sticky top-0 z-10 bg-background/80 py-3 backdrop-blur">
        <h2 className="text-xl font-semibold">
          {`Found ${data?.length ?? 0} places in ${params.get("city")}`}
        </h2>
        {/* Optional: filters bar placeholder */}
        <div className="mt-2 flex flex-wrap gap-2 text-sm">
          <button className="rounded-full border px-3 py-1">Breakfast</button>
          <button className="rounded-full border px-3 py-1">Free cancellation</button>
          <button className="rounded-full border px-3 py-1">8+ rating</button>
          <button className="rounded-full border px-3 py-1">Pool</button>
        </div>
      </header>

      {data && data.length > 0 ? (
        <div className="space-y-3">
          {data.map((h) => (
            <HotelCard key={h.id} hotel={h} />
          ))}
        </div>
      ) : (
        <div>No results.</div>
      )}
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="mx-auto max-w-6xl space-y-3">
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={i}
          className="flex animate-pulse gap-4 rounded-xl border p-3 sm:flex-row"
        >
          <div className="h-40 w-full rounded-lg bg-muted sm:w-[260px]" />
          <div className="flex w-full flex-1 flex-col gap-3">
            <div className="h-5 w-1/2 rounded bg-muted" />
            <div className="h-4 w-1/3 rounded bg-muted" />
            <div className="h-4 w-2/3 rounded bg-muted" />
            <div className="mt-auto flex justify-between">
              <div className="h-4 w-24 rounded bg-muted" />
              <div className="h-8 w-28 rounded bg-muted" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
