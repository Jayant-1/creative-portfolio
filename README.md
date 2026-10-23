# Jayant Potdar — Creative Artsy Portfolio

Engineering portfolio for **Jayant Potdar**, built using **Next.js 15 (App Router), TypeScript, Tailwind CSS, and pnpm**.

The design uses a playful scrapbook style: lined notebook paper, hand-drawn boxes, corner tape, polaroid frames, folder tabs, and animated stickers. Project content draws on repository research and owner-supplied facts about AstroPixel, Krypton, 3D Portfolio, Malaria Detection System, NeuralNet, and academic and leadership experience at MSSU Pune.

---

## Getting Started

### Prerequisites

- Node.js 22.13–24.x (production uses Node.js 24)
- pnpm 11.25.0 (pinned in package.json)

### Installation & Run

```bash
cd "creative portfolio"
pnpm install --frozen-lockfile
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
pnpm build
pnpm start
```

### Verification & Release Gates

```bash
# Typecheck, Lint & Component 1:1 Parity
pnpm verify

# Production Readiness Deep Verification Suite
pnpm verify:readiness [targetUrl]

# Full release checks against a running production build (not pnpm dev)
# Requires Playwright Chromium, Firefox and WebKit, plus Chrome for Lighthouse.
pnpm exec playwright install chromium firefox webkit
pnpm verify:release http://localhost:3000

# Production dependencies audit
pnpm audit --prod
```

Reports are written to ignored `audit-results/` folders. See `docs/production-readiness-2026-10-22.md` for measured results and external verification limits. Passing automated checks does not prove indexing, ranking, field Core Web Vitals, or physical-device compatibility.

---

## Routes

- `/` — Homepage with tactile hero, about preview, sticky stacking featured works folders, tools strip, animated "Let's talk" character, and contact note.
- `/about` — Biographical background, 3 engineering principles, award photographs, and owner-confirmed leadership roles.
- `/projects` — Index of project case studies supported by repository research and owner-supplied facts.
- `/projects/[slug]` — Deep-dive case study routes for `astropixel`, `krypton`, `3d-portfolio`, `malaria-detection`, and `neuralnet` with technical highlights, architecture tradeoffs, and live demo / source links.
- `/components` — Showcase catalog of interactive React and Framer Motion UI craft components.
- `/components/[slug]` — Component playground featuring responsive desktop/tablet/mobile viewport testing, prop customization, real-world variations, API reference tables, CLI installation, and setup notes.
- `/preview/[slug]` — Isolated component iframe sandbox for responsive rendering without outer page landmarks.
- `/experience` — Community leadership at TechSpark, hackathon honors, and industry certifications.
- `/contact` — Scrapbook contact view with 2-step note form, field validation, graceful delivery recovery, and direct email link.
- `/blog` — Coming-soon page, excluded from indexing until articles are published.
- `/og` — Dynamic Open Graph preview image endpoint.
- `/robots.txt` & `/sitemap.xml` — Search engine crawler directives and index.

---

## Typography & Attribution

Fonts are locally hosted in `/public/fonts` with local WOFF2 files. Body fonts use `swap`; preview display fonts currently use `block`. Keep the original font licenses with redistributed assets:
- **Handjet**: Pixel-style display titles and numbers
- **Just Me Again Down Here**: Handwritten notes and labels
- **DM Mono**: Monospace dates, metadata, and tags
- **Inter**: Body typography and paragraphs
- **Six Caps**: Component preview condensed display headings
- **Bebas Neue**: Component preview stylized display headings
- **Raleway**: Component preview headline variants

Original SIL Open Font License files are included in `public/fonts/licenses/`, sourced from the corresponding families in the official [Google Fonts repository](https://github.com/google/fonts/tree/main/ofl). The Handjet display subset preserves the existing `wght=700`, `ELGR=1`, `ELSH=7` settings; `scripts/generate-display-font.py` documents reproducible regeneration.
