import Hero from "../components/Hero";
import Categories from "../components/Categories";
import FeaturedProducts from "../components/FeaturedProducts";
import { getAllProducts, getAllCategories } from "@/lib/store";
import CustomizeButton from "../components/EnquireButton";

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
      <section className="px-5 pt-10 pb-16 text-center space-y-4">
        <p className="font-script text-3xl text-text leading-snug">
          Have something different in mind?
        </p>
        <p className="text-sm text-muted max-w-xs mx-auto">
          Tell us your idea and we&apos;ll make it happen
        </p>
        <CustomizeButton
          className="mt-2 inline-block rounded-2xl bg-text px-10 py-4 text-background font-medium text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
          label="Let's Talk →"
        />
      </section>
    </>
  );
}
