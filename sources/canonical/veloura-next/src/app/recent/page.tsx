import type { Metadata } from "next";
import RecentPage from "@/components/recent/RecentPage";

export const metadata: Metadata={
  title:"محصولات اخیر — FATIKHAN",
  description:"محصولاتی که اخیراً در FATIKHAN دیده‌اید.",
  robots:{index:false,follow:true}
};

export default function Page(){return <RecentPage/>;}
