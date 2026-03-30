import { create } from "zustand";

type BreadcrumbStore = {
  labels: Record<string, string>;
  setLabel: (key: string, value: string) => void;
  removeLabel: (key: string) => void;
  clearLabels: () => void;
};

export const useBreadcrumbStore = create<BreadcrumbStore>((set) => ({
  labels: {},
  setLabel: (key, value) =>
    set((state) => ({ labels: { ...state.labels, [key]: value } })),
  removeLabel: (key) =>
    set((state) => {
      const { [key]: _, ...rest } = state.labels;
      return { labels: rest };
    }),
  clearLabels: () => set({ labels: {} }),
}));
