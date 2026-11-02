# Sparky Direct storefront

A redesign of the Sparky Direct store. Next.js 15, no database: the catalogue is `src/data/products.json`.

## Run it

```
npm install
npm run dev        # http://localhost:3000
npm run build      # production build
```

## Deploy (Vercel)

1. Push this repo and import it in Vercel. It detects Next.js with no extra config.
2. Set the environment variables from `.env.example`:
   - `NEXT_PUBLIC_SITE_URL`: the live address, for example `https://www.yourdomain.com.au`
   - `STRIPE_SECRET_KEY`: test key first, then the live key
3. Connect the domain in Vercel.

Without `STRIPE_SECRET_KEY` the site works, but checkout shows a message to order by phone.

## Where things live

| What | Where |
| --- | --- |
| Name, phone, address, shipping rates | `src/lib/site.ts` |
| Colours and layout | `src/app/globals.css` |
| Products | `src/data/products.json` (generated) |
| Product images and PDFs | `public/media/` (generated) |
| Video clips shown on the home page | `src/data/videos.json` |
| Raw scrape, tooling (never shipped) | `replica/` |

To regenerate products and media from the raw scrape: `python replica/scripts/build_site_data.py`.
