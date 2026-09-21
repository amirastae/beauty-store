import type { Metadata } from "next";
import ComparePage from "@/components/compare/ComparePage";

export const metadata: Metadata={
  title:"مقایسه محصولات — VELOURA",
  description:"مقایسه محصولات زیبایی ولورا بر اساس قیمت، امتیاز، رنگ و ترکیبات.",
  robots:{index:false,follow:true}
};

export default function Page(){return <ComparePage/>;}
