import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import SplashWrapper from "@/components/SplashWrapper";
import Background from "@/components/Background";
import ScrollingBanner from "@/components/ScrollingBanner";
import { CartProvider } from "@/lib/CartContext";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-body",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-display",
  subsets: ["latin"],
});

const siteUrl = "https://rishitakerang.in";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Rishita Ke Rang — Handmade Clay Charms, Earrings & Keychains | Custom Clay Art",
    template: "%s | Rishita Ke Rang",
  },
  description:
    "Shop handmade polymer clay charms, keychains, earrings, mini frames & more at Rishita Ke Rang. Every piece is hand-sculpted, customisable, and made with love in India. Custom clay orders welcome.",
  keywords: [
    "rishita ke rang",
    "rishitakerang",
    "rishita",
    "handmade clay art",
    "polymer clay charms",
    "clay earrings",
    "handmade keychains",
    "clay bag charms",
    "custom clay jewellery",
    "mini clay frames",
    "handcrafted clay",
    "clay art india",
    "custom bag charm",
    "polymer clay earrings india",
    "handmade clay keychain",
    "clay couple frame",
    "nimbu mirchi earrings",
    "handmade gifts india",
    "custom clay gifts",
    "clay jewellery online",
    "artisan clay products",
    "hand sculpted clay",
    "clay accessories",
    "personalised clay charm",
    "clay art shop",
  ],
  authors: [{ name: "Rishita Ke Rang" }],
  creator: "Rishita Ke Rang",
  publisher: "Rishita Ke Rang",
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: siteUrl,
    siteName: "Rishita Ke Rang",
    title: "Rishita Ke Rang — Handmade Clay Charms, Earrings & Keychains",
    description:
      "Shop handmade polymer clay charms, keychains, earrings, mini frames & more. Every piece is hand-sculpted, customisable, and made with love.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Rishita Ke Rang — Handmade Clay Art",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Rishita Ke Rang — Handmade Clay Art",
    description:
      "Handmade polymer clay charms, keychains, earrings & more. Custom orders welcome.",
    images: ["/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }) {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Rishita Ke Rang",
    url: siteUrl,
    logo: `${siteUrl}/favicon.ico`,
    description:
      "Handmade polymer clay charms, keychains, earrings, mini frames and more. Every piece is hand-sculpted and made with love.",
    sameAs: ["https://www.instagram.com/rishita.ke.rang"],
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      url: `${siteUrl}/contact`,
    },
  };

  const websiteJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Rishita Ke Rang",
    url: siteUrl,
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/shop?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  };

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
      </head>
      <body className="relative min-h-full flex flex-col">
        <Background />
        <SplashWrapper>
          <CartProvider>
            <Navbar />
            <ScrollingBanner />
            {children}
          </CartProvider>
        </SplashWrapper>
      </body>
    </html>
  );
}
