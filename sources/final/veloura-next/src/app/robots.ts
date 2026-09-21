export const dynamic = "force-static";

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/cart/",
        "/checkout/",
        "/wishlist/",
        "/compare/",
        "/recent/",
        "/search/",
        "/offline/"
      ]
    },
    sitemap: "https://beauty-store.nayererohalamini.workers.dev/sitemap.xml"
  };
}
