import { useUiStore } from "@/stores/ui";
import { useCartStore } from "@/stores/cart";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

export function CartSheet() {
  const open = useUiStore((s) => s.cartOpen);
  const close = useUiStore((s) => s.closeCart);
  const items = useCartStore((s) => s.items);
  const update = useCartStore((s) => s.update);
  const remove = useCartStore((s) => s.remove);
  const clear = useCartStore((s) => s.clear);
  const subtotal = useCartStore((s) => s.subtotal());

  return (
    <Sheet open={open} onOpenChange={(v) => (v ? null : close())}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        <SheetHeader>
          <SheetTitle>Your booking</SheetTitle>
        </SheetHeader>

        <div className="mt-4 space-y-3">
          {items.length === 0 && (
            <div className="opacity-70">Cart is empty</div>
          )}
          {items.map((it) => (
            <div key={it.id} className="flex gap-3 rounded-xl border p-3">
              <div className="flex-1">
                <div className="font-medium">{it.title}</div>
                <div className="text-sm opacity-70">${it.price} / night</div>
                <div className="mt-2 flex items-center gap-2">
                  <label className="text-sm opacity-80">Nights</label>
                  <Input
                    type="number"
                    className="w-24"
                    value={it.nights}
                    min={1}
                    onChange={(e) =>
                      update(it.id, {
                        nights: Math.max(1, Number(e.target.value)),
                      })
                    }
                  />
                  <label className="text-sm opacity-80">Guests</label>
                  <Input
                    type="number"
                    className="w-24"
                    value={it.guests}
                    min={1}
                    onChange={(e) =>
                      update(it.id, {
                        guests: Math.max(1, Number(e.target.value)),
                      })
                    }
                  />
                </div>
              </div>
              <div className="flex flex-col items-end justify-between">
                <div className="text-sm font-semibold">
                  ${it.price * it.nights}
                </div>
                <Button variant="secondary" onClick={() => remove(it.id)}>
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>

        <SheetFooter className="mt-6 flex flex-col gap-3">
          <div className="flex items-center justify-between text-lg">
            <span>Subtotal</span>
            <span className="font-semibold">${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={clear}>
              Clear
            </Button>
            <Button className="flex-1">Proceed to checkout</Button>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}
