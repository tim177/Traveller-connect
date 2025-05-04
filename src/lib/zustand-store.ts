import { create } from "zustand";

//UI Store
interface UIState {
  activeTab: "feed" | "blogs" | "escalations" | "itinerary";
  sidebarOpen: boolean;
  setActiveTab: (tab: "feed" | "blogs" | "escalations" | "itinerary") => void;
  setSidebarOpen: (open: boolean) => void;
  toogleSidebar: () => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeTab: "feed",
  sidebarOpen: false,
  setActiveTab: (activeTab) => set({ activeTab }),
  setSidebarOpen: (sidebarOpen) => set({ sidebarOpen }),
  toogleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
}));
