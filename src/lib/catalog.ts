import data from "@/data/products.json";

export type Product = {
  sku: string;
  slug: string;
  title: string;
  subtitle: string;
  brand: string;
  category: string;
  priceCents: number;
  priceExGstCents: number;
  inStock: boolean;
  images: string[];
  docs: { label: string; href: string }[];
  specs: { name: string; value: string }[];
  descriptionHtml: string;
  faq: { q: string; a: string }[];
};

/** The fields the browser needs. Keeps long descriptions out of client bundles. */
export type ProductCardData = Pick<
  Product,
  "sku" | "slug" | "title" | "subtitle" | "brand" | "category" | "priceCents" | "inStock"
> & { image: string | null };

export const products = data as Product[];

export const categories = [
  { slug: "switches-power", name: "Switches & Power", blurb: "Switches, dimmers, covers and weatherproof gear." },
  { slug: "lighting", name: "Lighting", blurb: "Downlights, LED strip and emergency lighting." },
  { slug: "protection-enclosures", name: "Protection & Enclosures", blurb: "RCBOs, contactors, switchboards and enclosures." },
  { slug: "cable-conduit", name: "Cable & Conduit", blurb: "Data cable, duct and conduit fittings." },
  { slug: "tools-test", name: "Tools & Test", blurb: "Multimeters, drills and everyday hand tools." },
  { slug: "climate-appliance", name: "Climate & Appliance", blurb: "Split systems, chargers and appliance parts." },
];

export const toCard = (p: Product): ProductCardData => ({
  sku: p.sku,
  slug: p.slug,
  title: p.title,
  subtitle: p.subtitle,
  brand: p.brand,
  category: p.category,
  priceCents: p.priceCents,
  inStock: p.inStock,
  image: p.images[0] ?? null,
});

export const cards = products.map(toCard);
export const bySlug = (slug: string) => products.find((p) => p.slug === slug);
export const bySku = (sku: string) => products.find((p) => p.sku === sku);

const FEATURED = ["MTD81", "SMLD533-ZB", "LC1D25N7", "XF25WVMA", "WBSSV1-MW", "WIM2", "30767", "SWL600BTAM"];
export const featured = FEATURED.map((s) => bySku(s)).filter((p): p is Product => !!p).map(toCard);

export const related = (p: Product) =>
  products.filter((o) => o.category === p.category && o.sku !== p.sku && o.inStock).slice(0, 4).map(toCard);
