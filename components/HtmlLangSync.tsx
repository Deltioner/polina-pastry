"use client";
import { useEffect } from "react";
import { useStore } from "@/lib/store";
import { isRTL } from "@/lib/i18n";

export default function HtmlLangSync() {
  const locale = useStore((s) => s.locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = isRTL(locale) ? "rtl" : "ltr";
  }, [locale]);

  return null;
}
