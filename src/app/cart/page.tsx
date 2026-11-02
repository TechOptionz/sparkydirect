import type { Metadata } from "next";
import { CartView } from "@/components/CartView";
import { cards } from "@/lib/catalog";

export const metadata: Metadata = { title: "Cart", robots: { index: false } };

export default function CartPage() {
  return (
    <div className="wrap page">
      <h1>Your cart</h1>
      <CartView products={cards} />
    </div>
  );
}
