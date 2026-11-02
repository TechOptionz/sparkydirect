"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

type Lines = Record<string, number>;
type CartValue = {
  lines: Lines;
  count: number;
  ready: boolean;
  add: (sku: string, qty?: number) => void;
  setQty: (sku: string, qty: number) => void;
  clear: () => void;
};

const KEY = "sparkydirect-cart";
const MAX_QTY = 99;
const CartContext = createContext<CartValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [lines, setLines] = useState<Lines>({});
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      setLines(JSON.parse(localStorage.getItem(KEY) ?? "{}"));
    } catch {
      setLines({});
    }
    setReady(true);
  }, []);

  useEffect(() => {
    if (ready) localStorage.setItem(KEY, JSON.stringify(lines));
  }, [lines, ready]);

  const setQty = useCallback((sku: string, qty: number) => {
    setLines((cur) => {
      const next = { ...cur };
      if (qty <= 0) delete next[sku];
      else next[sku] = Math.min(qty, MAX_QTY);
      return next;
    });
  }, []);

  const add = useCallback((sku: string, qty = 1) => {
    setLines((cur) => ({ ...cur, [sku]: Math.min((cur[sku] ?? 0) + qty, MAX_QTY) }));
  }, []);

  const clear = useCallback(() => setLines({}), []);

  const value = useMemo(
    () => ({ lines, ready, add, setQty, clear, count: Object.values(lines).reduce((a, b) => a + b, 0) }),
    [lines, ready, add, setQty, clear],
  );
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used inside CartProvider");
  return ctx;
}
