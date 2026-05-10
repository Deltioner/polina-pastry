import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Your Cart",
  description: "Review your Polina Pastry order before checkout.",
  alternates: { canonical: "/cart" },
  robots: { index: false, follow: true },
};

export default function CartLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
