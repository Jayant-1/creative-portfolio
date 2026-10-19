import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ChevronRight,
  Star,
  Eye,
  FileText,
  ArrowRight,
  Layers,
  Wrench,
  ArrowUpRight,
  Scale,
  CheckCircle2,
} from "lucide-react";
import { Footer, Scribble, Tape } from "@/components/Paper";
import { RelatedProjectCard } from "@/components/FolderCard";
import { ProjectShowcaseStage } from "@/components/ProjectShowcaseStage";
import { ProjectActionButtons } from "@/components/ProjectActionButtons";
import { NextProjectPrefetch } from "@/components/NextProjectPrefetch";
import { noteBySlug, projectBySlug, projects, siteUrl } from "@/lib/site";
import { getBreadcrumbSchema, getProjectCaseStudySchema } from "@/lib/schema";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) return {};

  const title = `${project.title} — ${project.headline}`;
  const description = project.seoDescription;
  const canonicalUrl = `${siteUrl}/projects/${project.slug}`;
  const heroImageUrl = `${siteUrl}${project.hero}`;

  return {
    title,
    description,
    keywords: [
      project.title,
      `${project.title} case study`,
      ...project.technologies,
      ...project.category,
      "Jayant Potdar",
      "Full Stack Project",
      "Software Engineering Case Study",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: canonicalUrl,
      images: [
        {
          url: heroImageUrl,
          width: 1200,
          height: 630,
          alt: `${project.title} system interface screenshot`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [heroImageUrl],
    },
  };
}

export default async function ProjectDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const project = projectBySlug(slug);
  if (!project) notFound();

  const currentIdx = projects.findIndex((p) => p.slug === project.slug);
  const nextProject = projects[(currentIdx + 1) % projects.length];
  const relatedNote = project.relatedNoteSlug ? noteBySlug(project.relatedNoteSlug) : undefined;
  const relatedProjects = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  const caseStudyJsonLd = getProjectCaseStudySchema(project);
  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Projects", url: `${siteUrl}/projects` },
    { name: project.title, url: `${siteUrl}/projects/${project.slug}` },
  ]);

  const ownershipBg = project.ownership.includes("Solo")
    ? "var(--ca-cyan)"
    : project.ownership.includes("Leader")
    ? "var(--ca-yellow-soft)"
    : "var(--ca-mint)";

  return (
    <div className="ca-grid min-h-screen pt-10 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(caseStudyJsonLd).replace(/</g, "\\u003c") }}
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
            {project.headline}
          </h1>

          {/* High-Signal Tagline */}
          <p className="mt-3 text-lg font-bold text-[var(--ca-blue)] sm:text-2xl">
            {project.tagline}
          </p>

          {/* Recruiter Quick Actions: Immediate proof access (0-3s scan right under title & tagline) */}
          <div className="mt-5 flex flex-wrap items-center gap-3.5">
            <ProjectActionButtons
              title={project.title}
              demo={project.demo}
              demoLabel={project.demoLabel}
              demoQualifier={project.demoQualifier}
              source={project.source}
            />

            {relatedNote && (
              <Link
                href={`/notes/${relatedNote.slug}`}
                className="ca-mono inline-flex min-h-[44px] items-center gap-2 rounded-sm border border-[var(--ca-ink)]/30 bg-[var(--ca-surface)] px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs transition-colors hover:bg-white focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
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

          {/* Recruiter Executive Metadata Strip */}
          <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 rounded-lg border border-[var(--ca-ink)]/15 bg-white/85 px-4 py-3 text-xs ca-mono text-[var(--ca-ink)]/80 shadow-2xs">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[var(--ca-ink)] uppercase">Role:</span>
              <span className="font-semibold text-[var(--ca-ink)]">{project.role}</span>
            </div>
            <div className="hidden sm:inline text-[var(--ca-ink)]/25">•</div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[var(--ca-ink)] uppercase">Timeline:</span>
              <span className="font-semibold text-[var(--ca-ink)]">{project.timeline}</span>
            </div>
            <div className="hidden sm:inline text-[var(--ca-ink)]/25">•</div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-[var(--ca-ink)] uppercase">Team:</span>
              <span className="font-semibold text-[var(--ca-ink)]">{project.team}</span>
            </div>
          </div>
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

        {/* Editorial Story Section: Challenge, Architectural Approach, What Jayant Built, Results & Metrics */}
        <section className="mb-20 sm:mb-28 text-center" aria-labelledby="story-challenge-heading">
          {/* 1. The Challenge */}
          <div className="text-center">
            <Scribble withDoodle>
              <h2 id="story-challenge-heading" className="inline text-inherit font-inherit">why I built it</h2>
            </Scribble>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base sm:text-lg text-[var(--ca-ink)]/90 leading-relaxed font-medium">
            {project.challenge || project.problem}
          </p>

          {/* 2. Architectural Approach */}
          <div className="mt-16 sm:mt-20 text-center">
            <Scribble withDoodle>
              <h2 className="inline text-inherit font-inherit">how I approached it</h2>
            </Scribble>
          </div>
          <p className="mx-auto mt-4 max-w-3xl text-center text-base sm:text-lg text-[var(--ca-ink)]/90 leading-relaxed font-medium">
            {project.approach}
          </p>

          {/* 3. Personal contribution */}
          <div className="mt-16 sm:mt-20 text-center">
            <Scribble withDoodle>
              <h2 className="inline text-inherit font-inherit">what I built</h2>
            </Scribble>
          </div>
          <div className="relative mx-auto mt-6 max-w-3xl text-left rounded-xl border-2 border-[var(--ca-ink)] bg-[var(--ca-yellow-soft)] p-6 sm:p-8 shadow-[4px_6px_0_var(--ca-ink)]">
            <Tape className="-top-3 left-8 z-10" angle={-3} color="var(--ca-cyan)" />
            <div className="flex items-center gap-2 mb-3">
              <span className="h-2 w-2 rounded-full bg-[var(--ca-ink)]" />
              <span className="ca-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]">
                My role &amp; contribution
              </span>
            </div>
            <p className="text-base sm:text-lg text-[var(--ca-ink)] leading-relaxed font-medium">
              {project.personalContribution}
            </p>
          </div>

          {/* 4. The Results & What Shipped */}
          <div className="mt-16 sm:mt-20 text-center">
            <Scribble withDoodle>
              <h2 className="inline text-inherit font-inherit">what I delivered</h2>
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

        {/* Layer 3: Engineering Tradeoffs & Architectural Decisions */}
        {project.tradeoffs && project.tradeoffs.length > 0 && (
          <section className="mb-20 sm:mb-28" aria-labelledby="tradeoffs-heading">
            <div className="flex flex-col items-center text-center">
              <Scribble withDoodle>
                <h2 id="tradeoffs-heading" className="inline text-inherit font-inherit">decisions &amp; lessons</h2>
              </Scribble>
              <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base font-semibold text-[var(--ca-ink)]/75">
                How I positioned {project.title}, what makes it useful, and what I learned along the way.
              </p>
            </div>

            <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
              {project.tradeoffs.slice(0, 2).map((item, idx) => (
                <div
                  key={idx}
                  className="relative flex flex-col justify-between rounded-xl border-2 border-[var(--ca-ink)] bg-white p-6 sm:p-7 shadow-[4px_6px_0_var(--ca-ink)] transition-transform duration-200 hover:-translate-y-1"
                >
                  <Tape
                    className="-top-2.5 right-6 z-10"
                    angle={idx % 2 === 0 ? 3 : -3}
                    color={["var(--ca-yellow-soft)", "var(--ca-cyan)"][idx % 2]}
                  />
                  <div>
                    <div className="flex items-center justify-between border-b border-[var(--ca-ink)]/10 pb-3 mb-3">
                      <span className="ca-mono text-xs font-bold text-[var(--ca-blue)]">
                        BUILD NOTE #{String(idx + 1).padStart(2, "0")}
                      </span>
                      <Scale size={15} className="text-[var(--ca-ink)]/40" />
                    </div>
                    <h3 className="ca-mono text-sm sm:text-base font-bold text-[var(--ca-ink)] leading-snug">
                      {item.decision}
                    </h3>
                  </div>
                  <div className="mt-4 border-t border-[var(--ca-ink)]/10 pt-3">
                    <span className="ca-mono block text-[10px] font-bold uppercase tracking-wider text-[var(--ca-ink)]/50 mb-1">
                      My reasoning
                    </span>
                    <p className="text-xs sm:text-sm text-[var(--ca-ink)]/80 leading-relaxed font-medium">
                      {item.rationale}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

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
                  Behind the build
                </span>
              </div>
              <h2
                id="blueprint-heading"
                className="mt-1 text-2xl sm:text-3xl font-extrabold tracking-tight text-[var(--ca-ink)]"
              >
                Tools &amp; implementation
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
                My implementation highlights
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

          {/* Block 3: Shipped Features & Capabilities */}
          {project.features && project.features.length > 0 && (
            <>
              <div className="my-6 sm:my-7 border-t border-[var(--ca-ink)]/10" />
              <div>
                <div className="mb-3.5 flex items-center gap-1.5">
                  <CheckCircle2 size={14} className="text-emerald-600" />
                  <span className="ca-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/70">
                    Features &amp; prototype scope
                  </span>
                </div>
                <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
                  {project.features.map((feature, fIdx) => (
                    <div
                      key={fIdx}
                      className="flex items-start gap-2.5 rounded-md border border-[var(--ca-ink)]/10 bg-[var(--ca-surface)]/60 p-2.5 text-xs sm:text-sm font-medium text-[var(--ca-ink)]/90"
                    >
                      <span className="mt-0.5 text-emerald-600 font-bold shrink-0">✓</span>
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Layer 5: Recruiter High-Conversion Action Banner */}
        <section className="mb-20 sm:mb-28 overflow-hidden rounded-xl border-3 border-[var(--ca-ink)] bg-[var(--ca-yellow)] p-8 sm:p-12 shadow-[6px_8px_0_var(--ca-ink)] text-center">
          <h2 className="ca-display text-4xl sm:text-6xl uppercase tracking-tight text-[var(--ca-ink)]">
            Have something in mind?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base font-semibold text-[var(--ca-ink)]/85 sm:text-lg">
            I&apos;m looking for internships, full-time roles, and projects where I can bring design and engineering together. Email me to arrange a call.
          </p>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
            <Link
              href="/contact"
              className="ca-mono inline-flex min-h-[44px] items-center gap-2 rounded-sm border-2 border-[var(--ca-ink)] bg-[var(--ca-ink)] px-6 py-3 text-xs font-bold uppercase tracking-widest text-white shadow-[3px_3px_0_white] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--ca-blue)]"
            >
              Get In Touch With Me
              <ArrowRight size={14} />
            </Link>
            <NextProjectPrefetch
              slug={nextProject.slug}
              title={nextProject.title}
              imageSrc={nextProject.homeHero || nextProject.hero}
              className="ca-mono inline-flex min-h-[44px] items-center gap-2 rounded-sm border-2 border-[var(--ca-ink)] bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[3px_3px_0_var(--ca-ink)] transition-transform duration-200 hover:-translate-y-0.5 hover:bg-[var(--ca-yellow-soft)]"
            />
          </div>
        </section>

        {/* Layer 6: More Projects Discovery */}
        <section className="mb-20 sm:mb-28 border-t-2 border-[var(--ca-ink)]/15 pt-16" aria-labelledby="related-heading">
          <div className="flex flex-col items-center text-center">
            <Scribble withDoodle>
              <h2 id="related-heading" className="inline text-inherit font-inherit">more projects</h2>
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
