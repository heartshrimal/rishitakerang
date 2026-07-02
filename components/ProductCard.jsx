import Link from "next/link";

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

        <div className="flex items-center justify-between mt-auto pt-3">
          <span className="text-base font-semibold text-text">
            ₹{product.price}+
          </span>
          <Link
            href={`/product/${product.id}`}
            className="text-sm font-medium text-accent hover:text-primary transition-colors"
          >
            Details →
          </Link>
        </div>
      </div>
    </div>
  );
}
