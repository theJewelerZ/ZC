export type DeliveryMode = "direct" | "coordinated" | "software" | "future";

export type Service = {
  slug: string;
  title: string;
  description: string;
  deliveryMode: DeliveryMode;
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
    slug: "custom-simulator-environments",
    title: "Custom Simulator Environments",
    description:
      "Defined specialty-construction scopes that bring the playing area, impact environment, protection, turf, and finished details together for the individual space.",
    deliveryMode: "coordinated",
  },
  {
    slug: "simulator-room-preparation",
    title: "Room Preparation & Framing",
    description:
      "Room preparation and framing for simulator environments, including screen structures, attachment needs, clearances, and approved finish conditions.",
    deliveryMode: "direct",
  },
  {
    slug: "impact-screen-environments",
    title: "Impact Screen Environments",
    description:
      "Impact-screen structures, custom layered impact screens, curtains, and related enclosure details planned for the room and intended use.",
    deliveryMode: "direct",
  },
  {
    slug: "wall-ceiling-protection",
    title: "Wall & Ceiling Protection",
    description:
      "Protective wall and ceiling systems developed around missed-shot coverage, durability, access, and integration with adjacent finishes.",
    deliveryMode: "direct",
  },
  {
    slug: "turf-hitting-surfaces",
    title: "Turf & Hitting Surfaces",
    description:
      "Turf, stance areas, hitting surfaces, seams, and floor transitions coordinated with player position and the finished room.",
    deliveryMode: "direct",
  },
  {
    slug: "finish-carpentry-detailing",
    title: "Finish Carpentry & Detailing",
    description:
      "Finish carpentry, trim, curtains, transitions, and final detailing that help the simulator environment feel considered and complete.",
    deliveryMode: "direct",
  },
  {
    slug: "planning-trade-coordination",
    title: "Planning & Trade Coordination",
    description:
      "Construction planning, documented assumptions, and coordination with equipment providers or qualified trades when the agreed scope requires it.",
    deliveryMode: "coordinated",
  },
] as const satisfies ReadonlyArray<Service>;

export const serviceOptions = [
  { value: "simulator-construction", label: "Custom simulator environment construction" },
  { value: "residential-simulator-room", label: "Residential simulator environment" },
  { value: "commercial-simulator-space", label: "Commercial simulator environment" },
  { value: "simulator-room-conversion", label: "Existing room preparation or conversion" },
  { value: "simulator-planning", label: "Room evaluation and construction planning" },
  { value: "simulator-room-improvement", label: "Existing simulator environment improvement" },
  { value: "other-construction-inquiry", label: "Other simulator-environment inquiry" },
] as const;

export type ServiceOptionValue = (typeof serviceOptions)[number]["value"];

export function isServiceOptionValue(value: string): value is ServiceOptionValue {
  return serviceOptions.some((option) => option.value === value);
}

export const consultationOptions = [
  { value: "on-site-consultation", label: "On-site consultation" },
  { value: "guided-remote-review", label: "Guided remote room review" },
] as const;

export type ConsultationOptionValue =
  (typeof consultationOptions)[number]["value"];

export const timelineOptions = [
  { value: "asap", label: "As soon as practical" },
  { value: "one-three-months", label: "Within 1-3 months" },
  { value: "three-six-months", label: "Within 3-6 months" },
  { value: "six-plus-months", label: "More than 6 months out" },
  { value: "planning", label: "Early planning / not sure yet" },
] as const;
