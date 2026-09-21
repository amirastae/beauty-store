import type { Metadata } from "next";
import ContactPage from "@/components/support/ContactPage";

export const metadata: Metadata = {
  title: "تماس و پشتیبانی — VELOURA",
  description: "راه ارتباط مستقیم با پشتیبانی فروشگاه ولورا.",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: "تماس و پشتیبانی — VELOURA",
    description: "راه ارتباط مستقیم با پشتیبانی فروشگاه ولورا.",
    url: "/contact/",
    type: "website"
  }
};

export default function Page() {
  return <ContactPage />;
}
