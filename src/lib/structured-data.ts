import { businessConfig } from "@/config/business";

export function getOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessConfig.legalName,
    alternateName: businessConfig.displayName,
    url: businessConfig.canonicalUrl,
    description:
      "Zarka Construction plans and builds custom indoor golf simulator rooms designed around the people, the space, and the golf experience.",
  };
}

