#!/usr/bin/env python3
"""Turn the raw scrape into rebranded site data and public media. Re-runnable.

Input:  replica/source/products.jsonl, replica/source/media/
Output: src/data/products.json, public/media/{products,docs,videos}/
"""
import hashlib
import html
import json
import re
import shutil
import time
import urllib.parse
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent.parent
SRC = ROOT / "replica/source"
PUB = ROOT / "public/media"
BRAND = "Sparky Direct"
OLD_BASE = "https://www.sparkydirect.com.au"

CATEGORY = {
    "switches-power": ["HNS610DSDK", "4061PBLHB", "S40RD-SV", "PUSWV4G66", "WBSSV1-MW", "SD-Lamp-VW",
                       "40TWSA-PT", "P3042C-XW", "E3041-45C-AW", "SWL600BTAM"],
    "protection-enclosures": ["30767", "MX9R3210S", "NLS0303021", "LC1D25N7"],
    "lighting": ["20290", "20405", "SMLD533-ZB"],
    "cable-conduit": ["WD2560", "263-20-GY", "UTPL6BL305RBBW"],
    "tools-test": ["MTD81", "9STSFM6-36S"],
    "climate-appliance": ["WIM2", "XF25WVMA", "BPC121542012"],
}
CAT_OF = {s: c for c, skus in CATEGORY.items() for s in skus}
VIDEOS = ["custom-dollys", "custom-power-points", "OL60640-1200", "pic2020",
          "bordo-5330-1-4qc-carabiner-hook-with-5-x-1-4-quick-change-hex-holders",
          "harrys-hat-hhv001-10buy-mechanical-cable-protection-hat-10-bundle"]
ALLOWED = {"p", "ul", "ol", "li", "strong", "em", "b", "i", "h2", "h3", "h4", "table", "thead", "tbody",
           "tr", "td", "th", "br", "a"}
VOID = {"br"}


def rebrand(text):
    return re.sub(r"(?i)sparky\s*direct", BRAND, text)


class Clean(HTMLParser):
    """Allowlist tags, drop attributes, keep links only to products on this site."""

    def __init__(self, slug_by_tail):
        super().__init__(convert_charrefs=False)
        self.out, self.slugs, self.skip, self.a_open = [], slug_by_tail, 0, []

    def handle_starttag(self, tag, attrs):
        if tag in ("script", "style", "iframe"):
            self.skip += 1
        elif tag == "a":
            href = dict(attrs).get("href") or ""
            tail = href.split("?")[0].rstrip("/").rsplit("/", 1)[-1].lower()
            slug = self.slugs.get(tail) if "/p/" in href else None
            self.a_open.append(bool(slug))
            if slug and not self.skip:
                self.out.append(f'<a href="/products/{slug}">')
        elif tag in ALLOWED and not self.skip:
            self.out.append(f"<{tag}>")

    def handle_endtag(self, tag):
        if tag in ("script", "style", "iframe"):
            self.skip = max(0, self.skip - 1)
        elif tag == "a":
            if self.a_open and self.a_open.pop() and not self.skip:
                self.out.append("</a>")
        elif tag in ALLOWED and tag not in VOID and not self.skip:
            self.out.append(f"</{tag}>")

    def handle_data(self, d):
        if not self.skip:
            self.out.append(d)

    def handle_entityref(self, n):
        self.handle_data(f"&{n};")

    def handle_charref(self, n):
        self.handle_data(f"&#{n};")


def clean_html(h, slugs):
    c = Clean(slugs)
    c.feed(h or "")
    out = "".join(c.out)
    out = re.sub(r"\s*<h2>.*?</h2>", "", out, count=1, flags=re.S)  # repeats the page title
    out = re.sub(r"<p>\s*(&nbsp;|\s)*\s*</p>", "", out)
    out = re.sub(r"^\s*<p>\s*<strong>\s*Description:?\s*</strong>\s*</p>", "", out)
    return rebrand(out).strip()


def titles(name, sku):
    parts = [p.strip() for p in html.unescape(name).split("|")]
    parts = [p for p in parts if p and p.lower() != sku.lower() and p.lower() != "single buy"]
    return re.sub(r"\s+", " ", parts[0]), " · ".join(re.sub(r"\s+", " ", p) for p in parts[1:])


def download(path, dest):
    if dest.exists():
        return True
    time.sleep(1.5)
    req = urllib.request.Request(OLD_BASE + urllib.parse.quote(path, safe="/%"), headers={"User-Agent": "Mozilla/5.0"})
    try:
        with urllib.request.urlopen(req, timeout=120) as r:
            data = r.read()
    except Exception as e:
        print("  missing", path, e)
        return False
    dest.parent.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return True


def clean_filename(p):
    name = urllib.parse.unquote(p.rsplit("/", 1)[-1])
    return re.sub(r"[^A-Za-z0-9.\-]+", "-", name).strip("-").lower()


def image_order(m):
    k = m.split("/")[2]
    return 0 if k == "full" else int(k[4:])


def main():
    raw = [json.loads(l) for l in open(SRC / "products.jsonl", encoding="utf8")]
    slugs = {r["url"].rsplit("/", 1)[-1].lower(): r["url"].rsplit("/", 1)[-1].lower() for r in raw}
    if PUB.exists():
        shutil.rmtree(PUB)
    products = []
    for r in raw:
        sku, slug = r["sku"], r["url"].rsplit("/", 1)[-1].lower()
        safe_sku = re.sub(r"[^a-z0-9-]+", "-", sku.lower())

        images, seen = [], set()
        for m in sorted((m for m in r["media"] if re.match(r"/assets/(full|alt_\d+)/", m)), key=image_order):
            f = SRC / "media" / m.lstrip("/")
            if not f.exists():
                continue
            h = hashlib.md5(f.read_bytes()).hexdigest()
            if h in seen:
                continue
            seen.add(h)
            dest = PUB / "products" / safe_sku / f"{len(images) + 1}{f.suffix.lower()}"
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(f, dest)
            images.append(f"/media/products/{safe_sku}/{dest.name}")

        # Document labels come from the original page's links.
        docs, doc_seen = [], set()
        all_html = (r.get("description_html") or "") + (r.get("specifications_html") or "")
        for href, label in re.findall(r'<a [^>]*href="(/assets/[^"]+?\.pdf)[^"]*"[^>]*>\s*(.*?)\s*</a>', all_html, re.S):
            if href in doc_seen:
                continue
            doc_seen.add(href)
            src = SRC / "media" / urllib.parse.quote(href, safe="/%").lstrip("/")
            if not src.exists() and not download(href, src):
                continue
            name = clean_filename(href)
            dest = PUB / "docs" / name
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dest)
            label = re.sub(r"(?i)^view\s+", "", re.sub(r"<[^>]+>", "", label)).strip() or "Document"
            docs.append({"label": rebrand(label), "href": f"/media/docs/{name}"})

        specs = [{"name": "Brand", "value": r["brand"]}, {"name": "SKU", "value": sku}]
        if r.get("mpn") and r["mpn"] != sku:
            specs.append({"name": "Manufacturer part no.", "value": r["mpn"]})
        if r.get("gtin13"):
            specs.append({"name": "Barcode", "value": r["gtin13"]})
        for a in r.get("attributes") or []:
            v = a.get("value")
            # Package dimensions are skipped: the source unit codes are unreliable.
            if a.get("name", "").startswith("Package") or isinstance(v, dict) or a.get("name") == "Brand":
                continue
            if v not in (None, ""):
                specs.append({"name": a["name"], "value": rebrand(html.unescape(str(v)))})
        if (r.get("weight") or {}).get("value"):
            specs.append({"name": "Package weight", "value": f'{r["weight"]["value"]} kg'})

        brand = BRAND if "sparky" in r["brand"].lower() else html.unescape(r["brand"])
        brand = "National Light Sources" if brand == "NATIONAL LIGHT SOURCES" else brand
        specs[0]["value"] = brand
        title, subtitle = titles(rebrand(r["name"]), sku)
        cents = round(float(r["offers"]["price"]) * 100)
        products.append({
            "sku": sku, "slug": slug, "title": title, "subtitle": subtitle, "brand": brand,
            "category": CAT_OF[sku], "priceCents": cents, "priceExGstCents": round(cents / 1.1),
            "inStock": r["offers"].get("availability", "").endswith("InStock"),
            "images": images, "docs": docs, "specs": specs,
            "descriptionHtml": clean_html(r.get("description_html"), slugs),
            "faq": [{"q": rebrand(html.unescape(f["q"] or "")), "a": clean_html(f["a"], slugs)}
                    for f in r.get("faq") or []],
        })
    out = ROOT / "src/data/products.json"
    out.parent.mkdir(parents=True, exist_ok=True)
    out.write_text(json.dumps(products, indent=1, ensure_ascii=False), encoding="utf8")

    for v in VIDEOS:
        src = SRC / "media/assets/files" / f"{v}-l.mp4"
        if download(f"/assets/files/{v}-l.mp4", src):
            dest = PUB / "videos" / f"{v.lower()[:40].rstrip('-')}.mp4"
            dest.parent.mkdir(parents=True, exist_ok=True)
            shutil.copyfile(src, dest)
    print("products", len(products), "images", sum(len(p["images"]) for p in products),
          "docs", sum(len(p["docs"]) for p in products))


if __name__ == "__main__":
    main()
