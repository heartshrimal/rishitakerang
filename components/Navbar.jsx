"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, Home, User, Mail, CreditCard, Search, ShoppingCart } from "lucide-react";
import { categories } from "@/data/products";
import { useCart } from "@/lib/CartContext";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [pathname, setPathname] = useState("");

  useEffect(() => {
    setPathname(window.location.pathname);
  }, []);

  if (pathname.startsWith("/admin")) return null;

  return (
    <>
      <nav className="sticky top-[-2px] z-50 bg-text backdrop-blur-lg">
        <div className="mx-auto flex h-16 items-center justify-between px-5 max-w-lg">
          <Link href="/" className="text-2xl tracking-wide text-white" style={{ fontFamily: "'Amsterdam One', cursive" }}>
            rishita ke rang
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/shop"
              className="flex items-center justify-center w-7 h-7 rounded-xl bg-white/15 text-white/80 hover:bg-white/25 transition-colors"
            >
              <Search size={15} />
            </Link>
            <CartIcon />
            <button
              onClick={() => setOpen(true)}
              className="flex items-center justify-center w-7 h-7 rounded-xl bg-white/15 text-white/80 hover:bg-white/25 transition-colors"
            >
              <Menu size={18} />
            </button>
          </div>
        </div>
      </nav>

      <div
        className={`fixed inset-0 z-50 transition-all duration-400 ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />

        <div
          className={`absolute top-0 right-0 h-full w-80 bg-background shadow-2xl transition-transform duration-400 ease-out flex flex-col ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="shrink-0 h-40 bg-gradient-to-br from-primary/30 via-accent/20 to-secondary/25 flex flex-col justify-end px-6 pb-5">
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 flex items-center justify-center w-9 h-9 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-colors"
            >
              <X size={18} />
            </button>
            <p className="font-script text-3xl text-white drop-shadow-sm">
              Rishita Ke Rang
            </p>
            <p className="text-sm text-white/80 mt-1 font-medium">
              Handmade Clay Art
            </p>
          </div>

          <div className="flex-1 overflow-y-auto p-5">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 text-sm font-medium text-text hover:bg-soft transition-colors"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-soft text-muted">
                <Home size={16} />
              </span>
              Home
            </Link>

            <Link
              href="/shop"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 text-sm font-medium text-text hover:bg-soft transition-colors"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-soft text-muted">
                <Search size={16} />
              </span>
              Shop All
            </Link>

            <Link
              href="/about"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 text-sm font-medium text-text hover:bg-soft transition-colors"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-soft text-muted">
                <User size={16} />
              </span>
              About Me
            </Link>

            <Link
              href="/contact"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 text-sm font-medium text-text hover:bg-soft transition-colors"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-soft text-muted">
                <Mail size={16} />
              </span>
              Contact
            </Link>

            <Link
              href="/order"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 text-sm font-medium text-text hover:bg-soft transition-colors"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-soft text-muted">
                <Search size={16} />
              </span>
              Track Order
            </Link>

            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center gap-3 w-full rounded-2xl px-4 py-3.5 text-sm font-medium text-text hover:bg-soft transition-colors"
            >
              <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-soft text-muted">
                <ShoppingCart size={16} />
              </span>
              Cart
            </Link>

            <div className="flex items-center gap-3 mt-6 mb-3 px-4">
              <span className="h-px flex-1 bg-border/60" />
              <span className="text-[10px] uppercase tracking-[0.2em] text-muted/50 font-medium">
                Collections
              </span>
              <span className="h-px flex-1 bg-border/60" />
            </div>

            <div className="space-y-0.5">
              {categories.map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/category/${cat.slug}`}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 w-full rounded-2xl px-4 py-3 text-sm text-text hover:bg-soft transition-colors group"
                >
                  <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-soft text-base group-hover:scale-110 transition-transform">
                    {cat.icon}
                  </span>
                  <div>
                    <p className="font-medium">{cat.name}</p>
                    <p className="text-xs text-muted/60">{cat.description}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          <div className="shrink-0 p-5 border-t border-border">
            <p className="text-center text-[10px] uppercase tracking-[0.15em] text-muted/40">
              Every piece made with love 💛
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

function CartIcon() {
  const { totalItems } = useCart();

  return (
    <Link
      href="/cart"
      className="relative flex items-center justify-center w-7 h-7 rounded-xl bg-white/15 text-white/80 hover:bg-white/25 transition-colors"
    >
      <ShoppingCart size={15} />
      {totalItems > 0 && (
        <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full bg-accent text-white text-[10px] font-bold leading-none">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </Link>
  );
}
