"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { motion, LayoutGroup } from "framer-motion";
import { highlightLine } from "../CodeViewer";
import { trackComponentCopy } from "@/lib/analytics";

interface CodeViewProps {
  usageCode: string;
  sourceCode: string;
  cssCode?: string;
  cssFileName?: string;
}

export const CodeView: React.FC<CodeViewProps> = ({
  usageCode,
  sourceCode,
  cssCode,
  cssFileName = "styles.css",
}) => {
  const [subTab, setSubTab] = useState<"usage" | "source" | "css">("usage");
  const [copied, setCopied] = useState(false);

  const activeCode =
    subTab === "usage" ? usageCode : subTab === "source" ? sourceCode : (cssCode ?? "");
  const lines = activeCode.trim().split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      const copyType = subTab === "usage" ? "snippet" : "code";
      trackComponentCopy("playground", copyType);
    } catch (err) {
      console.warn("Copy failed", err);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#0c0d10] text-neutral-200 overflow-hidden">
      {/* Code Sub-Tabs & Copy */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5 flex-wrap gap-2">
        <LayoutGroup id="code-view-subtabs">
          <div className="relative inline-flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
            <button
              type="button"
              onClick={() => setSubTab("usage")}
              className={`relative z-10 min-h-[44px] sm:min-h-[28px] px-3 py-1 rounded-md text-xs font-mono transition-colors duration-200 inline-flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                subTab === "usage"
                  ? "text-white font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {subTab === "usage" && (
                <motion.span
                  layoutId="code-view-active-subtab"
                  className="absolute inset-0 rounded-md bg-white/20 border border-white/25 shadow-xs -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              Usage Example
            </button>
            <button
              type="button"
              onClick={() => setSubTab("source")}
              className={`relative z-10 min-h-[44px] sm:min-h-[28px] px-3 py-1 rounded-md text-xs font-mono transition-colors duration-200 inline-flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                subTab === "source"
                  ? "text-white font-bold"
                  : "text-neutral-400 hover:text-white"
              }`}
            >
              {subTab === "source" && (
                <motion.span
                  layoutId="code-view-active-subtab"
                  className="absolute inset-0 rounded-md bg-white/20 border border-white/25 shadow-xs -z-10"
                  transition={{ type: "spring", stiffness: 500, damping: 32 }}
                />
              )}
              Component Source
            </button>
            {cssCode && (
              <button
                type="button"
                onClick={() => setSubTab("css")}
                className={`relative z-10 min-h-[44px] sm:min-h-[28px] px-3 py-1 rounded-md text-xs font-mono transition-colors duration-200 inline-flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                  subTab === "css"
                    ? "text-white font-bold"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                {subTab === "css" && (
                  <motion.span
                    layoutId="code-view-active-subtab"
                    className="absolute inset-0 rounded-md bg-white/20 border border-white/25 shadow-xs -z-10"
                    transition={{ type: "spring", stiffness: 500, damping: 32 }}
                  />
                )}
                {cssFileName}
              </button>
            )}
          </div>
        </LayoutGroup>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="min-h-[44px] sm:min-h-[28px] inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono bg-white/10 hover:bg-white/15 text-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
        >
          {copied ? <Check size={14} className="text-emerald-400" /> : <Copy size={14} />}
          <span>{copied ? "Copied" : "Copy Code"}</span>
        </button>
      </div>

      {/* Code Body */}
      <div
        tabIndex={0}
        role="region"
        aria-label="Component source code"
        className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed select-text focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-[var(--ca-orange)]"
      >
        <pre className="grid">
          {lines.map((line, idx) => (
            <div key={idx} className="table-row hover:bg-white/5">
              <span className="table-cell pr-4 text-right select-none text-neutral-400 w-8">
                {idx + 1}
              </span>
              <span className="table-cell whitespace-pre">{highlightLine(line)}</span>
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
};
