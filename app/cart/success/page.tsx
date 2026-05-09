import Link from "next/link";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ClearCartOnMount from "./ClearCartOnMount";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { mapProductRow, type ProductRow } from "@/lib/supabase/mappers";
import { getStripe } from "@/lib/stripe";
import { sendOrderEmails } from "@/lib/email";
import type { CartItem } from "@/types";

interface ItemRef {
  id: string;
  q: number;
}

export default async function CartSuccessPage({
  searchParams,
}: {
  searchParams: Promise<{ session_id?: string }>;
}) {
  const { session_id } = await searchParams;

  if (!session_id) {
    return <FailureView reason="Missing session id." />;
  }

  const stripe = getStripe();
  if (!stripe) {
    return <FailureView reason="Payment system isn't configured." />;
  }

  const supabase = await createSupabaseServerClient();
  if (!supabase) {
    return <FailureView reason="Database isn't configured." />;
  }

  // Try to fetch the Stripe session and confirm payment.
  let session;
  try {
    session = await stripe.checkout.sessions.retrieve(session_id);
  } catch {
    return <FailureView reason="We couldn't find that payment. If you were charged, please contact us." />;
  }

  if (session.payment_status !== "paid") {
    return (
      <FailureView reason="Payment isn't completed yet. If your bank confirms it, please contact us." />
    );
  }

  // Idempotency: if we already saved this order, just show it.
  const { data: existing } = await supabase
    .from("orders")
    .select("id, total, customer_name")
    .eq("stripe_session_id", session_id)
    .maybeSingle();

  let orderId: string;
  let orderTotal: number;
  let customerName: string;

  if (existing) {
    orderId = existing.id;
    orderTotal = Number(existing.total);
    customerName = existing.customer_name;
  } else {
    // First time we see this paid session — insert the order + send emails.
    const meta = session.metadata ?? {};
    const itemsRefs = safeParseItems(meta.items);

    if (itemsRefs.length === 0) {
      return <FailureView reason="Order data is missing. Please contact us with this session id." />;
    }

    const ids = itemsRefs.map((i) => i.id);
    const { data: rows } = await supabase
      .from("products")
      .select("*")
      .in("id", ids);

    const productsById = new Map(
      ((rows as ProductRow[]) ?? []).map((row) => [row.id, mapProductRow(row)]),
    );

    const items: CartItem[] = [];
    let total = 0;
    for (const ref of itemsRefs) {
      const product = productsById.get(ref.id);
      if (!product) continue;
      items.push({ product, quantity: ref.q });
      total += product.price * ref.q;
    }

    const customer_email = session.customer_details?.email ?? session.customer_email ?? "";
    const customer_name = meta.customer_name ?? session.customer_details?.name ?? "Customer";
    const customer_phone = meta.customer_phone ?? session.customer_details?.phone ?? "";
    const delivery_address = meta.delivery_address || null;
    const pickup_date = meta.pickup_date || null;
    const notes = meta.notes || null;

    const { data: inserted, error: insertError } = await supabase
      .from("orders")
      .insert({
        customer_name,
        customer_email,
        customer_phone,
        delivery_address,
        pickup_date,
        items,
        total,
        notes,
        stripe_session_id: session_id,
        payment_status: "paid",
        paid_at: new Date().toISOString(),
        status: "confirmed",
      })
      .select("id, total, customer_name")
      .single();

    if (insertError || !inserted) {
      console.error("[success] insert failed:", insertError);
      return (
        <FailureView reason="Payment received but we couldn't save the order. Please contact us — we have your money safely with Stripe." />
      );
    }

    orderId = inserted.id;
    orderTotal = Number(inserted.total);
    customerName = inserted.customer_name;

    // Fire emails (won't crash the page if Gmail isn't configured).
    await sendOrderEmails({
      orderId,
      customer_name,
      customer_email,
      customer_phone,
      delivery_address,
      pickup_date,
      notes,
      items,
      total,
      paid: true,
    }).catch((e) => console.error("[success] email send failed:", e));
  }

  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <ClearCartOnMount />

      <div className="pt-36 pb-20 px-6">
        <div className="text-center py-16 bg-white rounded-[36px] border border-blush-100 max-w-2xl mx-auto px-6 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-blush-200/55 blur-[100px] pointer-events-none"
          />
          <div className="relative">
            <div className="w-20 h-20 rounded-full bg-blush-100 flex items-center justify-center mx-auto mb-5">
              <CheckCircle size={36} className="text-burgundy-500" />
            </div>
            <p className="script text-3xl text-caramel-500 mb-1">payment received!</p>
            <h1 className="font-display text-3xl text-burgundy-500 font-medium mb-4">
              Thank you, {customerName} 💝
            </h1>
            <p className="font-body text-burgundy-700/70 max-w-md mx-auto mb-2">
              Your order is paid and confirmed. Polina will personally reach out
              within 24 hours to arrange pickup or delivery. A confirmation has
              been sent to your inbox.
            </p>
            <p className="font-body text-sm text-burgundy-700/60 mb-1">
              Total paid: <span className="font-medium text-burgundy-500">€{orderTotal.toFixed(2)}</span>
            </p>
            <p className="font-body text-xs text-burgundy-700/45 mb-6">
              Order reference: <span className="font-medium">{orderId.slice(0, 8)}</span>
            </p>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              Continue browsing <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}

function safeParseItems(raw: string | null | undefined): ItemRef[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed
      .map((i) => ({ id: String(i.id ?? ""), q: Number(i.q ?? 0) }))
      .filter((i) => i.id && i.q > 0);
  } catch {
    return [];
  }
}

function FailureView({ reason }: { reason: string }) {
  return (
    <div className="min-h-screen bg-cream-50">
      <Navbar />
      <div className="pt-36 pb-20 px-6">
        <div className="text-center py-16 bg-white rounded-[36px] border border-blush-100 max-w-2xl mx-auto px-6">
          <div className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
            <AlertCircle size={36} className="text-red-500" />
          </div>
          <p className="script text-2xl text-caramel-500 mb-1">something went wrong</p>
          <h1 className="font-display text-3xl text-burgundy-500 font-medium mb-4">
            We couldn&apos;t confirm your order
          </h1>
          <p className="font-body text-burgundy-700/70 max-w-md mx-auto mb-6">{reason}</p>
          <Link href="/cart" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
            Back to cart
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
}
