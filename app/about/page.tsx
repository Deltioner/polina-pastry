"use client";
import Image from "next/image";
import { Heart, Sparkles, Wheat } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useStore } from "@/lib/store";
import { getTranslation, isRTL } from "@/lib/i18n";

const STORY_IMAGES = [
  "/IMG_6350.jpeg",
  "https://images.unsplash.com/photo-1530610476181-d83430b64dcd?w=800&q=80",
  "https://images.unsplash.com/photo-1488477181946-6428a0291777?w=800&q=80",
];

export default function AboutPage() {
  const { locale } = useStore();
  const t = getTranslation(locale);
  const rtl = isRTL(locale);

  const sections = [
    { Icon: Heart, kicker: "how it started", title: "How It Started", body: t.about.story },
    { Icon: Sparkles, kicker: "our craft", title: "Our Craft", body: t.about.craft },
    { Icon: Wheat, kicker: "our promise", title: "Our Promise", body: t.about.promise },
  ];

  return (
    <div dir={rtl ? "rtl" : "ltr"} className="min-h-screen bg-cream-50">
      <Navbar />

      {/* Hero */}
      <div className="relative pt-36 pb-20 px-6 text-center overflow-hidden">
        <div
          aria-hidden
          className="absolute -top-20 -left-32 w-[480px] h-[480px] rounded-full bg-blush-200/55 blur-[110px] pointer-events-none"
        />
        <div
          aria-hidden
          className="absolute bottom-0 -right-20 w-[400px] h-[400px] rounded-full bg-gold-200/35 blur-[110px] pointer-events-none"
        />

        <div className="relative max-w-3xl mx-auto">
          <p className="script text-2xl text-caramel-500 mb-2">est. 2022 · Kampen, NL</p>
          <h1 className="font-display text-5xl md:text-6xl text-burgundy-500 font-medium mb-4">
            {t.about.title}
          </h1>
          <div className="gold-divider opacity-70" />
          <p className="font-display italic text-2xl text-burgundy-700 mt-6 leading-snug max-w-xl mx-auto">
            "I bake every piece as if it were for my own family."
          </p>
        </div>
      </div>

      {/* Sections */}
      <div className="max-w-5xl mx-auto px-6 py-16 space-y-24">
        {sections.map(({ Icon, kicker, title, body }, i) => (
          <div
            key={title}
            className={`flex flex-col md:flex-row gap-14 items-center ${
              i % 2 === 1 ? "md:flex-row-reverse" : ""
            }`}
          >
            <div className="md:w-1/2 space-y-5">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-blush-100 flex items-center justify-center">
                  <Icon size={16} className="text-burgundy-500" />
                </div>
                <p className="script text-xl text-caramel-500">{kicker}</p>
              </div>
              <h2 className="font-display text-3xl md:text-4xl text-burgundy-500 font-medium">
                {title}
              </h2>
              <div className="gold-divider-left" />
              <p className="font-body text-burgundy-700/80 text-lg leading-relaxed">{body}</p>
            </div>
            <div className="md:w-1/2 relative">
              <div className="h-72 md:h-80 relative rounded-[32px] overflow-hidden border-[5px] border-cream-50 shadow-xl shadow-burgundy-500/15">
                <Image
                  src={STORY_IMAGES[i]}
                  alt={title}
                  fill
                  quality={92}
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover object-top"
                />
              </div>
              {/* Sticker */}
              <div
                className={`hidden md:block absolute -bottom-4 ${
                  i % 2 === 1 ? "-left-4" : "-right-4"
                } w-16 h-16 rounded-full bg-gold-500 flex items-center justify-center shadow-lg rotate-[-8deg]`}
              >
                <span className="script text-cream-50 text-2xl leading-none">0{i + 1}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Signature section */}
      <div className="px-6 py-20">
        <div className="max-w-3xl mx-auto bg-blush-100 rounded-[40px] p-10 md:p-14 text-center relative overflow-hidden">
          <div
            aria-hidden
            className="absolute -top-16 -right-16 w-64 h-64 rounded-full bg-blush-200/70 blur-[80px]"
          />
          <div className="relative">
            <Heart
              size={28}
              className="text-burgundy-500 mx-auto mb-5"
              fill="currentColor"
            />
            <p className="font-display italic text-2xl md:text-3xl text-burgundy-500 leading-relaxed mb-5 font-medium">
              "Every cake is a love letter — sealed with sugar, signed with care."
            </p>
            <div className="gold-divider opacity-60 mb-5" />
            <p className="script text-2xl text-caramel-500">~ Polina ~</p>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}
