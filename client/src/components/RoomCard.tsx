import { useCartStore } from "@/stores/cart";
import { useUiStore } from "@/stores/ui";
import type { RoomItem } from "@/types/hotel";
import { Button } from "@/components/ui/button";

export function RoomCard({
  room,
}: {
  room: Omit<RoomItem, "nights" | "guests">;
}) {
  const add = useCartStore((s) => s.add);
  const openCart = useUiStore((s) => s.openCart);

  const handleAdd = () => {
    add({ ...room, nights: 1, guests: 2 });
    openCart();
  };

  return (
    <div className="rounded-2xl border p-4">
      <div className="font-medium">{room.title}</div>
      <div className="opacity-70">${room.price} / night</div>
      <Button className="mt-3" onClick={handleAdd}>
        Add to cart
      </Button>
    </div>
  );
}
