export const dynamic = "force-static";

import type { MetadataRoute } from "next";
import { products } from "@/data/products";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://beauty-store.nayererohalamini.workers.dev";
  return [
    { url: base + "/", changeFrequency: "weekly", priority: 1 },
    { url: base + "/shop/", changeFrequency: "daily", priority: .9 },
    { url: base + "/routine/", changeFrequency: "monthly", priority: .6 },
    ...products.map((product) => ({
      url: base + "/product/" + product.slug + "/",
      changeFrequency: "weekly" as const,
      priority: .8
    }))
  ];
}
