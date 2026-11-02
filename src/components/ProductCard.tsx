import Link from "next/link";
import type { ProductCardData } from "@/lib/catalog";
import { money } from "@/lib/site";

export function ProductCard({ product: p }: { product: ProductCardData }) {
  return (
    <Link href={`/products/${p.slug}`} className="card">
      <div className="tile">
        {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
        {!p.inStock && <span className="badge">Out of stock</span>}
      </div>
      <p className="card-brand">{p.brand}</p>
      <h3>{p.title}</h3>
      <p className="card-price">{money(p.priceCents)}</p>
    </Link>
  );
}
