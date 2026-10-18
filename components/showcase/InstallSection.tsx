"use client";

import React, { useState } from "react";
import {
  Copy,
  Terminal,
  CheckCircle2,
} from "lucide-react";
import { CraftComponent } from "@/lib/components-data";
import { trackComponentCopy } from "@/lib/analytics";

interface InstallSectionProps {
  component: CraftComponent;
}

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

export const InstallSection: React.FC<InstallSectionProps> = ({
  component,
}) => {
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
      trackComponentCopy(component.slug, "install_command", pkgManager);
    } catch (err) {
      console.warn("Failed to copy install command", err);
    }
  };

  return (
    <section className="w-full flex flex-col gap-3 my-0">
      {/* Quiet Section Heading */}
      <div className="flex items-center justify-between border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-2">
        <h2 className="font-mono text-sm sm:text-base font-bold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider">
          Installation
        </h2>
      </div>

      {/* Install Command Box */}
      <div className="flex flex-col gap-2.5 rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4] dark:bg-[#121316] p-3 sm:p-3.5 shadow-xs">
        <div className="flex items-center justify-between gap-2">
          {/* Package Manager Selector: Single sleek pill, no redundant borders */}
          <div className="inline-flex items-center p-0.5 rounded-lg bg-[var(--ca-ink)]/6 dark:bg-white/8 text-xs font-mono">
            {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((mgr) => (
              <button
                key={mgr}
                type="button"
                onClick={() => setPkgManager(mgr)}
                className={`px-2.5 py-1 rounded-md text-xs font-mono transition-all inline-flex items-center justify-center focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                  pkgManager === mgr
                    ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs font-semibold border border-[var(--ca-ink)]/20 dark:border-white/20"
                    : "border border-transparent text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
                }`}
              >
                {mgr}
              </button>
            ))}
          </div>
        </div>

        {/* Dynamic Command Box */}
        <div className="flex items-center justify-between gap-3 px-3 py-2 rounded-lg bg-[#0d0f14] border border-white/10 font-mono text-xs">
          <div className="flex-1 min-w-0 flex items-center gap-2">
            <Terminal size={13} className="text-orange-400 shrink-0" />
            <code className="text-neutral-200 truncate select-all block min-w-0">
              {getInstallCmd()}
            </code>
          </div>

          <button
            type="button"
            onClick={handleCopyInstall}
            aria-label="Copy install command"
            className={`h-7 px-2.5 rounded-md text-xs font-mono transition-all flex items-center gap-1.5 shrink-0 border focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
              copiedInstall
                ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-400 font-bold"
                : "bg-white/10 border-white/10 text-neutral-300 hover:text-white hover:bg-white/15"
            }`}
            title="Copy install command"
          >
            {copiedInstall ? (
              <CheckCircle2 size={12} className="text-emerald-400" />
            ) : (
              <Copy size={12} />
            )}
            <span>{copiedInstall ? "Copied" : "Copy"}</span>
          </button>
        </div>
      </div>
    </section>
  );
};
