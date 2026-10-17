"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { highlightLine } from "../CodeViewer";

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
    } catch (err) {
      console.warn("Copy failed", err);
    }
  };

  return (
    <div className="w-full flex flex-col rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#0c0d10] text-neutral-200 overflow-hidden shadow-sm">
      {/* Code Sub-Tabs & Copy */}
      <div className="flex items-center justify-between p-3 border-b border-white/10 bg-white/5">
        <div className="flex items-center gap-1 p-0.5 rounded-lg bg-black/40 border border-white/10">
          <button
            type="button"
            onClick={() => setSubTab("usage")}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
              subTab === "usage"
                ? "bg-white/20 text-white font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Usage Example
          </button>
          <button
            type="button"
            onClick={() => setSubTab("source")}
            className={`px-3 py-1 rounded-md text-xs font-mono transition-all ${
              subTab === "source"
                ? "bg-white/20 text-white font-bold"
                : "text-neutral-400 hover:text-white"
            }`}
          >
            Component Source
          </button>
        </div>

        <button
          type="button"
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1 rounded-md text-xs font-mono bg-white/10 hover:bg-white/15 text-white transition-all"
        >
          {copied ? <Check size={12} className="text-emerald-400" /> : <Copy size={12} />}
          <span>{copied ? "Copied" : "Copy Code"}</span>
        </button>
      </div>

      {/* Code Body */}
      <div className="p-4 overflow-x-auto max-h-[500px] overflow-y-auto font-mono text-xs leading-relaxed select-text">
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
