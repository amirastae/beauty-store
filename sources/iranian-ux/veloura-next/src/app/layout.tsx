import type { Metadata } from "next";
import "./globals.css";
import "./iranian-commerce.css";
import StoreHydrator from "@/components/commerce/StoreHydrator";
import { STORE_SUPPORT_EMAIL } from "@/config/store";

function serializeJsonLd(value: unknown) {
  return JSON.stringify(value).replace(/</g, "\\u003c");
}

const organizationLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "FATIKHAN",
  url: "https://beauty-store.nayererohalamini.workers.dev/",
  email: STORE_SUPPORT_EMAIL,
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer support",
    email: STORE_SUPPORT_EMAIL,
    availableLanguage: ["fa"]
  }
};

export const metadata: Metadata = {
  title: "FATIKHAN — زیبایی، در دقیق‌ترین حالتش",
  description: "فروشگاه پریمیوم فارسی لوازم آرایشی، مراقبت پوست و عطر FATIKHAN.",
  metadataBase: new URL("https://beauty-store.nayererohalamini.workers.dev"),
  openGraph: {
    title: "FATIKHAN",
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
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: serializeJsonLd(organizationLd) }}
        />
        <a className="skip-link" href="#main-content">رفتن به محتوای اصلی</a>
        <StoreHydrator />
        <div id="main-content" tabIndex={-1}>{children}</div>
      </body>
    </html>
  );
}
