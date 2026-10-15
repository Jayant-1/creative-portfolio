"use client";

import React from "react";
import { CraftComponent } from "@/lib/components-data";

interface PropsTableProps {
  component: CraftComponent;
}

export const PropsTable: React.FC<PropsTableProps> = ({ component }) => {
  return (
    /* XPath: .../main/div/section[2] */
    <section className="w-full flex flex-col gap-6">
      {/* Section Header */}
      <div className="flex flex-col gap-1 border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-4">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-md bg-[var(--ca-blue)]/10 border border-[var(--ca-blue)]/25 text-[var(--ca-blue)] font-mono text-xs font-bold uppercase">
            [02 // API REFERENCE]
          </span>
          <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-[var(--ca-ink)] dark:text-white font-sans">
            Props &amp; Configuration
          </h2>
        </div>
        <p className="text-xs sm:text-sm font-sans text-[var(--ca-ink)]/70 dark:text-neutral-400 mt-1">
          Comprehensive TypeScript API specifications, property types, defaults, and usage.
        </p>
      </div>

      {/* Monospace Styled Props Table */}
      <div className="overflow-x-auto rounded-2xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white/80 dark:bg-[#121316] shadow-sm">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--ca-ink)]/10 dark:border-white/10 text-[var(--ca-ink)]/60 dark:text-neutral-400 uppercase text-[10px] tracking-wider bg-[var(--ca-ink)]/[0.03] dark:bg-white/[0.03]">
              <th className="py-3.5 px-5 font-bold">Property</th>
              <th className="py-3.5 px-5 font-bold">Type</th>
              <th className="py-3.5 px-5 font-bold">Default</th>
              <th className="py-3.5 px-5 font-bold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ca-ink)]/10 dark:divide-white/5">
            {component.props.map((prop) => (
              <tr
                key={prop.name}
                className="hover:bg-[var(--ca-ink)]/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                {/* Prop Name */}
                <td className="py-3.5 px-5 font-semibold whitespace-nowrap">
                  <code className="px-2 py-0.5 rounded-md bg-[var(--ca-ink)]/5 dark:bg-white/10 text-[var(--ca-ink)] dark:text-white border border-[var(--ca-ink)]/10 dark:border-white/10 text-xs">
                    {prop.name}
                  </code>
                  {prop.required && (
                    <span className="ml-2 text-[9px] font-mono uppercase font-bold text-red-600 dark:text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-0.5 rounded">
                      required
                    </span>
                  )}
                </td>

                {/* Type */}
                <td className="py-3.5 px-5 text-purple-700 dark:text-purple-400 whitespace-nowrap text-xs font-semibold">
                  <code>{prop.type}</code>
                </td>

                {/* Default Value */}
                <td className="py-3.5 px-5 text-[var(--ca-ink)]/70 dark:text-neutral-300 whitespace-nowrap text-xs">
                  <code className="px-1.5 py-0.5 rounded bg-[var(--ca-ink)]/[0.03] dark:bg-white/5 border border-transparent">
                    {prop.defaultValue ?? "—"}
                  </code>
                </td>

                {/* Description */}
                <td className="py-3.5 px-5 font-sans text-xs text-[var(--ca-ink)]/80 dark:text-neutral-300 leading-relaxed min-w-[240px]">
                  {prop.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
};
