"use client";

import React, { useState } from "react";
import { Copy, Terminal, CheckCircle2 } from "lucide-react";
import { CraftComponent } from "@/lib/components-data";

interface InstallSectionProps {
  component: CraftComponent;
}

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export const InstallSection: React.FC<InstallSectionProps> = ({ component }) => {
  const [pkgManager, setPkgManager] = useState<PackageManager>("pnpm");
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

  const handleCopyInstall = async () => {
    try {
      await navigator.clipboard.writeText(getInstallCmd());
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.warn("Failed to copy install command", err);
    }
  };

  return (
    <section className="w-full flex flex-col gap-2.5 my-0">
      {/* Quiet Section Heading */}
      <div className="flex items-center justify-between border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-2">
        <h2 className="font-mono text-sm sm:text-base font-bold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider">
          Installation
        </h2>
      </div>

      {/* Install Command Box */}
      <div className="flex flex-col gap-3 rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4]/90 dark:bg-[#121316]/90 p-4 shadow-xs">
        <div className="flex items-center justify-between gap-3">
          {/* Package Manager Selector */}
          <div className="flex items-center gap-1 p-0.5 rounded-lg bg-[var(--ca-ink)]/5 dark:bg-white/5 border border-[var(--ca-ink)]/10 dark:border-white/10">
            {(cat => cat)(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((mgr) => (
              <button
                key={mgr}
                type="button"
                onClick={() => setPkgManager(mgr)}
                className={`px-3 py-1 rounded-md text-xs font-mono font-medium transition-all ${
                  pkgManager === mgr
                    ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs font-bold border border-[var(--ca-ink)]/10 dark:border-white/10"
                    : "text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
                }`}
              >
                {mgr}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Command Box */}
        <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#0d0f14] border border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <Terminal size={14} className="text-orange-400 shrink-0" />
            <code className="text-neutral-200 truncate select-all">
              {getInstallCmd()}
            </code>
          </div>

          <button
            type="button"
            onClick={handleCopyInstall}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-mono transition-all shrink-0 border ${
              copiedInstall
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold"
                : "bg-white/10 border-white/10 text-white/80 hover:text-white hover:bg-white/15"
            }`}
            title="Copy install command"
          >
            {copiedInstall ? (
              <CheckCircle2 size={13} className="text-emerald-400" />
            ) : (
              <Copy size={13} />
            )}
            <span>{copiedInstall ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
