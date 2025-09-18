import { create } from "zustand";

interface NavigationTabsState {
  showTabs: boolean;
  setShowTabs: (show: boolean) => void;
}

export const useNavigationTabsStore = create<NavigationTabsState>((set) => ({
  showTabs: true,
  setShowTabs: (show) => set({ showTabs: show }),
}));
