"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function OrderLookup() {
  const router = useRouter();
  const [orderId, setOrderId] = useState("");

  function handleSubmit(e) {
    e.preventDefault();
    if (orderId.trim()) {
      router.push(`/order/${orderId.trim()}`);
    }
  }

  return (
    <section className="px-5 pt-12 pb-20">
      <div className="max-w-lg mx-auto text-center space-y-6">
        <h1 className="font-script text-4xl text-text">Track Order</h1>
        <div className="w-8 h-[2px] bg-accent/30 mx-auto" />
        <p className="text-sm text-muted">
          Enter your order ID to check payment status.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            placeholder="Order ID (e.g. 1741180000000)"
            className="w-full rounded-2xl border border-border bg-background px-4 py-3.5 text-sm text-text placeholder:text-muted/40 text-center focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
            required
          />
          <button
            type="submit"
            className="w-full rounded-2xl bg-text py-4 text-background font-medium text-base hover:opacity-90 transition-opacity"
          >
            Track Order
          </button>
        </form>

        <Link
          href="/"
          className="inline-block text-xs text-muted hover:text-text underline transition-colors"
        >
          ← Back to Home
        </Link>
      </div>
    </section>
  );
}
