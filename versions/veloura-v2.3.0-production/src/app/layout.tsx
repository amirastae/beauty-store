import type { Metadata, Viewport } from "next";
import "./globals.css";
import MobileDock from "@/components/navigation/MobileDock";
import SiteFooter from "@/components/navigation/SiteFooter";
import PWARegister from "@/components/pwa/PWARegister";

export const metadata: Metadata = {
  title: "VELOURA — زیبایی، در دقیق‌ترین حالتش",
  description: "فروشگاه پریمیوم فارسی لوازم آرایشی، مراقبت پوست و عطر ولورا.",
  metadataBase: new URL("https://beauty-store.nayererohalamini.workers.dev"),
  alternates: { canonical: "/" },
  manifest: "/manifest.webmanifest",
  icons: { icon: "/icon.svg", apple: "/icon.svg" },
  openGraph: {
    title: "VELOURA",
    description: "زیبایی، در دقیق‌ترین حالتش",
    type: "website",
    locale: "fa_IR",
    url: "/"
  }
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#f4eee8",
  colorScheme: "light"
};

const organization = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "VELOURA",
  url: "https://beauty-store.nayererohalamini.workers.dev/",
  description: "فروشگاه پریمیوم فارسی زیبایی و لوازم آرایشی."
};

export default function RootLayout({
  children
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl">
      <body>
        <a className="skip-link" href="#site-content">رفتن به محتوای اصلی</a>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
        />
        <div id="site-content">{children}</div>
        <SiteFooter />
        <MobileDock />
        <PWARegister />
      </body>
    </html>
  );
}
