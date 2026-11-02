# Recon map

Original: the client's existing store (Maropost/Neto). Slice: web storefront. Client-commissioned redesign. Same name and logo.

## Screens

| ID | Screen | Route in the new build | Notes |
| --- | --- | --- | --- |
| S01 | Home | `/` | Original has promo strip, carousel, mega-menu, four product rows. Reduced to hero, facts, categories, featured. |
| S02 | Category | `/category/[slug]` | Original has about 20 top-level categories. Six here for the 25 pilot products. |
| S03 | All products and search | `/products` | Client-side search, in-stock filter, sort. |
| S04 | Product | `/products/[slug]` | Gallery, price inc/ex GST, stock, documents, specs, FAQs. |
| S05 | Cart | `/cart` | Empty, filled and out-of-stock states. |
| S06 | Checkout | Stripe hosted | Original: Visa, Mastercard, Amex, PayPal, direct deposit. |
| S07 | Order confirmed | `/order-confirmed` | |
| S08 | Info | `/shipping` `/returns` `/contact` `/privacy` | |

## Flows

- F01 Buy: S01 -> S02 or S03 -> S04 -> S05 -> S06 -> S07. Edge: out of stock, empty cart, checkout not configured.
- F02 Find by SKU: header search -> S03 -> S04.

## Not built (original has these)

Customer accounts, order history, reorder, invoices, wishlists, reviews, notify-me, custom engraving configurator,
promotions, gift thresholds, blog, FAQ centre, brand pages, location pages, stock sync, order management.

## Data source

25 randomly sampled products of 7,309 `/p/` URLs. Prices and stock are a snapshot from 2026-11-02.

## Size

M for parity with the catalogue and accounts. The current build is the storefront slice only.
