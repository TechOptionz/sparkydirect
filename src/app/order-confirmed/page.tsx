import type { Metadata } from "next";
import Link from "next/link";
import { ClearCart } from "@/components/ClearCart";
import { site } from "@/lib/site";

export const metadata: Metadata = { title: "Order confirmed", robots: { index: false } };

export default function OrderConfirmed() {
  return (
    <div className="wrap page empty">
      <ClearCart />
      <h1>Thanks, your order is in.</h1>
      <p className="muted">
        A receipt is on its way to your email. Questions? Call us on <a href={site.phoneHref}>{site.phone}</a>.
      </p>
      <Link href="/products" className="btn">
        Keep shopping
      </Link>
    </div>
  );
}
