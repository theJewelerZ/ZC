import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminUser } from "@/lib/admin/auth";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Founder sign in", robots: { index: false, follow: false, nocache: true } };

const errorMessages: Record<string, string> = {
  "missing-code": "The sign-in link is incomplete. Request a new link and open only the newest email.",
  signin: "The sign-in link could not be completed. It may be expired or already used. Request a new link.",
  unauthorized: "That authenticated account is not authorized for the founder dashboard.",
  configuration: "Founder authentication is temporarily unavailable because required configuration is incomplete.",
};

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string | string[] }>;
}) {
  if (await getAdminUser()) redirect("/admin");
  const config = getSupabasePublicConfig();
  const rawError = (await searchParams).error;
  const error = Array.isArray(rawError) ? rawError[0] : rawError;
  const message = error ? errorMessages[error] || "Sign-in could not be completed. Request a new secure link." : null;
  return <main className="admin-shell" id="main-content"><section className="admin-login-panel"><p className="eyebrow">Private founder access</p><h1>Consultation dashboard</h1><p>Sign in with the pre-authorized founder email. There is no public registration or customer account.</p>{message ? <div className="form-error-summary" role="alert">{message}</div> : null}{config ? <AdminLoginForm {...config} /> : message ? null : <div className="form-error-summary" role="alert">Founder authentication is not configured in this environment.</div>}</section></main>;
}
