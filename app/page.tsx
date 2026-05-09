"use client";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Heart, Sparkles, Wheat, Cake, Cookie, Croissant, Flower2, Star } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/shop/ProductCard";
import { useStore } from "@/lib/store";
import { getTranslation, isRTL } from "@/lib/i18n";

export default function Home() {
  const { locale, getFeaturedProducts } = useStore();
  const t = getTranslation(locale);
  const featured = getFeaturedProducts().slice(0, 3);
  const rtl = isRTL(locale);

  return (
    <div dir={rtl ? "rtl" : "ltr"}>
      <Navbar />

      {/* ── HERO — split layout ───────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center pt-32 pb-20 overflow-hidden bg-cream-50">
        {/* Decorative ambient blobs */}
        <div
          aria-hidden
          className="absolute -top-32 -left-40 w-[520px] h-[520px] rounded-full bg-blush-200/55 blur-[110px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 right-1/3 w-[420px] h-[420px] rounded-full bg-gold-200/35 blur-[120px] pointer-events-none"
        />

        <div className="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center w-full">
          {/* LEFT — copy */}
          <div className="reveal text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-blush-100 text-burgundy-500 px-4 py-1.5 rounded-full mb-7 border border-blush-200">
              <Flower2 size={13} />
              <span className="font-body text-xs tracking-widest uppercase">
                Artisan Bakery · Kampen, NL
              </span>
            </div>

            <h1 className="font-display text-burgundy-500 font-medium leading-[0.95] mb-5">
              <span className="block text-6xl md:text-7xl lg:text-8xl">Polina</span>
              <span className="script text-5xl md:text-6xl text-caramel-500 font-normal mt-1 block lg:translate-x-12">
                pastry
              </span>
            </h1>

            <p className="font-display italic text-2xl md:text-3xl text-burgundy-700 mb-3 leading-snug max-w-md mx-auto lg:mx-0">
              created by hand,
              <br />
              <span className="text-burgundy-500">baked with love.</span>
            </p>

            <p className="font-body text-base text-burgundy-700/70 mb-9 max-w-md mx-auto lg:mx-0 leading-relaxed">
              {t.hero.subtitle}
            </p>

            <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
              <Link
                href="/shop"
                className="btn-primary inline-flex items-center justify-center gap-2 px-7 py-3.5"
              >
                {t.hero.cta} <ArrowRight size={15} />
              </Link>
              <Link
                href="/contact"
                className="btn-outline inline-flex items-center justify-center gap-2 px-7 py-3.5"
              >
                {t.hero.secondary_cta}
              </Link>
            </div>

            {/* Stats / proof points */}
            <div className="flex gap-7 mt-10 pt-7 border-t border-blush-200 justify-center lg:justify-start">
              {[
                { num: "100%", label: "Handmade" },
                { num: "Daily", label: "Fresh batches" },
                { num: "100%", label: "Organic" },
              ].map((s) => (
                <div key={s.label}>
                  <p className="font-display text-2xl text-burgundy-500 font-medium">{s.num}</p>
                  <p className="font-body text-xs text-burgundy-700/60 mt-0.5 tracking-wide">
                    {s.label}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT — image collage */}
          <div className="relative reveal" style={{ animationDelay: "0.15s" }}>
            <div className="relative aspect-[4/5] max-w-md mx-auto">
              {/* Main hero photo */}
              <div className="absolute inset-0 rounded-[40%_60%_55%_45%/55%_45%_55%_45%] overflow-hidden border-[6px] border-cream-50 shadow-2xl shadow-burgundy-500/25">
                <Image
                  src="https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=900&q=85"
                  alt="A handmade pastry"
                  fill
                  className="object-cover"
                  priority
                />
              </div>

              {/* Floating small photo bottom-left */}
              <div className="absolute -bottom-6 -left-4 w-32 h-32 rounded-full overflow-hidden border-[5px] border-cream-50 shadow-xl shadow-burgundy-500/20 float">
                <Image
                  src="https://images.unsplash.com/photo-1488477181946-6428a0291777?w=400&q=80"
                  alt="Strawberry pastry"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Floating gold sparkle top-right */}
              <div className="absolute -top-4 -right-2 w-20 h-20 rounded-full bg-gold-500 flex items-center justify-center shadow-lg shadow-gold-500/40 float" style={{ animationDelay: "1.5s" }}>
                <Sparkles size={28} className="text-cream-50" />
              </div>

              {/* Quote chip top-left */}
              <div className="hidden md:block absolute top-10 -left-10 bg-cream-50 border border-blush-200 rounded-2xl px-4 py-3 shadow-lg shadow-burgundy-500/10 max-w-[180px] rotate-[-4deg]">
                <p className="script text-xl text-burgundy-500 leading-tight">
                  every cake tells a story
                </p>
              </div>

              {/* Heart chip bottom-right */}
              <div className="hidden md:flex absolute bottom-10 -right-6 bg-burgundy-500 text-cream-50 rounded-full px-4 py-2 shadow-lg items-center gap-1.5 rotate-[6deg]">
                <Heart size={13} fill="currentColor" />
                <span className="font-body text-xs tracking-wider uppercase">
                  with love
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll cue */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2 opacity-50">
          <span className="font-body text-[10px] tracking-[0.4em] uppercase text-burgundy-500">
            scroll
          </span>
          <div className="w-px h-10 bg-gradient-to-b from-burgundy-500 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── VALUES STRIP — soft blush card ─────────────────────────── */}
      <section className="py-20 bg-cream-50 px-6">
        <div className="max-w-6xl mx-auto bg-blush-100 rounded-[36px] p-10 md:p-14 grid grid-cols-1 md:grid-cols-3 gap-8 relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-20 -right-20 w-72 h-72 rounded-full bg-blush-200/60 blur-[80px]"
          />
          {[
            { Icon: Wheat, title: "Natural ingredients", desc: "Seasonal & locally sourced. No artificial additives, ever." },
            { Icon: Heart, title: "Made with love", desc: "Every item baked fresh each morning, by hand, with care." },
            { Icon: Star, title: "Old-world craft", desc: "Rooted in Ukrainian, Dutch & French pastry traditions." },
          ].map(({ Icon, title, desc }) => (
            <div key={title} className="relative flex flex-col items-center text-center gap-3">
              <div className="w-14 h-14 rounded-full bg-cream-50 border border-blush-200 flex items-center justify-center shadow-sm">
                <Icon size={20} className="text-burgundy-500" />
              </div>
              <h3 className="font-display text-xl text-burgundy-500">{title}</h3>
              <p className="font-body text-sm text-burgundy-700/70 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURED PRODUCTS ────────────────────────────── */}
      <section className="py-24 bg-cream-50 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="script text-2xl text-caramel-500 mb-1">handpicked for you</p>
            <h2 className="font-display text-4xl md:text-5xl text-burgundy-500 font-medium">
              {t.shop.featured}
            </h2>
            <div className="gold-divider mt-5 opacity-70" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featured.map((product, i) => (
              <div key={product.id} className="reveal" style={{ animationDelay: `${i * 0.1}s` }}>
                <ProductCard product={product} locale={locale} />
              </div>
            ))}
          </div>

          <div className="text-center mt-14">
            <Link href="/shop" className="btn-ghost inline-flex items-center gap-2">
              View full collection <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── SHOP BY CATEGORY ─────────────────────────────── */}
      <section className="py-24 bg-blush-50 px-6 border-y border-blush-100">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="script text-2xl text-caramel-500 mb-1">browse our ranges</p>
            <h2 className="font-display text-4xl md:text-5xl text-burgundy-500 font-medium">
              Sweet collections
            </h2>
            <div className="gold-divider mt-5 opacity-70" />
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { cat: "cakes", Icon: Cake, image: "https://images.unsplash.com/photo-1535254973040-607b474cb50d?w=400&q=80" },
              { cat: "pastries", Icon: Croissant, image: "https://images.unsplash.com/photo-1464305795204-6f5bbfc7fb81?w=400&q=80" },
              { cat: "cookies", Icon: Cookie, image: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=400&q=80" },
              { cat: "bread", Icon: Wheat, image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=80" },
              { cat: "seasonal", Icon: Flower2, image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&q=80" },
              { cat: "custom", Icon: Sparkles, image: "https://images.unsplash.com/photo-1563729784474-d77dbb933a9e?w=400&q=80" },
            ].map(({ cat, Icon, image }) => (
              <Link
                key={cat}
                href={`/shop/${cat}`}
                className="group relative aspect-[3/4] rounded-3xl overflow-hidden block bg-cream-50 border border-blush-100 hover:border-blush-300 transition-all hover:shadow-lg hover:shadow-burgundy-500/10 hover:-translate-y-1 duration-500"
              >
                <Image
                  src={image}
                  alt={cat}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-burgundy-800/85 via-burgundy-500/30 to-transparent" />
                <div className="absolute inset-0 flex flex-col items-center justify-end p-4 gap-2">
                  <Icon size={18} className="text-cream-50/90" />
                  <span className="font-display text-base text-cream-50 capitalize text-center leading-tight">
                    {t.shop[cat as keyof typeof t.shop]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── PHILOSOPHY QUOTE ─────────────────────────────── */}
      <section className="relative py-28 overflow-hidden bg-cream-50 px-6">
        <div className="max-w-4xl mx-auto relative">
          <div
            aria-hidden
            className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-96 rounded-full bg-blush-200/40 blur-[100px] pointer-events-none"
          />
          <div className="relative bg-white border border-blush-200 rounded-[40px] p-12 md:p-16 text-center shadow-xl shadow-burgundy-500/8">
            <div className="flex justify-center mb-6">
              <div className="w-12 h-12 rounded-full bg-blush-100 flex items-center justify-center">
                <Heart size={20} className="text-burgundy-500" fill="currentColor" />
              </div>
            </div>
            <p className="script text-3xl text-caramel-500 mb-4">our philosophy</p>
            <p className="font-display italic text-3xl md:text-4xl text-burgundy-500 leading-snug mb-8 font-medium">
              "Every cake tells a story —<br />let us bake yours."
            </p>
            <div className="gold-divider mb-8 opacity-60" />
            <Link href="/contact" className="btn-gold inline-flex items-center gap-2 px-8 py-3.5">
              {t.hero.secondary_cta} <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      </section>

      {/* ── ABOUT TEASER ─────────────────────────────────── */}
      <section className="py-28 bg-cream-50 px-6">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">
          {/* Image with stickers */}
          <div className="relative">
            <div className="relative h-80 md:h-[26rem] rounded-[32px] overflow-hidden border-[5px] border-cream-50 shadow-xl shadow-burgundy-500/15">
              <Image
                src="/IMG_6350.jpeg"
                alt="Polina"
                fill
                quality={92}
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-top"
              />
            </div>
            {/* Polaroid-style tag */}
            <div className="hidden md:block absolute -bottom-6 -right-4 bg-cream-50 px-5 py-3 shadow-xl rounded-2xl rotate-[5deg] border border-blush-200">
              <p className="script text-2xl text-burgundy-500 leading-none">~ Polina ~</p>
              <p className="font-body text-[10px] uppercase tracking-widest text-caramel-500 mt-1">
                Founder & Baker
              </p>
            </div>
          </div>

          <div>
            <p className="script text-2xl text-caramel-500 mb-2">about us</p>
            <h2 className="font-display text-4xl md:text-5xl text-burgundy-500 mb-5 font-medium">
              {t.about.title}
            </h2>
            <div className="gold-divider-left mb-6" />
            <p className="font-body text-burgundy-700/80 text-lg leading-relaxed mb-7">
              {t.about.story}
            </p>
            <Link href="/about" className="btn-ghost inline-flex items-center gap-2">
              Read our story <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
