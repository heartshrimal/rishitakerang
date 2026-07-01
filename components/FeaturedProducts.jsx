import ProductCard from "./ProductCard";

export default function FeaturedProducts({ products }) {
  const featured = products.filter((p) => p.featured);

  if (featured.length === 0) return null;

  return (
    <section className="px-5 pb-24">
      <div className="max-w-lg mx-auto">
        <div className="text-center mb-8">
          <span className="text-2xl text-accent/20 font-script leading-none">✦</span>
          <h2 className="font-script text-4xl text-text mt-1">
            Featured Creations
          </h2>
          <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-3" />
        </div>

        <div className="grid grid-cols-2 gap-3">
          {featured.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
}
