"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, Wheat, Sun, Users, Sparkles, ArrowRight, MapPin, Flower2, Coins, BookOpen } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/lib/store";
import { getTranslation, isRTL } from "@/lib/i18n";

const UA_BLUE = "#005BBB";
const UA_YELLOW = "#FFD500";

/** Subtle horizontal flag stripe — used as section dividers. */
function FlagStripe({ width = 96 }: { width?: number }) {
  return (
    <div
      className="mx-auto flex flex-col rounded-full overflow-hidden shadow-sm"
      style={{ width }}
      aria-hidden="true"
    >
      <div className="h-1.5" style={{ background: UA_BLUE }} />
      <div className="h-1.5" style={{ background: UA_YELLOW }} />
    </div>
  );
}

export default function UkrainePage() {
  const { locale } = useStore();
  const t = getTranslation(locale);
  const rtl = isRTL(locale);

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-cream-50">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────── */}
      <section className="relative pt-36 pb-24 px-6 overflow-hidden">
        {/* Soft flag-tinted blobs */}
        <div
          aria-hidden
          className="absolute -top-20 -left-32 w-[480px] h-[480px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: `${UA_BLUE}26` }}
        />
        <div
          aria-hidden
          className="absolute bottom-0 -right-20 w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: `${UA_YELLOW}33` }}
        />

        <div className="relative max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left text */}
          <div className="text-center lg:text-start">
            <div className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 bg-cream-50 border border-blush-200 rounded-full">
              <span
                aria-hidden="true"
                className="w-5 h-3.5 rounded-sm overflow-hidden flex flex-col ring-1 ring-burgundy-700/15 shadow-sm"
              >
                <span className="flex-1" style={{ background: UA_BLUE }} />
                <span className="flex-1" style={{ background: UA_YELLOW }} />
              </span>
              <span className="script text-lg text-burgundy-500">{t.ukraine.kicker}</span>
            </div>
            <h1 className="font-display text-burgundy-500 font-medium leading-[0.95] mb-6">
              <span className="block text-5xl md:text-6xl lg:text-7xl">{t.ukraine.title}</span>
            </h1>
            <p className="font-body text-lg text-burgundy-700/80 leading-relaxed max-w-xl mx-auto lg:mx-0 mb-8">
              {t.ukraine.intro}
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link href="#war" className="btn-outline inline-flex items-center gap-2 px-7 py-3.5">
                {t.ukraine.cta} <Heart size={14} fill="currentColor" />
              </Link>
            </div>
          </div>

          {/* Right collage */}
          <div className="relative aspect-[5/4] max-w-md mx-auto w-full">
            <div className="absolute top-0 left-0 w-2/3 h-3/5 rounded-[36px] overflow-hidden border-[5px] border-cream-50 shadow-xl shadow-burgundy-500/15 rotate-[-3deg]">
              <Image
                src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=900&q=85"
                alt="Wheat field"
                fill
                priority
                className="object-cover"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-3/5 h-3/5 rounded-[36px] overflow-hidden border-[5px] border-cream-50 shadow-xl shadow-burgundy-500/15 rotate-[4deg]">
              <Image
                src="https://images.unsplash.com/photo-1563308365-f68e665bc831?w=900&q=85"
                alt="Sunflower field"
                fill
                className="object-cover"
              />
            </div>
            {/* Yellow + blue stripe accent */}
            <div className="absolute top-1/2 -right-6 w-3 h-32 rounded-full overflow-hidden flex flex-col shadow-lg">
              <div className="flex-1" style={{ background: UA_BLUE }} />
              <div className="flex-1" style={{ background: UA_YELLOW }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── QUICK FACTS ──────────────────────────────────────────── */}
      <section className="py-16 px-6 bg-cream-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-10">
            <FlagStripe />
            <p className="script text-2xl text-caramel-500 mt-5 mb-1">in a few numbers</p>
            <h2 className="font-display text-3xl md:text-4xl text-burgundy-500 font-medium">
              At a Glance
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {[
              { Icon: MapPin,    value: "Kyiv",          label: "Capital · founded 482" },
              { Icon: Users,     value: "~41M",          label: "People" },
              { Icon: Wheat,     value: "603,500",       label: "km² — largest in Europe" },
              { Icon: BookOpen,  value: "Українська",    label: "Language · Cyrillic" },
              { Icon: Coins,     value: "₴ Hryvnia",     label: "Currency since 1996" },
              { Icon: Flower2,   value: "Sunflower",     label: "National flower" },
            ].map(({ Icon, value, label }) => (
              <div
                key={label}
                className="relative bg-white border border-blush-100 rounded-2xl p-5 text-center hover:border-blush-300 hover:shadow-md transition-all"
              >
                <div
                  className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 rounded-full flex items-center justify-center shadow-md"
                  style={{ background: UA_BLUE }}
                >
                  <Icon size={16} className="text-white" />
                </div>
                <p className="font-display text-xl text-burgundy-500 font-medium mt-4 leading-tight">
                  {value}
                </p>
                <p className="font-body text-[11px] uppercase tracking-widest text-burgundy-700/60 mt-1">
                  {label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── OATS / BREADBASKET ───────────────────────────────────── */}
      <section className="py-20 px-6 bg-cream-50">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="relative h-80 md:h-[26rem] rounded-[36px] overflow-hidden border-[5px] border-cream-50 shadow-xl shadow-burgundy-500/15">
            <Image
              src="https://images.unsplash.com/photo-1761467237365-5b3766f3476e?w=900&q=85"
              alt="Golden wheat field under blue sky"
              fill
              className="object-cover"
            />
            {/* Yellow corner sticker */}
            <div
              className="absolute -bottom-3 -left-3 w-16 h-16 rounded-full flex items-center justify-center shadow-lg rotate-[-8deg]"
              style={{ background: UA_YELLOW }}
            >
              <Wheat size={22} style={{ color: UA_BLUE }} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center">
                <Wheat size={16} className="text-burgundy-500" />
              </div>
              <p className="script text-xl text-caramel-500">where flour comes from</p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-burgundy-500 font-medium mb-4">
              {t.ukraine.oats_title}
            </h2>
            <div className="gold-divider-left mb-6" />
            <p className="font-body text-burgundy-700/80 text-lg leading-relaxed">
              {t.ukraine.oats_text}
            </p>
          </div>
        </div>
      </section>

      {/* ── NATURE / SUNFLOWERS ──────────────────────────────────── */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center md:[&>div:first-child]:order-2">
          <div className="relative h-80 md:h-[26rem] rounded-[36px] overflow-hidden border-[5px] border-cream-50 shadow-xl shadow-burgundy-500/15">
            <Image
              src="https://images.unsplash.com/photo-1598711965221-7f0afe9ed827?w=900&q=85"
              alt="Close-up of a sunflower in bloom"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center">
                <Sun size={16} className="text-burgundy-500" />
              </div>
              <p className="script text-xl text-caramel-500">a land worth keeping</p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-burgundy-500 font-medium mb-4">
              {t.ukraine.nature_title}
            </h2>
            <div className="gold-divider-left mb-6" />
            <p className="font-body text-burgundy-700/80 text-lg leading-relaxed">
              {t.ukraine.nature_text}
            </p>
          </div>
        </div>
      </section>

      {/* ── PEOPLE ───────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-blush-50 border-y border-blush-100">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-14 items-center">
          <div className="relative h-80 md:h-[26rem] rounded-[36px] overflow-hidden border-[5px] border-cream-50 shadow-xl shadow-burgundy-500/15">
            <Image
              src="https://images.unsplash.com/photo-1568471173242-461f0a730452?w=900&q=85"
              alt="Traditional Ukrainian baking"
              fill
              className="object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center">
                <Users size={16} className="text-burgundy-500" />
              </div>
              <p className="script text-xl text-caramel-500">our people</p>
            </div>
            <h2 className="font-display text-3xl md:text-4xl text-burgundy-500 font-medium mb-4">
              {t.ukraine.people_title}
            </h2>
            <div className="gold-divider-left mb-6" />
            <p className="font-body text-burgundy-700/80 text-lg leading-relaxed">
              {t.ukraine.people_text}
            </p>
          </div>
        </div>
      </section>

      {/* ── DAUGHTERS OF UKRAINE — collage layout ─────────────────── */}
      <section className="py-24 px-6 bg-blush-50 border-y border-blush-100 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-20 -right-20 w-[420px] h-[420px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: `${UA_BLUE}1A` }}
        />
        <div
          aria-hidden
          className="absolute -bottom-20 -left-20 w-[380px] h-[380px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: `${UA_YELLOW}26` }}
        />

        <div className="relative max-w-5xl mx-auto">
          {/* Centered title */}
          <div className="text-center mb-16">
            <FlagStripe />
            <p className="script text-2xl text-caramel-500 mt-5 mb-1">embroidered with love</p>
            <h2 className="font-display text-4xl md:text-5xl text-burgundy-500 font-medium">
              {t.ukraine.women_title}
            </h2>
          </div>

          {/* Asymmetric 2-photo collage */}
          <div className="relative max-w-3xl mx-auto h-[460px] md:h-[520px] mb-14">
            <div className="absolute top-0 left-0 w-3/5 h-4/5 rounded-[40px] overflow-hidden border-[6px] border-cream-50 shadow-2xl shadow-burgundy-500/20 rotate-[-3deg]">
              <Image
                src="https://images.unsplash.com/photo-1770935473935-f23d38538c00?w=900&q=85"
                alt="A young Ukrainian woman in vyshyvanka with a floral crown"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 60vw, 30vw"
              />
            </div>
            <div className="absolute bottom-0 right-0 w-3/5 h-4/5 rounded-[40px] overflow-hidden border-[6px] border-cream-50 shadow-2xl shadow-burgundy-500/20 rotate-[4deg]">
              <Image
                src="https://images.unsplash.com/photo-1686307732952-44b3784feda7?w=900&q=85"
                alt="A young Ukrainian woman in traditional embroidered vyshyvanka, Odessa"
                fill
                className="object-cover"
                sizes="(max-width: 768px) 60vw, 30vw"
              />
            </div>
            {/* Flag heart sticker top-right */}
            <div
              className="hidden md:flex absolute top-2 right-8 w-14 h-14 rounded-full items-center justify-center shadow-lg rotate-[8deg] z-10"
              style={{ background: UA_YELLOW }}
            >
              <Heart size={20} fill={UA_BLUE} stroke={UA_BLUE} />
            </div>
            {/* Embroidery-style flag bar bottom-left */}
            <div className="absolute bottom-2 left-4 hidden md:flex flex-col w-12 rounded-full overflow-hidden shadow-md z-10">
              <div className="h-2" style={{ background: UA_BLUE }} />
              <div className="h-2" style={{ background: UA_YELLOW }} />
            </div>
          </div>

          {/* Pull-quote body */}
          <div className="max-w-3xl mx-auto text-center">
            <Sparkles size={20} className="text-burgundy-500 mx-auto mb-4" />
            <p className="font-display italic text-xl md:text-2xl text-burgundy-700/90 leading-relaxed">
              {t.ukraine.women_text}
            </p>
          </div>
        </div>
      </section>

      {/* ── HOPE AMID DESTRUCTION — 3-photo gallery ──────────────── */}
      <section className="py-20 px-6 bg-cream-50 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-24 left-1/3 w-[480px] h-[480px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: `${UA_YELLOW}1F` }}
        />

        <div className="relative max-w-6xl mx-auto">
          {/* Centered intro */}
          <div className="text-center mb-12">
            <p className="script text-xl text-caramel-500 mb-1">a candle that won&rsquo;t go out</p>
            <h2 className="font-display text-3xl md:text-4xl text-burgundy-500 font-medium">
              {t.ukraine.hope_title}
            </h2>
            <div className="gold-divider mt-5 opacity-70" />
          </div>

          {/* One big symbolic photo — Motherland Monument */}
          <div className="relative max-w-5xl mx-auto mb-8">
            <div className="relative aspect-[16/10] rounded-[40px] overflow-hidden border-[6px] border-cream-50 shadow-2xl shadow-burgundy-500/25">
              <Image
                src="https://images.unsplash.com/photo-1747154815153-a0bc8e13c660?w=1600&q=90"
                alt="The Motherland Monument in Kyiv — Mother Ukraine standing watch over a country that endures"
                fill
                quality={92}
                sizes="(max-width: 1024px) 100vw, 70vw"
                className="object-cover"
              />
              <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-burgundy-900/85 via-burgundy-900/40 to-transparent" />
              <div className="absolute left-6 right-6 bottom-6 flex flex-col gap-2">
                <p className="script text-2xl text-cream-50 leading-none">
                  Батьківщина-Мати
                </p>
                <div className="flex items-center gap-3">
                  <span
                    className="w-3 h-3 rounded-full shrink-0 ring-1 ring-white/40"
                    style={{ background: UA_BLUE }}
                  />
                  <span className="font-body text-[11px] tracking-[0.2em] uppercase text-cream-50">
                    Mother Ukraine · Kyiv · she still stands
                  </span>
                </div>
              </div>
              <div className="hidden md:flex absolute top-5 left-5 flex-col w-12 rounded-md overflow-hidden shadow-lg ring-1 ring-white/30">
                <div className="h-3" style={{ background: UA_BLUE }} />
                <div className="h-3" style={{ background: UA_YELLOW }} />
              </div>
            </div>
          </div>

          {/* Destruction grid — documentary shots beneath the hero */}
          <div className="grid grid-cols-2 gap-3 md:gap-4 max-w-3xl mx-auto mb-12">
            {[
              {
                src: "https://images.unsplash.com/photo-1686056344479-ee9b74a1e0af?w=700&q=85",
                alt: "Damaged residential building, Kyiv, after a missile strike",
                caption: "Kyiv · 2022",
              },
              {
                src: "https://images.unsplash.com/photo-1773864503314-4102f8369b0f?w=700&q=85",
                alt: "Damaged storefront with fire-blackened walls, Kyiv",
                caption: "Kyiv · burned",
              },
            ].map((p) => (
              <div
                key={p.caption}
                className="relative aspect-[4/5] rounded-2xl overflow-hidden border-[3px] border-cream-50 shadow-lg shadow-burgundy-500/20"
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  quality={88}
                  sizes="(max-width: 768px) 33vw, 280px"
                  className="object-cover grayscale-[0.15]"
                />
                <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-burgundy-900/80 to-transparent" />
                <span className="absolute left-2 bottom-2 right-2 font-body text-[9px] tracking-[0.18em] uppercase text-cream-50">
                  {p.caption}
                </span>
              </div>
            ))}
          </div>

          {/* Cities chip strip */}
          <div className="flex flex-wrap gap-2 justify-center mb-10">
            {["Kyiv", "Kharkiv", "Mariupol", "Bucha", "Irpin", "Odesa", "Dnipro"].map((city) => (
              <span
                key={city}
                className="px-3 py-1 bg-white border border-blush-200 rounded-full font-body text-[11px] tracking-widest uppercase text-burgundy-700"
              >
                {city}
              </span>
            ))}
          </div>

          {/* Centered body text */}
          <div className="max-w-3xl mx-auto text-center">
            <p className="font-body text-burgundy-700/85 text-lg leading-relaxed">
              {t.ukraine.hope_text}
            </p>
          </div>
        </div>
      </section>

      {/* ── WAR ──────────────────────────────────────────────────── */}
      <section id="war" className="py-24 px-6 relative overflow-hidden">
        <div
          aria-hidden
          className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[400px] rounded-full blur-[120px] pointer-events-none"
          style={{ background: `${UA_BLUE}1F` }}
        />
        <div className="relative max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 mb-5 px-4 py-1.5 rounded-full" style={{ background: `${UA_BLUE}14`, border: `1px solid ${UA_BLUE}33` }}>
            <Heart size={13} style={{ color: UA_BLUE }} fill="currentColor" />
            <span className="font-body text-xs tracking-widest uppercase" style={{ color: UA_BLUE }}>
              since february 2022
            </span>
          </div>
          <h2 className="font-display text-3xl md:text-4xl text-burgundy-500 font-medium mb-6">
            {t.ukraine.war_title}
          </h2>
          <div className="gold-divider mb-7 opacity-70" />
          <p className="font-body text-burgundy-700/85 text-lg leading-relaxed mb-10 max-w-2xl mx-auto">
            {t.ukraine.war_text}
          </p>

          {/* Aid links — generic, well-known orgs */}
          <div className="bg-white border border-blush-100 rounded-[32px] p-7 md:p-9 text-left">
            <div className="flex items-center gap-2 mb-3 justify-center">
              <Sparkles size={14} className="text-burgundy-500" />
              <p className="script text-xl text-caramel-500">a small thread back home</p>
            </div>
            <p className="font-body text-burgundy-700/80 text-center leading-relaxed mb-6">
              If you would like to help, here are organisations doing real work on the ground:
            </p>
            <ul className="grid sm:grid-cols-2 gap-3">
              {[
                { name: "United24", href: "https://u24.gov.ua/", desc: "Ukraine's official aid platform" },
                { name: "Razom for Ukraine", href: "https://www.razomforukraine.org/", desc: "Medical & humanitarian aid" },
                { name: "Come Back Alive", href: "https://savelife.in.ua/en/", desc: "Veteran & soldier support" },
                { name: "UNICEF Ukraine", href: "https://www.unicef.org/emergencies/war-ukraine-pose-immediate-threat-children", desc: "Children & families" },
              ].map((org) => (
                <li key={org.name}>
                  <a
                    href={org.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-blush-50 border border-blush-100 hover:border-burgundy-300 hover:bg-blush-100 transition-colors group"
                  >
                    <div>
                      <p className="font-display text-base text-burgundy-500 group-hover:text-burgundy-600">
                        {org.name}
                      </p>
                      <p className="font-body text-xs text-burgundy-700/65">{org.desc}</p>
                    </div>
                    <ArrowRight size={14} className="text-burgundy-500 shrink-0 group-hover:translate-x-1 transition-transform" />
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ── CLOSING ──────────────────────────────────────────────── */}
      <section className="py-20 px-6 bg-cream-50 text-center relative overflow-hidden">
        <div
          aria-hidden
          className="absolute -bottom-20 left-1/2 -translate-x-1/2 w-[500px] h-[300px] rounded-full blur-[100px] pointer-events-none"
          style={{ background: `${UA_YELLOW}26` }}
        />
        <div className="relative max-w-2xl mx-auto">
          {/* Flag stripe */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-col w-32 rounded-full overflow-hidden shadow-md">
              <div className="h-3" style={{ background: UA_BLUE }} />
              <div className="h-3" style={{ background: UA_YELLOW }} />
            </div>
          </div>
          <p className="font-display italic text-3xl md:text-4xl text-burgundy-500 leading-snug mb-3 font-medium">
            {t.ukraine.closing}
          </p>
          <div className="gold-divider mt-7 opacity-60" />
        </div>
      </section>

      <Footer />
    </div>
  );
}
