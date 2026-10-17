import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Paper";
import { siteUrl } from "@/lib/site";
import { CRAFT_COMPONENTS, getComponentBySlug } from "@/lib/components-data";
import { HookSidebar } from "@/components/showcase/HookSidebar";
import { ComponentPlayground } from "@/components/showcase/playground/ComponentPlayground";
import { InstallSection } from "@/components/showcase/InstallSection";
import { PropsTable } from "@/components/showcase/PropsTable";
import { ComponentTransition } from "@/components/showcase/ComponentTransition";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const params = CRAFT_COMPONENTS.map((comp) => ({
    slug: comp.slug,
  }));
  params.push({ slug: "radial-gradient-animate-card" });
  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const component = getComponentBySlug(params.slug);
  if (!component) {
    return {
      title: "Component Not Found",
    };
  }

  return {
    title: `${component.name} React Component`,
    description: `${component.tagline} Live interactive sandbox, reactive controls, props schema, and copy-paste code.`,
    alternates: {
      canonical: `/components/${params.slug}`,
    },
    openGraph: {
      title: `${component.name} | Jayant Potdar`,
      description: component.tagline,
      url: `${siteUrl}/components/${params.slug}`,
      images: [
        {
          url: `${siteUrl}${component.thumbnail}`,
          width: 1200,
          height: 630,
          alt: component.name,
        },
      ],
    },
  };
}

export default function ComponentDetailPage({ params }: PageProps) {
  const component = getComponentBySlug(params.slug);

  if (!component) {
    notFound();
  }

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
      {
        "@type": "ListItem",
        position: 3,
        name: component.name,
        item: `${siteUrl}/components/${params.slug}`,
      },
    ],
  };

  const techArticleJsonLd = {
    "@context": "https://schema.org",
    "@type": "TechArticle",
    headline: component.name,
    description: component.description,
    dependencies: component.dependencies.join(", "),
    author: {
      "@type": "Person",
      name: "Jayant Potdar",
      url: siteUrl,
    },
  };

  return (
    <div className="min-h-screen pt-8 sm:pt-12 pb-12 sm:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(techArticleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav
          aria-label="Breadcrumb"
          className="mb-5 flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-[var(--ca-ink)]/60"
        >
          <Link href="/" className="hover:text-[var(--ca-orange)] transition-colors">
            Home
          </Link>
          <ChevronRight size={13} />
          <Link href="/components" className="hover:text-[var(--ca-orange)] transition-colors">
            Components
          </Link>
          <ChevronRight size={13} />
          <span className="text-[var(--ca-ink)]">{component.name}</span>
        </nav>

        {/* Mobile Compact Contents Switcher */}
        <div className="mb-5 lg:hidden w-full flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white/90 dark:bg-[#121316]/90 border border-[var(--ca-ink)]/15 dark:border-white/10 shadow-xs">
          <Link
            href="/components"
            className="inline-flex items-center gap-1 font-mono text-xs font-medium text-[var(--ca-ink)]/70 hover:text-[var(--ca-orange)] transition-colors"
          >
            <ArrowLeft size={13} />
            <span>Catalog</span>
          </Link>

          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[10px] font-bold text-[#0284c7] uppercase">
              CONTENTS:
            </span>
            <span className="font-mono text-xs font-semibold text-[var(--ca-ink)] dark:text-white truncate max-w-[150px]">
              {component.name}
            </span>
          </div>
        </div>

        {/* Two-Column Layout: Left Sticky Contents Rail + Right Main Content Column */}
        <div className="flex items-start gap-8 lg:gap-10">
          {/* Left Rail: Contents Navigation */}
          <HookSidebar currentComponent={component} />

          {/* Right Main Content Column */}
          <div id="component-content" className="flex-1 min-w-0">
            <ComponentTransition slug={component.slug}>
              {/* Compact Component Heading Block */}
              <header className="flex flex-col gap-2 mb-0">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-[var(--ca-ink)] dark:text-white font-sans">
                  {component.name}
                </h1>

                <p className="text-xs sm:text-sm font-sans text-[var(--ca-ink)]/75 dark:text-neutral-400 leading-relaxed max-w-2xl">
                  {component.description}
                </p>

                {/* Dependencies badge */}
                <div className="flex items-center gap-2 pt-0.5">
                  <span className="text-[10px] font-mono text-[var(--ca-ink)]/50 dark:text-neutral-500 uppercase tracking-wider">
                    Dependencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {component.dependencies.map((dep) => (
                      <code
                        key={dep}
                        className="px-2 py-0.5 rounded-md bg-[var(--ca-ink)]/5 dark:bg-white/10 border border-[var(--ca-ink)]/10 dark:border-white/10 font-mono text-xs text-[var(--ca-ink)]/80 dark:text-neutral-300"
                      >
                        {dep}
                      </code>
                    ))}
                  </div>
                </div>
              </header>

              {/* Exact Page Hierarchy matching Excalidraw:
                  1. Preview
                  2. Examples (3 compact thumbnail row)
                  3. Customize (full-width field grid after Examples)
              */}
              <ComponentPlayground component={component} />

              {/* 4. Installation & Prerequisites */}
              <InstallSection component={component} />

              {/* 5. Props Specification Table */}
              <PropsTable component={component} />
            </ComponentTransition>
          </div>
        </div>
      </div>

      <div className="mt-12 sm:mt-16 border-t border-[var(--ca-ink)]/10 dark:border-white/10">
        <Footer />
      </div>
    </div>
  );
}
