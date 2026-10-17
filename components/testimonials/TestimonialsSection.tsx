"use client";

import React from "react";
import { testimonials } from "@/lib/testimonials";
import { Scribble } from "@/components/Paper";
import Reveal from "@/components/Reveal";
import { OptionTapeTrack } from "./OptionTapeTrack";

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="ca-grid ca-section-contain relative scroll-mt-24 py-16 sm:py-24 border-t-2 border-[var(--ca-ink)]/10 overflow-hidden w-full"
      aria-labelledby="testimonials-heading"
    >
      {/* Section Header */}
      <header className="mb-10 text-center px-4">
        <Reveal>
          <h2 id="testimonials-heading">
            <Scribble withDoodle>notes from the build</Scribble>
          </h2>
        </Reveal>
      </header>

      {/* Full Screen Width Continuous Tape Track (Option 2) */}
      <div className="w-full">
        <OptionTapeTrack items={testimonials} />
      </div>
    </section>
  );
}
