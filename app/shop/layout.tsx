import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shop · Cakes, Pastries & Cookies",
  description:
    "Order custom celebration cakes, Ukrainian pastries (medovik, paska, Kyiv cake) and daily fresh pastries online. Hand-baked in small batches in Kampen, Netherlands. Pickup and delivery in Kampen, Zwolle and IJsselmuiden.",
  keywords: [
    "order cake online Kampen",
    "taart bestellen Kampen",
    "custom cake Netherlands",
    "wedding cake order",
    "birthday cake online",
    "medovik bestellen",
    "paska Ukraine cake",
    "Ukrainian pastry shop",
    "fresh pastries Kampen",
    "patisserie online NL",
  ],
  alternates: { canonical: "/shop" },
  openGraph: {
    title: "Shop · Polina Pastry",
    description:
      "Custom celebration cakes, Ukrainian pastries and daily fresh bakes — order online for pickup or delivery in Kampen.",
    url: "/shop",
  },
};

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
