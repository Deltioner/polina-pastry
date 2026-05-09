"use client";
import { useState, use, useMemo, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, notFound } from "next/navigation";
import {
  Minus,
  Plus,
  ShoppingBag,
  ArrowLeft,
  ArrowRight,
  Heart,
  CheckCircle,
  AlertCircle,
  Loader2,
} from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { useStore } from "@/lib/store";
import { fetchProductById } from "@/lib/products";
import type { Product } from "@/types";
import { getTranslation, isRTL } from "@/lib/i18n";
import { formatWeight } from "@/lib/format";
import clsx from "clsx";

export default function ProductDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const router = useRouter();
  const { locale, products, addToCart, cart, updateQuantity, removeFromCart } =
    useStore();
  const t = getTranslation(locale);
  const rtl = isRTL(locale);

  // Try the store first (fast); fall back to a fresh Supabase fetch.
  const cached = products.find((p) => p.id === id) ?? null;
  const [product, setProduct] = useState<Product | null>(cached);
  const [loading, setLoading] = useState(!cached);
  const [notFoundFlag, setNotFoundFlag] = useState(false);

  useEffect(() => {
    if (cached) {
      setProduct(cached);
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    (async () => {
      const fetched = await fetchProductById(id);
      if (cancelled) return;
      if (!fetched) {
        setNotFoundFlag(true);
      } else {
        setProduct(fetched);
      }
      setLoading(false);
    })();
    return () => {
      cancelled = true;
    };
  }, [id, cached]);

  const related = useMemo(() => {
    if (!product) return [];
    return products
      .filter(
        (p) => p.id !== product.id && p.category === product.category && p.available,
      )
      .slice(0, 3);
  }, [product, products]);

  const gallery = useMemo(() => {
    if (!product) return [];
    return [product.image, ...(product.images ?? [])];
  }, [product]);

  const [activeImg, setActiveImg] = useState(0);
  const [intentQty, setIntentQty] = useState(1);
  const [added, setAdded] = useState(false);

  const cartItem = cart.find((i) => i.product.id === id);
  const cartQuantity = cartItem?.quantity ?? 0;
  const inCart = cartQuantity > 0;
  const qty = inCart ? cartQuantity : intentQty;

  const handleDec = () => {
    if (inCart) {
      if (cartQuantity <= 1) removeFromCart(id);
      else updateQuantity(id, cartQuantity - 1);
    } else {
      setIntentQty((q) => Math.max(1, q - 1));
    }
  };

  const handleInc = () => {
    if (inCart) updateQuantity(id, cartQuantity + 1);
    else setIntentQty((q) => q + 1);
  };

  if (notFoundFlag) {
    notFound();
  }

  if (loading || !product) {
    return (
      <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-cream-50">
        <Navbar />
        <div className="pt-40 pb-20 flex flex-col items-center gap-3">
          <Loader2 size={28} className="text-burgundy-500 animate-spin" />
          <p className="script text-2xl text-caramel-500">finding your sweet...</p>
        </div>
        <Footer />
      </div>
    );
  }

  const handleAdd = () => {
    if (inCart) {
      updateQuantity(id, cartQuantity + 1);
    } else {
      for (let i = 0; i < intentQty; i++) addToCart(product);
    }
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const handleOrderNow = () => {
    if (!inCart) for (let i = 0; i < intentQty; i++) addToCart(product);
    router.push("/cart");
  };

  const ingredientsText = product.ingredients?.[locale]?.trim() || "";

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-cream-50">
      <Navbar />

      {/* Breadcrumb */}
      <div className="pt-28 px-6">
        <div className="max-w-7xl mx-auto">
          <Link
            href={`/shop/${product.category}`}
            className="inline-flex items-center gap-1.5 font-body text-sm text-burgundy-700/65 hover:text-burgundy-500 transition-colors"
          >
            <ArrowLeft size={14} /> {t.shop[product.category]}
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* ── Gallery ────────────────────────────────────────── */}
          <div className="reveal">
            {/* Main image */}
            <div className="group relative aspect-[4/5] rounded-[36px] overflow-hidden bg-blush-100 border-[5px] border-cream-50 shadow-xl shadow-burgundy-500/15">
              {gallery.map((src, i) => (
                <Image
                  key={src + i}
                  src={src}
                  alt={`${product.name[locale]} view ${i + 1}`}
                  fill
                  priority={i === 0}
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className={clsx(
                    "object-cover transition-opacity duration-700 ease-out",
                    i === activeImg ? "opacity-100" : "opacity-0",
                  )}
                />
              ))}
              {/* Featured badge */}
              {product.featured && (
                <div className="absolute top-5 left-5 bg-cream-50/95 backdrop-blur-sm px-4 py-1.5 rounded-full shadow-md shadow-burgundy-500/10 flex items-center gap-1.5 z-10">
                  <Heart size={12} className="text-burgundy-500" fill="currentColor" />
                  <span className="script text-lg text-burgundy-500 leading-none translate-y-px">
                    a favourite
                  </span>
                </div>
              )}

              {/* Prev / Next arrows — appear on hover */}
              {gallery.length > 1 && (
                <>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImg((i) => (i - 1 + gallery.length) % gallery.length)
                    }
                    aria-label="Previous image"
                    className="absolute left-4 top-1/2 -translate-y-1/2 -translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:translate-x-0 z-10 w-11 h-11 rounded-full bg-cream-50/90 backdrop-blur-sm text-burgundy-500 hover:bg-cream-50 hover:text-burgundy-700 shadow-lg shadow-burgundy-500/20 flex items-center justify-center transition-all duration-300 ease-out"
                  >
                    <ArrowLeft size={18} />
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      setActiveImg((i) => (i + 1) % gallery.length)
                    }
                    aria-label="Next image"
                    className="absolute right-4 top-1/2 -translate-y-1/2 translate-x-3 opacity-0 group-hover:translate-x-0 group-hover:opacity-100 focus-visible:opacity-100 focus-visible:translate-x-0 z-10 w-11 h-11 rounded-full bg-cream-50/90 backdrop-blur-sm text-burgundy-500 hover:bg-cream-50 hover:text-burgundy-700 shadow-lg shadow-burgundy-500/20 flex items-center justify-center transition-all duration-300 ease-out"
                  >
                    <ArrowRight size={18} />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {gallery.length > 1 && (
              <div className="flex gap-3 mt-5 overflow-x-auto pb-2">
                {gallery.map((src, i) => (
                  <button
                    key={src + i}
                    onClick={() => setActiveImg(i)}
                    className={clsx(
                      "relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all",
                      activeImg === i
                        ? "border-burgundy-500 ring-4 ring-blush-200"
                        : "border-blush-100 hover:border-blush-300 opacity-80 hover:opacity-100",
                    )}
                    aria-label={`View image ${i + 1}`}
                  >
                    <Image
                      src={src}
                      alt={`${product.name[locale]} view ${i + 1}`}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ─────────────────────────────────────────────── */}
          <div className="reveal" style={{ animationDelay: "0.1s" }}>
            <p className="script text-2xl text-caramel-500 mb-1">
              {t.shop[product.category]}
            </p>
            <h1 className="font-display text-4xl md:text-5xl text-burgundy-500 font-medium leading-tight mb-4">
              {product.name[locale]}
            </h1>

            <div className="flex items-baseline gap-3 mb-6">
              <span className="font-display text-3xl text-burgundy-800 font-medium">
                €{product.price.toFixed(2)}
              </span>
              {product.weight && (
                <span className="font-body text-sm text-burgundy-700/55">
                  · {formatWeight(product.weight)}
                </span>
              )}
            </div>

            <div className="gold-divider-left mb-6" />

            <p className="font-body text-burgundy-700/85 text-lg leading-relaxed mb-7">
              {product.description[locale]}
            </p>

            {/* Quantity */}
            <div className="mb-6">
              <p className="font-body text-xs uppercase tracking-widest text-burgundy-700/65 mb-2">
                {t.product.quantity}
              </p>
              <div className="inline-flex items-center gap-1 bg-white border border-blush-200 rounded-full p-1">
                <button
                  onClick={handleDec}
                  className="w-9 h-9 rounded-full text-burgundy-500 hover:bg-blush-100 flex items-center justify-center transition-colors"
                  aria-label={inCart && cartQuantity === 1 ? "Remove from cart" : "Decrease quantity"}
                >
                  <Minus size={14} />
                </button>
                <span className="font-display text-xl text-burgundy-800 w-10 text-center font-medium">
                  {qty}
                </span>
                <button
                  onClick={handleInc}
                  className="w-9 h-9 rounded-full text-burgundy-500 hover:bg-blush-100 flex items-center justify-center transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>

            {/* CTA buttons */}
            <div className="flex flex-col sm:flex-row gap-3 mb-8">
              <button
                onClick={handleAdd}
                disabled={!product.available}
                className={clsx(
                  "btn-blush flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5",
                  !product.available && "opacity-40 cursor-not-allowed",
                )}
              >
                {added ? (
                  <>
                    <CheckCircle size={15} /> Added
                  </>
                ) : (
                  <>
                    <ShoppingBag size={15} /> {t.product.add_to_cart}
                  </>
                )}
              </button>
              <button
                onClick={handleOrderNow}
                disabled={!product.available}
                className={clsx(
                  "btn-primary flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5",
                  !product.available && "opacity-40 cursor-not-allowed",
                )}
              >
                {t.product.order_now} <ArrowRight size={14} />
              </button>
            </div>

            {!product.available && (
              <div className="flex items-center gap-2 mb-8 p-4 rounded-2xl bg-red-50 text-red-700 border border-red-100">
                <AlertCircle size={16} />
                <span className="font-body text-sm">{t.shop.out_of_stock}</span>
              </div>
            )}

            {/* Ingredients */}
            <div className="bg-white border border-blush-100 rounded-3xl p-6 mb-4">
              <p className="script text-xl text-caramel-500 mb-1">our recipe</p>
              <h2 className="font-display text-2xl text-burgundy-500 font-medium mb-3">
                {t.product.ingredients}
              </h2>
              <p className="font-body text-burgundy-700/80 leading-relaxed whitespace-pre-line">
                {ingredientsText || t.product.no_ingredients}
              </p>
            </div>

            {/* Allergens */}
            {product.allergens && product.allergens.length > 0 && (
              <div className="bg-blush-50 border border-blush-100 rounded-3xl p-6">
                <h3 className="font-display text-lg text-burgundy-500 font-medium mb-3">
                  {t.product.allergens}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {product.allergens.map((a) => (
                    <span
                      key={a}
                      className="px-3 py-1 bg-white border border-blush-200 rounded-full font-body text-xs text-burgundy-700 tracking-wider uppercase"
                    >
                      {a}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* ── Related ─────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="py-20 bg-blush-50 px-6 border-t border-blush-100">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <p className="script text-2xl text-caramel-500 mb-1">more sweetness</p>
              <h2 className="font-display text-3xl md:text-4xl text-burgundy-500 font-medium">
                {t.product.related}
              </h2>
              <div className="gold-divider mt-5 opacity-70" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
              {related.map((p) => (
                <ProductCard key={p.id} product={p} locale={locale} />
              ))}
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  );
}
