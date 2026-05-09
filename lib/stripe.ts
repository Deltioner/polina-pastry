import Stripe from "stripe";

/**
 * Server-side Stripe SDK instance.
 *
 * Uses Stripe's Node SDK with the latest API version. Returns null if
 * STRIPE_SECRET_KEY is missing, so callers can fall back to the manual
 * order flow when Stripe isn't configured.
 */
export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key || key.startsWith("PASTE_")) return null;
  return new Stripe(key);
}

/** True only when STRIPE_SECRET_KEY is a real value. */
export function isStripeConfigured(): boolean {
  const key = process.env.STRIPE_SECRET_KEY;
  return Boolean(key && !key.startsWith("PASTE_"));
}
