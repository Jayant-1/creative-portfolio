"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { CRAFT_COMPONENTS, CraftComponent } from "@/lib/components-data";
import { HookSidebar as ShadcnHookSidebar } from "@/components/ui/hook-sidebar";

interface HookSidebarProps {
  currentComponent?: CraftComponent;
  allComponents?: CraftComponent[];
}

export const HookSidebar: React.FC<HookSidebarProps> = ({ currentComponent }) => {
  const items = CRAFT_COMPONENTS.map((comp) => ({
    label: comp.name,
    href: `/components/${comp.slug}`,
  }));

  return (
    <aside className="w-64 shrink-0 hidden lg:block sticky top-24 self-start select-none">
      <div className="flex flex-col gap-3.5 p-5 rounded-2xl bg-white/95 border border-[#e8e4db] shadow-[0_4px_24px_-4px_rgba(25,21,16,0.06),0_1px_3px_rgba(25,21,16,0.03)] backdrop-blur-md">
        {/* Header with pill counter and tactile back link */}
        <div className="flex items-center justify-between pb-3 border-b border-[#ece8de]">
          <div className="flex items-center gap-1.5">
            <span className="font-mono text-[11px] font-bold uppercase tracking-wider text-[#0284c7]">
              CONTENTS
            </span>
            <span className="rounded-full bg-[#0284c7]/10 px-1.5 py-0.5 text-[10px] font-mono font-bold text-[#0284c7] leading-none">
              {CRAFT_COMPONENTS.length}
            </span>
          </div>
          <Link
            href="/components"
            className="inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-[11px] font-mono font-medium text-[#78716c] hover:text-[#191510] hover:bg-[#f3efe6] transition-all"
            title="Back to all components"
          >
            <ArrowLeft size={11} strokeWidth={2.2} />
            <span>All</span>
          </Link>
        </div>

        {/* Swami Malode Hook Sidebar Rail */}
        <ShadcnHookSidebar
          items={items}
          color="#f97316"
          dashed={true}
        />
      </div>
    </aside>
  );
};
