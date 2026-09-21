"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";

const MAX_RECENT = 8;

type RecentState = {
  ids: string[];
  visit: (id: string) => void;
  clear: () => void;
};

export const useRecent = create<RecentState>()(
  persist(
    (set) => ({
      ids: [],
      visit: (id) =>
        set((state) => ({
          ids: [id, ...state.ids.filter((item) => item !== id)].slice(0, MAX_RECENT)
        })),
      clear: () => set({ ids: [] })
    }),
    {
      name: "veloura-recent-v1",
      version: 1,
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = persisted as Partial<RecentState>;
        const allowed = new Set(products.map((product) => product.id));
        const ids = Array.isArray(saved.ids)
          ? saved.ids.filter((id) => allowed.has(id)).slice(0, MAX_RECENT)
          : [];
        return { ...current, ids };
      }
    }
  )
);
