"use client";

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  RotateCcw,
  Maximize2,
  Minimize2,
  Eye,
  Code as CodeIcon,
  Play,
  X,
} from "lucide-react";
import { LogicalViewport } from "@/lib/component-manifests";

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
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);
  const stageMeasureRef = useRef<HTMLDivElement>(null);
  const previousFocusRef = useRef<HTMLElement | null>(null);
  const exitButtonRef = useRef<HTMLButtonElement | null>(null);

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

  // Fullscreen body scroll lock, focus restoration, and escape listener
  useEffect(() => {
    if (!isFullscreen) return;

    previousFocusRef.current = document.activeElement as HTMLElement | null;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Auto-focus exit button for keyboard accessibility
    setTimeout(() => {
      exitButtonRef.current?.focus();
    }, 50);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      if (previousFocusRef.current && typeof previousFocusRef.current.focus === "function") {
        previousFocusRef.current.focus();
      }
    };
  }, [isFullscreen, setIsFullscreen]);

  // Automatically release touch interaction on outer document scroll to prevent trapping
  useEffect(() => {
    if (!isTouchInteracting) return;
    const handleScroll = () => {
      setIsTouchInteracting(false);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isTouchInteracting]);

  // Logical viewport for desktop
  const logical = referenceViewport.desktop;

  // Calculate uniform scale
  let scale = 1;
  if (isFullscreen) {
    const availableW = typeof window !== "undefined" ? window.innerWidth - 48 : 1200;
    const availableH = typeof window !== "undefined" ? window.innerHeight - 120 : 700;
    scale = Math.min(availableW / logical.width, availableH / logical.height, 1);
  } else {
    // When not fullscreen, preview fills the full container width matching the code view
    const usableWidth = containerWidth > 0 ? containerWidth : 860;
    scale = usableWidth / logical.width;
  }

  const displayedWidth = isFullscreen ? Math.round(logical.width * scale) : containerWidth;
  const displayedHeight = Math.round(logical.height * scale);

  return (
    <div
      ref={stageMeasureRef}
      id="sandbox-stage"
      className={
        isFullscreen
          ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#0a0a0c]/95 backdrop-blur-md p-4 sm:p-6 overflow-hidden"
          : "w-full flex flex-col rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4] dark:bg-[#121316] overflow-hidden shadow-xs"
      }
    >
      {/* Top Header Bar (when not in fullscreen) */}
      {!isFullscreen && (
        <div className="w-full flex items-center justify-between px-3 sm:px-4 py-2 border-b border-[var(--ca-ink)]/10 dark:border-white/10 bg-white/70 dark:bg-[#15171c]/70 backdrop-blur-xs">
          {/* Clean Segmented Tab Control: Single pill, zero redundant boxes */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-[var(--ca-ink)]/6 dark:bg-white/8 text-xs font-mono">
            <button
              type="button"
              onClick={() => onTabChange("preview")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                activeTab === "preview"
                  ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white font-semibold shadow-xs border border-[var(--ca-ink)]/20 dark:border-white/20"
                  : "border border-transparent text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
              }`}
            >
              <Eye size={12} />
              <span>Preview</span>
            </button>

            <button
              type="button"
              onClick={() => onTabChange("code")}
              className={`flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                activeTab === "code"
                  ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white font-semibold shadow-xs border border-[var(--ca-ink)]/20 dark:border-white/20"
                  : "border border-transparent text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
              }`}
            >
              <CodeIcon size={12} />
              <span>Code</span>
            </button>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-1 sm:gap-1.5">
            {activeTab === "preview" && (
              <>
                <button
                  type="button"
                  onClick={onReplay}
                  className="h-7 px-2.5 flex items-center gap-1.5 rounded-md text-xs font-mono text-[var(--ca-ink)]/75 dark:text-neutral-300 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/6 dark:hover:bg-white/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                  title="Replay entrance animations"
                >
                  <RotateCcw size={12} />
                  <span className="hidden sm:inline">Replay</span>
                </button>

                <button
                  type="button"
                  onClick={() => setIsFullscreen(true)}
                  className="h-7 w-7 inline-flex items-center justify-center rounded-md text-xs font-mono text-[var(--ca-ink)]/75 dark:text-neutral-300 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/6 dark:hover:bg-white/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                  title="Fullscreen preview (Press Escape to exit)"
                  aria-label="Enter Fullscreen"
                >
                  <Maximize2 size={13} />
                </button>
              </>
            )}
          </div>
        </div>
      )}

      {/* Fullscreen Exit Header Bar */}
      {isFullscreen && (
        <div className="w-full max-w-5xl flex items-center justify-between pb-3 mb-2 border-b border-white/10 text-white">
          <div className="flex items-center gap-2 font-mono text-xs text-neutral-400">
            <span className="text-white font-bold">{slug}</span>
            <span>/</span>
            <span>Desktop ({logical.width}x{logical.height})</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onReplay}
              className="h-8 px-3 flex items-center gap-1.5 rounded-md text-xs font-mono bg-white/10 hover:bg-white/15 text-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
            >
              <RotateCcw size={12} />
              <span>Replay</span>
            </button>

            <button
              ref={exitButtonRef}
              type="button"
              onClick={() => setIsFullscreen(false)}
              className="h-8 px-3 flex items-center gap-1.5 rounded-md text-xs font-mono bg-white/20 hover:bg-white/30 text-white font-bold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
              aria-label="Exit Fullscreen"
            >
              <Minimize2 size={13} />
              <span>Exit (Esc)</span>
            </button>
          </div>
        </div>
      )}

      {/* Preview View: Iframe Stage */}
      {activeTab === "preview" && (
        <div className={isFullscreen ? "flex-1 w-full flex items-center justify-center overflow-hidden" : "w-full flex flex-col items-center justify-center select-none"}>
          <div
            style={{
              width: isFullscreen ? `${displayedWidth}px` : "100%",
              maxWidth: "100%",
              height: `${displayedHeight}px`,
            }}
            className={
              isFullscreen
                ? "relative overflow-hidden rounded-lg border border-white/10 bg-[#0c0d10] shadow-sm transition-all"
                : "relative w-full overflow-hidden bg-[#0c0d10] transition-all"
            }
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
                isFullscreen || isTouchInteracting
                  ? "pointer-events-auto"
                  : "pointer-events-none sm:pointer-events-auto"
              }`}
            />

            {/* Mobile Touch Overlay */}
            {!isFullscreen && !isTouchInteracting && isIframeLoaded && (
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
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-semibold shadow-lg transition-transform active:scale-95">
                  <Play size={10} className="fill-white" />
                  <span>Tap to interact</span>
                </div>
              </div>
            )}

            {/* Mobile Exit Demo Button */}
            {!isFullscreen && isTouchInteracting && (
              <button
                type="button"
                onClick={() => setIsTouchInteracting(false)}
                className="absolute top-2 right-2 z-20 flex items-center gap-1 px-2.5 py-1 rounded-md bg-black/80 backdrop-blur-md border border-white/20 text-white font-mono text-[10px] font-bold shadow-md sm:hidden transition-transform active:scale-95"
              >
                <X size={11} />
                <span>Exit demo</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* Code Tab View */}
      {activeTab === "code" && (
        <div className="w-full">
          {children}
        </div>
      )}
    </div>
  );
};
