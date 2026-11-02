import Link from "next/link";
import type { ProductCardData } from "@/lib/catalog";
import { money } from "@/lib/site";
import { Corners } from "./Corners";

export function ProductCard({ product: p }: { product: ProductCardData }) {
  return (
    <Link href={`/products/${p.slug}`} className="card blueprint">
      <Corners />
      <div className="tile">
        {p.image && <img src={p.image} alt={p.title} loading="lazy" />}
        {!p.inStock && <span className="badge">Out of stock</span>}
      </div>
      <div className="card-body">
        <p className="card-brand">
          {p.brand} · {p.sku}
        </p>
        <h3>{p.title}</h3>
        <p className="card-price">
          {money(p.priceCents)}
          <small>inc. GST</small>
        </p>
      </div>
    </Link>
  );
}
