import type { Metadata } from "next";
import React from "react";
import "./preview.css";

export const metadata: Metadata = {
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function PreviewLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div id="isolated-preview-root" className="w-full min-h-screen bg-neutral-950 text-white selection:bg-neutral-800">
      <link
        rel="preload"
        href="/fonts/six-caps.woff2"
        as="font"
        type="font/woff2"
        crossOrigin="anonymous"
      />
      {children}
    </div>
  );
}
