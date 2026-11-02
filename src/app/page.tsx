import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";
import { Videos } from "@/components/Videos";
import { bySku, categories, featured, products } from "@/lib/catalog";
import { money, shipping, site } from "@/lib/site";

const heroImage = bySku("LC1D25N7")?.images[0];

export default function Home() {
  return (
    <>
      <section className="hero">
        <div className="wrap hero-grid">
          <div>
            <p className="eyebrow">Electrical wholesale since {site.since}</p>
            <h1>Everything the job needs. Nothing it doesn&apos;t.</h1>
            <p className="hero-sub">{site.description}</p>
            <div className="hero-cta">
              <Link href="/products" className="btn btn-signal">
                Shop all products
              </Link>
              <Link href="/contact" className="btn btn-outline">
                Talk to us
              </Link>
            </div>
          </div>
          {heroImage && (
            <div className="hero-art">
              <img src={heroImage} alt="" />
            </div>
          )}
        </div>
      </section>

      <section className="wrap facts" aria-label="Why buy from us">
        <div>
          <strong>{money(shipping[0].cents)} flat-rate shipping</strong>
          <span className="muted">Standard delivery, Australia-wide</span>
        </div>
        <div>
          <strong>100-day money-back guarantee</strong>
          <span className="muted">Return it within 100 days for a refund</span>
        </div>
        <div>
          <strong>Australian support</strong>
          <span className="muted">{site.hours}</span>
        </div>
      </section>

      <section className="wrap section">
        <h2 className="section-title">Shop by category</h2>
        <div className="cats">
          {categories.map((c) => {
            const n = products.filter((p) => p.category === c.slug).length;
            return (
              <Link key={c.slug} href={`/category/${c.slug}`} className="cat">
                <h3>{c.name}</h3>
                <p className="muted">{c.blurb}</p>
                <span className="mono muted">
                  {n} {n === 1 ? "product" : "products"} →
                </span>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2 className="section-title">Featured</h2>
          <Link href="/products">View all</Link>
        </div>
        <div className="grid">
          {featured.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </section>

      <Videos />
    </>
  );
}
