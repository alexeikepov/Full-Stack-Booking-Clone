import { useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import type { Hotel } from "@/types/hotel";
import HotelCard from "@/components/HotelCard";

function fetchHotels(params: URLSearchParams) {
  return api
    .get<Hotel[]>("/api/hotels", {
      params: Object.fromEntries(params.entries()),
    })
    .then((r) => r.data);
}

export default function SearchPage() {
  const [params] = useSearchParams();

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels", Object.fromEntries(params.entries())],
    queryFn: () => fetchHotels(params),
    enabled: Boolean(params.get("city")),
  });

  if (!params.get("city"))
    return <div>Enter search parameters and click Search.</div>;
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Failed to load hotels.</div>;

  return (
    <div className="grid gap-4">
      <h2 className="text-xl font-semibold">Hotels in {params.get("city")}</h2>
      {data && data.length > 0 ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
