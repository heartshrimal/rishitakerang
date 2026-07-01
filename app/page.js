import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import { getAllProducts, getAllCategories } from "@/lib/store";

export const dynamic = "force-dynamic";

export default async function Home() {
  const [products, categories] = await Promise.all([
    getAllProducts(),
    getAllCategories(),
  ]);

  return (
    <>
      <Hero />
      <Categories categories={categories} />
      <FeaturedProducts products={products} />
    </>
  );
}
