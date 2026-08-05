import {
  consultationOptions,
  serviceOptions,
  timelineOptions,
} from "@/config/business";

export type ContactPayload = {
  name: string;
  email: string;
  phone: string;
  location: string;
  service: string;
  consultationPreference: string;
  timeline: string;
  description: string;
  referralSource: string;
  website: string;
  startedAt: string;
  turnstileToken: string;
};

export type ContactField =
  | "name"
  | "email"
  | "phone"
  | "location"
  | "service"
  | "consultationPreference"
  | "timeline"
  | "description"
  | "referralSource";

export type ValidationResult =
  | { success: true; data: ContactPayload }
  | {
      success: false;
      errors: Partial<Record<ContactField | "form", string>>;
      abuseDetected?: boolean;
    };

const allowedKeys = new Set([
  "name",
  "email",
  "phone",
  "location",
  "service",
  "consultationPreference",
  "timeline",
  "description",
  "referralSource",
  "website",
  "startedAt",
  "turnstileToken",
]);

const serviceValues = new Set(serviceOptions.map((option) => option.value));
const consultationValues = new Set(
  consultationOptions.map((option) => option.value),
);
const timelineValues = new Set(timelineOptions.map((option) => option.value));

function asTrimmedString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function hasValidLength(value: string, minimum: number, maximum: number) {
  return value.length >= minimum && value.length <= maximum;
}

export function validateContactPayload(
  input: unknown,
  now = Date.now(),
): ValidationResult {
  if (!input || typeof input !== "object" || Array.isArray(input)) {
    return {
      success: false,
      errors: { form: "The submitted request could not be read." },
    };
  }

  const raw = input as Record<string, unknown>;
  if (Object.keys(raw).some((key) => !allowedKeys.has(key))) {
    return {
      success: false,
      errors: { form: "The submitted request contains unexpected fields." },
    };
  }

  const data: ContactPayload = {
    name: asTrimmedString(raw.name).replace(/\s+/g, " "),
    email: asTrimmedString(raw.email).toLowerCase(),
    phone: asTrimmedString(raw.phone),
    location: asTrimmedString(raw.location).replace(/\s+/g, " "),
    service: asTrimmedString(raw.service),
    consultationPreference: asTrimmedString(raw.consultationPreference),
    timeline: asTrimmedString(raw.timeline),
    description: asTrimmedString(raw.description),
    referralSource: asTrimmedString(raw.referralSource),
    website: asTrimmedString(raw.website),
    startedAt: asTrimmedString(raw.startedAt),
    turnstileToken: asTrimmedString(raw.turnstileToken),
  };

  if (data.website) {
    return {
      success: false,
      errors: { form: "The request could not be submitted." },
      abuseDetected: true,
    };
  }

  const startTime = Number(data.startedAt);
  if (
    !Number.isFinite(startTime) ||
    startTime > now ||
    now - startTime < 1_500 ||
    now - startTime > 86_400_000
  ) {
    return {
      success: false,
      errors: { form: "Please refresh the page and try again." },
      abuseDetected: true,
    };
  }

  const errors: Partial<Record<ContactField | "form", string>> = {};

  if (!hasValidLength(data.name, 2, 100)) {
    errors.name = "Enter your name using 2-100 characters.";
  }

  if (
    !hasValidLength(data.email, 5, 254) ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)
  ) {
    errors.email = "Enter a valid email address.";
  }

  if (
    data.phone &&
    (!hasValidLength(data.phone, 7, 30) || !/^[0-9+().\-\s]+$/.test(data.phone))
  ) {
    errors.phone = "Enter a valid phone number or leave this field blank.";
  }

  if (!hasValidLength(data.location, 2, 120)) {
    errors.location = "Enter a project city or general location.";
  }

  if (!serviceValues.has(data.service as never)) {
    errors.service = "Choose the simulator project that best fits your inquiry.";
  }

  if (!consultationValues.has(data.consultationPreference as never)) {
    errors.consultationPreference =
      "Choose an on-site consultation or guided remote room review.";
  }

  if (!timelineValues.has(data.timeline as never)) {
    errors.timeline = "Choose an approximate project timeline.";
  }

  if (!hasValidLength(data.description, 20, 2_000)) {
    errors.description =
      "Describe the project using between 20 and 2,000 characters.";
  }

  if (data.referralSource.length > 120) {
    errors.referralSource = "Keep the referral source under 120 characters.";
  }

  return Object.keys(errors).length > 0
    ? { success: false, errors }
    : { success: true, data };
}