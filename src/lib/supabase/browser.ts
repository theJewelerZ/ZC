"use client";

import { createBrowserClient } from "@supabase/ssr";
import type { Database } from "@/lib/supabase/database.types";

export function createSupabaseBrowserClient(url: string, publishableKey: string) {
  return createBrowserClient<Database>(url, publishableKey);
}
