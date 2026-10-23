"use client";

import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

/** Exclude isolated demos and strip visitor-supplied query strings from telemetry. */
export function Analytics() {
  const pathname = usePathname();
  const [enabled, setEnabled] = useState(false);
  useEffect(() => setEnabled(window.location.hostname === "jayant.codes"), []);
  if (!enabled || pathname.startsWith("/preview/")) return null;

  return (
    <VercelAnalytics
      beforeSend={(event) => {
        const url = new URL(event.url);
        if (url.hostname !== "jayant.codes" || url.pathname.startsWith("/preview/")) return null;
        url.search = "";
        url.hash = "";
        return { ...event, url: url.toString() };
      }}
    />
  );
}
