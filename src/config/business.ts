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
    slug: "residential-simulator-rooms",
    title: "Residential Simulator Rooms",
    description:
      "Custom rooms planned around the available space, intended players, equipment requirements, and finished-home environment.",
    deliveryMode: "coordinated",
  },
  {
    slug: "commercial-simulator-bays",
    title: "Commercial Simulator Bays",
    description:
      "Purpose-built simulator spaces coordinated for repeated use, durable protection, clear circulation, and maintainable systems.",
    deliveryMode: "coordinated",
  },
  {
    slug: "room-conversions",
    title: "Room Conversions",
    description:
      "Existing rooms evaluated and adapted around swing clearance, enclosure depth, projection, access, and finish constraints.",
    deliveryMode: "coordinated",
  },
  {
    slug: "impact-environments",
    title: "Impact Environments",
    description:
      "Impact-screen, enclosure, netting, blackout, and protective wall and ceiling details integrated with the room construction.",
    deliveryMode: "coordinated",
  },
  {
    slug: "finish-integration",
    title: "Finish Integration",
    description:
      "Framing, finish carpentry, trim, turf transitions, and built details that make the simulator feel part of the room.",
    deliveryMode: "direct",
  },
  {
    slug: "room-planning",
    title: "Room Planning",
    description:
      "Feasibility, player position, screen geometry, projector path, lighting, and maintenance access considered before construction begins.",
    deliveryMode: "direct",
  },
  {
    slug: "construction-coordination",
    title: "Construction Coordination",
    description:
      "Organized scopes, documented assumptions, and coordination with required technology providers and qualified trades.",
    deliveryMode: "coordinated",
  },
] as const satisfies ReadonlyArray<Service>;

export const serviceOptions = [
  { value: "simulator-construction", label: "Complete simulator room construction" },
  { value: "residential-simulator-room", label: "Residential simulator room" },
  { value: "commercial-simulator-space", label: "Commercial simulator space" },
  { value: "simulator-room-conversion", label: "Existing room conversion" },
  { value: "simulator-planning", label: "Room feasibility and planning" },
  { value: "simulator-room-improvement", label: "Existing simulator room improvement" },
  { value: "other-construction-inquiry", label: "Other construction inquiry" },
] as const;

export type ServiceOptionValue = (typeof serviceOptions)[number]["value"];

export function isServiceOptionValue(value: string): value is ServiceOptionValue {
  return serviceOptions.some((option) => option.value === value);
}

export const consultationOptions = [
  {
    value: "on-site-consultation",
    label: "On-site consultation",
  },
  {
    value: "guided-remote-review",
    label: "Guided remote room review",
  },

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