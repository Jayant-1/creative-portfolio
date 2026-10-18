import React from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PreviewClient } from "./PreviewClient";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
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

export default async function PreviewPage({ params }: PageProps) {
  const { slug } = await params;
  if (!VALID_SLUGS.includes(slug)) {
    notFound();
  }

  return <PreviewClient slug={slug} />;
}

