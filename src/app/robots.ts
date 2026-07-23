import type { MetadataRoute } from "next";

import { businessConfig } from "@/config/business";

export default function robots(): MetadataRoute.Robots {
  const indexingEnabled =
    process.env.NEXT_PUBLIC_SEARCH_INDEXING_ENABLED === "true";

  return {
    rules: indexingEnabled
      ? { userAgent: "*", allow: "/" }
      : { userAgent: "*", disallow: "/" },
    sitemap: `${businessConfig.canonicalUrl}/sitemap.xml`,
    host: businessConfig.canonicalUrl,
  };
}

