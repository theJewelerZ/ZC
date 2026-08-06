import { NextRequest, NextResponse } from "next/server";

import { getAdminAllowlist } from "@/lib/admin/auth";
import { isSameOriginAdminRequest } from "@/lib/admin/auth-http";
import { checkAdminAuthRateLimit } from "@/lib/admin/auth-rate-limit";
import { readJsonRequest, requestAddress } from "@/lib/consultations/http";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) {
    return NextResponse.json({ ok: false, message: "The recovery request could not be accepted." }, { status: 403 });
  }
  const parsed = await readJsonRequest(request, "admin-recovery", 4_096);
  if ("response" in parsed) return NextResponse.json({ ok: true, message: "If the account is eligible, recovery instructions will be sent." });

  const limit = checkAdminAuthRateLimit(requestAddress(request), request.headers.get("user-agent") || "unknown", "recovery");
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many recovery requests. Wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))) } },
    );
  }
  if (!getSupabasePublicConfig() || getAdminAllowlist().size === 0) {
    return NextResponse.json({ ok: false, message: "Password recovery is temporarily unavailable." }, { status: 503 });
  }
  return NextResponse.json({ ok: true, message: "If the account is eligible, recovery instructions will be sent." });
}
