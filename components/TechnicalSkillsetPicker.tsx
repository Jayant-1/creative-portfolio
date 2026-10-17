"use client";

import { Tape } from "@/components/Paper";
import { Database, Layout, Server, Sparkles, Terminal } from "lucide-react";
import React from "react";

export interface SkillCategory {
  category: string;
  skills: string[];
}

interface TechnicalSkillsetPickerProps {
  skillsByCategory: SkillCategory[];
}

/**
 * Permanent Production Component: Tactile Reshaped Post-it & Stationery Craft Cards
 *
 * 5 distinct physical craft shapes arranged in an interlocking 7+5 / 4+4+4 bento layout:
 * - Card 1 (Frontend): 7-col Wide Spiral Notebook Canvas with Ruled Lines & Dual Tape
 * - Card 2 (Backend): 5-col Manila File Folder with Protruding Tab & Spearmint Wash
 * - Card 3 (Databases): 4-col Clipped Notched Punch-Card with Dashed Border & Cyan Wash
 * - Card 4 (AI / ML): 4-col Scalloped Lab Swatch with Pill-Capsules & Magenta Rubber Stamp
 * - Card 5 (Infrastructure): 4-col Industrial Workshop Clipboard with Metal Clamp & Manila Board
 */
export function TechnicalSkillsetPicker({
  skillsByCategory,
}: TechnicalSkillsetPickerProps) {
  const frontend = skillsByCategory.find((c) => c.category === "Frontend");
  const backend = skillsByCategory.find((c) => c.category === "Backend");
  const databases = skillsByCategory.find((c) => c.category === "Databases");
  const aiml = skillsByCategory.find((c) => c.category === "AI / ML");
  const infra = skillsByCategory.find((c) => c.category === "Infrastructure");

  return (
    <div className="mt-10 border-t-2 border-dashed border-[var(--ca-ink)]/20 pt-8 space-y-6">
      {/* Section Header */}
      <div className="flex items-center border-b border-[var(--ca-ink)]/15 pb-3">
        <span
          className="ca-mono ca-torn-label px-3 py-1 text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]"
          style={{ backgroundColor: "var(--ca-yellow)" }}
        >
          Technology Stack
        </span>
      </div>

      {/* 12-Column Responsive Scrapbook Grid: Row 1 = 7 + 5 cols, Row 2 = 4 + 4 + 4 cols */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 pt-3">
        {/* ===================================================================
            CARD 1: FRONTEND (7 Cols) — Ruled Spiral Notepad Sheet
            =================================================================== */}
        {frontend && (
          <div
            className="relative md:col-span-12 lg:col-span-7 rounded-[18px_6px_22px_8px] border-2 border-[var(--ca-ink)] p-5 sm:p-6 shadow-[5px_6px_0_var(--ca-ink)] transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 -rotate-1"
            style={{
              backgroundColor: "var(--ca-yellow-soft)",
              backgroundImage:
                "repeating-linear-gradient(to bottom, transparent 0, transparent 27px, rgba(25, 21, 16, 0.07) 27px, rgba(25, 21, 16, 0.07) 28px)",
            }}
          >
            {/* Dual Masking Tape */}
            <Tape
              className="-top-3 left-6"
              angle={-14}
              color="var(--ca-cyan)"
            />
            <Tape
              className="-top-3 right-8"
              angle={10}
              color="var(--ca-mint)"
            />

            {/* Header */}
            <div className="flex items-center gap-2.5 border-b-2 border-dashed border-[var(--ca-ink)]/20 pb-3">
              <span className="rounded border border-[var(--ca-ink)] bg-white p-1.5 text-[var(--ca-ink)] shadow-[1px_1px_0_var(--ca-ink)]">
                <Layout size={18} />
              </span>
              <strong className="ca-mono text-base font-black uppercase tracking-wider text-[var(--ca-ink)]">
                {frontend.category}
              </strong>
            </div>

            {/* Skill Pills */}
            <div className="mt-4 flex flex-wrap gap-2">
              {frontend.skills.map((skill) => (
                <span
                  key={skill}
                  className="ca-mono rounded-sm border-2 border-[var(--ca-ink)] bg-white px-3 py-1.5 text-xs font-bold text-[var(--ca-ink)] shadow-[2px_2.5px_0_var(--ca-ink)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[3px_4px_0_var(--ca-ink)]"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            CARD 2: BACKEND (5 Cols) — Manila Folder with Protruding Tab
            =================================================================== */}
        {backend && (
          <div className="relative md:col-span-12 lg:col-span-5 flex flex-col justify-between pt-3">
            {/* Protruding Folder Tab */}
            <div
              className="absolute top-0 left-6 z-10 px-3.5 py-1 rounded-t-md border-2 border-b-0 border-[var(--ca-ink)] font-mono text-[10px] font-black uppercase tracking-wider text-[var(--ca-ink)] shadow-[0_-2px_0_rgba(25,21,16,0.06)]"
              style={{ backgroundColor: "var(--ca-mint)" }}
            >
              CORE-SYSTEM
            </div>

            <div
              className="relative flex-1 rounded-b-md rounded-tr-md border-2 border-[var(--ca-ink)] p-5 sm:p-6 shadow-[5px_6px_0_var(--ca-ink)] transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 rotate-1"
              style={{ backgroundColor: "var(--ca-mint)" }}
            >
              {/* Tape Pin on Right */}
              <Tape
                className="-top-3 right-5"
                angle={12}
                color="var(--ca-yellow)"
              />

              {/* Header */}
              <div className="flex items-center gap-2.5 border-b-2 border-dashed border-[var(--ca-ink)]/20 pb-3">
                <span className="rounded border border-[var(--ca-ink)] bg-white p-1.5 text-[var(--ca-ink)] shadow-[1px_1px_0_var(--ca-ink)]">
                  <Server size={18} />
                </span>
                <strong className="ca-mono text-base font-black uppercase tracking-wider text-[var(--ca-ink)]">
                  {backend.category}
                </strong>
              </div>

              {/* Skill Pills */}
              <div className="mt-4 flex flex-wrap gap-2">
                {backend.skills.map((skill) => (
                  <span
                    key={skill}
                    className="ca-mono rounded-sm border-2 border-[var(--ca-ink)] bg-white px-2.5 py-1 text-xs font-bold text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] transition-all duration-150 hover:-translate-y-0.5 hover:shadow-[3px_3px_0_var(--ca-ink)]"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            CARD 3: DATABASES (4 Cols) — Clipped Notched Punch-Card Docket
            =================================================================== */}
        {databases && (
          <div
            className="relative md:col-span-12 lg:col-span-4 rounded-md border-2 border-[var(--ca-ink)] p-5 shadow-[4px_5px_0_var(--ca-ink)] transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 -rotate-1"
            style={{ backgroundColor: "var(--ca-cyan)" }}
          >
            {/* Top Washi Tape */}
            <Tape
              className="-top-3 left-8"
              angle={-12}
              color="var(--ca-pink-soft)"
            />

            {/* Notched Punch-Card Header */}
            <div className="flex items-center gap-2 border-b-2 border-dashed border-[var(--ca-ink)]/20 pb-2.5">
              <span className="rounded border border-[var(--ca-ink)] bg-white p-1 text-[var(--ca-ink)] shadow-[1px_1px_0_var(--ca-ink)]">
                <Database size={16} />
              </span>
              <strong className="ca-mono text-sm font-black uppercase tracking-wider text-[var(--ca-ink)]">
                {databases.category}
              </strong>
            </div>

            {/* Inner Dashed Frame */}
            <div className="mt-3 rounded border border-dashed border-[var(--ca-ink)]/30 bg-white/40 p-2.5">
              <div className="flex flex-wrap gap-1.5">
                {databases.skills.map((skill) => (
                  <span
                    key={skill}
                    className="ca-mono rounded border border-[var(--ca-ink)] bg-white px-2 py-0.5 text-xs font-bold text-[var(--ca-ink)] shadow-[1.5px_2px_0_var(--ca-ink)] transition-all duration-150 hover:-translate-y-0.5"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ===================================================================
            CARD 4: AI / ML (4 Cols) — Scalloped Lab Swatch
            =================================================================== */}
        {aiml && (
          <div
            className="relative md:col-span-12 lg:col-span-4 rounded-[22px_8px_22px_8px] border-2 border-[var(--ca-ink)] p-5 shadow-[4px_5px_0_var(--ca-ink)] transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 rotate-1"
            style={{ backgroundColor: "var(--ca-pink-soft)" }}
          >
            {/* Top Washi Tape */}
            <Tape className="-top-3 right-6" angle={8} color="var(--ca-mint)" />

            {/* Header */}
            <div className="flex items-center gap-2 border-b-2 border-dashed border-[var(--ca-ink)]/20 pb-2.5">
              <span className="rounded border border-[var(--ca-ink)] bg-white p-1 text-[var(--ca-ink)] shadow-[1px_1px_0_var(--ca-ink)]">
                <Sparkles size={16} />
              </span>
              <strong className="ca-mono text-sm font-black uppercase tracking-wider text-[var(--ca-ink)]">
                {aiml.category}
              </strong>
            </div>

            {/* Soft Capsule Pills */}
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {aiml.skills.map((skill) => (
                <span
                  key={skill}
                  className="ca-mono rounded-full border border-[var(--ca-ink)] bg-white px-2.5 py-0.5 text-xs font-bold text-[var(--ca-ink)] shadow-[1.5px_2px_0_var(--ca-ink)] transition-all duration-150 hover:-translate-y-0.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* ===================================================================
            CARD 5: INFRASTRUCTURE (4 Cols) — Rugged Workshop Clipboard
            =================================================================== */}
        {infra && (
          <div
            className="relative md:col-span-12 lg:col-span-4 rounded-md border-2 border-[var(--ca-ink)] p-5 pt-6 shadow-[4px_5px_0_var(--ca-ink)] transition-transform duration-200 hover:rotate-0 hover:-translate-y-1 -rotate-1"
            style={{ backgroundColor: "var(--ca-chrome)" }}
          >
            {/* Clipboard Top Clamp Simulation */}
            <div
              aria-hidden="true"
              className="absolute -top-2.5 left-1/2 -translate-x-1/2 h-3.5 w-20 rounded-t border-2 border-b-0 border-[var(--ca-ink)] bg-[var(--ca-ink)] flex items-center justify-center shadow-[0_1px_2px_rgba(25,21,16,0.2)]"
            >
              <div className="h-1 w-10 rounded-full bg-[var(--ca-chrome)] opacity-80" />
            </div>

            {/* Side Washi Tape */}
            <Tape
              className="top-1 -left-4"
              angle={-78}
              color="var(--ca-yellow-soft)"
            />

            {/* Terminal Header */}
            <div className="flex items-center gap-2 border-b-2 border-dashed border-[var(--ca-ink)]/20 pb-2.5">
              <span className="rounded border border-[var(--ca-ink)] bg-white p-1 text-[var(--ca-ink)] shadow-[1px_1px_0_var(--ca-ink)]">
                <Terminal size={16} />
              </span>
              <strong className="ca-mono text-sm font-black uppercase tracking-wider text-[var(--ca-ink)]">
                {infra.category}
              </strong>
            </div>

            {/* Industrial Square Tech Chips */}
            <div className="mt-3.5 flex flex-wrap gap-1.5">
              {infra.skills.map((skill) => (
                <span
                  key={skill}
                  className="ca-mono rounded-none border border-[var(--ca-ink)] bg-white px-2 py-0.5 text-xs font-bold text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] transition-all duration-150 hover:-translate-y-0.5"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
