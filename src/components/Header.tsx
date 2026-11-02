"use client";

import Link from "next/link";
import { nav } from "@/lib/site";
import { useCart } from "./Cart";
import { Logo } from "./Logo";

export function Header() {
  const { count } = useCart();
  return (
    <header className="header">
      <div className="wrap header-row">
        <Link href="/" className="logo-link" aria-label="Sparky Direct home">
          <Logo />
        </Link>
        <nav className="main-nav" aria-label="Main">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <form action="/products" className="header-search" role="search">
          <input name="q" type="search" placeholder="Search products or SKU" aria-label="Search products" />
        </form>
        <Link href="/cart" className="cart-link">
          Cart{count > 0 && <span className="cart-count">{count}</span>}
        </Link>
      </div>
    </header>
  );
}
