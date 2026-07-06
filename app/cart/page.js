"use client";

import Link from "next/link";
import { useCart } from "@/lib/CartContext";
import { Trash2, Minus, Plus, ShoppingBag } from "lucide-react";

export default function CartPage() {
  const { items, removeItem, updateQuantity, subtotal, clearCart } = useCart();
  const shipping = items.length === 0 ? 0 : subtotal > 2000 ? 0 : 100;
  const total = subtotal + shipping;
  const freeShipping = items.length > 0 && subtotal > 2000;

  if (items.length === 0) {
    return (
      <section className="px-5 pt-20 pb-20">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-20 h-20 rounded-full bg-soft flex items-center justify-center">
              <ShoppingBag size={32} className="text-muted/40" />
            </div>
          </div>
          <h1 className="font-script text-4xl text-text">Your Cart</h1>
          <div className="w-8 h-[2px] bg-accent/30 mx-auto" />
          <p className="text-sm text-muted">Your cart is empty.</p>
          <Link
            href="/"
            className="inline-block rounded-2xl bg-text px-8 py-3.5 text-background font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Browse Products →
          </Link>
        </div>
      </section>
    );
  }

  return (
    <>
      <header className="px-5 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <Link
            href="/"
            className="inline-block text-xs text-muted hover:text-text transition-colors mb-5 uppercase tracking-wider"
          >
            ← Back
          </Link>
        </div>
      </header>

      <section className="px-5 pb-20">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center">
            <h1 className="font-script text-4xl text-text mt-1 leading-tight">
              Your Cart
            </h1>
            <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-3" />
          </div>

          <div className="space-y-3">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex gap-4 rounded-2xl bg-soft border border-border p-4"
              >
                {item.image && (
                  <div className="w-20 h-20 shrink-0 rounded-xl overflow-hidden bg-background">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                <div className="flex-1 min-w-0">
                  <Link
                    href={`/product/${item.id}`}
                    className="font-display text-base text-text hover:text-accent transition-colors line-clamp-1"
                  >
                    {item.name}
                  </Link>
                  <p className="text-sm font-semibold text-text mt-1">
                    ₹{item.price}
                  </p>
                  <div className="flex items-center gap-3 mt-2">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-background text-muted hover:text-text transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-sm font-medium text-text w-6 text-center tabular-nums">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="flex items-center justify-center w-7 h-7 rounded-lg border border-border bg-background text-muted hover:text-text transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                    <button
                      onClick={() => removeItem(item.id)}
                      className="ml-auto flex items-center justify-center w-7 h-7 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl bg-soft border border-border p-6 space-y-3">
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider text-center">
              Order Summary
            </h2>
            <div className="flex justify-between text-sm text-muted">
              <span>Subtotal ({items.reduce((s, i) => s + i.quantity, 0)} items)</span>
              <span>₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>Shipping</span>
              <span>
                {freeShipping ? (
                  <>
                    <span className="line-through">₹100</span>{" "}
                    <span className="text-green-600 font-medium">Free</span>
                  </>
                ) : (
                  <>₹{shipping}</>
                )}
              </span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-base font-semibold text-text">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <Link
            href={`/payment?cart=true`}
            className="block w-full rounded-2xl bg-text py-4 text-background font-medium text-base text-center hover:opacity-90 transition-opacity active:scale-[0.98]"
          >
            Checkout — ₹{total}
          </Link>

          <div className="text-center">
            <button
              onClick={clearCart}
              className="text-xs text-muted/50 hover:text-red-400 transition-colors"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </section>
    </>
  );
}
