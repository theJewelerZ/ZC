import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { ForgotPasswordForm } from "@/components/admin/forgot-password-form";
import { getAdminAuthOrigin } from "@/lib/admin/auth-origin";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Founder password recovery", robots: { index: false, follow: false, nocache: true } };

function requestOrigin(requestHeaders: Awaited<ReturnType<typeof headers>>) {
  const forwardedHost = requestHeaders.get("x-forwarded-host")?.split(",")[0]?.trim();
  const host = forwardedHost || requestHeaders.get("host") || "localhost:3000";
  const forwardedProto = requestHeaders.get("x-forwarded-proto")?.split(",")[0]?.trim();
  return `${forwardedProto || (host.startsWith("localhost") ? "http" : "https")}://${host}`;
}

const recoveryErrors: Record<string, string> = {
  expired: "That recovery link is expired or has already been used. Request a new email.",
  browser: "This browser does not have the verification that started recovery. Request a new email here and open it in this same browser and device.",
  unauthorized: "That authenticated account is not authorized for the founder dashboard.",
  configuration: "Password recovery is temporarily unavailable because required configuration is incomplete.",
};

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string | string[] }> }) {
  const config = getSupabasePublicConfig();
  const currentOrigin = requestOrigin(await headers());
  const origin = getAdminAuthOrigin(currentOrigin);
  if (origin !== currentOrigin) redirect(`${origin}/admin/forgot-password`);
  const rawError = (await searchParams).error;
  const error = Array.isArray(rawError) ? rawError[0] : rawError;
  return <main className="admin-shell" id="main-content"><section className="admin-login-panel"><p className="eyebrow">Private founder access</p><h1>Reset your password</h1><p>Enter the authorized founder email. For privacy, the response does not confirm whether an account exists.</p>{error ? <div className="form-error-summary" role="alert">{recoveryErrors[error] || "Recovery could not be completed. Request a new email."}</div> : null}{config ? <ForgotPasswordForm recoveryUrl={`${origin}/auth/recovery`} {...config} /> : <div className="form-error-summary" role="alert">Password recovery is not configured in this environment.</div>}<p className="admin-back-link"><Link href="/admin/login">Back to sign in</Link></p></section></main>;
}
