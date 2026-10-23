"use client";

import React, { useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prefetchRouteEntry } from "@/lib/prefetch";

interface NextProjectPrefetchProps {
  slug: string;
  title: string;
  imageSrc?: string;
  className?: string;
}

/** Warm the next case study only when a visitor shows navigation intent. */
export function NextProjectPrefetch({
  slug,
  title,
  className = "",
}: NextProjectPrefetchProps) {
  const router = useRouter();
  const nextHref = `/projects/${slug}`;
  const handleImmediatePrefetch = useCallback(() => {
    prefetchRouteEntry(nextHref, router, { explicitIntent: true });
  }, [nextHref, router]);

  return (
    <Link
      href={nextHref}
      prefetch={false}
      onPointerEnter={handleImmediatePrefetch}
      onFocus={handleImmediatePrefetch}
      onTouchStart={handleImmediatePrefetch}
      className={className}
    >
      Next Project: {title}
      <ChevronRight size={14} />
    </Link>
  );
}
