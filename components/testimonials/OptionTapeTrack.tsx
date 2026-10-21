"use client";

import React, { useRef } from "react";
import { Testimonial } from "@/lib/testimonials";
import { TestimonialCard } from "./TestimonialCard";

interface OptionTapeTrackProps {
  items: Testimonial[];
}

export function OptionTapeTrack({ items }: OptionTapeTrackProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const renderCardList = (isAriaHidden = false) => (
    <div
      className="flex shrink-0 items-stretch gap-6 pr-6 sm:gap-8 sm:pr-8 py-8 sm:py-10"
      aria-hidden={isAriaHidden ? true : undefined}
    >
      {items.map((item, idx) => {
        const tilt = idx % 2 === 0 ? "rotate-[-1.5deg]" : "rotate-[1.5deg]";
        return (
          <div
            key={`${item.id}-${idx}${isAriaHidden ? "-clone" : ""}`}
            className={`w-[290px] min-[390px]:w-[320px] sm:w-[400px] md:w-[450px] shrink-0 transition-transform duration-300 hover:scale-[1.02] hover:rotate-0 ${tilt}`}
          >
            <TestimonialCard testimonial={item} />
          </div>
        );
      })}
    </div>
  );

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none overflow-hidden touch-pan-y group/track"
    >
      {/* Edge gradient fade masks on desktop */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-12 sm:w-28 bg-gradient-to-r from-[var(--ca-surface)] to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-12 sm:w-28 bg-gradient-to-l from-[var(--ca-surface)] to-transparent" />

      {/* GPU Accelerated 100% Seamless Infinite Marquee Track */}
      <div className="ca-infinite-testimonial-track">
        {/* Set A: Primary */}
        {renderCardList(false)}

        {/* Set B: Infinite Loop Mirror */}
        {renderCardList(true)}
      </div>
    </div>
  );
}
