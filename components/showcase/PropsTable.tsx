"use client";

import React from "react";
import { CraftComponent } from "@/lib/components-data";

interface PropsTableProps {
  component: CraftComponent;
}

export const PropsTable: React.FC<PropsTableProps> = ({ component }) => {
  return (
    <section className="w-full flex flex-col gap-4">
      <div className="flex flex-col gap-1">
        <h2 className="text-xs font-mono font-bold uppercase tracking-wider text-[var(--ca-ink)]/50">
          Props
        </h2>
        <p className="text-sm font-sans text-[var(--ca-ink)]/80">
          Options and TypeScript interfaces available for this component.
        </p>
      </div>

      <div className="overflow-x-auto rounded-2xl border border-[var(--ca-ink)]/10 bg-white/70">
        <table className="w-full text-left font-mono text-xs border-collapse">
          <thead>
            <tr className="border-b border-[var(--ca-ink)]/10 text-[var(--ca-ink)]/50 uppercase text-[10px] tracking-wider bg-[var(--ca-ink)]/[0.02]">
              <th className="py-3 px-4 font-semibold">Prop</th>
              <th className="py-3 px-4 font-semibold">Type</th>
              <th className="py-3 px-4 font-semibold">Default</th>
              <th className="py-3 px-4 font-semibold">Description</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[var(--ca-ink)]/5">
            {component.props.map((prop) => (
              <tr
                key={prop.name}
                className="hover:bg-[var(--ca-ink)]/[0.02] transition-colors"
              >
                <td className="py-3 px-4 font-semibold whitespace-nowrap">
                  <code className="px-1.5 py-0.5 rounded bg-[var(--ca-ink)]/5 text-[var(--ca-ink)] text-[11px]">
                    {prop.name}
                  </code>
                  {prop.required && (
                    <span className="ml-1.5 text-[9px] font-sans uppercase font-bold text-red-500">
                      required
                    </span>
                  )}
                </td>
                <td className="py-3 px-4 text-purple-700 dark:text-purple-400 whitespace-nowrap text-[11px]">
                  <code>{prop.type}</code>
                </td>
                <td className="py-3 px-4 text-[var(--ca-ink)]/60 whitespace-nowrap text-[11px]">
                  <code>{prop.defaultValue ?? "—"}</code>
                </td>
                <td className="py-3 px-4 font-sans text-xs text-[var(--ca-ink)]/75 leading-relaxed min-w-[220px]">
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
