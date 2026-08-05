import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";

import { consultationError, readJsonRequest } from "@/lib/consultations/http";
import { cancelPendingConsultation } from "@/lib/consultations/repository";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { isConsultationBackendConfigured } from "@/lib/supabase/config";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  const correlationId = randomUUID();
  if (!isConsultationBackendConfigured()) return consultationError("The request could not be completed.", 503, correlationId);
  const parsed = await readJsonRequest(request, correlationId, 8_192);
  if ("response" in parsed) return parsed.response;
  const raw = parsed.body as Record<string, unknown>;
  const id = typeof raw?.consultationId === "string" ? raw.consultationId : "";
  const token = typeof raw?.submissionToken === "string" ? raw.submissionToken : "";
  if (!/^[0-9a-f-]{36}$/i.test(id) || token.length < 32) return consultationError("The request could not be completed.", 400, correlationId);
  await cancelPendingConsultation(createSupabaseAdminClient(), id, token);
  return NextResponse.json({ ok: true });
}
