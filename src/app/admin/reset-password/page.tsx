import type { Metadata } from "next";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

import { AdminPasswordForm } from "@/components/admin/password-form";
import { getAdminUser } from "@/lib/admin/auth";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Reset founder password", robots: { index: false, follow: false, nocache: true } };

export default async function ResetPasswordPage() {
  const user = await getAdminUser();
  const recoveryActive = (await cookies()).get("zarka-admin-recovery")?.value === "active";
  if (!user || !recoveryActive) redirect("/admin/forgot-password?error=expired");
  return <main className="admin-shell" id="main-content"><section className="admin-login-panel"><p className="eyebrow">Private founder access</p><h1>Choose a new password</h1><p>Your recovery session is verified. Create a new password to restore routine dashboard access.</p><AdminPasswordForm mode="reset" /></section></main>;
}