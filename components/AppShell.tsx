"use client";

import React from "react";
import { usePathname } from "next/navigation";
import { Header } from "@/components/Header";
import Preloader from "@/components/Preloader";

interface AppShellProps {
  children: React.ReactNode;
}

export default function AppShell({ children }: AppShellProps) {
  const pathname = usePathname();
  const isPreview = Boolean(pathname && pathname.startsWith("/preview"));

  if (isPreview) {
    return <>{children}</>;
  }

  return (
    <>
      <Preloader />
      <Header />
      <main id="main" className="relative z-10">
        {children}
      </main>
    </>
  );
}
