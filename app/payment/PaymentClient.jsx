"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { useCart } from "@/lib/CartContext";

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

export default function PaymentClient({ product, isCart, isCustom }) {
  const router = useRouter();
  const { items: cartItems, subtotal: cartSubtotal, clearCart } = useCart();
  const [customProduct, setCustomProduct] = useState(null);

  useEffect(() => {
    if (isCustom) {
      try {
        const stored = sessionStorage.getItem("charm_build");
        if (stored) {
          setCustomProduct(JSON.parse(stored));
        }
      } catch {}
    }
  }, [isCustom]);

  const activeProduct = isCustom ? customProduct : product;
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [city, setCity] = useState("");
  const [state, setState] = useState("");
  const [pincode, setPincode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [razorpayReady, setRazorpayReady] = useState(false);

  const singleShipping = activeProduct?.name === "Test Product" || Number(activeProduct?.price) <= 1 ? 0 : SHIPPING;
  const cartShipping = cartItems.length === 0 ? 0 : cartSubtotal > 2000 ? 0 : SHIPPING;
  const freeShipping = isCart && cartItems.length > 0 && cartSubtotal > 2000;

  const shipping = isCart ? cartShipping : singleShipping;
  const subtotal = isCart ? cartSubtotal : Number(activeProduct?.price || 0);
  const total = subtotal + shipping;

  useEffect(() => {
    loadRazorpayScript().then(setRazorpayReady);
  }, []);

  async function handlePay() {
    if (!name.trim() || !phone.trim() || !email.trim() || !address.trim() || !city.trim() || !state.trim() || !pincode.trim()) {
      setError("Please fill in all fields");
      return;
    }
    setLoading(true);
    setError("");

    try {
      const body = isCart
        ? {
            cartItems: cartItems.map((i) => ({
              id: i.id,
              name: i.name,
              price: i.price,
              quantity: i.quantity,
              customizations: i.customizations || null,
            })),
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: `${address.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`,
          }
        : isCustom && customProduct
        ? {
            productName: customProduct.name,
            productPrice: customProduct.price,
            customizations: customProduct.customizations || null,
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: `${address.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`,
          }
        : {
            productId: product.id,
            productName: product.name,
            productPrice: product.price,
            name: name.trim(),
            phone: phone.trim(),
            email: email.trim(),
            address: `${address.trim()}, ${city.trim()}, ${state.trim()} - ${pincode.trim()}`,
          };

      const res = await fetch("/api/razorpay/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) throw new Error("Failed to create order");
      const data = await res.json();

      if (data.amount === 0) {
        if (isCart) clearCart();
        router.push(`/order/${data.id}`);
        return;
      }

      const options = {
        key: data.razorpayKeyId,
        amount: data.amount,
        currency: "INR",
        name: "Rishita Ke Rang",
        description: isCart ? `Cart (${cartItems.length} items)` : activeProduct?.name || "Custom Charm",
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
            if (isCart) clearCart();
            if (isCustom) sessionStorage.removeItem("charm_build");
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
            href={isCart ? "/cart" : isCustom ? "/build-charm" : `/product/${product.id}`}
            className="inline-block text-xs text-muted hover:text-text transition-colors mb-5 uppercase tracking-wider"
          >
            ← Back to {isCart ? "cart" : isCustom ? "charm builder" : "product"}
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

          {isCart ? (
            <div className="space-y-2">
              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center gap-3 rounded-2xl bg-soft border border-border p-3"
                >
                  {item.image && (
                    <div className="w-12 h-12 shrink-0 rounded-lg overflow-hidden bg-background">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-text line-clamp-1">
                      {item.name}
                    </p>
                    <p className="text-xs text-muted">
                      {item.quantity} × ₹{item.price}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-text shrink-0">
                    ₹{item.price * item.quantity}
                  </p>
                </div>
              ))}
            </div>
          ) : activeProduct ? (
            <>
              {activeProduct.image && (
                <div className="w-32 h-32 mx-auto rounded-2xl overflow-hidden bg-soft border border-border">
                  <img
                    src={activeProduct.image}
                    alt={activeProduct.name}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="text-center">
                <p className="text-sm text-muted uppercase tracking-wider">
                  {isCustom ? "Custom Charm" : activeProduct.category}
                </p>
                <p className="font-display text-xl text-text mt-1">
                  {activeProduct.name}
                </p>
                <p className="text-2xl font-semibold text-text mt-2">
                  ₹{activeProduct.price}
                </p>
              </div>

              {isCustom && customProduct?.customizations?.elements && (
                <div className="rounded-2xl bg-soft border border-border p-4 space-y-2">
                  <p className="text-xs font-semibold text-text uppercase tracking-wider text-center">
                    Your Elements
                  </p>
                  {customProduct.customizations.elements.map((el, i) => (
                    <div key={i} className="flex items-center justify-between text-sm text-muted">
                      <span>{el.name}</span>
                      <span>₹{el.price}</span>
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : null}

          <div className="rounded-2xl bg-soft border border-border p-6 space-y-3">
            <h2 className="text-sm font-semibold text-text uppercase tracking-wider text-center">
              Order Summary
            </h2>
            <div className="flex justify-between text-sm text-muted">
              <span>Subtotal{isCart ? ` (${cartItems.reduce((s, i) => s + i.quantity, 0)} items)` : ""}</span>
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
                Address
              </label>
              <textarea
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                placeholder="Street, locality, building"
                rows={2}
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all resize-none"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
                  City
                </label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="City"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
                  State
                </label>
                <input
                  type="text"
                  value={state}
                  onChange={(e) => setState(e.target.value)}
                  placeholder="State"
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-text uppercase tracking-wider mb-2">
                Pincode
              </label>
              <input
                type="text"
                value={pincode}
                onChange={(e) => setPincode(e.target.value)}
                placeholder="6-digit pincode"
                className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm text-text placeholder:text-muted/40 focus:outline-none focus:ring-2 focus:ring-accent/30 transition-all"
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
