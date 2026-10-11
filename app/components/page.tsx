import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { ContactStrip, Footer } from "@/components/Paper";
import { siteUrl } from "@/lib/site";
import { CRAFT_COMPONENTS } from "@/lib/components-data";
import { ComponentsCatalogClient } from "@/components/showcase/ComponentsCatalogClient";

export const metadata: Metadata = {
  title: "Components | Rare Creative Motion Library | Jayant Potdar",
  description:
    "Rare and unique animated React components built with Framer Motion and Tailwind CSS. Interactive sandboxes, reactive controls, and copy-paste code.",
  alternates: {
    canonical: "/components",
  },
  openGraph: {
    title: "Components | Jayant Potdar",
    description:
      "Rare animated React components built with Framer Motion and Tailwind CSS.",
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
    name: "Rare Animated Components",
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

        {/* Page Header (RareUI style: centered, clean, elegant) */}
        <header className="mb-12 flex flex-col items-center text-center gap-3">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--ca-ink)]">
            6+ rare and unique components
          </h1>
          <p className="max-w-xl text-sm sm:text-base font-sans text-[var(--ca-ink)]/70 leading-relaxed">
            Every component is a single file you own, not a bloated dependency. Crafted with pure Framer Motion physics and Tailwind CSS.{" "}
            <span className="font-mono text-xs text-[var(--ca-orange)]">
              [ Hover to inspect ]
            </span>
          </p>
        </header>

        {/* Interactive Catalog Section */}
        <main className="mb-20">
          <ComponentsCatalogClient />
        </main>
      </div>

      <ContactStrip />
      <Footer />
    </div>
  );
}
