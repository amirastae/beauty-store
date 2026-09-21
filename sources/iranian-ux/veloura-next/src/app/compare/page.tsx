import type { Metadata } from "next";
import ComparePage from "@/components/compare/ComparePage";

export const metadata: Metadata = {
  title: "مقایسه محصولات — FATIKHAN",
  description: "مقایسه کنارهم محصولات آرایشی، مراقبت پوست و عطر FATIKHAN.",
  robots: { index: false, follow: false }
};

export default function Page() {
  return <ComparePage />;
}
