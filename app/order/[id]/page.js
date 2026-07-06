"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

export default function OrderPage() {
  const { id } = useParams();
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  const fetchPayment = useCallback(async () => {
    try {
      const res = await fetch(`/api/payments/${id}`);
      if (!res.ok) throw new Error("Not found");
      const data = await res.json();
      setPayment(data);
      setError(false);
      return data;
    } catch {
      setError(true);
      return null;
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPayment();
    const interval = setInterval(fetchPayment, 10000);
    return () => clearInterval(interval);
  }, [fetchPayment]);

  if (loading) {
    return (
      <section className="px-5 pt-20 pb-20">
        <div className="max-w-lg mx-auto text-center">
          <p className="text-sm text-muted">Loading order...</p>
        </div>
      </section>
    );
  }

  if (error || !payment) {
    return (
      <section className="px-5 pt-20 pb-20">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <h1 className="font-script text-3xl text-text">Order Not Found</h1>
          <p className="text-sm text-muted">
            No order found with this ID. Check your link or contact us on Instagram.
          </p>
          <Link
            href="/"
            className="inline-block rounded-2xl bg-text px-8 py-3.5 text-background font-medium text-sm"
          >
            Home
          </Link>
        </div>
      </section>
    );
  }

  const confirmed = payment.status === "confirmed";

  return (
    <section className="px-5 pt-12 pb-20">
      <div className="max-w-lg mx-auto text-center space-y-6">
        <h1 className="font-script text-4xl text-text">Order Status</h1>
        <div className="w-8 h-[2px] bg-accent/30 mx-auto" />

        <div
          className={`rounded-2xl border p-8 ${
            confirmed
              ? "bg-green-50 border-green-200"
              : "bg-soft border-border"
          }`}
        >
          <div
            className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl ${
              confirmed
                ? "bg-green-100 text-green-600"
                : "bg-yellow-100 text-yellow-600"
            }`}
          >
            {confirmed ? "✓" : "⏳"}
          </div>

          <h2 className="font-script text-2xl text-text mt-4">
            {confirmed ? "Payment Confirmed!" : "Payment Pending"}
          </h2>

          <p className="text-sm text-muted mt-2 leading-relaxed">
            {confirmed
              ? "Your payment has been verified. Thank you for your order!"
              : "We're verifying your payment. This page refreshes automatically."}
          </p>

          <div className="bg-white rounded-xl p-4 mt-5 text-left space-y-1 text-sm text-muted">
            <p>
              <span className="text-text font-medium">Order ID:</span>{" "}
              {payment.id}
            </p>
            {Array.isArray(payment.products) && payment.products.length > 0 ? (
              <div>
                <span className="text-text font-medium">Products:</span>
                <div className="mt-1 space-y-1">
                  {payment.products.map((p, i) => (
                    <p key={i} className="pl-4">
                      {p.name} × {p.quantity} — ₹{p.price * p.quantity}
                    </p>
                  ))}
                </div>
              </div>
            ) : (
              <p>
                <span className="text-text font-medium">Product:</span>{" "}
                {payment.product_name}
              </p>
            )}
            <p>
              <span className="text-text font-medium">Amount:</span> ₹
              {payment.product_price}
            </p>
            <p>
              <span className="text-text font-medium">Shipping:</span> ₹
              {payment.shipping || 0}
            </p>
            {payment.razorpay_payment_id ? (
              <p>
                <span className="text-text font-medium">Payment ID:</span>{" "}
                {payment.razorpay_payment_id}
              </p>
            ) : payment.utr ? (
              <p>
                <span className="text-text font-medium">UTR:</span>{" "}
                {payment.utr}
              </p>
            ) : null}
            <p>
              <span className="text-text font-medium">Date:</span>{" "}
              {new Date(payment.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        {!confirmed && (
          <p className="text-xs text-muted/60 animate-pulse">
            Auto-checking for confirmation every 10s...
          </p>
        )}

        <Link
          href="/"
          className="inline-block w-full rounded-2xl bg-text py-4 text-background font-medium text-base text-center hover:opacity-90 transition-opacity"
        >
          Continue Shopping
        </Link>
      </div>
    </section>
  );
}
