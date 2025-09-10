// src/routes/SearchResultsPage.tsx
import { useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { searchHotels } from "@/lib/api";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

function useQueryObj() {
  const { search } = useLocation();
  return useMemo(() => Object.fromEntries(new URLSearchParams(search)), [search]);
}

export default function SearchResultsPage() {
  const qp = useQueryObj();

  const { data, isLoading, error } = useQuery({
    queryKey: ["hotels", qp],
    queryFn: () =>
      searchHotels({
        q: qp.q,
        city: qp.city,
        roomType: qp.roomType as any,
        minPrice: qp.minPrice ? Number(qp.minPrice) : undefined,
        maxPrice: qp.maxPrice ? Number(qp.maxPrice) : undefined,
        category: qp.category,
        from: qp.from,
        to: qp.to,
        adults: qp.adults ? Number(qp.adults) : undefined,
        children: qp.children ? Number(qp.children) : undefined,
        rooms: qp.rooms ? Number(qp.rooms) : undefined,
      }),
  });

  if (isLoading) return <div className="max-w-6xl mx-auto p-4">Loading…</div>;
  if (error) return <div className="max-w-6xl mx-auto p-4">Failed to load</div>;

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-3">
      <h2 className="text-2xl font-bold">Search results ({data?.length ?? 0})</h2>
      {!data?.length && <div>No hotels found</div>}

      {data?.map((h: any) => (
        <Card key={h._id ?? h.id} className="p-4 flex gap-4 items-center">
          <img
            src={h?.media?.[0]?.url ?? "https://picsum.photos/seed/h/160/120"}
            alt={h.name}
            className="w-40 h-28 object-cover rounded"
          />
          <div className="min-w-0 flex-1">
            <div className="font-bold text-lg truncate">{h.name}</div>
            <div className="text-sm text-muted-foreground">{h.city} • {h.country}</div>
            {h.availability?.totalAvailable !== undefined && (
              <div className="text-sm mt-1">
                Available: <b>{h.availability.totalAvailable}</b>
              </div>
            )}
          </div>
          <Button asChild>
            <Link to={`/hotels/${h._id ?? h.id}`}>View</Link>
          </Button>
        </Card>
      ))}
    </div>
  );
}
