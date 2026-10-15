import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ExternalLink,
  ChevronRight,
  Star,
  Eye,
  FileText,
  ArrowRight,
  Layers,
  Wrench,
  ArrowUpRight,
} from "lucide-react";
import { Footer, Scribble, Tape } from "@/components/Paper";
import { RelatedProjectCard } from "@/components/FolderCard";
import { ProjectShowcaseStage } from "@/components/ProjectShowcaseStage";
import { noteBySlug, projectBySlug, projects, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projectBySlug(params.slug);
  if (!project) return {};

  const title = `${project.title} — Project Case Study`;
  const description = `${project.title}: ${project.tagline}. Read Jayant Potdar's case study, see the source code, and explore the live demo.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/projects/${project.slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${siteUrl}/projects/${project.slug}`,
      images: [
        {
          url: `${siteUrl}${project.hero}`,
          width: 1200,
          height: 630,
          alt: `${project.title} system interface screenshot`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${project.title} — Jayant Potdar`,
      description,
      images: [`${siteUrl}${project.hero}`],
    },
  };
}

function GithubIcon({ className = "h-4 w-4" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

export default function ProjectDetailPage({ params }: { params: { slug: string } }) {
  const project = projectBySlug(params.slug);
  if (!project) notFound();

  const currentIdx = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = projects[(currentIdx + 1) % projects.length];
  const relatedNote = project.relatedNoteSlug ? noteBySlug(project.relatedNoteSlug) : undefined;
  const relatedProjects = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    applicationCategory: "Web Application",
    applicationSubCategory: project.category.join(", "),
    operatingSystem: "Web Browser",
    description: project.summary,
    url: project.demo || project.source,
    mainEntityOfPage: `${siteUrl}/projects/${project.slug}`,
    sameAs: project.source,
    image: `${siteUrl}${project.hero}`,
    author: {
      "@id": `${siteUrl}/#jayant`,
    },
    inLanguage: "en-IN",
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
        name: "Projects",
        item: `${siteUrl}/projects`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: project.title,
        item: `${siteUrl}/projects/${project.slug}`,
      },
    ],
  };

  const ownershipBg = project.ownership.includes("Solo")
    ? "var(--ca-cyan)"
    : project.ownership.includes("Leader")
    ? "var(--ca-yellow-soft)"
    : "var(--ca-mint)";

  return (
    <div className="ca-grid min-h-screen pt-10 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Layer 1: Recruiter-First Header (0–5 Seconds Law) */}
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1.5 text-xs ca-mono font-semibold text-[var(--ca-ink)]/70">
          <Link href="/" className="inline-flex min-h-[44px] items-center px-1.5 hover:text-[var(--ca-blue)]">
            Home
          </Link>
          <ChevronRight size={14} className="shrink-0 text-[var(--ca-ink)]/40" />
          <Link href="/projects" className="inline-flex min-h-[44px] items-center px-1.5 hover:text-[var(--ca-blue)]">
            Projects
          </Link>
          <ChevronRight size={14} className="shrink-0 text-[var(--ca-ink)]/40" />
          <span className="inline-flex min-h-[44px] items-center px-1.5 text-[var(--ca-ink)] font-bold truncate max-w-[200px] min-[400px]:max-w-[280px] sm:max-w-none">
            {project.title}
          </span>
        </nav>

        {/* Recruiter-First Header Hero */}
        <header className="pb-10 sm:pb-14">
          {/* Metadata Badges Row */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Date Badge */}
            <span className="ca-mono inline-flex items-center gap-1.5 rounded-full border border-[var(--ca-ink)]/20 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
              <span className="h-2 w-2 rounded-full bg-[var(--ca-blue)] animate-pulse" />
              {project.date}
            </span>

            {/* Ownership Badge */}
            <span
              className="ca-mono inline-block rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] border border-[var(--ca-ink)]/20 shadow-2xs"
              style={{ backgroundColor: ownershipBg }}
            >
              {project.ownership}
            </span>

            {/* Category / Domain Tags */}
            {project.category.map((cat) => (
              <span
                key={cat}
                className="ca-mono inline-block rounded-full border border-[var(--ca-ink)]/20 bg-white px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/80 shadow-2xs"
              >
                {cat}
              </span>
            ))}

            {/* Public Proof Metrics */}
            {project.metrics && (
              <div className="flex items-center gap-1.5">
                <span className="ca-mono inline-flex items-center gap-1 rounded-full border border-[var(--ca-ink)]/20 bg-white px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-2xs" title="GitHub Stars">
                  <Star size={12} className="text-amber-500 fill-amber-500" />
                  {project.metrics.stars}
                </span>
                <span className="ca-mono inline-flex items-center gap-1 rounded-full border border-[var(--ca-ink)]/20 bg-white px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-2xs" title="Project Views">
                  <Eye size={12} className="text-emerald-600" />
                  {project.metrics.views}
                </span>
              </div>
            )}
          </div>

          {/* Massive Display Title */}
          <h1 className="ca-display mt-4 text-5xl min-[390px]:text-6xl sm:text-7xl md:text-8xl lg:text-9xl uppercase leading-[0.92] tracking-tight text-[var(--ca-ink)]">
            {project.title}
          </h1>

          {/* High-Signal Tagline */}
          <p className="mt-3 text-lg font-bold text-[var(--ca-blue)] sm:text-2xl">
            {project.tagline}
          </p>

          {/* Recruiter Quick Actions: Immediate proof access (0-3s scan right under title & tagline) */}
          <div className="mt-5 flex flex-wrap items-center gap-3.5">
            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="ca-mono inline-flex min-h-[44px] items-center gap-2 rounded-sm border-2 border-[var(--ca-ink)] bg-[var(--ca-blue)] px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0_var(--ca-ink)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--ca-ink)]"
              >
                <ExternalLink size={15} />
                Launch Live App
              </a>
            )}

            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="ca-mono inline-flex min-h-[44px] items-center gap-2 rounded-sm border-2 border-[var(--ca-ink)] bg-white px-5 py-2.5 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[3px_3px_0_var(--ca-ink)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--ca-yellow)]"
            >
              <GithubIcon className="h-4 w-4" />
              View Source
            </a>

            {relatedNote && (
              <Link
                href={`/notes/${relatedNote.slug}`}
                className="ca-mono inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-[var(--ca-ink)]/30 bg-[var(--ca-surface)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs transition-colors hover:bg-white"
              >
                <FileText size={14} className="text-[var(--ca-blue)]" />
                Engineering Deep Dive
              </Link>
            )}
          </div>

          {/* Executive Summary */}
          <p className="mt-5 max-w-3xl text-base leading-relaxed text-[var(--ca-ink)]/85 sm:text-xl font-medium">
            {project.summary}
          </p>
        </header>

        {/* Layer 2: Visual Proof Showcase Stage (5–15 Seconds Law) */}
        <ProjectShowcaseStage
          title={project.title}
          slug={project.slug}
          hero={project.hero}
          images={project.images}
          demo={project.demo}
          source={project.source}
          color={project.color}
        />

        {/* Editorial Story Section: Challenge, Architectural Approach, Results & Metrics */}
        <section className="mb-20 sm:mb-28 text-center" aria-labelledby="story-challenge-heading">
          {/* 1. The Challenge */}
          <div className="text-center">
            <Scribble withDoodle>
              <span id="story-challenge-heading">the challenge</span>
            </Scribble>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base sm:text-lg text-[var(--ca-ink)]/90 leading-relaxed font-medium">
            {project.challenge || project.problem}
          </p>

          {/* 2. Architectural Approach */}
          <div className="mt-16 sm:mt-20 text-center">
            <Scribble withDoodle>
              <span>architectural approach</span>
            </Scribble>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base sm:text-lg text-[var(--ca-ink)]/90 leading-relaxed font-medium">
            {project.approach || project.personalContribution}
          </p>

          {/* 3. The Results & Metrics */}
          <div className="mt-16 sm:mt-20 text-center">
            <Scribble withDoodle>
              <span>what shipped</span>
            </Scribble>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base sm:text-lg text-[var(--ca-ink)]/90 leading-relaxed font-medium">
            {project.results}
          </p>

          {/* The 3 Tactile Scalloped Metric Stamp Cards */}
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-3 max-w-4xl mx-auto">
            {project.outcomes.map((outcome, idx) => {
              const bgColors = ["var(--ca-cyan)", "var(--ca-yellow-soft)", "var(--ca-mint)"];
              const angles = [-1.5, 1.2, -1];
              const bg = bgColors[idx % bgColors.length];
              const angle = angles[idx % angles.length];

              return (
                <div
                  key={outcome.label}
                  className="ca-stamp-note relative flex flex-col justify-center p-6 text-center shadow-md min-h-[140px] transition-transform duration-200 hover:rotate-0 hover:scale-105"
                  style={{
                    backgroundColor: bg,
                    transform: `rotate(${angle}deg)`,
                  }}
                >
                  <Tape
                    className="-top-2.5 left-6"
                    angle={angle * -8}
                    color={["var(--ca-yellow-soft)", "var(--ca-pink-soft)", "var(--ca-cyan)"][idx % 3]}
                  />
                  <strong className="text-3xl font-extrabold tracking-tight text-[var(--ca-ink)] sm:text-4xl">
                    {outcome.value}
                  </strong>
                  <span className="ca-mono mt-2 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/85">
                    {outcome.label}
                  </span>
                </div>
              );
            })}
          </div>
        </section>

        {/* Layer 4: System Blueprint & Technical Specs (Clean, Minimalist Tech Folio) */}
        <div
          role="region"
          aria-labelledby="blueprint-heading"
          className="relative mb-16 sm:mb-20 rounded-2xl border-2 border-[var(--ca-ink)]/15 bg-white/95 p-6 sm:p-8 md:p-9 shadow-[4px_6px_0_rgba(25,21,16,0.06)]"
        >
          {/* Subtle scrapbook washi tape accent */}
          <Tape className="-top-2.5 right-8 z-10" angle={3} color="var(--ca-cyan)" />

          {/* Section Header: Title + Inline Architectural Deep Dive link */}
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[var(--ca-ink)]/10 pb-5">
            <div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--ca-blue)] animate-pulse" />
                <span className="ca-mono text-[11px] font-bold uppercase tracking-widest text-[var(--ca-blue)]">
                  System Blueprint
                </span>
              </div>
              <h2
                id="blueprint-heading"
                className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ca-ink)]"
              >
                Technical Specs &amp; Highlights
              </h2>
            </div>

            {relatedNote && (
              <Link
                href={`/notes/${relatedNote.slug}`}
                className="ca-mono group inline-flex items-center gap-2 rounded-full border border-[var(--ca-ink)]/20 bg-[var(--ca-surface)] px-3.5 py-1.5 text-xs font-bold text-[var(--ca-ink)] shadow-2xs transition-all duration-200 hover:border-[var(--ca-blue)] hover:bg-white hover:text-[var(--ca-blue)]"
              >
                <FileText size={13} className="text-[var(--ca-blue)] transition-transform duration-200 group-hover:scale-110" />
                <span>Technical Writeup ({relatedNote.readTime})</span>
                <ArrowUpRight size={13} className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>

          {/* Block 1: Technologies & Architecture */}
          <div className="pt-6">
            <div className="mb-3.5 flex items-center justify-between">
              <span className="ca-mono flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/70">
                <Layers size={14} className="text-[var(--ca-blue)]" />
                Technologies &amp; Architecture
              </span>
              <span className="ca-mono text-[11px] font-semibold text-[var(--ca-ink)]/45">
                {project.technologies.length} core technologies
              </span>
            </div>

            {project.categorizedTech && project.categorizedTech.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {project.categorizedTech.map((group) => (
                  <div key={group.category} className="space-y-2">
                    <span className="ca-mono block text-[11px] font-bold uppercase tracking-wider text-[var(--ca-ink)]/50">
                      {group.category}
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {group.items.map((tech) => (
                        <span
                          key={tech}
                          className="ca-mono rounded-md border border-[var(--ca-ink)]/15 bg-[var(--ca-surface)] px-2.5 py-1 text-xs font-semibold text-[var(--ca-ink)] transition-colors duration-150 hover:border-[var(--ca-ink)]/40 hover:bg-white"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech) => (
                  <span
                    key={tech}
                    className="ca-mono rounded-md border border-[var(--ca-ink)]/15 bg-[var(--ca-surface)] px-3 py-1.5 text-xs font-semibold text-[var(--ca-ink)] transition-colors duration-150 hover:border-[var(--ca-ink)]/40 hover:bg-white"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Elegant subtle divider */}
          <div className="my-6 sm:my-7 border-t border-[var(--ca-ink)]/10" />

          {/* Block 2: Core Engineering Highlights */}
          <div>
            <div className="mb-3.5 flex items-center gap-1.5">
              <Wrench size={14} className="text-[var(--ca-blue)]" />
              <span className="ca-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/70">
                Core Engineering Highlights
              </span>
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {project.technicalHighlights.slice(0, 4).map((highlight, idx) => (
                <div
                  key={idx}
                  className="group flex items-start gap-3 rounded-lg border border-[var(--ca-ink)]/10 bg-[var(--ca-surface)]/70 p-3.5 transition-all duration-200 hover:border-[var(--ca-ink)]/25 hover:bg-white hover:shadow-2xs"
                >
                  <span className="ca-mono mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-xs bg-[var(--ca-yellow-soft)] text-[11px] font-bold text-[var(--ca-ink)] transition-colors duration-200 group-hover:bg-[var(--ca-yellow)]">
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                  <p className="text-xs sm:text-sm font-medium leading-relaxed text-[var(--ca-ink)]/90">
                    {highlight}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>


        {/* Layer 6: Recruiter High-Conversion Action Banner */}
        <section className="mb-20 sm:mb-28 overflow-hidden rounded-xl border-3 border-[var(--ca-ink)] bg-[var(--ca-yellow)] p-8 sm:p-12 shadow-[6px_8px_0_var(--ca-ink)] text-center">
          <h2 className="ca-display text-4xl sm:text-6xl uppercase tracking-tight text-[var(--ca-ink)]">
            Looking for this skill set?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base font-semibold text-[var(--ca-ink)]/85 sm:text-lg">
            Jayant is open to full-stack engineering roles, internships, and high-impact software challenges.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="ca-mono inline-flex min-h-[44px] items-center gap-2 rounded-sm border-2 border-[var(--ca-ink)] bg-[var(--ca-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0_white] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--ca-blue)]"
            >
              Get In Touch With Jayant
              <ArrowRight size={14} />
            </Link>
            <Link
              href={`/projects/${nextProject.slug}`}
              className="ca-mono inline-flex min-h-[44px] items-center gap-2 rounded-sm border-2 border-[var(--ca-ink)] bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[3px_3px_0_var(--ca-ink)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--ca-yellow-soft)]"
            >
              Next Project: {nextProject.title}
              <ChevronRight size={14} />
            </Link>
          </div>
        </section>

        {/* Layer 7: More Projects Discovery */}
        <section className="mb-20 sm:mb-28 border-t-2 border-[var(--ca-ink)]/15 pt-16" aria-labelledby="related-heading">
          <div className="flex flex-col items-center text-center">
            <Scribble withDoodle>
              <span id="related-heading">more projects</span>
            </Scribble>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2">
            {relatedProjects.map((item) => (
              <RelatedProjectCard key={item.slug} project={item} />
            ))}
          </div>
        </section>
      </article>

      <Footer />
    </div>
  );
}
