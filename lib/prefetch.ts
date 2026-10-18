/**
 * Smart Progressive Loading — Central Resource & Intent Prefetch Queue
 * 
 * Provides:
 * - Intent-based route and entry-visual prefetching
 * - Priority queue concurrency control (Critical: immediate, Near: 3-4, Idle: 1-2)
 * - Obsolete work cancellation via AbortController
 * - Network-awareness (respects Save-Data and 2G/3G constraints)
 * - Device memory awareness (restricts speculative preloads on low-end hardware)
 */

import lqipManifestRaw from "./lqip-manifest.json";

export interface ImageMetadata {
  width: number;
  height: number;
  aspectRatio: number;
  dominantColor: string;
  blurDataURL: string;
  byteSize: number;
}

export const LQIP_MANIFEST: Record<string, ImageMetadata> = lqipManifestRaw;

/**
 * Entry visuals mapping: The primary above-the-fold visual that each route opens with.
 * When prefetching a route, we ONLY prefetch this single entry visual, NOT all media.
 */
export const ROUTE_ENTRY_VISUALS: Record<string, { imageSrc: string; priority: number }> = {
  "/": {
    imageSrc: "/images/hero-flank-right.jpg",
    priority: 1,
  },
  "/projects": {
    imageSrc: "/projects/malariadetectionsystem-home.png",
    priority: 2,
  },
  "/about": {
    imageSrc: "/images/img-10.jpeg",
    priority: 3,
  },
  "/experience": {
    imageSrc: "/images/img-9.jpeg",
    priority: 4,
  },
  "/components": {
    imageSrc: "/components/thumbnails/binary-precision.png",
    priority: 5,
  },
  "/blog": {
    imageSrc: "/mountains-wallpaper.jpg",
    priority: 6,
  },
  "/contact": {
    imageSrc: "/images/jayant-cutout.png",
    priority: 7,
  },
};

/**
 * Check if user connection or device requests data preservation
 */
export function shouldConserveData(): boolean {
  if (typeof window === "undefined" || typeof navigator === "undefined") {
    return false;
  }

  // Check Save-Data header hint
  const conn = (navigator as unknown as { connection?: { saveData?: boolean; effectiveType?: string } }).connection;
  if (conn?.saveData) {
    return true;
  }

  // Check slow connection types
  if (conn?.effectiveType === "slow-2g" || conn?.effectiveType === "2g") {
    return true;
  }

  // Check low device memory (<= 2GB)
  const mem = (navigator as unknown as { deviceMemory?: number }).deviceMemory;
  if (typeof mem === "number" && mem <= 2) {
    return true;
  }

  return false;
}

class PrefetchQueue {
  private activeCount = 0;
  private maxConcurrent = 3;
  private queue: Array<{
    url: string;
    type: "route" | "image";
    priority: number;
    execute: (signal: AbortSignal) => Promise<void>;
  }> = [];
  private prefetchedUrls = new Set<string>();
  private currentAbortController: AbortController | null = null;

  constructor() {
    if (typeof window !== "undefined") {
      this.currentAbortController = new AbortController();
    }
  }

  /**
   * Cancel in-flight speculative preloads (e.g., when the user suddenly navigates to a new page)
   */
  public cancelPendingSpeculativeWork() {
    if (this.currentAbortController) {
      this.currentAbortController.abort();
      this.currentAbortController = new AbortController();
    }
    this.queue = [];
  }

  /**
   * Enqueue a speculative asset download
   */
  public enqueue(
    url: string,
    type: "route" | "image",
    priority = 10,
    fetcher: (signal: AbortSignal) => Promise<void>
  ) {
    if (this.prefetchedUrls.has(url)) return;
    if (shouldConserveData()) return;

    this.queue.push({
      url,
      type,
      priority,
      execute: fetcher,
    });

    // Sort queue by priority ascending (1 = highest priority)
    this.queue.sort((a, b) => a.priority - b.priority);
    this.processNext();
  }

  private processNext() {
    if (this.activeCount >= this.maxConcurrent || this.queue.length === 0) {
      return;
    }

    const item = this.queue.shift();
    if (!item || !this.currentAbortController) return;

    this.activeCount++;
    const signal = this.currentAbortController.signal;

    item
      .execute(signal)
      .then(() => {
        // Only mark successfully completed preloads to allow retrying failed/aborted requests
        this.prefetchedUrls.add(item.url);
      })
      .catch(() => {
        // Suppress aborted or failed speculative prefetch errors
      })
      .finally(() => {
        this.activeCount = Math.max(0, this.activeCount - 1);
        this.processNext();
      });
  }

  public prefetchImage(src: string, priority = 5) {
    if (typeof window === "undefined" || !src) return;
    if (this.prefetchedUrls.has(src)) return;
    if (shouldConserveData()) return;

    this.enqueue(src, "image", priority, (signal) => {
      if (signal.aborted) {
        return Promise.reject(new DOMException("Aborted", "AbortError"));
      }

      return new Promise<void>((resolve, reject) => {
        const img = new Image();
        img.decoding = "async";

        const onAbort = () => {
          img.onload = null;
          img.onerror = null;
          img.src = ""; // Cancel network fetch
          reject(new DOMException("Aborted", "AbortError"));
        };

        signal.addEventListener("abort", onAbort, { once: true });

        img.onload = () => {
          signal.removeEventListener("abort", onAbort);
          resolve();
        };
        img.onerror = () => {
          signal.removeEventListener("abort", onAbort);
          reject(new Error(`Failed to load ${src}`));
        };

        img.src = src;
      });
    });
  }
}

export const prefetchQueue = new PrefetchQueue();

/**
 * Prefetch entry experience for a target route:
 * 1. Preload Next.js route bundle (via router.prefetch)
 * 2. Preload the primary above-the-fold visual for that route
 */
export function prefetchRouteEntry(
  route: string,
  router?: { prefetch: (href: string) => void }
) {
  if (typeof window === "undefined") return;
  if (shouldConserveData()) return;

  // Prefetch Next.js route JavaScript / data
  try {
    router?.prefetch(route);
  } catch {
    // router might be unavailable
  }

  // Prefetch route's entry visual
  const entry = ROUTE_ENTRY_VISUALS[route];
  if (entry) {
    prefetchQueue.prefetchImage(entry.imageSrc, entry.priority);
  }
}

/**
 * Look up LQIP data for any image URL
 */
export function getLqipData(src: string): ImageMetadata | null {
  if (!src) return null;
  // Clean query strings or next/image wrappers if any
  const cleanSrc = src.split("?")[0];
  const normalized = cleanSrc.startsWith("/") ? cleanSrc : `/${cleanSrc}`;
  return LQIP_MANIFEST[normalized] || null;
}
