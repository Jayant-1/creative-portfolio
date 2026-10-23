"use client";
import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { CardLens, useLens } from "@/components/Motion";
export function ProjectCardImage({
  src,
  alt,
  href,
  darkCard = false,
}: {
  src: string;
  alt: string;
  href: string;
  darkCard?: boolean;
}) {
  const router = useRouter();
  const { containerRef, lensRef, onMove, onMouseEnter, onMouseLeave } = useLens(
    [0, 100],
  );

  const handlePrefetch = React.useCallback(() => {
    try {
      router.prefetch(href);
    } catch {}
  }, [href, router]);

  return (
    <Link
      href={href}
      ref={containerRef as React.RefObject<HTMLAnchorElement>}
      aria-label={`View ${alt} project`}
      className="group/card relative block overflow-hidden border-4 bg-[var(--ca-surface)] aspect-[16/9] w-full cursor-pointer shadow-[0_10px_28px_rgba(17,18,18,0.22)] transition-transform duration-300 hover:-translate-y-1"
      style={{ borderColor: "#ffffff" }}
      onMouseMove={onMove}
      onMouseEnter={(e) => {
        onMouseEnter(e);
        handlePrefetch();
      }}
      onMouseLeave={onMouseLeave}
      onFocus={handlePrefetch}
      onTouchStart={handlePrefetch}
    >
      <div className="relative overflow-hidden h-full w-full transition-transform duration-500 ease-out group-hover/card:scale-[1.03]">
        <ImageWithLoader
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 1024px) 100vw, (max-width: 1536px) 50vw, 800px"
          loaderVariant="project"
          loaderText="Loading Preview..."
        />
      </div>
      <CardLens lensRef={lensRef} darkCard={darkCard} />
    </Link>
  );
}

