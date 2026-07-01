import Link from "next/link";
import ImageGallery from "./ImageGallery";
import EnquireButton from "@/components/EnquireButton";
import { getProductById, getAllCategories } from "@/lib/store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return {};
  return {
    title: `${product.name} — Rishita Ke Rang`,
    description: product.description,
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = getProductById(id);
  if (!product) notFound();

  return (
    <>
      <header className="px-5 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <Link
            href={`/category/${product.slug}`}
            className="inline-block text-xs text-muted hover:text-text transition-colors mb-5 uppercase tracking-wider"
          >
            ← Back to {product.category}
          </Link>
        </div>
      </header>

      <ImageGallery images={product.images} name={product.name} />

      <section className="px-5 pb-20">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center">
            <span className="inline-block text-xs uppercase tracking-wider text-muted font-medium">
              {product.category}
            </span>
            <h1 className="font-script text-4xl text-text mt-1 leading-tight">
              {product.name}
            </h1>
            <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-3" />
            <p className="text-2xl font-semibold text-text mt-4">
              ₹{product.price}+
            </p>
          </div>

          <p className="text-sm text-muted leading-relaxed text-center max-w-sm mx-auto">
            {product.description}
          </p>

          <div className="space-y-3 pt-2">
            <h3 className="text-xs font-semibold text-text uppercase tracking-wider text-center">
              Details
            </h3>
            <ul className="space-y-2 max-w-xs mx-auto">
              {product.details?.map((detail, i) => (
                <li key={i} className="flex items-start gap-3 text-sm text-muted">
                  <span className="mt-0.5 w-1.5 h-1.5 rounded-full bg-accent shrink-0" />
                  {detail}
                </li>
              ))}
            </ul>
          </div>

          <EnquireButton
            product={product}
            className="w-full rounded-2xl bg-text py-4 text-background font-medium text-base hover:opacity-90 transition-opacity active:scale-[0.98] mt-6"
          />
        </div>
      </section>
    </>
  );
}
