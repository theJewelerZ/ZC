import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

import { getAdminAllowlist, isAllowedAdminEmail } from "@/lib/admin/auth";
import { logAdminAuthStage } from "@/lib/admin/auth-diagnostics";
import { getAdminAuthOrigin } from "@/lib/admin/auth-origin";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

function redirectResponse(request: NextRequest, destination: string) {
  return NextResponse.redirect(new URL(destination, request.url));
}

function setRedirect(response: NextResponse, request: NextRequest, destination: string) {
  response.headers.set("location", new URL(destination, request.url).toString());
}

export async function GET(request: NextRequest) {
  const host = request.nextUrl.host;
  logAdminAuthStage("recovery_callback_received", { host });
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return redirectResponse(request, "/admin/forgot-password?error=expired");

  const expectedOrigin = getAdminAuthOrigin(request.nextUrl.origin);
  if (expectedOrigin !== request.nextUrl.origin) {
    logAdminAuthStage("callback_origin_mismatch", { host, reason: "origin_mismatch" });
    return redirectResponse(request, "/admin/forgot-password?error=browser");
  }
  const config = getSupabasePublicConfig();
  if (!config || getAdminAllowlist().size === 0) {
    return redirectResponse(request, "/admin/forgot-password?error=configuration");
  }
  const hasVerifier = request.cookies.getAll().some(({ name }) => name.includes("code-verifier"));
  if (!hasVerifier) {
    logAdminAuthStage("pkce_verifier_missing", { host, reason: "pkce" });
    return redirectResponse(request, "/admin/forgot-password?error=browser");
  }

  const response = redirectResponse(request, "/admin/reset-password");
  const client = createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
      },
    },
  });
  const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    logAdminAuthStage("recovery_exchange_failed", { host, reason: "expired_or_used" });
    setRedirect(response, request, "/admin/forgot-password?error=expired");
    return response;
  }
  const { data, error: userError } = await client.auth.getUser();
  if (userError || !data.user || !isAllowedAdminEmail(data.user.email)) {
    await client.auth.signOut({ scope: "local" });
    logAdminAuthStage("allowlist_rejected", { host, reason: "unauthorized" });
    setRedirect(response, request, "/admin/forgot-password?error=unauthorized");
    return response;
  }

  response.cookies.set("zarka-admin-recovery", "active", {
    httpOnly: true,
    maxAge: 10 * 60,
    path: "/",
    sameSite: "lax",
    secure: request.nextUrl.protocol === "https:",
  });
  logAdminAuthStage("recovery_exchange_success", { host });
  return response;
}