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
  if (!fields || fields.length === 0) {
    return null;
  }

  return (
    <section className="w-full flex flex-col gap-2.5 my-0">
      {/* Quiet Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-2">
        <div className="flex items-center gap-2">
          <h2 className="font-mono text-sm sm:text-base font-bold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider">
            Customize
          </h2>
          {isModified && (
            <span className="font-mono text-[10px] uppercase font-bold text-[#c2410c] dark:text-orange-400 bg-orange-500/10 border border-orange-500/25 px-2 py-0.5 rounded">
              Modified ({selectedExampleName})
            </span>
          )}
        </div>

        {isModified && (
          <button
            type="button"
            onClick={onReset}
            className="min-h-[44px] sm:min-h-0 h-11 sm:h-7 px-3 sm:px-2 flex items-center gap-1.5 text-xs font-mono text-[var(--ca-ink)]/80 dark:text-neutral-300 hover:text-[#c2410c] dark:hover:text-orange-400 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] transition-colors rounded-sm"
          >
            <RotateCcw size={13} />
            <span>Reset to preset defaults</span>
          </button>
        )}
      </div>

      {/* Clean Full-Width Field Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 p-3 sm:p-3.5 rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4] dark:bg-[#121316] shadow-xs">
        {fields.map((field) => {
          const rawValue = values[field.key];
          const val = rawValue ?? "";

          return (
            <div
              key={field.key}
              className="flex flex-col gap-1.5 p-2 rounded-lg bg-white dark:bg-[#16181d] border border-[var(--ca-ink)]/10 dark:border-white/5"
            >
              <div className="flex items-center justify-between">
                <label
                  htmlFor={`field-${field.key}`}
                  className="font-mono text-[11px] font-semibold text-[var(--ca-ink)]/80 dark:text-neutral-300 uppercase tracking-wide"
                >
                  {field.label}
                </label>
                {field.type === "number" && (
                  <span className="font-mono text-[11px] text-[#c2410c] dark:text-orange-400 font-bold">
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
                  className="w-full min-h-[44px] sm:min-h-0 px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white outline-hidden focus:border-[var(--ca-orange)] focus:ring-1 focus:ring-[var(--ca-orange)] transition-all"
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
                    className="min-h-[44px] min-w-[44px] sm:min-h-0 sm:min-w-0 sm:h-7 sm:w-9 cursor-pointer rounded border border-[var(--ca-ink)]/20 dark:border-white/10 p-0.5 bg-white dark:bg-neutral-900"
                  />
                  <input
                    id={`field-${field.key}-hex`}
                    type="text"
                    aria-label={`${field.label} hex code`}
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="flex-1 min-h-[44px] sm:min-h-0 px-3 py-2 sm:px-2.5 sm:py-1 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white outline-hidden focus:border-[var(--ca-orange)] transition-all"
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
                  className="w-full accent-[var(--ca-orange)] cursor-pointer h-2 bg-neutral-200 dark:bg-neutral-700 rounded-lg min-h-[32px]"
                />
              )}

              {/* Select Dropdown */}
              {field.type === "select" && field.options && (
                <select
                  id={`field-${field.key}`}
                  value={val}
                  onChange={(e) => onChange(field.key, e.target.value)}
                  className="w-full min-h-[44px] sm:min-h-0 px-3 py-2 sm:px-2.5 sm:py-1.5 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 bg-white dark:bg-neutral-900 font-mono text-xs text-[var(--ca-ink)] dark:text-white outline-hidden focus:border-[var(--ca-orange)] transition-all"
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
