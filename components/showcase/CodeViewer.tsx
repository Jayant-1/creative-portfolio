"use client";

import React, { useState } from "react";
import { Copy, Check, Terminal, CheckCircle2 } from "lucide-react";
import { CraftComponent } from "@/lib/components-data";
import { trackComponentCopy } from "@/lib/analytics";

interface CodeViewerProps {
  component: CraftComponent;
}

type PackageManager = "pnpm" | "npm" | "yarn" | "bun";

const KEYWORDS = new Set([
  "import", "export", "from", "default", "const", "let", "var", "function",
  "return", "type", "interface", "async", "await", "if", "else", "switch",
  "case", "break", "typeof", "extends", "as", "true", "false", "null", "undefined"
]);

function highlightToken(token: string, idx: number): React.ReactNode {
  if (token.startsWith("//") || token.startsWith("/*")) {
    return <span key={idx} className="text-neutral-400 italic">{token}</span>;
  }
  if (
    (token.startsWith('"') && token.endsWith('"')) ||
    (token.startsWith("'") && token.endsWith("'")) ||
    (token.startsWith("`") && token.endsWith("`"))
  ) {
    return <span key={idx} className="text-emerald-400">{token}</span>;
  }
  if (KEYWORDS.has(token)) {
    return <span key={idx} className="text-purple-400 font-medium">{token}</span>;
  }
  if (/^[A-Z][a-zA-Z0-9]*$/.test(token)) {
    return <span key={idx} className="text-sky-300 font-medium">{token}</span>;
  }
  if (/^[0-9]+(\.[0-9]+)?$/.test(token)) {
    return <span key={idx} className="text-amber-400">{token}</span>;
  }
  if (/^(&&|\|\||=>|===|!==|==|!=|\+|-|\*|\/|=|<|>)$/.test(token)) {
    return <span key={idx} className="text-pink-400">{token}</span>;
  }
  return <span key={idx} className="text-neutral-200">{token}</span>;
}

export function highlightLine(line: string): React.ReactNode {
  if (!line) return " ";
  const trimmed = line.trimStart();
  if (trimmed.startsWith("//")) {
    return <span className="text-neutral-400 italic">{line}</span>;
  }
  const parts = line
    .split(/([a-zA-Z0-9_]+|"[^"]*"|'[^']*'|`[^`]*`|\/\/.*|[{}()[\].,;:?!=<>+\-*/&|^~]+|\s+)/g)
    .filter(Boolean);
  return parts.map((part, i) => highlightToken(part, i));
}

export const CodeViewer: React.FC<CodeViewerProps> = ({ component }) => {
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
    <div className="w-full flex flex-col gap-6 my-10">
      {/* Section Header */}
      <div className="flex flex-col gap-1 border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--ca-green)]/10 border border-[var(--ca-green)]/25 text-[var(--ca-green)] font-mono text-xs font-bold uppercase">
            [02 // INSTALLATION &amp; CLI]
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ca-ink)] dark:text-white font-sans">
            Installation &amp; Integration
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-sans text-[var(--ca-ink)]/70 dark:text-neutral-400 mt-1">
          Install prerequisite dependencies and integrate this craft into your React or Next.js project.
        </p>
      </div>

      {/* CLI Installation Box */}
      <div className="flex flex-col gap-3 rounded-2xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white/90 dark:bg-[#121316]/90 p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          {/* Package Manager Tabs */}
          <div className="flex items-center gap-1 p-1 rounded-xl bg-[var(--ca-ink)]/5 dark:bg-white/5 border border-[var(--ca-ink)]/10 dark:border-white/10">
            {(["pnpm", "npm", "yarn", "bun"] as PackageManager[]).map((mgr) => (
              <button
                key={mgr}
                onClick={() => setPkgManager(mgr)}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  pkgManager === mgr
                    ? "bg-white dark:bg-neutral-800 text-[var(--ca-ink)] dark:text-white shadow-xs font-bold border border-[var(--ca-ink)]/10 dark:border-white/10"
                    : "text-[var(--ca-ink)]/60 dark:text-neutral-400 hover:text-[var(--ca-ink)]"
                }`}
              >
                {mgr}
              </button>
            ))}
          </div>

          <span className="font-mono text-[11px] text-[var(--ca-ink)]/50 dark:text-neutral-500 hidden sm:inline">
            CLI package manager
          </span>
        </div>

        {/* Dynamic Command Display */}
        <div className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-[#0d0f14] border border-white/10 font-mono text-xs">
          <div className="flex items-center gap-2.5 truncate">
            <Terminal size={14} className="text-orange-400 shrink-0" />
            <code className="text-neutral-200 truncate select-all">
              {getInstallCmd()}
            </code>
          </div>

          <button
            onClick={handleCopyInstall}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-mono transition-all shrink-0 border ${
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
    </div>
  );
};
