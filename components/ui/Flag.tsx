import type { Locale } from "@/types";
import clsx from "clsx";

interface FlagProps {
  code: Locale;
  className?: string;
  /** Width in px. Height keeps the standard 3:2 flag ratio. */
  size?: number;
}

/**
 * Real flag artwork rendered as inline SVG (no external deps, no emoji
 * fallback issues on Windows).
 *
 * - en → United Kingdom (Union Jack)
 * - nl → Netherlands tricolour
 * - uk → Ukraine bicolour
 * - ar → Pan-Arab colours (red / white / black / green) — represents the
 *        Arab world rather than a single Arabic-speaking country.
 */
export function Flag({ code, className, size = 22 }: FlagProps) {
  const height = Math.round((size * 2) / 3);
  const baseProps = {
    width: size,
    height,
    viewBox: "0 0 60 40",
    xmlns: "http://www.w3.org/2000/svg",
    role: "img" as const,
    "aria-label": LABEL[code],
    className: clsx("inline-block shrink-0 rounded-[2px] overflow-hidden", className),
  };

  switch (code) {
    case "en":
      return (
        <svg {...baseProps}>
          {/* Union Jack — simplified */}
          <rect width="60" height="40" fill="#012169" />
          {/* White diagonals */}
          <path d="M0,0 L60,40 M60,0 L0,40" stroke="#fff" strokeWidth="8" />
          {/* Red diagonals (offset) */}
          <path
            d="M0,0 L60,40"
            stroke="#C8102E"
            strokeWidth="3"
            strokeDasharray="100"
            strokeDashoffset="0"
          />
          <path d="M60,0 L0,40" stroke="#C8102E" strokeWidth="3" />
          {/* White cross */}
          <path d="M30,0 V40 M0,20 H60" stroke="#fff" strokeWidth="10" />
          {/* Red cross */}
          <path d="M30,0 V40 M0,20 H60" stroke="#C8102E" strokeWidth="6" />
        </svg>
      );

    case "nl":
      return (
        <svg {...baseProps}>
          <rect width="60" height="40" fill="#AE1C28" />
          <rect y="13.33" width="60" height="13.33" fill="#fff" />
          <rect y="26.66" width="60" height="13.34" fill="#21468B" />
        </svg>
      );

    case "uk":
      return (
        <svg {...baseProps}>
          <rect width="60" height="20" fill="#0057B7" />
          <rect y="20" width="60" height="20" fill="#FFD700" />
        </svg>
      );

    case "ar":
      // Pan-Arab colours — Arab Revolt palette, represents the Arab world
      return (
        <svg {...baseProps}>
          <rect width="60" height="10" fill="#CE1126" />
          <rect y="10" width="60" height="10" fill="#fff" />
          <rect y="20" width="60" height="10" fill="#000" />
          <rect y="30" width="60" height="10" fill="#007A3D" />
        </svg>
      );
  }
}

const LABEL: Record<Locale, string> = {
  en: "United Kingdom flag",
  uk: "Ukraine flag",
  nl: "Netherlands flag",
  ar: "Arab world flag",
};
