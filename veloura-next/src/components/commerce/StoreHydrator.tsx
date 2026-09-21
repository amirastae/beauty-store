"use client";

import { useEffect } from "react";
import { useCart } from "@/store/cart";
import { useCompare } from "@/store/compare";
import { useWishlist } from "@/store/wishlist";

export default function StoreHydrator() {
  useEffect(() => {
    useCart.persist.rehydrate();
    useWishlist.persist.rehydrate();
    useCompare.persist.rehydrate();
  }, []);

  return null;
}
