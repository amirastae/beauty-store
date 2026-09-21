"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

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
          ids: [id, ...state.ids.filter((item) => item !== id)].slice(0, 12)
        })),
      clear: () => set({ ids: [] })
    }),
    { name: "veloura-recent-v1", version: 1 }
  )
);
