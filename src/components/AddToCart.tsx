"use client";

import Link from "next/link";
import { useState } from "react";
import { money } from "@/lib/site";
import { useCart } from "./Cart";
import { Corners } from "./Corners";

export function AddToCart({ sku, inStock, priceCents }: { sku: string; inStock: boolean; priceCents: number }) {
  const { add } = useCart();
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (!inStock) {
    return (
      <div className="buy">
        <button className="btn" disabled>
          Out of stock
        </button>
        <p className="muted">
          Need it sooner? <Link href="/contact">Ask us about availability.</Link>
        </p>
      </div>
    );
  }

  const addNow = () => {
    add(sku, qty);
    setAdded(true);
  };

  return (
    <div className="buy">
      <div className="buy-row">
        <label className="qty">
          <span className="sr-only">Quantity</span>
          <input
            type="number"
            min={1}
            max={99}
            value={qty}
            onChange={(e) => setQty(Math.min(99, Math.max(1, Number(e.target.value) || 1)))}
          />
        </label>
        <button className="btn blueprint" onClick={addNow}>
          <Corners />
          Add to cart
        </button>
      </div>
      <p className="added" role="status">
        {added && (
          <>
            Added. <Link href="/cart">View cart</Link>
          </>
        )}
      </p>
      <div className="stickybar">
        <div>
          <strong>{money(priceCents * qty)}</strong>
          <span>
            {qty} × {money(priceCents)}
          </span>
        </div>
        <button className="btn" onClick={addNow}>
          Add to cart
        </button>
      </div>
    </div>
  );
}
