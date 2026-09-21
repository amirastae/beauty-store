import type { Metadata } from "next";
import RoutineGuide from "@/components/beauty/RoutineGuide";

export const metadata: Metadata = {
  title: "راهنمای روتین پوست — FATIKHAN",
  description: "راهنمای عمومی و ساده روتین مراقبت پوست صبح و شب در ولورا.",
  alternates: { canonical: "/routine/" },
  openGraph: {
    title: "راهنمای روتین پوست — FATIKHAN",
    description: "ترتیب ساده روتین صبح و شب برای تجربه بهتر محصولات مراقبت پوست.",
    url: "/routine/",
    type: "article"
  }
};

export default function Page() {
  return <RoutineGuide />;
}
