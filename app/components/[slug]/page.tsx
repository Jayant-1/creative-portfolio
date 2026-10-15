import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, ArrowLeft } from "lucide-react";
import { Footer } from "@/components/Paper";
import { siteUrl } from "@/lib/site";
import { CRAFT_COMPONENTS, getComponentBySlug } from "@/lib/components-data";
import { HookSidebar } from "@/components/showcase/HookSidebar";
import { ComponentSandbox } from "@/components/showcase/ComponentSandbox";
import { ComponentVariants } from "@/components/showcase/ComponentVariants";
import { CodeViewer } from "@/components/showcase/CodeViewer";
import { PropsTable } from "@/components/showcase/PropsTable";
import { ComponentTransition } from "@/components/showcase/ComponentTransition";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return CRAFT_COMPONENTS.map((comp) => ({
    slug: comp.slug,
  }));
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
          __html: JSON.stringify(techArticleJsonLd).replace(/</g, "\\u003c"),
        }}
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav
          aria-label="Breadcrumb"
          className="mb-6 flex flex-wrap items-center gap-2 text-xs font-mono font-semibold text-[var(--ca-ink)]/60"
        >
          <Link href="/" className="hover:text-[var(--ca-orange)] transition-colors">
            Home
          </Link>
          <ChevronRight size={13} />
          <Link href="/components" className="hover:text-[var(--ca-orange)] transition-colors">
            Components
          </Link>
          <ChevronRight size={13} />
          <span className="text-[var(--ca-ink)]">
            {component.name}
          </span>
        </nav>

        {/* Mobile Back Link */}
        <div className="mb-4 lg:hidden">
          <Link
            href="/components"
            className="inline-flex items-center gap-1.5 font-mono text-xs font-medium text-[var(--ca-ink)]/70 hover:text-[var(--ca-orange)] transition-colors"
          >
            <ArrowLeft size={14} />
            <span>All Components</span>
          </Link>
        </div>

        {/* Two-Column Layout: RareUI Hook Sidebar (Left) + Main Content (Right) */}
        <div className="flex items-start gap-8 lg:gap-10">
          {/* Hook Sidebar */}
          <HookSidebar currentComponent={component} />

          {/* Main Content Area */}
          <div className="flex-1 min-w-0">
            <ComponentTransition slug={component.slug}>
              {/* Component Header Block */}
              <header className="flex flex-col gap-3">
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-[var(--ca-ink)]">
                  {component.name}
                </h1>

                <p className="text-sm sm:text-base font-sans text-[var(--ca-ink)]/75 leading-relaxed max-w-3xl">
                  {component.description}
                </p>

                {/* Dependencies badge */}
                <div className="flex items-center gap-2 pt-1">
                  <span className="text-[11px] font-mono text-[var(--ca-ink)]/50 uppercase tracking-wider">
                    Dependencies:
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {component.dependencies.map((dep) => (
                      <code
                        key={dep}
                        className="px-2 py-0.5 rounded-md bg-[var(--ca-ink)]/5 border border-[var(--ca-ink)]/10 font-mono text-xs text-[var(--ca-ink)]/80"
                      >
                        {dep}
                      </code>
                    ))}
                  </div>
                </div>
              </header>

              {/* Section 1 (Preview & Demo Stage) + Section 2 (Customize Sidebar Frame) */}
              {/* Renders main/div/div[1] containing div[1] (stage) and div[2] (customize) */}
              <ComponentSandbox component={component} />

              {/* Section 3 (Examples Section) */}
              {/* Renders main/div/section[1] */}
              <ComponentVariants component={component} />

              {/* Section 4 (Props Specification Table) */}
              {/* Renders main/div/section[2] */}
              <PropsTable component={component} />

              {/* Section 5 (Installation & CLI Section) */}
              {/* Renders main/div/div[2] */}
              <CodeViewer component={component} />
            </ComponentTransition>
          </div>
        </div>
      </div>

      <div className="mt-20 border-t border-[var(--ca-ink)]/10">
        <Footer />
      </div>
    </div>
  );
}
