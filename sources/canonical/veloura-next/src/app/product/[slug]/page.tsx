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

  return {
    title: product.nameFa + " — FATIKHAN",
    description: product.nameFa + " از " + product.brand + "؛ جزئیات، ترکیبات و خرید آنلاین در FATIKHAN.",
    alternates: { canonical: "/product/" + product.slug + "/" },
    openGraph: {
      title: product.nameFa + " — FATIKHAN",
      description: product.nameEn,
      images: [product.image],
      type: "website",
      url: "/product/" + product.slug + "/"
    }
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const product = products.find((item) => item.slug === slug);
  if (!product) notFound();

  const related = products
    .filter((item) => item.category === product.category && item.id !== product.id)
    .slice(0, 4);

  const schema = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Product",
        name: product.nameFa,
        alternateName: product.nameEn,
        image: [product.image],
        brand: { "@type": "Brand", name: product.brand },
        category: product.category,
        description: product.benefitsFa.join("، "),
        additionalProperty: product.ingredients.map((ingredient) => ({
          "@type": "PropertyValue",
          name: "ingredient",
          value: ingredient
        })),
        offers: {
          "@type": "Offer",
          priceCurrency: "IRR",
          price: product.price * 10,
          url: "https://beauty-store.nayererohalamini.workers.dev/product/" + product.slug + "/"
        }
      },
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "خانه", item: "https://beauty-store.nayererohalamini.workers.dev/" },
          { "@type": "ListItem", position: 2, name: "فروشگاه", item: "https://beauty-store.nayererohalamini.workers.dev/shop/" },
          { "@type": "ListItem", position: 3, name: product.nameFa, item: "https://beauty-store.nayererohalamini.workers.dev/product/" + product.slug + "/" }
        ]
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProductDetail product={product} related={related} />
    </>
  );
}
