import type { MetadataRoute } from "next";
import { categories, products } from "@/lib/catalog";
import { site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const paths = [
    "",
    "/products",
    "/shipping",
    "/returns",
    "/contact",
    "/privacy",
    ...categories.map((c) => `/category/${c.slug}`),
    ...products.map((p) => `/products/${p.slug}`),
  ];
  return paths.map((p) => ({ url: site.url + p }));
}
