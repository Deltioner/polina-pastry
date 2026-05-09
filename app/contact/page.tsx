"use client";
import { useState } from "react";
import { Mail, Phone, MapPin, Clock, Send, CheckCircle, Heart } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/lib/store";
import { getTranslation, isRTL } from "@/lib/i18n";

export default function ContactPage() {
  const { locale } = useStore();
  const t = getTranslation(locale);
  const rtl = isRTL(locale);
  const [sent, setSent] = useState(false);

  const inputCls =
    "w-full border border-blush-200 rounded-2xl px-4 py-3 font-body text-burgundy-800 bg-white text-base placeholder:text-burgundy-700/35";

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-cream-50">
      <Navbar />

      {/* Page header */}
      <div className="relative pt-36 pb-16 px-6 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-20 left-1/3 w-[480px] h-[480px] rounded-full bg-blush-200/55 blur-[110px] pointer-events-none"
        />
        <div className="relative max-w-3xl mx-auto">
          <p className="script text-2xl text-caramel-500 mb-2">say hello</p>
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-500 font-medium">
            {t.nav.contact}
          </h1>
          <div className="gold-divider mt-6 opacity-70" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-24">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Info column */}
          <div className="space-y-8">
            <div className="bg-white border border-blush-100 rounded-[28px] p-7 space-y-4">
              {[
                { Icon: MapPin, label: "Kampen, Netherlands" },
                { Icon: Phone, label: "+380 50 771 7694" },
                { Icon: Mail, label: "polina.pastry1@gmail.com" },
                { Icon: Clock, label: "Mon – Fri: 8:00 – 18:00" },
              ].map(({ Icon, label }) => (
                <div key={label} className="flex items-center gap-4">
                  <div className="w-11 h-11 bg-blush-100 rounded-full flex items-center justify-center shrink-0">
                    <Icon size={16} className="text-burgundy-500" />
                  </div>
                  <span className="font-body text-burgundy-800 text-base">{label}</span>
                </div>
              ))}
            </div>

            <div className="bg-blush-100 rounded-[28px] p-7 relative overflow-hidden">
              <div
                aria-hidden
                className="absolute -bottom-12 -right-12 w-48 h-48 rounded-full bg-blush-200/70 blur-[60px]"
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-3">
                  <Heart size={14} className="text-burgundy-500" fill="currentColor" />
                  <p className="script text-xl text-burgundy-500">custom orders</p>
                </div>
                <p className="font-body text-burgundy-700/80 text-sm leading-relaxed">
                  Planning a wedding, birthday or special celebration? We create bespoke cakes
                  tailored exactly to your vision. Please contact us at least 2 weeks in advance.
                </p>
              </div>
            </div>
          </div>

          {/* Form column */}
          <div className="bg-white border border-blush-100 rounded-[28px] p-7 md:p-9">
            {sent ? (
              <div className="flex flex-col items-center justify-center text-center gap-5 py-16 h-full">
                <div className="w-20 h-20 rounded-full bg-blush-100 flex items-center justify-center">
                  <CheckCircle size={36} className="text-burgundy-500" />
                </div>
                <p className="script text-3xl text-caramel-500">thank you!</p>
                <h3 className="font-display text-3xl text-burgundy-500 font-medium">
                  Message received
                </h3>
                <p className="font-body text-burgundy-700/65 text-lg max-w-sm">
                  We&apos;ll get back to you within 24 hours.
                </p>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setSent(true);
                }}
                className="space-y-5"
              >
                <p className="script text-2xl text-caramel-500 mb-1">drop us a line</p>
                {[
                  { id: "name", label: "Your name", type: "text", required: true },
                  { id: "email", label: "Email address", type: "email", required: true },
                  { id: "phone", label: "Phone number", type: "tel", required: false },
                  { id: "date", label: "Pickup / delivery date", type: "date", required: false },
                ].map(({ id, label, type, required }) => (
                  <div key={id}>
                    <label className="block font-body text-xs tracking-wider uppercase text-burgundy-700/70 mb-2">
                      {label}
                      {required && <span className="text-burgundy-500 ms-1">*</span>}
                    </label>
                    <input type={type} required={required} className={inputCls} />
                  </div>
                ))}
                <div>
                  <label className="block font-body text-xs tracking-wider uppercase text-burgundy-700/70 mb-2">
                    Message
                  </label>
                  <textarea
                    rows={5}
                    placeholder="Tell us about your order — occasion, flavours, size, special requests..."
                    className={`${inputCls} resize-none`}
                  />
                </div>
                <button
                  type="submit"
                  className="btn-primary w-full flex items-center justify-center gap-2 py-4"
                >
                  <Send size={14} /> Send message
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
