"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag, Sparkle } from "lucide-react";
import { useStore } from "@/lib/store";
import { getTranslation, isRTL } from "@/lib/i18n";
import { formatWeight } from "@/lib/format";
import type { Product, Locale } from "@/types";
import clsx from "clsx";

interface ProductCardProps {
  product: Product;
  locale: Locale;
}

export default function ProductCard({ product, locale }: ProductCardProps) {
  const { addToCart } = useStore();
  const t = getTranslation(locale);
  const rtl = isRTL(locale);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.available) addToCart(product);
  };

  return (
    <Link
      href={`/shop/product/${product.id}`}
      dir={rtl ? "rtl" : "ltr"}
      className="product-card group relative bg-white rounded-3xl overflow-hidden border border-blush-100 flex flex-col"
    >
      {/* Image */}
      <div className="relative h-64 overflow-hidden bg-blush-50">
        <Image
          src={product.image}
          alt={product.name[locale]}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* Soft cream wash on hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-burgundy-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

        {/* Featured badge — script accent */}
        {product.featured && (
          <div
            className={clsx(
              "absolute top-4 flex items-center gap-1.5 bg-cream-50/95 backdrop-blur-sm pl-2.5 pr-3.5 py-1 rounded-full shadow-md shadow-burgundy-500/10",
              rtl ? "left-4" : "right-4"
            )}
          >
            <Sparkle size={11} className="text-gold-500" fill="currentColor" />
            <span className="script text-base text-burgundy-500 leading-none translate-y-px">
              {t.shop.featured.toLowerCase()}
            </span>
          </div>
        )}

        {/* Out-of-stock overlay */}
        {!product.available && (
          <div className="absolute inset-0 bg-cream-50/85 flex items-center justify-center">
            <span className="font-body text-xs uppercase tracking-widest text-burgundy-500 px-4 py-2 rounded-full bg-blush-100 border border-blush-200">
              {t.shop.out_of_stock}
            </span>
          </div>
        )}

        {/* Category pill */}
        <div className={clsx("absolute bottom-4", rtl ? "right-4" : "left-4")}>
          <span className="bg-burgundy-500/85 backdrop-blur-sm text-cream-50 font-body text-[10px] tracking-widest uppercase px-3 py-1 rounded-full">
            {t.shop[product.category] || product.category}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-display text-xl text-burgundy-800 leading-snug mb-2 line-clamp-2 group-hover:text-burgundy-500 transition-colors">
          {product.name[locale]}
        </h3>
        <p className="font-body text-sm text-burgundy-700/65 leading-relaxed line-clamp-2 mb-4 flex-1">
          {product.description[locale]}
        </p>
        {product.weight && (
          <p className="font-body text-xs text-caramel-500 mb-4 tracking-wide">
            {formatWeight(product.weight)}
          </p>
        )}

        {/* Footer row */}
        <div className="flex items-center justify-between mt-auto pt-4 border-t border-blush-100">
          <span className="font-display text-2xl text-burgundy-500 font-medium">
            €{product.price.toFixed(2)}
          </span>
          <button
            onClick={handleAdd}
            disabled={!product.available}
            aria-label={t.shop.add_to_cart}
            className={clsx(
              "btn-primary inline-flex items-center gap-2 px-4 py-2.5",
              !product.available && "opacity-40 cursor-not-allowed"
            )}
          >
            <ShoppingBag size={13} />
            <span className="hidden sm:inline">{t.shop.add_to_cart}</span>
          </button>
        </div>
      </div>
    </Link>
  );
}
