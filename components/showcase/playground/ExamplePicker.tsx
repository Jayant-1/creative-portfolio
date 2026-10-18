"use client";

import React from "react";
import Image from "next/image";
import { ExamplePreset } from "@/lib/component-manifests";

interface ExamplePickerProps {
  examples: [ExamplePreset, ExamplePreset, ExamplePreset];
  selectedId: string;
  onSelect: (example: ExamplePreset) => void;
}

export const ExamplePicker: React.FC<ExamplePickerProps> = ({
  examples,
  selectedId,
  onSelect,
}) => {
  return (
    <section className="w-full flex flex-col gap-2.5 my-0">
      {/* Quiet Section Heading */}
      <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 border-b border-[var(--ca-ink)]/10 dark:border-white/10 pb-2">
        <h2 className="font-mono text-sm sm:text-base font-bold text-[var(--ca-ink)] dark:text-white uppercase tracking-wider">
          Examples
        </h2>
        <span className="font-mono text-xs text-[var(--ca-ink)]/75 dark:text-neutral-300">
          Select a preset to load into preview
        </span>
      </div>

      {/* Three Equal-Width Thumbnail Choices in One Row */}
      <div
        role="group"
        aria-label="Component examples"
        className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3 w-full"
      >
        {examples.map((example) => {
          const isSelected = example.id === selectedId;

          return (
            <button
              key={example.id}
              type="button"
              aria-pressed={isSelected}
              onClick={() => onSelect(example)}
              className={`group flex flex-col text-left rounded-lg border p-1.5 sm:p-2 transition-all outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                isSelected
                  ? "bg-white dark:bg-[#16181d] border-[var(--ca-orange)] shadow-xs ring-1 ring-[var(--ca-orange)]/40"
                  : "bg-[#faf8f4] dark:bg-[#121316] border-[var(--ca-ink)]/15 dark:border-white/10 hover:border-[var(--ca-ink)]/30 dark:hover:border-white/20"
              }`}
            >
              {/* Thumbnail Image Box */}
              <div className="relative w-full aspect-[16/10] rounded-md overflow-hidden bg-neutral-900 border border-[var(--ca-ink)]/10 dark:border-white/10">
                <Image
                  src={example.thumbnail}
                  alt=""
                  fill
                  sizes="(max-width: 640px) 100vw, 33vw"
                  className="object-cover object-top transition-transform duration-300 group-hover:scale-102"
                />
              </div>

              {/* Title */}
              <div className="w-full mt-1.5 px-0.5">
                <span
                  className={`block font-mono text-xs font-semibold truncate transition-colors ${
                    isSelected
                      ? "text-[#c2410c] dark:text-orange-400 font-bold"
                      : "text-[var(--ca-ink)] dark:text-neutral-200 group-hover:text-[#c2410c] dark:group-hover:text-orange-400"
                  }`}
                >
                  {example.name}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </section>
  );
};
