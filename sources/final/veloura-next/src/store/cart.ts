"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { products, type Product } from "@/data/products";

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

const clampQty = (qty: number) => Math.max(1, Math.min(20, Math.floor(qty)));

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
              i === index ? { ...line, qty: clampQty(line.qty + 1) } : line
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
      version: 3,
      merge: (persisted, current) => {
        const saved = persisted as Partial<CartState>;
        const lines = Array.isArray(saved.lines)
          ? saved.lines.flatMap((line) => {
              const fresh = products.find((product) => product.id === line?.product?.id);
              if (!fresh) return [];

              const shadeId =
                line.shadeId && fresh.shades?.some((shade) => shade.id === line.shadeId)
                  ? line.shadeId
                  : fresh.shades?.[0]?.id;

              return [{
                product: fresh,
                qty: clampQty(Number(line.qty) || 1),
                shadeId
              }];
            })
          : [];

        return { ...current, lines };
      }
    }
  )
);
