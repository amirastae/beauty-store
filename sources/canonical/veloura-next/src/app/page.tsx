import type { Metadata } from "next";
import Storefront from "@/components/storefront/Storefront";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: {
    title: "FATIKHAN",
    description: "زیبایی، در دقیق‌ترین حالتش",
    type: "website",
    locale: "fa_IR",
    url: "/"
  }
};

export default function HomePage() {
  return <Storefront />;
}
