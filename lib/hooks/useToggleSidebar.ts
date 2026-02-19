import { create } from "zustand";

const useToggleSidebar = create<{ isOpen: boolean; toggle: () => void }>(
  (set) => ({
    isOpen: true,
    toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  }),
);

export default useToggleSidebar;
