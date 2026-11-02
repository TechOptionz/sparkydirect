import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ShopGrid } from "@/components/ShopGrid";
import { cards, categories } from "@/lib/catalog";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;
export const generateStaticParams = () => categories.map((c) => ({ slug: c.slug }));

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  return c ? { title: c.name, description: c.blurb, alternates: { canonical: `/category/${slug}` } } : {};
}

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params;
  const c = categories.find((x) => x.slug === slug);
  if (!c) notFound();
  return (
    <div className="wrap page">
      <h1>{c.name}</h1>
      <p className="muted lead">{c.blurb}</p>
      <ShopGrid products={cards.filter((p) => p.category === slug)} />
    </div>
  );
}
