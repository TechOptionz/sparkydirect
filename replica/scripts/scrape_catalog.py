#!/usr/bin/env python3
"""Polite, resumable catalogue scraper for sparkydirect.com.au product pages.

One request at a time, with a delay between requests. Stops immediately on a
block response (403/429/503 or a Cloudflare challenge) rather than retrying.

Writes to replica/source/:
  products.jsonl   one product per line
  errors.jsonl     pages and media that failed
  media/assets/... media, mirroring the site's /assets paths

Usage:
  python replica/scripts/scrape_catalog.py URLS_FILE [--limit N] [--sample] [--no-media]
"""
import argparse
import html as htmllib
import json
import random
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from pathlib import Path

BASE = "https://www.sparkydirect.com.au"
UA = "Mozilla/5.0 (catalog migration for site redesign)"
DELAY = 1.5
ROOT = Path(__file__).resolve().parent.parent / "source"
BLOCK_CODES = {403, 429, 503}


class Blocked(Exception):
    pass


def fetch(url):
    time.sleep(DELAY)
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            return r.read()
    except urllib.error.HTTPError as e:
        if e.code in BLOCK_CODES:
            raise Blocked(f"HTTP {e.code} on {url}")
        raise


def section(h, start_pat, tag="section"):
    """Return inner HTML of the element opened by start_pat, balancing tag."""
    m = re.search(start_pat, h)
    if not m:
        return None
    depth, pos = 1, m.end()
    for t in re.finditer(rf"<(/?){tag}\b[^>]*>", h[pos:]):
        depth += -1 if t.group(1) else 1
        if depth == 0:
            return h[pos:pos + t.start()].strip()
    return None


def parse(url, h):
    ld = {}
    for block in re.findall(r"<script[^>]*application/ld\+json[^>]*>(.*?)</script>", h, re.S):
        try:
            d = json.loads(block)
        except ValueError:
            continue
        if isinstance(d, dict):
            ld[d.get("@type")] = d
    p = ld.get("Product")
    if not p:
        return None, []
    sku = p.get("sku", "")
    esc = re.escape(urllib.parse.quote(sku, safe="-_.")) + "|" + re.escape(sku)

    # Page body between the breadcrumb and reviews: excludes mega-menu and related items.
    a = h.find("BreadcrumbList")
    b = h.find('id="accordionReviews"', a)
    body = h[a:b if b > 0 else len(h)]

    crumb = re.search(r"BreadcrumbList\">(.*?)</(?:ol|ul)>", h, re.S)
    crumbs = re.findall(r'itemprop="name"[^>]*>([^<]+)', crumb.group(1)) if crumb else []
    desc = section(h, r'<section class="productdetails[^>]*>')
    specs = section(h, r'id="accordionSpecifications"[^>]*>', "div")

    media = set(re.findall(rf"/assets/(?:full|alt_\d+)/(?:{esc})\.\w+", h))
    media |= set(re.findall(rf"/assets/brochures/(?:{esc})\.\w+", h))
    media |= set(re.findall(r"/assets/files/[^\"'?\s<>]+\.(?:pdf|mp4|webm)", body))
    media = {m for m in media if not re.search(r"-s\.(?:mp4|webm)$", m)}
    youtube = sorted(set(re.findall(r"youtube\.com/(?:embed/|watch\?v=)([\w-]{11})", body)))

    offers = p.get("offers") or {}
    faq = [
        {"q": q.get("name"), "a": (q.get("acceptedAnswer") or {}).get("text")}
        for q in (ld.get("FAQPage") or {}).get("mainEntity", [])
    ]
    return {
        "url": url,
        "sku": sku,
        "name": htmllib.unescape(p.get("name", "")).strip(),
        "brand": (p.get("brand") or {}).get("name"),
        "gtin13": p.get("gtin13"),
        "mpn": p.get("mpn"),
        "breadcrumbs": [htmllib.unescape(c).strip() for c in crumbs[1:-1]],
        "google_category": p.get("category"),
        "offers": offers,
        "weight": p.get("weight"),
        "color": p.get("color"),
        "attributes": p.get("additionalProperty"),
        "description_html": desc,
        "specifications_html": specs,
        "faq": faq,
        "media": sorted(media),
        "youtube": youtube,
    }, sorted(media)


def save_media(path, stats, errors):
    # Only ever write inside catalog/media, whatever the page contained.
    dest = (ROOT / "media" / path.lstrip("/")).resolve()
    if not path.startswith("/assets/") or ".." in path or not dest.is_relative_to(ROOT / "media"):
        return
    if dest.exists():
        return
    try:
        data = fetch(BASE + urllib.parse.quote(path, safe="/%"))
    except urllib.error.HTTPError as e:
        errors.write(json.dumps({"media": path, "status": e.code}) + "\n")
        stats["media_missing"] += 1
        return
    except urllib.error.URLError as e:
        errors.write(json.dumps({"media": path, "error": str(e)}) + "\n")
        stats["media_missing"] += 1
        return
    dest.parent.mkdir(parents=True, exist_ok=True)
    tmp = dest.with_suffix(dest.suffix + ".part")
    tmp.write_bytes(data)
    tmp.replace(dest)
    stats["media_files"] += 1
    stats["media_bytes"] += len(data)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("urls")
    ap.add_argument("--limit", type=int)
    ap.add_argument("--sample", action="store_true", help="random sample (seeded)")
    ap.add_argument("--no-media", action="store_true")
    args = ap.parse_args()

    urls = [u.strip() for u in open(args.urls, encoding="utf8") if "/p/" in u]
    if args.sample:
        random.Random(7).shuffle(urls)
    ROOT.mkdir(exist_ok=True)
    out_path = ROOT / "products.jsonl"
    done = set()
    if out_path.exists():
        done = {json.loads(line)["url"] for line in open(out_path, encoding="utf8")}
    todo = [u for u in urls if u not in done][: args.limit]

    stats = dict(pages=0, not_product=0, page_errors=0, media_files=0, media_bytes=0, media_missing=0)
    started = time.time()
    with open(out_path, "a", encoding="utf8") as out, open(ROOT / "errors.jsonl", "a", encoding="utf8") as errors:
        try:
            for i, url in enumerate(todo, 1):
                try:
                    raw = fetch(url).decode("utf8", "replace")
                except (urllib.error.HTTPError, urllib.error.URLError, TimeoutError) as e:
                    errors.write(json.dumps({"url": url, "error": str(e)}) + "\n")
                    stats["page_errors"] += 1
                    continue
                if "Just a moment..." in raw[:3000] or "cf-chl" in raw[:3000]:
                    raise Blocked(f"Cloudflare challenge on {url}")
                product, media = parse(url, raw)
                if not product:
                    errors.write(json.dumps({"url": url, "error": "no Product JSON-LD"}) + "\n")
                    stats["not_product"] += 1
                    continue
                if not args.no_media:
                    for m in media:
                        save_media(m, stats, errors)
                # Written last, so an interrupted product is redone on resume.
                out.write(json.dumps(product, ensure_ascii=False) + "\n")
                out.flush()
                stats["pages"] += 1
                if i % 25 == 0:
                    print(f"{i}/{len(todo)} {stats} {time.time() - started:.0f}s", flush=True)
        except Blocked as e:
            print(f"STOPPED, site is blocking: {e}", file=sys.stderr)
            print(json.dumps(stats))
            return 2
    print("DONE", json.dumps(stats), f"{time.time() - started:.0f}s")
    return 0


if __name__ == "__main__":
    sys.exit(main())
