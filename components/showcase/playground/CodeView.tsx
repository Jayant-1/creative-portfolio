"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { highlightLine } from "../CodeViewer";
import { trackComponentCopy } from "@/lib/analytics";

interface CodeViewProps {
  usageCode: string;
  sourceCode: string;
}

export const CodeView: React.FC<CodeViewProps> = ({
  usageCode,
  sourceCode,
}) => {
  const [subTab, setSubTab] = useState<"usage" | "source">("usage");
  const [copied, setCopied] = useState(false);

  const activeCode = subTab === "usage" ? usageCode : sourceCode;
  const lines = activeCode.trim().split("\n");

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeCode);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      trackComponentCopy("playground", subTab === "usage" ? "snippet" : "code");
    } catch (err) {
      console.warn("Copy failed", err);
    }
  };

  return (
    <div className="w-full flex flex-col bg-[#0c0d10] text-neutral-200 overflow-hidden">
      {/* Code Sub-Tabs & Copy */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-white/10 bg-white/5 flex-wrap gap-2">
        <div className="inline-flex items-center p-0.5 rounded-lg bg-black/40 border border-white/10 text-xs font-mono">
          <button
            type="button"
            onClick={() => setSubTab("usage")}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all inline-flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
              subTab === "usage"
                ? "bg-white/20 border border-white/25 text-white font-bold shadow-xs"
                : "border border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            Usage Example
          </button>
          <button
            type="button"
            onClick={() => setSubTab("source")}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all inline-flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
              subTab === "source"
                ? "bg-white/20 border border-white/25 text-white font-bold shadow-xs"
                : "border border-transparent text-neutral-400 hover:text-white"
            }`}
          >
            Component Source
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          aria-label="Copy code to clipboard"
          className="h-7 inline-flex items-center gap-1.5 px-2.5 rounded-md text-xs font-mono bg-white/10 hover:bg-white/15 text-white transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
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
              <span className="table-cell pr-4 text-right select-none text-neutral-600 w-8">
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
