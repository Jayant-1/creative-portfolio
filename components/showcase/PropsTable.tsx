"use client";

import React from "react";
import { CraftComponent } from "@/lib/components-data";

interface PropsTableProps {
  component: CraftComponent;
}

export const PropsTable: React.FC<PropsTableProps> = ({ component }) => {
  return (
    <section className="w-full flex flex-col gap-2.5 my-0">
      {/* Quiet Section Heading with Touch Scroll Hint */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-sm sm:text-base font-bold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider">
            Props
          </h2>
          <span className="font-mono text-[10px] text-[var(--ca-ink)]/50 dark:text-neutral-400">
            ({component.props.length} {component.props.length === 1 ? "prop" : "props"})
          </span>
        </div>

        {/* Touch device visible scroll hint */}
        <div
          className="sm:hidden flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-[var(--ca-ink)]/5 dark:bg-white/10 text-[var(--ca-ink)]/70 dark:text-neutral-300 font-mono text-[10px] select-none"
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-3.5 h-3.5 text-[var(--ca-orange)] shrink-0 animate-pulse"
          >
            <path d="M18 8L22 12L18 16" />
            <path d="M6 8L2 12L6 16" />
            <path d="M2 12H22" />
          </svg>
          <span>Scroll table &rarr;</span>
        </div>
      </div>

      {/* Semantic Props Table with Contained Horizontal Scroll on Mobile */}
      <div className="relative w-full">
        <div
          tabIndex={0}
          role="region"
          aria-label="Component props table - scroll horizontally to inspect all columns"
          className="w-full max-w-full overflow-x-auto rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4]/90 dark:bg-[#121316]/90 shadow-xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
        >
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--ca-ink)]/10 dark:border-white/10 text-[var(--ca-ink)]/60 dark:text-neutral-400 uppercase text-[10px] tracking-wider bg-[var(--ca-ink)]/[0.02] dark:bg-white/[0.02]">
              <th scope="col" className="py-2 px-3.5 font-bold">Property</th>
              <th scope="col" className="py-2 px-3.5 font-bold">Type</th>
              <th scope="col" className="py-2 px-3.5 font-bold">Default</th>
              <th scope="col" className="py-2 px-3.5 font-bold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ca-ink)]/10 dark:divide-white/5">
            {component.props.map((prop) => (
              <tr
                key={prop.name}
                className="hover:bg-[var(--ca-ink)]/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                {/* Prop Name */}
                <td className="py-2 px-3.5 font-semibold whitespace-nowrap">
                  <code className="px-1.5 py-0.5 rounded bg-[var(--ca-ink)]/5 dark:bg-white/10 text-[var(--ca-ink)] dark:text-white border border-[var(--ca-ink)]/10 dark:border-white/10 text-xs">
                    {prop.name}
                  </code>
                  {prop.required && (
                    <span className="ml-1.5 text-[9px] font-mono uppercase font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-1 py-0.2 rounded">
                      req
                    </span>
                  )}
                </td>

                {/* Type */}
                <td className="py-2 px-3.5 text-purple-700 dark:text-purple-400 whitespace-nowrap text-xs font-semibold">
                  <code>{prop.type}</code>
                </td>

                {/* Default Value */}
                <td className="py-2 px-3.5 text-[var(--ca-ink)]/70 dark:text-neutral-300 whitespace-nowrap text-xs">
                  <code className="px-1.5 py-0.5 rounded bg-[var(--ca-ink)]/[0.03] dark:bg-white/5">
                    {prop.defaultValue ?? "-"}
                  </code>
                </td>

                {/* Description */}
                <td className="py-2 px-3.5 font-sans text-xs text-[var(--ca-ink)]/80 dark:text-neutral-300 leading-relaxed min-w-[200px]">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        </div>
        {/* Subtle right edge scroll cue for narrow screens */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute top-1 bottom-1 right-0 w-6 bg-gradient-to-l from-[#faf8f4]/90 dark:from-[#121316]/90 to-transparent rounded-r-xl sm:hidden"
        />
      </div>
    </section>
  );
};
