import type { Metadata } from "next";
import SearchPage from "@/components/search/SearchPage";

export const metadata: Metadata={
  title:"جستجو — VELOURA",
  description:"جستجو در کاتالوگ ولورا بر اساس نام، دسته و ترکیبات.",
  robots:{index:false,follow:true}
};

export default function Page(){return <SearchPage/>;}
