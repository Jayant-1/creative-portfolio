"use client";

import React, { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { CraftComponent } from "@/lib/components-data";
import { getManifest, ExamplePreset } from "@/lib/component-manifests";
import { PreviewFrame } from "./PreviewFrame";
import { ExamplePicker } from "./ExamplePicker";
import { CodeView } from "./CodeView";

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
          props: customizerValues,
        });
      } else if (data.type === "SCROLL_CHANGED") {
        if (typeof data.progress === "number") {
          setScrollProgress(Math.min(1, Math.max(0, data.progress)));
        }
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [customizerValues, postToIframe]);

  // Handle Example Selection
  const handleSelectExample = (example: ExamplePreset) => {
    setSelectedExampleId(example.id);
    const newProps = { ...example.props };
    setCustomizerValues(newProps);

    // Switch to preview if currently in code tab
    if (activeTab === "code") {
      setActiveTab("preview");
    }

    // Reset scroll progress state
    setScrollProgress(0);

    // Completely replace props in iframe and restart intro
    postToIframe({
      type: "SET_PROPS",
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

  return (
    <div className="w-full flex flex-col my-0 gap-3 sm:gap-4">
      {/* 1. Preview Stage or Code View */}
      <PreviewFrame
        slug={normalizedSlug}
        referenceViewport={manifest.referenceViewport}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onReplay={handleReplay}
        scrollProgress={scrollProgress}
        onScrollChange={handleScrollChange}
        iframeRef={iframeRef}
        isScrollLinked={isScrollLinked}
      >
        <CodeView usageCode={usageCode} sourceCode={component.code} />
      </PreviewFrame>

      {/* 2. Examples Section: One Compact Thumbnail Row */}
      <ExamplePicker
        examples={manifest.examples}
        selectedId={selectedExampleId}
        onSelect={handleSelectExample}
      />
    </div>
  );
};
