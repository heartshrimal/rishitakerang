"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Check, Trash2, ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/CartContext";
import { CHARM_BASE_PRICE, CHARM_PLACEHOLDER_IMAGE } from "@/lib/charmConfig";

export default function BuildCharmPage() {
  const router = useRouter();
  const { addItem } = useCart();
  const [elements, setElements] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [selectedIds, setSelectedIds] = useState(new Set());
  const [view, setView] = useState("picker");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    Promise.all([
      fetch("/api/charm-elements").then((r) => r.json()),
      fetch("/api/charm-categories").then((r) => r.json()),
    ]).then(([elementsData, categoriesData]) => {
      if (Array.isArray(elementsData)) setElements(elementsData);
      if (Array.isArray(categoriesData)) setCategories(categoriesData);
    }).finally(() => setLoading(false));
  }, []);

  const selectedElements = useMemo(
    () => elements.filter((e) => selectedIds.has(e.id)),
    [elements, selectedIds]
  );

  const totalPrice = useMemo(
    () => CHARM_BASE_PRICE + selectedElements.reduce((sum, e) => sum + Number(e.price), 0),
    [selectedElements]
  );

  const filteredElements = useMemo(() => {
    if (activeCategory === "All") return elements;
    return elements.filter((e) => e.category === activeCategory);
  }, [elements, activeCategory]);

  const groupedElements = useMemo(() => {
    const map = new Map();
    filteredElements.forEach((e) => {
      if (!map.has(e.category)) map.set(e.category, []);
      map.get(e.category).push(e);
    });
    return Array.from(map.entries());
  }, [filteredElements]);

  function toggleElement(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function removeElement(id) {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }

  function handleAddToCart() {
    if (selectedElements.length === 0) return;
    setAdding(true);

    const charmName = `Custom Charm (${selectedElements.length} element${selectedElements.length !== 1 ? "s" : ""})`;
    const charmImage = selectedElements[0]?.image || CHARM_PLACEHOLDER_IMAGE;

    addItem(
      { name: charmName, price: totalPrice, image: charmImage, slug: "custom-charm" },
      1,
      { elements: selectedElements.map((e) => ({ id: e.id, name: e.name, price: Number(e.price), image: e.image })) }
    );

    setTimeout(() => {
      setAdding(false);
      router.push("/cart");
    }, 300);
  }

  function handleBuyNow() {
    if (selectedElements.length === 0) return;

    const charmName = `Custom Charm (${selectedElements.length} element${selectedElements.length !== 1 ? "s" : ""})`;
    const charmImage = selectedElements[0]?.image || CHARM_PLACEHOLDER_IMAGE;

    const charmData = {
      name: charmName,
      price: totalPrice,
      image: charmImage,
      customizations: {
        elements: selectedElements.map((e) => ({
          id: e.id,
          name: e.name,
          price: Number(e.price),
          image: e.image,
        })),
      },
    };

    sessionStorage.setItem("charm_build", JSON.stringify(charmData));
    router.push("/payment?custom=true");
  }

  if (loading) {
    return (
      <section className="px-5 pt-20 pb-20">
        <div className="max-w-lg mx-auto text-center space-y-6">
          <div className="w-20 h-20 rounded-full bg-soft flex items-center justify-center mx-auto animate-pulse">
            <ShoppingBag size={32} className="text-muted/40" />
          </div>
          <p className="text-sm text-muted">Loading elements...</p>
        </div>
      </section>
    );
  }

  if (view === "review") {
    return (
      <>
        <header className="px-5 pt-6 pb-4">
          <div className="max-w-lg mx-auto">
            <button
              onClick={() => setView("picker")}
              className="inline-block text-xs text-muted hover:text-text transition-colors mb-5 uppercase tracking-wider"
            >
              ← Back to Elements
            </button>
          </div>
        </header>

        <section className="px-5 pb-20">
          <div className="max-w-lg mx-auto space-y-6">
            <div className="text-center">
              <h1 className="font-script text-4xl text-text mt-1 leading-tight">
                Review Your Charm
              </h1>
              <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-3" />
            </div>

            {selectedElements.length === 0 ? (
              <div className="text-center space-y-4 py-8">
                <p className="text-sm text-muted">No elements selected.</p>
                <button
                  onClick={() => setView("picker")}
                  className="inline-block rounded-2xl bg-text px-8 py-3.5 text-background font-medium text-sm hover:opacity-90 transition-opacity"
                >
                  Pick Elements →
                </button>
              </div>
            ) : (
              <>
                <div className="space-y-2">
                  <div className="flex items-center justify-between px-1">
                    <p className="text-xs font-semibold text-text uppercase tracking-wider">
                      Selected Elements ({selectedElements.length})
                    </p>
                  </div>

                  {selectedElements.map((el) => (
                    <div
                      key={el.id}
                      className="flex items-center gap-3 rounded-2xl bg-soft border border-border p-3"
                    >
                      <div className="w-12 h-12 shrink-0 rounded-xl overflow-hidden bg-background">
                        {el.image ? (
                          <img src={el.image} alt={el.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-lg text-muted/40">
                            ✦
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-text line-clamp-1">{el.name}</p>
                        <p className="text-xs text-muted">{el.category}</p>
                      </div>
                      <p className="text-sm font-semibold text-text shrink-0">₹{el.price}</p>
                      <button
                        onClick={() => removeElement(el.id)}
                        className="ml-1 flex items-center justify-center w-7 h-7 rounded-lg text-red-400 hover:text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="rounded-2xl bg-soft border border-border p-6 space-y-3">
                  <h2 className="text-sm font-semibold text-text uppercase tracking-wider text-center">
                    Price Breakdown
                  </h2>
                  <div className="flex justify-between text-sm text-muted">
                    <span>Base Charm</span>
                    <span>₹{CHARM_BASE_PRICE}</span>
                  </div>
                  {selectedElements.map((el) => (
                    <div key={el.id} className="flex justify-between text-sm text-muted">
                      <span>{el.name}</span>
                      <span>₹{el.price}</span>
                    </div>
                  ))}
                  <div className="border-t border-border pt-3 flex justify-between text-base font-semibold text-text">
                    <span>Total</span>
                    <span>₹{totalPrice}</span>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={handleAddToCart}
                    disabled={adding}
                    className="w-full rounded-2xl border-2 border-accent/30 py-4 text-accent font-medium text-sm hover:bg-accent/5 transition-colors active:scale-[0.98] disabled:opacity-50"
                  >
                    {adding ? "Adding..." : "Add to Cart"}
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="w-full rounded-2xl bg-text py-4 text-background font-medium text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
                  >
                    Buy Now — ₹{totalPrice}
                  </button>
                </div>
              </>
            )}
          </div>
        </section>
      </>
    );
  }

  return (
    <>
      <header className="px-5 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <Link
            href="/"
            className="inline-block text-xs text-muted hover:text-text transition-colors mb-5 uppercase tracking-wider"
          >
            ← Back
          </Link>
        </div>
      </header>

      <section className="px-5 pb-32">
        <div className="max-w-lg mx-auto space-y-6">
          <div className="text-center">
            <h1 className="font-script text-4xl text-text mt-1 leading-tight">
              Build Your Charm
            </h1>
            <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-3" />
            <p className="text-sm text-muted mt-3">
              Pick the elements you want on your charm
            </p>
          </div>

          {categories.length > 0 && (
            <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1 -mx-1 px-1">
              <button
                onClick={() => setActiveCategory("All")}
                className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                  activeCategory === "All"
                    ? "bg-text text-background"
                    : "bg-soft text-muted border border-border hover:border-accent/30"
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.name)}
                  className={`shrink-0 rounded-full px-4 py-2 text-xs font-medium transition-colors ${
                    activeCategory === cat.name
                      ? "bg-text text-background"
                      : "bg-soft text-muted border border-border hover:border-accent/30"
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          )}

          {groupedElements.map(([cat, items]) => (
            <div key={cat} className="space-y-3">
              {activeCategory === "All" && (
                <p className="text-xs font-semibold text-text uppercase tracking-wider px-1">
                  {cat}
                </p>
              )}
              <div className="grid grid-cols-3 gap-3">
                {items.map((el) => {
                  const selected = selectedIds.has(el.id);
                  return (
                    <button
                      key={el.id}
                      onClick={() => toggleElement(el.id)}
                      className={`relative flex flex-col items-center rounded-2xl border-2 p-3 transition-all active:scale-[0.96] ${
                        selected
                          ? "border-accent bg-accent/5 shadow-sm"
                          : "border-border bg-soft hover:border-accent/30"
                      }`}
                    >
                      {selected && (
                        <span className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-accent flex items-center justify-center">
                          <Check size={12} className="text-white" />
                        </span>
                      )}
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-background mb-2">
                        {el.image ? (
                          <img src={el.image} alt={el.name} className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-xl text-muted/40">
                            ✦
                          </div>
                        )}
                      </div>
                      <p className="text-[11px] font-medium text-text text-center leading-tight line-clamp-2">
                        {el.name}
                      </p>
                      <p className="text-[10px] text-muted mt-0.5">₹{el.price}</p>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {selectedIds.size > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-40 bg-background/90 backdrop-blur-lg border-t border-border">
          <div className="max-w-lg mx-auto px-5 py-4 flex items-center gap-4">
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-text">
                {selectedIds.size} element{selectedIds.size !== 1 ? "s" : ""} selected
              </p>
              <p className="text-xs text-muted">₹{CHARM_BASE_PRICE} base + elements</p>
            </div>
            <p className="text-lg font-semibold text-text shrink-0">₹{totalPrice}</p>
            <button
              onClick={() => setView("review")}
              className="shrink-0 rounded-2xl bg-text px-6 py-3 text-background font-medium text-sm hover:opacity-90 transition-opacity active:scale-[0.98]"
            >
              Review
            </button>
          </div>
        </div>
      )}
    </>
  );
}
