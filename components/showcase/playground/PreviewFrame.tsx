"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Minimize2,
  Eye,
  Code as CodeIcon,
  Play,
  X,
  Monitor,
  Tablet,
  Smartphone,
  ExternalLink,
} from "lucide-react";
import { LogicalViewport } from "@/lib/component-manifests";

export type ViewportMode = "desktop" | "tablet" | "mobile";

interface PreviewFrameProps {
  slug: string;
  referenceViewport: {
    desktop: LogicalViewport;
    tablet: LogicalViewport;
    mobile: LogicalViewport;
  };
  activeTab: "preview" | "code";
  onTabChange: (tab: "preview" | "code") => void;
  onReplay: () => void;
  scrollProgress?: number;
  onScrollChange?: (progress: number) => void;
  iframeRef: React.RefObject<HTMLIFrameElement>;
  isScrollLinked?: boolean;
  children?: React.ReactNode;
  isFullscreen?: boolean;
  onFullscreenToggle?: (isFullscreen: boolean) => void;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({
  slug,
  referenceViewport,
  activeTab,
  onTabChange,
  onReplay,
  iframeRef,
  children,
  isFullscreen: controlledIsFullscreen,
  onFullscreenToggle,
}) => {
  const [containerWidth, setContainerWidth] = useState<number>(() => {
    if (typeof window !== "undefined") {
      return Math.min(window.innerWidth - 32, 1000);
    }
    return 1000;
  });
  const [viewportMode, setViewportMode] = useState<ViewportMode>(() => {
    if (typeof window !== "undefined" && window.innerWidth < 640) {
      return "mobile";
    }
    return "desktop";
  });
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const stageMeasureRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenTriggerRef = useRef<HTMLButtonElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  const isFullscreen =
    controlledIsFullscreen !== undefined ? controlledIsFullscreen : internalIsFullscreen;

  const setIsFullscreen = useCallback(
    (val: boolean) => {
      if (onFullscreenToggle) {
        onFullscreenToggle(val);
      } else {
        setInternalIsFullscreen(val);
      }
    },
    [onFullscreenToggle]
  );

  // Measure stage container width with ResizeObserver
  useEffect(() => {
    const el = stageMeasureRef.current;
    if (!el) return;

    const updateDimensions = () => {
      const width = el.getBoundingClientRect().width;
      if (width > 0) {
        setContainerWidth(width);
      }
    };

    updateDimensions();

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (entry.contentRect.width > 0) {
          setContainerWidth(entry.contentRect.width);
        }
      }
    });

    observer.observe(el);
    return () => observer.disconnect();
  }, [activeTab]);

  // Fullscreen body scroll lock, focus restoration, and keyboard focus trap
  useEffect(() => {
    if (!isFullscreen) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto-focus exit button for keyboard accessibility
    const timer = setTimeout(() => {
      exitButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsFullscreen(false);
        return;
      }

      if (e.key === "Tab" && fullscreenContainerRef.current) {
        const focusable = fullscreenContainerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length > 0) {
          const first = focusable[0];
          const last = focusable[focusable.length - 1];
          if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
          } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(timer);
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isFullscreen, setIsFullscreen]);

  // Focus trigger button after exiting fullscreen
  const wasFullscreenRef = useRef(false);
  useEffect(() => {
    if (wasFullscreenRef.current && !isFullscreen) {
      setTimeout(() => {
        fullscreenTriggerRef.current?.focus();
      }, 50);
    }
    wasFullscreenRef.current = isFullscreen;
  }, [isFullscreen]);

  // Automatically release touch interaction on outer document scroll to prevent trapping
  useEffect(() => {
    if (!isTouchInteracting) return;
    const handleScroll = () => {
      setIsTouchInteracting(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTouchInteracting]);

  // Logical viewport for current mode
  const logical = referenceViewport[viewportMode] || referenceViewport.desktop;

  // Calculate scale and dimensions
  let scale = 1;
  let displayedWidth = containerWidth;
  let displayedHeight = logical.height;

  if (isFullscreen) {
    const availableW = typeof window !== "undefined" ? window.innerWidth - 48 : 1200;
    const availableH = typeof window !== "undefined" ? window.innerHeight - 130 : 700;
    scale = Math.min(availableW / logical.width, availableH / logical.height, 1);
    displayedWidth = Math.round(logical.width * scale);
    displayedHeight = Math.round(logical.height * scale);
  } else {
    const usableWidth = containerWidth > 0 ? containerWidth : 860;
    if (viewportMode === "desktop") {
      scale = usableWidth / logical.width;
      displayedWidth = usableWidth;
      displayedHeight = Math.round(logical.height * scale);
    } else {
      // For tablet and mobile
      if (usableWidth >= logical.width) {
        scale = 1;
        displayedWidth = logical.width;
        displayedHeight = logical.height;
      } else {
        scale = usableWidth / logical.width;
        displayedWidth = usableWidth;
        displayedHeight = Math.round(logical.height * scale);
      }
    }
  }

  return (
    <div
      ref={stageMeasureRef}
      id="sandbox-stage"
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0c]/95 backdrop-blur-md p-3 sm:p-6 overflow-hidden"
          : "w-full flex flex-col rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4] dark:bg-[#121316] overflow-hidden shadow-xs"
      }
    >
      {/* Top Header Bar (when not in fullscreen) */}
      {!isFullscreen && (
        <div className="w-full flex flex-wrap items-center justify-between gap-2 px-3 sm:px-4 py-2 border-b border-[var(--ca-ink)]/10 dark:border-white/10 bg-white/70 dark:bg-[#15171c]/70 backdrop-blur-xs">
          {/* Segmented Tab Control: Preview vs Code */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-[var(--ca-ink)]/6 dark:bg-white/8 text-xs font-mono">
            <button
              type="button"
              onClick={() => onTabChange("preview")}
              className={`flex items-center gap-1.5 min-h-[36px] sm:min-h-[28px] px-3 py-1 rounded-md text-xs font-mono transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                activeTab === "preview"
                  ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white font-semibold shadow-xs border border-[var(--ca-ink)]/20 dark:border-white/20"
                  : "border border-transparent text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
              }`}
            >
              <Eye size={13} />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("code")}
              className={`flex items-center gap-1.5 min-h-[36px] sm:min-h-[28px] px-3 py-1 rounded-md text-xs font-mono transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                activeTab === "code"
                  ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white font-semibold shadow-xs border border-[var(--ca-ink)]/20 dark:border-white/20"
                  : "border border-transparent text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
              }`}
            >
              <CodeIcon size={13} />
              <span>Code</span>
            </button>
          </div>

          {/* Action Controls (when preview active) */}
          {activeTab === "preview" && (
            <div className="flex items-center gap-1.5 sm:gap-2">
              {/* Replay */}
              <button
                type="button"
                onClick={onReplay}
                className="min-h-[36px] min-w-[36px] sm:min-h-[28px] sm:min-w-[28px] inline-flex items-center justify-center rounded-md text-xs font-mono text-[var(--ca-ink)]/75 dark:text-neutral-300 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/6 dark:hover:bg-white/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                title="Replay entrance animations"
                aria-label="Replay animations"
              >
                <RotateCcw size={13} />
              </button>

              {/* Open in new tab */}
              <a
                href={`/preview/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[36px] min-w-[36px] sm:min-h-[28px] sm:min-w-[28px] inline-flex items-center justify-center rounded-md text-xs font-mono text-[var(--ca-ink)]/75 dark:text-neutral-300 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/6 dark:hover:bg-white/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                title="Open preview in new tab"
                aria-label="Open preview in new tab"
              >
                <ExternalLink size={13} />
              </a>
            </div>
          )}
        </div>
      )}

      {/* Fullscreen Exit Header Bar & Dialog Container */}
      {isFullscreen && (
        <div
          ref={fullscreenContainerRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${slug} interactive component preview in fullscreen`}
          className="w-full flex-1 flex flex-col items-center justify-between overflow-hidden"
        >
          <div className="w-full max-w-5xl flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-white shrink-0">
            <div className="flex items-center gap-2 font-mono text-xs text-neutral-300">
              <span className="text-white font-bold">{slug}</span>
              <span>/</span>
              <span className="capitalize">{viewportMode} ({logical.width}x{logical.height})</span>
            </div>

            <div className="flex items-center gap-2">
              {/* Fullscreen Viewport Switcher */}
              <div
                role="group"
                aria-label="Fullscreen preview viewport modes"
                className="inline-flex items-center p-0.5 rounded-lg bg-white/10 text-xs font-mono mr-1"
              >
                <button
                  type="button"
                  onClick={() => setViewportMode("desktop")}
                  className={`min-h-[32px] min-w-[32px] flex items-center justify-center rounded-md transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                    viewportMode === "desktop"
                      ? "bg-white text-black font-semibold shadow-xs"
                      : "text-neutral-300 hover:text-white"
                  }`}
                  title="Desktop viewport"
                  aria-label="Desktop viewport"
                >
                  <Monitor size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode("tablet")}
                  className={`min-h-[32px] min-w-[32px] flex items-center justify-center rounded-md transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                    viewportMode === "tablet"
                      ? "bg-white text-black font-semibold shadow-xs"
                      : "text-neutral-300 hover:text-white"
                  }`}
                  title="Tablet viewport"
                  aria-label="Tablet viewport"
                >
                  <Tablet size={14} />
                </button>
                <button
                  type="button"
                  onClick={() => setViewportMode("mobile")}
                  className={`min-h-[32px] min-w-[32px] flex items-center justify-center rounded-md transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                    viewportMode === "mobile"
                      ? "bg-white text-black font-semibold shadow-xs"
                      : "text-neutral-300 hover:text-white"
                  }`}
                  title="Mobile viewport"
                  aria-label="Mobile viewport"
                >
                  <Smartphone size={14} />
                </button>
              </div>

              <button
                type="button"
                onClick={onReplay}
                className="min-h-[36px] sm:min-h-[32px] px-3 flex items-center gap-1.5 rounded-md text-xs font-mono bg-white/10 hover:bg-white/15 text-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                aria-label="Replay animations"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Replay</span>
              </button>

              <a
                href={`/preview/${slug}`}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[36px] min-w-[36px] sm:min-h-[32px] sm:min-w-[32px] inline-flex items-center justify-center rounded-md text-xs font-mono bg-white/10 hover:bg-white/15 text-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                title="Open in new tab"
                aria-label="Open in new tab"
              >
                <ExternalLink size={13} />
              </a>

              <button
                ref={exitButtonRef}
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="min-h-[36px] sm:min-h-[32px] px-3 flex items-center gap-1.5 rounded-md text-xs font-mono bg-white/20 hover:bg-white/30 text-white font-bold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                aria-label="Exit Fullscreen"
              >
                <Minimize2 size={13} />
                <span>Exit (Esc)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Iframe Container */}
          <div className="flex-1 w-full flex items-center justify-center overflow-hidden">
            <div
              style={{
                width: `${displayedWidth}px`,
                maxWidth: "100%",
                height: `${displayedHeight}px`,
              }}
              className="relative overflow-hidden rounded-lg border border-white/15 bg-[#0c0d10] shadow-2xl transition-all"
            >
              {!isIframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[#0c0d10] z-10">
                  <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                    <span className="h-2 w-2 rounded-full bg-[var(--ca-orange)] animate-ping" />
                    <span>Loading preview...</span>
                  </div>
                </div>
              )}

              <iframe
                ref={iframeRef}
                src={`/preview/${slug}`}
                title={`${slug} interactive component preview`}
                onLoad={() => setIsIframeLoaded(true)}
                style={{
                  width: `${logical.width}px`,
                  height: `${logical.height}px`,
                  transform: `scale(${scale})`,
                  transformOrigin: "top left",
                  border: "none",
                }}
                className="absolute top-0 left-0 bg-transparent transition-opacity pointer-events-auto"
              />
            </div>
          </div>
        </div>
      )}

      {/* Preview View: Standard Iframe Stage (Non-fullscreen) */}
      {!isFullscreen && activeTab === "preview" && (
        <div className="w-full flex flex-col items-center justify-center select-none py-2 px-1 sm:px-2 bg-neutral-900/10">
          <div
            style={{
              width: `${displayedWidth}px`,
              maxWidth: "100%",
              height: `${displayedHeight}px`,
            }}
            className={`relative overflow-hidden bg-[#0c0d10] transition-all ${
              viewportMode === "desktop"
                ? "w-full"
                : "rounded-xl border border-[var(--ca-ink)]/20 dark:border-white/15 shadow-md"
            }`}
          >
            {!isIframeLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-[#0c0d10] z-10">
                <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
                  <span className="h-2 w-2 rounded-full bg-[var(--ca-orange)] animate-ping" />
                  <span>Loading preview...</span>
                </div>
              </div>
            )}

            <iframe
              ref={iframeRef}
              src={`/preview/${slug}`}
              title={`${slug} interactive component preview`}
              onLoad={() => setIsIframeLoaded(true)}
              style={{
                width: `${logical.width}px`,
                height: `${logical.height}px`,
                transform: `scale(${scale})`,
                transformOrigin: "top left",
                border: "none",
              }}
              className={`absolute top-0 left-0 bg-transparent transition-opacity ${
                isTouchInteracting
                  ? "pointer-events-auto"
                  : "pointer-events-none sm:pointer-events-auto"
              }`}
            />

            {/* Mobile Touch Overlay */}
            {!isTouchInteracting && isIframeLoaded && (
              <div
                role="button"
                tabIndex={0}
                aria-label="Activate interactive demo on touch screen"
                onClick={() => setIsTouchInteracting(true)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    setIsTouchInteracting(true);
                  }
                }}
                className="absolute inset-0 z-20 flex items-end justify-center pb-3 bg-transparent cursor-pointer sm:hidden focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] focus-visible:ring-inset"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[11px] font-semibold shadow-lg transition-transform active:scale-95">
                  <Play size={11} className="fill-white" />
                  <span>Tap to interact</span>
                </div>
              </div>
            )}

            {/* Mobile Exit Demo Button */}
            {isTouchInteracting && (
              <button
                type="button"
                onClick={() => setIsTouchInteracting(false)}
                className="absolute top-2 right-2 z-20 flex items-center gap-1 min-h-[44px] px-3 py-1.5 rounded-md bg-black/85 backdrop-blur-md border border-white/20 text-white font-mono text-xs font-bold shadow-md sm:hidden transition-transform active:scale-95"
              >
                <X size={12} />
                <span>Exit demo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code Tab View */}
      {!isFullscreen && activeTab === "code" && (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  );
};
