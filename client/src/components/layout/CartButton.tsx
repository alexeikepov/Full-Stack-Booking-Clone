import { Button } from "@/components/ui/button";
import { useUiStore } from "@/stores/ui";
import { useCartStore } from "@/stores/cart";

export function CartButton() {
  const open = useUiStore((s) => s.openCart);
  const count = useCartStore((s) => s.count());
  return (
    <Button variant="secondary" onClick={open}>
      Cart {count ? `(${count})` : ""}
    </Button>
  );
}
