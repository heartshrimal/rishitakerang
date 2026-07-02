import { Geist, Geist_Mono, Playfair_Display } from "next/font/google";
import Navbar from "@/components/Navbar";
import SplashWrapper from "@/components/SplashWrapper";
import Parallax from "@/components/Parallax";
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
          <div className="absolute -top-24 -right-16 w-[30rem] h-[30rem] rounded-full bg-primary/35 animate-[blob-drift_30s_ease-in-out_infinite]" />
          <div className="absolute top-1/4 -left-20 w-80 h-80 rounded-[40%_60%_60%_40%/50%_40%_60%_50%] bg-secondary/35 animate-[blob-drift_35s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-2/3 right-8 w-56 h-56 rounded-[30%_70%_40%_60%] bg-accent/30 animate-[blob-drift_28s_ease-in-out_infinite]" />
          <div className="absolute -bottom-16 left-1/3 w-72 h-72 rounded-[60%_40%_30%_70%/50%_60%_40%_50%] bg-primary/30 animate-[blob-drift_40s_ease-in-out_infinite_reverse]" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] rounded-[50%_50%_40%_60%/60%_40%_50%_50%] bg-secondary/25 animate-[blob-drift_45s_ease-in-out_infinite]" />
          <div className="absolute bottom-[30%] left-6 w-40 h-40 rounded-[70%_30%_50%_50%] bg-primary/30 animate-[blob-drift_32s_ease-in-out_infinite_reverse]" />
          <div className="absolute bottom-[10%] right-[15%] w-24 h-24 rounded-[50%_50%_70%_30%/60%_40%_30%_70%] bg-accent/25 animate-[blob-drift_38s_ease-in-out_infinite]" />
        </div>
        <Parallax speed={0.05} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[12%] left-[30%] w-10 h-10 rounded-full bg-primary/15" />
          <div className="absolute bottom-[40%] right-[35%] w-8 h-8 rotate-45 bg-secondary/15" />
        </Parallax>
        <Parallax speed={0.1} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[5%] left-[10%] w-40 h-40 rounded-[50%_50%_60%_40%/40%_60%_50%_50%] bg-accent/20" />
          <div className="absolute bottom-[15%] right-[20%] w-28 h-28 rounded-[60%_40%_30%_70%] bg-primary/20" />
          <div className="absolute top-[55%] left-[60%] w-20 h-20 rounded-[40%_60%_70%_30%/50%_40%_60%_50%] bg-secondary/20" />
          <div className="absolute top-[80%] left-[5%] w-16 h-16 rounded-full border border-accent/25" />
        </Parallax>
        <Parallax speed={0.2} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[8%] right-[25%] w-6 h-6 rounded-full bg-accent/35" />
          <div className="absolute bottom-[50%] left-[15%] w-10 h-10 rounded-[60%_40%_50%_50%] border border-primary/30" />
        </Parallax>
        <Parallax speed={0.25} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[70%] right-[8%] w-7 h-7 rounded-full bg-secondary/30" />
        </Parallax>
        <Parallax speed={0.3} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[18%] left-[20%] w-12 h-12 rounded-full bg-primary/25 animate-[pulse-glow_6s_ease-in-out_infinite]" />
          <div className="absolute bottom-[25%] right-[12%] w-24 h-24 rounded-[30%_70%_50%_50%] border-2 border-secondary/30 animate-[spin-slow-reverse_14s_linear_infinite]" />
        </Parallax>
        <Parallax speed={0.4} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[40%] right-[15%] w-5 h-5 rounded-full border border-primary/40" />
          <div className="absolute top-[65%] left-[35%] w-9 h-9 rotate-12 bg-accent/25" />
        </Parallax>
        <Parallax speed={0.45} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute bottom-[10%] left-[40%] w-6 h-6 rounded-full bg-accent/35 animate-[pulse-glow_8s_ease-in-out_infinite_1s]" />
        </Parallax>
        <Parallax speed={0.5} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[15%] right-[10%] w-20 h-20 rounded-full bg-accent/40 animate-[pulse-glow_4s_ease-in-out_infinite]" />
          <div className="absolute top-[35%] left-[8%] w-12 h-12 rounded-full bg-primary/35 animate-[pulse-glow_5s_ease-in-out_infinite_0.5s]" />
          <div className="absolute top-[60%] left-[20%] w-8 h-8 rounded-full border border-secondary/45 animate-[pulse-glow_7s_ease-in-out_infinite_2s]" />
          <div className="absolute bottom-[20%] right-[5%] w-16 h-16 rounded-full border-2 border-primary/40 animate-[spin-slow_8s_linear_infinite]" />
          <div className="absolute top-[10%] left-[40%] w-24 h-24 rounded-[30%_70%_50%_50%] border-2 border-secondary/40 animate-[spin-slow-reverse_12s_linear_infinite]" />
          <div className="absolute bottom-[40%] right-[20%] w-14 h-14 border-2 border-accent/40 rounded-full animate-[spin-slow_10s_linear_infinite]" />
          <div className="absolute top-[45%] left-[5%] w-10 h-10 rotate-45 border border-primary/35 animate-[spin-slow-reverse_15s_linear_infinite]" />
        </Parallax>
        <Parallax speed={0.6} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[25%] right-[35%] w-4 h-4 rounded-full bg-primary/45 animate-[pulse-glow_3s_ease-in-out_infinite_0.3s]" />
          <div className="absolute bottom-[35%] left-[45%] w-5 h-5 rotate-45 border border-accent/40" />
        </Parallax>
        <Parallax speed={0.7} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[30%] left-[55%] w-3 h-3 rounded-full bg-secondary/50" />
        </Parallax>
        <Parallax speed={-0.08} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[40%] right-[40%] w-14 h-14 rounded-[40%_60%_50%_50%] bg-accent/20" />
          <div className="absolute bottom-[20%] left-[25%] w-6 h-6 rounded-full border border-secondary/35" />
        </Parallax>
        <Parallax speed={-0.15} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[15%] left-[45%] w-8 h-8 rotate-45 bg-primary/25" />
        </Parallax>
        <Parallax speed={-0.25} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[60%] left-[10%] w-5 h-5 rounded-full bg-accent/35 animate-[pulse-glow_5s_ease-in-out_infinite_0.8s]" />
          <div className="absolute top-[20%] right-[5%] w-18 h-18 rounded-[60%_40%_30%_70%/40%_50%_60%_50%] border border-primary/30" />
        </Parallax>
        <Parallax speed={-0.35} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute bottom-[30%] right-[30%] w-4 h-4 rounded-full bg-secondary/45" />
        </Parallax>
        <Parallax speed={-0.5} className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
          <div className="absolute top-[50%] left-[25%] w-6 h-6 rounded-full border-2 border-accent/35 animate-[spin-slow_12s_linear_infinite]" />
          <div className="absolute top-[75%] left-[55%] w-5 h-5 rotate-12 bg-primary/30" />
        </Parallax>
        <SplashWrapper>
          <Navbar />
          {children}
        </SplashWrapper>
      </body>
    </html>
  );
}
