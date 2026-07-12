import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import { getAllProducts, getAllCategories } from "@/lib/store";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Rishita Ke Rang — Handmade Clay Charms, Earrings & Keychains",
  description:
    "Shop handmade polymer clay charms, keychains, earrings, mini frames & more at Rishita Ke Rang. Hand-sculpted, customisable, and made with love in India. Free shipping on orders above ₹499.",
  keywords: [
    "rishita ke rang",
    "rishitakerang",
    "handmade clay charms",
    "polymer clay earrings",
    "clay keychains india",
    "custom bag charm",
    "clay art online shop",
    "handmade gifts india",
  ],
  openGraph: {
    title: "Rishita Ke Rang — Handmade Clay Charms, Earrings & Keychains",
    description:
      "Shop handmade polymer clay charms, keychains, earrings & more. Hand-sculpted and made with love.",
    url: "https://rishitakerang.in",
  },
};

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
