import type { Metadata } from "next";
import CartPage from "@/components/cart/CartPage";

export const metadata: Metadata = {
  title: "سبد خرید — VELOURA",
  robots: { index: false, follow: false }
};

export default function Page() {
  return <CartPage />;
}
