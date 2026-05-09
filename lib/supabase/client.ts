"use client";
import { createBrowserClient } from "@supabase/ssr";
import { isSupabaseConfigured } from "./config";

/**
 * Browser-side Supabase client. Use from client components.
 *
 * Returns `null` when env vars aren't set, so callers can decide what to do
 * (typically: short-circuit to an empty result instead of crashing).
 */
export function createSupabaseBrowserClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
