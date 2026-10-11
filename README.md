# Jayant Potdar — Creative Artsy Portfolio

A production-ready recreation of the [Portfoliofy Creative Artsy preview](https://portfoliofy.io/preview/creative-artsy) for **Jayant Potdar**, built using **Next.js 14 App Router, TypeScript, Tailwind CSS, and pnpm**.

The design embodies a playful, tactile scrapbook aesthetic: lined notebook paper with subtle grain, hand-drawn wobbly boxes, translucent corner tape, polaroid frames, protruding folder tabs with sticky stacking scroll, and animated sticker doodles. All content reflects Jayant's verified projects (AstroPixel, Krypton, NeuralNet, Nova-Learn) and authentic academic/leadership experience at MSSU Pune.

---

## Getting Started

### Prerequisites

- Node.js 18+ or 20+
- pnpm 9+ or 11+

### Installation & Run

```bash
cd "creative portfolio"
pnpm install
pnpm dev
```

Visit [http://localhost:3000](http://localhost:3000).

### Production Build

```bash
pnpm build
pnpm start
```

### Typecheck

```bash
pnpm typecheck
```

---

## Routes

- `/` — Homepage with tactile hero, about preview, sticky stacking featured works folders, tools strip, animated "Let's talk" character, and contact note.
- `/about` — Detailed biographical background, 3 core engineering principles, and verified leadership roles with desktop sticky anchor navigation tabs.
- `/case-studies` — 2-column index of project folders with hover tilt and screenshot zoom.
- `/case-studies/[slug]` — Deep-dive case study routes for `astropixel`, `krypton`, `neuralnet`, and `nova-learn` with 2×2 torn fact cards, problem/approach/result sections, factual metrics, and live demo / source links.
- `/playground` — Interactive notebook canvas with 8 scattered experiment cards, touch/mouse pan, and bounded zoom controls (+ / - / reset).
- `/contact` — Scrapbook contact view with 2-step note form, field validation, and pre-filled email draft via `mailto:` fallback.
- `/og` — Dynamic Open Graph preview image endpoint.
- `/robots.txt` & `/sitemap.xml` — Search engine crawler directives and index.

---

## Typography & Attribution

Fonts are locally hosted with `font-display: swap` under their respective SIL Open Font Licenses:
- **Handjet**: Pixel-style display titles and numbers
- **Just Me Again Down Here**: Handwritten notes and labels
- **DM Mono**: Monospace dates, metadata, and tags
- **Inter**: Body typography and paragraphs
