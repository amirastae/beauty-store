import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VELOURA — زیبایی، در دقیق‌ترین حالتش",
  description: "فروشگاه پریمیوم فارسی لوازم آرایشی، مراقبت پوست و عطر ولورا.",
  metadataBase: new URL("https://beauty-store.nayererohalamini.workers.dev"),
  openGraph: {
    title: "VELOURA",
    description: "زیبایی، در دقیق‌ترین حالتش",
    type: "website",
    locale: "fa_IR"
  }
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
