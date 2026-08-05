import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { AdminLoginForm } from "@/components/admin/login-form";
import { getAdminUser } from "@/lib/admin/auth";
import { getSupabasePublicConfig } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Founder sign in", robots: { index: false, follow: false, nocache: true } };

export default async function AdminLoginPage() {
  if (await getAdminUser()) redirect("/admin");
  const config = getSupabasePublicConfig();
  return <main className="admin-shell" id="main-content"><section className="admin-login-panel"><p className="eyebrow">Private founder access</p><h1>Consultation dashboard</h1><p>Sign in with the pre-authorized founder email. There is no public registration or customer account.</p>{config ? <AdminLoginForm {...config} /> : <div className="form-error-summary" role="alert">Founder authentication is not configured in this environment.</div>}</section></main>;
}
