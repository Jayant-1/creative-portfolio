"use client";

import React, { useState } from "react";
import { Copy, Check } from "lucide-react";
import { CraftComponent } from "@/lib/components-data";

interface CodeViewerProps {
  component: CraftComponent;
}

type TabKey = "component" | "usage";
type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export const CodeViewer: React.FC<CodeViewerProps> = ({ component }) => {
  const [activeTab, setActiveTab] = useState<TabKey>("component");
  const [pkgManager, setPkgManager] = useState<PackageManager>("pnpm");
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedInstall, setCopiedInstall] = useState(false);

  const getInstallCmd = () => {
    switch (pkgManager) {
      case "npm":
        return component.installCommand.replace("pnpm add", "npm install");
      case "yarn":
        return component.installCommand.replace("pnpm add", "yarn add");
      case "bun":
        return component.installCommand.replace("pnpm add", "bun add");
      case "pnpm":
      default:
        return component.installCommand;
    }
  };

  const getActiveCode = () => {
    return activeTab === "component" ? component.code : component.usage;
  };

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(getActiveCode());
      setCopiedCode(true);
      setTimeout(() => setCopiedCode(false), 2000);
    } catch (err) {
      console.error("Failed to copy code", err);
    }
  };

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText(getInstallCmd());
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.error("Failed to copy install command", err);
    }
  };

  const lines = getActiveCode().split("\n");

  return (
    <div className="flex flex-col gap-8 w-full">
      {/* INSTALLATION SECTION */}
      <section className="flex flex-col gap-3 w-full">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ca-ink)]/50">
          Installation
        </h2>

        <div className="flex flex-col gap-2 rounded-2xl border border-[var(--ca-ink)]/10 bg-white/70 p-4">
          {/* Package Manager Buttons */}
          <div className="flex items-center gap-1">
            {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((mgr) => (
              <button
                key={mgr}
                onClick={() => setPkgManager(mgr)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-colors ${
                  pkgManager === mgr
                    ? "bg-[var(--ca-ink)]/10 text-[var(--ca-ink)] font-semibold"
                    : "text-[var(--ca-ink)]/50 hover:text-[var(--ca-ink)]"
                }`}
              >
                {mgr}
              </button>
            ))}
          </div>

          {/* Command display and copy */}
          <div className="flex items-center justify-between gap-3 p-2.5 rounded-lg bg-[var(--ca-ink)]/5 border border-[var(--ca-ink)]/10 font-mono text-xs">
            <code className="text-[var(--ca-ink)]/80 truncate">
              {getInstallCmd()}
            </code>
            <button
              onClick={handleCopyInstall}
              className="p-1.5 rounded-md text-[var(--ca-ink)]/60 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/10 transition-colors shrink-0"
              title="Copy install command"
            >
              {copiedInstall ? (
                <Check size={14} className="text-emerald-600" />
              ) : (
                <Copy size={14} />
              )}
            </button>
          </div>
        </div>
      </section>

      {/* CODE IMPLEMENTATION VIEWER */}
      <section className="flex flex-col gap-3 w-full">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ca-ink)]/50">
          Code
        </h2>

        <div className="rounded-2xl border border-[var(--ca-ink)]/10 bg-[#0d0f14] overflow-hidden shadow-sm">
          {/* Tabs & Copy Header */}
          <div className="flex items-center justify-between px-4 py-2.5 bg-[#14161f] border-b border-white/10 font-mono text-xs">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab("component")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "component"
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/50 hover:text-white"
                }`}
              >
                {component.name.replace(/\s+/g, "")}.tsx
              </button>
              <button
                onClick={() => setActiveTab("usage")}
                className={`px-3 py-1 rounded-md transition-colors ${
                  activeTab === "usage"
                    ? "bg-white/10 text-white font-medium"
                    : "text-white/50 hover:text-white"
                }`}
              >
                Usage.tsx
              </button>
            </div>

            <button
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-white/10 hover:bg-white/10 text-white/80 hover:text-white transition-colors"
            >
              {copiedCode ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
              <span>{copiedCode ? "Copied" : "Copy"}</span>
            </button>
          </div>

          {/* Line Numbers & Code */}
          <div className="p-4 max-h-[500px] overflow-auto scrollbar-thin scrollbar-thumb-white/20 font-mono text-xs text-white/90">
            <div className="grid grid-cols-[auto_1fr] gap-x-4 min-w-full">
              <div className="select-none text-white/25 text-right pr-2">
                {lines.map((_, i) => (
                  <div key={i}>{i + 1}</div>
                ))}
              </div>
              <pre className="overflow-x-auto m-0 p-0 leading-relaxed">
                <code>{getActiveCode()}</code>
              </pre>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
