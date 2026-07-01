import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import SplashWrapper from "@/components/SplashWrapper";
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
        <div className="fixed inset-0 -z-10 overflow-hidden bg-noise" aria-hidden>
          <div className="absolute -top-24 -right-16 w-[28rem] h-[28rem] rounded-full bg-primary/25" />
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-[40%_60%_60%_40%/50%_40%_60%_50%] bg-secondary/25" />
          <div className="absolute top-2/3 right-8 w-48 h-48 rounded-[30%_70%_40%_60%] bg-accent/20" />
          <div className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] bg-primary/20" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[30rem] h-[30rem] rounded-[50%_50%_40%_60%/60%_40%_50%_50%] bg-secondary/15" />
          <div className="absolute top-[15%] -right-10 w-36 h-36 rounded-[40%_60%_70%_30%] bg-accent/18" />
          <div className="absolute bottom-[30%] left-6 w-40 h-40 rounded-[70%_30%_50%_50%] bg-primary/18" />
        </div>
        <SplashWrapper>
          <Navbar />
          {children}
        </SplashWrapper>
      </body>
    </html>
  );
}
