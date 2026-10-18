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

const catalogIds = new Set(products.map((product) => product.id));

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
      version: 2,
      merge: (persisted, current) => {
        const saved = persisted as Partial<WishlistState>;
        const ids = Array.isArray(saved.ids)
          ? [...new Set(saved.ids.filter((id) => typeof id === "string" && catalogIds.has(id)))]
          : [];
        return { ...current, ids };
      }
    }
  )
);
