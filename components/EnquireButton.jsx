"use client";

import { useState } from "react";

function Toast({ message, visible }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 px-5 py-3 rounded-2xl bg-text text-background text-sm font-medium shadow-lg transition-all duration-300 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4 pointer-events-none"
      }`}
    >
      {message}
    </div>
  );
}

export default function CustomizeButton({ product, label = "Customize", className = "" }) {
  const [toast, setToast] = useState(null);

  function handleClick() {
    const text = product
      ? `Hi! I'm interested in "${product.name}" (${product.category} - ₹${product.price}). Could you share more details?`
      : "Hi! I'd like to know more about your creations.";

    navigator.clipboard.writeText(text).catch(() => {});
    window.open("https://ig.me/m/rishita.ke.rang", "_blank");

    setToast("✓ Message copied — paste it in the DM");
    setTimeout(() => setToast(null), 4000);
  }

  return (
    <>
      <button type="button" onClick={handleClick} className={className}>
        {label}
      </button>
      <Toast message={toast} visible={!!toast} />
    </>
  );
}
