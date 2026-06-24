"use client";

import { createBrowserClient } from "@supabase/ssr";
import { getSupabaseConfigStatus } from "@/lib/supabase/config";

export function createSupabaseBrowserClient() {
  const config = getSupabaseConfigStatus();
  const url = config.supabaseUrl;
  const anonKey = config.anonKey;

  if (!config.isConfigured || !url || !anonKey) {
    throw new Error("Configure NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY.");
  }

  return createBrowserClient(url, anonKey);
}
