import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight, ArrowRight } from "lucide-react";
import { ContactStrip, Footer } from "@/components/Paper";
import { siteUrl } from "@/lib/site";
import { CRAFT_COMPONENTS } from "@/lib/components-data";
import { ComponentsCatalogClient } from "@/components/showcase/ComponentsCatalogClient";

export const metadata: Metadata = {
  title: "React Components",
  description:
    "Explore animated React components built by Jayant Potdar with Framer Motion and Tailwind CSS. Try the interactive demos and inspect the code.",
  alternates: {
    canonical: "/components",
  },
  openGraph: {
    title: "Components | Jayant Potdar",
    description:
      "Animated React components with interactive demos and code by Jayant Potdar.",
    url: `${siteUrl}/components`,
  },
};

export default function ComponentsPage() {
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Components",
        item: `${siteUrl}/components`,
      },
    ],
  };

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Animated React Components",
    url: `${siteUrl}/components`,
    description:
      "Curated React and Framer Motion micro-interactions and UI components.",
    hasPart: CRAFT_COMPONENTS.map((c) => ({
      "@type": "CreativeWork",
      name: c.name,
      url: `${siteUrl}/components/${c.slug}`,
      description: c.tagline,
    })),
  };

  return (
    <div className="min-h-screen pt-12 sm:pt-16 pb-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs font-mono font-semibold text-[var(--ca-ink)]/60"
        >
          <Link href="/" className="hover:text-[var(--ca-orange)] transition-colors">
            Home
          </Link>
          <ChevronRight size={13} />
          <span className="text-[var(--ca-ink)]">
            Components
          </span>
        </nav>

        {/* Page Header */}
        <header className="mb-14 flex flex-col items-center text-center gap-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--ca-ink)]">
            Animated React Components
          </h1>
          <p className="max-w-xl text-sm sm:text-base font-sans text-[var(--ca-ink)]/70 leading-relaxed">
            A collection of interactive components I built to explore motion, feedback, and expressive web interfaces with Framer Motion and Tailwind CSS.
          </p>
        </header>

        {/* Interactive Catalog Section */}
        <div className="mb-14">
          <ComponentsCatalogClient />
        </div>

        {/* More Components Coming Soon Teaser */}
        <section className="mb-20 flex flex-col items-center justify-center text-center">
          <div className="relative w-full max-w-2xl rounded-2xl border border-dashed border-[var(--ca-ink)]/15 bg-white/70 p-8 sm:p-10 shadow-[0_4px_24px_-4px_rgba(25,21,16,0.04)] backdrop-blur-xs">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ca-ink)]">
              More components coming soon
            </h2>

            <p className="mt-2 text-xs sm:text-sm font-sans text-[var(--ca-ink)]/65 max-w-md mx-auto leading-relaxed">
              New physics micro-interactions, scroll choreographies, and canvas shaders are in the works and will be added regularly.
            </p>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-1.5 text-xs font-mono text-[var(--ca-ink)]/55">
              <span>Looking for a specific interaction?</span>
              <Link
                href="/contact"
                className="font-semibold text-[var(--ca-orange)] hover:underline inline-flex items-center gap-1 transition-colors"
              >
                <span>Suggest a craft</span>
                <ArrowRight size={13} />
              </Link>
            </div>
          </div>
        </section>
      </div>

      <ContactStrip />
      <Footer />
    </div>
  );
}
