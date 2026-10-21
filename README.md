# Jayant Potdar — Creative Artsy Portfolio

Engineering portfolio for **Jayant Potdar**, built using **Next.js 15 (App Router), TypeScript, Tailwind CSS, and pnpm**.

The design embodies a playful, tactile scrapbook aesthetic: lined notebook paper with subtle grain, hand-drawn wobbly boxes, translucent corner tape, polaroid frames, protruding folder tabs with sticky stacking scroll, and animated sticker doodles. All content reflects Jayant's verified projects (AstroPixel, Krypton, 3D Portfolio, Malaria Detection System, NeuralNet) and authentic academic/leadership experience at MSSU Pune.

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

### Verification & Release Gates

```bash
# Typecheck, Lint & Component 1:1 Parity
pnpm verify

# Production Readiness Deep Verification Suite
pnpm verify:readiness [targetUrl]

# Production dependencies audit
pnpm audit --prod
```

---

## Routes

- `/` — Homepage with tactile hero, about preview, sticky stacking featured works folders, tools strip, animated "Let's talk" character, and contact note.
- `/about` — Detailed biographical background, 3 core engineering principles, physical trophy verification, and verified leadership roles.
- `/projects` — Index of verified project case studies.
- `/projects/[slug]` — Deep-dive case study routes for `astropixel`, `krypton`, `3d-portfolio`, `malaria-detection`, and `neuralnet` with technical highlights, architecture tradeoffs, and live demo / source links.
- `/components` — Showcase catalog of interactive React and Framer Motion UI craft components.
- `/components/[slug]` — Component playground featuring responsive desktop/tablet/mobile viewport testing, prop customization, real-world variations, API reference tables, CLI installation, and setup notes.
- `/preview/[slug]` — Isolated component iframe sandbox for responsive rendering without outer page landmarks.
- `/experience` — Community leadership at TechSpark, hackathon honors, and industry certifications.
- `/contact` — Scrapbook contact view with 2-step note form, field validation, graceful delivery recovery, and direct email link.
- `/blog` & `/blog/[slug]` — Technical engineering articles and architecture deep dives.
- `/og` — Dynamic Open Graph preview image endpoint.
- `/robots.txt` & `/sitemap.xml` — Search engine crawler directives and index.

---

## Typography & Attribution

Fonts are locally hosted with `font-display: swap` under their respective SIL Open Font Licenses:
- **Handjet**: Pixel-style display titles and numbers
- **Just Me Again Down Here**: Handwritten notes and labels
- **DM Mono**: Monospace dates, metadata, and tags
- **Inter**: Body typography and paragraphs
