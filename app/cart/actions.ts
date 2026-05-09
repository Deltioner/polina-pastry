"use server";
import { headers } from "next/headers";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapProductRow, type ProductRow } from "@/lib/supabase/mappers";
import { getStripe } from "@/lib/stripe";

interface CheckoutResult {
  ok: boolean;
  url?: string;
  error?: string;
}

interface CartItemPayload {
  productId: string;
  quantity: number;
}

/**
 * Creates a Stripe Checkout Session and returns the redirect URL.
 *
 * The order itself is NOT inserted yet — it's created on the success page
 * (and as a webhook fallback) once Stripe confirms payment, so the DB
 * never carries unpaid orphans.
 */
export async function createCheckoutSession(
  formData: FormData,
): Promise<CheckoutResult> {
  const customer_name = String(formData.get("name") ?? "").trim();
  const customer_email = String(formData.get("email") ?? "").trim();
  const customer_phone = String(formData.get("phone") ?? "").trim();
  const delivery_address = String(formData.get("address") ?? "").trim();
  const pickup_date = String(formData.get("date") ?? "").trim();
  const notes = String(formData.get("notes") ?? "").trim();
  const cartJson = String(formData.get("cart") ?? "[]");

  if (!customer_name || !customer_email || !customer_phone) {
    return { ok: false, error: "Please fill in your name, email and phone." };
  }

  let cartPayload: CartItemPayload[];
  try {
    const parsed = JSON.parse(cartJson);
    if (!Array.isArray(parsed)) throw new Error();
    cartPayload = parsed
      .map((item) => ({
        productId: String(item.productId ?? item.product?.id ?? ""),
        quantity: Number(item.quantity ?? 0),
      }))
      .filter((i) => i.productId && i.quantity > 0);
  } catch {
    return { ok: false, error: "Cart could not be read. Try refreshing." };
  }

  if (cartPayload.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return {
      ok: false,
      error:
        "The order system isn't configured yet. Please contact us by phone or email.",
    };
  }

  // Re-fetch real prices from Supabase — the client-side cart can't be trusted.
  const ids = cartPayload.map((i) => i.productId);
  const { data: rows, error: fetchError } = await supabase
    .from("products")
    .select("*")
    .in("id", ids);

  if (fetchError) {
    console.error("[checkout] product fetch failed:", fetchError);
    return { ok: false, error: "Could not validate cart. Try again." };
  }

  const productsById = new Map(
    ((rows as ProductRow[]) ?? []).map((row) => [row.id, mapProductRow(row)]),
  );

  // Build Stripe line items from the validated products.
  const lineItems: Array<{
    quantity: number;
    price_data: {
      currency: "eur";
      unit_amount: number;
      product_data: { name: string; images?: string[] };
    };
  }> = [];

  for (const entry of cartPayload) {
    const product = productsById.get(entry.productId);
    if (!product) {
      return { ok: false, error: "A product in your cart is no longer available." };
    }
    if (!product.available) {
      return {
        ok: false,
        error: `"${product.name.en}" is no longer available.`,
      };
    }
    lineItems.push({
      quantity: entry.quantity,
      price_data: {
        currency: "eur",
        unit_amount: Math.round(product.price * 100), // cents
        product_data: {
          name: product.name.en,
          images: product.image ? [product.image] : undefined,
        },
      },
    });
  }

  const stripe = getStripe();
  if (!stripe) {
    return {
      ok: false,
      error:
        "Online payment isn't configured yet. Please contact us by phone or email.",
    };
  }

  // Build the absolute base URL for redirects (Stripe needs absolute).
  const hdrs = await headers();
  const host = hdrs.get("x-forwarded-host") ?? hdrs.get("host") ?? "localhost:3000";
  const proto =
    hdrs.get("x-forwarded-proto") ??
    (host.startsWith("localhost") ? "http" : "https");
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? `${proto}://${host}`;

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["ideal", "card"],
      line_items: lineItems,
      customer_email: customer_email,
      locale: "auto",
      success_url: `${baseUrl}/cart/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cart?canceled=1`,
      // The cart is encoded into metadata; the success page reads it back to
      // create the order row. Items get a compact representation to fit
      // within Stripe's 500-char-per-key limit.
      metadata: {
        customer_name: customer_name.slice(0, 250),
        customer_phone: customer_phone.slice(0, 250),
        delivery_address: delivery_address.slice(0, 500),
        pickup_date: pickup_date.slice(0, 50),
        notes: notes.slice(0, 500),
        items: JSON.stringify(
          cartPayload.map((c) => ({ id: c.productId, q: c.quantity })),
        ).slice(0, 500),
      },
    });

    if (!session.url) {
      return { ok: false, error: "Stripe did not return a checkout URL." };
    }

    return { ok: true, url: session.url };
  } catch (err) {
    console.error("[checkout] stripe session create failed:", err);
    return {
      ok: false,
      error:
        "Could not start payment. Please try again or contact us if the problem persists.",
    };
  }
}
