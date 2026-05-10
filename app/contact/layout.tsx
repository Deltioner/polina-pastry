import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact · Order a Custom Cake",
  description:
    "Get in touch with Polina Pastry — order custom wedding, birthday or celebration cakes for pickup or delivery in Kampen, Zwolle and IJsselmuiden. Reach Polina by email, phone, or Instagram. Minimum 24h notice — 48–72h for custom cakes.",
  keywords: [
    "order custom cake Kampen",
    "cake bakery contact Kampen",
    "Polina Pastry phone",
    "wedding cake order Netherlands",
    "birthday cake bestellen Kampen",
    "Ukrainian cake order NL",
  ],
  alternates: { canonical: "/contact" },
  openGraph: {
    title: "Contact · Polina Pastry",
    description:
      "Order a custom cake for pickup or delivery in Kampen, Zwolle and IJsselmuiden. Email, phone, Instagram.",
    url: "/contact",
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
