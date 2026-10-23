"use client";

import React, { useState, useEffect, useRef, useMemo } from "react";
import Image, { ImageProps } from "next/image";
import { ImageOff } from "lucide-react";
import { getLqipData } from "@/lib/prefetch";

export interface ImageWithLoaderProps extends Omit<ImageProps, "onLoad" | "onError"> {
  wrapperClassName?: string;
  wrapperStyle?: React.CSSProperties;
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
 * - Phase 1: Native browser-level lazy loading (loading="lazy" / "eager") with explicit dimensions
 * - Phase 2: Asynchronous offscreen image decode before transitioning to prevent paint stalls
 * - Phase 3: Smooth 350ms quality upgrade (blur: 12px -> 0, scale: 1.01 -> 1)
 * - Phase 4: Progressive enhancement via <noscript> and CSS fallbacks for zero-JS and hydration failure
 * - Accessibility: Alt text belongs exclusively to the semantic image; LQIP is aria-hidden
 * - Motion sensitivity: Instant swap without blur/scale when prefers-reduced-motion is active
 * - Zero Layout Shift (CLS = 0) with guaranteed aspect-ratio and size reservation
 */
export function ImageWithLoader({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  wrapperStyle,
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
  const [hasError, setHasError] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Retrieve build-generated LQIP metadata for this image
  const stringSrc = typeof src === "string" ? src : (src as { src: string })?.src || "";
  const lqipData = useMemo(() => getLqipData(stringSrc), [stringSrc]);
  const hasLqip = Boolean(lqipData?.blurDataURL);

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

  // Check if image is already cached/complete on mount, and handle early load events
  useEffect(() => {
    setIsLoaded(false);
    setHasError(false);
    const img = imgRef.current;
    if (!img) return;

    if (img.complete && img.naturalWidth > 0) {
      setIsLoaded(true);
      return;
    }

    const handleNativeLoad = () => {
      if (img.naturalWidth > 0) {
        setIsLoaded(true);
      }
    };

    const handleNativeError = () => {
      setHasError(true);
    };

    img.addEventListener("load", handleNativeLoad, { once: true });
    img.addEventListener("error", handleNativeError, { once: true });

    return () => {
      img.removeEventListener("load", handleNativeLoad);
      img.removeEventListener("error", handleNativeError);
    };
  }, [src]);

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

  // Fallback explicit dimensions from LQIP manifest if fill is omitted and dimensions are missing
  const resolvedWidth = width ?? (!fill && lqipData?.width ? lqipData.width : undefined);
  const resolvedHeight = height ?? (!fill && lqipData?.height ? lqipData.height : undefined);

  // Tactile background tint: use dominant color or warm scrapbook paper
  const backgroundColor = lqipData?.dominantColor || "#f5efe6";

  const objectFitClass = /\bobject-(contain|cover|fill|none|scale-down)\b/.test(className)
    ? ""
    : "object-cover";

  return (
    <div
      ref={containerRef}
      className={`relative h-full w-full overflow-hidden ${wrapperClassName}`}
      style={{ backgroundColor, ...wrapperStyle }}
    >
      {/* Semantic Accessible <img> Fallback for No-JS */}
      <noscript>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={stringSrc}
          alt={alt}
          loading={loading || (priority ? "eager" : "lazy")}
          decoding="async"
          className={`ca-image-real ca-image-noscript ${objectFitClass} ${className}`}
          style={{
            position: fill ? "absolute" : undefined,
            top: fill ? 0 : undefined,
            left: fill ? 0 : undefined,
            width: fill ? "100%" : (resolvedWidth ? `${resolvedWidth}px` : undefined),
            height: fill ? "100%" : (resolvedHeight ? `${resolvedHeight}px` : undefined),
            objectFit: fill ? (/\bobject-(contain|cover|fill|none|scale-down)\b/.test(className) ? undefined : "cover") : undefined,
          }}
        />
      </noscript>

      {/* Instant Low-Quality Blurred Preview (Phase 0) */}
      {lqipData?.blurDataURL && (() => {
        const { blurDataURL, width: lqipWidth, height: lqipHeight } = lqipData;
        const fitMatch = className.match(/\bobject-(contain|cover|fill|none|scale-down)\b/);
        const posMatch = className.match(/\bobject-(bottom|center|top|left|right|left-bottom|left-top|right-bottom|right-top|\[[^\]]+\])\b/);
        const placeholderFit = fitMatch ? fitMatch[0] : "object-cover";
        const placeholderPos = posMatch ? posMatch[0] : "";
        return (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={blurDataURL}
            width={lqipWidth}
            height={lqipHeight}
            alt=""
            aria-hidden="true"
            className={`ca-image-lqip absolute inset-0 h-full w-full pointer-events-none transition-opacity duration-300 ${placeholderFit} ${placeholderPos} ${
              isLoaded ? "opacity-0" : "opacity-100"
            } ${
              prefersReducedMotion ? "" : "filter blur-md scale-105"
            }`}
          />
        );
      })()}

      {/* High-Resolution Semantic Image (Always Mounted in SSR for Progressive Enhancement) */}
      {!hasError && (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill={fill}
          width={resolvedWidth}
          height={resolvedHeight}
          sizes={resolvedSizes}
          priority={priority}
          fetchPriority={fetchPriority || (priority ? "high" : "auto")}
          loading={loading || (priority ? "eager" : "lazy")}
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          data-loaded={isLoaded ? "true" : "false"}
          data-has-lqip={hasLqip ? "true" : "false"}
          className={`ca-image-real ${objectFitClass} ${
            prefersReducedMotion
              ? `transition-opacity duration-150 ${isLoaded ? "opacity-100" : (hasLqip ? "opacity-0" : "opacity-100")}`
              : `transition-all duration-350 ease-out ${
                  isLoaded
                    ? "opacity-100 scale-100 blur-0"
                    : hasLqip
                    ? "opacity-0 scale-[1.01] blur-xs"
                    : "opacity-100 scale-100 blur-0"
                }`
          } ${className}`}
          {...rest}
        />
      )}

      {/* Graceful Error Fallback: retains blurred preview if available, with subtle status */}
      {hasError && (
        <div role="img" aria-label={alt} className="absolute inset-0">
          {!hasLqip && (
            <div className="flex h-full w-full flex-col items-center justify-center bg-[var(--ca-chrome)]/60 p-3 text-center backdrop-blur-xs">
              <ImageOff size={20} className="text-[var(--ca-ink)]/50" />
              <span className="ca-mono mt-1 text-[10px] font-medium tracking-wide text-[var(--ca-ink)]/70">
                Preview unavailable
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/**
 * Drop-in alias for SmartImage
 */
export const SmartImage = ImageWithLoader;
