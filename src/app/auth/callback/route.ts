import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

import { getAdminAllowlist, isAllowedAdminEmail } from "@/lib/admin/auth";
import { logAdminAuthStage } from "@/lib/admin/auth-diagnostics";
import { getAdminAuthOrigin } from "@/lib/admin/auth-origin";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

type CallbackError =
  | "callback-mismatch"
  | "configuration"
  | "expired"
  | "missing-code"
  | "pkce"
  | "session-cookie"
  | "signin"
  | "unauthorized";

function redirectResponse(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

function setRedirect(response: NextResponse, request: NextRequest, error?: CallbackError) {
  const destination = error ? `/admin/login?error=${error}` : "/admin";
  response.headers.set("location", new URL(destination, request.url).toString());
}

function isSessionCookie(name: string, value: string) {
  return Boolean(value) && name.includes("-auth-token") && !name.includes("code-verifier");
}

export async function GET(request: NextRequest) {
  const host = request.nextUrl.host;
  logAdminAuthStage("callback_received", { host });

  const code = request.nextUrl.searchParams.get("code");
  if (!code) return redirectResponse(request, "/admin/login?error=missing-code");

  const expectedOrigin = getAdminAuthOrigin(request.nextUrl.origin);
  if (expectedOrigin !== request.nextUrl.origin) {
    logAdminAuthStage("callback_origin_mismatch", { host, reason: "origin_mismatch" });
    return redirectResponse(request, "/admin/login?error=callback-mismatch");
  }

  const config = getSupabasePublicConfig();
  if (!config || getAdminAllowlist().size === 0) {
    logAdminAuthStage("code_exchange_failed", { host, reason: "configuration" });
    return redirectResponse(request, "/admin/login?error=configuration");
  }

  const hasPkceVerifier = request.cookies
    .getAll()
    .some(({ name }) => name.includes("code-verifier"));
  if (!hasPkceVerifier) {
    logAdminAuthStage("pkce_verifier_missing", { host, reason: "pkce" });
    return redirectResponse(request, "/admin/login?error=pkce");
  }

  const response = redirectResponse(request, "/admin");
  let sessionCookieWritten = false;
  const client = createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          if (isSessionCookie(name, value)) sessionCookieWritten = true;
          response.cookies.set(name, value, options);
        });
      },
    },
  });

  const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    logAdminAuthStage("code_exchange_failed", { host, reason: "expired_or_used" });
    setRedirect(response, request, "expired");
    return response;
  }
  logAdminAuthStage("code_exchange_success", { host });

  if (!sessionCookieWritten) {
    logAdminAuthStage("session_cookie_missing", { host, reason: "session" });
    await client.auth.signOut();
    setRedirect(response, request, "session-cookie");
    return response;
  }
  logAdminAuthStage("session_cookie_written", { host });

  const { data, error: userError } = await client.auth.getUser();
  if (userError || !data.user) {
    logAdminAuthStage("user_missing", { host, reason: "session" });
    await client.auth.signOut();
    setRedirect(response, request, "signin");
    return response;
  }
  logAdminAuthStage("user_loaded", { host });

  if (!isAllowedAdminEmail(data.user.email)) {
    logAdminAuthStage("allowlist_rejected", { host, reason: "unauthorized" });
    await client.auth.signOut();
    setRedirect(response, request, "unauthorized");
    return response;
  }

  logAdminAuthStage("allowlist_match", { host });
  logAdminAuthStage("redirecting_admin", { host });
  return response;
}
