"use client";

import { useEffect, useMemo, useState } from "react";
import type { ProductCardData } from "@/lib/catalog";
import { ProductCard } from "./ProductCard";

const SORTS: { id: Sort; label: string }[] = [
  { id: "featured", label: "Featured" },
  { id: "low", label: "Price ↑" },
  { id: "high", label: "Price ↓" },
];

type Sort = "featured" | "low" | "high";

export function ShopGrid({ products }: { products: ProductCardData[] }) {
  const [q, setQ] = useState("");
  const [sort, setSort] = useState<Sort>("featured");
  const [stockOnly, setStockOnly] = useState(false);
  const [brands, setBrands] = useState<string[]>([]);

  const brandList = useMemo(() => {
    const m = new Map<string, number>();
    products.forEach((p) => m.set(p.brand, (m.get(p.brand) ?? 0) + 1));
    return [...m.entries()].sort((a, b) => a[0].localeCompare(b[0]));
  }, [products]);
  const toggle = (b: string) => setBrands((cur) => (cur.includes(b) ? cur.filter((x) => x !== b) : [...cur, b]));

  useEffect(() => {
    setQ(new URLSearchParams(window.location.search).get("q") ?? "");
  }, []);

  const shown = useMemo(() => {
    const words = q.toLowerCase().split(/\s+/).filter(Boolean);
    const list = products.filter((p) => {
      if (stockOnly && !p.inStock) return false;
      if (brands.length && !brands.includes(p.brand)) return false;
      const hay = `${p.title} ${p.subtitle} ${p.brand} ${p.sku}`.toLowerCase();
      return words.every((w) => hay.includes(w));
    });
    if (sort === "low") list.sort((a, b) => a.priceCents - b.priceCents);
    if (sort === "high") list.sort((a, b) => b.priceCents - a.priceCents);
    return list;
  }, [products, q, sort, stockOnly, brands]);

  const showBrands = brandList.length > 1;
  const clear = () => {
    setQ("");
    setStockOnly(false);
    setBrands([]);
  };

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
        <div className="seg" role="group" aria-label="Sort products">
          {SORTS.map((o) => (
            <button key={o.id} aria-pressed={sort === o.id} className={sort === o.id ? "is-on" : ""} onClick={() => setSort(o.id)}>
              {o.label}
            </button>
          ))}
        </div>
      </div>
      {showBrands && (
        <div className="chips" aria-label="Filter by brand">
          <span className="chip chip-label">Filter</span>
          {brandList.map(([b]) => (
            <button key={b} className={`chip${brands.includes(b) ? " is-on" : ""}`} aria-pressed={brands.includes(b)} onClick={() => toggle(b)}>
              {b}
            </button>
          ))}
        </div>
      )}
      <div className="listing">
        {showBrands && (
          <aside className="sidebar" aria-label="Filters">
            <h2>Brand</h2>
            {brandList.map(([b, n]) => (
              <label key={b}>
                <input type="checkbox" checked={brands.includes(b)} onChange={() => toggle(b)} />
                <span className="box" aria-hidden />
                {b}
                <small>{n}</small>
              </label>
            ))}
            <h2>Availability</h2>
            <label>
              <input type="checkbox" checked={stockOnly} onChange={(e) => setStockOnly(e.target.checked)} />
              <span className="box" aria-hidden />
              In stock only
            </label>
          </aside>
        )}
        <div className="listing-main">
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
              <button className="btn btn-ghost" onClick={clear}>
                Clear filters
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
