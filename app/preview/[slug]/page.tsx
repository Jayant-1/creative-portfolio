import React from "react";
import { notFound } from "next/navigation";
import { PreviewClient } from "./PreviewClient";

interface PageProps {
  params: {
    slug: string;
  };
}

const VALID_SLUGS = [
  "overlapping-text-hero",
  "telescope-hero",
  "binary-grid",
  "bubble-text",
  "magnetic-button",
  "radial-gradient-card",
  "radial-gradient-animate-card",
];

export function generateStaticParams() {
  return VALID_SLUGS.map((slug) => ({ slug }));
}

export default function PreviewPage({ params }: PageProps) {
  if (!VALID_SLUGS.includes(params.slug)) {
    notFound();
  }

  return <PreviewClient slug={params.slug} />;
}
