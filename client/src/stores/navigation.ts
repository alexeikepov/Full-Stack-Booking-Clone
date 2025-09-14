import { create } from 'zustand';

export type TabType = 'stays' | 'flights' | 'cars' | 'attractions' | 'taxis';

interface NavigationState {
  activeTab: TabType;
  setActiveTab: (tab: TabType) => void;
}

export const useNavigationStore = create<NavigationState>((set) => ({
  activeTab: 'stays',
  setActiveTab: (tab) => set({ activeTab: tab }),
}));
