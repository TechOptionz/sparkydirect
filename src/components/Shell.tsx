"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCart } from "./Cart";

const svg = { width: 22, height: 22, viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: 1.5 } as const;

/** Wraps page content. Adds the mobile tab bar and the "added" toast, and sets spacing for sticky bars. */
export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  const { count, toast } = useCart();
  const mode = path.startsWith("/products/") ? "product" : path === "/cart" ? "cart" : path === "/order-confirmed" ? "bare" : "tabs";
  const tab = (active: boolean) => (active ? "tab is-active" : "tab");
  return (
    <div className={`shell shell-${mode}`}>
      {children}
      {toast && (
        <div className="toast" role="status">
          <svg {...svg} width={16} height={16} aria-hidden>
            <path d="M20 6 9 17l-5-5" />
          </svg>
          <span>{toast}</span>
          <Link href="/cart">View cart</Link>
        </div>
      )}
      {mode !== "product" && mode !== "bare" && (
        <nav className="tabs" aria-label="Quick navigation">
          <Link href="/" className={tab(path === "/")}>
            <svg {...svg} aria-hidden>
              <path d="M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z" />
            </svg>
            Home
          </Link>
          <Link href="/products" className={tab(path === "/products" || path.startsWith("/category"))}>
            <svg {...svg} aria-hidden>
              <rect x="3" y="3" width="7" height="7" />
              <rect x="14" y="3" width="7" height="7" />
              <rect x="3" y="14" width="7" height="7" />
              <rect x="14" y="14" width="7" height="7" />
            </svg>
            Shop
          </Link>
          <Link href="/contact" className={tab(path === "/contact")}>
            <svg {...svg} aria-hidden>
              <path d="M22 16.9v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3.1 19.5 19.5 0 0 1-6-6A19.8 19.8 0 0 1 2.1 4.2 2 2 0 0 1 4.1 2h3a2 2 0 0 1 2 1.7c.1 1 .4 1.9.7 2.8a2 2 0 0 1-.5 2.1L8 9.9a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.4c.9.3 1.8.6 2.8.7a2 2 0 0 1 1.7 2z" />
            </svg>
            Contact
          </Link>
          <Link href="/cart" className={tab(path === "/cart")}>
            <svg {...svg} aria-hidden>
              <circle cx="8" cy="21" r="1" />
              <circle cx="19" cy="21" r="1" />
              <path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12" />
            </svg>
            Cart · {count}
          </Link>
        </nav>
      )}
    </div>
  );
}
