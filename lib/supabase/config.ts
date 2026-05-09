/**
 * Returns true only when both Supabase env vars are present AND look real
 * (not the placeholder text in .env.example / .env.local).
 *
 * Used everywhere we touch Supabase so a fresh checkout with a half-filled
 * `.env.local` doesn't crash the dev server — it just renders empty data.
 */
export function isSupabaseConfigured(): boolean {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) return false;
  if (url.startsWith("PASTE_") || key.startsWith("PASTE_")) return false;
  if (!/^https?:\/\//i.test(url)) return false;

  return true;
}
