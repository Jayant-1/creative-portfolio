"use client";

import React from "react";
import { Testimonial } from "@/lib/testimonials";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import { Tape } from "@/components/Paper";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({
  testimonial,
  className = "",
}: TestimonialCardProps) {
  return (
    <article
      className={`relative flex flex-col justify-between select-none rounded-lg border-2 border-[var(--ca-ink)] bg-white text-left p-5 sm:p-7 shadow-[4px_6px_0_var(--ca-ink)] min-h-[220px] sm:min-h-0 sm:aspect-[16/9] w-full ${className}`}
    >
      {/* Top Masking Tape Accent */}
      <Tape
        className="-top-3 left-8 sm:left-10"
        angle={testimonial.tapeAngle}
        color={testimonial.tapeColor}
      />

      {/* First-person project note */}
      <blockquote className="relative my-auto pt-2">
        <span
          aria-hidden="true"
          className="font-serif absolute -left-2 -top-4 text-5xl text-[var(--ca-ink)]/15 select-none pointer-events-none"
        >
          &ldquo;
        </span>
        <p className="relative z-10 text-sm leading-relaxed text-[var(--ca-ink)]/90 sm:text-base font-normal">
          {testimonial.quote}
        </p>
      </blockquote>

      {/* Project identity */}
      <div className="flex items-center gap-3 border-t border-[var(--ca-ink)]/10 pt-3.5">
        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full border-2 border-[var(--ca-ink)] bg-[var(--ca-chrome)] shadow-[2px_2px_0_var(--ca-ink)]">
          <ImageWithLoader
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            sizes="40px"
            className="object-cover"
            loaderVariant="minimal"
          />
        </div>

        <div className="min-w-0 flex-1">
          <h4 className="truncate text-sm font-bold text-[var(--ca-ink)] sm:text-base">
            {testimonial.name}
          </h4>
          <p className="truncate text-xs font-medium text-[var(--ca-ink)]/70">
            {testimonial.role} • <span className="font-semibold text-[var(--ca-ink)]">{testimonial.company}</span>
          </p>
        </div>
      </div>
    </article>
  );
}
