import type { Metadata } from "next";
import ShopCatalog from "@/components/shop/ShopCatalog";

export const metadata: Metadata = {
  title: "فروشگاه — FATIKHAN",
  description: "فروشگاه آنلاین محصولات آرایشی، مراقبت پوست و عطر FATIKHAN.",
  alternates: { canonical: "/shop/" },
  openGraph: {
    title: "فروشگاه — FATIKHAN",
    description: "فروشگاه آنلاین محصولات آرایشی، مراقبت پوست و عطر FATIKHAN.",
    type: "website",
    locale: "fa_IR",
    url: "/shop/"
  }
};

export default function ShopPage() {
  return <ShopCatalog />;
}
