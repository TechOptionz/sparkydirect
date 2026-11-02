// Every brand and business detail lives here, so a name change is one edit.
export const site = {
  name: "Sparky Direct",
  tagline: "Australia's #1 online electrical wholesaler",
  description:
    "Switches, lighting, cable, protection and tools from the brands the trade trusts. Flat-rate shipping Australia-wide and a 100-day money-back guarantee.",
  url: process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000",
  phone: "07 5428 3044",
  phoneHref: "tel:+61754283044",
  email: "support@sparkydirect.com.au" as string | null,
  address: "15 Alta Road, Caboolture QLD 4510",
  hours: "Monday to Friday, 7:00am to 3:00pm",
  since: 2005,
};

export const shipping = [
  { id: "standard", label: "Standard", cents: 1595, detail: "1 to 10 business days" },
  { id: "express", label: "Express", cents: 1995, detail: "1 to 3 business days" },
  { id: "vip", label: "VIP Express Premium", cents: 2495, detail: "1 to 3 business days" },
  { id: "pickup", label: "Click & Collect", cents: 0, detail: "Caboolture, QLD" },
] as const;

export const nav = [
  { href: "/products", label: "Shop all" },
  { href: "/category/switches-power", label: "Switches" },
  { href: "/category/lighting", label: "Lighting" },
  { href: "/category/protection-enclosures", label: "Protection" },
  { href: "/category/tools-test", label: "Tools" },
];

export const money = (cents: number) =>
  new Intl.NumberFormat("en-AU", { style: "currency", currency: "AUD" }).format(cents / 100);
