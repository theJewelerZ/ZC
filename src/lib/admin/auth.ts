import "server-only";

import { redirect } from "next/navigation";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export function getAdminAllowlist() {
  return new Set((process.env.ADMIN_ALLOWED_EMAILS || "").split(",").map((email) => email.trim().toLowerCase()).filter(Boolean));
}

export function isAllowedAdminEmail(email: string | null | undefined, configured = getAdminAllowlist()) {
  return Boolean(email && configured.has(email.trim().toLowerCase()));
}

export async function getAdminUser() {
  const client = await createSupabaseServerClient();
  if (!client) return null;
  const { data, error } = await client.auth.getUser();
  if (error || !data.user || !isAllowedAdminEmail(data.user.email)) return null;
  return data.user;
}

export async function requireAdmin() {
  const user = await getAdminUser();
  if (!user) redirect("/admin/login");
  return user;
}
