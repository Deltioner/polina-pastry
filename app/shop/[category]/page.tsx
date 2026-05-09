"use client";
import { useMemo, Suspense, use } from "react";
import { useSearchParams } from "next/navigation";
import { notFound } from "next/navigation";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { CategorySidebar, CategoryHero, Pagination } from "@/components/shop/ShopShared";
import { useStore } from "@/lib/store";
import { getTranslation, isRTL } from "@/lib/i18n";
import type { ProductCategory } from "@/types";

const PRODUCTS_PER_PAGE = 6;
const VALID_CATEGORIES: ProductCategory[] = ["cakes", "pastries", "cookies", "bread", "seasonal", "custom"];

function ShopContent({ category }: { category: ProductCategory }) {
  const { locale, products } = useStore();
  const t = getTranslation(locale);
  const rtl = isRTL(locale);
  const searchParams = useSearchParams();
  const currentPage = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));

  const availableProducts = products.filter((p) => p.available);

  const counts = useMemo(() => {
    const byCat = availableProducts.reduce<Record<string, number>>((acc, p) => {
      acc[p.category] = (acc[p.category] ?? 0) + 1;
      return acc;
    }, {});
    return { all: availableProducts.length, ...byCat };
  }, [availableProducts]);

  const filtered = availableProducts.filter((p) => p.category === category);
  const totalPages = Math.ceil(filtered.length / PRODUCTS_PER_PAGE) || 1;
  const paginated = filtered.slice(
    (currentPage - 1) * PRODUCTS_PER_PAGE,
    currentPage * PRODUCTS_PER_PAGE
  );

  const title = t.shop[category];

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-cream-50">
      <Navbar />
      <CategoryHero category={category} title={title} locale={locale} />

      {/* Breadcrumb */}
      <div className="bg-white/60 border-y border-blush-100 py-3 px-6">
        <div className="max-w-7xl mx-auto">
          <p className="font-body text-xs text-burgundy-700/50 tracking-wide">
            Shop &nbsp;/&nbsp; <span className="text-burgundy-500">{title}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex flex-col lg:flex-row gap-10">
          <CategorySidebar active={category} t={t} counts={counts} locale={locale} />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-8">
              <p className="font-body text-sm text-burgundy-700/55 tracking-wide">
                Showing <span className="text-burgundy-500 font-medium">{paginated.length}</span>{" "}
                of <span className="text-burgundy-500 font-medium">{filtered.length}</span> products
                {totalPages > 1 && (
                  <span className="ml-2 text-burgundy-700/40">· Page {currentPage} of {totalPages}</span>
                )}
              </p>
            </div>
            {filtered.length === 0 ? (
              <div className="text-center py-32 bg-blush-50 rounded-[32px] border border-blush-100">
                <p className="script text-3xl text-burgundy-500 mb-2">coming soon...</p>
                <p className="font-body text-burgundy-700/60">
                  No {title.toLowerCase()} available right now. Check back soon!
                </p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-7">
                  {paginated.map((product, i) => (
                    <div key={product.id} className="reveal" style={{ animationDelay: `${i * 0.07}s` }}>
                      <ProductCard product={product} locale={locale} />
                    </div>
                  ))}
                </div>
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  basePath={`/shop/${category}`}
                />
              </>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = use(params);

  if (!VALID_CATEGORIES.includes(category as ProductCategory)) {
    notFound();
  }

  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream-50 flex items-center justify-center">
          <p className="script text-3xl text-burgundy-500">loading our sweets...</p>
        </div>
      }
    >
      <ShopContent category={category as ProductCategory} />
    </Suspense>
  );
}
