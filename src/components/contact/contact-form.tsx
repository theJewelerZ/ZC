"use client";

import Script from "next/script";
import { track } from "@vercel/analytics";
import {
  cloneElement,
  FormEvent,
  type ReactElement,
  useEffect,
  useRef,
  useState,
} from "react";

import {
  serviceOptions,
  timelineOptions,
  type ServiceOptionValue,
} from "@/config/business";
import type { ContactField } from "@/lib/contact/schema";

type ContactFormProps = {
  deliveryEnabled: boolean;
  initialService?: ServiceOptionValue | "";
  turnstileSiteKey: string | null;
};

type FormStatus =
  | { state: "idle"; message: "" }
  | { state: "submitting"; message: string }
  | { state: "success"; message: string; reference: string }
  | { state: "error"; message: string; reference?: string };

const initialStatus: FormStatus = { state: "idle", message: "" };

export function ContactForm({
  deliveryEnabled,
  initialService = "",
  turnstileSiteKey,
}: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [errors, setErrors] = useState<
    Partial<Record<ContactField | "form", string>>
  >({});
  const startedAt = useRef(0);
  const trackedStart = useRef(false);
  const errorSummary = useRef<HTMLDivElement>(null);

  useEffect(() => {
    startedAt.current = Date.now();
  }, []);

  function trackStart() {
    if (
      !trackedStart.current &&
      process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false"
    ) {
      trackedStart.current = true;
      track("contact_form_start", { source: "contact_page" });
    }
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deliveryEnabled || status.state === "submitting") {
      return;
    }

    const form = event.currentTarget;
    const formData = new FormData(form);
    const service = String(formData.get("service") || "");
    const payload = {
      name: String(formData.get("name") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      location: String(formData.get("location") || ""),
      service,
      timeline: String(formData.get("timeline") || ""),
      description: String(formData.get("description") || ""),
      referralSource: String(formData.get("referralSource") || ""),
      website: String(formData.get("website") || ""),
      startedAt: String(startedAt.current || Date.now()),
      turnstileToken: String(
        formData.get("cf-turnstile-response") || "",
      ),
    };

    setErrors({});
    setStatus({ state: "submitting", message: "Sending your request…" });

    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false") {
      track("contact_form_submit", { service_category: service || "unknown" });
    }

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = (await response.json()) as {
        ok: boolean;
        message: string;
        correlationId?: string;
        errors?: Partial<Record<ContactField | "form", string>>;
      };

      if (!response.ok || !result.ok) {
        setErrors(result.errors || {});
        setStatus({
          state: "error",
          message: result.message,
          reference: result.correlationId,
        });
        if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false") {
          track("contact_form_error", {
            error_class:
              response.status === 422
                ? "validation"
                : response.status === 429
                  ? "rate_limit"
                  : response.status === 503
                    ? "configuration"
                    : "delivery",
          });
        }
        window.setTimeout(() => errorSummary.current?.focus(), 0);
        return;
      }

      setStatus({
        state: "success",
        message: result.message,
        reference: result.correlationId || "",
      });
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false") {
        track("contact_form_success", {
          service_category: service || "unknown",
        });
      }
      form.reset();
      startedAt.current = Date.now();
    } catch {
      setStatus({
        state: "error",
        message:
          "The request could not be delivered. Your message was not sent. Check your connection and try again.",
      });
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false") {
        track("contact_form_error", { error_class: "network" });
      }
      window.setTimeout(() => errorSummary.current?.focus(), 0);
    }
  }

  const isSubmitting = status.state === "submitting";
  const isDisabled = !deliveryEnabled;

  return (
    <>
      {turnstileSiteKey ? (
        <Script
          src="https://challenges.cloudflare.com/turnstile/v0/api.js"
          strategy="afterInteractive"
        />
      ) : null}

      {!deliveryEnabled ? (
        <div className="contact-disabled-notice" role="status">
          <p className="contact-disabled-title">
            Online request delivery is being connected.
          </p>
          <p>
            Submission is temporarily unavailable until the secure recipient
            and sender addresses are configured. No information entered below
            will be sent or stored.
          </p>
        </div>
      ) : null}

      {status.state === "success" ? (
        <div className="contact-success" role="status">
          <p className="eyebrow">Request delivered</p>
          <h2>Thank you for the project details.</h2>
          <p>{status.message}</p>
          {status.reference ? (
            <p className="contact-reference">
              Reference: {status.reference.slice(0, 8)}
            </p>
          ) : null}
          <button
            className="button button-outline"
            onClick={() => setStatus(initialStatus)}
            type="button"
          >
            Send another request
          </button>
        </div>
      ) : (
        <form
          aria-describedby={isDisabled ? "contact-disabled-context" : undefined}
          className="contact-form"
          noValidate
          onFocusCapture={trackStart}
          onSubmit={handleSubmit}
        >
          <fieldset disabled={isDisabled || isSubmitting}>
            <legend className="sr-only">Project consultation details</legend>

            {status.state === "error" ? (
              <div
                className="form-error-summary"
                ref={errorSummary}
                role="alert"
                tabIndex={-1}
              >
                <p>{status.message}</p>
                {status.reference ? (
                  <p>Reference: {status.reference.slice(0, 8)}</p>
                ) : null}
              </div>
            ) : null}

            <div className="form-grid">
              <FormField error={errors.name} label="Name" required>
                <input
                  autoComplete="name"
                  id="name"
                  maxLength={100}
                  name="name"
                  required
                  type="text"
                />
              </FormField>

              <FormField error={errors.email} label="Email" required>
                <input
                  autoComplete="email"
                  id="email"
                  maxLength={254}
                  name="email"
                  required
                  type="email"
                />
              </FormField>

              <FormField error={errors.phone} label="Phone">
                <input
                  autoComplete="tel"
                  id="phone"
                  inputMode="tel"
                  maxLength={30}
                  name="phone"
                  type="tel"
                />
              </FormField>

              <FormField
                error={errors.location}
                label="Project city or general location"
                required
              >
                <input
                  autoComplete="address-level2"
                  id="location"
                  maxLength={120}
                  name="location"
                  required
                  type="text"
                />
              </FormField>

              <FormField error={errors.service} label="Service needed" required>
                <select
                  defaultValue={initialService}
                  id="service"
                  name="service"
                  required
                >
                  <option disabled value="">
                    Choose a service
                  </option>
                  {serviceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                error={errors.timeline}
                label="Approximate timeline"
                required
              >
                <select defaultValue="" id="timeline" name="timeline" required>
                  <option disabled value="">
                    Choose a timeline
                  </option>
                  {timelineOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </FormField>

              <FormField
                className="form-field-wide"
                error={errors.description}
                label="Project description"
                required
              >
                <textarea
                  id="description"
                  maxLength={2_000}
                  minLength={20}
                  name="description"
                  placeholder="Tell us about the space, the work you are considering, and any important constraints."
                  required
                  rows={7}
                />
              </FormField>

              <FormField
                className="form-field-wide"
                error={errors.referralSource}
                label="How did you hear about Zarka Construction?"
              >
                <input
                  id="referralSource"
                  maxLength={120}
                  name="referralSource"
                  type="text"
                />
              </FormField>
            </div>

            <div aria-hidden="true" className="form-honeypot">
              <label htmlFor="website">Website</label>
              <input
                autoComplete="off"
                id="website"
                name="website"
                tabIndex={-1}
                type="text"
              />
            </div>

            {turnstileSiteKey ? (
              <div
                className="cf-turnstile"
                data-sitekey={turnstileSiteKey}
                data-theme="light"
              />
            ) : null}

            <div className="form-submit-row">
              <button className="button button-primary" type="submit">
                {isSubmitting ? "Sending request…" : "Send consultation request"}
              </button>
              <p>
                Required fields are marked. A submission starts a conversation;
                it does not create a project agreement.
              </p>
            </div>
          </fieldset>
        </form>
      )}
    </>
  );
}

type FormFieldProps = {
  label: string;
  children: ReactElement<{
    id: string;
    "aria-describedby"?: string;
    "aria-invalid"?: boolean;
  }>;
  required?: boolean;
  error?: string;
  className?: string;
};

function FormField({
  label,
  children,
  required = false,
  error,
  className = "",
}: FormFieldProps) {
  const inputId = children.props.id as string;
  const errorId = `${inputId}-error`;
  const control = error
    ? cloneElement(children, {
        "aria-describedby": errorId,
        "aria-invalid": true,
      })
    : children;

  return (
    <div className={`form-field ${className}`}>
      <label htmlFor={inputId}>
        {label}
        {required ? <span aria-hidden="true"> *</span> : null}
        {!required ? <span className="optional-label"> Optional</span> : null}
      </label>
      {control}
      {error ? (
        <p className="field-error" id={errorId}>
          {error}
        </p>
      ) : null}
    </div>
  );
}
