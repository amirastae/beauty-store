import type { Metadata } from "next";
import ShopCatalog from "@/components/shop/ShopCatalog";

export const metadata: Metadata = {
  title: "فروشگاه — VELOURA",
  description: "فروشگاه آنلاین محصولات آرایشی، مراقبت پوست و عطر ولورا."
};

export default function ShopPage() {
  return <ShopCatalog />;
}
