"use client";
import Link from "next/link";
import Image from "next/image";
import { Instagram, Facebook, Mail, Phone, MapPin, Heart } from "lucide-react";
import { useStore } from "@/lib/store";
import { getTranslation, isRTL } from "@/lib/i18n";

function TelegramIcon({ size = 16 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M9.78 18.65l.28-4.23 7.68-6.92c.34-.31-.07-.46-.52-.19L7.74 13.3 3.64 12c-.88-.25-.89-.86.2-1.3l15.97-6.16c.73-.33 1.43.18 1.15 1.3l-2.72 12.81c-.19.91-.74 1.13-1.5.71L12.6 16.3l-1.99 1.93c-.23.23-.42.42-.83.42z" />
    </svg>
  );
}

export default function Footer() {
  const { locale } = useStore();
  const t = getTranslation(locale);
  const rtl = isRTL(locale);

  return (
    <footer dir={rtl ? "rtl" : "ltr"} className="relative bg-blush-100 text-burgundy-800 overflow-hidden">
      {/* Soft decorative blob */}
      <div
        aria-hidden
        className="absolute top-0 right-0 w-[420px] h-[420px] rounded-full bg-blush-200/50 blur-[100px] -translate-y-1/3 translate-x-1/4 pointer-events-none"
      />
      <div
        aria-hidden
        className="absolute bottom-0 left-0 w-[320px] h-[320px] rounded-full bg-gold-200/30 blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none"
      />

      {/* Gold top hairline */}
      <div className="h-px bg-gold-gradient opacity-50" />

      <div className="relative max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Brand */}
          <div className="space-y-4">
            <Link href="/" aria-label="Polina Pastry — home" className="flex items-center gap-3">
              <Image
                src="/polina-logo.jpg"
                alt="Polina Pastry"
                width={64}
                height={64}
                className="h-14 w-14 rounded-2xl object-cover ring-1 ring-burgundy-700/15 shadow-md shrink-0"
              />
              <span className="flex items-baseline gap-2">
                <span className="font-display text-3xl text-burgundy-500">Polina</span>
                <span className="script text-xl text-caramel-500">pastry</span>
              </span>
            </Link>
            <p className="font-body text-sm text-burgundy-700/80 leading-relaxed max-w-xs">
              {t.footer.tagline}
            </p>
            <div className="flex gap-2.5 pt-1">
              <a
                href="https://instagram.com/polina_pastry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Polina Pastry on Instagram"
                className="w-9 h-9 rounded-full bg-gradient-to-br from-yellow-400 via-pink-500 to-purple-600 text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Instagram size={16} />
              </a>
              <a
                href="https://facebook.com/polina.pastry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Polina Pastry on Facebook"
                className="w-9 h-9 rounded-full bg-[#1877F2] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <Facebook size={16} fill="currentColor" />
              </a>
              <a
                href="https://t.me/polina_pastry"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Polina Pastry on Telegram"
                className="w-9 h-9 rounded-full bg-[#229ED9] text-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"
              >
                <TelegramIcon size={16} />
              </a>
            </div>
          </div>

          {/* Links */}
          <div className="space-y-4">
            <h4 className="font-display italic text-xl text-burgundy-500 mb-2">Wander</h4>
            <nav className="flex flex-col gap-2.5">
              {[
                { href: "/", label: t.nav.home },
                { href: "/shop", label: t.nav.shop },
                { href: "/about", label: t.nav.about },
                { href: "/contact", label: t.nav.contact },
              ].map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className="font-body text-sm text-burgundy-700/80 hover:text-burgundy-500 transition-colors w-fit"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h4 className="font-display italic text-xl text-burgundy-500 mb-2">Say hello</h4>
            <div className="flex flex-col gap-3">
              <a
                href="mailto:polina.pastry1@gmail.com"
                className="flex items-center gap-3 font-body text-sm text-burgundy-700/80 hover:text-burgundy-500 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center shrink-0">
                  <Mail size={13} />
                </span>
                polina.pastry1@gmail.com
              </a>
              <a
                href="tel:+380507717694"
                className="flex items-center gap-3 font-body text-sm text-burgundy-700/80 hover:text-burgundy-500 transition-colors"
              >
                <span className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center shrink-0">
                  <Phone size={13} />
                </span>
                +380 50 771 7694
              </a>
              <p className="flex items-center gap-3 font-body text-sm text-burgundy-700/80">
                <span className="w-8 h-8 rounded-full bg-cream-50 flex items-center justify-center shrink-0">
                  <MapPin size={13} />
                </span>
                Kampen, Netherlands
              </p>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-blush-200 mt-8 pt-5 flex flex-col md:flex-row justify-between items-center gap-3">
          <p className="font-body text-xs text-burgundy-700/70 flex items-center gap-1.5">
            Made with <Heart size={11} fill="currentColor" className="text-burgundy-500" />
            <span>· © {new Date().getFullYear()} Polina Pastry · {t.footer.rights}</span>
          </p>
          <p className="font-body text-[11px] italic text-burgundy-700/45 flex items-center gap-1.5 tracking-wide">
            <span>created by</span>
            <span className="not-italic font-medium uppercase tracking-[0.18em] text-burgundy-700/70">
              Apion Technology
            </span>
          </p>
        </div>
      </div>
    </footer>
  );
}
