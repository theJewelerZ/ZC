import { businessConfig } from "@/config/business";

export function getOrganizationStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: businessConfig.legalName,
    alternateName: businessConfig.displayName,
    url: businessConfig.canonicalUrl,
    description:
      "Zarka Construction specializes in defined planning and specialty-construction scopes for premium golf simulator environments.",
  };
}

