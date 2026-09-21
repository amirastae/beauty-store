import type { Metadata } from "next";
import RoutineBuilder from "@/components/routine/RoutineBuilder";

export const metadata: Metadata={
  title:"روتین‌ساز — FATIKHAN",
  description:"ساخت روتین پیشنهادی از کاتالوگ FATIKHAN بر اساس هدف، بودجه و تعداد مراحل.",
  alternates:{canonical:"/routine/"}
};

export default function Page(){return <RoutineBuilder/>;}
