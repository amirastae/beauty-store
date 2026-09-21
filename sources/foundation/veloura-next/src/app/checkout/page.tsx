import type { Metadata } from "next";
import CheckoutShell from "@/components/checkout/CheckoutShell";
export const metadata: Metadata={title:"تکمیل سفارش — VELOURA",robots:{index:false,follow:false}};
export default function Page(){return <CheckoutShell/>;}
