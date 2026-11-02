"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductCardData } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

type Sort = "featured" | "low" | "high";

export function ShopGrid({ products }: { products: ProductCardData[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [stockOnly, setStockOnly] = useState(false);

  useEffect(() => {
    setQ(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = products.filter((p) => {
      if (stockOnly && !p.inStock) return false;
      const hay = `${p.title} ${p.subtitle} ${p.brand} ${p.sku}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    if (sort === "low") list.sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "high") list.sort((a, b) => b.priceCents - a.priceCents);
    return list;
  }, [products, q, sort, stockOnly]);

  return (
    <>
      <div className="filters">
        <input
          type="search"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Filter by name, brand or SKU"
          aria-label="Filter products"
        />
        <label className="check">
          <input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)} />
          In stock only
        </label>
        <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} aria-label="Sort products">
          <option value="featured">Featured</option>
          <option value="low">Price: low to high</option>
          <option value="high">Price: high to low</option>
        </select>
      </div>
      <p className="muted result-count" aria-live="polite">
        {shown.length} {shown.length === 1 ? "product" : "products"}
      </p>
      {shown.length ? (
        <div className="grid">
          {shown.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      ) : (
        <div className="empty">
          <h2>Nothing matches that.</h2>
          <p className="muted">Try a broader search, or clear your filters.</p>
          <button
            className="btn btn-ghost"
            onClick={() => {
              setQ("");
              setStockOnly(false);
            }}
          >
            Clear filters
          </button>
        </div>
      )}
    </>
  );
}
