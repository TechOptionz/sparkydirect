"use client";

import Link from "next/link";
import { useState } from "react";
import type { ProductCardData } from "@/lib/catalog";
import { money, shipping, site } from "@/lib/site";
import { useCart } from "./Cart";

export function CartView({ products }: { products: ProductCardData[] }) {
  const { lines, setQty, ready } = useCart();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const rows = Object.entries(lines).flatMap(([sku, qty]) => {
    const p = products.find((x) => x.sku === sku);
    return p ? [{ p, qty }] : [];
  });
  const subtotal = rows.reduce((sum, r) => sum + r.p.priceCents * r.qty, 0);
  const blocked = rows.some((r) => !r.p.inStock);

  async function checkout() {
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error ?? "Checkout failed.");
      window.location.href = data.url;
    } catch (e) {
      setError(e instanceof Error ? e.message : "Checkout failed.");
      setBusy(false);
    }
  }

  if (!ready) return <p className="muted">Loading your cart…</p>;
  if (!rows.length) {
    return (
      <div className="empty">
        <h2>Your cart is empty.</h2>
        <Link href="/products" className="btn">
          Shop all products
        </Link>
      </div>
    );
  }

  return (
    <div className="cart">
      <ul className="cart-lines">
        {rows.map(({ p, qty }) => (
          <li key={p.sku}>
            <div className="tile cart-thumb">{p.image && <img src={p.image} alt="" />}</div>
            <div className="cart-info">
              <Link href={`/products/${p.slug}`}>{p.title}</Link>
              <p className="muted mono">{p.sku}</p>
              {!p.inStock && <p className="warn">Out of stock. Remove this item to check out.</p>}
              <button className="link-btn" onClick={() => setQty(p.sku, 0)}>
                Remove
              </button>
            </div>
            <label className="qty">
              <span className="sr-only">Quantity of {p.title}</span>
              <input
                type="number"
                min={1}
                max={99}
                value={qty}
                onChange={(e) => setQty(p.sku, Math.max(1, Number(e.target.value) || 1))}
              />
            </label>
            <p className="cart-total">{money(p.priceCents * qty)}</p>
          </li>
        ))}
      </ul>
      <aside className="summary">
        <h2>Summary</h2>
        <div className="summary-row">
          <span>Subtotal, inc. GST</span>
          <strong>{money(subtotal)}</strong>
        </div>
        <p className="muted">
          Delivery from {money(shipping[0].cents)}, or free Click &amp; Collect. You choose at checkout.
        </p>
        <button className="btn btn-full" onClick={checkout} disabled={busy || blocked}>
          {busy ? "Starting checkout…" : "Check out"}
        </button>
        {error && (
          <p className="warn" role="alert">
            {error} You can also order by phone on <a href={site.phoneHref}>{site.phone}</a>.
          </p>
        )}
      </aside>
    </div>
  );
}
