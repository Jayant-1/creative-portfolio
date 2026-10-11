"use client";

import React from "react";
import { ComponentCategory } from "@/lib/components-data";

interface TabItem {
  id: ComponentCategory;
  label: string;
  count: number;
}

interface WorkshopBinderTabsProps {
  categories: TabItem[];
  activeCategory: ComponentCategory;
  onSelect: (category: ComponentCategory) => void;
}

export const WorkshopBinderTabs: React.FC<WorkshopBinderTabsProps> = ({
  categories,
  activeCategory,
  onSelect,
}) => {
  return (
    <div className="w-full flex items-center justify-start overflow-x-auto pb-1 no-scrollbar">
      <div className="flex items-center gap-1.5 p-1 rounded-full bg-[var(--ca-ink)]/[0.04] border border-[var(--ca-ink)]/10">
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onSelect(cat.id)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-mono transition-all duration-150 flex items-center gap-1.5 select-none ${
                isActive
                  ? "bg-white text-[var(--ca-ink)] font-semibold shadow-sm"
                  : "text-[var(--ca-ink)]/60 hover:text-[var(--ca-ink)]"
              }`}
            >
              <span>{cat.label}</span>
              <span
                className={`text-[10px] tabular-nums font-mono px-1.5 py-0.2 rounded-full ${
                  isActive
                    ? "bg-[var(--ca-orange)]/15 text-[var(--ca-orange)] font-bold"
                    : "text-[var(--ca-ink)]/40"
                }`}
              >
                [{cat.count}]
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
