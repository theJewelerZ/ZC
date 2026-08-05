import { NextRequest, NextResponse } from "next/server";

export function consultationError(message: string, status: number, correlationId: string, errors?: Record<string, string>) {
  return NextResponse.json({ ok: false, message, correlationId, errors }, { status });
}

export async function readJsonRequest(
  request: NextRequest,
  correlationId: string,
  maximum = 65_536,
): Promise<{ response: NextResponse } | { body: unknown }> {
  const type = request.headers.get("content-type") || "";
  if (!type.includes("application/json")) return { response: consultationError("The request format could not be accepted.", 415, correlationId) };
  const length = Number(request.headers.get("content-length") || 0);
  if (length > maximum) return { response: consultationError("The submitted request is too large.", 413, correlationId) };
  const origin = request.headers.get("origin");
  const host = request.headers.get("host");
  if (origin && host) {
    try {
      if (new URL(origin).host !== host) return { response: consultationError("The request origin could not be accepted.", 403, correlationId) };
    } catch {
      return { response: consultationError("The request origin could not be read.", 403, correlationId) };
    }
  }
  try {
    const raw = await request.text();
    if (raw.length > maximum) return { response: consultationError("The submitted request is too large.", 413, correlationId) };
    return { body: JSON.parse(raw) as unknown };
  } catch {
    return { response: consultationError("The submitted request could not be read.", 400, correlationId) };
  }
}

export function requestAddress(request: NextRequest) {
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip") || "unknown";
}

export function logConsultationEvent(event: string, correlationId: string, details: Record<string, string | number | boolean> = {}) {
  console.info(JSON.stringify({ event, correlationId, ...details }));
}
