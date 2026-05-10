"use client";
import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { ShoppingBag, Menu, X, ChevronDown } from "lucide-react";
import { useStore } from "@/lib/store";
import { getTranslation, LOCALES, LOCALE_LABELS, isRTL } from "@/lib/i18n";
import { Flag } from "@/components/ui/Flag";
import type { Locale } from "@/types";
import clsx from "clsx";

export default function Navbar() {
  const { locale, setLocale, getCartCount } = useStore();
  const t = getTranslation(locale);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [langOpen, setLangOpen] = useState(false);
  const cartCount = getCartCount();
  const rtl = isRTL(locale);
  const pathname = usePathname();
  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(href + "/");

  const [hidden, setHidden] = useState(false);
  const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setScrolled(y > 40);
      setHidden(false);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
      if (y > 40) {
        hideTimerRef.current = setTimeout(() => setHidden(true), 1500);
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
    };
  }, []);

  useEffect(() => {
    let rafId: number | null = null;
    let direction = 0;
    let pressed = false;
    let velocity = 0;
    const minVelocity = 4;
    const maxVelocity = 32;
    const accel = 1.0;
    const friction = 0.86;

    const isTextField = (el: EventTarget | null) => {
      if (!(el instanceof HTMLElement)) return false;
      return (
        el.tagName === "INPUT" ||
        el.tagName === "TEXTAREA" ||
        el.tagName === "SELECT" ||
        el.isContentEditable
      );
    };

    const tick = () => {
      if (pressed) {
        velocity = Math.min(velocity + accel, maxVelocity);
      } else {
        velocity *= friction;
        if (velocity < 0.4) {
          rafId = null;
          velocity = 0;
          direction = 0;
          return;
        }
      }
      window.scrollBy({ top: velocity * direction, behavior: "instant" });
      rafId = requestAnimationFrame(tick);
    };

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      if (isTextField(e.target)) return;
      if (e.ctrlKey || e.metaKey || e.altKey) return;
      e.preventDefault();
      if (e.repeat) return;

      const newDir = e.key === "ArrowDown" ? 1 : -1;
      if (direction !== newDir) {
        direction = newDir;
        velocity = minVelocity;
      }
      pressed = true;
      if (rafId === null) rafId = requestAnimationFrame(tick);
    };

    const onKeyUp = (e: KeyboardEvent) => {
      if (e.key !== "ArrowDown" && e.key !== "ArrowUp") return;
      pressed = false;
    };

    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  const langRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (!langOpen) return;
    const onPointerDown = (e: MouseEvent | TouchEvent) => {
      if (langRef.current && !langRef.current.contains(e.target as Node)) {
        setLangOpen(false);
      }
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLangOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("touchstart", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("touchstart", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [langOpen]);

  const linkClass = "font-body text-sm font-medium text-burgundy-800 hover:text-burgundy-500 transition-colors duration-200";

  return (
    <header
      dir={rtl ? "rtl" : "ltr"}
      onMouseEnter={() => setHidden(false)}
      className={clsx(
        "fixed top-0 w-full z-50 transition-all duration-500",
        hidden && !langOpen && !open ? "-translate-y-full opacity-0" : "translate-y-0 opacity-100",
        scrolled
          ? "bg-cream-50/92 backdrop-blur-md shadow-[0_4px_20px_-8px_rgba(156,42,63,0.12)] py-3"
          : "bg-cream-50/70 backdrop-blur-sm py-5"
      )}
    >
      <nav className="relative px-[15mm] flex items-center justify-between">
        {/* Logo — left, 15mm from viewport left edge */}
        <Link
          href="/"
          aria-label="Polina Pastry — home"
          className="flex items-center gap-3 group"
        >
          <Image
            src="/polina-logo.jpg"
            alt="Polina Pastry"
            width={48}
            height={48}
            priority
            className="h-11 w-11 rounded-xl object-cover ring-1 ring-burgundy-700/15 shadow-sm group-hover:shadow-md transition-shadow"
          />
          <span className="hidden sm:flex items-baseline gap-2">
            <span className="font-display text-3xl font-medium text-burgundy-500 group-hover:text-burgundy-600 transition-colors">
              Polina
            </span>
            <span className="script text-xl text-caramel-500 group-hover:text-burgundy-500 transition-colors">
              pastry
            </span>
          </span>
        </Link>

        {/* Links — absolutely centered in viewport so they never push logo/cart off-screen */}
        <div className="hidden lg:flex absolute left-1/2 -translate-x-1/2 items-center gap-9">
          {[
            { href: "/", label: t.nav.home },
            { href: "/shop", label: t.nav.shop },
            { href: "/about", label: t.nav.about },
            { href: "/contact", label: t.nav.contact },
          ].map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "relative font-body text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-burgundy-500"
                    : "text-burgundy-800 hover:text-burgundy-500"
                )}
              >
                {l.label}
                <span
                  className={clsx(
                    "pointer-events-none absolute -bottom-1.5 left-1/2 -translate-x-1/2 h-px bg-gold-500 transition-all duration-300 ease-out",
                    active ? "w-6 opacity-100" : "w-0 opacity-0"
                  )}
                />
              </Link>
            );
          })}
        </div>

        {/* Actions — right, 15mm from viewport right edge */}
        <div className="flex items-center gap-3">
          {/* Ukraine */}
          <Link
            href="/ukraine"
            aria-current={isActive("/ukraine") ? "page" : undefined}
            className={clsx(
              "hidden lg:inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border font-body text-sm font-medium transition-all duration-200",
              isActive("/ukraine")
                ? "bg-blush-200 border-blush-300 text-burgundy-500 shadow-sm"
                : "bg-blush-100 border-blush-200 text-burgundy-800 hover:bg-blush-200 hover:border-blush-300 hover:-translate-y-0.5 hover:shadow-md"
            )}
          >
            <span
              aria-hidden="true"
              className="w-2.5 h-2.5 rounded-full shrink-0 ring-1 ring-burgundy-700/15 bg-[linear-gradient(to_bottom,#0057B7_50%,#FFD700_50%)]"
            />
            {t.nav.ukraine}
          </Link>

          {/* Language */}
          <div ref={langRef} className="relative">
            <button
              onClick={() => setLangOpen(!langOpen)}
              aria-label="Change language"
              className="flex items-center gap-2 px-2 sm:px-3 py-1.5 rounded-full bg-blush-100/60 hover:bg-blush-200/80 text-burgundy-700 text-sm font-medium transition-colors"
            >
              <Flag code={locale} size={20} className="ring-1 ring-burgundy-700/10" />
              <span className="hidden sm:inline text-xs uppercase tracking-wider">{locale}</span>
              <ChevronDown
                size={12}
                className={clsx("hidden sm:block transition-transform", langOpen && "rotate-180")}
              />
            </button>
            {langOpen && (
              <div className="absolute top-11 right-0 bg-white border border-blush-200 shadow-xl shadow-burgundy-500/10 rounded-2xl py-2 min-w-[180px] z-50 overflow-hidden">
                {LOCALES.map((loc) => (
                  <button
                    key={loc}
                    onClick={() => { setLocale(loc as Locale); setLangOpen(false); }}
                    className={clsx(
                      "w-full text-left px-4 py-2.5 font-body text-sm flex items-center gap-3 transition-colors",
                      locale === loc
                        ? "bg-blush-100 text-burgundy-500"
                        : "text-burgundy-800 hover:bg-blush-50 hover:text-burgundy-500"
                    )}
                  >
                    <Flag code={loc as Locale} size={22} className="ring-1 ring-burgundy-700/10" />
                    <span>{LOCALE_LABELS[loc as Locale]}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Cart */}
          <Link
            href="/cart"
            className="relative p-2 rounded-full bg-burgundy-500 text-cream-50 hover:bg-burgundy-600 transition-colors shadow-md shadow-burgundy-500/20"
          >
            <ShoppingBag size={17} />
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-gold-500 text-burgundy-800 text-[10px] font-semibold w-5 h-5 rounded-full flex items-center justify-center border-2 border-cream-50">
                {cartCount}
              </span>
            )}
          </Link>

          {/* Mobile toggle */}
          <button
            className="lg:hidden text-burgundy-500 hover:text-burgundy-700 transition-colors p-1"
            onClick={() => setOpen(!open)}
            aria-label="Toggle menu"
          >
            {open ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </nav>

      {/* Mobile drawer */}
      {open && (
        <div className="lg:hidden bg-cream-50 border-t border-blush-200 px-6 py-7 flex flex-col gap-5 shadow-lg shadow-burgundy-500/10">
          {[
            { href: "/", label: t.nav.home },
            { href: "/shop", label: t.nav.shop },
            { href: "/about", label: t.nav.about },
            { href: "/contact", label: t.nav.contact },
          ].map((l) => {
            const active = isActive(l.href);
            return (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={clsx(
                  "font-display text-2xl transition-colors flex items-center gap-3",
                  active
                    ? "text-burgundy-500"
                    : "text-burgundy-800 hover:text-burgundy-500"
                )}
              >
                {active && <span className="w-1.5 h-1.5 rounded-full bg-gold-500" />}
                {l.label}
              </Link>
            );
          })}

          {/* Ukraine — flag pill, centered, with 1cm extra space above */}
          <Link
            href="/ukraine"
            onClick={() => setOpen(false)}
            aria-current={isActive("/ukraine") ? "page" : undefined}
            className={clsx(
              "self-center mt-[1cm] inline-flex items-center gap-2 px-4 py-2 rounded-full border font-body text-base font-medium transition-all duration-200",
              isActive("/ukraine")
                ? "bg-blush-200 border-blush-300 text-burgundy-500 shadow-sm"
                : "bg-blush-100 border-blush-200 text-burgundy-800 hover:bg-blush-200 hover:border-blush-300"
            )}
          >
            <span
              aria-hidden="true"
              className="w-3 h-3 rounded-full shrink-0 ring-1 ring-burgundy-700/15 bg-[linear-gradient(to_bottom,#0057B7_50%,#FFD700_50%)]"
            />
            {t.nav.ukraine}
          </Link>
          <div className="border-t border-blush-200 pt-6 text-center">
            <p className="font-display text-xl text-burgundy-500 leading-snug">
              Polina Pastry
            </p>
            <p className="script text-2xl text-caramel-500 mt-1">
              made with love
            </p>
          </div>
        </div>
      )}
    </header>
  );
}
