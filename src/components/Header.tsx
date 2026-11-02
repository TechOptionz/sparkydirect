"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { money, nav, shipping, site } from "@/lib/site";
import { useCart } from "./Cart";
import { Logo } from "./Logo";

const icon = { width: 18, height: 18, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;

export function Header({ categories }: { categories: { slug: string; name: string }[] }) {
  const { count } = useCart();
  const path = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <div className="promo">
        {money(shipping[0].cents)} flat-rate shipping · 100-day money-back guarantee · Australian support
      </div>
      <header className="header">
        <div className="header-top">
          <div className="wrap">
            <span>{money(shipping[0].cents)} flat shipping</span>
            <span>100-day money-back guarantee</span>
            <span>Australian customer service</span>
            <a href={site.phoneHref}>
              {site.phone} · {site.hours}
            </a>
          </div>
        </div>
        <div className="wrap header-row">
          <button className="menu-btn" aria-label="Menu" aria-expanded={open} onClick={() => setOpen(true)}>
            <svg {...icon} width={20} height={20}>
              <path d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <Link href="/" className="logo-link" aria-label="Sparky Direct home">
            <Logo />
          </Link>
          <form action="/products" className="header-search" role="search">
            <svg {...icon} aria-hidden>
              <circle cx="11" cy="11" r="8" />
              <path d="m21 21-4.3-4.3" />
            </svg>
            <input name="q" type="search" placeholder="Search products, brands or SKU" aria-label="Search products" />
            <button type="submit" className="btn">
              Search
            </button>
          </form>
          <Link href="/cart" className="cart-link" aria-label={`Cart, ${count} items`}>
            <svg {...icon} width={20} height={20} aria-hidden>
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            <span className="cart-count">{count}</span>
          </Link>
        </div>
        <nav className="wrap main-nav" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href} aria-current={path === n.href ? "page" : undefined}>
              {n.label}
            </Link>
          ))}
        </nav>
      </header>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Shop menu">
          <div className="drawer-head">
            <span>Shop</span>
            <button className="menu-btn" style={{ display: "grid" }} aria-label="Close" onClick={() => setOpen(false)}>
              <svg {...icon} width={20} height={20}>
                <path d="M18 6 6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="drawer-actions">
            <Link href="/products" className="btn">
              Shop all
            </Link>
            <Link href="/contact" className="btn btn-ghost">
              Contact us
            </Link>
          </div>
          <div className="drawer-list">
            {categories.map((c, i) => (
              <Link key={c.slug} href={`/category/${c.slug}`}>
                <span className="cat-num">{String(i + 1).padStart(2, "0")}</span>
                <span className="name">{c.name}</span>
                <svg {...icon} width={16} height={16} aria-hidden>
                  <path d="m9 18 6-6-6-6" />
                </svg>
              </Link>
            ))}
          </div>
          <div className="drawer-foot">
            <a href={site.phoneHref}>
              <strong>{site.phone}</strong>
              <span>Australian customer service · {site.hours}</span>
            </a>
          </div>
        </div>
      )}
    </>
  );
}
