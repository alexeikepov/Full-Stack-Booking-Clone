import HotelsMap from "@/components/maps/HotelsMap";
import { useQuery } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { api } from "@/lib/api";

export default function MapToggle() {
  const [params] = useSearchParams();
  const { data } = useQuery({
    queryKey: ["hotels", Object.fromEntries(params.entries())],
    queryFn: async () => {
      const { data } = await api.get("/api/hotels", {
        params: Object.fromEntries(params.entries()),
      });
      return Array.isArray(data) ? data : data?.items ?? [];
    },
  });
  return (
    <div className="rounded-lg border overflow-hidden" style={{ height: 360 }}>
      <HotelsMap hotels={data as any[]} />
    </div>
  );
}
