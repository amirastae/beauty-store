import type { Metadata } from "next";
import ShopCatalog from "@/components/shop/ShopCatalog";

export const metadata: Metadata = {
  title: "فروشگاه — FATIKHAN",
  description: "فروشگاه آنلاین محصولات آرایشی، مراقبت پوست و عطر FATIKHAN."
};

export default function ShopPage() {
  return <ShopCatalog />;
}
