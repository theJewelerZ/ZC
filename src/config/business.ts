export type DeliveryMode = "direct" | "coordinated" | "software" | "future";

export type Service = {
  slug: string;
  title: string;
  description: string;
  deliveryMode: DeliveryMode;
};

export type RelatedProject = {
  slug: "capproof" | "bid-desk" | "precision-impact-screens";
  name: string;
  category: string;
  description: string;
  href: string | null;
  status?: string;
};

export type LogoAssets = {
  horizontalOnLight: string | null;
  horizontalOnDark: string | null;
  iconOnLight: string | null;
  iconOnDark: string | null;
};

export type BusinessConfig = {
  legalName: string;
  displayName: string;
  canonicalUrl: string;
  tagline: string;
  publicPhone: string | null;
  publicEmail: string | null;
  contactRecipientEmail: string | null;
  serviceArea: string | null;
  licensingLanguage: string | null;
  insuranceLanguage: string | null;
  socialLinks: ReadonlyArray<{ label: string; href: string }>;
  logo: LogoAssets;
  effectiveDate: string;
};

export const businessConfig = {
  legalName: "Zarka Construction LLC",
  displayName: "Zarka Construction",
  canonicalUrl: "https://www.zarkaconstruction.com",
  tagline: "Built with precision. Delivered with integrity.",
  publicPhone: null,
  publicEmail: null,
  contactRecipientEmail: null,
  serviceArea: null,
  licensingLanguage: null,
  insuranceLanguage: null,
  socialLinks: [],
  logo: {
    horizontalOnLight: null,
    horizontalOnDark: null,
    iconOnLight: "/brand/zarka-construction-mark.webp",
    iconOnDark: "/brand/zarka-construction-mark.webp",
  },
  effectiveDate: "July 22, 2026",
} as const satisfies BusinessConfig;

export const services = [
  {
    slug: "construction-renovation",
    title: "Construction and renovation support",
    description:
      "Practical planning and hands-on support for interior construction, renovation, and improvement work.",
    deliveryMode: "coordinated",
  },
  {
    slug: "finish-carpentry",
    title: "Finish carpentry and specialty installation",
    description:
      "Detail-driven finish work, custom-built elements, and specialty installation shaped to the space.",
    deliveryMode: "direct",
  },
  {
    slug: "painting-interiors",
    title: "Painting and interior improvements",
    description:
      "Careful preparation, painting, and interior upgrades delivered within the approved project scope.",
    deliveryMode: "direct",
  },
  {
    slug: "simulator-construction",
    title: "Indoor golf simulator construction",
    description:
      "Room planning, enclosure environments, protection systems, finish integration, and installation coordination.",
    deliveryMode: "coordinated",
  },
  {
    slug: "estimating-support",
    title: "Construction estimating and project support",
    description:
      "Organized opportunity review, estimating support, and practical coordination for better project decisions.",
    deliveryMode: "coordinated",
  },
  {
    slug: "field-documentation",
    title: "Field documentation and project reporting",
    description:
      "Clear field evidence, organized project records, and professional reporting built around the work.",
    deliveryMode: "coordinated",
  },
] as const satisfies ReadonlyArray<Service>;

export const relatedProjects = [
  {
    slug: "capproof",
    name: "CapProof",
    category: "Field documentation software",
    description:
      "Field evidence capture, project documentation, professional reporting, and proof of completed work.",
    href: "https://capproof.com",
  },
  {
    slug: "bid-desk",
    name: "Bid Desk",
    category: "Estimating and bid workflow",
    description:
      "A construction opportunity review and estimating workflow designed to make bid decisions more organized.",
    href: null,
    status: "Coming soon",
  },
  {
    slug: "precision-impact-screens",
    name: "Precision Impact Screens",
    category: "Simulator environments",
    description:
      "Indoor golf simulator screens, enclosure solutions, room construction, and installation support.",
    href: "https://precisionimpactscreens.com",
  },
] as const satisfies ReadonlyArray<RelatedProject>;

export const serviceOptions = [
  { value: "construction-renovation", label: "Construction and renovation support" },
  { value: "finish-carpentry", label: "Finish carpentry and specialty installation" },
  { value: "painting-interiors", label: "Painting and interior improvements" },
  { value: "simulator-construction", label: "Indoor golf simulator construction" },
  { value: "estimating-support", label: "Estimating and project support" },
  { value: "field-documentation", label: "Field documentation and reporting" },
  { value: "business-inquiry", label: "Business or partnership inquiry" },
  { value: "other", label: "Something else" },
] as const;

export const timelineOptions = [
  { value: "asap", label: "As soon as practical" },
  { value: "one-three-months", label: "Within 1–3 months" },
  { value: "three-six-months", label: "Within 3–6 months" },
  { value: "six-plus-months", label: "More than 6 months out" },
  { value: "planning", label: "Early planning / not sure yet" },
] as const;
