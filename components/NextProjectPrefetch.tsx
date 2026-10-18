"use client";

import React, { useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { prefetchQueue, shouldConserveData } from "@/lib/prefetch";

interface NextProjectPrefetchProps {
  slug: string;
  title: string;
  imageSrc?: string;
  className?: string;
}

/**
 * Predictive Next-Project Prefetch Component
 * 
 * - While the user is reading the current case study, warms up the next project route and hero image during idle.
 * - On hover/focus, immediately ensures next project resources are high priority.
 */
export function NextProjectPrefetch({
  slug,
  title,
  imageSrc,
  className = "",
}: NextProjectPrefetchProps) {
  const router = useRouter();
  const nextHref = `/projects/${slug}`;
  const hasPrefetchedRef = useRef(false);

  // Idle prefetch: trigger 1.5s after user lands on case study
  useEffect(() => {
    if (typeof window === "undefined" || hasPrefetchedRef.current || shouldConserveData()) {
      return;
    }

    const idleCallback =
      (window as unknown as { requestIdleCallback?: (cb: () => void) => number })
        .requestIdleCallback || ((cb: () => void) => setTimeout(cb, 1500));

    const handle = idleCallback(() => {
      hasPrefetchedRef.current = true;
      try {
        router.prefetch(nextHref);
      } catch {
        // router might be unavailable
      }
      if (imageSrc) {
        prefetchQueue.prefetchImage(imageSrc, 4);
      }
    });

    return () => {
      if (typeof window !== "undefined" && "cancelIdleCallback" in window) {
        (window as unknown as { cancelIdleCallback: (id: number) => void }).cancelIdleCallback(
          handle as number
        );
      }
    };
  }, [nextHref, imageSrc, router]);

  // Urgent prefetch on hover or touch
  const handleImmediatePrefetch = useCallback(() => {
    try {
      router.prefetch(nextHref);
    } catch {}
    if (imageSrc) {
      prefetchQueue.prefetchImage(imageSrc, 1);
    }
  }, [nextHref, imageSrc, router]);

  return (
    <Link
      href={nextHref}
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
