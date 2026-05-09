"use client";
import Link from "next/link";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Locale, Translation, ProductCategory } from "@/types";
import clsx from "clsx";

// ── Category hero images ──────────────────────────────────────────────────────
export const CATEGORY_META: Record<
  ProductCategory | "all",
  { image: string; tagline: Record<"en" | "uk" | "nl" | "ar", string> }
> = {
  all: {
    image: "https://images.unsplash.com/photo-1587314168485-3236d6710814?w=1400&q=80",
    tagline: { en: "Everything we bake, crafted with love", uk: "Все що ми печемо, зроблено з любов'ю", nl: "Alles wat we bakken, met liefde gemaakt", ar: "كل ما نخبزه، مصنوع بحب" },
  },
  cakes: {
    image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=1400&q=80",
    tagline: { en: "Showstopping cakes for every occasion", uk: "Вражаючі торти для кожної події", nl: "Indrukwekkende taarten voor elke gelegenheid", ar: "كعكات رائعة لكل مناسبة" },
  },
  pastries: {
    image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=1400&q=80",
    tagline: { en: "Delicate pastries, baked to perfection", uk: "Ніжна випічка, доведена до досконалості", nl: "Delicaat gebak, perfect gebakken", ar: "معجنات رقيقة، مخبوزة على أكمل وجه" },
  },
  cookies: {
    image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=1400&q=80",
    tagline: { en: "Hand-rolled cookies with a golden touch", uk: "Ручне печиво із золотим відтінком", nl: "Met de hand gerold koekjes met een gouden touch", ar: "بسكويت محضّر يدوياً بلمسة ذهبية" },
  },
  bread: {
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=1400&q=80",
    tagline: { en: "Slow-fermented artisan loaves", uk: "Хліб на повільній заквасці", nl: "Langzaam gefermenteerde ambachtelijke broden", ar: "أرغفة حرفية متخمرة ببطء" },
  },
  seasonal: {
    image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=1400&q=80",
    tagline: { en: "Limited editions inspired by the seasons", uk: "Обмежені видання, натхненні сезонами", nl: "Gelimiteerde edities geïnspireerd op de seizoenen", ar: "إصدارات محدودة مستوحاة من المواسم" },
  },
  custom: {
    image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=1400&q=80",
    tagline: { en: "Bespoke creations made just for you", uk: "Вироби на замовлення, зроблені саме для вас", nl: "Maatwerk creaties speciaal voor jou", ar: "إبداعات مخصصة صُنعت لك خصيصاً" },
  },
};

// ── Category Sidebar ─────────────────────────────────────────────────────────
interface SidebarProps {
  active: string;
  t: Translation;
  counts: Record<string, number>;
  locale: Locale;
}

const CATEGORIES = ["all", "cakes", "pastries", "cookies", "bread", "seasonal", "custom"] as const;

export function CategorySidebar({ active, t, counts }: SidebarProps) {
  return (
    <aside className="w-full lg:w-60 shrink-0">
      <div className="lg:sticky lg:top-28">
        <p className="script text-xl text-burgundy-500 mb-3 px-1">categories</p>
        <nav className="flex flex-row lg:flex-col gap-1.5 flex-wrap">
          {CATEGORIES.map((cat) => {
            const label = t.shop[cat === "all" ? "all" : cat];
            const count = counts[cat] ?? 0;
            const isActive = active === cat;
            return (
              <Link
                key={cat}
                href={cat === "all" ? "/shop" : `/shop/${cat}`}
                className={clsx(
                  "flex items-center justify-between px-4 py-2.5 rounded-full font-body text-sm transition-all group",
                  isActive
                    ? "bg-burgundy-500 text-cream-50 shadow-md shadow-burgundy-500/20"
                    : "bg-white border border-blush-100 text-burgundy-700 hover:bg-blush-100 hover:border-blush-200"
                )}
              >
                <span>{label}</span>
                <span
                  className={clsx(
                    "text-xs font-medium ml-2 px-2 py-0.5 rounded-full",
                    isActive
                      ? "bg-cream-50/15 text-cream-50"
                      : "bg-blush-100 text-burgundy-500 group-hover:bg-white"
                  )}
                >
                  {count}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}

// ── Pagination ────────────────────────────────────────────────────────────────
interface PaginationProps {
  currentPage: number;
  totalPages: number;
  basePath: string;
}

export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  const pageHref = (page: number) =>
    page === 1 ? basePath : `${basePath}?page=${page}`;

  const baseBtn =
    "w-10 h-10 flex items-center justify-center rounded-full transition-all font-body text-sm";

  return (
    <div className="flex items-center justify-center gap-2 mt-16">
      <Link
        href={pageHref(currentPage - 1)}
        aria-label="Previous page"
        className={clsx(
          baseBtn,
          "border",
          currentPage <= 1
            ? "border-blush-100 text-burgundy-300 pointer-events-none"
            : "border-blush-200 text-burgundy-700 hover:bg-blush-100 hover:border-blush-300"
        )}
      >
        <ChevronLeft size={16} />
      </Link>

      {pages.map((page) => (
        <Link
          key={page}
          href={pageHref(page)}
          className={clsx(
            baseBtn,
            page === currentPage
              ? "bg-burgundy-500 text-cream-50 shadow-md shadow-burgundy-500/25"
              : "border border-blush-200 text-burgundy-700 hover:bg-blush-100"
          )}
        >
          {page}
        </Link>
      ))}

      <Link
        href={pageHref(currentPage + 1)}
        aria-label="Next page"
        className={clsx(
          baseBtn,
          "border",
          currentPage >= totalPages
            ? "border-blush-100 text-burgundy-300 pointer-events-none"
            : "border-blush-200 text-burgundy-700 hover:bg-blush-100 hover:border-blush-300"
        )}
      >
        <ChevronRight size={16} />
      </Link>
    </div>
  );
}

// ── Category Hero ─────────────────────────────────────────────────────────────
interface HeroProps {
  category: ProductCategory | "all";
  title: string;
  locale: Locale;
}

export function CategoryHero({ category, title, locale }: HeroProps) {
  const meta = CATEGORY_META[category];
  return (
    <div className="relative pt-36 pb-20 px-6 text-center overflow-hidden bg-cream-50">
      {/* Decorative blobs */}
      <div
        aria-hidden
        className="absolute top-10 -left-32 w-[420px] h-[420px] rounded-full bg-blush-200/55 blur-[110px] pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 -right-20 w-[360px] h-[360px] rounded-full bg-gold-200/35 blur-[110px] pointer-events-none"
      />

      {/* Image badge */}
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="inline-block mb-7 relative">
          <div className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-cream-50 shadow-xl shadow-burgundy-500/15">
            <Image src={meta.image} alt={title} fill className="object-cover" />
          </div>
          <span className="absolute -bottom-2 -right-2 w-7 h-7 bg-gold-500 rounded-full flex items-center justify-center text-cream-50 text-sm shadow-md">
            ✦
          </span>
        </div>
        <p className="script text-2xl text-caramel-500 mb-2">{meta.tagline[locale]}</p>
        <h1 className="font-display text-5xl md:text-6xl text-burgundy-500 font-medium">{title}</h1>
        <div className="gold-divider mt-6 opacity-70" />
      </div>
    </div>
  );
}
