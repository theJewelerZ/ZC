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
      "A private place to practice, play, and enjoy golf at home—planned around the people, the space, and the way the room should feel.",
    deliveryMode: "coordinated",
  },
  {
    slug: "commercial-simulator-bays",
    title: "Commercial Simulator Bays",
    description:
      "Welcoming simulator spaces built for repeated play, comfortable gatherings, and the practical demands of a commercial environment.",
    deliveryMode: "coordinated",
  },
  {
    slug: "room-conversions",
    title: "Room Conversions",
    description:
      "Existing space transformed into a room that feels intentional, comfortable, and ready for the way you want to play.",
    deliveryMode: "coordinated",
  },
  {
    slug: "impact-environments",
    title: "Impact Environments",
    description:
      "Screen, enclosure, and protective surfaces integrated so every shot feels natural and the room remains visually resolved.",
    deliveryMode: "coordinated",
  },
  {
    slug: "finish-integration",
    title: "Finish Integration",
    description:
      "Craftsmanship, trim, turf transitions, and finish details that make the golf environment feel like it truly belongs in the space.",
    deliveryMode: "direct",
  },
  {
    slug: "room-planning",
    title: "Room Planning",
    description:
      "Thoughtful planning that creates room to swing confidently, see the shot clearly, and enjoy the space comfortably.",
    deliveryMode: "direct",
  },
  {
    slug: "construction-coordination",
    title: "Construction Coordination",
    description:
      "Organized scopes and coordinated decisions that keep the experience at the center while the technical details come together.",
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