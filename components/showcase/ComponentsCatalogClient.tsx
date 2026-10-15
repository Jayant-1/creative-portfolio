"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, Copy, Check } from "lucide-react";
import { CRAFT_COMPONENTS, CraftComponent } from "@/lib/components-data";

export const ComponentsCatalogClient: React.FC = () => {
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const handleCopyInstall = (e: React.MouseEvent, comp: CraftComponent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(comp.installCommand);
    setCopiedSlug(comp.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="w-full">
      {/* Clean Linear Components Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {CRAFT_COMPONENTS.map((comp) => (
          <article
            key={comp.slug}
            className="group flex flex-col rounded-[28px] border border-[var(--ca-ink)]/10 dark:border-white/10 bg-white/85 dark:bg-[#121316] p-2.5 shadow-xs hover:shadow-xl hover:border-[var(--ca-orange)]/50 transition-all duration-300"
          >
            {/* Thumbnail Preview Window */}
            <Link
              href={`/components/${comp.slug}`}
              className="relative aspect-[16/10] w-full overflow-hidden rounded-[20px] bg-[#0c0d12] border border-black/5 dark:border-white/5 block"
            >
              <Image
                src={comp.thumbnail}
                alt={comp.name}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
              />
            </Link>

            {/* Card Info Footer */}
            <div className="flex items-center justify-between gap-3 px-3 pt-3.5 pb-2">
              <div className="min-w-0">
                <Link
                  href={`/components/${comp.slug}`}
                  className="block font-sans text-[15px] font-bold tracking-tight text-[var(--ca-ink)] dark:text-white group-hover:text-[var(--ca-orange)] transition-colors truncate"
                >
                  {comp.name}
                </Link>
                <p className="text-xs text-[var(--ca-ink)]/60 dark:text-neutral-400 truncate mt-0.5 font-sans">
                  {comp.tagline}
                </p>
              </div>

              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={(e) => handleCopyInstall(e, comp)}
                  className="p-1.5 rounded-lg text-[var(--ca-ink)]/40 hover:text-[var(--ca-ink)] dark:hover:text-white hover:bg-[var(--ca-ink)]/5 dark:hover:bg-white/5 transition-colors"
                  title="Copy install command"
                >
                  {copiedSlug === comp.slug ? (
                    <Check size={14} className="text-emerald-600" />
                  ) : (
                    <Copy size={14} />
                  )}
                </button>
                <Link
                  href={`/components/${comp.slug}`}
                  className="p-1 rounded-md text-[var(--ca-orange)] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
                  title="Open component"
                >
                  <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
