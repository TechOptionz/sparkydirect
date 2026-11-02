import { NextResponse } from "next/server";
import { bySku } from "@/lib/catalog";
import { shipping, site } from "@/lib/site";

const fail = (error: string, status: number) => NextResponse.json({ error }, { status });

/** Creates a Stripe Checkout session. Prices always come from the server's catalogue, never the browser. */
export async function POST(req: Request) {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return fail("Online checkout isn't switched on yet.", 503);

  let lines: unknown;
  try {
    lines = (await req.json()).lines;
  } catch {
    return fail("Invalid request.", 400);
  }
  if (!lines || typeof lines !== "object" || Array.isArray(lines)) return fail("Invalid request.", 400);
  const entries = Object.entries(lines as Record<string, unknown>);
  if (!entries.length) return fail("Your cart is empty.", 400);

  const form = new URLSearchParams({
    mode: "payment",
    success_url: `${site.url}/order-confirmed`,
    cancel_url: `${site.url}/cart`,
    "shipping_address_collection[allowed_countries][0]": "AU",
    "phone_number_collection[enabled]": "true",
  });

  for (const [i, [sku, qty]] of entries.entries()) {
    const p = bySku(sku);
    if (!p) return fail("An item in your cart is no longer available.", 400);
    if (!p.inStock) return fail(`${p.title} is out of stock.`, 409);
    if (!Number.isInteger(qty) || (qty as number) < 1 || (qty as number) > 99) return fail("Invalid quantity.", 400);
    form.set(`line_items[${i}][quantity]`, String(qty));
    form.set(`line_items[${i}][price_data][currency]`, "aud");
    form.set(`line_items[${i}][price_data][unit_amount]`, String(p.priceCents));
    form.set(`line_items[${i}][price_data][product_data][name]`, p.title);
    form.set(`line_items[${i}][price_data][product_data][metadata][sku]`, p.sku);
  }

  shipping.forEach((s, i) => {
    const prefix = `shipping_options[${i}][shipping_rate_data]`;
    form.set(`${prefix}[type]`, "fixed_amount");
    form.set(`${prefix}[display_name]`, `${s.label} (${s.detail})`);
    form.set(`${prefix}[fixed_amount][amount]`, String(s.cents));
    form.set(`${prefix}[fixed_amount][currency]`, "aud");
  });

  const res = await fetch("https://api.stripe.com/v1/checkout/sessions", {
    method: "POST",
    headers: { Authorization: `Bearer ${key}`, "Content-Type": "application/x-www-form-urlencoded" },
    body: form,
  });
  const data = await res.json();
  if (!res.ok) {
    console.error("Stripe checkout error", data?.error?.message);
    return fail("We couldn't start checkout.", 502);
  }
  return NextResponse.json({ url: data.url });
}
