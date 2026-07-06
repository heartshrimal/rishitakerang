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

export const metadata = {
  title: "Rishita Ke Rang — Handmade Clay Art",
  description:
    "Handcrafted clay charms, keychains, earrings and more. Every piece is made with love, just for you.",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${playfair.variable} h-full antialiased`}
    >
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
