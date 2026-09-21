"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products } from "@/data/products";

type WishlistState = {
  ids: string[];
  toggle: (id: string) => void;
  has: (id: string) => boolean;
  clear: () => void;
};

export const useWishlist = create<WishlistState>()(
  persist(
    (set, get) => ({
      ids: [],
      toggle: (id) =>
        set((state) => ({
          ids: state.ids.includes(id)
            ? state.ids.filter((item) => item !== id)
            : [...state.ids, id]
        })),
      has: (id) => get().ids.includes(id),
      clear: () => set({ ids: [] })
    }),
    {
      name: "veloura-wishlist-v1",
      version: 1,
      skipHydration: true,
      merge: (persisted, current) => {
        const saved = persisted as Partial<WishlistState>;
        const allowed = new Set(products.map((product) => product.id));
        const ids = Array.isArray(saved.ids)
          ? saved.ids.filter((id) => allowed.has(id))
          : [];

        return { ...current, ids };
      }
    }
  )
);
