import type { Metadata } from "next";
import { money, shipping } from "@/lib/site";

export const metadata: Metadata = { title: "Shipping" };

export default function ShippingPage() {
  return (
    <div className="wrap page narrow prose-page">
      <h1>Shipping</h1>
      <p className="lead muted">Flat rates Australia-wide. Orders placed before midday AEST on a business day are handled the same or next business day.</p>
      <dl className="specs">
        {shipping.map((s) => (
          <div key={s.id}>
            <dt>
              {s.label} <span className="muted">· {s.detail}</span>
            </dt>
            <dd>{s.cents ? money(s.cents) : "Free"}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
