"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";

interface ScrubberTrackProps {
  label: string;
  value: number;
  min: number;
  max: number;
  step?: number;
  unit?: string;
  onChange: (value: number) => void;
}

export const ScrubberTrack: React.FC<ScrubberTrackProps> = ({
  label,
  value,
  min,
  max,
  step = 1,
  unit = "",
  onChange,
}) => {
  const trackRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  // Clamp & snap to step
  const calculateValueFromPointer = useCallback(
    (clientX: number) => {
      if (!trackRef.current) return value;
      const rect = trackRef.current.getBoundingClientRect();
      const percentage = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width));
      const rawValue = min + percentage * (max - min);
      const steppedValue = Math.round(rawValue / step) * step;
      const clampedValue = Math.max(min, Math.min(max, steppedValue));
      // Fix float rounding issues (e.g. 0.1 + 0.2)
      return Number(clampedValue.toFixed(2));
    },
    [min, max, step, value]
  );

  const handlePointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    const newValue = calculateValueFromPointer(e.clientX);
    onChange(newValue);
  };

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const newValue = calculateValueFromPointer(e.clientX);
      onChange(newValue);
    };

    const handlePointerUp = () => {
      setIsDragging(false);
    };

    window.addEventListener("pointermove", handlePointerMove);
    window.addEventListener("pointerup", handlePointerUp);

    return () => {
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
    };
  }, [isDragging, calculateValueFromPointer, onChange]);

  const percentage = Math.max(0, Math.min(100, ((value - min) / (max - min)) * 100));

  return (
    <div className="flex flex-col gap-2 w-full select-none">
      {/* Header with Label and Numeric Display */}
      <div className="flex items-center justify-between text-xs">
        <span className="font-sans font-medium text-[11px] uppercase tracking-wider text-[var(--ca-ink)]/70 dark:text-neutral-400">
          {label}
        </span>
        <span className="font-mono text-[11px] font-semibold tabular-nums px-2 py-0.5 rounded-md bg-[var(--ca-ink)]/5 dark:bg-white/10 border border-[var(--ca-ink)]/10 dark:border-white/10 text-[var(--ca-ink)] dark:text-white">
          {value}
          {unit}
        </span>
      </div>

      {/* Tactile Track Bar */}
      <div
        ref={trackRef}
        role="slider"
        tabIndex={0}
        aria-label={label}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        onKeyDown={(e) => {
          if (e.key === "ArrowRight" || e.key === "ArrowUp") {
            e.preventDefault();
            onChange(Math.min(max, value + step));
          } else if (e.key === "ArrowLeft" || e.key === "ArrowDown") {
            e.preventDefault();
            onChange(Math.max(min, value - step));
          } else if (e.key === "Home") {
            e.preventDefault();
            onChange(min);
          } else if (e.key === "End") {
            e.preventDefault();
            onChange(max);
          }
        }}
        onPointerDown={handlePointerDown}
        className="group relative h-6 w-full cursor-pointer flex items-center focus:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 rounded-full"
      >
        {/* Sunken Groove */}
        <div className="relative h-2 w-full rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden shadow-inner">
          {/* Active Fill Bar */}
          <div
            className="h-full rounded-full bg-[#f97316] transition-all duration-75"
            style={{ width: `${percentage}%` }}
          />
        </div>

        {/* Circular Scrub Knob */}
        <div
          className="absolute h-4 w-4 -ml-2 rounded-full bg-white dark:bg-neutral-100 border-2 border-[#f97316] shadow-md pointer-events-none transition-transform group-hover:scale-125 group-active:scale-110"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
