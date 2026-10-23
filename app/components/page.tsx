import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ContactStrip, Footer } from "@/components/Paper";
import { siteUrl } from "@/lib/site";
import { CRAFT_COMPONENTS } from "@/lib/components-data";
import { getBreadcrumbSchema } from "@/lib/schema";
import { ComponentsCatalogClient } from "@/components/showcase/ComponentsCatalogClient";

export const metadata: Metadata = {
  title: "React Components",
  description:
    "Explore the animated React components I've built with Framer Motion and Tailwind CSS. Try my interactive demos and inspect the code.",
  keywords: [
    "React Components",
    "Framer Motion UI",
    "Interactive UI Components",
    "Tailwind CSS Components",
    "Micro-Interactions",
    "UI Sandbox",
    "Jayant Potdar Components",
    "Web Crafts",
  ],
  alternates: {
    canonical: `${siteUrl}/components`,
  },
  openGraph: {
    title: "React Components | Jayant Potdar",
    description:
      "My animated React components with interactive demos and code.",
    url: `${siteUrl}/components`,
    images: [
      {
        url: "/og",
        width: 1200,
        height: 630,
        alt: "My React components",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "React Components | Jayant Potdar",
    description:
      "My animated React components with interactive demos and copy-paste code.",
    images: ["/og"],
  },
};

export default function ComponentsPage() {
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Components", url: `${siteUrl}/components` },
  ]);

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "@id": `${siteUrl}/components#collection`,
    name: "Interactive React Components & UI Crafts",
    url: `${siteUrl}/components`,
    description:
      "My collection of 6 production-grade animated React components, interactive hero sections, and micro-interactions, built with Framer Motion and Tailwind CSS.",
    author: {
      "@id": `${siteUrl}/#jayant`,
    },
    mainEntity: {
      "@type": "ItemList",
      itemListElement: CRAFT_COMPONENTS.map((c, idx) => ({
        "@type": "ListItem",
        position: idx + 1,
        url: `${siteUrl}/components/${c.slug}`,
        name: c.name,
        description: c.tagline,
      })),
    },
    hasPart: CRAFT_COMPONENTS.map((c) => ({
      "@type": "SoftwareApplication",
      name: c.name,
      url: `${siteUrl}/components/${c.slug}`,
      description: c.tagline,
      applicationCategory: "DesignApplication",
      operatingSystem: "Web Browser",
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
                className="min-h-[44px] font-semibold text-[var(--ca-orange)] hover:underline inline-flex items-center gap-1 transition-colors px-1"
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
