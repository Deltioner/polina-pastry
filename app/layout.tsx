import type { Metadata } from "next";
import "./globals.css";
import ProductHydrator from "@/components/ProductHydrator";
import HtmlLangSync from "@/components/HtmlLangSync";

export const metadata: Metadata = {
  title: "Polina Pastry — Created by Hand, Baked with Love",
  description: "Custom cakes, pastries and cookies handcrafted in Kampen, Netherlands. Order online for pickup or delivery.",
  keywords: ["cake", "pastry", "bakery", "Kampen", "custom cake", "Polina", "Ukrainian pastry"],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght,SOFT,WONK@0,9..144,300..700,0..100,0..1;1,9..144,300..700,0..100,0..1&family=Caveat:wght@400;500;600&family=Inter:wght@300;400;500;600&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="font-body bg-cream-50 text-burgundy-800 antialiased">
        <HtmlLangSync />
        <ProductHydrator />
        {children}
      </body>
    </html>
  );
}
