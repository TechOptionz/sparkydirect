import type { Metadata } from "next";
import { ShopGrid } from "@/components/ShopGrid";
import { cards } from "@/lib/catalog";

export const metadata: Metadata = { title: "Shop all products", alternates: { canonical: "/products" } };

export default function ProductsPage() {
  return (
    <div className="wrap page">
      <h1>Shop all products</h1>
      <ShopGrid products={cards} />
    </div>
  );
}
