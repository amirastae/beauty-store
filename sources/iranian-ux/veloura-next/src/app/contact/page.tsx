import type { Metadata } from "next";
import ContactPage from "@/components/support/ContactPage";

export const metadata: Metadata = {
  title: "تماس و پشتیبانی — FATIKHAN",
  description: "راه ارتباط مستقیم با پشتیبانی فروشگاه FATIKHAN.",
  alternates: { canonical: "/contact/" },
  openGraph: {
    title: "تماس و پشتیبانی — FATIKHAN",
    description: "راه ارتباط مستقیم با پشتیبانی فروشگاه FATIKHAN.",
    url: "/contact/",
    type: "website"
  }
};

export default function Page() {
  return <ContactPage />;
}
