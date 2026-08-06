import type { Metadata } from "next";

import { AdminPasswordForm } from "@/components/admin/password-form";
import { requireAdmin } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Set founder password", robots: { index: false, follow: false, nocache: true } };

export default async function SetPasswordPage() {
  await requireAdmin();
  return <main className="admin-shell" id="main-content"><section className="admin-login-panel"><p className="eyebrow">Private founder access</p><h1>Set your password</h1><p>Create the password you will use for routine dashboard access.</p><AdminPasswordForm mode="set" /></section></main>;
}