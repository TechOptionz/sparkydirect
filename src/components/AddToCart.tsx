"use client";

import Link from "next/link";
import { useState } from "react";
import { useCart } from "./Cart";

export function AddToCart({ sku, inStock }: { sku: string; inStock: boolean }) {
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
        <button
          className="btn"
          onClick={() => {
            add(sku, qty);
            setAdded(true);
          }}
        >
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
    </div>
  );
}
