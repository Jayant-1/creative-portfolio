"use client";

import React from "react";
import { CraftComponent } from "@/lib/components-data";

interface PropsTableProps {
  component: CraftComponent;
}

export const PropsTable: React.FC<PropsTableProps> = ({ component }) => {
  return (
    <section className="w-full flex flex-col gap-2.5 my-0">
      {/* Quiet Section Heading */}
      <div className="flex items-center justify-between border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-2">
        <h2 className="font-mono text-sm sm:text-base font-bold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider">
          Props
        </h2>
      </div>

      {/* Semantic Props Table with Contained Horizontal Scroll on Mobile */}
      <div className="w-full overflow-x-auto rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4]/90 dark:bg-[#121316]/90 shadow-xs">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--ca-ink)]/10 dark:border-white/10 text-[var(--ca-ink)]/60 dark:text-neutral-400 uppercase text-[10px] tracking-wider bg-[var(--ca-ink)]/[0.02] dark:bg-white/[0.02]">
              <th scope="col" className="py-3 px-4 font-bold">Property</th>
              <th scope="col" className="py-3 px-4 font-bold">Type</th>
              <th scope="col" className="py-3 px-4 font-bold">Default</th>
              <th scope="col" className="py-3 px-4 font-bold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ca-ink)]/10 dark:divide-white/5">
            {component.props.map((prop) => (
              <tr
                key={prop.name}
                className="hover:bg-[var(--ca-ink)]/[0.02] dark:hover:bg-white/[0.02] transition-colors"
              >
                {/* Prop Name */}
                <td className="py-3 px-4 font-semibold whitespace-nowrap">
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
                <td className="py-3 px-4 text-purple-700 dark:text-purple-400 whitespace-nowrap text-xs font-semibold">
                  <code>{prop.type}</code>
                </td>

                {/* Default Value */}
                <td className="py-3 px-4 text-[var(--ca-ink)]/70 dark:text-neutral-300 whitespace-nowrap text-xs">
                  <code className="px-1.5 py-0.5 rounded bg-[var(--ca-ink)]/[0.03] dark:bg-white/5">
                    {prop.defaultValue ?? "-"}
                  </code>
                </td>

                {/* Description */}
                <td className="py-3 px-4 font-sans text-xs text-[var(--ca-ink)]/80 dark:text-neutral-300 leading-relaxed min-w-[200px]">
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
