import { NextRequest, NextResponse } from "next/server";

import { getAdminAllowlist, isAllowedAdminEmail } from "@/lib/admin/auth";
import { logAdminAuthStage } from "@/lib/admin/auth-diagnostics";
import { isSameOriginAdminRequest } from "@/lib/admin/auth-http";
import { checkAdminAuthRateLimit } from "@/lib/admin/auth-rate-limit";
import { classifyPasswordUpdateError } from "@/lib/admin/password-errors";
import { validateAdminPassword } from "@/lib/admin/password-policy";
import { readJsonRequest, requestAddress } from "@/lib/consultations/http";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const runtime = "nodejs";
const recoveryCookie = "zarka-admin-recovery";

function response(message: string, status: number, field?: "password" | "confirmation") {
  return NextResponse.json({ ok: false, message, field }, { status });
}

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return response("The password request could not be accepted.", 403);
  const limit = checkAdminAuthRateLimit(requestAddress(request), request.headers.get("user-agent") || "unknown", "password-update");
  if (!limit.allowed) return response("Too many attempts. Wait a few minutes and try again.", 429);
  const parsed = await readJsonRequest(request, "admin-password", 8_192);
  if ("response" in parsed) return response("The password request could not be read.", 400);
  const body = parsed.body as { password?: unknown; confirmation?: unknown; mode?: unknown };
  const password = typeof body?.password === "string" ? body.password : "";
  const confirmation = typeof body?.confirmation === "string" ? body.confirmation : "";
  const mode = body?.mode === "reset" ? "reset" : body?.mode === "set" ? "set" : null;
  if (!mode) return response("The password request is invalid.", 400);
  if (password !== confirmation) {
    logAdminAuthStage("password_update_failed", { reason: "mismatch" });
    return response("The passwords do not match.", 422, "confirmation");
  }
  const validation = validateAdminPassword(password);
  if (!validation.success) {
    logAdminAuthStage("password_update_failed", { reason: "policy" });
    return response(validation.message, 422, "password");
  }
  if (mode === "reset" && request.cookies.get(recoveryCookie)?.value !== "active") {
    return response("This recovery session is missing or expired. Request a new recovery email.", 401);
  }

  const routeClient = createSupabaseRouteClient(request);
  if (!routeClient || getAdminAllowlist().size === 0) return response("Founder authentication is temporarily unavailable.", 503);
  const { client, applyCookies } = routeClient;
  const { data, error: userError } = await client.auth.getUser();
  if (userError || !data.user || !isAllowedAdminEmail(data.user.email)) {
    await client.auth.signOut({ scope: "local" });
    return applyCookies(response("Your secure session is missing or expired.", 401));
  }
  const { error: updateError } = await client.auth.updateUser({ password });
  if (updateError) {
    const failure = classifyPasswordUpdateError(updateError);
    logAdminAuthStage("password_update_failed", { reason: failure.reason });
    return applyCookies(response(failure.message, failure.reason === "rate_limit" ? 429 : 422));
  }
  logAdminAuthStage("password_update_success");

  if (mode === "reset") await client.auth.signOut({ scope: "local" });
  const result = applyCookies(NextResponse.json({ ok: true, redirectTo: mode === "reset" ? "/admin/login?password=reset" : "/admin" }));
  if (mode === "reset") result.cookies.set(recoveryCookie, "", { httpOnly: true, maxAge: 0, path: "/", sameSite: "lax", secure: request.nextUrl.protocol === "https:" });
  return result;
}
