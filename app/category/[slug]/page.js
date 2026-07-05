import Link from "next/link";
import { getAllProducts, getAllCategories } from "@/lib/store";
import { notFound } from "next/navigation";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const categories = await getAllCategories();
  const category = categories.find((c) => c.slug === slug);
  if (!category) return {};
  return {
    title: `${category.name} — Rishita Ke Rang`,
    description: category.description,
  };
}

export default async function CategoryPage({ params }) {
  const { slug } = await params;
  const [categories, allProducts] = await Promise.all([
    getAllCategories(),
    getAllProducts(),
  ]);
  const category = categories.find((c) => c.slug === slug);
  if (!category) notFound();

  const categoryProducts = allProducts.filter((p) => p.slug === slug);

  return (
    <>
      <header className="px-5 pt-6 pb-6">
        <div className="max-w-lg mx-auto">
          <Link
            href="/"
            className="inline-block text-xs text-muted hover:text-text transition-colors mb-5 uppercase tracking-wider"
          >
            ← Back
          </Link>
          <div className="text-center">
            <span className="text-2xl text-accent/20 font-script leading-none">{category.icon}</span>
            <h1 className="font-script text-4xl text-text mt-1">
              {category.name}
            </h1>
            <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-3" />
            <p className="mt-3 text-sm text-muted">{category.description}</p>
          </div>
        </div>
      </header>

      <section className="px-5 pb-20">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          {categoryProducts.length > 0 ? (
            categoryProducts.map((product) => (
              <div
                key={product.id}
                className="flex flex-col overflow-hidden rounded-3xl bg-surface border border-border active:scale-[0.98] transition-transform"
              >
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
                  <Link href={`/product/${product.id}`}>
                    <h3 className="font-display text-lg text-text">
                      {product.name}
                    </h3>
                  </Link>
                  <p className="text-sm text-muted leading-relaxed mt-1 line-clamp-2">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <span className="text-base font-semibold text-text">
                      ₹{product.price}
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
            ))
          ) : (
            <p className="text-muted text-center py-12">
              Nothing here yet. New pieces coming soon!
            </p>
          )}
        </div>
      </section>
    </>
  );
}
