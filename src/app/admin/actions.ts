"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { requireAdmin } from "@/lib/admin/auth";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import type { ConsultationStatus } from "@/lib/supabase/database.types";

const statuses = new Set<ConsultationStatus>(["new", "reviewing", "contacted", "site_visit", "proposal", "won", "lost", "archived"]);

export async function updateConsultationAction(formData: FormData) {
  await requireAdmin();
  const id = String(formData.get("id") || "");
  const status = String(formData.get("status") || "") as ConsultationStatus;
  const internalNotes = String(formData.get("internalNotes") || "").trim();
  if (!/^[0-9a-f-]{36}$/i.test(id) || !statuses.has(status) || internalNotes.length > 5000) {
    throw new Error("The consultation update could not be validated.");
  }
  const { error } = await createSupabaseAdminClient().from("consultations").update({
    status,
    internal_notes: internalNotes || null,
  }).eq("id", id).eq("submission_state", "complete");
  if (error) throw new Error("The consultation could not be updated.");
  revalidatePath("/admin");
  revalidatePath(`/admin/consultations/${id}`);
}

export async function signOutAction() {
  const client = await createSupabaseServerClient();
  await client?.auth.signOut();
  redirect("/admin/login");
}

import { createSupabaseServerClient } from "@/lib/supabase/server";
