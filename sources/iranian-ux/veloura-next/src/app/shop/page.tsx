import type { Metadata } from "next";
import ShopCatalog from "@/components/shop/ShopCatalog";

export const metadata: Metadata = {
  title: "فروشگاه — FATIKHAN",
  description: "فروشگاه آنلاین محصولات آرایشی، مراقبت پوست و عطر FATIKHAN.",
  alternates: { canonical: "/shop/" },
  openGraph: {
    title: "فروشگاه — FATIKHAN",
    description: "کالکشن آرایشی، مراقبت پوست و عطر FATIKHAN.",
    url: "/shop/",
    type: "website"
  }
};

export default function ShopPage() {
  return <ShopCatalog />;
}
