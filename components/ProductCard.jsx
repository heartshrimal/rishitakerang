import Link from "next/link";
import AddToCartButton from "./AddToCartButton";

export default function ProductCard({ product }) {
  return (
    <div className="flex flex-col overflow-hidden rounded-3xl bg-soft border border-border active:scale-[0.98] transition-transform">
      <Link href={`/product/${product.id}`}>
        <div className="aspect-square bg-soft flex items-center justify-center">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        </div>
      </Link>

      <div className="p-5 flex flex-col flex-1">
        <span className="inline-block text-xs uppercase tracking-wider text-muted font-medium">
          {product.category}
        </span>

        <h3 className="font-display text-lg text-text mt-2">
          <Link href={`/product/${product.id}`}>{product.name}</Link>
        </h3>

        <div className="flex items-center gap-2 mt-auto pt-3">
          <span className="text-base font-semibold text-text shrink-0">
            ₹{product.price}
          </span>
          <AddToCartButton
            product={product}
            className="ml-auto text-xs font-medium px-3.5 py-2 rounded-2xl bg-text text-background hover:opacity-90 transition-opacity active:scale-[0.97]"
          />
        </div>
      </div>
    </div>
  );
}
