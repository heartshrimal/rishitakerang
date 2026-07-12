"use client";

import { useState, useEffect, useCallback } from "react";
import SearchBar from "@/components/SearchBar";
import FilterPanel from "@/components/FilterPanel";
import ProductCard from "@/components/ProductCard";

export default function ShopPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState({ min: 0, max: 2000 });
  const [debouncedPrice, setDebouncedPrice] = useState({ min: 0, max: 2000 });
  const [sort, setSort] = useState("default");

  useEffect(() => {
    const t = setTimeout(() => setDebouncedPrice(price), 500);
    return () => clearTimeout(t);
  }, [price]);

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories);
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("q", search);
    if (category) params.set("category", category);
    if (debouncedPrice.min > 0) params.set("minPrice", debouncedPrice.min);
    if (debouncedPrice.max < 2000) params.set("maxPrice", debouncedPrice.max);
    if (sort !== "default") params.set("sort", sort);

    try {
      const res = await fetch(`/api/products?${params.toString()}`);
      const data = await res.json();
      setProducts(data);
    } catch {
      setProducts([]);
    } finally {
      setLoading(false);
    }
  }, [search, category, debouncedPrice, sort]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const hasFilters = search || category || price.min > 0 || price.max < 2000 || sort !== "default";

  return (
    <section className="px-5 pt-6 pb-24">
      <div className="max-w-lg mx-auto space-y-5">
        <div className="text-center">
          <h1 className="font-script text-4xl text-text">Shop All</h1>
          <div className="w-8 h-[2px] bg-accent/30 mx-auto mt-3" />
        </div>

        <SearchBar value={search} onChange={setSearch} />

        <FilterPanel
          categories={categories}
          activeCategory={category}
          onCategoryChange={setCategory}
          activePrice={price}
          onPriceChange={setPrice}
          sortBy={sort}
          onSortChange={setSort}
        />

        {loading ? (
          <div className="grid grid-cols-2 gap-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex flex-col overflow-hidden rounded-3xl bg-soft border border-border animate-pulse">
                <div className="aspect-square bg-surface" />
                <div className="p-5 flex flex-col flex-1 space-y-3">
                  <div className="h-2.5 bg-text/15 rounded-full w-1/3" />
                  <div className="h-4 bg-text/15 rounded-full w-3/4" />
                  <div className="flex items-center justify-between mt-auto pt-3">
                    <div className="h-4 bg-text/15 rounded-full w-16" />
                    <div className="h-8 bg-text/15 rounded-2xl w-20" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 space-y-3">
            <p className="text-4xl">🔍</p>
            <p className="text-sm text-muted font-medium">No products found</p>
            <p className="text-xs text-muted/60">
              {hasFilters ? "Try adjusting your filters or search term" : "New items coming soon!"}
            </p>
            {hasFilters && (
              <button
                onClick={() => {
                  setSearch("");
                  setCategory("");
                  setPrice({ min: 0, max: 2000 });
                  setSort("default");
                }}
                className="text-xs text-accent font-medium hover:text-primary transition-colors"
              >
                Clear all filters
              </button>
            )}
          </div>
        ) : (
          <>
            <p className="text-xs text-muted">
              {products.length} {products.length === 1 ? "product" : "products"} found
            </p>
            <div className="grid grid-cols-2 gap-3">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
