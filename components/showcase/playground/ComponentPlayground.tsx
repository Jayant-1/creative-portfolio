"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { LazyMotion } from "framer-motion";
import { CraftComponent } from "@/lib/components-data";
import { getManifest, ExamplePreset } from "@/lib/component-manifests";
import {
  parsePreviewParams,
  savePreviewConfig,
  loadPreviewConfig,
} from "@/lib/preview-params";
import { PreviewFrame } from "./PreviewFrame";
import { ExamplePicker } from "./ExamplePicker";
import { CustomizeControls } from "./CustomizeControls";
import { CodeView } from "./CodeView";
import { BINARY_GRID_CSS } from "../binary-grid-css";

const loadLayoutFeatures = () => import("@/lib/layout-motion-features").then((module) => module.default);

interface ComponentPlaygroundProps {
  component: CraftComponent;
}

export const ComponentPlayground: React.FC<ComponentPlaygroundProps> = ({ component }) => {
  const normalizedSlug =
    component.slug === "radial-gradient-animate-card"
      ? "radial-gradient-card"
      : component.slug;

  const manifest = useMemo(() => getManifest(normalizedSlug), [normalizedSlug]);

  const [activeTab, setActiveTab] = useState<"preview" | "code">("preview");
  const [selectedExampleId, setSelectedExampleId] = useState<string>(
    manifest.examples[0].id
  );
  const [customizerValues, setCustomizerValues] = useState<Record<string, any>>(
    () => ({ ...manifest.examples[0].props })
  );
  const [scrollProgress, setScrollProgress] = useState<number>(0);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);

  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Active selected example object
  const selectedExample = useMemo(() => {
    return (
      manifest.examples.find((ex) => ex.id === selectedExampleId) ||
      manifest.examples[0]
    );
  }, [manifest, selectedExampleId]);

  // Send message to iframe with exact origin validation
  const postToIframe = useCallback((payload: Record<string, any>) => {
    if (!iframeRef.current?.contentWindow) return;
    try {
      iframeRef.current.contentWindow.postMessage(payload, window.location.origin);
    } catch (err) {
      console.warn("Failed to postMessage to iframe", err);
    }
  }, []);

  // Initialize preset and props from URL search parameters or localStorage
  useEffect(() => {
    if (typeof window === "undefined") return;

    // 1. Check URL parameters first (e.g. ?preset=developer)
    const fromUrl = parsePreviewParams(normalizedSlug, window.location.search);
    if (fromUrl.hasUrlOverrides) {
      setSelectedExampleId(fromUrl.presetId);
      setCustomizerValues(fromUrl.props);
      savePreviewConfig(normalizedSlug, fromUrl.presetId, fromUrl.props);
      postToIframe({
        type: "SET_PROPS",
        presetId: fromUrl.presetId,
        props: fromUrl.props,
      });
      return;
    }

    // 2. Check localStorage fallback
    const saved = loadPreviewConfig(normalizedSlug);
    if (saved && saved.props) {
      if (saved.presetId) {
        setSelectedExampleId(saved.presetId);
      }
      setCustomizerValues(saved.props);
      postToIframe({
        type: "SET_PROPS",
        presetId: saved.presetId,
        props: saved.props,
      });
    }
  }, [normalizedSlug, postToIframe]);

  // Listen for iframe events with strict origin and sender checks
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin !== window.location.origin) return;
      if (event.source !== iframeRef.current?.contentWindow) return;

      const data = event.data;
      if (!data || typeof data !== "object") return;

      if (data.type === "PREVIEW_READY") {
        // Send initial props on handshake
        postToIframe({
          type: "SET_PROPS",
          presetId: selectedExampleId,
          props: customizerValues,
        });
      } else if (data.type === "SCROLL_CHANGED") {
        if (typeof data.progress === "number") {
          setScrollProgress(Math.min(1, Math.max(0, data.progress)));
        }
      } else if (data.type === "KEY_DOWN") {
        if (data.key === "Escape") {
          setIsFullscreen(false);
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [selectedExampleId, customizerValues, postToIframe]);

  // Handle Example Selection
  const handleSelectExample = (example: ExamplePreset) => {
    setSelectedExampleId(example.id);
    const newProps = { ...example.props };
    setCustomizerValues(newProps);

    // Save to localStorage
    savePreviewConfig(normalizedSlug, example.id, newProps);

    // Update browser URL query param without page reload
    if (typeof window !== "undefined") {
      const url = new URL(window.location.href);
      url.searchParams.set("preset", example.id);
      window.history.replaceState(null, "", url.toString());
    }

    // Switch to preview if currently in code tab
    if (activeTab === "code") {
      setActiveTab("preview");
    }

    // Reset scroll progress state
    setScrollProgress(0);

    // Completely replace props in iframe and restart intro
    postToIframe({
      type: "SET_PROPS",
      presetId: example.id,
      props: newProps,
    });

    // Bring preview into view if scrolled far down
    const stageEl = document.getElementById("sandbox-stage");
    if (stageEl) {
      const rect = stageEl.getBoundingClientRect();
      if (rect.top < 60 || rect.bottom < 200) {
        const prefersReducedMotion =
          typeof window !== "undefined" &&
          window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        stageEl.scrollIntoView({
          behavior: prefersReducedMotion ? "auto" : "smooth",
          block: "start",
        });
      }
    }
  };

  // Handle Replay
  const handleReplay = () => {
    setScrollProgress(0);
    postToIframe({ type: "REPLAY" });
  };

  // Handle Scrubber Change
  const handleScrollChange = (prog: number) => {
    const clamped = Math.min(1, Math.max(0, prog));
    setScrollProgress(clamped);
    postToIframe({
      type: "SET_SCROLL",
      progress: clamped,
      smooth: false,
    });
  };

  const isScrollLinked =
    normalizedSlug === "overlapping-text-hero" ||
    normalizedSlug === "telescope-hero";

  // Dynamic Usage Code generated from active customizer values
  const usageCode = useMemo(() => {
    return manifest.generateUsageCode(customizerValues);
  }, [manifest, customizerValues]);

  // Check if current customized props differ from the active example preset defaults
  const isModified = useMemo(() => {
    const defaultProps = selectedExample.props || {};
    const allKeys = new Set([
      ...Object.keys(customizerValues),
      ...Object.keys(defaultProps),
    ]);
    for (const k of allKeys) {
      if (customizerValues[k] !== defaultProps[k]) {
        return true;
      }
    }
    return false;
  }, [customizerValues, selectedExample]);

  // Handle live customizer field change
  const handleCustomizerChange = useCallback(
    (key: string, value: any) => {
      setCustomizerValues((prev) => {
        const next = {
          ...prev,
          [key]: value,
        };
        savePreviewConfig(normalizedSlug, selectedExampleId, next);
        return next;
      });
      postToIframe({
        type: "UPDATE_PROPS",
        props: { [key]: value },
      });
    },
    [normalizedSlug, selectedExampleId, postToIframe]
  );

  // Handle reset to preset defaults
  const handleResetToPreset = useCallback(() => {
    const presetProps = { ...selectedExample.props };
    setCustomizerValues(presetProps);
    savePreviewConfig(normalizedSlug, selectedExample.id, presetProps);
    postToIframe({
      type: "SET_PROPS",
      presetId: selectedExample.id,
      props: presetProps,
    });
  }, [normalizedSlug, selectedExample, postToIframe]);

  return (
    <LazyMotion features={loadLayoutFeatures}>
    <div className="w-full flex flex-col my-0 gap-3">
      {/* 1. Preview Stage or Code View */}
      <PreviewFrame
        slug={normalizedSlug}
        selectedExampleId={selectedExampleId}
        customizerValues={customizerValues}
        referenceViewport={manifest.referenceViewport}
        scaleOriginalOnMobile={manifest.previewSizing === "scale-original"}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReplay={handleReplay}
        scrollProgress={scrollProgress}
        onScrollChange={handleScrollChange}
        iframeRef={iframeRef}
        isScrollLinked={isScrollLinked}
        isFullscreen={isFullscreen}
        onFullscreenToggle={setIsFullscreen}
      >
        <CodeView
          usageCode={usageCode}
          sourceCode={component.code}
          cssCode={normalizedSlug === "binary-grid" ? BINARY_GRID_CSS : undefined}
          cssFileName="BinaryGrid.css"
        />
      </PreviewFrame>

      {/* 2. Examples Section: One Compact Thumbnail Row */}
      <ExamplePicker
        examples={manifest.examples}
        selectedId={selectedExampleId}
        onSelect={handleSelectExample}
      />

      {/* 3. Simple Customize Panel */}
      <CustomizeControls
        fields={manifest.customFields}
        values={customizerValues}
        onChange={handleCustomizerChange}
        isModified={isModified}
        onReset={handleResetToPreset}
        selectedExampleName={selectedExample.name}
      />
    </div>
    </LazyMotion>
  );
};
