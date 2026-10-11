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
      <div className="flex items-center justify-between text-xs font-mono">
        <span className="text-[var(--ca-ink)]/70 uppercase tracking-wider font-medium text-[11px]">
          {label}
        </span>
        <span className="px-2 py-0.5 rounded-md bg-[var(--ca-ink)]/5 border border-[var(--ca-ink)]/10 text-[var(--ca-ink)] font-semibold text-[11px] tabular-nums">
          {value}
          {unit}
        </span>
      </div>

      {/* Scrubber Track Bar */}
      <div
        ref={trackRef}
        onPointerDown={handlePointerDown}
        className="group relative h-8 w-full cursor-ew-resize rounded-lg bg-[var(--ca-ink)]/5 border border-[var(--ca-ink)]/10 p-1 flex items-center overflow-hidden transition-colors hover:bg-[var(--ca-ink)]/8"
      >
        {/* Subtle background ruler ticks */}
        <div
          className="absolute inset-0 pointer-events-none opacity-20"
          style={{
            backgroundImage:
              "repeating-linear-gradient(to right, currentColor 0, currentColor 1px, transparent 1px, transparent 12px)",
          }}
        />

        {/* Filled Progress Bar */}
        <div
          className="absolute left-1 top-1 bottom-1 rounded-md bg-[var(--ca-orange)]/20 border-r-2 border-[var(--ca-orange)] transition-all duration-75 pointer-events-none"
          style={{ width: `calc(${percentage}% - 8px)` }}
        />

        {/* Interactive Scrub Thumb Handle */}
        <div
          className="absolute top-1 bottom-1 w-2 -ml-1 rounded-full bg-[var(--ca-orange)] shadow-sm pointer-events-none transition-transform group-hover:scale-110"
          style={{ left: `${percentage}%` }}
        />
      </div>
    </div>
  );
};
