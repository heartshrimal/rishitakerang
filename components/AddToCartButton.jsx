"use client";

import { useCart } from "@/lib/CartContext";

export default function AddToCartButton({ product, className = "", children }) {
  const { addItem, isInCart } = useCart();
  const inCart = isInCart(product.id);

  return (
    <button
      type="button"
      onClick={() => addItem(product)}
      className={className}
    >
      {children || (inCart ? "+ Add More" : "+ Add to Cart")}
    </button>
  );
}
