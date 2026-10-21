import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowUpRight, Clock, ChevronRight } from "lucide-react";
import { ContactStrip, Footer, Tape } from "@/components/Paper";
import { author, noteBySlug, notes, projectBySlug, siteUrl } from "@/lib/site";
import { getBreadcrumbSchema } from "@/lib/schema";

export function generateStaticParams() {
  return notes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const note = noteBySlug(slug);
  if (!note) return {};

  const title = `${note.title} — Engineering Blog`;
  const description = `${note.summary} My technical deep dive as a full stack developer in Pune.`;

  return {
    title,
    description,
    alternates: {
      canonical: `${siteUrl}/blog/${note.slug}`,
    },
    openGraph: {
      type: "article",
      title,
      description,
      url: `${siteUrl}/blog/${note.slug}`,
      authors: [siteUrl],
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const note = noteBySlug(slug);
  if (!note) notFound();

  const relatedProject = note.projectSlug ? projectBySlug(note.projectSlug) : undefined;
  const otherNotes = notes.filter((n) => n.slug !== note.slug);

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: note.title,
    description: note.summary,
    url: `${siteUrl}/blog/${note.slug}`,
    ...(note.date ? { datePublished: note.date } : {}),
    author: {
      "@type": "Person",
      "@id": `${siteUrl}/#jayant`,
      name: author.name,
      url: siteUrl,
    },
    publisher: {
      "@type": "Person",
      "@id": `${siteUrl}/#jayant`,
      name: author.name,
    },
    inLanguage: "en-IN",
    articleSection: note.category,
  };

  const breadcrumbJsonLd = getBreadcrumbSchema([
    { name: "Home", url: siteUrl },
    { name: "Blog", url: `${siteUrl}/blog` },
    { name: note.title, url: `${siteUrl}/blog/${note.slug}` },
  ]);

  return (
    <article className="ca-grid min-h-screen pt-12 sm:pt-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c") }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c") }}
      />

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb Trail */}
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-xs ca-mono font-semibold text-[var(--ca-ink)]/70">
          <Link href="/" className="min-h-[44px] min-w-[44px] inline-flex items-center justify-center px-2 hover:text-[var(--ca-blue)]">Home</Link>
          <ChevronRight size={14} />
          <Link href="/blog" className="min-h-[44px] inline-flex items-center px-1 hover:text-[var(--ca-blue)]">Blog</Link>
          <ChevronRight size={14} />
          <span className="min-h-[44px] inline-flex items-center text-[var(--ca-ink)] font-bold truncate max-w-xs">{note.title}</span>
        </nav>

        {/* Article Header */}
        <header className="mb-12">
          <div className="flex flex-wrap items-center gap-3">
            <span className="ca-mono rounded bg-[var(--ca-cyan)] border border-[var(--ca-ink)]/20 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-2xs">
              {note.category}
            </span>
            <span className="ca-mono text-xs font-semibold text-[var(--ca-ink)]/70">
              {note.date}
            </span>
            <span className="text-[var(--ca-ink)]/40">•</span>
            <span className="ca-mono flex items-center gap-1 text-xs text-[var(--ca-ink)]/70">
              <Clock size={12} />
              {note.readTime}
            </span>
          </div>

          <h1 className="ca-display mt-5 text-5xl uppercase leading-tight tracking-tight text-[var(--ca-ink)] sm:text-7xl">
            {note.title}
          </h1>

          <p className="mt-4 text-xl font-medium text-[var(--ca-blue)]">
            {note.tagline}
          </p>

          <div className="mt-6 border-l-4 border-[var(--ca-ink)] bg-[var(--ca-chrome)]/60 p-4 text-base italic leading-relaxed text-[var(--ca-ink)]/85">
            {note.summary}
          </div>
        </header>

        {/* Main Note Body Content in Scrapbook Paper Card */}
        <div className="ca-doodle-box relative border-3 border-[var(--ca-ink)] bg-white p-6 sm:p-12 shadow-[6px_8px_0_var(--ca-ink)]">
          <Tape className="-left-4 -top-3" angle={-10} color="var(--ca-yellow-soft)" />
          <Tape className="-right-4 -top-3" angle={10} color="var(--ca-cyan)" />

          <div
            className="prose prose-neutral max-w-none text-[var(--ca-ink)] leading-relaxed space-y-6 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-[var(--ca-ink)] [&_h2]:mt-8 [&_h2]:mb-3 [&_h3]:text-xl [&_h3]:font-semibold [&_h3]:text-[var(--ca-ink)] [&_h3]:mt-6 [&_h3]:mb-2 [&_p]:text-base [&_p]:leading-relaxed [&_p]:text-[var(--ca-ink)]/90 [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_li]:text-base [&_li]:text-[var(--ca-ink)]/85 [&_code]:rounded [&_code]:bg-[var(--ca-chrome)] [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:font-mono [&_code]:text-sm [&_pre]:rounded-md [&_pre]:bg-[var(--ca-ink)] [&_pre]:p-4 [&_pre]:text-white [&_pre]:overflow-x-auto"
            dangerouslySetInnerHTML={{ __html: note.content }}
          />

          {/* Related Project Callout if present */}
          {relatedProject && (
            <div className="mt-12 rounded-lg border-2 border-[var(--ca-ink)] bg-[var(--ca-paper)] p-6">
              <span className="ca-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-blue)]">
                Implemented In Production
              </span>
              <h3 className="mt-2 text-xl font-bold text-[var(--ca-ink)]">
                {relatedProject.title} — {relatedProject.tagline}
              </h3>
              <p className="mt-1 text-sm text-[var(--ca-ink)]/80">
                {relatedProject.summary}
              </p>
              <Link
                href={`/work#${relatedProject.slug}`}
                className="ca-mono mt-4 min-h-[44px] inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)] hover:text-[var(--ca-blue)]"
              >
                View Project Breakdown
                <ArrowUpRight size={14} />
              </Link>
            </div>
          )}
        </div>

        {/* Other Notes Navigation */}
        <section className="mt-16 sm:mt-24">
          <h2 className="ca-mono text-sm font-bold uppercase tracking-wider text-[var(--ca-ink)] mb-6">
            Other Technical Notes
          </h2>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            {otherNotes.map((other) => (
              <Link
                key={other.slug}
                href={`/blog/${other.slug}`}
                className="group rounded-md border-2 border-[var(--ca-ink)] bg-white p-5 shadow-[4px_4px_0_var(--ca-ink)] transition-transform duration-200 hover:-translate-y-1"
              >
                <span className="ca-mono text-xs font-bold uppercase text-[var(--ca-blue)]">
                  {other.category}
                </span>
                <h3 className="mt-2 font-bold text-[var(--ca-ink)] group-hover:text-[var(--ca-blue)]">
                  {other.title}
                </h3>
                <p className="mt-1 line-clamp-2 text-xs text-[var(--ca-ink)]/75">
                  {other.summary}
                </p>
              </Link>
            ))}
          </div>
        </section>

        {/* Back Link */}
        <div className="mt-12 pb-16 text-center">
          <Link
            href="/blog"
            className="ca-mono min-h-[44px] inline-flex items-center justify-center gap-2 border-2 border-[var(--ca-ink)] bg-white px-6 py-3 text-xs font-bold uppercase tracking-widest text-[var(--ca-ink)] shadow-[3px_3px_0_var(--ca-ink)] hover:bg-[var(--ca-yellow)] active:scale-98"
          >
            ← Back to all articles
          </Link>
        </div>
      </div>

      <ContactStrip />
      <Footer />
    </article>
  );
}

