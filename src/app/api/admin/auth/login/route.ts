import { NextRequest, NextResponse } from "next/server";

import { getAdminAllowlist, isAllowedAdminEmail } from "@/lib/admin/auth";
import { logAdminAuthStage } from "@/lib/admin/auth-diagnostics";
import { isSameOriginAdminRequest } from "@/lib/admin/auth-http";
import { checkAdminAuthRateLimit } from "@/lib/admin/auth-rate-limit";
import { readJsonRequest, requestAddress } from "@/lib/consultations/http";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export const runtime = "nodejs";

function reply(message: string, status: number) {
  return NextResponse.json({ ok: false, message }, { status });
}

export async function POST(request: NextRequest) {
  if (!isSameOriginAdminRequest(request)) return reply("The sign-in request could not be accepted.", 403);
  const limit = checkAdminAuthRateLimit(requestAddress(request), request.headers.get("user-agent") || "unknown", "login");
  if (!limit.allowed) {
    return NextResponse.json(
      { ok: false, message: "Too many sign-in attempts. Wait a few minutes and try again." },
      { status: 429, headers: { "Retry-After": String(Math.max(1, Math.ceil((limit.resetAt - Date.now()) / 1000))) } },
    );
  }

  const parsed = await readJsonRequest(request, "admin-login", 8_192);
  if ("response" in parsed) return reply("Email or password is incorrect.", 401);
  const body = parsed.body as { email?: unknown; password?: unknown; returnTo?: unknown };
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body?.password === "string" ? body.password : "";
  const returnTo = body?.returnTo === "/field" ? "/field" : "/admin";
  if (!email || !password) return reply("Email or password is incorrect.", 401);

  const routeClient = createSupabaseRouteClient(request);
  if (!routeClient || getAdminAllowlist().size === 0) {
    logAdminAuthStage("password_login_failed", { reason: "configuration" });
    return reply("Founder authentication is temporarily unavailable.", 503);
  }
  const { client, applyCookies } = routeClient;
  const { error: signInError } = await client.auth.signInWithPassword({ email, password });
  if (signInError) {
    logAdminAuthStage("password_login_failed", { reason: "credentials" });
    return reply("Email or password is incorrect.", 401);
  }
  const { data, error: userError } = await client.auth.getUser();
  if (userError || !data.user || !isAllowedAdminEmail(data.user.email)) {
    await client.auth.signOut({ scope: "local" });
    logAdminAuthStage("allowlist_rejected", { reason: "unauthorized" });
    return applyCookies(reply("Email or password is incorrect.", 401));
  }
  logAdminAuthStage("password_login_success");
  return applyCookies(NextResponse.json({ ok: true, redirectTo: returnTo }));
}
