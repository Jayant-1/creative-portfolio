# Production-readiness audit — 22–23 October 2026

Last updated: 23 October 2026. This is a measured release report, not a claim of 100% readiness or guaranteed search ranking.

## Scope and constraints

- Repository: `creative portfolio`, working changes based on commit `4109b4c`. Changes already made by the owner’s other session were preserved.
- Preserve the existing design, component artwork, layout, typography and interactions. The owner explicitly approved numeric customizer labels changing from orange `#ff6a35` to darker orange `#c2410c` in light mode, and scaling the original desktop canvas in the embedded mobile Overlapping Text Hero preview. Its component source and surrounding design are preserved.
- Test production builds, not development-server performance. Early checks used port 3217; the current production build is served locally on port 3000.
- Current tools: Next.js 15.5.28; Node.js 24.20.0 for build/test commands; pnpm 11.25.0; Lighthouse 13.5.0; axe-core 4.14.0; Playwright Chromium 156, Firefox 157 and WebKit 27.2.

## Phase results

| Phase | Current result | Evidence and practical limit |
| --- | --- | --- |
| 0 — Repository audit | Pass | Source, build, dependencies, routes and existing modifications inspected. Typecheck and lint passed. |
| 1 — Performance debt | Partial | Removed unused opening preloader, eager navigation work, external font CSS and shared client imports of full case-study content. Reserved preview dimensions fix measured CLS. Mobile LCP remains a release gate. |
| 2 — Architecture | Pass within inspected scope | Server-rendered homepage content; smaller client boundaries; shared profile data; reproducible lockfile; source/display-code parity checks for all six components; CI release workflow added. |
| 3 — Visual system | Preserved; approved preview fix verified | The desktop homepage matches the saved baseline, apart from continuous animation phases. Mobile Overlapping Text Hero now scales the original canvas after explicit owner approval; the complete headline is visible. |
| 4 — Mobile implementation | Partial | 18 routes × 4 widths (320, 390, 768, 1440) × 3 browser engines = 216 checks passed for responses, headings, script errors, page overflow and preview bounds. A further 18 checks verify all three Overlapping Text Hero presets at two mobile widths in three engines: complete headline, original aspect ratio, portrait reveal and scroll reset all pass. These are not physical-device certificates. |
| 5 — SEO | Candidate passes; deployment pending | 17 canonical routes, titles, descriptions, reachable social images, structured JSON, genuine 404s and noindex exclusions checked. Legacy domains now issue direct 308 redirects preserving path/query. Corrected unsupported image-dimension declarations. |
| 6 — AEO / structured content | Candidate passes | 18 routes / 87 schemas inspected; 339 assertions passed. Current student affiliation corrected; unsupported credential validity dates removed. Added factual `llms.txt`. This file is supplemental, not a ranking requirement or guarantee. |
| 7 — Performance | Fail | Three-run mobile medians exceed the unchanged 2.5-second LCP gate. Scores and low blocking time alone do not constitute a pass. See measurements below. |
| 8 — Accessibility | Automated checks pass; manual scope remains | After the approved color correction, all 36 page/viewport axe scans report zero violations. Focus trapping, Escape, focus restoration and nested-control regression checks passed. Axe still marks textured/overlapping backgrounds for manual contrast review. No screen-reader certification claimed. |
| 9 — Content authenticity | Pass within evidence reviewed | Five first-person case studies; no fake testimonials or GitHub counts. NeuralNet simulated training and malaria prototype limitations disclosed. Source research recorded separately. Owner-supplied education/awards are not independently certified by a successful build. |
| 10 — Project pages | Candidate checks pass | Five routes and source/demo entrypoints respond. Gallery/dialog accessibility checks passed. Responding demos do not prove all third-party backends work. |
| 11 — Analytics / search | Partial | Vercel Analytics installed and enabled for the project. Host/path filtering and query stripping implemented. Unit tests passed. Owner confirmed Search Console ownership and sitemap Success; screenshot proves an indexing request was accepted. Dashboard event receipt, actual indexing and field traffic remain unverified. |
| 12 — Production QA | Partial | Interaction, HTTP, schema and source-parity checks pass. Clean Vercel preview build succeeded after removing conflicting pnpm hooks. Performance blocks a clean release verdict. |
| 13 — Browser testing | Partial | Chromium, Firefox and WebKit automation passed. Real Safari, Edge, iOS/Android hardware and assistive-technology combinations were not available for certification. |
| 14 — Final audit | Not passed | Do not mark the release ready while the performance gate, production verification and external evidence remain outstanding. |

## Implemented changes

- Replaced eager global motion features with lazy loading after an initial paint opportunity, preserving motion values and timings.
- Scoped shared-layout animation features to the component playground. Removed its static opacity-to-opacity wrapper and automatic breadcrumb/next-project prefetch traffic.
- Split the homepage’s static content from interactive hero/image elements; stopped passing complete case studies through shared client imports.
- Self-hosted the existing fonts through Next’s hashed font assets. Generated an exact Handjet instance for the axes already used by display text. Original assets remain available.
- Included the seven font families’ original SIL Open Font License files from the official Google Fonts repository.
- Applied the approved mobile Overlapping Text Hero scaling using its original 1280×800 canvas; all six source/display-code parity checks still pass. Fullscreen viewport modes and other components retain their existing behavior.
- Reserved responsive preview geometry before iframe mounting; component startup CLS fell from 0.131 in an earlier diagnostic to 0 in the candidate samples.
- Fixed accessible names to include visible text; fixed heading levels without altering classes or appearance; darkened only approved numeric value labels.
- Added source parity, full-route axe, HTTP/SEO, interaction, multi-engine and repeated performance release checks. Tests do not submit real contact messages.
- Validated untrusted preview URL/storage configuration types and numeric bounds to prevent malformed links from crashing React.
- Added Vercel Analytics with host/path filtering and removal of query strings/fragments; contact form contents are not sent as event properties.
- Corrected student/credential schema and social image metadata; generated `llms.txt` from the same project/profile data.
- Removed an obsolete pnpm hook that broke frozen installs on Vercel; kept dependency overrides in one workspace configuration. Clean remote preview build succeeded.
- Changed unversioned public assets to revalidate and reduced optimized-image retention to one hour. Already-cached assets with historical long TTLs may require cache expiry or a versioned replacement if their contents are changed.

## Measurements and evidence

Raw local artifacts are deliberately ignored by Git. CI uploads release evidence for 14 days.

- `audit-results/2026-10-23-candidate/release-summary.json`: the completed full suite before the approved color fix. 10 gates passed; axe and mobile performance failed. Preserve this historical failure rather than rewriting it.
- `audit-results/2026-10-23-color-fix/accessibility-axe.json`: subsequent complete axe run, 36 page/viewport combinations, zero violations after the color fix.
- `audit-results/2026-10-23-candidate/cross-browser-verified.json`: 216 passing browser/viewport combinations.
- `audit-results/2026-10-23-final/release-summary.json`: full suite after color, motion and navigation changes, before the approved mobile scaling; 11 of 12 gates pass. Only mobile performance fails.
- `audit-results/2026-10-23-final/benchmark-summary.json`: three mobile Lighthouse runs per route on that local production build; medians below.

| Local route | Performance median | LCP | TBT | CLS |
| --- | ---: | ---: | ---: | ---: |
| `/` | 94 | 3.118 s | 30 ms | 0 |
| `/projects/astropixel` | 94 | 3.118 s | 32 ms | 0 |
| `/components/overlapping-text-hero` | 93 | 3.232 s | 23 ms | 0 |

Thresholds remain performance ≥90, LCP ≤2.5 s, TBT ≤200 ms, CLS ≤0.1, with three successful samples per route. Do not reduce thresholds, switch throttling methods, remove animations for the test, or substitute an empty/error page to obtain a pass.

The preview `https://creative-portfolio-1jll6h7ny.vercel.app` built successfully and served the portfolio over HTTP/2. Its three-run medians were 93 / 3.190 s for home, 92 / 3.268 s for AstroPixel and 80 / 4.750 s for the component page. These remote-preview results are recorded separately in `audit-results/2026-10-23-preview/`; they are not measurements of `jayant.codes` and do not include the later label-color fix. Preview toolbar/network conditions also differ from production.

Font-preload experiments did not consistently meet the gate and were reverted. A single diagnostic score of 96 or LCP of 2.788 s is not a release pass. Follow-up changes and their results must be recorded below before replacing the candidate verdict.

## Dependency findings

The refreshed production dependency audit reports zero known vulnerabilities. The complete dependency tree has one high-severity development/build advisory: `braces` 3.0.3, [GHSA-vfj7-8cjw-p6xm](https://github.com/advisories/GHSA-vfj7-8cjw-p6xm), nested-pattern stack exhaustion. No patched version was advertised in the audit response. It is used by development/build tooling; avoid accepting untrusted build/glob patterns. Record this residual exposure rather than claiming the entire tree is clean. CI blocks production dependency advisories and records the full tree separately.

## Live deployment and external evidence

On 23 October, `jayant.codes` returned 200, while its `llms.txt` and Vercel insights script still returned 404. The candidate source has not been promoted to production. Both `jayantpotdar.in` and `www.jayantpotdar.in` redirected directly with 308 to the matching `jayant.codes` path and query.

Search Console ownership, sitemap Success and accepted indexing request are owner-provided evidence. Actual indexing, selected canonical, impressions, rankings and 28-day field Core Web Vitals cannot be inferred from them. Vercel project-level enablement and unit dispatch likewise do not prove dashboard receipt.

## Follow-up verification

The latest clean preview build is `https://creative-portfolio-77tf5vhtt.vercel.app`. Its homepage, `llms.txt` and Vercel insights script returned 200. Vercel correctly attaches `X-Robots-Tag: noindex` to the preview. This is not the live production domain; analytics is intentionally enabled only on `jayant.codes` in the application.

The final candidate is running at `http://localhost:3000`. The completed full run under `audit-results/2026-10-23-final/` passes 11 of 12 gates; mobile LCP fails. This run predates the approved mobile scaling. The subsequent scaling build ID is `ZiMos_D59_JyAXiT82tux`, with targeted results under `audit-results/2026-10-23-scaled/`. Earlier navigation-only medians remained above the LCP gate (3.119 / 3.194 / 2.937 seconds).

Visual evidence under `audit-results/2026-10-23-candidate/`:

- `home-final.png`: compared with the saved 22 October desktop baseline; same typography, layout, content and artwork. Continuous animation phases differ.
- `component-mobile.png`: at 390 pixels, the preview frame fits, but the original large Spider-Man headline is clipped inside its 375-pixel logical viewport.
- `component-mobile-scaled-proposal.png`: browser-only proposal rendering the original 1280×800 canvas scaled to the available width. This shows the complete title, changes the preview's displayed height and does not edit the component source. The owner approved this proposal, and it has now been applied to the repository. The actual implementation screenshot is `audit-results/2026-10-23-scaled/component-mobile.png`: the full Spider-Man title fits, and the surrounding design is preserved.

Post-scaling verification: all 18 browser/preset/width checks pass; desktop and mobile axe scans both report zero violations; all six component source/display-code parity checks pass. The clean production build succeeded. Three fresh mobile Lighthouse runs on the scaled component page report median performance 93, LCP 3.234 seconds, TBT 16 ms and CLS 0 (`audit-results/2026-10-23-scaled/performance-summary.json`). Scaling introduces no measured layout shift; the existing LCP gate still fails. The latest Vercel preview above predates this scaling change.

Do not promote a candidate while its release gate is failing. Pending external evidence remains listed above.
