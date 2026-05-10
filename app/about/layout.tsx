import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Story · From Ukraine to Kampen",
  description:
    "Polina grew up baking in a Ukrainian kitchen. In 2022, she carried her grandmother's recipes to the Netherlands and opened Polina Pastry in Kampen — handmade cakes and pastries that bridge two homes.",
  keywords: [
    "Polina Pastry story",
    "Ukrainian baker Netherlands",
    "Polina Kampen baker",
    "Ukrainian pastry chef NL",
    "small batch bakery Kampen",
    "handmade cakes story",
  ],
  alternates: { canonical: "/about" },
  openGraph: {
    title: "Our Story · Polina Pastry",
    description:
      "From a Ukrainian kitchen to a small bakery in Kampen — the story behind Polina Pastry, the recipes, and the family they came from.",
    url: "/about",
  },
};

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
