import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/stores/cart";

export default function HotelPage() {
  const { id } = useParams();
  const add = useCartStore((s) => s.add);

  const { data, isLoading } = useQuery({
    queryKey: ["hotel", id],
    queryFn: async () => (await api.get(`/api/hotels/${id}`)).data,
    enabled: Boolean(id),
  });

  if (isLoading) return <div>Loading...</div>;
  if (!data) return <div>Not found</div>;

  return (
    <div className="grid gap-4">
      <h1 className="text-2xl font-semibold">{data.name}</h1>
      <div className="opacity-80">{data.city}</div>
      <div className="opacity-80">Rating: {data.rating}</div>

      <Button
        onClick={() =>
          add({
            id: `${id}-std`,
            title: `${data.name} · Standard`,
            price: data.priceFrom,
            nights: 1,
            guests: 2,
          })
        }
      >
        Add Standard room
      </Button>
    </div>
  );
}
