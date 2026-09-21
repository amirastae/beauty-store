"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";

type CompareState = {
  ids: string[];
  toggle: (id: string) => void;
  remove: (id: string) => void;
  clear: () => void;
  has: (id: string) => boolean;
};

const catalogIds = new Set(products.map((product) => product.id));

export const useCompare = create<CompareState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => {
          if (state.ids.includes(id)) {
            return { ids: state.ids.filter((item) => item !== id) };
          }
          const next = [...state.ids, id];
          return { ids: next.slice(-3) };
        }),
      remove: (id) => set((state) => ({ ids: state.ids.filter((item) => item !== id) })),
      clear: () => set({ ids: [] }),
      has: (id) => get().ids.includes(id)
    }),
    {
      name: "veloura-compare-v1",
      version: 2,
      merge: (persisted, current) => {
        const saved = persisted as Partial<CompareState>;
        const ids = Array.isArray(saved.ids)
          ? [...new Set(saved.ids.filter((id) => typeof id === "string" && catalogIds.has(id)))].slice(-3)
          : [];
        return { ...current, ids };
      }
    }
  )
);
