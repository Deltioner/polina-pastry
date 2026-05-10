import type { Metadata } from "next";
import "./globals.css";
import ProductHydrator from "@/components/ProductHydrator";
import HtmlLangSync from "@/components/HtmlLangSync";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://polina-pastry.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Polina Pastry — Custom Cakes & Ukrainian Pastry in Kampen, Netherlands",
    template: "%s · Polina Pastry",
  },
  description:
    "Handmade custom celebration cakes, Ukrainian pastries (medovik, paska, Kyiv cake) and daily fresh pastries — baked in small batches in Kampen, Netherlands. Pickup and delivery in Kampen, Zwolle and IJsselmuiden.",
  keywords: [
    "Polina Pastry",
    "Polina Pastry Kampen",
    "bakkerij Kampen",
    "patisserie Kampen",
    "custom cake Kampen",
    "wedding cake Kampen",
    "bruidstaart Kampen",
    "verjaardagstaart Kampen",
    "birthday cake Kampen",
    "celebration cake Netherlands",
    "Ukrainian bakery Netherlands",
    "Oekraïense bakkerij",
    "Ukrainian pastry NL",
    "medovik",
    "honey cake",
    "paska",
    "Easter bread Ukraine",
    "Kyiv cake",
    "Kievse taart",
    "fresh pastries Kampen",
    "Kampen taart bestellen",
    "bakkerij Zwolle",
    "bakkerij IJsselmuiden",
    "handmade cakes Overijssel",
    "Polina Kampen",
  ],
  authors: [{ name: "Polina Pastry" }],
  creator: "Polina Pastry",
  publisher: "Polina Pastry",
  category: "food",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    alternateLocale: ["nl_NL", "uk_UA", "ar"],
    url: SITE_URL,
    siteName: "Polina Pastry",
    title: "Polina Pastry — Custom Cakes & Ukrainian Pastry in Kampen",
    description:
      "Handmade custom celebration cakes, Ukrainian pastries (medovik, paska) and daily fresh pastries in Kampen, Netherlands. Pickup and delivery in Kampen, Zwolle, IJsselmuiden.",
    images: [
      {
        url: "/polina-logo.jpg",
        width: 700,
        height: 700,
        alt: "Polina Pastry — handmade celebration cakes and Ukrainian pastries in Kampen, Netherlands",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Polina Pastry — Custom Cakes & Ukrainian Pastry in Kampen",
    description:
      "Handmade custom cakes and Ukrainian pastries in Kampen, Netherlands. Pickup and delivery in Kampen, Zwolle, IJsselmuiden.",
    images: ["/polina-logo.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
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
        {/* Structured data: Bakery / LocalBusiness for Google rich results */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Bakery",
              "@id": `${SITE_URL}#bakery`,
              name: "Polina Pastry",
              description:
                "Handmade custom celebration cakes, Ukrainian pastries (medovik, paska, Kyiv cake) and daily fresh pastries baked in small batches in Kampen, Netherlands.",
              url: SITE_URL,
              logo: `${SITE_URL}/polina-logo.jpg`,
              image: `${SITE_URL}/polina-logo.jpg`,
              telephone: "+380507717694",
              email: "polina.pastry1@gmail.com",
              address: {
                "@type": "PostalAddress",
                addressLocality: "Kampen",
                addressRegion: "Overijssel",
                addressCountry: "NL",
              },
              areaServed: [
                { "@type": "City", name: "Kampen" },
                { "@type": "City", name: "Zwolle" },
                { "@type": "City", name: "IJsselmuiden" },
              ],
              servesCuisine: ["Ukrainian", "European", "Bakery", "Patisserie"],
              priceRange: "€€",
              sameAs: [
                "https://instagram.com/polina_pastry",
                "https://facebook.com/polina.pastry",
                "https://t.me/polina_pastry",
              ],
              founder: { "@type": "Person", name: "Polina" },
              makesOffer: [
                { "@type": "Offer", itemOffered: { "@type": "Product", name: "Custom celebration cakes" } },
                { "@type": "Offer", itemOffered: { "@type": "Product", name: "Medovik (Ukrainian honey cake)" } },
                { "@type": "Offer", itemOffered: { "@type": "Product", name: "Paska (Ukrainian Easter bread)" } },
                { "@type": "Offer", itemOffered: { "@type": "Product", name: "Daily fresh pastries and cookies" } },
              ],
            }),
          }}
        />
        <HtmlLangSync />
        <ProductHydrator />
        {children}
      </body>
    </html>
  );
}
