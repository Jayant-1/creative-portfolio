import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { ContactStrip, Footer, Scribble, Tape } from "@/components/Paper";
import { StaggerText } from "@/components/Motion";
import Reveal from "@/components/Reveal";
import { siteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: "Engineering Blog — Coming Soon | Jayant Potdar",
  description:
    "Engineering write-ups and technical breakdowns by Jayant Potdar are coming soon: deep-zoom geospatial pipelines, visual DAG neural network compilers, and multi-signal search algorithms.",
  alternates: {
    canonical: "/blog",
  },
  openGraph: {
    title: "Engineering Blog — Coming Soon | Jayant Potdar",
    description:
      "Technical deep dives on GDAL tile pyramids, Keras code compilers, and academic search ranking by Jayant Potdar in Pune.",
    url: `${siteUrl}/blog`,
  },
};

export default function BlogPage() {
  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebPage",
    name: "Engineering Blog by Jayant Potdar — Coming Soon",
    url: `${siteUrl}/blog`,
    description:
      "Technical deep dives and software engineering architecture write-ups by Jayant Potdar are coming soon.",
    author: {
      "@id": `${siteUrl}/#jayant`,
    },
  };

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
        name: "Blog",
        item: `${siteUrl}/blog`,
      },
    ],
  };

  return (
    <div className="ca-grid min-h-screen pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex items-center gap-2 text-xs ca-mono font-semibold text-[var(--ca-ink)]/70"
        >
          <Link href="/" className="hover:text-[var(--ca-blue)]">
            Home
          </Link>
          <ChevronRight size={14} />
          <span className="text-[var(--ca-ink)] font-bold">Blog</span>
        </nav>

        {/* Page Header */}
        <header className="mb-10 text-center">
          <Scribble withDoodle>
            architecture write-ups &amp; deep dives
          </Scribble>

          <h1 className="ca-display mt-4 text-5xl min-[390px]:text-6xl sm:text-8xl md:text-9xl uppercase leading-none tracking-tight text-[var(--ca-ink)]">
            <StaggerText text="ENGINEERING BLOG" stagger={0.035} />
          </h1>
        </header>

        {/* Wider, Clean & Elevated Coming Soon Card */}
        <Reveal delay={150}>
          <div className="ca-doodle-box relative mx-auto mb-20 max-w-4xl border-[3px] border-[var(--ca-ink)] bg-white px-6 py-12 sm:px-12 sm:py-16 text-center shadow-[8px_12px_0_var(--ca-ink)]">
            <Tape
              className="-left-4 sm:-left-6 -top-3.5"
              angle={-8}
              color="var(--ca-yellow-soft)"
            />
            <Tape
              className="-right-4 sm:-right-6 -top-3.5"
              angle={8}
              color="var(--ca-cyan)"
            />

            {/* Status indicator without repeating 'Coming Soon' */}
            <div className="inline-flex items-center gap-2 rounded-full border border-[var(--ca-ink)]/20 bg-[var(--ca-paper)] px-3.5 py-1 text-xs font-bold ca-mono uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--ca-blue)] opacity-75"></span>
                <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--ca-blue)]"></span>
              </span>
              Drafting In Progress
            </div>

            {/* Increased Font Size Headline */}
            <h2 className="ca-display mt-4 text-5xl sm:text-7xl md:text-8xl uppercase leading-none tracking-tight text-[var(--ca-ink)]">
              Blogs are Coming Soon
            </h2>

            <p className="ca-mono mx-auto mt-4 max-w-xl text-sm sm:text-base leading-relaxed text-[var(--ca-ink)]/75">
              Technical breakdowns, architecture deep-dives, and production notes are currently in the works.
            </p>

            {/* Action CTA */}
            <div className="mt-8">
              <Link
                href="/projects"
                className="ca-mono inline-flex min-h-[44px] items-center gap-2 bg-[var(--ca-ink)] px-7 py-3 text-xs font-bold uppercase tracking-widest text-white transition-colors hover:bg-[var(--ca-blue)] active:scale-98"
              >
                Explore Projects
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        </Reveal>
      </div>

      <ContactStrip />
      <Footer />
    </div>
  );
}
