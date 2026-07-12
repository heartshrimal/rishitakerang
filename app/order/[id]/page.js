"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useState, useEffect, useCallback } from "react";

const TRACKING_STEPS = [
  { key: "pending", label: "Order Placed", icon: "📋" },
  { key: "in_the_making", label: "In the Making", icon: "🎨" },
  { key: "shipped", label: "Shipped", icon: "📦" },
  { key: "delivered", label: "Delivered", icon: "🎉" },
];

const STATUS_INDEX = {
  pending: 0,
  in_the_making: 1,
  shipped: 2,
  delivered: 3,
};

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

  const isCancelled = payment.status === "cancelled";
  const currentIndex = STATUS_INDEX[payment.status] ?? 0;

  return (
    <section className="px-5 pt-12 pb-20">
      <div className="max-w-lg mx-auto text-center space-y-6">
        <h1 className="font-script text-4xl text-text">Order Tracking</h1>
        <div className="w-8 h-[2px] bg-accent/30 mx-auto" />

        <div
          className={`rounded-2xl border p-6 ${
            isCancelled
              ? "bg-red-50 border-red-200"
              : payment.status === "delivered"
              ? "bg-green-50 border-green-200"
              : "bg-soft border-border"
          }`}
        >
          {isCancelled ? (
            <div className="space-y-3">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl bg-red-100 text-red-600">
                ✕
              </div>
              <h2 className="font-script text-2xl text-text">Order Cancelled</h2>
              <p className="text-sm text-muted">This order has been cancelled.</p>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-6">
                {TRACKING_STEPS.map((step, i) => {
                  const reached = i <= currentIndex;
                  return (
                    <div key={step.key} className="flex flex-col items-center flex-1">
                      <div
                        className={`w-10 h-10 rounded-full flex items-center justify-center text-lg border-2 transition-all ${
                          reached
                            ? "bg-text border-text text-background"
                            : "bg-surface border-border text-muted/40"
                        }`}
                      >
                        {reached && i < currentIndex ? "✓" : step.icon}
                      </div>
                      <p
                        className={`text-[10px] mt-1.5 font-medium leading-tight text-center ${
                          reached ? "text-text" : "text-muted/40"
                        }`}
                      >
                        {step.label}
                      </p>
                      {i < TRACKING_STEPS.length - 1 && (
                        <div
                          className={`absolute h-[2px] w-full ${
                            i < currentIndex ? "bg-text" : "bg-border"
                          }`}
                          style={{ display: "none" }}
                        />
                      )}
                    </div>
                  );
                })}
              </div>

              <div className="flex items-center gap-1 mx-auto mb-4">
                {TRACKING_STEPS.map((step, i) => (
                  <div
                    key={step.key}
                    className={`h-1 flex-1 rounded-full transition-colors ${
                      i < currentIndex
                        ? "bg-text"
                        : i === currentIndex
                        ? "bg-text/40"
                        : "bg-border"
                    }`}
                  />
                ))}
              </div>

              <h2 className="font-script text-2xl text-text">
                {payment.status === "in_the_making"
                  ? "We're Making This For You!"
                  : payment.status === "shipped"
                  ? "Your Order is On Its Way!"
                  : payment.status === "delivered"
                  ? "Delivered!"
                  : "Payment Confirmed!"}
              </h2>
              <p className="text-sm text-muted mt-2 leading-relaxed">
                {payment.status === "in_the_making"
                  ? "Your handmade item is being crafted with care. We'll ship it soon!"
                  : payment.status === "shipped"
                  ? "Your order has been shipped. It should reach you soon!"
                  : payment.status === "delivered"
                  ? "Your order has been delivered. We hope you love it!"
                  : "Your payment has been verified and your order is confirmed."}
              </p>
            </>
          )}

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

        {payment.status !== "delivered" && payment.status !== "cancelled" && (
          <p className="text-xs text-muted/60 animate-pulse">
            Auto-refreshing every 10s...
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
