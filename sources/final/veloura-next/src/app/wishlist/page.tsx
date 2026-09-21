import type { Metadata } from "next";
import WishlistPage from "@/components/wishlist/WishlistPage";

export const metadata: Metadata = { title: "علاقه‌مندی‌ها — FATIKHAN", robots: { index: false, follow: false } };

export default function Page(){ return <WishlistPage/>; }
