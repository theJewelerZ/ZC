import "server-only";

import { createClient } from "@supabase/supabase-js";

import type { Database } from "@/lib/supabase/database.types";
import { getSupabaseServerConfig } from "@/lib/supabase/config";

export function createSupabaseAdminClient() {
  const config = getSupabaseServerConfig();
  if (!config) throw new Error("Consultation backend is not configured.");
  return createClient<Database>(config.url, config.serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
