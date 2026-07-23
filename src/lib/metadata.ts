import type { Metadata } from "next";

import { businessConfig } from "@/config/business";

type PageMetadataInput = {
  title: string;
  description: string;
  path: "/" | "/contact" | "/privacy" | "/terms";
};

export function createPageMetadata({
  title,
  description,
  path,
}: PageMetadataInput): Metadata {
  const url = new URL(path, businessConfig.canonicalUrl);

  return {
    title,
    description,
    alternates: {
      canonical: url,
    },
    openGraph: {
      title,
      description,
      url,
      siteName: businessConfig.displayName,
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

