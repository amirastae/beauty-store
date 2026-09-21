import type { Metadata } from "next";
import AboutPage from "@/components/info/AboutPage";
export const metadata: Metadata={title:"درباره ولورا — VELOURA",description:"درباره تجربه خرید و طراحی فروشگاه زیبایی ولورا.",alternates:{canonical:"/about/"}};
export default function Page(){return <AboutPage/>;}
