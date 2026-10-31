# -*- coding: utf-8 -*-
"""
Import the real Saul Leiter works supplied for this exhibition.

Source directory (outside the repo):
  D:\\desktop_backup\\deepseek-file\\02-saul-leiter-40p\\leiter_deck_assets

The project owner supplied these files, which were originally collected from the
Saul Leiter Foundation's public colour / black-and-white catalogues for a study
deck. They are reproduced here for an independent, non-commercial editorial
study. Rights remain with the Estate of Saul Leiter; see ASSET-CREDITS.md.

This script:
  1. converts 16 works to web-optimised WebP (no upscaling of plate images),
  2. crops the four hero images and five detail studies,
  3. imports the portrait,
  4. writes public/images/ASSET-CREDITS.md.

Run:  python scripts/import-real-assets.py
"""
from __future__ import annotations

import json
import shutil
from pathlib import Path

from PIL import Image, ImageFilter

ROOT = Path(__file__).resolve().parents[1]
SRC = Path(
    r"D:\desktop_backup\deepseek-file\02-saul-leiter-40p\leiter_deck_assets"
)
OUT = ROOT / "public" / "images"

RIGHTS = (
    "© Estate of Saul Leiter. All rights reserved. Reproduced for an "
    "independent, non-commercial editorial study. Not affiliated with or "
    "authorised by the Estate of Saul Leiter or the Saul Leiter Foundation. "
    "Any public or commercial use requires permission."
)

FOUNDATION = {
    True: ("Saul Leiter Foundation — Colour", "https://www.saulleiterfoundation.org/color"),
    False: (
        "Saul Leiter Foundation — Black and White",
        "https://www.saulleiterfoundation.org/black-and-white",
    ),
}

# order = plate number, src = source file stem inside selected_jpg/
WORKS = [
    dict(n=1, slug="through-boards", src="ch02_04", title="Through Boards", year="1957", color=True),
    dict(n=2, slug="red-curtain", src="ch04_01", title="Red Curtain", year="1956", color=True),
    dict(n=3, slug="canopy", src="ch02_05", title="Canopy", year="1958", color=False),
    dict(n=4, slug="mirrors", src="ch03_02", title="Mirrors", year="c. 1962", color=True),
    dict(n=5, slug="phone-call", src="ch03_03", title="Phone Call", year="1957", color=True),
    dict(n=6, slug="taxi", src="ch03_04", title="Taxi", year="1957", color=True),
    dict(n=7, slug="blue-skirt", src="ch05_04", title="Blue Skirt", year="1950s", color=True),
    dict(n=8, slug="graffiti-heads", src="ch04_02", title="Graffiti Heads", year="1950", color=True),
    dict(n=9, slug="san-carlo-restaurant", src="ch03_01", title="San Carlo Restaurant", year="1952", color=True),
    dict(n=10, slug="snow", src="ch04_05", title="Snow", year="1970", color=True),
    dict(n=11, slug="rain", src="ch08_04", title="Rain", year="1950s", color=False),
    dict(n=12, slug="walking", src="ch02_01", title="Walking", year="1956", color=True),
    dict(n=13, slug="sidewalk", src="ch07_04", title="Sidewalk", year="1954", color=False),
    dict(n=14, slug="times-square-new-years-eve", src="ch08_05", title="Times Square, New Year's Eve", year="1952–1953", color=False),
    dict(n=15, slug="foot-on-el", src="ch02_02", title="Foot on El", year="1954", color=True),
    dict(n=16, slug="man-in-straw-hat", src="ch05_05", title="Man in Straw Hat", year="c. 1955", color=True),
]

PLATE_DIR = OUT / "photographs"
HERO_DIR = OUT / "hero"
DETAIL_DIR = OUT / "details"
PORTRAIT_DIR = OUT / "portraits"


def source_image(stem: str) -> Image.Image:
    for folder in ("selected_jpg", "selected_crop", "selected"):
        path = SRC / folder / f"{stem}.jpg"
        if path.exists():
            return Image.open(path).convert("RGB")
    raise FileNotFoundError(stem)


def save_webp(image: Image.Image, path: Path, quality: int = 88) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    image.save(path, "WEBP", quality=quality, method=6)


def fit(image: Image.Image, max_edge: int) -> Image.Image:
    width, height = image.size
    scale = min(1.0, max_edge / max(width, height))
    if scale >= 1.0:
        return image
    return image.resize(
        (round(width * scale), round(height * scale)), Image.Resampling.LANCZOS
    )


def crop_ratio(image: Image.Image, ratio: float, anchor_y: float = 0.5) -> Image.Image:
    width, height = image.size
    target_h = round(width / ratio)
    if target_h <= height:
        top = round((height - target_h) * anchor_y)
        return image.crop((0, top, width, top + target_h))
    target_w = round(height * ratio)
    left = round((width - target_w) / 2)
    return image.crop((left, 0, left + target_w, height))


def sharpen(image: Image.Image) -> Image.Image:
    return image.filter(ImageFilter.UnsharpMask(radius=1.1, percent=55, threshold=3))


def main() -> None:
    if OUT.exists():
        shutil.rmtree(OUT)
    for folder in (PLATE_DIR, HERO_DIR, DETAIL_DIR, PORTRAIT_DIR):
        folder.mkdir(parents=True, exist_ok=True)

    records = []

    # 16 plates -------------------------------------------------------------
    for work in WORKS:
        image = source_image(work["src"])
        destination = PLATE_DIR / f"plate-{work['n']:02d}.webp"
        save_webp(fit(image, 1800), destination, quality=88)
        records.append(
            {
                "file": f"photographs/plate-{work['n']:02d}.webp",
                "work": work["title"],
                "year": work["year"],
                "dimensions": list(Image.open(destination).size),
                "source": "Saul Leiter Foundation public catalogue",
                "rights": RIGHTS,
                "plate": work["n"],
                "color": work["color"],
            }
        )

    # Hero images -----------------------------------------------------------
    taxi = source_image("ch03_04")
    cover = crop_ratio(taxi, 16 / 9, 0.42).resize((1600, 900), Image.Resampling.LANCZOS)
    save_webp(sharpen(cover), HERO_DIR / "cover-main.webp", quality=86)

    curtain = source_image("ch04_01")
    inset = crop_ratio(curtain, 3 / 4, 0.0).resize((720, 960), Image.Resampling.LANCZOS)
    save_webp(inset, HERO_DIR / "cover-inset.webp", quality=88)

    portrait = Image.open(SRC / "portraits" / "leiter_portrait_crop.jpg").convert("RGB")
    statement = crop_ratio(portrait, 4 / 5, 0.45).resize((864, 1080), Image.Resampling.LANCZOS)
    save_webp(statement, HERO_DIR / "statement-portrait.webp", quality=90)
    save_webp(portrait, PORTRAIT_DIR / "leiter-portrait.webp", quality=90)

    sidewalk = source_image("ch07_04")
    closing = sidewalk.resize((1400, 920), Image.Resampling.LANCZOS)
    save_webp(sharpen(closing), HERO_DIR / "closing-quiet.webp", quality=86)

    # Detail studies --------------------------------------------------------
    details = [
        ("detail-01", "ch03_03", (80, 40, 1090, 742), (1000, 695), "Phone Call, 1957 — detail of glass and reflection"),
        ("detail-02", "ch04_01", (0, 0, 700, 700), (900, 900), "Red Curtain, 1956 — detail of the curtain"),
        ("detail-03", "ch03_02", (300, 0, 1450, 850), (1150, 850), "Mirrors, c. 1962 — detail of the mirrored surface"),
        ("detail-04", "ch03_01", (30, 320, 700, 990), (900, 900), "San Carlo Restaurant, 1952 — detail of snow, umbrellas and the shop window"),
        ("detail-05", "ch05_04", (200, 0, 1200, 700), (1000, 700), "Blue Skirt, 1950s — detail of fabric and colour"),
    ]
    for name, stem, box, size, note in details:
        image = source_image(stem).crop(box)
        save_webp(image.resize(size, Image.Resampling.LANCZOS), DETAIL_DIR / f"{name}.webp", quality=88)
        records.append(
            {
                "file": f"details/{name}.webp",
                "work": note,
                "year": "",
                "dimensions": list(size),
                "source": "Detail of a Saul Leiter photograph in this exhibition",
                "rights": RIGHTS,
                "plate": "",
                "color": True,
            }
        )

    records.extend(
        [
            {
                "file": "hero/cover-main.webp",
                "work": "Taxi, 1957",
                "year": "1957",
                "dimensions": [1600, 900],
                "source": "Saul Leiter Foundation public catalogue",
                "rights": RIGHTS,
                "plate": 6,
                "color": True,
            },
            {
                "file": "hero/cover-inset.webp",
                "work": "Red Curtain, 1956",
                "year": "1956",
                "dimensions": [720, 960],
                "source": "Saul Leiter Foundation public catalogue",
                "rights": RIGHTS,
                "plate": 2,
                "color": True,
            },
            {
                "file": "hero/statement-portrait.webp",
                "work": "Portrait of Saul Leiter, c. 1950s",
                "year": "c. 1950s",
                "dimensions": [864, 1080],
                "source": "Saul Leiter Foundation",
                "rights": RIGHTS,
                "plate": "",
                "color": False,
            },
            {
                "file": "hero/closing-quiet.webp",
                "work": "Sidewalk, 1954",
                "year": "1954",
                "dimensions": [1400, 920],
                "source": "Saul Leiter Foundation public catalogue",
                "rights": RIGHTS,
                "plate": 13,
                "color": False,
            },
            {
                "file": "portraits/leiter-portrait.webp",
                "work": "Portrait of Saul Leiter, c. 1950s",
                "year": "c. 1950s",
                "dimensions": [925, 1080],
                "source": "Saul Leiter Foundation",
                "rights": RIGHTS,
                "plate": "",
                "color": False,
            },
        ]
    )

    # OG image --------------------------------------------------------------
    og_dir = ROOT / "public" / "og"
    og_dir.mkdir(parents=True, exist_ok=True)
    og = cover.resize((1200, 630), Image.Resampling.LANCZOS)
    og.save(og_dir / "cover.jpg", "JPEG", quality=86, optimize=True, progressive=True)

    # Credits ---------------------------------------------------------------
    lines = [
        "# Image credits — A QUIET GAZE",
        "",
        "This exhibition contains **real photographs by Saul Leiter**. All works remain",
        "the copyright of the Estate of Saul Leiter. They are reproduced here for an",
        "independent, non-commercial editorial study, and this project is not",
        "affiliated with, endorsed by, or authorised by the Estate of Saul Leiter or",
        "the Saul Leiter Foundation.",
        "",
        "Images were supplied by the project owner from a study deck whose files",
        "derive from the Saul Leiter Foundation's public colour and black-and-white",
        "catalogues (https://www.saulleiterfoundation.org/color and",
        "https://www.saulleiterfoundation.org/black-and-white). Titles and years follow",
        "that curated metadata; years marked `c.` or `1950s` remain approximate.",
        "Before any public or commercial launch, permission must be obtained from the",
        "Estate / Foundation.",
        "",
        "| File | Work | Year | Dimensions | Source |",
        "| --- | --- | --- | --- | --- |",
    ]
    for record in records:
        width, height = record["dimensions"]
        lines.append(
            f"| `{record['file']}` | {record['work']} | {record['year'] or '—'} | "
            f"{width}×{height} | {record['source']} |"
        )

    lines += [
        "",
        "## Rights statement",
        "",
        RIGHTS,
        "",
        "## Replacing images",
        "",
        "Each plate record in `src/data/photographs.ts` carries its own `image`,",
        "`source`, `credit`, `rights` and `usage` fields. Replace the file in",
        "`public/images/photographs/` and update that record; no component changes",
        "are required. For licensed photography, set `usage: \"licensed\"`.",
        "",
        "## Note on the portrait",
        "",
        "The portrait of Saul Leiter (c. 1950s) is credited to the Saul Leiter",
        "Foundation in the source deck. The photographer is not stated there; it is",
        "not identified as a self-portrait in this project.",
    ]

    (OUT / "ASSET-CREDITS.md").write_text("\n".join(lines) + "\n", encoding="utf-8")

    (ROOT / "scripts" / "real-assets-manifest.json").write_text(
        json.dumps(records, ensure_ascii=False, indent=2), encoding="utf-8"
    )

    total = sum(path.stat().st_size for path in OUT.rglob("*") if path.is_file())
    print(f"Wrote {len(records)} records, {total / 1024:.0f} KB of images")
    for record in records:
        if record["file"].startswith("photographs"):
            print(f"  {record['file']:32} {record['dimensions']} {record['work']}")


if __name__ == "__main__":
    main()
