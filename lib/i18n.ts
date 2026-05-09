import type { Locale, Translation } from "@/types";
import en from "@/locales/en";
import uk from "@/locales/uk";
import nl from "@/locales/nl";
import ar from "@/locales/ar";

export const LOCALES: Locale[] = ["en", "uk", "nl", "ar"];
export const DEFAULT_LOCALE: Locale = "en";

export const LOCALE_LABELS: Record<Locale, string> = {
  en: "English",
  uk: "Українська",
  nl: "Nederlands",
  ar: "العربية",
};

export const RTL_LOCALES: Locale[] = ["ar"];

const translations: Record<Locale, Translation> = { en, uk, nl, ar };

export function getTranslation(locale: Locale): Translation {
  return translations[locale] ?? translations[DEFAULT_LOCALE];
}

export function isRTL(locale: Locale): boolean {
  return RTL_LOCALES.includes(locale);
}