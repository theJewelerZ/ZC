import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { checkRateLimit, createRequestFingerprint } from "@/lib/contact/rate-limit";
import { verifyTurnstile } from "@/lib/contact/turnstile";
import { consultationError, logConsultationEvent, readJsonRequest, requestAddress } from "@/lib/consultations/http";
import { cleanupExpiredConsultations, createPendingConsultation } from "@/lib/consultations/repository";
import { validateConsultationStartPayload } from "@/lib/consultations/schema";
import { getPublishedBuildContext } from "@/lib/projects/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isConsultationBackendConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const correlationId = randomUUID();
  if (!isConsultationBackendConfigured()) {
    logConsultationEvent("consultation_backend_unconfigured", correlationId);
    return consultationError("Online consultation storage is temporarily unavailable. No information was saved.", 503, correlationId);
  }

  const parsed = await readJsonRequest(request, correlationId);
  if ("response" in parsed) return parsed.response;
  const validation = validateConsultationStartPayload(parsed.body);
  if (!validation.success) {
    logConsultationEvent("consultation_validation_failed", correlationId, { abuseDetected: Boolean(validation.abuseDetected) });
    return consultationError(validation.errors.form || "Review the highlighted fields and try again.", validation.abuseDetected ? 400 : 422, correlationId, validation.errors as Record<string, string>);
  }

  const address = requestAddress(request);
  const fingerprint = createRequestFingerprint(address, request.headers.get("user-agent") || "unknown");
  const limit = checkRateLimit(fingerprint);
  if (!limit.allowed) {
    logConsultationEvent("consultation_rate_limited", correlationId);
    return NextResponse.json(
      { ok: false, message: "Too many requests were submitted. Please wait and try again later.", correlationId },
      { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))) } },
    );
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (turnstileSecret && turnstileSiteKey) {
    const verified = validation.data.turnstileToken
      && await verifyTurnstile(validation.data.turnstileToken, turnstileSecret, address);
    if (!verified) {
      logConsultationEvent("consultation_turnstile_failed", correlationId);
      return consultationError("The security check could not be completed. Refresh the page and try again.", 422, correlationId);
    }
  }

  try {
    const client = createSupabaseAdminClient();
    cleanupExpiredConsultations(client).catch(() => {
      logConsultationEvent("consultation_cleanup_deferred", correlationId);
    });
    const sourceBuild = validation.data.sourceBuildSlug
      ? await getPublishedBuildContext(validation.data.sourceBuildSlug)
      : null;
    const result = await createPendingConsultation(client, validation.data, sourceBuild?.id || null);
    logConsultationEvent("consultation_pending_created", correlationId, {
      photoCount: result.uploads.length,
      source: sourceBuild ? "inside_the_build" : "website",
    });
    return NextResponse.json({ ok: true, correlationId, ...result });
  } catch (error) {
    logConsultationEvent("consultation_create_failed", correlationId, { errorClass: error instanceof Error ? error.name : "UnknownError" });
    return consultationError("Your consultation could not be saved. Please try again later.", 503, correlationId);
  }
}
