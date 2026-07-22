import Link from "next/link";
import { getProductById } from "@/lib/store";
import PaymentClient from "./PaymentClient";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Checkout — Rishita Ke Rang",
};

export default async function PaymentPage({ searchParams }) {
  const { id, name, price, cart, custom } = await searchParams;

  if (cart === "true") {
    return <PaymentClient isCart />;
  }

  if (custom === "true") {
    return <PaymentClient isCustom />;
  }

  let product;
  if (id) {
    product = await getProductById(id);
  }

  if (!product && name && price) {
    product = {
      id: id || null,
      name,
      price: Number(price),
      category: "",
      image: null,
    };
  }

  if (!product) {
    return (
      <section className="px-5 pt-20 pb-20">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <h1 className="font-script text-4xl text-text">Checkout</h1>
          <div className="w-8 h-[2px] bg-accent/30 mx-auto" />
          <p className="text-sm text-muted">
            Select a product first to start checkout.
          </p>
          <Link
            href="/"
            className="inline-block rounded-2xl bg-text px-8 py-3.5 text-background font-medium text-sm hover:opacity-90 transition-opacity"
          >
            Browse Products →
          </Link>
        </div>
      </section>
    );
  }

  return <PaymentClient product={product} />;
}
