import type { Metadata } from "next";
import ShopCatalog from "@/components/shop/ShopCatalog";

export const metadata: Metadata = {
  title: "فروشگاه — VELOURA",
  description: "فروشگاه آنلاین محصولات آرایشی، مراقبت پوست و عطر ولورا.",
  alternates: { canonical: "/shop/" },
  openGraph: {
    title: "فروشگاه — VELOURA",
    description: "کالکشن آرایشی، مراقبت پوست و عطر ولورا.",
    url: "/shop/",
    type: "website"
  }
};

export default function ShopPage() {
  return <ShopCatalog />;
}
