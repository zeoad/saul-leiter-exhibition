# SAUL LEITER — A QUIET GAZE

**静默的凝视：在日常中发现诗意**

An independent editorial exhibition about Saul Leiter's way of seeing: colour,
obstruction, weather and the ordinary. Built as a static Next.js site that can
be compiled on a Linux server and served from a plain directory.

> This is not the official website of Saul Leiter, the Estate of Saul Leiter or
> the Saul Leiter Foundation. It is an editorial study project. See
> [Image rights](#image-rights) before deploying publicly.

---

## 1. What this is

A five-page digital exhibition with a cinematic cover, eleven home chapters,
sixteen catalogued photographs, a four-chapter visual essay, a sourced
biography, and a searchable archive.

| Route | Page | Content |
| --- | --- | --- |
| `/` | Exhibition | 11 chapters: cover, statement, New York, colour, glass, weather, ordinary, painting, selected works, life, closing |
| `/work/` | The Work | 16 plates, six-category filter, masonry gallery, PhotoSwipe lightbox |
| `/work/[slug]/` | Plate record | 16 statically generated detail pages with source, credit, rights and prev/next |
| `/vision/` | The Vision | 4 chapters: colour, obstruction, rain & snow, the ordinary |
| `/life/` | The Life | Portrait, essay, 11-entry chronology, publications, sources |
| `/archive/` | Archive | Dark register with search, category filter, year filter, sort |
| `/404` | Not found | Custom editorial 404 |

Static files generated at build time: `sitemap.xml`, `robots.txt`, `icon.svg`,
`404.html`, `og/cover.jpg`.

---

## 2. Audit of the previous version

The first pass was a working prototype, but it had structural problems:

1. **Broken CSS scope.** The `@media (prefers-reduced-motion: reduce)` block was
   never closed, so every subpage style (work, vision, life, archive) lived
   inside that media query. On normal machines those pages had almost no layout.
2. **Tailwind was effectively unused.** Tailwind 4 was installed, but the project
   used v3 directives (`@tailwind base/components/utilities`) and a v3
   `tailwind.config.ts`, so the design tokens never reached the output.
3. **Thin data model.** One `category` string, `aspect` labels instead of real
   dimensions, invented year strings, image paths stored five different ways,
   and no source / credit / rights fields.
4. **Duplicated content.** Photo titles and captions were written by hand in
   components, so they could drift from the data.
5. **Animation lifecycles.** Lenis was not synchronised with ScrollTrigger,
   triggers were never reverted, and `prefers-reduced-motion` only affected CSS.
6. **Licensing and typography.** Placeholder SVG "photographs" were presented in
   a photographic exhibition, fonts were loaded from an external CDN, and there
   was no metadata, sitemap or canonical URL.

The V2 rewrite addresses all six. The five old root components were replaced by
the structured directories below; no feature was removed.

---

## 3. Architecture

```text
src/
├── app/
│   ├── layout.tsx            # fonts, metadata, providers, header/footer
│   ├── page.tsx              # 11 home chapters + JSON-LD
│   ├── globals.css           # design system + composition styles
│   ├── work/page.tsx         # gallery
│   ├── work/[slug]/page.tsx  # SSG plate records
│   ├── vision/page.tsx
│   ├── life/page.tsx
│   ├── archive/page.tsx
│   ├── robots.ts
│   ├── sitemap.ts
│   ├── not-found.tsx
│   └── icon.svg
├── components/
│   ├── layout/               # Header, Footer, ChapterRail
│   ├── home/                 # 11 section components
│   ├── gallery/              # WorkGallery, ArchiveExplorer, ArtworkLightbox
│   ├── animation/            # SmoothScroll (Lenis), ScrollMotion (GSAP)
│   └── ui/                   # Figure, PlateFigure, SectionHeading, PageHero…
├── data/
│   ├── photographs.ts        # single source of truth for the 16 plates
│   ├── chapters.ts           # four visual chapters
│   ├── timeline.ts           # sourced chronology + publications + references
│   └── exhibition.ts         # site meta, chapter register, curatorial copy
├── lib/
│   ├── gallery.ts            # query / caption / adjacent helpers
│   ├── metadata.ts           # canonical + Open Graph builder
│   └── lenis.ts              # shared smooth-scroll handle
└── types/index.ts            # Photograph, VisionChapter, TimelineEvent…
```

Server Components are the default. Client Components are limited to the header
menu, scroll animation controller, smooth scroll, gallery filtering, archive
search and the PhotoSwipe host.

### Data model

`Photograph` (in `src/types/index.ts`) carries `id`, `slug`, `plate`, `title`,
optional `year` + `yearNote`, `category[]`, `description`, `curatorNote`, a
typed `image` object with intrinsic dimensions, `source`, `sourceUrl`, `credit`,
`rights`, `usage` and `featured`. Every page reads from `src/data/photographs.ts`;
no component owns a photograph's title or year.

`usage` is the rights field:

- `editorial-study` — a real work reproduced without a commercial licence.
- `licensed` — permission obtained.
- `placeholder` — a stand-in that is **not** a work by the artist.

The archive and plate pages render this status rather than guessing.

---

## 4. Design system

- Colour: paper `#EAE6DE`, paper-dark `#DCD7CD`, ink `#252622`, ink-soft
  `#45453F`, muted red `#A64B3C`, gray-green `#85877C`, warm brown `#B8A990`,
  mist `#C8C5B9`, deep teal `#52605E`. Tokens live in `@theme` and `:root` in
  `src/app/globals.css`.
- Type: display serif (Cormorant Garamond → Garamond/Palatino/Georgia),
  grotesque (DM Sans → Segoe UI), Chinese serif (Noto Serif SC → Songti /
  STSong / SimSun). Sizes use `clamp()` from 15px body text upward.
- Space: fluid 20–96px gutters, 5.5–11rem section rhythm, 12-column grids.
- Surfaces: `.theme-paper`, `.theme-paper-dark`, `.theme-ink`, `.theme-teal`
  each redefine `--bg`, `--fg`, `--line`, `--accent`, so every component themes
  itself without hard-coded colour overrides.
- Imagery: every figure has an intrinsic aspect ratio, a paper veil for the
  reveal, a caption with plate + category + year, and an optional lightbox.

No rounded cards, drop shadows or gradient-only sections are used as a
substitute for layout.

---

## 5. Motion

- **Image reveal:** a paper/ink veil wipes upward while the image settles from
  1.06 scale. Triggered once at `top 88%`; triggers are reverted on route change.
- **Text:** single elements and grouped children fade and rise 22–26px.
- **Cover:** CSS-only curtain rise so it cannot flash before hydration; a GSAP
  scrub parallax fades the title as the cover leaves.
- **Chapter rail:** an `IntersectionObserver` highlights the current section and
  scrolls with Lenis.
- **Reduced motion:** `ScrollMotion` exits before creating any timeline,
  `SmoothScroll` does not initialise Lenis, and CSS removes veils, transforms and
  transitions. The site remains fully readable.

---

## 6. Images

The exhibition now uses **real photographs by Saul Leiter**, supplied by the
project owner from a study deck whose sources are the Saul Leiter Foundation's
public colour and black-and-white catalogues.

### Image rights

- Copyright remains with the **Estate of Saul Leiter**.
- Images are reproduced for an independent, non-commercial editorial study.
- This project is **not affiliated with, endorsed by or authorised by** the
  Estate or the Foundation.
- **Public deployment or any commercial use requires permission.** Treat the
  current site as a study copy.
- Full file-by-file table: [`public/images/ASSET-CREDITS.md`](public/images/ASSET-CREDITS.md).

The build process is reproducible via `scripts/import-real-assets.py`, which
converts the supplied files to WebP, creates the four hero crops and five detail
studies, and writes the credits manifest. It expects the external source folder
recorded at the top of the script; the site itself only needs `public/images`.

> **Careful:** the importer deletes and rebuilds `public/images`. Do not run it
> after adding licensed replacement images unless those files are also in the
> external source folder.

### Replacing or licensing images

1. Put the new file in `public/images/photographs/`.
2. Update the plate record in `src/data/photographs.ts` (`image`, `year`,
   `source`, `sourceUrl`, `credit`, `rights`, `usage`).
3. Set `usage: "licensed"` once permission is confirmed.

No component changes are needed. The same applies to the portrait and hero
files in `public/images/hero` and `public/images/portraits`.

---

## 7. Fonts

The project deliberately does **not** load fonts from a CDN. It uses local-first
stacks:

```css
--font-display: "Cormorant Garamond", "Cormorant", "EB Garamond", Garamond,
  "Palatino Linotype", "Book Antiqua", Georgia, "Times New Roman", serif;
--font-sans: "DM Sans", "Inter", "Segoe UI", "Helvetica Neue", Arial, sans-serif;
--font-cn: "Noto Serif SC", "Songti SC", "STSong", "Source Han Serif SC",
  "SimSun", serif;
```

This keeps the static build offline-capable and avoids multi-megabyte CJK font
downloads. To self-host the exact faces, drop licensed WOFF2 files into
`public/fonts/`, add matching `@font-face` rules at the top of `globals.css`, and
keep the same family names. `font-display: swap` is recommended.

---

## 8. Commands

Requires Node 20+ and npm 10+.

```bash
npm install            # install (no new dependencies were added in V2)
npm run dev            # development server, http://localhost:3000
npm run typecheck      # tsc --noEmit
npm run lint           # eslint
npm run build          # static export → out/
npm run preview        # serve out/ at http://127.0.0.1:4318
npm run start          # same as preview (there is no Next.js server runtime)
```

Optional tooling (no npm packages required):

```bash
npm run screenshots -- --path / --name home --full
npm run screenshots -- --path / --width 390 --height 844 --name home-mobile --full
npm run screenshots -- --path / --name home --sections "#cover,#color,#closing"
```

`scripts/screenshot.mjs` drives headless Chrome over the DevTools Protocol and
emulates `prefers-reduced-motion`, so full-page captures show the static layout
rather than unrevealed veils. Set `CHROME_PATH` if Chrome is not in the default
Windows location.

The image importer uses Python 3 with Pillow:

```bash
python scripts/import-real-assets.py
```

---

## 9. Static deployment

`next.config.ts` uses:

```ts
output: "export",
images: { unoptimized: true },
trailingSlash: true,
```

Build on the server (or in CI), then serve `out/` with nginx:

```nginx
server {
    listen 80;
    server_name your-domain.example;
    root /var/www/saul-leiter/out;
    index index.html;

    location / {
        try_files $uri $uri/ $uri.html =404;
    }

    error_page 404 /404.html;
    location = /404.html { internal; }

    location ~* \.(webp|jpg|jpeg|png|svg|woff2|css|js)$ {
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
}
```

Set `NEXT_PUBLIC_SITE_URL` before building so canonicals, Open Graph URLs,
`robots.txt` and `sitemap.xml` use the real domain:

```bash
cp .env.example .env.production
# edit NEXT_PUBLIC_SITE_URL
npm ci
npm run build
rsync -av --delete out/ user@server:/var/www/saul-leiter/out/
```

The site has no API routes, server actions, runtime image optimisation or
dynamic server rendering. All 16 plate routes are generated with
`generateStaticParams()` and `dynamicParams = false`.

---

## 10. Content & integrity

- Chronology is limited to widely documented events (birth 1923, New York 1946,
  MoMA 1953, *Early Color* 2006, death 2013, Foundation 2014). Approximate years
  and ranges are kept as such. Sources are linked on `/life/`.
- Years on photographs follow the Foundation catalogue, including `c.` and
  decade ranges.
- No painting by Leiter is reproduced; the "A Painter's Eye" chapter explicitly
  says that its images are photographic details, not paintings.
- Image rights status is shown in the archive (`STUDY COPY`), on plate pages and
  in the footer.

---

## 11. QA performed

- `npx tsc --noEmit` — clean.
- `npm run lint` — clean (no errors or warnings).
- `npm run build` — 27 static pages, `out/` produced.
- Headless Chrome screenshots at 1440×900 and 390×844 across the home sections,
  `/work/`, a plate record, `/vision/`, `/life/` and `/archive/`.
- Reduced-motion emulation confirms that content is visible without animation.
- Lightbox, filters, search, archive year filter, mobile menu and chapter rail
  are client components with keyboard and Escape handling.

## 12. Known limitations

- The images are study copies, not licensed assets. See §6.
- The portrait's photographer is not documented in the source deck; the site does
  not attribute it as a self-portrait.
- The biography is concise by design; it is not a complete exhibition history.
- Fonts fall back to installed system serifs. Installing licensed WOFF2 files is
  the only step needed to match the intended typography exactly.
