"use client";

import { create } from "zustand";
import { products } from "@/data/products";
import { persist } from "zustand/middleware";

const MAX_COMPARE_ITEMS = 4;

type CompareState = {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
  isFull: () => boolean;
};

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => {
          if (state.ids.includes(id)) {
            return { ids: state.ids.filter((item) => item !== id) };
          }
          if (state.ids.length >= MAX_COMPARE_ITEMS) return state;
          return { ids: [...state.ids, id] };
        }),
      remove: (id) => set((state) => ({ ids: state.ids.filter((item) => item !== id) })),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id),
      isFull: () => get().ids.length >= MAX_COMPARE_ITEMS
    }),
    { name: "veloura-compare-v1", version: 1,       skipHydration: true }
  )
);
