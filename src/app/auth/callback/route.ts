import { createServerClient } from "@supabase/ssr";
import { NextRequest, NextResponse } from "next/server";

import { getAdminAllowlist, isAllowedAdminEmail } from "@/lib/admin/auth";
import { getSupabasePublicConfig } from "@/lib/supabase/config";
import type { Database } from "@/lib/supabase/database.types";

type CallbackError = "configuration" | "missing-code" | "signin" | "unauthorized";

function redirectResponse(request: NextRequest, pathname: string) {
  return NextResponse.redirect(new URL(pathname, request.url));
}

function setRedirect(response: NextResponse, request: NextRequest, error?: CallbackError) {
  const destination = error ? `/admin/login?error=${error}` : "/admin";
  response.headers.set("location", new URL(destination, request.url).toString());
}

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  if (!code) return redirectResponse(request, "/admin/login?error=missing-code");

  const config = getSupabasePublicConfig();
  if (!config || getAdminAllowlist().size === 0) {
    return redirectResponse(request, "/admin/login?error=configuration");
  }

  // Supabase must write the PKCE session cookies onto the exact response that
  // is returned to the browser and redirects to the protected admin route.
  const response = redirectResponse(request, "/admin");
  const client = createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options),
        );
      },
    },
  });

  const { error: exchangeError } = await client.auth.exchangeCodeForSession(code);
  if (exchangeError) {
    setRedirect(response, request, "signin");
    return response;
  }

  const { data, error: userError } = await client.auth.getUser();
  if (userError || !data.user) {
    await client.auth.signOut();
    setRedirect(response, request, "signin");
    return response;
  }

  if (!isAllowedAdminEmail(data.user.email)) {
    await client.auth.signOut();
    setRedirect(response, request, "unauthorized");
  }

  return response;
}
