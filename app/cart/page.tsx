"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Minus,
  Plus,
  Trash2,
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  Loader2,
  AlertCircle,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/lib/store";
import { getTranslation, isRTL } from "@/lib/i18n";
import { createCheckoutSession } from "./actions";

function CartContent() {
  const { locale, cart, removeFromCart, updateQuantity, getCartTotal } = useStore();
  const t = getTranslation(locale);
  const rtl = isRTL(locale);
  const searchParams = useSearchParams();
  const [showCheckout, setShowCheckout] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // If Stripe redirected us back with `?canceled=1`, surface a soft message.
  useEffect(() => {
    if (searchParams.get("canceled") === "1") {
      setError("Payment was cancelled. You can try again whenever you're ready.");
    }
  }, [searchParams]);

  const handleSubmit = async (formData: FormData) => {
    setError(null);
    setSubmitting(true);

    formData.set(
      "cart",
      JSON.stringify(
        cart.map((i) => ({ productId: i.product.id, quantity: i.quantity })),
      ),
    );

    const result = await createCheckoutSession(formData);

    if (result.ok && result.url) {
      // Redirect to Stripe-hosted checkout. The cart isn't cleared yet —
      // we clear it on the success page.
      window.location.href = result.url;
      return;
    }

    setSubmitting(false);
    setError(result.error ?? "Could not start checkout. Try again.");
  };

  const inputCls =
    "w-full border border-blush-200 rounded-2xl px-4 py-3 font-body text-burgundy-800 bg-white text-base placeholder:text-burgundy-700/35";

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-cream-50">
      <Navbar />

      {/* Header */}
      <div className="relative pt-36 pb-12 px-6 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-20 left-1/3 w-[420px] h-[420px] rounded-full bg-blush-200/55 blur-[110px] pointer-events-none"
        />
        <div className="relative">
          <p className="script text-2xl text-caramel-500 mb-1">your sweet selection</p>
          <h1 className="font-display text-5xl text-burgundy-500 font-medium">{t.cart.title}</h1>
          <div className="gold-divider mt-5 opacity-70" />
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 pb-20">
        {cart.length === 0 ? (
          <div className="text-center py-24 flex flex-col items-center gap-6 bg-white rounded-[36px] border border-blush-100">
            <div className="w-20 h-20 rounded-full bg-blush-100 flex items-center justify-center">
              <ShoppingBag size={32} className="text-burgundy-500" />
            </div>
            <p className="script text-3xl text-caramel-500 mb-1">oh no, it&apos;s empty</p>
            <p className="font-body text-lg text-burgundy-700/60">{t.cart.empty}</p>
            <Link href="/shop" className="btn-primary inline-flex items-center gap-2 px-6 py-3">
              <ArrowLeft size={14} /> {t.nav.shop}
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            {/* Items list */}
            <div className="lg:col-span-2 space-y-4">
              {cart.map((item) => (
                <div
                  key={item.product.id}
                  className="flex gap-4 bg-white border border-blush-100 rounded-2xl p-4 hover:border-blush-300 transition-colors"
                >
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-blush-50">
                    <Image
                      src={item.product.image}
                      alt={item.product.name[locale]}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-display text-lg text-burgundy-800 leading-snug">
                      {item.product.name[locale]}
                    </h3>
                    <p className="font-display text-burgundy-500 mt-1 text-base">
                      €{item.product.price.toFixed(2)}
                    </p>
                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 rounded-full bg-blush-100 text-burgundy-500 flex items-center justify-center hover:bg-blush-200 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus size={12} />
                      </button>
                      <span className="font-body text-sm w-6 text-center font-medium text-burgundy-800">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 rounded-full bg-blush-100 text-burgundy-500 flex items-center justify-center hover:bg-blush-200 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus size={12} />
                      </button>
                    </div>
                  </div>
                  <div className="flex flex-col items-end justify-between shrink-0">
                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-burgundy-700/30 hover:text-red-400 transition-colors p-1"
                      aria-label={t.cart.remove}
                    >
                      <Trash2 size={16} />
                    </button>
                    <span className="font-display text-xl text-burgundy-800 font-medium">
                      €{(item.product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Summary / Checkout */}
            <div className="lg:col-span-1">
              <div className="bg-white border border-blush-100 rounded-[28px] p-7 sticky top-28 relative overflow-hidden">
                <div
                  aria-hidden
                  className="absolute -bottom-20 -right-12 w-52 h-52 rounded-full bg-blush-100/80 blur-[60px]"
                />
                <div className="relative">
                  <p className="script text-xl text-caramel-500">order summary</p>
                  <h2 className="font-display text-2xl text-burgundy-500 font-medium mb-6">
                    Sweet total
                  </h2>
                  <div className="space-y-2 mb-5">
                    {cart.map((item) => (
                      <div
                        key={item.product.id}
                        className="flex justify-between text-sm font-body text-burgundy-700/80"
                      >
                        <span className="truncate me-2">
                          {item.product.name[locale]} × {item.quantity}
                        </span>
                        <span className="shrink-0 font-medium">
                          €{(item.product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    ))}
                  </div>
                  <div className="border-t border-blush-100 pt-4 flex justify-between items-baseline mb-6">
                    <span className="font-body text-sm text-burgundy-700/60 uppercase tracking-wider">
                      {t.cart.total}
                    </span>
                    <span className="font-display text-3xl text-burgundy-500 font-medium">
                      €{getCartTotal().toFixed(2)}
                    </span>
                  </div>

                  {!showCheckout ? (
                    <>
                      {error && (
                        <div className="flex items-start gap-2 p-3 mb-4 rounded-2xl bg-red-50 text-red-700 border border-red-100">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span className="font-body text-sm">{error}</span>
                        </div>
                      )}
                      <button
                        onClick={() => setShowCheckout(true)}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                      >
                        {t.cart.checkout} <ArrowRight size={14} />
                      </button>
                      <Link
                        href="/shop"
                        className="flex items-center justify-center gap-1 mt-4 text-burgundy-700/60 hover:text-burgundy-500 text-sm font-body transition-colors"
                      >
                        <ArrowLeft size={12} /> Continue shopping
                      </Link>
                    </>
                  ) : (
                    <form action={handleSubmit} className="space-y-3">
                      <input
                        name="name"
                        required
                        placeholder="Full name *"
                        className={inputCls}
                      />
                      <input
                        name="email"
                        type="email"
                        required
                        placeholder="Email *"
                        className={inputCls}
                      />
                      <input
                        name="phone"
                        type="tel"
                        required
                        placeholder="Phone *"
                        className={inputCls}
                      />
                      <div>
                        <label
                          htmlFor="cart-order-date"
                          className="block font-body text-xs uppercase tracking-widest text-burgundy-700/65 mb-1.5"
                        >
                          When do you need it?
                        </label>
                        <input
                          id="cart-order-date"
                          name="date"
                          type="date"
                          min={(() => {
                            const t = new Date();
                            t.setDate(t.getDate() + 1);
                            return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, "0")}-${String(t.getDate()).padStart(2, "0")}`;
                          })()}
                          className={inputCls}
                        />
                        <p className="font-body text-[11px] text-burgundy-700/55 mt-1.5 leading-snug">
                          Minimum 24 h notice · 48–72 h for custom cakes.
                        </p>
                      </div>
                      <input
                        name="address"
                        placeholder="Delivery address (optional)"
                        className={inputCls}
                      />
                      <textarea
                        name="notes"
                        rows={3}
                        placeholder="Special requests..."
                        className={`${inputCls} resize-none`}
                      />

                      {error && (
                        <div className="flex items-start gap-2 p-3 rounded-2xl bg-red-50 text-red-700 border border-red-100">
                          <AlertCircle size={14} className="shrink-0 mt-0.5" />
                          <span className="font-body text-sm">{error}</span>
                        </div>
                      )}

                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-primary w-full flex items-center justify-center gap-2 py-3.5"
                      >
                        {submitting ? (
                          <>
                            <Loader2 size={14} className="animate-spin" /> Redirecting to payment...
                          </>
                        ) : (
                          <>
                            Pay & order <ArrowRight size={14} />
                          </>
                        )}
                      </button>
                      <p className="text-center font-body text-xs text-burgundy-700/45">
                        Secure payment via Stripe · iDEAL & cards accepted
                      </p>

                      <button
                        type="button"
                        onClick={() => setShowCheckout(false)}
                        className="w-full flex items-center justify-center gap-1 text-burgundy-700/60 hover:text-burgundy-500 text-sm font-body transition-colors"
                      >
                        Back
                      </button>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default function CartPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <p className="script text-3xl text-burgundy-500">loading your cart...</p>
        </div>
      }
    >
      <CartContent />
    </Suspense>
  );
}
