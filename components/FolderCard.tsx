"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ArrowUpRight } from "lucide-react";
import { useLens, CardLens } from "@/components/Motion";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { type Project, isDarkProjectHero } from "@/lib/site";

/**
 * Manila Folder Card with Mouse Interactive "See" Invert Lens
 * Used in "more projects" on Project pages and on the Projects index grid.
 */
export function FolderProjectCard({
  project,
  href,
}: {
  project: Project;
  href?: string;
}) {
  const router = useRouter();
  const { containerRef, lensRef, onMove, onMouseEnter, onMouseLeave } = useLens([0, 100]);
  const targetHref = href || `/projects/${project.slug}`;

  const handlePrefetch = React.useCallback(() => {
    try {
      router.prefetch(targetHref);
    } catch {}
  }, [targetHref, router]);

  return (
    <Link
      href={targetHref}
      onPointerEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
      className="group block text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] rounded-lg"
    >
      {/* Manila Tab */}
      <div className="flex">
        <span className="ca-mono folder-tab-shape inline-flex items-center gap-2 sm:gap-3.5 bg-[var(--ca-chrome)] py-3 sm:py-5 pl-5 sm:pl-8 pr-16 sm:pr-24 text-xs sm:text-sm font-bold uppercase tracking-wider sm:tracking-[0.2em] text-[var(--ca-ink)] transition-colors duration-700 ease-in-out group-hover:bg-[var(--ca-ink)] group-hover:text-white">
          <span className="h-2.5 w-2.5 sm:h-3 sm:w-3 rounded-full bg-[var(--ca-ink)] transition-colors duration-700 ease-in-out group-hover:bg-white" />
          {project.date}
        </span>
      </div>

      {/* Folder Body */}
      <div className="bg-[var(--ca-chrome)] p-5 transition-colors duration-700 ease-in-out group-hover:bg-[var(--ca-ink)]">
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          onMouseMove={onMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="group/card relative aspect-[16/9] w-full overflow-hidden cursor-pointer bg-[var(--ca-surface)]"
        >
          <div className="relative h-full w-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-[1.05]">
            <ImageWithLoader
              src={project.homeHero || project.hero}
              alt={project.title}
              fill
              sizes="(max-width: 640px) calc(100vw - 32px), (max-width: 1024px) 50vw, 600px"
              loaderVariant="project"
              loaderText="Loading Preview..."
            />
          </div>

          {/* Mouse Interactive Circular Invert Cursor Lens */}
          <CardLens lensRef={lensRef} darkCard={isDarkProjectHero(project.slug)} />
        </div>
      </div>

      {/* Card Title & Problem Description */}
      <div className="pt-6 text-center">
        <h3 className="text-3xl font-semibold tracking-tight text-[var(--ca-ink)] sm:text-4xl">
          {project.title}
        </h3>
        <p className="mx-auto mt-2 max-w-md text-base leading-relaxed text-[var(--ca-ink)]/70">
          {project.problem}
        </p>
      </div>
    </Link>
  );
}

/**
 * Notched Manila Card with Mouse Interactive "See" Invert Lens
 * Used in "more projects" on Project detail pages.
 */
export function RelatedProjectCard({
  project,
}: {
  project: Project;
}) {
  const router = useRouter();
  const { containerRef, lensRef, onMove, onMouseEnter, onMouseLeave } = useLens([0, 100]);
  const targetHref = `/projects/${project.slug}`;

  const handlePrefetch = React.useCallback(() => {
    try {
      router.prefetch(targetHref);
    } catch {}
  }, [targetHref, router]);

  return (
    <Link
      href={targetHref}
      onPointerEnter={handlePrefetch}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
      className="group block text-left focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] rounded-lg"
    >
      <div
        className="relative flex aspect-[1.4] flex-col p-5 transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-[6px_8px_0_rgba(25,21,16,0.18)]"
        style={{
          backgroundColor: "#e8dfcb",
          WebkitClipPath: "polygon(0 0, 42% 0, 54% 18%, 100% 18%, 100% 100%, 0 100%)",
          clipPath: "polygon(0 0, 42% 0, 54% 18%, 100% 18%, 100% 100%, 0 100%)",
        }}
      >
        <span className="ca-mono flex h-[20%] items-center gap-1.5 px-2 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]">
          <span className="h-1.5 w-1.5 rounded-full bg-[var(--ca-ink)] shrink-0" />
          {project.date}
        </span>
        <div
          ref={containerRef as React.RefObject<HTMLDivElement>}
          onMouseMove={onMove}
          onMouseEnter={onMouseEnter}
          onMouseLeave={onMouseLeave}
          className="group/card relative flex-1 overflow-hidden border border-white bg-white cursor-pointer"
        >
          <div className="relative h-full w-full overflow-hidden transition-transform duration-500 ease-out group-hover:scale-105">
            <ImageWithLoader
              src={project.homeHero || project.hero}
              alt={project.title}
              fill
              sizes="(max-width: 640px) calc(100vw - 40px), (max-width: 1024px) 45vw, 480px"
              loaderVariant="project"
              loaderText="Loading Preview..."
            />
          </div>

          {/* Mouse Interactive Circular Invert Cursor Lens */}
          <CardLens lensRef={lensRef} darkCard={isDarkProjectHero(project.slug)} />
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[var(--ca-ink)] group-hover:text-[var(--ca-blue)] transition-colors">
          {project.title}
        </h3>
        <ArrowUpRight
          size={20}
          className="text-[var(--ca-ink)] group-hover:text-[var(--ca-blue)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
        />
      </div>
      <p className="mt-1 text-sm text-[var(--ca-ink)]/75">{project.summary}</p>
    </Link>
  );
}
