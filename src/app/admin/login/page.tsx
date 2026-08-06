import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminUser } from "@/lib/admin/auth";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Founder sign in", robots: { index: false, follow: false, nocache: true } };

const errorMessages: Record<string, string> = {
  "callback-mismatch": "The sign-in link returned to a different address. Start a new recovery request from this page.",
  "missing-code": "The sign-in link is incomplete. Request a new recovery email.",
  expired: "That email link is expired or has already been used. Request a new recovery email.",
  pkce: "This browser does not have the verification that started the email request. Request a new recovery email here, then open it in this same browser and device.",
  signin: "The secure session could not be verified. Try signing in again.",
  "session-cookie": "The sign-in was verified, but the secure session cookie was not retained. Allow cookies and try again.",
  unauthorized: "That authenticated account is not authorized for the founder dashboard.",
  configuration: "Founder authentication is temporarily unavailable because required configuration is incomplete.",
  "recovery-session": "The password recovery session is missing or expired. Request a new recovery email.",
};

export default async function AdminLoginPage({ searchParams }: { searchParams: Promise<{ error?: string | string[]; password?: string | string[] }> }) {
  if (await getAdminUser()) redirect("/admin");
  const config = getSupabasePublicConfig();
  const params = await searchParams;
  const rawError = params.error;
  const error = Array.isArray(rawError) ? rawError[0] : rawError;
  const passwordState = Array.isArray(params.password) ? params.password[0] : params.password;
  const message = error ? errorMessages[error] || "Sign-in could not be completed." : null;
  return <main className="admin-shell" id="main-content"><section className="admin-login-panel"><p className="eyebrow">Private founder access</p><h1>Consultation dashboard</h1><p>Sign in with the authorized founder account. There is no public registration or customer account.</p>{message ? <div className="form-error-summary" role="alert">{message}</div> : null}{passwordState === "reset" ? <div className="form-success-summary" role="status">Your password was updated. Sign in with the new password.</div> : null}{config ? <AdminLoginForm /> : message ? null : <div className="form-error-summary" role="alert">Founder authentication is not configured in this environment.</div>}</section></main>;
}