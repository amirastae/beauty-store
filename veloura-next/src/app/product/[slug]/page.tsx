import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ProductDetail from "@/components/product/ProductDetail";
import { products } from "@/data/products";

type Props = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return products.map((product) => ({ slug: product.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) return {};

  const canonical = "/product/" + product.slug + "/";

  return {
    title: product.nameFa + " — VELOURA",
    description: product.nameFa + " از " + product.brand + "؛ خرید آنلاین با تجربه پریمیوم ولورا.",
    alternates: { canonical },
    openGraph: {
      title: product.nameFa + " — VELOURA",
      description: product.nameEn,
      images: [product.image],
      url: canonical,
      type: "website"
    },
    twitter: {
      card: "summary_large_image",
      title: product.nameFa + " — VELOURA",
      description: product.nameEn,
      images: [product.image]
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const productUrl = "https://beauty-store.nayererohalamini.workers.dev/product/" + product.slug + "/";
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.nameFa,
    alternateName: product.nameEn,
    image: [product.image],
    url: productUrl,
    category: product.category,
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: productUrl,
      priceCurrency: "IRR",
      price: product.price * 10,
      availability: "https://schema.org/InStock"
    },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount
    }
  };

  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "خانه", item: "https://beauty-store.nayererohalamini.workers.dev/" },
      { "@type": "ListItem", position: 2, name: "فروشگاه", item: "https://beauty-store.nayererohalamini.workers.dev/shop/" },
      { "@type": "ListItem", position: 3, name: product.nameFa, item: productUrl }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbLd) }}
      />
      <ProductDetail product={product} />
    </>
  );
}
