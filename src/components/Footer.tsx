import Link from "next/link";
import { categories } from "@/lib/catalog";
import { site } from "@/lib/site";
import { Logo } from "./Logo";

export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap footer-grid">
        <div>
          <Logo />
          <p className="muted footer-tag">{site.tagline}</p>
        </div>
        <div>
          <h2>Shop</h2>
          {categories.map((c) => (
            <Link key={c.slug} href={`/category/${c.slug}`}>
              {c.name}
            </Link>
          ))}
        </div>
        <div>
          <h2>Help</h2>
          <Link href="/shipping">Shipping</Link>
          <Link href="/returns">Returns</Link>
          <Link href="/contact">Contact</Link>
          <Link href="/privacy">Privacy</Link>
        </div>
        <div>
          <h2>Talk to us</h2>
          <a href={site.phoneHref}>{site.phone}</a>
          {site.email && <a href={`mailto:${site.email}`}>{site.email}</a>}
          <p className="muted">{site.hours}</p>
          <p className="muted">{site.address}</p>
        </div>
      </div>
      <div className="wrap footer-base muted">
        © {new Date().getFullYear()} {site.name}. All prices in AUD and include GST.
      </div>
    </footer>
  );
}
