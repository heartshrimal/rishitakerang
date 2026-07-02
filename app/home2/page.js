import ProductShowcase from "@/components/ProductShowcase";
import { getAllProducts } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Collection — Rishita Ke Rang",
  description:
    "Scroll through the handcrafted collection. Each piece tells a story.",
};

export default async function Home2() {
  const products = await getAllProducts();

  return (
    <main>
      <ProductShowcase products={products} />
    </main>
  );
}
