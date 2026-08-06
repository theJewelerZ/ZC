import "server-only";

import { createServerClient, type CookieOptionsWithName } from "@supabase/ssr";
import type { NextRequest, NextResponse } from "next/server";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

type PendingCookie = {
  name: string;
  value: string;
  options: CookieOptionsWithName;
};

export function createSupabaseRouteClient(request: NextRequest) {
  const config = getSupabasePublicConfig();
  if (!config) return null;
  const pendingCookies: PendingCookie[] = [];
  const client = createServerClient<Database>(config.url, config.publishableKey, {
    cookies: {
      getAll: () => request.cookies.getAll(),
      setAll(cookiesToSet) {
        pendingCookies.splice(0, pendingCookies.length, ...cookiesToSet);
      },
    },
  });

  return {
    client,
    applyCookies(response: NextResponse) {
      pendingCookies.forEach(({ name, value, options }) => {
        response.cookies.set(name, value, options);
      });
      return response;
    },
  };
}
