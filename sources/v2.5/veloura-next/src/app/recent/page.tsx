import type { Metadata } from "next";
import RecentPage from "@/components/recent/RecentPage";

export const metadata: Metadata={
  title:"محصولات اخیر — VELOURA",
  description:"محصولاتی که اخیراً در ولورا دیده‌اید.",
  robots:{index:false,follow:true}
};

export default function Page(){return <RecentPage/>;}
