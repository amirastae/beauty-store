"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/data/products";

export type CartLine = {
  product: Product;
  qty: number;
  shadeId?: string;
};

type CartState = {
  lines: CartLine[];
  add: (product: Product, shadeId?: string) => void;
  decrement: (productId: string, shadeId?: string) => void;
  remove: (productId: string, shadeId?: string) => void;
  clear: () => void;
};

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (product, shadeId) =>
        set((state) => {
          const index = state.lines.findIndex(
            (line) => line.product.id === product.id && line.shadeId === shadeId
          );
          if (index === -1) {
            return { lines: [...state.lines, { product, shadeId, qty: 1 }] };
          }
          return {
            lines: state.lines.map((line, i) =>
              i === index ? { ...line, qty: Math.min(line.qty + 1, 20) } : line
            )
          };
        }),
      decrement: (productId, shadeId) =>
        set((state) => ({
          lines: state.lines
            .map((line) =>
              line.product.id === productId && line.shadeId === shadeId
                ? { ...line, qty: line.qty - 1 }
                : line
            )
            .filter((line) => line.qty > 0)
        })),
      remove: (productId, shadeId) =>
        set((state) => ({
          lines: state.lines.filter(
            (line) => !(line.product.id === productId && line.shadeId === shadeId)
          )
        })),
      clear: () => set({ lines: [] })
    }),
    {
      name: "veloura-cart-v1",
      version: 2
    }
  )
);
