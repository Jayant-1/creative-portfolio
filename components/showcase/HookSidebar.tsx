"use client";

import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CRAFT_COMPONENTS, CraftComponent } from "@/lib/components-data";

interface HookSidebarProps {
  currentComponent?: CraftComponent;
  allComponents?: CraftComponent[];
}

export const HookSidebar: React.FC<HookSidebarProps> = ({ currentComponent }) => {
  const pathname = usePathname();

  // Categories grouping
  const categories = [
    {
      id: "motion",
      label: "Micro-Interactions",
      items: CRAFT_COMPONENTS.filter((c) => c.category === "motion"),
    },
    {
      id: "hero",
      label: "Hero & Parallax",
      items: CRAFT_COMPONENTS.filter((c) => c.category === "hero"),
    },
    {
      id: "cards",
      label: "Display & Cards",
      items: CRAFT_COMPONENTS.filter((c) => c.category === "cards"),
    },
    {
      id: "backgrounds",
      label: "Backgrounds & FX",
      items: CRAFT_COMPONENTS.filter((c) => c.category === "backgrounds"),
    },
  ];

  return (
    <aside className="w-64 shrink-0 hidden lg:block sticky top-24 self-start select-none">
      <div className="flex flex-col gap-6 p-4 rounded-2xl bg-white/70 border border-[var(--ca-ink)]/10 backdrop-blur-md">
        {/* All Components Link Header */}
        <div className="pb-3 border-b border-[var(--ca-ink)]/10 flex items-center justify-between">
          <Link
            href="/components"
            className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ca-ink)]/60 hover:text-[var(--ca-orange)] transition-colors flex items-center gap-1.5"
          >
            <span>&larr;</span>
            <span>All Components</span>
          </Link>
          <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--ca-orange)]/10 text-[var(--ca-orange)] font-semibold">
            Rare UI
          </span>
        </div>

        {/* Grouped Component List with RareUI Dashed Rail & Hook */}
        <nav aria-label="Components" className="flex flex-col gap-5">
          {categories.map((group) => (
            <div key={group.id} className="flex flex-col">
              <span className="pb-2 pl-1 pr-2 text-[10px] font-mono font-bold uppercase tracking-[0.14em] text-[var(--ca-ink)]/40">
                {group.label}
              </span>

              <div className="relative flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const isActive =
                    pathname === `/components/${item.slug}` ||
                    currentComponent?.slug === item.slug;

                  return (
                    <div key={item.slug} className="relative flex items-center">
                      {/* Active RareUI Hook Indicator */}
                      {isActive && (
                        <div
                          className="pointer-events-none absolute left-0 top-0 bottom-0 flex items-center text-[var(--ca-orange)]"
                          aria-hidden="true"
                        >
                          {/* Dashed vertical rail */}
                          <span
                            className="absolute left-0.5 top-0 h-full w-px"
                            style={{
                              backgroundImage:
                                "repeating-linear-gradient(to top, transparent 0 2px, currentColor 2px 4px)",
                            }}
                          />
                          {/* Dashed curved hook SVG */}
                          <svg
                            width="14"
                            height="8"
                            viewBox="0 0 14 8"
                            fill="none"
                            className="absolute left-0.5 top-1/2 -translate-y-1/2"
                          >
                            <path
                              d="M0.5 0a6 6 0 0 0 6 6H14"
                              stroke="currentColor"
                              strokeWidth="1.5"
                              strokeDasharray="2 2"
                            />
                          </svg>
                        </div>
                      )}

                      {/* Component Navigation Link */}
                      <Link
                        href={`/components/${item.slug}`}
                        data-active={isActive}
                        className={`w-full rounded-lg py-1.5 pl-6 pr-2 text-xs font-mono transition-colors duration-150 truncate ${
                          isActive
                            ? "text-[var(--ca-ink)] font-bold bg-[var(--ca-ink)]/5"
                            : "text-[var(--ca-ink)]/55 hover:text-[var(--ca-ink)] hover:bg-[var(--ca-ink)]/[0.02]"
                        }`}
                      >
                        {item.name}
                      </Link>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>
      </div>
    </aside>
  );
};
