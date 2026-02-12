import { create } from "zustand";

const useSubNavbarTab = create<{
  tabComponent: React.ReactNode;
  setTabComponent: (component: React.ReactNode) => void;
}>((set) => ({
  tabComponent: null,
  setTabComponent: (component: React.ReactNode) =>
    set({ tabComponent: component }),
}));

export default useSubNavbarTab;