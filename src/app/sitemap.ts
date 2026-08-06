import type { MetadataRoute } from "next";

import { businessConfig } from "@/config/business";
import { getPublishedBuilds } from "@/lib/projects/repository";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const builds = await getPublishedBuilds();
  const routes = ["/", "/simulator-construction", "/projects", "/contact", "/privacy", "/terms"]
    .map((path) => ({ url: new URL(path, businessConfig.canonicalUrl).toString() }));
  return [
    ...routes,
    ...builds.map((build) => ({
      url: new URL(`/projects/${build.slug}`, businessConfig.canonicalUrl).toString(),
      lastModified: build.updatedAt,
    })),
  ];
}
