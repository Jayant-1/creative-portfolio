"use client";

import React, { useState, useEffect, useRef } from "react";
import Image, { ImageProps } from "next/image";
import { SpinningGear } from "@/components/Paper";
import { ImageOff } from "lucide-react";

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
 * Tactile Image Component with Scrapbook Paper Loader
 * 
 * Features:
 * - Warm textured background with soft luminous shimmer sweep (`ca-image-shimmer`)
 * - Craftsman rotating gear + monospace status badge ("DEVELOPING...", "LOADING PREVIEW...")
 * - Bulletproof cached image detection to eliminate layout flash
 * - Graceful fade-in & scale reveal transition
 * - Tactile error state fallback
 */
export function ImageWithLoader({
  src,
  alt,
  className = "",
  wrapperClassName = "",
  loaderVariant = "photo",
  loaderText,
  showLoaderText = true,
  onLoad,
  onError,
  fill,
  width,
  height,
  priority,
  fetchPriority,
  loading,
  ...rest
}: ImageWithLoaderProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const imgRef = useRef<HTMLImageElement | null>(null);

  // Check if image is already cached/complete on mount
  useEffect(() => {
    if (imgRef.current && imgRef.current.complete && imgRef.current.naturalWidth > 0) {
      setIsLoaded(true);
    }
  }, []);

  const defaultText =
    loaderText ||
    (loaderVariant === "photo"
      ? "Developing..."
      : loaderVariant === "avatar"
      ? "Loading..."
      : "Loading Preview...");

  return (
    <div className={`relative h-full w-full overflow-hidden ${wrapperClassName}`}>
      {/* Tactile Craft Loading State */}
      {!hasError && (
        <div
          aria-hidden="true"
          className={`ca-image-shimmer absolute inset-0 z-10 flex h-full w-full flex-col items-center justify-center transition-opacity duration-500 ease-out ${
            isLoaded ? "opacity-0 pointer-events-none" : "opacity-100"
          }`}
          style={{
            backgroundColor: "#f5efe6",
            backgroundImage:
              loaderVariant === "photo"
                ? "repeating-linear-gradient(to bottom, transparent 0, transparent 23px, rgba(25, 21, 16, 0.04) 23px, rgba(25, 21, 16, 0.04) 24px)"
                : "radial-gradient(circle, rgba(25,21,16,0.06) 1px, transparent 1px)",
            backgroundSize: loaderVariant === "photo" ? "100% 24px" : "14px 14px",
          }}
        >
          {loaderVariant !== "minimal" && (
            <div className="flex items-center gap-2 rounded-full border border-[var(--ca-ink)]/15 bg-white/80 px-3 py-1.5 shadow-[2px_2px_0_rgba(25,21,16,0.08)] backdrop-blur-xs">
              <SpinningGear className="h-3.5 w-3.5" />
              {showLoaderText && (
                <span className="ca-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ca-ink)]/75">
                  {defaultText}
                </span>
              )}
            </div>
          )}
          {loaderVariant === "minimal" && (
            <SpinningGear className="h-4 w-4" />
          )}
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[var(--ca-chrome)]/40 p-4 text-center">
          <ImageOff size={24} className="text-[var(--ca-ink)]/40" />
          <span className="ca-mono mt-1 text-[11px] font-medium text-[var(--ca-ink)]/60">
            Image unavailable
          </span>
        </div>
      ) : (
        <Image
          ref={imgRef}
          src={src}
          alt={alt}
          fill={fill}
          width={width}
          height={height}
          priority={priority}
          fetchPriority={fetchPriority || (priority ? "high" : undefined)}
          loading={loading || (priority ? "eager" : undefined)}
          onLoad={(e) => {
            setIsLoaded(true);
            onLoad?.(e);
          }}
          onError={(e) => {
            setHasError(true);
            onError?.(e);
          }}
          className={`object-cover transition-all duration-700 ease-out ${
            isLoaded
              ? "opacity-100 scale-100 blur-0"
              : "opacity-0 scale-[1.02] blur-xs"
          } ${className}`}
          {...rest}
        />
      )}
    </div>
  );
}
