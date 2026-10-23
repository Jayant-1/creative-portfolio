"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef, Suspense } from "react";
import { ArrowLeft, RotateCcw, ChevronDown, ChevronUp, Sliders } from "lucide-react";
import { getManifest } from "@/lib/component-manifests";
import {
  parsePreviewParams,
  loadPreviewConfig,
  savePreviewConfig,
  buildPreviewUrl,
  normalizeSlug,
} from "@/lib/preview-params";

const OverlappingTextHero = React.lazy(() =>
  import("@/components/showcase/OverlappingTextHero").then((mod) => ({
    default: mod.OverlappingTextHero,
  }))
);

const TelescopeHero = React.lazy(() =>
  import("@/components/showcase/TelescopeHero").then((mod) => ({
    default: mod.TelescopeHero,
  }))
);

const BinaryGrid = React.lazy(() =>
  import("@/components/showcase/BinaryGrid").then((mod) => ({
    default: mod.BinaryGrid,
  }))
);

const BubbleText = React.lazy(() =>
  import("@/components/showcase/BubbleText").then((mod) => ({
    default: mod.BubbleText,
  }))
);

const MagneticButton = React.lazy(() =>
  import("@/components/showcase/MagneticButton").then((mod) => ({
    default: mod.MagneticButton,
  }))
);

const RadialGradientAnimateCard = React.lazy(() =>
  import("@/components/showcase/RadialGradientAnimateCard").then((mod) => ({
    default: mod.RadialGradientAnimateCard,
  }))
);

interface PreviewClientProps {
  slug: string;
}

export function PreviewClient({ slug }: PreviewClientProps) {
  const normalizedSlug = normalizeSlug(slug);
  const manifest = useMemo(() => getManifest(normalizedSlug), [normalizedSlug]);
  const defaultProps = useMemo(() => manifest.examples[0].props, [manifest]);

  const [activePresetId, setActivePresetId] = useState<string>(
    () => manifest.examples[0].id
  );
  const [props, setProps] = useState<Record<string, any>>(defaultProps);
  const [remountKey, setRemountKey] = useState<number>(0);
  const [isStandalone, setIsStandalone] = useState<boolean>(false);
  const [isControlsCollapsed, setIsControlsCollapsed] = useState<boolean>(false);

  const scrollRafRef = useRef<number | null>(null);

  // Initialize preset and config from URL search parameters, localStorage, or manifest defaults
  useEffect(() => {
    if (typeof window === "undefined") return;

    // Detect if running standalone or inside an iframe
    const standalone = window.self === window.top;
    setIsStandalone(standalone);

    // 1. Check URL parameters first (e.g. ?preset=developer or ?title=...)
    const parsed = parsePreviewParams(normalizedSlug, window.location.search);
    if (parsed.hasUrlOverrides) {
      setActivePresetId(parsed.presetId);
      setProps(parsed.props);
      savePreviewConfig(normalizedSlug, parsed.presetId, parsed.props);
      return;
    }

    // 2. Check localStorage for user's previous selection/config
    const saved = loadPreviewConfig(normalizedSlug);
    if (saved && saved.props) {
      if (saved.presetId) {
        setActivePresetId(saved.presetId);
      }
      setProps(saved.props);
      return;
    }

    // 3. Fallback to default preset
    setActivePresetId(manifest.examples[0].id);
    setProps(manifest.examples[0].props);
  }, [normalizedSlug, manifest]);

  // Send PREVIEW_READY handshake to parent with validated target origin
  useEffect(() => {
    try {
      if (window.parent && window.parent !== window) {
        window.parent.postMessage(
          {
            type: "PREVIEW_READY",
            slug: normalizedSlug,
          },
          window.location.origin
        );
      }
    } catch (err) {
      console.warn("Handshake postMessage failed", err);
    }
  }, [normalizedSlug]);

  // Report scroll changes to parent throttled by requestAnimationFrame
  const handleScroll = useCallback(() => {
    if (scrollRafRef.current) return;
    scrollRafRef.current = window.requestAnimationFrame(() => {
      scrollRafRef.current = null;
      try {
        if (window.parent && window.parent !== window) {
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          const progress =
            maxScroll > 0
              ? Math.min(1, Math.max(0, window.scrollY / maxScroll))
              : 0;
          window.parent.postMessage(
            {
              type: "SCROLL_CHANGED",
              slug: normalizedSlug,
              progress,
            },
            window.location.origin
          );
        }
      } catch (err) {
        console.warn("Scroll postMessage failed", err);
      }
    });
  }, [normalizedSlug]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollRafRef.current) {
        window.cancelAnimationFrame(scrollRafRef.current);
      }
    };
  }, [handleScroll]);

  // Forward Escape keydown to parent for fullscreen dismissal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        try {
          if (window.parent && window.parent !== window) {
            window.parent.postMessage(
              {
                type: "KEY_DOWN",
                key: "Escape",
              },
              window.location.origin
            );
          }
        } catch (err) {
          console.warn("Escape key forward failed", err);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Listen for parent messages (UPDATE_PROPS, SET_PROPS, REPLAY, RESET) with origin and sender validation
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Validate origin
      if (event.origin !== window.location.origin) return;
      // Validate sender
      if (event.source !== window.parent) return;

      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "UPDATE_PROPS") {
        if (data.props) {
          setProps((prev) => {
            const next = {
              ...prev,
              ...data.props,
            };
            savePreviewConfig(normalizedSlug, activePresetId, next);
            return next;
          });
        }
      } else if (data.type === "SET_PROPS") {
        // Complete replacement of props (used when switching examples)
        if (data.props) {
          if (data.presetId) {
            setActivePresetId(data.presetId);
          }
          setProps(data.props);
          savePreviewConfig(
            normalizedSlug,
            data.presetId || activePresetId,
            data.props
          );
          window.scrollTo({ top: 0, behavior: "auto" });
          setRemountKey((k) => k + 1);
        }
      } else if (data.type === "RESET") {
        const resetProps = data.props ?? defaultProps;
        setProps(resetProps);
        savePreviewConfig(normalizedSlug, activePresetId, resetProps);
        window.scrollTo({ top: 0, behavior: "auto" });
        setRemountKey((k) => k + 1);
      } else if (data.type === "REPLAY") {
        window.scrollTo({ top: 0, behavior: "auto" });
        setRemountKey((k) => k + 1);
      } else if (data.type === "SET_SCROLL") {
        if (typeof data.progress === "number") {
          const clamped = Math.min(1, Math.max(0, data.progress));
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;
          if (maxScroll > 0) {
            window.scrollTo({
              top: clamped * maxScroll,
              behavior: data.smooth ? "smooth" : "auto",
            });
          }
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [defaultProps, normalizedSlug, activePresetId]);

  // Handle Preset Selection in Standalone Mode
  const handleSelectPreset = useCallback(
    (presetId: string) => {
      const found = manifest.examples.find((e) => e.id === presetId);
      if (!found) return;

      setActivePresetId(found.id);
      setProps(found.props);
      savePreviewConfig(normalizedSlug, found.id, found.props);

      if (typeof window !== "undefined") {
        const newUrl = buildPreviewUrl(slug, found.id);
        window.history.replaceState(null, "", newUrl);
        window.scrollTo({ top: 0, behavior: "auto" });
      }
      setRemountKey((k) => k + 1);
    },
    [manifest, normalizedSlug, slug]
  );

  // Reset active preset to defaults
  const handleResetCurrentPreset = useCallback(() => {
    const active =
      manifest.examples.find((e) => e.id === activePresetId) ||
      manifest.examples[0];
    const base = { ...active.props };
    setProps(base);
    savePreviewConfig(normalizedSlug, active.id, base);

    if (typeof window !== "undefined") {
      const newUrl = buildPreviewUrl(slug, active.id);
      window.history.replaceState(null, "", newUrl);
      window.scrollTo({ top: 0, behavior: "auto" });
    }
    setRemountKey((k) => k + 1);
  }, [manifest, activePresetId, normalizedSlug, slug]);

  // Format radial-gradient-card props if passed in flat format
  const resolvedProps = useMemo(() => {
    if (normalizedSlug === "radial-gradient-card") {
      if (props.radialGradient) return props;
      return {
        ...props,
        radialGradient: {
          color1: props.color1 ?? "rgba(59, 130, 246)",
          color2: "transparent",
          shape: props.shape ?? "circle",
          size: props.size ?? "10rem",
          opacity: typeof props.opacity === "number" ? props.opacity : 0.5,
        },
      };
    }
    return props;
  }, [normalizedSlug, props]);

  return (
    <div key={remountKey} className="w-full min-h-screen relative">
      {/* Standalone Interactive Floating Preset & Config Header Bar (only when outside iframe) */}
      {isStandalone && (
        <aside
          aria-label="Preset and navigation toolbar"
          className="fixed top-3 left-1/2 -translate-x-1/2 z-50 flex items-center gap-2 max-w-[calc(100vw-1.5rem)] px-3 py-1.5 rounded-full bg-neutral-900/90 backdrop-blur-md border border-white/15 text-white shadow-2xl transition-all"
        >
          {/* Back to Docs */}
          <a
            href={`/components/${slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-neutral-300 hover:text-white px-2 py-1 rounded-md hover:bg-white/10 transition-colors"
            title="Back to component documentation"
          >
            <ArrowLeft size={13} />
            <span className="hidden sm:inline">Docs</span>
          </a>

          <div className="h-3.5 w-px bg-white/20" />

          {/* Collapsed vs Expanded Preset Pills */}
          {!isControlsCollapsed ? (
            <>
              <span className="font-mono text-[10px] text-neutral-400 uppercase tracking-wider hidden md:inline">
                PRESET:
              </span>

              <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                {manifest.examples.map((ex) => {
                  const isSelected = ex.id === activePresetId;
                  return (
                    <button
                      key={ex.id}
                      type="button"
                      onClick={() => handleSelectPreset(ex.id)}
                      className={`px-2.5 py-1 rounded-full text-xs font-mono font-medium transition-all shrink-0 ${
                        isSelected
                          ? "bg-[var(--ca-orange)] text-white shadow-xs font-bold"
                          : "text-neutral-300 hover:text-white hover:bg-white/10"
                      }`}
                    >
                      {ex.name}
                    </button>
                  );
                })}
              </div>

              {/* Reset to preset defaults */}
              <button
                type="button"
                onClick={handleResetCurrentPreset}
                className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors"
                title="Reset to preset defaults"
                aria-label="Reset preset defaults"
              >
                <RotateCcw size={13} />
              </button>
            </>
          ) : (
            <span className="font-mono text-xs text-neutral-300 px-1 truncate max-w-[120px]">
              {manifest.examples.find((e) => e.id === activePresetId)?.name ||
                "Preset"}
            </span>
          )}

          {/* Minimize / Expand Bar */}
          <button
            type="button"
            onClick={() => setIsControlsCollapsed((c) => !c)}
            className="p-1 rounded-md text-neutral-400 hover:text-white hover:bg-white/10 transition-colors ml-0.5"
            title={isControlsCollapsed ? "Expand presets" : "Collapse toolbar"}
            aria-label={isControlsCollapsed ? "Expand presets" : "Collapse toolbar"}
          >
            {isControlsCollapsed ? (
              <ChevronDown size={13} />
            ) : (
              <ChevronUp size={13} />
            )}
          </button>
        </aside>
      )}

      {/* Live Component Render Stage */}
      <Suspense fallback={null}>
        {normalizedSlug === "overlapping-text-hero" && (
          <OverlappingTextHero {...resolvedProps} />
        )}

        {normalizedSlug === "telescope-hero" && (
          <TelescopeHero {...resolvedProps} />
        )}

        {normalizedSlug === "binary-grid" && (
          <BinaryGrid {...resolvedProps} />
        )}

        {normalizedSlug === "bubble-text" && (
          <div className="flex min-h-screen w-full items-center justify-center p-8 bg-neutral-950">
            <BubbleText {...resolvedProps} />
          </div>
        )}

        {normalizedSlug === "magnetic-button" && (
          <div className="flex min-h-screen w-full items-center justify-center p-8 bg-neutral-950">
            <MagneticButton {...resolvedProps}>
              {resolvedProps.children ?? "Hover Me"}
            </MagneticButton>
          </div>
        )}

        {normalizedSlug === "radial-gradient-card" && (
          <div className="flex min-h-screen w-full items-center justify-center p-8 bg-neutral-950">
            <RadialGradientAnimateCard {...resolvedProps} />
          </div>
        )}
      </Suspense>
    </div>
  );
}
