import type { Metadata } from "next";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminUser } from "@/lib/admin/auth";
import { getAdminAuthOrigin } from "@/lib/admin/auth-origin";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Founder sign in", robots: { index: false, follow: false, nocache: true } };

const errorMessages: Record<string, string> = {
  "callback-mismatch": "The sign-in link returned to a different Preview address. Open the current Founder Login page and request a new link.",
  "missing-code": "The sign-in link is incomplete. Request a new link and open only the newest email.",
  expired: "That sign-in link is expired or has already been used. Request a new link and open only the newest email.",
  pkce: "This browser does not have the sign-in verification started by the Founder Login page. Request a new link here, then open it in this same browser and device.",
  signin: "The sign-in session could not be verified. Request a new link and open it in the same browser and device.",
  "session-cookie": "The sign-in was verified, but the secure session cookie was not retained. Allow cookies for this Preview and try again.",
  unauthorized: "That authenticated account is not authorized for the founder dashboard.",
  configuration: "Founder authentication is temporarily unavailable because required configuration is incomplete.",
};

function requestOrigin(requestHeaders: Awaited<ReturnType<typeof headers>>) {
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || requestHeaders.get("host") || "localhost:3000";
  const forwardedProto = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  const protocol = forwardedProto || (host.startsWith("localhost") ? "http" : "https");
  return `${protocol}://${host}`;
}

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  if (await getAdminUser()) redirect("/admin");

  const currentOrigin = requestOrigin(await headers());
  const authOrigin = getAdminAuthOrigin(currentOrigin);
  if (authOrigin !== currentOrigin) redirect(`${authOrigin}/admin/login`);

  const config = getSupabasePublicConfig();
  const rawError = (await searchParams).error;
  const error = Array.isArray(rawError) ? rawError[0] : rawError;
  const message = error ? errorMessages[error] || "Sign-in could not be completed. Request a new secure link." : null;
  return <main className="admin-shell" id="main-content"><section className="admin-login-panel"><p className="eyebrow">Private founder access</p><h1>Consultation dashboard</h1><p>Sign in with the pre-authorized founder email. There is no public registration or customer account.</p>{message ? <div className="form-error-summary" role="alert">{message}</div> : null}{config ? <AdminLoginForm callbackUrl={`${authOrigin}/auth/callback`} {...config} /> : message ? null : <div className="form-error-summary" role="alert">Founder authentication is not configured in this environment.</div>}</section></main>;
}
