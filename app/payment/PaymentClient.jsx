"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";

function loadRazorpayScript() {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
}

const SHIPPING = 100;

export default function PaymentClient({ product }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);

  const total = Number(product.price) + SHIPPING;

  useEffect(() => {
    loadRazorpayScript().then(setRazorpayReady);
  }, []);

  async function handlePay() {
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productPrice: product.price,
          name: name.trim(),
          phone: phone.trim(),
          email: email.trim(),
          address: address.trim(),
        }),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: "INR",
        name: "Rishita Ke Rang",
        description: product.name,
        image: "/favicon.ico",
        order_id: data.razorpayOrderId,
        prefill: {
          name: name.trim(),
          email: email.trim(),
          contact: phone.trim(),
        },
        theme: { color: "#4d111f" },
        handler: async function (response) {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              paymentId: data.id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpayOrderId: response.razorpay_order_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });

          if (verifyRes.ok) {
            router.push(`/order/${data.id}`);
          } else {
            setError("Payment verification failed. Contact support.");
            setLoading(false);
          }
        },
        modal: {
          ondismiss: function () {
            setLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.on("payment.failed", function () {
        setError("Payment failed. Please try again.");
        setLoading(false);
      });
      rzp.open();
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  }

  return (
    <>
      <header className="px-5 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <Link
            href={`/product/${product.id}`}
            className="inline-block text-xs text-muted hover:text-text transition-colors mb-5 uppercase tracking-wider"
          >
            ← Back to product
          </Link>
        </div>
      </header>

      <section className="px-5 pb-20">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center">
            <h1 className="font-script text-4xl text-text mt-1 leading-tight">
              Checkout
            </h1>
            <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-3" />
          </div>

          {product.image && (
            <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-soft border border-border">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          )}

          <div className="text-center">
            <p className="text-sm text-muted uppercase tracking-wider">
              {product.category}
            </p>
            <p className="font-display text-xl text-text mt-1">
              {product.name}
            </p>
            <p className="text-2xl font-semibold text-text mt-2">
              ₹{product.price}
            </p>
          </div>

          <div className="rounded-2xl bg-soft border border-border p-6 space-y-3">
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider text-center">
              Order Summary
            </h2>
            <div className="flex justify-between text-sm text-muted">
              <span>Subtotal</span>
              <span>₹{product.price}</span>
            </div>
            <div className="flex justify-between text-sm text-muted">
              <span>Shipping</span>
              <span>₹{SHIPPING}</span>
            </div>
            <div className="border-t border-border pt-3 flex justify-between text-base font-semibold text-text">
              <span>Total</span>
              <span>₹{total}</span>
            </div>
          </div>

          <div className="rounded-2xl bg-soft border border-border p-6 space-y-4">
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider text-center">
              Your Details
            </h2>

            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
                Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Full name"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
                Phone Number
              </label>
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="10-digit number"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
                Delivery Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Full address with pincode"
                rows={3}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none"
              />
            </div>

            {error && (
              <p className="text-sm text-red-500 text-center">{error}</p>
            )}

            <button
              type="button"
              onClick={handlePay}
              disabled={loading || !razorpayReady}
              className="w-full rounded-2xl bg-text py-4 text-background font-medium text-base hover:opacity-90 transition-opacity active:scale-[0.98] disabled:opacity-50"
            >
              {loading ? "Please wait..." : `Pay ₹${total}`}
            </button>

            <p className="text-xs text-muted/60 text-center">
              Secure payments via Razorpay. UPI, Cards, Netbanking accepted.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
