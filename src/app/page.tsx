import Link from "next/link";
import { Corners } from "@/components/Corners";
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
          <div className="hero-copy">
            <p className="eyebrow">Electrical wholesaler since {site.since}</p>
            <h1>{site.tagline}</h1>
            <p className="hero-sub">{site.description}</p>
            <div className="hero-cta">
              <Link href="/products" className="btn blueprint">
                <Corners />
                Shop all products
              </Link>
              <Link href="/contact" className="btn btn-ghost">
                Talk to us
              </Link>
            </div>
          </div>
          <div className="hero-art blueprint">
            <Corners />
            <div className="hero-art-top">
              <span>Trade supply</span>
              <span>Ships Australia-wide</span>
            </div>
            {heroImage && (
              <div className="hero-art-img">
                <img src={heroImage} alt="" />
              </div>
            )}
            <div className="hero-art-title">Everything the job needs</div>
          </div>
        </div>
      </section>

      <div className="facts-wrap">
        <section className="facts" aria-label="Why buy from us">
          <div>
            <strong>{money(shipping[0].cents)} flat-rate</strong>
            <span>Standard delivery, Australia-wide</span>
          </div>
          <div>
            <strong>100-day guarantee</strong>
            <span>Money back if it isn&apos;t right</span>
          </div>
          <div>
            <strong>Australian support</strong>
            <span>{site.hours}</span>
          </div>
          <div>
            <strong>Click &amp; Collect</strong>
            <span>Caboolture, QLD</span>
          </div>
        </section>
      </div>

      <section className="wrap section">
        <h2 className="section-title">Shop by category</h2>
        <div className="cats">
          {categories.map((c, i) => {
            const n = products.filter((p) => p.category === c.slug).length;
            return (
              <Link key={c.slug} href={`/category/${c.slug}`} className="cat blueprint">
                <Corners />
                <span className="cat-num">
                  {String(i + 1).padStart(2, "0")} · {n} {n === 1 ? "product" : "products"}
                </span>
                <h3>{c.name}</h3>
                <p>{c.blurb}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="wrap section">
        <div className="section-head">
          <h2 className="section-title">Featured products</h2>
          <Link href="/products">View all</Link>
        </div>
        <div className="grid">
          {featured.map((p) => (
            <ProductCard key={p.sku} product={p} />
          ))}
        </div>
      </section>

      <Videos />

      <section className="wrap section">
        <div className="about">
          <div>
            <p className="eyebrow">About {site.name}</p>
            <h2>Australia&apos;s trusted electrical wholesaler since {site.since}</h2>
            <p>
              Switches, lighting, protection, cable and tools from the brands the trade trusts. Flat-rate shipping, a
              100-day money-back guarantee and real people on the phone in Queensland.
            </p>
          </div>
          <div className="about-stats">
            <div>
              <strong>{products.length}</strong>
              <span>Products online</span>
            </div>
            <div>
              <strong>{categories.length}</strong>
              <span>Categories</span>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
