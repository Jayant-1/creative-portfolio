import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Scribble } from "@/components/Paper";

export default function NotFound() {
  return (
    <div className="ca-grid flex min-h-[calc(100vh-60px)] min-h-[calc(100svh-60px)] min-h-[calc(100dvh-60px)] flex-col items-center justify-center px-4 text-center">
      <Scribble>whoops!</Scribble>
      <div className="relative mt-4 inline-block border-[3px] border-[var(--ca-ink)] bg-white px-8 py-3 shadow-[6px_6px_0_var(--ca-yellow)]">
        <h1 className="ca-display text-7xl uppercase leading-none tracking-tight sm:text-9xl">
          404
        </h1>
      </div>
      <p className="ca-hand mt-6 text-2xl text-[var(--ca-ink)]/80 sm:text-3xl">
        This notebook page seems to be torn out or moved somewhere else.
      </p>
      <Link
        href="/"
        className="ca-mono mt-8 inline-flex items-center gap-2 border-2 border-[var(--ca-ink)] bg-[var(--ca-ink)] px-6 py-3 text-sm font-bold uppercase tracking-widest text-white shadow-[4px_4px_0_var(--ca-yellow)] transition-transform duration-150 hover:-translate-y-1 hover:bg-[var(--ca-blue)]"
      >
        <ArrowLeft size={18} />
        Back to Home
      </Link>
    </div>
  );
}
