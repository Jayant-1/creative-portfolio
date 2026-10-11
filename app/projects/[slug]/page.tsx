import type { Metadata } from "next";
import Link from "next/link";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { notFound } from "next/navigation";
import { ArrowUpRight, ExternalLink, CheckCircle2, ChevronRight, FileText, Star, GitFork, Eye } from "lucide-react";
import { Footer, Scribble, Tape } from "@/components/Paper";
import { RelatedProjectCard } from "@/components/FolderCard";
import Reveal from "@/components/Reveal";
import { noteBySlug, projectBySlug, projects, siteUrl } from "@/lib/site";

export function generateStaticParams() {
  return projects.map(({ slug }) => ({ slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const project = projectBySlug(params.slug);
  if (!project) return {};

  const title = `${project.title} — Project & Architecture`;
  const description = `${project.summary} Engineered by Jayant Potdar. Learn about the technical challenge, architecture decisions, and measured outcomes.`;

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

  const relatedNote = project.relatedNoteSlug ? noteBySlug(project.relatedNoteSlug) : undefined;
  const relatedProjects = projects.filter((p) => p.slug !== project.slug).slice(0, 2);

  const softwareJsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: project.title,
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web Browser",
    description: project.summary,
    url: `${siteUrl}/projects/${project.slug}`,
    image: `${siteUrl}${project.hero}`,
    author: {
      "@id": `${siteUrl}/#jayant`,
    },
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
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

  return (
    <div className="ca-grid min-h-screen pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />

      <article className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-1.5 text-xs ca-mono font-semibold text-[var(--ca-ink)]/70">
          <Link href="/" className="inline-flex min-h-[44px] items-center px-1.5 hover:text-[var(--ca-blue)]">Home</Link>
          <ChevronRight size={14} />
          <Link href="/projects" className="inline-flex min-h-[44px] items-center px-1.5 hover:text-[var(--ca-blue)]">Projects</Link>
          <ChevronRight size={14} />
          <span className="inline-flex min-h-[44px] items-center px-1.5 text-[var(--ca-ink)] font-bold">{project.title}</span>
        </nav>

        {/* Header Grid: Left Title & Summary, Right 2x2 Torn Fact Notes */}
        <header className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:gap-14 pb-12 sm:pb-16">
          <div>
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="ca-mono inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.2em] text-[var(--ca-ink)]">
                <span className="h-2.5 w-2.5 rounded-full bg-[var(--ca-blue)]" />
                {project.date}
              </span>
              <span
                className="ca-mono inline-block rounded-full px-3 py-0.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]"
                style={{
                  backgroundColor:
                    project.ownership === "Solo Full Stack Project"
                      ? "var(--ca-cyan)"
                      : "var(--ca-yellow-soft)",
                }}
              >
                {project.ownership}
              </span>
            </div>

            <h1 className="ca-display mt-4 text-5xl min-[390px]:text-6xl sm:text-8xl md:text-9xl uppercase leading-none tracking-tight text-[var(--ca-ink)]">
              {project.title}
            </h1>

            <p className="mt-3 text-lg font-bold text-[var(--ca-blue)] sm:text-xl">
              {project.tagline}
            </p>

            {project.metrics && (
              <div className="mt-3.5 flex flex-wrap items-center gap-2">
                <span className="ca-mono inline-flex items-center gap-1.5 rounded-sm border border-[var(--ca-ink)]/20 bg-white px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-2xs">
                  <Star size={13} className="text-amber-500 fill-amber-500" />
                  {project.metrics.stars} Stars
                </span>
                <span className="ca-mono inline-flex items-center gap-1.5 rounded-sm border border-[var(--ca-ink)]/20 bg-white px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-2xs">
                  <GitFork size={13} className="text-[var(--ca-blue)]" />
                  {project.metrics.forks} Forks
                </span>
                <span className="ca-mono inline-flex items-center gap-1.5 rounded-sm border border-[var(--ca-ink)]/20 bg-white px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-2xs">
                  <Eye size={13} className="text-emerald-600" />
                  {project.metrics.views} Views
                </span>
              </div>
            )}

            <p className="mt-5 text-xl leading-relaxed text-[var(--ca-ink)]/80 sm:text-2xl font-medium">
              {project.summary}
            </p>

            {/* Category Tags */}
            <div className="mt-8 flex flex-wrap gap-2.5">
              {project.category.map((tag, tIdx) => {
                const tagColors = [
                  "var(--ca-yellow-soft)",
                  "var(--ca-mint)",
                  "var(--ca-cyan)",
                  "var(--ca-pink-soft)",
                  "var(--ca-purple)",
                ];
                const tagBg = tagColors[tIdx % tagColors.length];
                return (
                  <span
                    key={tag}
                    className="ca-mono ca-notched-tag px-4 pb-2 pt-2.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] border border-[var(--ca-ink)]/20 shadow-2xs"
                    style={{ backgroundColor: tagBg }}
                  >
                    {tag}
                  </span>
                );
              })}
            </div>
          </div>

          {/* 2x2 Pastel Scalloped Stamp Fact Notes */}
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div
              className="ca-stamp-note relative p-5 shadow-[2px_4px_12px_rgba(25,21,16,0.12)] -rotate-1 transition-transform duration-200 hover:rotate-0"
              style={{ backgroundColor: "var(--ca-cyan)" }}
            >
              <Tape className="-left-2 -top-2" angle={-30} color="var(--ca-yellow-soft)" />
              <strong className="ca-mono block text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]">
                ROLE
              </strong>
              <span className="mt-1 block text-sm font-semibold text-[var(--ca-ink)] sm:text-base">
                {project.role}
              </span>
            </div>

            <div
              className="ca-stamp-note relative p-5 shadow-[2px_4px_12px_rgba(25,21,16,0.12)] rotate-1 transition-transform duration-200 hover:rotate-0"
              style={{ backgroundColor: "var(--ca-yellow-soft)" }}
            >
              <Tape className="-right-2 -top-2" angle={30} color="var(--ca-cyan)" />
              <strong className="ca-mono block text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]">
                TIMELINE
              </strong>
              <span className="mt-1 block text-sm font-semibold text-[var(--ca-ink)] sm:text-base">
                {project.timeline}
              </span>
            </div>

            <div
              className="ca-stamp-note relative p-5 shadow-[2px_4px_12px_rgba(25,21,16,0.12)] rotate-1 transition-transform duration-200 hover:rotate-0"
              style={{ backgroundColor: "var(--ca-mint)" }}
            >
              <Tape className="-left-2 -top-2" angle={-25} color="var(--ca-pink-soft)" />
              <strong className="ca-mono block text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]">
                TEAM STRUCTURE
              </strong>
              <span className="mt-1 block text-sm font-semibold text-[var(--ca-ink)] sm:text-base">
                {project.team}
              </span>
            </div>

            <div
              className="ca-stamp-note relative p-5 shadow-[2px_4px_12px_rgba(25,21,16,0.12)] -rotate-1 transition-transform duration-200 hover:rotate-0"
              style={{ backgroundColor: "var(--ca-pink-soft)" }}
            >
              <Tape className="-right-2 -top-2" angle={25} color="var(--ca-yellow-soft)" />
              <strong className="ca-mono block text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]">
                YEAR
              </strong>
              <span className="mt-1 block text-sm font-semibold text-[var(--ca-ink)] sm:text-base">
                {project.year}
              </span>
            </div>
          </div>
        </header>

        {/* Large Framed Hero Image with Translucent Corner Tape */}
        <div className="relative mb-20 sm:mb-28">
          <Tape className="-left-4 -top-3 z-10" angle={-14} color="var(--ca-cyan)" />
          <Tape className="-right-4 -top-3 z-10" angle={14} color="var(--ca-yellow-soft)" />
          <div className="relative aspect-[16/10] w-full overflow-hidden border-4 border-[var(--ca-ink)] bg-white shadow-xl">
            <ImageWithLoader
              src={project.hero}
              alt={`${project.title} primary interface`}
              fill
              priority
              fetchPriority="high"
              loaderVariant="project"
              loaderText="Loading Hero Preview..."
              className="object-cover"
              sizes="(max-width: 1024px) 96vw, 1000px"
            />
          </div>
        </div>

        {/* Ownership & Contribution Box */}
        <section className="mb-20 sm:mb-28 border-3 border-[var(--ca-ink)] bg-white p-6 sm:p-10 shadow-[6px_8px_0_var(--ca-ink)]" aria-labelledby="contribution-heading">
          <span className="ca-mono inline-block rounded-full bg-[var(--ca-ink)] px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-white">
            Architectural Ownership
          </span>
          <h2 id="contribution-heading" className="mt-3 text-2xl font-bold uppercase text-[var(--ca-ink)] sm:text-3xl">
            What Jayant Potdar Built &amp; Owned
          </h2>
          <p className="mt-4 text-base leading-relaxed text-[var(--ca-ink)]/85 sm:text-lg">
            {project.personalContribution}
          </p>

          <div className="mt-6">
            <h3 className="ca-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] mb-3">
              Key Technical Decisions:
            </h3>
            <ul className="space-y-2.5 text-sm sm:text-base text-[var(--ca-ink)]/85">
              {project.technicalHighlights.map((highlight, hIdx) => (
                <li key={hIdx} className="flex items-start gap-3">
                  <CheckCircle2 size={18} className="mt-0.5 shrink-0 text-[var(--ca-blue)]" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          </div>

          {project.features && project.features.length > 0 && (
            <div className="mt-8 rounded-md border border-[var(--ca-ink)]/15 bg-[var(--ca-chrome)]/40 p-5">
              <h3 className="ca-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] mb-3">
                Core System Features &amp; Capabilities:
              </h3>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm sm:text-base text-[var(--ca-ink)]/85">
                {project.features.map((feat, fIdx) => (
                  <li key={fIdx} className="flex items-start gap-2.5">
                    <span className="mt-1 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-[var(--ca-blue)] text-[10px] font-bold text-white">
                      ✓
                    </span>
                    <span className="leading-snug">{feat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </section>

        {/* Story Section 1: The Challenge */}
        <section className="mb-20 sm:mb-28 text-center" aria-labelledby="challenge-heading">
          <Scribble withDoodle>
            <span id="challenge-heading">the challenge</span>
          </Scribble>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--ca-ink)]/85 sm:text-xl font-normal text-left sm:text-center">
            {project.challenge}
          </p>

          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Reveal>
              <div className="relative">
                <Tape
                  className="-left-3.5 -top-2.5 z-20 h-5.5 w-20 shadow-[0_2px_4px_rgba(17,18,18,0.18)]"
                  angle={-22}
                  color="var(--ca-yellow-soft)"
                />
                <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border-[var(--ca-ink)] bg-white shadow-md">
                  <ImageWithLoader
                    src={project.images[0]}
                    alt={`${project.title} challenge illustration`}
                    fill
                    loaderVariant="project"
                    loaderText="Loading Preview..."
                    className="object-cover"
                    sizes="(max-width: 768px) 92vw, 46vw"
                  />
                </div>
              </div>
            </Reveal>

            <Reveal delay={100}>
              <div className="relative">
                <Tape
                  className="-right-3.5 -top-2.5 z-20 h-5.5 w-20 shadow-[0_2px_4px_rgba(17,18,18,0.18)]"
                  angle={22}
                  color="var(--ca-cyan)"
                />
                <div className="relative aspect-[4/3] w-full overflow-hidden border-4 border-[var(--ca-ink)] bg-white shadow-md">
                  <ImageWithLoader
                    src={project.images[1] || project.images[0]}
                    alt={`${project.title} alternative view`}
                    fill
                    loaderVariant="project"
                    loaderText="Loading Preview..."
                    className="object-cover"
                    sizes="(max-width: 768px) 92vw, 46vw"
                  />
                </div>
              </div>
            </Reveal>
          </div>
        </section>

        {/* Story Section 2: My Approach */}
        <section className="mb-20 sm:mb-28 text-center" aria-labelledby="approach-heading">
          <Scribble withDoodle>
            <span id="approach-heading">architectural approach</span>
          </Scribble>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--ca-ink)]/85 sm:text-xl font-normal text-left sm:text-center">
            {project.approach}
          </p>

          {/* Full-width Architecture Diagram / Screenshot */}
          <Reveal className="mt-12">
            <div className="relative">
              <Tape className="-left-4 -top-3 z-20 h-5.5 w-20 shadow-[0_2px_4px_rgba(17,18,18,0.18)]" angle={-14} color="var(--ca-mint)" />
              <Tape className="-right-4 -top-3 z-20 h-5.5 w-20 shadow-[0_2px_4px_rgba(17,18,18,0.18)]" angle={14} color="var(--ca-pink-soft)" />
              <div className="relative aspect-[16/9] w-full overflow-hidden border-4 border-[var(--ca-ink)] bg-white shadow-lg">
                <ImageWithLoader
                  src={project.images[2] || project.images[0]}
                  alt={`${project.title} technical architecture and implementation`}
                  fill
                  loaderVariant="project"
                  loaderText="Loading Architecture..."
                  className="object-cover"
                  sizes="(max-width: 1024px) 94vw, 980px"
                />
              </div>
            </div>
          </Reveal>
        </section>

        {/* Visual Interface Gallery & All Project Screenshots */}
        {project.images.length > 0 && (
          <section className="mb-20 sm:mb-28 text-center" aria-labelledby="gallery-heading">
            <Scribble withDoodle>
              <span id="gallery-heading">interface gallery &amp; screenshots</span>
            </Scribble>

            <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--ca-ink)]/85 sm:text-xl font-normal text-left sm:text-center">
              Detailed interface walkthrough, diagnostic panels, and feature screenshots for {project.title}.
            </p>

            <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
              {project.images.map((imgSrc, imgIdx) => {
                const tapeTones = [
                  "var(--ca-yellow-soft)",
                  "var(--ca-cyan)",
                  "var(--ca-mint)",
                  "var(--ca-pink-soft)",
                  "var(--ca-yellow)",
                  "var(--ca-purple)",
                ];
                const angles = [-14, 15, -11, 13, -16, 12];
                const tapeColor = tapeTones[imgIdx % tapeTones.length];
                const tapeAngle = angles[imgIdx % angles.length];

                return (
                  <Reveal key={imgSrc} delay={imgIdx * 80}>
                    <div className="group relative flex flex-col border-3 border-[var(--ca-ink)] bg-white p-3.5 shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
                      <Tape
                        className={imgIdx % 2 === 0 ? "-left-3 -top-2.5 z-20" : "-right-3 -top-2.5 z-20"}
                        angle={tapeAngle}
                        color={tapeColor}
                      />
                      <div className="relative aspect-[16/10] w-full overflow-hidden border border-[var(--ca-ink)]/20 bg-[var(--ca-surface)]">
                        <ImageWithLoader
                          src={imgSrc}
                          alt={`${project.title} screenshot ${imgIdx + 1}`}
                          fill
                          loaderVariant="project"
                          loaderText={`Loading Screen #${String(imgIdx + 1).padStart(2, "0")}...`}
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                          sizes="(max-width: 768px) 96vw, (max-width: 1200px) 46vw, 600px"
                        />
                      </div>
                      <div className="mt-3 flex items-center justify-between px-1">
                        <span className="ca-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/75">
                          {project.title} — Screen #{String(imgIdx + 1).padStart(2, "0")}
                        </span>
                        <span
                          className="ca-mono rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-[var(--ca-ink)]"
                          style={{ backgroundColor: tapeColor }}
                        >
                          View {imgIdx + 1}
                        </span>
                      </div>
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </section>
        )}

        {/* Story Section 3: The Results & Factual Outcomes */}
        <section className="mb-24 sm:mb-32 text-center" aria-labelledby="results-heading">
          <Scribble withDoodle>
            <span id="results-heading">the results &amp; metrics</span>
          </Scribble>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-relaxed text-[var(--ca-ink)]/85 sm:text-xl font-normal text-left sm:text-center">
            {project.results}
          </p>

          {/* Factual Outcome Metric Cards */}
          <div className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-3">
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
                  <Tape className="-top-2 left-6" angle={angle * -8} color={["var(--ca-yellow-soft)", "var(--ca-pink-soft)", "var(--ca-cyan)"][idx % 3]} />
                  <strong className="text-3xl font-extrabold tracking-tight text-[var(--ca-ink)] sm:text-4xl">
                    {outcome.value}
                  </strong>
                  <span className="ca-mono mt-2 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/80">
                    {outcome.label}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Related Engineering Deep Dive Link */}
          {relatedNote && (
            <div className="mx-auto mt-14 max-w-2xl rounded-lg border-2 border-dashed border-[var(--ca-ink)]/40 bg-white/90 p-6 text-left shadow-sm">
              <span className="ca-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-blue)]">
                Technical Deep Dive
              </span>
              <h3 className="mt-1 text-lg font-bold text-[var(--ca-ink)]">
                <Link href={`/notes/${relatedNote.slug}`} className="hover:text-[var(--ca-blue)]">
                  {relatedNote.title}
                </Link>
              </h3>
              <p className="mt-2 text-sm text-[var(--ca-ink)]/75">
                {relatedNote.tagline}
              </p>
              <Link
                href={`/notes/${relatedNote.slug}`}
                className="ca-mono mt-3 inline-flex min-h-[44px] items-center gap-1.5 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-blue)] hover:underline"
              >
                <FileText size={14} />
                Read the engineering note ({relatedNote.readTime})
                <ArrowUpRight size={14} />
              </Link>
            </div>
          )}

          {/* External links */}
          <div className="mt-12 flex flex-wrap items-center justify-center gap-6">
            <a
              href={project.source}
              target="_blank"
              rel="noopener noreferrer"
              className="ca-mono inline-flex min-h-[44px] items-center gap-2 border-2 border-[var(--ca-ink)] bg-white px-5 py-3 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[4px_4px_0_var(--ca-ink)] transition-transform duration-200 hover:-translate-y-1 hover:bg-[var(--ca-yellow)]"
            >
              <GithubIcon className="h-4 w-4" />
              Source Code
            </a>

            {project.demo && (
              <a
                href={project.demo}
                target="_blank"
                rel="noopener noreferrer"
                className="ca-mono inline-flex min-h-[44px] items-center gap-2 border-2 border-[var(--ca-ink)] bg-[var(--ca-blue)] px-5 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-[4px_4px_0_var(--ca-ink)] transition-transform duration-200 hover:-translate-y-1 hover:bg-[var(--ca-ink)]"
              >
                <ExternalLink size={18} />
                Live Demo
              </a>
            )}
          </div>
        </section>

        {/* More Projects Section */}
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
