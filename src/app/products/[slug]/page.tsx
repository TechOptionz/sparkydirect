import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { AddToCart } from "@/components/AddToCart";
import { Gallery } from "@/components/Gallery";
import { ProductCard } from "@/components/ProductCard";
import { bySlug, categories, products, related } from "@/lib/catalog";
import { money, shipping, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => products.map((p) => ({ slug: p.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) return {};
  return {
    title: `${p.title} (${p.sku})`,
    description: [p.subtitle, `${p.brand} ${p.sku}`, "Flat-rate shipping and a 100-day guarantee."].filter(Boolean).join(". "),
    alternates: { canonical: `/products/${slug}` },
    openGraph: { images: p.images.slice(0, 1) },
  };
}

export default async function ProductPage({ params }: Props) {
  const { slug } = await params;
  const p = bySlug(slug);
  if (!p) notFound();
  const cat = categories.find((c) => c.slug === p.category);
  const also = related(p);
  const ld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: p.title,
    sku: p.sku,
    brand: { "@type": "Brand", name: p.brand },
    image: p.images.map((i) => site.url + i),
    offers: {
      "@type": "Offer",
      priceCurrency: "AUD",
      price: (p.priceCents / 100).toFixed(2),
      availability: `https://schema.org/${p.inStock ? "InStock" : "OutOfStock"}`,
      url: `${site.url}/products/${p.slug}`,
    },
  };

  return (
    <div className="wrap page">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(ld).replace(/</g, "\\u003c") }} />
      <nav className="crumbs" aria-label="Breadcrumb">
        <Link href="/">Home</Link>
        <span>/</span>
        {cat && (
          <>
            <Link href={`/category/${cat.slug}`}>{cat.name}</Link>
            <span>/</span>
          </>
        )}
        <span style={{ color: "var(--color-text)" }}>{p.sku}</span>
      </nav>
      <div className="pdp">
        <Gallery images={p.images} alt={p.title} />
        <div className="pdp-info">
          <div>
            <p className="eyebrow">
              {p.brand} · {p.sku}
            </p>
            <h1>{p.title}</h1>
            {p.subtitle && <p className="muted lead">{p.subtitle}</p>}
          </div>
          <div className="price-block">
            <p className="price">{money(p.priceCents)}</p>
            <p className="price-sub">inc. GST · {money(p.priceExGstCents)} ex. GST</p>
          </div>
          <p className={`stock ${p.inStock ? "stock-in" : "warn"}`}>{p.inStock ? "In stock" : "Out of stock"}</p>
          <AddToCart sku={p.sku} inStock={p.inStock} priceCents={p.priceCents} />
          <ul className="assure">
            <li>
              {money(shipping[0].cents)} flat-rate delivery, or free Click &amp; Collect
            </li>
            <li>100-day money-back guarantee</li>
          </ul>
          {p.docs.length > 0 && (
            <div className="docs">
              <h2>Documents</h2>
              {p.docs.map((d) => (
                <a key={d.href} href={d.href} target="_blank" rel="noreferrer">
                  {d.label} (PDF)
                </a>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="details">
        <section>
          <h2>Description</h2>
          <div className="prose" dangerouslySetInnerHTML={{ __html: p.descriptionHtml }} />
        </section>
        <section>
          <h2>Specifications</h2>
          <dl className="specs">
            {p.specs.map((s) => (
              <div key={s.name}>
                <dt>{s.name}</dt>
                <dd>{s.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      </div>

      {p.faq.length > 0 && (
        <section className="section faq">
          <h2 className="section-title">Questions</h2>
          {p.faq.map((f) => (
            <details key={f.q}>
              <summary>{f.q}</summary>
              <div className="prose" dangerouslySetInnerHTML={{ __html: f.a }} />
            </details>
          ))}
        </section>
      )}

      {also.length > 0 && (
        <section className="section">
          <h2 className="section-title">You may also need</h2>
          <div className="grid">
            {also.map((r) => (
              <ProductCard key={r.sku} product={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
