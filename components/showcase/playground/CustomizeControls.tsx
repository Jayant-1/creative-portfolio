"use client";

import React from "react";
import { RotateCcw } from "lucide-react";
import { CustomField } from "@/lib/component-manifests";

interface CustomizeControlsProps {
  fields: CustomField[];
  values: Record<string, any>;
  onChange: (key: string, value: any) => void;
  isModified: boolean;
  onReset: () => void;
  selectedExampleName: string;
}

export const CustomizeControls: React.FC<CustomizeControlsProps> = ({
  fields,
  values,
  onChange,
  isModified,
  onReset,
  selectedExampleName,
}) => {
  return (
    <section className="w-full flex flex-col gap-3 my-3 sm:my-4">
      {/* Quiet Section Heading */}
      <div className="flex items-center justify-between border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-sm sm:text-base font-bold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider">
            Customize
          </h2>
          {isModified && (
            <span className="font-mono text-[10px] uppercase font-bold text-[var(--ca-orange)] bg-[var(--ca-orange)]/10 border border-[var(--ca-orange)]/25 px-2 py-0.5 rounded">
              Modified ({selectedExampleName})
            </span>
          )}
        </div>

        {isModified && (
          <button
            type="button"
            onClick={onReset}
            className="flex items-center gap-1 text-xs font-mono text-[var(--ca-ink)]/70 dark:text-neutral-400 hover:text-[var(--ca-orange)] transition-colors"
          >
            <RotateCcw size={11} />
            <span>Reset to preset defaults</span>
          </button>
        )}
      </div>

      {/* Clean Full-Width Field Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 p-4 rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4]/90 dark:bg-[#121316]/90 shadow-xs">
        {fields.map((field) => {
          const rawValue = values[field.key];
          const val = rawValue ?? "";

          return (
            <div
              key={field.key}
              className="flex flex-col gap-1.5 p-2.5 rounded-lg bg-white/80 dark:bg-[#16181d]/80 border border-[var(--ca-ink)]/10 dark:border-white/5"
            >
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`field-${field.key}`}
                  className="font-mono text-[11px] font-semibold text-[var(--ca-ink)]/80 dark:text-neutral-300 uppercase tracking-wide"
                >
                  {field.label}
                </label>
                {field.type === "number" && (
                  <span className="font-mono text-[11px] text-[var(--ca-orange)] font-bold">
                    {val}
                  </span>
                )}
              </div>

              {/* Text Input */}
              {field.type === "text" && (
                <input
                  id={`field-${field.key}`}
                  type="text"
                  value={val}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  placeholder={field.placeholder}
                  className="w-full px-2.5 py-1.5 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white outline-hidden focus:border-[var(--ca-orange)] focus:ring-1 focus:ring-[var(--ca-orange)] transition-all"
                />
              )}

              {/* Color Picker with Hex Display */}
              {field.type === "color" && (
                <div className="flex items-center gap-2">
                  <input
                    id={`field-${field.key}`}
                    type="color"
                    value={typeof val === "string" && val.startsWith("#") ? val : "#db4b29"}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="h-7 w-9 cursor-pointer rounded border border-[var(--ca-ink)]/20 dark:border-white/10 p-0.5 bg-white dark:bg-neutral-900"
                  />
                  <input
                    type="text"
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white outline-hidden focus:border-[var(--ca-orange)] transition-all"
                  />
                </div>
              )}

              {/* Number Slider */}
              {field.type === "number" && (
                <input
                  id={`field-${field.key}`}
                  type="range"
                  min={field.min ?? 0}
                  max={field.max ?? 100}
                  step={field.step ?? 1}
                  value={typeof val === "number" ? val : (field.min ?? 0)}
                  onChange={(e) => onChange(field.key, parseFloat(e.target.value))}
                  className="w-full accent-[var(--ca-orange)] cursor-pointer h-1.5 bg-neutral-200 dark:bg-neutral-700 rounded-lg"
                />
              )}

              {/* Select Dropdown */}
              {field.type === "select" && field.options && (
                <select
                  id={`field-${field.key}`}
                  value={val}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full px-2.5 py-1.5 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white outline-hidden focus:border-[var(--ca-orange)] transition-all"
                >
                  {field.options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
