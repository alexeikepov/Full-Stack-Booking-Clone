import { create } from "zustand";
import { persist, devtools } from "zustand/middleware";

export type CartItem = {
  id: string; // room id
  title: string;
  price: number;
  nights: number;
  guests: number;
};

type CartState = {
  items: CartItem[];
  add: (item: CartItem) => void;
  update: (
    id: string,
    patch: Partial<Pick<CartItem, "nights" | "guests">>
  ) => void;
  remove: (id: string) => void;
  clear: () => void;
  subtotal: () => number;
  count: () => number;
};

export const useCartStore = create<CartState>()(
  devtools(
    persist(
      (set, get) => ({
        items: [],
        add: (item) =>
          set(
            (s) => {
              const ex = s.items.find((i) => i.id === item.id);
              if (ex) {
                return {
                  items: s.items.map((i) =>
                    i.id === item.id
                      ? { ...i, nights: i.nights + item.nights }
                      : i
                  ),
                };
              }
              return { items: [...s.items, item] };
            },
            false,
            "cart/add"
          ),
        update: (id, patch) =>
          set(
            (s) => ({
              items: s.items.map((i) => (i.id === id ? { ...i, ...patch } : i)),
            }),
            false,
            "cart/update"
          ),
        remove: (id) =>
          set(
            (s) => ({ items: s.items.filter((i) => i.id !== id) }),
            false,
            "cart/remove"
          ),
        clear: () => set({ items: [] }, false, "cart/clear"),
        subtotal: () =>
          get().items.reduce((sum, i) => sum + i.price * i.nights, 0),
        count: () => get().items.length,
      }),

      { name: "booking-cart" }
    ),
    { name: "cart-store" }
  )
);
