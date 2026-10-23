"use client";

import React from "react";
import {
  RotateCcw,
  SlidersHorizontal,
  Palette,
  Type,
  Sliders,
  ListFilter,
  ChevronDown,
} from "lucide-react";
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
      {/* Studio Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-2.5">
        <div className="flex flex-wrap items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2">
            <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[var(--ca-orange)]/10 text-[var(--ca-orange)]">
              <SlidersHorizontal size={12} strokeWidth={2.5} />
            </span>
            <h2 className="font-mono text-sm sm:text-base font-bold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider">
              Customize
            </h2>
          </div>

          <span className="font-mono text-[10px] text-[var(--ca-ink)]/45 dark:text-neutral-400 normal-case tracking-normal hidden md:inline">
            {"// live parameters"}
          </span>

          {isModified && (
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-mono font-semibold bg-[var(--ca-orange)]/10 text-[var(--ca-orange)] border border-[var(--ca-orange)]/25 animate-fadeIn">
              <span className="h-1.5 w-1.5 rounded-full bg-[var(--ca-orange)] animate-pulse" />
              <span>Modified ({selectedExampleName})</span>
            </span>
          )}
        </div>

        {isModified && (
          <button
            type="button"
            onClick={onReset}
            className="group min-h-[44px] sm:min-h-[28px] px-3 py-1.5 sm:py-1 inline-flex items-center gap-1.5 text-xs font-mono font-medium rounded-md border border-[var(--ca-ink)]/15 dark:border-white/15 bg-white dark:bg-[#181a20] text-[var(--ca-ink)]/80 dark:text-neutral-200 hover:text-[var(--ca-orange)] dark:hover:text-[var(--ca-orange)] hover:border-[var(--ca-orange)]/40 shadow-2xs transition-all duration-200 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] cursor-pointer"
            aria-label="Reset all parameters to preset defaults"
          >
            <RotateCcw
              size={12}
              className="text-[var(--ca-orange)] group-hover:-rotate-90 transition-transform duration-300"
            />
            <span>Reset to preset defaults</span>
          </button>
        )}
      </div>

      {/* Crafted Control Surface Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 sm:gap-3 p-3 sm:p-4 rounded-xl border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf8f4]/90 dark:bg-[#121316]/90 backdrop-blur-xs shadow-xs">
        {fields.map((field) => {
          const rawValue = values[field.key];
          const val = rawValue ?? "";

          // Intelligent column spanning to keep 3-column rows balanced without gaps
          const shouldSpan =
            field.type === "select" && fields.length % 3 !== 0;

          return (
            <div
              key={field.key}
              className={`group flex flex-col justify-between gap-2 p-3 rounded-lg border border-[var(--ca-ink)]/10 dark:border-white/8 bg-white dark:bg-[#16181f] shadow-2xs hover:border-[var(--ca-ink)]/25 dark:hover:border-white/20 focus-within:border-[var(--ca-orange)] dark:focus-within:border-[var(--ca-orange)] transition-all duration-200 ${
                shouldSpan ? "sm:col-span-2 lg:col-span-2" : "col-span-1"
              }`}
            >
              {/* Field Label Header */}
              <div className="flex items-center justify-between gap-2">
                <label
                  htmlFor={`field-${field.key}`}
                  className="font-mono text-[11px] font-semibold text-[var(--ca-ink)]/80 dark:text-neutral-300 tracking-wide flex items-center gap-1.5 cursor-pointer truncate"
                >
                  {field.type === "text" && (
                    <Type
                      size={12}
                      className="text-[var(--ca-ink)]/40 dark:text-neutral-500 shrink-0"
                    />
                  )}
                  {field.type === "color" && (
                    <Palette
                      size={12}
                      className="text-[var(--ca-ink)]/40 dark:text-neutral-500 shrink-0"
                    />
                  )}
                  {field.type === "number" && (
                    <Sliders
                      size={12}
                      className="text-[var(--ca-ink)]/40 dark:text-neutral-500 shrink-0"
                    />
                  )}
                  {field.type === "select" && (
                    <ListFilter
                      size={12}
                      className="text-[var(--ca-ink)]/40 dark:text-neutral-500 shrink-0"
                    />
                  )}
                  <span className="truncate">{field.label}</span>
                </label>

                {field.type === "number" && (
                  <span className="font-mono text-[11px] font-bold px-2 py-0.5 rounded bg-[var(--ca-orange)]/10 dark:bg-[var(--ca-orange)]/20 text-[#c2410c] dark:text-[var(--ca-orange)] border border-[var(--ca-orange)]/25 tabular-nums shrink-0">
                    {val}
                  </span>
                )}
              </div>

              {/* Text Input Control */}
              {field.type === "text" && (
                <div className="relative flex items-center">
                  <input
                    id={`field-${field.key}`}
                    type="text"
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    placeholder={field.placeholder || "Enter value..."}
                    className="w-full min-h-[44px] sm:min-h-[34px] px-3 py-1.5 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf9f6] dark:bg-[#0f1013] font-mono text-xs text-[var(--ca-ink)] dark:text-white placeholder:text-[var(--ca-ink)]/30 dark:placeholder:text-neutral-600 outline-hidden focus:bg-white dark:focus:bg-[#0a0b0e] focus:border-[var(--ca-orange)] transition-colors shadow-2xs"
                  />
                </div>
              )}

              {/* Color Picker Control with Integrated Swatch + Hex Input */}
              {field.type === "color" && (
                <div className="flex items-center gap-2">
                  <label
                    htmlFor={`field-${field.key}`}
                    className="relative flex items-center justify-center shrink-0 w-9 h-9 sm:w-8 sm:h-8 rounded-md border border-[var(--ca-ink)]/20 dark:border-white/15 cursor-pointer shadow-xs overflow-hidden transition-all hover:scale-105 active:scale-95 group/swatch"
                    style={{
                      backgroundColor:
                        typeof val === "string" && val.startsWith("#")
                          ? val
                          : "#dc2626",
                    }}
                    title="Click to open color picker"
                  >
                    <input
                      id={`field-${field.key}`}
                      type="color"
                      value={
                        typeof val === "string" && val.startsWith("#")
                          ? val
                          : "#dc2626"
                      }
                      onChange={(e) => onChange(field.key, e.target.value)}
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                    />
                    <span className="absolute inset-0 rounded-md ring-1 ring-inset ring-black/15 dark:ring-white/15 pointer-events-none" />
                    <span className="absolute inset-0 bg-white/0 group-hover/swatch:bg-white/15 transition-colors pointer-events-none" />
                  </label>

                  <div className="relative flex-1">
                    <input
                      id={`field-${field.key}-hex`}
                      type="text"
                      aria-label={`${field.label} hex code`}
                      value={val}
                      onChange={(e) => {
                        let text = e.target.value.trim();
                        if (text && !text.startsWith("#")) {
                          text = `#${text}`;
                        }
                        onChange(field.key, text);
                      }}
                      placeholder="#000000"
                      maxLength={9}
                      className="w-full min-h-[44px] sm:min-h-[34px] px-3 py-1.5 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf9f6] dark:bg-[#0f1013] font-mono text-xs font-semibold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider outline-hidden focus:bg-white dark:focus:bg-[#0a0b0e] focus:border-[var(--ca-orange)] transition-colors shadow-2xs"
                    />
                  </div>
                </div>
              )}

              {/* Number Slider Control with Bounds Readout */}
              {field.type === "number" && (
                <div className="flex flex-col gap-1 pt-0.5">
                  <div className="relative flex items-center">
                    <input
                      id={`field-${field.key}`}
                      type="range"
                      min={field.min ?? 0}
                      max={field.max ?? 100}
                      step={field.step ?? 1}
                      value={typeof val === "number" ? val : (field.min ?? 0)}
                      onChange={(e) =>
                        onChange(field.key, parseFloat(e.target.value))
                      }
                      className="w-full h-2 rounded-lg bg-[var(--ca-ink)]/10 dark:bg-white/10 accent-[var(--ca-orange)] cursor-pointer min-h-[36px] sm:min-h-[28px]"
                    />
                  </div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-[var(--ca-ink)]/40 dark:text-neutral-500 select-none">
                    <span>{field.min ?? 0}</span>
                    <span className="text-[var(--ca-ink)]/65 dark:text-neutral-400 font-semibold">
                      {val}
                    </span>
                    <span>{field.max ?? 100}</span>
                  </div>
                </div>
              )}

              {/* Select Dropdown Control with Styled Chevron */}
              {field.type === "select" && field.options && (
                <div className="relative flex items-center">
                  <select
                    id={`field-${field.key}`}
                    value={val}
                    onChange={(e) => onChange(field.key, e.target.value)}
                    className="w-full appearance-none min-h-[44px] sm:min-h-[34px] pl-3 pr-8 py-1.5 rounded-md border border-[var(--ca-ink)]/15 dark:border-white/10 bg-[#faf9f6] dark:bg-[#0f1013] font-mono text-xs text-[var(--ca-ink)] dark:text-white outline-hidden focus:bg-white dark:focus:bg-[#0a0b0e] focus:border-[var(--ca-orange)] transition-colors shadow-2xs cursor-pointer truncate"
                  >
                    {field.options.map((opt) => (
                      <option
                        key={opt.value}
                        value={opt.value}
                        className="bg-white dark:bg-[#121316] text-[var(--ca-ink)] dark:text-white font-mono text-xs py-1"
                      >
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown
                    size={14}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[var(--ca-ink)]/45 dark:text-neutral-400 pointer-events-none"
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
};
