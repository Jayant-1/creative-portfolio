"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
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
import { m as motion, AnimatePresence, LayoutGroup } from "framer-motion";
import { LogicalViewport } from "@/lib/component-manifests";
import { buildPreviewUrl } from "@/lib/preview-params";

export type ViewportMode = "desktop" | "tablet" | "mobile";

interface PreviewFrameProps {
  slug: string;
  selectedExampleId?: string;
  customizerValues?: Record<string, any>;
  referenceViewport: {
    desktop: LogicalViewport;
    tablet: LogicalViewport;
    mobile: LogicalViewport;
  };
  scaleOriginalOnMobile?: boolean;
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
  selectedExampleId,
  customizerValues,
  referenceViewport,
  scaleOriginalOnMobile = false,
  activeTab,
  onTabChange,
  onReplay,
  iframeRef,
  children,
  isFullscreen: controlledIsFullscreen,
  onFullscreenToggle,
}) => {
  // Deterministic initial server and client render states to prevent hydration mismatch
  const [containerWidth, setContainerWidth] = useState<number>(1000);
  const [hasMeasuredStage, setHasMeasuredStage] = useState(false);
  const [automaticViewport, setAutomaticViewport] = useState(true);
  const [viewportMode, setViewportMode] = useState<ViewportMode>("desktop");
  const [fullscreenDimensions, setFullscreenDimensions] = useState<{ width: number; height: number }>({
    width: 0,
    height: 0,
  });
  const [isTouchInteracting, setIsTouchInteracting] = useState(false);
  const [internalIsFullscreen, setInternalIsFullscreen] = useState(false);
  const [isIframeLoaded, setIsIframeLoaded] = useState(false);

  // Check if iframe is already loaded on mount (handles fast cache hits or hydration timing)
  useEffect(() => {
    if (iframeRef?.current) {
      try {
        if (iframeRef.current.contentDocument?.readyState === "complete") {
          setIsIframeLoaded(true);
        }
      } catch {
        // Cross-origin fallback
      }
    }
  }, [iframeRef]);

  const userSelectedModeRef = useRef(false);
  const stageMeasureRef = useRef<HTMLDivElement>(null);
  const stageContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenContainerRef = useRef<HTMLDivElement>(null);
  const fullscreenStageRef = useRef<HTMLDivElement>(null);
  const fullscreenTriggerRef = useRef<HTMLButtonElement>(null);
  const exitButtonRef = useRef<HTMLButtonElement>(null);

  const isFullscreen =
    controlledIsFullscreen !== undefined ? controlledIsFullscreen : internalIsFullscreen;

  const previewUrl = useMemo(() => {
    return buildPreviewUrl(slug, selectedExampleId, customizerValues);
  }, [slug, selectedExampleId, customizerValues]);

  const initialIframeSrc = useMemo(() => {
    return buildPreviewUrl(slug, selectedExampleId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [slug]);

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

  // Viewport mode selection:
  // On screens < 640px, default viewportMode should be "mobile" once mounted on client
  // (synced via matchMedia / layout effect, avoiding SSR mismatch).
  useEffect(() => {
    const mql = window.matchMedia("(max-width: 639px)");

    const syncViewportMode = (e: MediaQueryListEvent | MediaQueryList) => {
      if (!userSelectedModeRef.current) {
        setViewportMode(e.matches ? "mobile" : "desktop");
      }
    };

    syncViewportMode(mql);

    if (mql.addEventListener) {
      mql.addEventListener("change", syncViewportMode);
      return () => mql.removeEventListener("change", syncViewportMode);
    } else {
      mql.addListener(syncViewportMode);
      return () => mql.removeListener(syncViewportMode);
    }
  }, []);

  // When exiting fullscreen on mobile screens (< 640px), restore mobile viewport mode
  useEffect(() => {
    if (!isFullscreen && typeof window !== "undefined" && window.innerWidth < 640) {
      userSelectedModeRef.current = false;
      setViewportMode("mobile");
    }
  }, [isFullscreen]);

  const handleSelectViewportMode = useCallback((mode: ViewportMode) => {
    userSelectedModeRef.current = true;
    setAutomaticViewport(false);
    setViewportMode(mode);
  }, []);

  // Measure exact available content width inside the stage (accounting for stage padding: px-1 = 8px or sm:px-2 = 16px, borders, etc.)
  const measureAvailableContentWidth = useCallback((el: HTMLElement | null): number => {
    if (el) {
      const rect = el.getBoundingClientRect();
      if (rect.width > 0) {
        const computed = window.getComputedStyle(el);
        const paddingLeft = parseFloat(computed.paddingLeft) || 0;
        const paddingRight = parseFloat(computed.paddingRight) || 0;
        const borderLeft = parseFloat(computed.borderLeftWidth) || 0;
        const borderRight = parseFloat(computed.borderRightWidth) || 0;
        const contentWidth = rect.width - paddingLeft - paddingRight - borderLeft - borderRight;
        if (contentWidth > 0) {
          return Math.floor(contentWidth);
        }
      }
    }
    // Fallback: measure root stage minus stage padding and border
    if (stageMeasureRef.current) {
      const outerRect = stageMeasureRef.current.getBoundingClientRect();
      if (outerRect.width > 0) {
        const isMobileScreen = typeof window !== "undefined" && window.innerWidth < 640;
        const stagePadding = isMobileScreen ? 8 : 16;
        const stageBorder = 2;
        const fallback = outerRect.width - stagePadding - stageBorder;
        if (fallback > 0) return Math.floor(fallback);
      }
    }
    return 0;
  }, []);

  // Measure stage container dimensions with ResizeObserver, window resize, orientationchange, and tab changes
  useEffect(() => {
    const el = isFullscreen ? fullscreenStageRef.current : stageContainerRef.current;
    if (!el) return;

    const updateDimensions = () => {
      if (isFullscreen) {
        const rect = el.getBoundingClientRect();
        if (rect.width > 0 && rect.height > 0) {
          const computed = window.getComputedStyle(el);
          const padL = parseFloat(computed.paddingLeft) || 0;
          const padR = parseFloat(computed.paddingRight) || 0;
          const padT = parseFloat(computed.paddingTop) || 0;
          const padB = parseFloat(computed.paddingBottom) || 0;
          const w = Math.max(0, Math.floor(rect.width - padL - padR));
          const h = Math.max(0, Math.floor(rect.height - padT - padB));
          setFullscreenDimensions({ width: w, height: h });
        }
      } else {
        const contentWidth = measureAvailableContentWidth(el);
        if (contentWidth > 0) {
          setContainerWidth(contentWidth);
          setHasMeasuredStage(true);
        }
      }
    };

    updateDimensions();

    const rafId = requestAnimationFrame(updateDimensions);

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        if (isFullscreen) {
          let w = 0;
          let h = 0;
          if (entry.contentBoxSize && entry.contentBoxSize.length > 0) {
            w = entry.contentBoxSize[0].inlineSize;
            h = entry.contentBoxSize[0].blockSize;
          } else if (entry.contentRect) {
            w = entry.contentRect.width;
            h = entry.contentRect.height;
          }
          if (w > 0 && h > 0) {
            setFullscreenDimensions({ width: Math.floor(w), height: Math.floor(h) });
          } else {
            updateDimensions();
          }
        } else {
          const measured = measureAvailableContentWidth(el);
          if (measured > 0) {
            setContainerWidth(measured);
          }
        }
      }
    });

    observer.observe(el);

    window.addEventListener("resize", updateDimensions);
    window.addEventListener("orientationchange", updateDimensions);

    return () => {
      cancelAnimationFrame(rafId);
      observer.disconnect();
      window.removeEventListener("resize", updateDimensions);
      window.removeEventListener("orientationchange", updateDimensions);
    };
  }, [activeTab, isFullscreen, measureAvailableContentWidth]);

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

  // Fixed desktop artwork should scale as one canvas in the embedded mobile preview.
  // Explicit fullscreen viewport modes still test the component's native responsiveness.
  const embeddedMobileViewport = scaleOriginalOnMobile
    ? referenceViewport.desktop
    : referenceViewport.mobile;
  const logical = !isFullscreen && viewportMode === "mobile"
    ? embeddedMobileViewport
    : referenceViewport[viewportMode] || referenceViewport.desktop;

  // Calculate scale and dimensions strictly fitting within available stage
  let scale = 1;
  let displayedWidth = containerWidth;
  let displayedHeight = logical.height;

  if (isFullscreen) {
    const availableW =
      fullscreenDimensions.width > 0
        ? fullscreenDimensions.width
        : typeof window !== "undefined"
        ? window.innerWidth - 48
        : 1200;
    const availableH =
      fullscreenDimensions.height > 0
        ? fullscreenDimensions.height
        : typeof window !== "undefined"
        ? window.innerHeight - 130
        : 700;
    scale = Math.min(availableW / logical.width, availableH / logical.height, 1);
    displayedWidth = Math.round(logical.width * scale);
    displayedHeight = Math.round(logical.height * scale);
  } else {
    const availableWidth = containerWidth > 0 ? containerWidth : 1000;
    if (viewportMode === "desktop") {
      scale = availableWidth / logical.width;
      if (logical.width * scale > availableWidth) {
        scale = availableWidth / logical.width;
      }
      displayedWidth = Math.min(availableWidth, Math.round(logical.width * scale));
      displayedHeight = Math.round(logical.height * scale);
    } else {
      // Mobile and Tablet: strictly cap at 1:1, scale down if availableWidth < logical.width
      scale = Math.min(1, availableWidth / logical.width);
      if (logical.width * scale > availableWidth) {
        scale = availableWidth / logical.width;
      }
      displayedWidth = Math.min(availableWidth, Math.round(logical.width * scale));
      displayedHeight = Math.round(logical.height * scale);
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
          <LayoutGroup id="preview-frame-tabs">
            <div
              role="tablist"
              aria-label="Component view modes"
              className="relative inline-flex items-center p-0.5 rounded-lg bg-[var(--ca-ink)]/6 dark:bg-white/8 text-xs font-mono"
            >
              <button
                type="button"
                role="tab"
                id="preview-tab"
                aria-selected={activeTab === "preview"}
                aria-controls="preview-panel"
                tabIndex={activeTab === "preview" ? 0 : -1}
                onClick={() => onTabChange("preview")}
                className={`relative z-10 flex items-center gap-1.5 min-h-[44px] sm:min-h-[28px] px-3.5 py-1.5 sm:py-1 rounded-md text-xs font-mono transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                  activeTab === "preview"
                    ? "text-[var(--ca-ink)] dark:text-white font-semibold"
                    : "text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)] dark:hover:text-white"
                }`}
              >
                {activeTab === "preview" && (
                  <motion.span
                    layoutId="preview-frame-active-tab-indicator"
                    className="absolute inset-0 rounded-md bg-white dark:bg-neutral-800 shadow-xs border border-[var(--ca-ink)]/20 dark:border-white/20 -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                )}
                <Eye size={13} className="shrink-0" />
                <span>Preview</span>
              </button>

              <button
                type="button"
                role="tab"
                id="code-tab"
                aria-selected={activeTab === "code"}
                aria-controls="code-panel"
                tabIndex={activeTab === "code" ? 0 : -1}
                onClick={() => onTabChange("code")}
                className={`relative z-10 flex items-center gap-1.5 min-h-[44px] sm:min-h-[28px] px-3.5 py-1.5 sm:py-1 rounded-md text-xs font-mono transition-colors duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                  activeTab === "code"
                    ? "text-[var(--ca-ink)] dark:text-white font-semibold"
                    : "text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)] dark:hover:text-white"
                }`}
              >
                {activeTab === "code" && (
                  <motion.span
                    layoutId="preview-frame-active-tab-indicator"
                    className="absolute inset-0 rounded-md bg-white dark:bg-neutral-800 shadow-xs border border-[var(--ca-ink)]/20 dark:border-white/20 -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                )}
                <CodeIcon size={13} className="shrink-0" />
                <span>Code</span>
              </button>
            </div>
          </LayoutGroup>

          {/* Action Controls (when preview active) */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <AnimatePresence>
              {activeTab === "preview" && (
                <motion.div
                  key="preview-header-actions"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.15 }}
                  className="flex items-center gap-1.5 sm:gap-2"
                >
                  {/* Replay */}
                  <button
                    type="button"
                    onClick={onReplay}
                    className="min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] inline-flex items-center justify-center rounded-md text-xs font-mono text-[var(--ca-ink)]/75 dark:text-neutral-300 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/6 dark:hover:bg-white/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                    title="Replay entrance animations"
                    aria-label="Replay animations"
                  >
                    <RotateCcw size={14} />
                  </button>

                  {/* Open in new tab */}
                  <a
                    href={previewUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="min-h-[44px] min-w-[44px] sm:min-h-[28px] sm:min-w-[28px] inline-flex items-center justify-center rounded-md text-xs font-mono text-[var(--ca-ink)]/75 dark:text-neutral-300 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/6 dark:hover:bg-white/10 transition-colors focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                    title="Open preview in new tab"
                    aria-label="Open preview in new tab"
                  >
                    <ExternalLink size={14} />
                  </a>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
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
                  onClick={() => handleSelectViewportMode("desktop")}
                  className={`min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center rounded-md transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
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
                  onClick={() => handleSelectViewportMode("tablet")}
                  className={`min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center rounded-md transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
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
                  onClick={() => handleSelectViewportMode("mobile")}
                  className={`min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] flex items-center justify-center rounded-md transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
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
                className="min-h-[44px] sm:min-h-[32px] px-3.5 flex items-center gap-1.5 rounded-md text-xs font-mono bg-white/10 hover:bg-white/15 text-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                aria-label="Replay animations"
              >
                <RotateCcw size={13} />
                <span className="hidden sm:inline">Replay</span>
              </button>

              <a
                href={previewUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="min-h-[44px] min-w-[44px] sm:min-h-[32px] sm:min-w-[32px] inline-flex items-center justify-center rounded-md text-xs font-mono bg-white/10 hover:bg-white/15 text-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                title="Open in new tab"
                aria-label="Open in new tab"
              >
                <ExternalLink size={13} />
              </a>

              <button
                ref={exitButtonRef}
                type="button"
                onClick={() => setIsFullscreen(false)}
                className="min-h-[44px] sm:min-h-[32px] px-3.5 flex items-center gap-1.5 rounded-md text-xs font-mono bg-white/20 hover:bg-white/30 text-white font-bold transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                aria-label="Exit Fullscreen"
              >
                <Minimize2 size={13} />
                <span>Exit (Esc)</span>
              </button>
            </div>
          </div>

          {/* Fullscreen Iframe Container */}
          <div
            ref={fullscreenStageRef}
            className="flex-1 w-full flex items-center justify-center overflow-hidden"
          >
            <div
              style={{
                width: `${displayedWidth}px`,
                maxWidth: "100%",
                height: `${displayedHeight}px`,
              }}
              className="relative overflow-hidden rounded-lg border border-white/15 bg-[#0c0d10] shadow-2xl"
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
                src={initialIframeSrc}
                title={`${slug} interactive component preview`}
                loading="eager"
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

      {/* Content Panels: Seamless Smooth Transition between Preview and Code */}
      {!isFullscreen && (
        <div className="relative w-full overflow-hidden">
          {/* Preview Tab Panel */}
          <div
            id="preview-panel"
            role="tabpanel"
            aria-labelledby="preview-tab"
            aria-hidden={activeTab !== "preview"}
            inert={activeTab !== "preview"}
            className={`w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              activeTab === "preview"
                ? "opacity-100 translate-y-0 pointer-events-auto relative"
                : "opacity-0 translate-y-2 pointer-events-none absolute inset-x-0 top-0 -z-10 h-0 overflow-hidden"
            }`}
          >
            <div
              ref={stageContainerRef}
              className="w-full flex flex-col items-center justify-center select-none py-2 px-1 sm:px-2 bg-neutral-900/10"
            >
              <div
                style={{
                  width: viewportMode === "desktop" ? "100%" : `min(100%, ${logical.width}px)`,
                  maxWidth: "100%",
                  aspectRatio: `${logical.width} / ${logical.height}`,
                  "--preview-mobile-width": `${embeddedMobileViewport.width}px`,
                  "--preview-mobile-ratio": `${embeddedMobileViewport.width} / ${embeddedMobileViewport.height}`,
                } as React.CSSProperties}
                data-auto-viewport={automaticViewport}
                className={`preview-sized-stage relative overflow-hidden bg-[#0c0d10] ${
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

                {hasMeasuredStage && <iframe
                  ref={iframeRef}
                  src={initialIframeSrc}
                  title={`${slug} interactive component preview`}
                  loading="eager"
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
                />}

                {/* Mobile Touch Overlay */}
                {!isTouchInteracting && isIframeLoaded && (
                  <div
                    role="button"
                    tabIndex={0}
                    aria-label="Tap to interact with the component demo"
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
          </div>

          {/* Code Tab View */}
          <div
            id="code-panel"
            role="tabpanel"
            aria-labelledby="code-tab"
            aria-hidden={activeTab !== "code"}
            inert={activeTab !== "code"}
            className={`w-full transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              activeTab === "code"
                ? "opacity-100 translate-y-0 pointer-events-auto relative"
                : "opacity-0 translate-y-2 pointer-events-none absolute inset-x-0 top-0 -z-10 h-0 overflow-hidden"
            }`}
          >
            {children}
          </div>
        </div>
      )}
    </div>
  );
};
