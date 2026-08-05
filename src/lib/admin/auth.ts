import "server-only";

import { redirect } from "next/navigation";

import { logAdminAuthStage } from "@/lib/admin/auth-diagnostics";
import { createSupabaseReadOnlyServerClient } from "@/lib/supabase/server";

export function getAdminAllowlist() {
  return new Set((process.env.ADMIN_ALLOWED_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
}

export function isAllowedAdminEmail(email: string | null | undefined, configured = getAdminAllowlist()) {
  return Boolean(email && configured.has(email.trim().toLowerCase()));
}

export async function getAdminUser() {
  const client = await createSupabaseReadOnlyServerClient();
  if (!client) {
    logAdminAuthStage("admin_guard_no_session", { reason: "configuration" });
    return null;
  }

  const { data, error } = await client.auth.getUser();
  if (error || !data.user) {
    logAdminAuthStage("admin_guard_no_session", { reason: "session" });
    return null;
  }

  if (!isAllowedAdminEmail(data.user.email)) {
    logAdminAuthStage("allowlist_rejected", { reason: "unauthorized" });
    return null;
  }

  logAdminAuthStage("admin_guard_authenticated");
  return data.user;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
