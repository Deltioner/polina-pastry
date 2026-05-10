import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Ukraine · A Letter from Home",
  description:
    "A small window into Ukraine — the land, the people, the recipes, the war, and the hope. Behind every cake at Polina Pastry is a country we hold close. Слава Україні.",
  keywords: [
    "Ukraine bakery story",
    "support Ukraine pastry",
    "Ukrainian heritage Netherlands",
    "medovik history",
    "paska Easter Ukraine",
    "Slava Ukraini",
    "Ukrainian culture in NL",
  ],
  alternates: { canonical: "/ukraine" },
  openGraph: {
    title: "Ukraine · Polina Pastry",
    description:
      "The country behind the bakery — a small window into Ukraine's land, people, traditions and resilience.",
    url: "/ukraine",
  },
};

export default function UkraineLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
