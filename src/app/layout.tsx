import type { Metadata } from "next";
import { Barlow, Barlow_Condensed } from "next/font/google";
import { CartProvider } from "@/components/Cart";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Shell } from "@/components/Shell";
import { categories } from "@/lib/catalog";
import { site } from "@/lib/site";
import "./globals.css";

const body = Barlow({ subsets: ["latin"], weight: ["400", "500", "700"], variable: "--font-body" });
const heading = Barlow_Condensed({ subsets: ["latin"], weight: ["600"], variable: "--font-heading" });

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.name} | ${site.tagline}`, template: `%s | ${site.name}` },
  description: site.description,
  openGraph: { siteName: site.name, type: "website", locale: "en_AU" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en-AU" className={`${body.variable} ${heading.variable}`}>
      <body>
        <CartProvider>
          <a href="#main" className="skip">
            Skip to content
          </a>
          <Shell>
            <Header categories={categories.map(({ slug, name }) => ({ slug, name }))} />
            <main id="main">{children}</main>
            <Footer />
          </Shell>
        </CartProvider>
      </body>
    </html>
  );
}
