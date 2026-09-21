import type { Metadata } from "next";
import ComparePage from "@/components/compare/ComparePage";

export const metadata: Metadata = {
  title: "مقایسه محصولات — VELOURA",
  description: "مقایسه کنارهم محصولات آرایشی، مراقبت پوست و عطر ولورا.",
  robots: { index: false, follow: false }
};

export default function Page() {
  return <ComparePage />;
}
