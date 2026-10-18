"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";

type RecentState = {
  ids: string[];
  visit: (id: string) => void;
  clear: () => void;
};

const catalogIds = new Set(products.map((product) => product.id));

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      visit: (id) =>
        set((state) => ({
          ids: [id, ...state.ids.filter((item) => item !== id)].slice(0, 12)
        })),
      clear: () => set({ ids: [] })
    }),
    {
      name: "veloura-recent-v1",
      version: 2,
      merge: (persisted, current) => {
        const saved = persisted as Partial<RecentState>;
        const ids = Array.isArray(saved.ids)
          ? [...new Set(saved.ids.filter((id) => typeof id === "string" && catalogIds.has(id)))].slice(0, 12)
          : [];
        return { ...current, ids };
      }
    }
  )
);
