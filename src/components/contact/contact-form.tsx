/* eslint-disable @next/next/no-img-element -- private signed URLs and local blob previews are intentionally not sent through the public image optimizer. */
"use client";

import Script from "next/script";
import { track } from "@vercel/analytics";
import { cloneElement, FormEvent, type ReactElement, useEffect, useRef, useState } from "react";

import { consultationOptions, serviceOptions, timelineOptions, type ServiceOptionValue } from "@/config/business";
import type { ContactField } from "@/lib/contact/schema";
import { createSupabaseBrowserClient } from "@/lib/supabase/browser";
import { hasSupportedImageSignature, MAX_PHOTO_BYTES, MAX_PHOTO_COUNT, MAX_TOTAL_PHOTO_BYTES, supportedPhotoTypes, type SupportedPhotoType } from "@/lib/consultations/schema";

type ContactFormProps = {
  deliveryEnabled: boolean;
  initialService?: ServiceOptionValue | "";
  turnstileSiteKey: string | null;
  supabaseConfig: { url: string; publishableKey: string } | null;
};

type FormStatus =
  | { state: "idle"; message: "" }
  | { state: "submitting"; message: string }
  | { state: "success"; message: string; reference: string }
  | { state: "error"; message: string; reference?: string };

type PhotoItem = {
  id: string;
  file: File;
  preview: string;
  caption: string;
  state: "ready" | "uploading" | "uploaded" | "error";
  error?: string;
};

const initialStatus: FormStatus = { state: "idle", message: "" };

export function ContactForm({ deliveryEnabled, initialService = "", turnstileSiteKey, supabaseConfig }: ContactFormProps) {
  const [status, setStatus] = useState<FormStatus>(initialStatus);
  const [errors, setErrors] = useState<Partial<Record<ContactField | "form" | "photos" | "privacyConsent", string>>>({});
  const [photos, setPhotos] = useState<PhotoItem[]>([]);
  const startedAt = useRef(0);
  const trackedStart = useRef(false);
  const errorSummary = useRef<HTMLDivElement>(null);

  useEffect(() => { startedAt.current = Date.now(); }, []);
  useEffect(() => () => photos.forEach((photo) => URL.revokeObjectURL(photo.preview)), [photos]);

  function trackStart() {
    if (!trackedStart.current && process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false") {
      trackedStart.current = true;
      track("contact_form_start", { source: "contact_page" });
    }
  }

  async function addPhotos(files: FileList | null) {
    if (!files) return;
    const remaining = MAX_PHOTO_COUNT - photos.length;
    const selected = Array.from(files).slice(0, Math.max(0, remaining));
    const next: PhotoItem[] = [];
    let combined = photos.reduce((sum, item) => sum + item.file.size, 0);
    let message = files.length > remaining ? `Choose no more than ${MAX_PHOTO_COUNT} photos.` : "";

    for (const file of selected) {
      if (!supportedPhotoTypes.includes(file.type as SupportedPhotoType)) {
        message = `${file.name} is not a supported JPEG, PNG, or WebP image.`;
        continue;
      }
      if (file.size <= 0 || file.size > MAX_PHOTO_BYTES) {
        message = `${file.name} must be larger than zero and no more than 15 MB.`;
        continue;
      }
      if (combined + file.size > MAX_TOTAL_PHOTO_BYTES) {
        message = "The selected photos exceed the 75 MB combined limit.";
        continue;
      }
      const signature = new Uint8Array(await file.slice(0, 32).arrayBuffer());
      if (!hasSupportedImageSignature(signature, file.type as SupportedPhotoType)) {
        message = `${file.name} does not appear to be a valid image.`;
        continue;
      }
      combined += file.size;
      next.push({ id: crypto.randomUUID(), file, preview: URL.createObjectURL(file), caption: "", state: "ready" });
    }
    setPhotos((current) => [...current, ...next]);
    setErrors((current) => ({ ...current, photos: message || undefined }));
  }

  function removePhoto(id: string) {
    setPhotos((current) => {
      const target = current.find((photo) => photo.id === id);
      if (target) URL.revokeObjectURL(target.preview);
      return current.filter((photo) => photo.id !== id);
    });
  }

  function updatePhoto(id: string, patch: Partial<PhotoItem>) {
    setPhotos((current) => current.map((photo) => photo.id === id ? { ...photo, ...patch } : photo));
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!deliveryEnabled || status.state === "submitting" || !supabaseConfig) return;
    const form = event.currentTarget;
    const data = new FormData(form);
    const service = String(data.get("service") || "");
    const payload = {
      name: String(data.get("name") || ""), email: String(data.get("email") || ""),
      phone: String(data.get("phone") || ""), location: String(data.get("location") || ""),
      service, consultationPreference: String(data.get("consultationPreference") || ""),
      timeline: String(data.get("timeline") || ""), description: String(data.get("description") || ""),
      referralSource: String(data.get("referralSource") || ""), website: String(data.get("website") || ""),
      startedAt: String(startedAt.current || Date.now()),
      turnstileToken: String(data.get("cf-turnstile-response") || ""),
      spaceType: String(data.get("spaceType") || ""), roomWidth: String(data.get("roomWidth") || ""),
      roomDepth: String(data.get("roomDepth") || ""), ceilingHeight: String(data.get("ceilingHeight") || ""),
      handedness: String(data.get("handedness") || ""), simulatorSystem: String(data.get("simulatorSystem") || ""),
      privacyConsent: data.get("privacyConsent") === "yes",
      photos: photos.map((photo) => ({
        clientId: photo.id, originalFilename: photo.file.name, mimeType: photo.file.type,
        byteSize: photo.file.size, caption: photo.caption,
      })),
    };

    setErrors({});
    setPhotos((current) => current.map((photo) => ({ ...photo, state: "ready", error: undefined })));
    setStatus({ state: "submitting", message: photos.length ? "Saving your request and preparing secure photo uploads…" : "Saving your consultation request…" });
    if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false") track("contact_form_submit", { service_category: service || "unknown" });

    let session: { consultationId: string; submissionToken: string } | null = null;
    try {
      const startResponse = await fetch("/api/consultations/start", {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload),
      });
      const start = await startResponse.json() as {
        ok: boolean; message?: string; correlationId?: string; consultationId?: string;
        submissionToken?: string; uploads?: { clientId: string; path: string; token: string; mimeType: string }[];
        errors?: typeof errors;
      };
      if (!startResponse.ok || !start.ok || !start.consultationId || !start.submissionToken) {
        setErrors(start.errors || {});
        throw Object.assign(new Error(start.message || "Your consultation could not be saved."), { reference: start.correlationId });
      }
      session = { consultationId: start.consultationId, submissionToken: start.submissionToken };
      const supabase = createSupabaseBrowserClient(supabaseConfig.url, supabaseConfig.publishableKey);
      let uploaded = 0;
      for (const authorization of start.uploads || []) {
        const photo = photos.find((item) => item.id === authorization.clientId);
        if (!photo) throw new Error("A selected photo could not be matched.");
        updatePhoto(photo.id, { state: "uploading" });
        setStatus({ state: "submitting", message: `Uploading room photos — ${uploaded} of ${photos.length} complete…` });
        const { error } = await supabase.storage.from("consultation-photos").uploadToSignedUrl(
          authorization.path, authorization.token, photo.file,
          { contentType: photo.file.type, upsert: false },
        );
        if (error) {
          updatePhoto(photo.id, { state: "error", error: "Upload failed. Submit again to retry securely." });
          throw new Error("One or more photos could not be uploaded. Submit again to retry.");
        }
        uploaded += 1;
        updatePhoto(photo.id, { state: "uploaded" });
      }

      setStatus({ state: "submitting", message: "Verifying photos and completing your consultation…" });
      const finalResponse = await fetch("/api/consultations/finalize", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...session,
          captions: Object.fromEntries(photos.map((photo) => [photo.id, photo.caption])),
        }),
      });
      const final = await finalResponse.json() as { ok: boolean; message: string; correlationId?: string };
      if (!finalResponse.ok || !final.ok) throw Object.assign(new Error(final.message), { reference: final.correlationId });

      setStatus({ state: "success", message: final.message, reference: final.correlationId || session.consultationId });
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false") track("contact_form_success", { service_category: service || "unknown" });
      form.reset();
      photos.forEach((photo) => URL.revokeObjectURL(photo.preview));
      setPhotos([]);
      startedAt.current = Date.now();
    } catch (error) {
      if (session) {
        fetch("/api/consultations/cancel", {
          method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(session),
        }).catch(() => undefined);
      }
      const detail = error as Error & { reference?: string };
      setStatus({ state: "error", message: detail.message || "Your consultation could not be completed. Check your connection and try again.", reference: detail.reference });
      if (process.env.NEXT_PUBLIC_ANALYTICS_ENABLED !== "false") track("contact_form_error", { error_class: "submission" });
      window.setTimeout(() => errorSummary.current?.focus(), 0);
    }
  }

  const isSubmitting = status.state === "submitting";
  const isDisabled = !deliveryEnabled;
  const uploadedCount = photos.filter((photo) => photo.state === "uploaded").length;

  return (
    <>
      {turnstileSiteKey ? <Script src="https://challenges.cloudflare.com/turnstile/v0/api.js" strategy="afterInteractive" /> : null}
      {!deliveryEnabled ? <div className="contact-disabled-notice" role="status"><p className="contact-disabled-title">Online consultation storage is being connected.</p><p>Submission is temporarily unavailable until secure storage is configured. No information entered below will be sent or stored.</p></div> : null}
      {status.state === "success" ? (
        <div className="contact-success" role="status">
          <p className="eyebrow">Consultation received</p><h2>Thank you for the project details.</h2>
          <p>{status.message}</p><p className="contact-reference">Reference: {status.reference.slice(0, 8)}</p>
          <button className="button button-outline" onClick={() => setStatus(initialStatus)} type="button">Send another request</button>
        </div>
      ) : (
        <form aria-describedby={isDisabled ? "contact-disabled-context" : undefined} className="contact-form" noValidate onFocusCapture={trackStart} onSubmit={handleSubmit}>
          <fieldset disabled={isDisabled || isSubmitting}>
            <legend className="sr-only">Project consultation details</legend>
            {status.state === "error" ? <div className="form-error-summary" ref={errorSummary} role="alert" tabIndex={-1}><p>{status.message}</p>{status.reference ? <p>Reference: {status.reference.slice(0, 8)}</p> : null}</div> : null}
            <div className="form-grid">
              <FormField error={errors.name} label="Name" required><input autoComplete="name" id="name" maxLength={100} name="name" required type="text" /></FormField>
              <FormField error={errors.email} label="Email" required><input autoComplete="email" id="email" maxLength={254} name="email" required type="email" /></FormField>
              <FormField error={errors.phone} label="Phone"><input autoComplete="tel" id="phone" inputMode="tel" maxLength={30} name="phone" type="tel" /></FormField>
              <FormField error={errors.location} label="Project city or general location" required><input autoComplete="address-level2" id="location" maxLength={120} name="location" required type="text" /></FormField>
              <FormField error={errors.service} label="Simulator project" required><select defaultValue={initialService} id="service" name="service" required><option disabled value="">Choose a project type</option>{serviceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FormField>
              <FormField error={errors.consultationPreference} label="Preferred first room review" required><select defaultValue="" id="consultationPreference" name="consultationPreference" required><option disabled value="">Choose a review approach</option>{consultationOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FormField>
              <FormField error={errors.timeline} label="Approximate timeline" required><select defaultValue="" id="timeline" name="timeline" required><option disabled value="">Choose a timeline</option>{timelineOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select></FormField>
              <FormField label="Current space type"><input id="spaceType" maxLength={80} name="spaceType" placeholder="Finished room, unfinished space, teaching bay…" type="text" /></FormField>
              <FormField label="Approximate room width"><input id="roomWidth" maxLength={40} name="roomWidth" placeholder={'For example, 16\''} type="text" /></FormField>
              <FormField label="Approximate room depth"><input id="roomDepth" maxLength={40} name="roomDepth" placeholder={'For example, 20\''} type="text" /></FormField>
              <FormField label="Approximate ceiling height"><input id="ceilingHeight" maxLength={40} name="ceilingHeight" placeholder={'For example, 10\''} type="text" /></FormField>
              <FormField label="Player handedness"><input id="handedness" maxLength={80} name="handedness" placeholder="Right, left, or both" type="text" /></FormField>
              <FormField label="Known simulator system"><input id="simulatorSystem" maxLength={120} name="simulatorSystem" placeholder="If selected; Zarka does not sell equipment" type="text" /></FormField>
              <FormField className="form-field-wide" error={errors.description} label="Project description" required><textarea id="description" maxLength={2000} minLength={20} name="description" placeholder="Tell us how you hope to use the room, known conditions, intended players, and important constraints." required rows={7} /></FormField>
              <FormField className="form-field-wide" error={errors.referralSource} label="How did you hear about Zarka Construction?"><input id="referralSource" maxLength={120} name="referralSource" type="text" /></FormField>
            </div>

            <div className="photo-field">
              <div><label htmlFor="roomPhotos">Add room photos <span className="optional-label">Optional</span></label><p>Photos of the room, intended screen wall, ceiling, hitting position, doors, windows, soffits, and obstructions can help us understand the space before follow-up.</p></div>
              <input accept="image/jpeg,image/png,image/webp" id="roomPhotos" multiple onChange={(event) => { void addPhotos(event.target.files); event.target.value = ""; }} type="file" />
              <p className="field-help">Up to 10 JPEG, PNG, or WebP images; 15 MB each and 75 MB combined. Avoid private documents or people shown without permission.</p>
              {errors.photos ? <p className="field-error" role="alert">{errors.photos}</p> : null}
              {photos.length ? <div className="photo-grid">{photos.map((photo) => <article className="photo-item" key={photo.id}><img alt="" height={120} src={photo.preview} width={160} /><div><p className="photo-name">{photo.file.name}</p><p>{(photo.file.size / 1024 / 1024).toFixed(1)} MB · {photo.state}</p><label htmlFor={`caption-${photo.id}`}>Caption <span className="optional-label">Optional</span></label><input id={`caption-${photo.id}`} maxLength={240} onChange={(event) => updatePhoto(photo.id, { caption: event.target.value })} value={photo.caption} /></div><button aria-label={`Remove ${photo.file.name}`} className="photo-remove" onClick={() => removePhoto(photo.id)} type="button">Remove</button>{photo.error ? <p className="field-error">{photo.error}</p> : null}</article>)}</div> : null}
              {isSubmitting && photos.length ? <div className="upload-progress"><progress max={photos.length} value={uploadedCount}>{uploadedCount} of {photos.length}</progress><span>{uploadedCount} of {photos.length} photos securely uploaded</span></div> : null}
            </div>

            <div aria-hidden="true" className="form-honeypot"><label htmlFor="website">Website</label><input autoComplete="off" id="website" name="website" tabIndex={-1} type="text" /></div>
            {turnstileSiteKey ? <div className="cf-turnstile" data-sitekey={turnstileSiteKey} data-theme="light" /> : null}
            <div className="privacy-consent">
              <input id="privacyConsent" name="privacyConsent" required type="checkbox" value="yes" />
              <label htmlFor="privacyConsent">I agree that Zarka Construction may securely store and use these details and optional photos to review and respond to this consultation request. Approximate dimensions do not replace field verification.</label>
            </div>
            {errors.privacyConsent ? <p className="field-error">{errors.privacyConsent}</p> : null}
            <div className="form-submit-row"><button className="button button-primary" type="submit">{isSubmitting ? "Saving consultation…" : "Send consultation request"}</button><p>Required fields are marked. A submission starts a conversation; it does not create a project agreement.</p></div>
          </fieldset>
        </form>
      )}
    </>
  );
}

type FormFieldProps = {
  label: string;
  children: ReactElement<{ id: string; "aria-describedby"?: string; "aria-invalid"?: boolean }>;
  required?: boolean;
  error?: string;
  className?: string;
};

function FormField({ label, children, required = false, error, className = "" }: FormFieldProps) {
  const inputId = children.props.id as string;
  const errorId = `${inputId}-error`;
  const control = error ? cloneElement(children, { "aria-describedby": errorId, "aria-invalid": true }) : children;
  return <div className={`form-field ${className}`}><label htmlFor={inputId}>{label}{required ? <span aria-hidden="true"> *</span> : null}{!required ? <span className="optional-label"> Optional</span> : null}</label>{control}{error ? <p className="field-error" id={errorId}>{error}</p> : null}</div>;
}
