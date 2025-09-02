import { create } from "zustand";

type UiState = {
  cartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  confirmOpen: boolean;
  openConfirm: () => void;
  closeConfirm: () => void;
};

export const useUiStore = create<UiState>((set) => ({
  cartOpen: false,
  openCart: () => set({ cartOpen: true }),
  closeCart: () => set({ cartOpen: false }),
  confirmOpen: false,
  openConfirm: () => set({ confirmOpen: true }),
  closeConfirm: () => set({ confirmOpen: false }),
}));
