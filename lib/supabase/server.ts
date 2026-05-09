import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";
import { isSupabaseConfigured } from "./config";

/**
 * Server-side Supabase client. Use from Server Components, Server Actions
 * and Route Handlers. Reads/writes the auth cookie via next/headers cookies().
 *
 * Returns `null` when env vars aren't set yet — callers must handle that.
 */
export async function createSupabaseServerClient() {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          // Server Components can't set cookies. The middleware refreshes the
          // session on every request, so this catch is a no-op there.
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            /* no-op */
          }
        },
      },
    },
  );
}

/**
 * Service-role server client. Bypasses RLS. ONLY use server-side, NEVER expose
 * to the browser. Returns null when env not configured.
 */
export function createSupabaseServiceClient() {
  if (
    !isSupabaseConfigured() ||
    !process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_SERVICE_ROLE_KEY.startsWith("PASTE_")
  ) {
    return null;
  }

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: { getAll: () => [], setAll: () => {} },
    },
  );
}
