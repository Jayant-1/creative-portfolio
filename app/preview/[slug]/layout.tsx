import type { Metadata } from "next";
import React from "react";
import "./preview.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
  },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="isolated-preview-root" className="w-full min-h-screen bg-neutral-950 text-white selection:bg-neutral-800">
      {children}
    </div>
  );
}
