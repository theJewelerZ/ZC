import type { MetadataRoute } from "next";

import { businessConfig } from "@/config/business";

export default function sitemap(): MetadataRoute.Sitemap {
  return ["/", "/simulator-construction", "/contact", "/privacy", "/terms"].map((path) => ({
    url: new URL(path, businessConfig.canonicalUrl).toString(),
  }));
}

