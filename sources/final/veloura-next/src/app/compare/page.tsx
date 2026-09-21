import type { Metadata } from "next";
import ComparePage from "@/components/compare/ComparePage";

export const metadata: Metadata={
  title:"مقایسه محصولات — FATIKHAN",
  description:"مقایسه محصولات زیبایی FATIKHAN بر اساس قیمت، رنگ، ترکیبات، مزیت‌ها و روش استفاده.",
  robots:{index:false,follow:true}
};

export default function Page(){return <ComparePage/>;}
