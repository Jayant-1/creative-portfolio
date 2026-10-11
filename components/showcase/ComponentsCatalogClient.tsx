"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Search, Copy, Check } from "lucide-react";
import {
  CRAFT_COMPONENTS,
  CATEGORIES,
  ComponentCategory,
  CraftComponent,
} from "@/lib/components-data";
import { WorkshopBinderTabs } from "./WorkshopBinderTabs";

export const ComponentsCatalogClient: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<ComponentCategory>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [copiedSlug, setCopiedSlug] = useState<string | null>(null);

  const filteredComponents = useMemo(() => {
    return CRAFT_COMPONENTS.filter((comp) => {
      const matchesCategory =
        activeCategory === "all" || comp.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        comp.name.toLowerCase().includes(q) ||
        comp.tagline.toLowerCase().includes(q) ||
        comp.description.toLowerCase().includes(q) ||
        comp.features.some((f) => f.toLowerCase().includes(q)) ||
        comp.dependencies.some((d) => d.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  const handleCopyInstall = (e: React.MouseEvent, comp: CraftComponent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(comp.installCommand);
    setCopiedSlug(comp.slug);
    setTimeout(() => setCopiedSlug(null), 2000);
  };

  return (
    <div className="w-full flex flex-col gap-10">
      {/* Search and Workshop Tabs Section */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        {/* RareUI Style Tabs */}
        <WorkshopBinderTabs
          categories={CATEGORIES}
          activeCategory={activeCategory}
          onSelect={(cat) => setActiveCategory(cat)}
        />

        {/* Minimal Search Input */}
        <div className="relative w-full sm:w-72 shrink-0">
          <Search
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--ca-ink)]/40"
          />
          <input
            type="text"
            placeholder="Search crafts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-full border border-[var(--ca-ink)]/15 bg-white/70 font-mono text-xs text-[var(--ca-ink)] placeholder:text-[var(--ca-ink)]/40 focus:outline-none focus:border-[var(--ca-orange)] transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 font-mono text-xs text-[var(--ca-ink)]/50 hover:text-[var(--ca-ink)]"
            >
              &times;
            </button>
          )}
        </div>
      </div>

      {/* RareUI Style Components Grid */}
      {filteredComponents.length > 0 ? (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          <AnimatePresence>
            {filteredComponents.map((comp) => (
              <motion.article
                key={comp.slug}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="group flex flex-col rounded-[28px] border border-black/[0.08] dark:border-white/10 bg-white/70 dark:bg-[#121212] p-2 hover:border-black/25 dark:hover:border-white/25 hover:shadow-lg transition-all duration-200"
              >
                {/* Thumbnail Preview Window */}
                <Link
                  href={`/components/${comp.slug}`}
                  className="relative aspect-[16/10] w-full overflow-hidden rounded-[22px] bg-[#0c0d11] border border-black/[0.04] dark:border-white/5 block"
                >
                  <Image
                    src={comp.thumbnail}
                    alt={comp.name}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <span className="px-3 py-1.5 rounded-full bg-white text-black font-mono text-xs font-semibold shadow-md flex items-center gap-1.5">
                      <span>Inspect</span>
                      <ArrowUpRight size={13} />
                    </span>
                  </div>
                </Link>

                {/* Card Info Footer */}
                <div className="flex items-center justify-between gap-3 px-3 py-3">
                  <div className="min-w-0 flex items-center gap-2">
                    <Link
                      href={`/components/${comp.slug}`}
                      className="font-sans text-sm font-semibold tracking-tight text-[var(--ca-ink)] hover:text-[var(--ca-orange)] transition-colors truncate"
                    >
                      {comp.name}
                    </Link>
                    <span className="shrink-0 rounded-full bg-[var(--ca-orange)]/10 px-2 py-0.5 text-[10px] font-mono font-medium uppercase tracking-wide text-[var(--ca-orange)]">
                      {comp.categoryLabel}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0">
                    <button
                      onClick={(e) => handleCopyInstall(e, comp)}
                      className="p-1.5 rounded-lg text-[var(--ca-ink)]/40 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/5 transition-colors"
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
                      className="text-[var(--ca-orange)] hover:translate-x-0.5 hover:-translate-y-0.5 transition-transform"
                      title="Open laboratory"
                    >
                      <ArrowUpRight size={16} />
                    </Link>
                  </div>
                </div>
              </motion.article>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        /* Empty State */
        <div className="p-12 text-center rounded-2xl border border-dashed border-[var(--ca-ink)]/20 bg-white/40 flex flex-col items-center justify-center gap-2">
          <p className="font-mono text-xs text-[var(--ca-ink)]/60">
            No components matched your search query.
          </p>
          <button
            onClick={() => {
              setSearchQuery("");
              setActiveCategory("all");
            }}
            className="text-xs font-mono font-bold text-[var(--ca-orange)] hover:underline mt-1"
          >
            Clear filters
          </button>
        </div>
      )}
    </div>
  );
};
