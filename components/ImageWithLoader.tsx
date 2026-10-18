"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { getLqipData, shouldConserveData } from "@/lib/prefetch";

export interface ImageWithLoaderProps extends Omit<ImageProps, "onLoad" | "onError"> {
  wrapperClassName?: string;
  loaderVariant?: "photo" | "project" | "avatar" | "minimal";
  loaderText?: string;
  showLoaderText?: boolean;
  fetchPriority?: "high" | "low" | "auto";
  loading?: "lazy" | "eager";
  onLoad?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
  onError?: (e: React.SyntheticEvent<HTMLImageElement>) => void;
}

/**
 * Smart Progressive Image Component
 * 
 * Features:
 * - Phase 0: Instant dominant-color paper surface + ultra-compact blurred WebP preview (<150 bytes)
 * - Phase 1: Near-viewport IntersectionObserver (rootMargin: 600px 0px) for proactive offscreen fetching
 * - Phase 2: Asynchronous offscreen image decode before transitioning to prevent paint stalls
 * - Phase 3: Smooth 300ms quality upgrade (blur: 12px -> 0, scale: 1.01 -> 1)
 * - Accessibility: Alt text belongs exclusively to the semantic image; LQIP is aria-hidden
 * - Motion sensitivity: Instant swap without blur/scale when prefers-reduced-motion is active
 * - Zero Layout Shift (CLS = 0) with guaranteed aspect-ratio and size reservation
 */
export function ImageWithLoader({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  loaderVariant = "photo",
  loaderText,
  showLoaderText = false,
  onLoad,
  onError,
  fill,
  width,
  height,
  priority = false,
  fetchPriority,
  loading,
  ...rest
}: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isNearViewport, setIsNearViewport] = useState(priority);
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Retrieve build-generated LQIP metadata for this image
  const stringSrc = typeof src === "string" ? src : (src as { src: string })?.src || "";
  const lqipData = useMemo(() => getLqipData(stringSrc), [stringSrc]);

  // Check reduced-motion preference on mount
  useEffect(() => {
    if (typeof window !== "undefined") {
      const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
      setPrefersReducedMotion(mediaQuery.matches);

      const handleChange = (e: MediaQueryListEvent) => {
        setPrefersReducedMotion(e.matches);
      };
      mediaQuery.addEventListener?.("change", handleChange);
      return () => mediaQuery.removeEventListener?.("change", handleChange);
    }
  }, []);

  // Near-viewport IntersectionObserver with 600px rootMargin
  useEffect(() => {
    if (priority || isNearViewport) return;

    if (typeof window === "undefined" || !("IntersectionObserver" in window)) {
      setIsNearViewport(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry && entry.isIntersecting) {
          setIsNearViewport(true);
          observer.disconnect();
        }
      },
      {
        rootMargin: "600px 0px", // Proactively begin download 600px before arriving
        threshold: 0.01,
      }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [priority, isNearViewport]);

  // Check if image is already cached/complete on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, [isNearViewport]);

  const handleImageLoad = async (e: React.SyntheticEvent<HTMLImageElement>) => {
    const imgEl = e.currentTarget;
    try {
      // Decode offscreen before triggering layout paint
      if ("decode" in imgEl && typeof imgEl.decode === "function") {
        await imgEl.decode();
      }
    } catch {
      // Ignore decode errors on aborted or non-standard environments
    }
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    setHasError(true);
    onError?.(e);
  };

  // Provide optimized, variant-aware default sizes whenever `fill` is used without explicit `sizes`
  const resolvedSizes =
    rest.sizes ||
    (fill
      ? loaderVariant === "avatar" || loaderVariant === "minimal"
        ? "64px"
        : loaderVariant === "photo"
        ? "(max-width: 640px) 240px, (max-width: 1024px) 280px, 340px"
        : "(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 800px"
      : undefined);

  // Tactile background tint: use dominant color or warm scrapbook paper
  const backgroundColor = lqipData?.dominantColor || "#f5efe6";

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${wrapperClassName}`}
      style={{ backgroundColor }}
    >
      {/* Instant Low-Quality Blurred Preview (Phase 0) */}
      {lqipData?.blurDataURL && !isLoaded && (() => {
        const fitMatch = className.match(/\bobject-(contain|cover|fill|none|scale-down)\b/);
        const posMatch = className.match(/\bobject-(bottom|center|top|left|right|left-bottom|left-top|right-bottom|right-top|\[[^\]]+\])\b/);
        const placeholderFit = fitMatch ? fitMatch[0] : "object-cover";
        const placeholderPos = posMatch ? posMatch[0] : "";
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={lqipData.blurDataURL}
            width={lqipData.width}
            height={lqipData.height}
            alt=""
            aria-hidden="true"
            className={`absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 ${placeholderFit} ${placeholderPos} ${
              prefersReducedMotion ? "" : "filter blur-md scale-105"
            }`}
          />
        );
      })()}

      {/* High-Resolution Semantic Image (Progressive Upgrade) */}
      {(priority || isNearViewport) && !hasError && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          sizes={resolvedSizes}
          priority={priority}
          fetchPriority={fetchPriority || (priority ? "high" : "auto")}
          loading={loading || (priority ? "eager" : "lazy")}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          className={`${
            /\bobject-(contain|cover|fill|none|scale-down)\b/.test(className) ? "" : "object-cover"
          } ${
            prefersReducedMotion
              ? `transition-opacity duration-150 ${isLoaded ? "opacity-100" : "opacity-0"}`
              : `transition-all duration-350 ease-out ${
                  isLoaded ? "opacity-100 scale-100 blur-0" : "opacity-0 scale-[1.01] blur-xs"
                }`
          } ${className}`}
          {...rest}
        />
      )}

      {/* Graceful Error Fallback: retains blurred preview if available, with subtle status */}
      {hasError && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--ca-chrome)]/60 p-3 text-center backdrop-blur-xs">
          <ImageOff size={20} className="text-[var(--ca-ink)]/50" />
          <span className="ca-mono mt-1 text-[10px] font-medium tracking-wide text-[var(--ca-ink)]/70">
            Preview unavailable
          </span>
        </div>
      )}
    </div>
  );
}

/**
 * Drop-in alias for SmartImage
 */
export const SmartImage = ImageWithLoader;
