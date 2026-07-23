import { businessConfig } from "@/config/business";

export function getOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessConfig.legalName,
    alternateName: businessConfig.displayName,
    url: businessConfig.canonicalUrl,
    description:
      "Construction, specialty installation, indoor golf simulator environments, and modern project support.",
  };
}

