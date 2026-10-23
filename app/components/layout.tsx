import React from "react";

export default function ComponentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // The same font families are already hosted locally in globals.css.
  return <>{children}</>;
}
