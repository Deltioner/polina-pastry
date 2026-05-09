/**
 * Normalises a product weight string for display.
 *
 * - Strips a trailing "kg" (case-insensitive) so we can re-append a single,
 *   consistent " kg" suffix.
 * - If the numeric portion starts with a dot (e.g. ".200"), prefixes a "0"
 *   so customers always see "0.200 kg", never ".200 kg".
 * - Always re-appends " kg".
 */
export function formatWeight(weight: string): string {
  let s = weight.replace(/\s*kg\s*$/i, "").trim();
  if (s.startsWith(".") || s.startsWith(",")) s = "0" + s;
  return `${s} kg`;
}
