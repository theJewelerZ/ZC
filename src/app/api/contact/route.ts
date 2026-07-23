import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { sendContactEmail } from "@/lib/contact/email";
import {
  checkRateLimit,
  createRequestFingerprint,
} from "@/lib/contact/rate-limit";
import { validateContactPayload } from "@/lib/contact/schema";
import { verifyTurnstile } from "@/lib/contact/turnstile";

export const runtime = "nodejs";

function logContactEvent(
  event: string,
  correlationId: string,
  details: Record<string, string | number | boolean> = {},
) {
  console.info(
    JSON.stringify({
      event,
      correlationId,
      ...details,
    }),
  );
}

export async function POST(request: NextRequest) {
  const correlationId = randomUUID();
  const contentLength = Number(request.headers.get("content-length") || 0);
  const contentType = request.headers.get("content-type") || "";
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");

  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      {
        ok: false,
        message: "The request format could not be accepted.",
        correlationId,
      },
      { status: 415 },
    );
  }

  if (contentLength > 32_768) {
    return NextResponse.json(
      {
        ok: false,
        message: "The submitted request is too large.",
        correlationId,
      },
      { status: 413 },
    );
  }

  if (origin && host) {
    try {
      if (new URL(origin).host !== host) {
        return NextResponse.json(
          {
            ok: false,
            message: "The request origin could not be accepted.",
            correlationId,
          },
          { status: 403 },
        );
      }
    } catch {
      return NextResponse.json(
        {
          ok: false,
          message: "The request origin could not be read.",
          correlationId,
        },
        { status: 403 },
      );
    }
  }

  let rawBody: string;
  try {
    rawBody = await request.text();
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "The submitted request could not be read.",
        correlationId,
      },
      { status: 400 },
    );
  }

  if (rawBody.length > 32_768) {
    return NextResponse.json(
      {
        ok: false,
        message: "The submitted request is too large.",
        correlationId,
      },
      { status: 413 },
    );
  }

  let body: unknown;
  try {
    body = JSON.parse(rawBody);
  } catch {
    return NextResponse.json(
      {
        ok: false,
        message: "The submitted request could not be read.",
        correlationId,
      },
      { status: 400 },
    );
  }

  const validation = validateContactPayload(body);
  if (!validation.success) {
    logContactEvent("contact_validation_failed", correlationId, {
      abuseDetected: Boolean(validation.abuseDetected),
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          validation.errors.form ||
          "Review the highlighted fields and try again.",
        errors: validation.errors,
        correlationId,
      },
      { status: validation.abuseDetected ? 400 : 422 },
    );
  }

  const forwardedAddress =
    request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    request.headers.get("x-real-ip") ||
    "unknown";
  const fingerprint = createRequestFingerprint(
    forwardedAddress,
    request.headers.get("user-agent") || "unknown",
  );
  const limit = checkRateLimit(fingerprint);

  if (!limit.allowed) {
    logContactEvent("contact_rate_limited", correlationId);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Too many requests were submitted. Please wait and try again later.",
        correlationId,
      },
      {
        status: 429,
        headers: {
          "Retry-After": String(
            Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1_000)),
          ),
        },
      },
    );
  }

  const turnstileSecret = process.env.TURNSTILE_SECRET_KEY;
  const turnstileSiteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY;
  if (turnstileSecret && turnstileSiteKey) {
    const verified =
      validation.data.turnstileToken &&
      (await verifyTurnstile(
        validation.data.turnstileToken,
        turnstileSecret,
        forwardedAddress,
      ));

    if (!verified) {
      logContactEvent("contact_turnstile_failed", correlationId);
      return NextResponse.json(
        {
          ok: false,
          message:
            "The security check could not be completed. Refresh the page and try again.",
          correlationId,
        },
        { status: 422 },
      );
    }
  }

  const apiKey = process.env.RESEND_API_KEY;
  const recipient = process.env.CONTACT_RECIPIENT_EMAIL;
  const sender = process.env.CONTACT_FROM_EMAIL;

  if (!apiKey || !recipient || !sender) {
    logContactEvent("contact_delivery_unconfigured", correlationId);
    return NextResponse.json(
      {
        ok: false,
        message:
          "Online request delivery is temporarily unavailable. Your message was not sent.",
        correlationId,
      },
      { status: 503 },
    );
  }

  try {
    const result = await sendContactEmail({
      payload: validation.data,
      correlationId,
      recipient,
      sender,
      apiKey,
    });
    logContactEvent("contact_delivery_accepted", correlationId, {
      providerIdPresent: Boolean(result.id),
    });

    return NextResponse.json({
      ok: true,
      message:
        "Your request was delivered. Zarka Construction will review the details.",
      correlationId,
    });
  } catch (error) {
    logContactEvent("contact_delivery_failed", correlationId, {
      errorClass: error instanceof Error ? error.name : "UnknownError",
    });
    return NextResponse.json(
      {
        ok: false,
        message:
          "The request could not be delivered. Your message was not sent. Please try again later.",
        correlationId,
      },
      { status: 502 },
    );
  }
}
