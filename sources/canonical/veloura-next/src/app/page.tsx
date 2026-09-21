import type { Metadata } from "next";
import Storefront from "@/components/storefront/Storefront";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
  openGraph: { url: "/" }
};

export default function HomePage() {
  return <Storefront />;
}
