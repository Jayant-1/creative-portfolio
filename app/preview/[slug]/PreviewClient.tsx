"use client";

import React, { useEffect, useState, useMemo, useCallback, useRef } from "react";
import { OverlappingTextHero } from "@/components/showcase/OverlappingTextHero";
import { TelescopeHero } from "@/components/showcase/TelescopeHero";
import { BinaryGrid } from "@/components/showcase/BinaryGrid";
import { BubbleText } from "@/components/showcase/BubbleText";
import { MagneticButton } from "@/components/showcase/MagneticButton";
import { RadialGradientAnimateCard } from "@/components/showcase/RadialGradientAnimateCard";
import { getManifest } from "@/lib/component-manifests";

interface PreviewClientProps {
  slug: string;
}

export function PreviewClient({ slug }: PreviewClientProps) {
  const normalizedSlug =
    slug === "radial-gradient-animate-card" ? "radial-gradient-card" : slug;

  const manifest = useMemo(() => getManifest(normalizedSlug), [normalizedSlug]);
  const defaultProps = useMemo(() => manifest.examples[0].props, [manifest]);

  const [props, setProps] = useState<Record<string, any>>(defaultProps);
  const [remountKey, setRemountKey] = useState<number>(0);
  const scrollRafRef = useRef<number | null>(null);

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

  // Listen for parent messages (UPDATE_PROPS, SET_SCROLL, REPLAY, RESET) with origin and sender validation
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
          setProps((prev) => ({
            ...prev,
            ...data.props,
          }));
        }
      } else if (data.type === "SET_PROPS") {
        // Complete replacement of props (used when switching examples)
        if (data.props) {
          setProps(data.props);
          window.scrollTo({ top: 0, behavior: "auto" });
          setRemountKey((k) => k + 1);
        }
      } else if (data.type === "RESET") {
        setProps(data.props ?? defaultProps);
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
  }, [defaultProps]);

  // Format radial-gradient-card props if passed in flat format
  const resolvedProps = useMemo(() => {
    if (normalizedSlug === "radial-gradient-card") {
      if (props.radialGradient) return props;
      return {
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
    <div key={remountKey} className="w-full min-h-screen">
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
    </div>
  );
}
