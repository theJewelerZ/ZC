import { NextRequest, NextResponse } from "next/server";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const destination = new URL("/admin", request.url);
  if (!code) return NextResponse.redirect(new URL("/admin/login?error=missing-code", request.url));
  const client = await createSupabaseServerClient();
  if (!client) return NextResponse.redirect(new URL("/admin/login?error=configuration", request.url));
  const { error } = await client.auth.exchangeCodeForSession(code);
  return NextResponse.redirect(error ? new URL("/admin/login?error=signin", request.url) : destination);
}
