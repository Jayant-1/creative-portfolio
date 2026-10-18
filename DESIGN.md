# Design System & Architecture: Creative Artsy Portfolio

> **Project:** Jayant Potdar — Creative Artsy Portfolio  
> **Aesthetic Direction:** Tactile Digital Scrapbook / Playful Inventor's Workbench  
> **Source Base:** Next.js 14 (App Router), TypeScript, Tailwind CSS, Framer Motion, Lucide Icons  
> **Target Audience:** Design-forward engineering leaders, hiring managers, product teams, and founders  

---

## 1. Visual Theme & Atmosphere

### Design Metaphor
A tangible, tactile desk where an ambitious software engineer and digital inventor spreads out working notebooks, sticky notes, taped polaroids, blueprints, and interactive widgets. It bridges the warmth of physical stationery with high-fidelity frontend engineering.

### Atmosphere Matrix
* **Density:** `Balanced Tactile` (4.5 / 10) — Spacious enough for reading clarity; peppered with authentic analog micro-artifacts without overwhelming legibility.
* **Variance:** `Artistic Asymmetry & Playful Organic` (8.5 / 10) — Rotated badges (-6° to +12°), wobbly doodle borders, torn paper stamps, scalloped edges, and overlapping folder tabs.
* **Motion:** `Bouncy Spring & Perpetual Micro-Interactions` (7 / 10) — Custom physics (`stiffness: 210, damping: 13`), blinking smiley eyes, slow spinning starbursts, floating avatar badges, and a custom mouse-follow inverse lens.

---

## 2. Color Palette & Roles

The palette draws inspiration from stationery, highlighters, colored masking tape, and fountain pen ink on warm notebook paper.

| Color Token | Hex / Value | Semantic Role & Application |
| :--- | :--- | :--- |
| `--ca-surface` | `#fdfdfb` | Primary paper base canvas (warm off-white cream) |
| `--ca-ink` | `#191510` | Deepest charcoal ink (body text, solid borders, offset drop shadows) |
| `--ca-gray` | `#857b69` | Muted pencil graphite (secondary metadata, subtle notes) |
| `--ca-chrome` | `#ece3d1` | Manila paper / Manila folder fill & hover states |
| `--ca-tick` | `#c0b49d` | Divider lines, ruled border rules |
| `--ca-grid-dot` | `rgba(25, 21, 16, 0.16)` | Notebook horizontal ruled guide lines (34px pitch) |
| `--ca-yellow` | `#f7c948` | Primary highlighter yellow (active nav tabs, smiley head, hero role note, selection) |
| `--ca-yellow-soft` | `#f3e2ad` | Soft post-it note yellow / tape accent |
| `--ca-blue` | `#2b57d6` | Ballpoint blueprint blue (focus rings, status pulse, AstroPixel badge) |
| `--ca-cyan` | `#b7c6ef` | Soft blueprint cyan (tape strip, secondary tags) |
| `--ca-magenta` | `#ff4d8d` | Neon magenta marker (Smiley badge, GitHub pill, Honors label accent) |
| `--ca-pink-soft` | `#ffc6da` | Pastel blush wash |
| `--ca-green` | `#16b06a` | Felt-tip green (email CTA, verified checkmarks) |
| `--ca-mint` | `#a9dfc6` | Soft mint wash (location badge, tag backgrounds) |
| `--ca-purple` | `#c4b5fd` | Lilac sticker pill (hero "Ideas into products" tag) |
| `--ca-orange` | `#ff6a35` | Vibrant coral orange (hero name doodle box outline, avatar glow) |

---

## 3. Typographic Architecture

Four distinct typefaces harmonize the technical rigor with the hand-crafted aesthetic:

| Role | Font Family | Variable / Class | Use Cases |
| :--- | :--- | :--- | :--- |
| **Display / Punch** | `Handjet` | `.ca-display` / `--font-artsy-display` | Massive uppercase hero titles ("JAYANT", "LET'S TALK"), project numbering ("01", "02"), large numbers. |
| **Handwritten Accent** | `Just Me Again Down Here` | `.ca-hand` / `--font-artsy-hand` | Organic personal notes ("my name is", "about me!", captions under polaroids, conversational callouts). |
| **Technical Monospace** | `DM Mono` | `.ca-mono` / `--font-artsy-mono` | Navigation links, project dates, categories, tech stack pills, factual metrics, code annotations. |
| **Readable Body** | `Inter` | `--font-artsy-sans` | Case study prose, architectural breakdowns, problem/solution narratives, long-form paragraphs. |

### Hierarchy Rules
* **Hero Display:** Massive scale (`22vw` down to `sm:text-9xl` and `lg:text-[11.5rem]`), `line-height: 0.9`, tight letter tracking.
* **Section Titles:** `3xl` to `5xl`, enclosed in doodle boxes or accented with handwritten subtitles.
* **Handwritten Callouts:** `text-2xl` to `text-3xl`, paired with SVG doodle underlines (`UnderlineDoodle`).
* **Metadata & Tags:** All-caps monospace, `tracking-[0.15em]` to `tracking-[0.2em]`, font-weight 700.

---

## 4. Tactile UI Components & Craftsmanship

### 1. Notebook Paper Surface (`.ca-grid`, `.ca-grain`)
* Horizontal repeating 34px ruled lines emulate physical spiral-bound notebook paper.
* Subtle procedural fractal-noise SVG overlay (`opacity: 0.08`, `mix-blend-multiply`) introduces real paper grain.

### 2. Polaroid Cards (`Polaroid`)
* Thick white border with realistic drop shadow (`0 10px 28px rgba(17,18,18,0.16)`).
* Semi-transparent tape pieces (`Tape`) pinned at -35° and +35° angles on top corners.
* Centered cursive caption (`.ca-hand`) along the bottom border.

### 3. Masking Tape Strips (`Tape`, `.ca-tape-strip`)
* Translucent tint with top-angled shine overlay and corner fold illusion.
* Used to "pin" stickers, photos, and cards to the canvas.

### 4. Folder Tabs & Clip-Paths
* `.folder-tab-shape`: Angled manila folder tab polygon cut (`clip-path: polygon(...)`).
* `.ca-doodle-box`: Asymmetrical border-radius (`255px 15px 225px / 15px 225px 15px 255px`) producing a hand-drawn rectangle.
* `.ca-torn-label` & `.ca-torn-stamp`: Organic jagged polygon perimeter simulating ripped paper and scalloped postage stamps.

### 5. Tactile Drop Shadows
* `shadow-solid`: `8px 12px 0 var(--ca-ink)` (retro-flat physical stamp).
* `shadow-solid-sm`: `4px 4px 0 var(--ca-ink)`.
* `shadow-solid-yellow`: `5px 5px 0 var(--ca-yellow)`.

---

## 5. Signature Interactive Moments & Motion

### 1. Dynamic Inverted Mouse-Follow Lens (`useLens` + `MouseLens`)
* Tracks cursor coordinates inside the hero group.
* Applies `backdrop-filter: invert(1)` with a 4-corner targeting crosshair.
* Reveals negative inversion of the giant "JAYANT" and "LET'S TALK" typography on desktop hover.

### 2. Character-by-Character Staggered Reveal (`StaggerText`)
* Uses Framer Motion spring curves (`cubic-bezier(0.16, 1, 0.3, 1)`) with `y: "0.7em"` offset.
* Cascades across headline letters for a tactile entrance.

### 3. Spring Sticker Drop-Ins (`DropIn`)
* Simulates physical stickers slapped onto the paper desk: `stiffness: 210, damping: 13`, starting with `rotate: 1.8 * rotate` and dropping `y: -28px`.

### 4. Floating Avatar Flanks (`Float`)
* Continuous gentle oscillation (`y: [0, -12px, 0], rotate: [-6deg, 6deg, -6deg]`) framing the hero on wide viewports.

### 5. Interactive Character ("Let's Talk" Section)
* Custom SVG animated smiley face with blinking eyes (`@keyframes ca-blink`), rosy magenta cheeks, and hover scale response.

### 6. Splash Preloader (`Preloader`)
* Speech bubble notification greeting visitors (`HEY THERE` → `WELCOME IN :)`) 

---

## 6. Information Architecture & Content Catalog

### Identity & Author Profile
* **Author:** Jayant Potdar (Jayant Sunil Potdar)
* **Title:** Full Stack Developer
* **Location:** Pune, Maharashtra, India
* **Education:** B.Tech in Computer Science & Engineering (2024–2028), Ratan Tata Maharashtra State Skills University (MSSU), Pune (CGPA: 8.0)
* **Status:** Seeking internships and full-time roles; open to hybrid/remote work and relevant projects.
* **Contact:** Public contact is email (jayantpotdar2006@gmail.com); calls arranged through email; phone number remains in résumé PDF only.

### Core Projects
1. **AstroPixel (Spatial Imagery & Deep Zoom Platform)**
   * *Role:* Solo Full Stack Developer (Solo build)
   * *Stack:* React, FastAPI, Python, GDAL, OpenSeadragon, PostgreSQL, PostGIS, Docker, Tailwind CSS
   * *Challenge & Solution:* Gigabyte-scale GeoTIFFs crashed browsers (2.4GB+ RAM). Engineered an automated GDAL multi-resolution DZI tile pyramid server with sub-50ms streaming and bounded viewport rendering (<45MB RAM, 60fps pan/zoom).
   * *Outcome:* 3rd Place, University Ideation Competition 3.0.

2. **Krypton (AI Research Assistant & Multi-Signal Literature Engine)**
   * *Role:* Team Leader & Core Backend/ML Developer (Team of 3)
   * *Stack:* React, TypeScript, FastAPI, Python, Google Gemini API, arXiv API, OpenAlex API, scikit-learn
   * *Challenge & Solution:* Built a transparent literature discovery engine combining deterministic ranking with a 40/30/30 formula (40% TF-IDF text relevance + 30% Citation count + 30% Publication recency) alongside citation-grounded Gemini summaries.
   * *Outcome:* 1st Place Winner, University Project Expo.

3. **3D Portfolio (Interactive Space-Themed Creative Experience)**
   * *Role:* Solo Developer (Solo build)
   * *Stack:* React, Three.js, React Three Fiber, @react-three/drei, Spline, GSAP, Framer Motion, Tailwind CSS, Vite
   * *Challenge & Solution:* Combined React Three Fiber scenes with a Spline keyboard and selective motion while tuning canvas pixel ratios and loading behavior for smaller devices to prevent touch gesture traps and frame drops.
   * *Outcome:* Working creative portfolio with interactive 3D scenes, motion-led navigation, achievements, and an adaptive mobile experience.

4. **Malaria Detection System (AI-Assisted Blood-Smear Screening Prototype)**
   * *Role:* Team Leader & Full Stack Developer (Student engineering team)
   * *Stack:* React, FastAPI, Python, Keras, TensorFlow, Supabase, PostgreSQL, jsPDF, Tailwind CSS
   * *Challenge & Solution:* Connected a blood-smear cell image inference model with role-based doctor/patient/admin dashboards and PDF report generation.
   * *Limitation & Truth:* Engineering prototype built for academic demonstration; not clinically validated and not approved for medical diagnosis.
   * *Outcome:* Working end-to-end prototype with role-specific views and downloadable reports.

5. **NeuralNet (Visual Deep Learning Studio & DAG Compiler)**
   * *Role:* Team Leader & Full Stack Developer (Team of 3)
   * *Stack:* React, XYFlow (React Flow), TypeScript, FastAPI, Python, Keras Code Generation, Tailwind CSS
   * *Challenge & Solution:* Drag-and-drop neural network canvas that performs topological sorting, real-time graph validation, and compiles DAG structures to PEP-8 compliant Keras Python code via an AST-based compiler.
   * *Limitation & Truth:* Hosted training metrics are simulated in demonstration mode to avoid expensive cloud GPU execution on the web hosting tier.
   * *Outcome:* Live prototype supporting visual architecture design and exportable Keras code generation.

### Experience & Leadership
* **Head of Web Development** — TechSpark Technical Club, MSSU Pune (2025 to Present)
* **Web Development Co-Head** — TechSpark Technical Club, MSSU Pune (2024 to 2025)
* **Event Head** — Pixel Perfection Hackathon, MSSU Pune (2024)
* **Project Team Lead** — Krypton, Malaria Detection System & NeuralNet, MSSU Pune (2025–2026)

### Engineering Notes & Articles
* *Handling Gigabyte-Scale Images in the Browser: Tile Pyramids, GDAL, and OpenSeadragon* (7 min read)
* *Building a Visual Deep Learning Studio: Compiling Graph JSON to Executable Keras Code* (8 min read)
* *Ranking Academic Papers Without Black-Box Search: Blending TF-IDF, Citations, and Recency* (6 min read)

---

## 7. Responsive & Accessibility Standards

* **Semantic Landmarks:** Proper `<header>`, `<main id="main">`, `<article>`, `<section>`, and `<footer>` tagging with accessible `aria-labelledby` linkages.
* **Skip Link:** Dedicated "Skip to content" anchor accessible via keyboard tab navigation.
* **Touch-First Tap Targets:** Minimum `44px × 44px` for all clickable pills, icon buttons, and links.
* **Reduced Motion:** Full `@media (prefers-reduced-motion: reduce)` overrides disabling animations and preserving immediate visibility.
* **Comprehensive SEO:** JSON-LD schema graphs (`Person`, `WebSite`, `BreadcrumbList`, `CreativeWork`, `ProfilePage`), dynamic OpenGraph image generation (`/og`), and explicit metadata indexing.

---

## 8. Anti-Patterns & Quality Enforcements

* **NO Generic AI Gradients:** Strictly no purple-to-blue neon glowing meshes or dark cyber templates.
* **NO Fabricated Numbers:** All metrics reflect verified architectural benchmarks (45MB RAM footprint, 60fps pan/zoom, 3 ranking signals).
* **NO Fabricated Social Proof:** Zero fabricated testimonials, awards, stars, views, or false clinical claims. All testimonials are authentic first-person build reflections.
* **Transparent Limitations:** Hosted NeuralNet metrics are explicitly noted as simulated; Malaria Detection System is explicitly documented as an engineering prototype not clinically validated.
* **Deterministic Formulas:** Krypton ranking weights are strictly 40/30/30 (TF-IDF, Citations, Recency).
* **NO Text Clashes:** Absolute positional elements and stickers are locked to dedicated boundary regions with safe spacing.
* **NO Broken Links:** Fallback paths and external repository links point directly to active verified locations.

