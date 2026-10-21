"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { createPortal } from "react-dom";
import { ImageWithLoader } from "@/components/ImageWithLoader";
import {
  ArrowUpRight,
  Check,
  Copy,
  X,
  FileText,
  ExternalLink,
  ChevronRight,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { certificateGroups, CertificateGroup, CertificateItem } from "@/lib/site";
import { useFocusTrap } from "@/lib/hooks/use-focus-trap";

interface CertificateSectionProps {
  className?: string;
}

export function CertificateSection({ className = "" }: CertificateSectionProps) {
  const [selectedGroup, setSelectedGroup] = useState<CertificateGroup | null>(null);
  const [selectedItem, setSelectedItem] = useState<CertificateItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const [mounted, setMounted] = useState(false);
  const triggerRef = useRef<HTMLElement | null>(null);
  const drawerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDrawerOpen = Boolean(selectedGroup && selectedItem);

  const openDrawer = useCallback(
    (group: CertificateGroup, item: CertificateItem, triggerEl?: HTMLElement) => {
      triggerRef.current = triggerEl || ((typeof document !== "undefined" ? document.activeElement : null) as HTMLElement | null);
      setSelectedGroup(group);
      setSelectedItem(item);
      setCopiedLink(false);
    },
    []
  );

  const closeDrawer = useCallback(() => {
    setSelectedGroup(null);
    setSelectedItem(null);
  }, []);

  useFocusTrap<HTMLDivElement>({
    isActive: isDrawerOpen,
    onClose: closeDrawer,
    initialFocusRef: closeButtonRef,
    returnFocusRef: triggerRef,
    containerRef: drawerRef,
    setInertBackground: true,
    lockScroll: true,
  });

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <div className={className}>
      {/* 4 Clean Minimal Editorial Boxes (Option 1) Arranged Chronologically */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {certificateGroups.map((group) => (
          <div
            key={group.organization}
            className="border-2 border-[var(--ca-ink)] bg-white p-5 sm:p-6 shadow-[3px_4px_0_var(--ca-ink)] rounded-xl flex flex-col justify-between transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_6px_0_var(--ca-ink)]"
          >
            <div>
              {/* Header: Logo, Name & Date */}
              <div className="flex flex-wrap sm:flex-nowrap items-center justify-between gap-2.5 sm:gap-3 border-b border-[var(--ca-ink)]/15 pb-3.5">
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative h-10 w-10 shrink-0 rounded-md border border-[var(--ca-ink)]/20 bg-white p-1 flex items-center justify-center overflow-hidden">
                    <ImageWithLoader
                      src={group.logo}
                      alt={`${group.organization} logo`}
                      width={32}
                      height={32}
                      className="object-contain max-h-full max-w-full"
                      wrapperStyle={{ backgroundColor: "transparent" }}
                      loaderVariant="minimal"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-extrabold uppercase tracking-tight text-[var(--ca-ink)] leading-none">
                      {group.organization}
                    </h3>
                    <p className="ca-mono mt-1 text-[11px] font-medium text-[var(--ca-ink)]/65">
                      {group.subtitle}
                    </p>
                  </div>
                </div>

                <span className="ca-mono shrink-0 rounded border border-[var(--ca-ink)]/20 bg-[var(--ca-chrome)]/60 px-2.5 py-0.5 text-[11px] font-semibold text-[var(--ca-ink)]/75">
                  {group.date}
                </span>
              </div>

              {/* Direct Single-Click Certificate Items (No separate Inspect button, No redundant footer) */}
              <ul className="mt-4 space-y-2">
                {group.items.map((item) => (
                  <li key={item.id}>
                    <button
                      type="button"
                      onClick={(e) => openDrawer(group, item, e.currentTarget)}
                      className="group w-full min-h-[44px] text-left rounded-lg border border-[var(--ca-ink)]/15 bg-white p-3 transition-all duration-150 hover:border-[var(--ca-ink)] hover:bg-[var(--ca-chrome)]/40 hover:shadow-[2px_2px_0_var(--ca-ink)] flex items-center justify-between gap-3 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--ca-ink)] group-hover:scale-125 transition-transform" />
                        <span className="text-sm font-bold text-[var(--ca-ink)] truncate group-hover:text-[var(--ca-blue)] transition-colors">
                          {item.name}
                        </span>
                      </div>

                      <span className="ca-mono shrink-0 inline-flex items-center gap-1 text-[11px] font-bold text-[var(--ca-ink)]/60 group-hover:text-[var(--ca-ink)] transition-colors">
                        View
                        <ChevronRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Smooth Slide-up Bottom Drawer with REAL Certificate Document Scans */}
      {mounted &&
        typeof document !== "undefined" &&
        createPortal(
          <AnimatePresence>
            {selectedGroup && selectedItem && (
              <div className="fixed inset-0 z-50 flex items-end justify-center">
                {/* Backdrop */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={closeDrawer}
                  className="fixed inset-0 bg-black/60 backdrop-blur-xs"
                  aria-hidden="true"
                />

                {/* Bottom Drawer Sheet with Safe Area Bottom */}
                <motion.div
                  ref={drawerRef}
                  role="dialog"
                  aria-modal="true"
                  aria-labelledby="drawer-certificate-title"
                  initial={{ y: "100%" }}
                  animate={{ y: 0 }}
                  exit={{ y: "100%" }}
                  transition={{ type: "spring", damping: 28, stiffness: 320 }}
                  style={{
                    paddingBottom: "max(1.75rem, env(safe-area-inset-bottom, 0px))",
                  }}
                  className="relative z-10 w-full max-w-3xl max-h-[92vh] max-h-[92dvh] overflow-y-auto rounded-t-3xl border-3 border-b-0 border-[var(--ca-ink)] bg-white p-5 sm:p-7 shadow-[0_-12px_40px_rgba(17,18,18,0.35)]"
                >
                  {/* Drawer Pull Handle */}
                  <div
                    onClick={closeDrawer}
                    className="w-12 h-1.5 rounded-full bg-[var(--ca-ink)]/25 mx-auto mb-3 cursor-pointer hover:bg-[var(--ca-ink)]/40 transition-colors"
                    title="Click to close"
                    aria-hidden="true"
                  />

                  {/* Drawer Header (Clean, without green badge) */}
                  <div className="flex items-center justify-between gap-3 border-b border-[var(--ca-ink)]/15 pb-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="relative h-10 w-10 shrink-0 rounded-md border border-[var(--ca-ink)]/20 bg-white p-1 flex items-center justify-center overflow-hidden">
                        <ImageWithLoader
                          src={selectedGroup.logo}
                          alt={`${selectedGroup.organization} logo`}
                          width={32}
                          height={32}
                          className="object-contain max-h-full max-w-full"
                          wrapperStyle={{ backgroundColor: "transparent" }}
                          loaderVariant="minimal"
                        />
                      </div>
                      <div className="min-w-0">
                        <span className="ca-mono text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/70 block">
                          {selectedGroup.organization}
                        </span>
                        <h4
                          id="drawer-certificate-title"
                          className="text-sm sm:text-base font-extrabold text-[var(--ca-ink)] leading-snug truncate"
                        >
                          {selectedItem.name}
                        </h4>
                      </div>
                    </div>

                    <button
                      ref={closeButtonRef}
                      type="button"
                      onClick={closeDrawer}
                      aria-label="Close certificate drawer"
                      className="shrink-0 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[var(--ca-ink)] bg-[var(--ca-chrome)] text-[var(--ca-ink)] hover:bg-[var(--ca-yellow)] active:scale-95 transition-colors shadow-2xs focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                    >
                      <X size={18} />
                    </button>
                  </div>

              {/* Multi-Certificate Tab Switcher (e.g. Harvard CS50 / CS50 SQL, Certiport HTML / Databases) */}
              {selectedGroup.items.length > 1 && (
                <div className="mt-3 flex flex-wrap gap-2 border-b border-[var(--ca-ink)]/10 pb-3">
                  {selectedGroup.items.map((item) => {
                    const isActive = item.id === selectedItem.id;
                    return (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => {
                          setSelectedItem(item);
                          setCopiedLink(false);
                        }}
                        className={`ca-mono text-xs font-bold min-h-[44px] inline-flex items-center px-3.5 py-2 rounded-md border transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)] ${
                          isActive
                            ? "border-[var(--ca-ink)] bg-[var(--ca-ink)] text-white shadow-2xs"
                            : "border-[var(--ca-ink)]/20 bg-[var(--ca-chrome)]/60 text-[var(--ca-ink)]/80 hover:border-[var(--ca-ink)] hover:bg-white hover:text-[var(--ca-ink)]"
                        }`}
                      >
                        {item.shortName || item.name}
                      </button>
                    );
                  })}
                </div>
              )}

              {/* REAL CERTIFICATE DOCUMENT IMAGE DISPLAY (Fully Scaled & Completely Visible) */}
              <div className="mt-3.5 rounded-xl border border-[var(--ca-ink)]/15 bg-[#FBFBFA] p-3 sm:p-4 flex flex-col items-center justify-center">
                {selectedItem.image ? (
                  <div className="relative w-full max-w-2xl h-[280px] xs:h-[320px] sm:h-[380px] md:h-[430px] flex items-center justify-center rounded-lg border border-[var(--ca-ink)]/15 bg-white shadow-sm p-2 sm:p-3 overflow-hidden">
                    <ImageWithLoader
                      src={selectedItem.image}
                      alt={`${selectedItem.name} certificate`}
                      fill
                      sizes="(max-width: 640px) 92vw, (max-width: 1024px) 680px, 768px"
                      className="object-contain p-2"
                      wrapperClassName="w-full h-full"
                      wrapperStyle={{ backgroundColor: "#ffffff" }}
                      loaderVariant="project"
                      loaderText="Loading Certificate..."
                      priority
                    />
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <FileText size={40} className="mx-auto text-[var(--ca-ink)]/40" />
                    <p className="ca-mono mt-2 text-sm text-[var(--ca-ink)]/70">
                      Certificate document on official record
                    </p>
                  </div>
                )}
              </div>

              {/* Official Credential Metadata Card (Ensures complete certificate context: Recipient, Credential ID, Date, Skills) */}
              <div className="mt-3.5 w-full rounded-xl border border-[var(--ca-ink)]/15 bg-white p-3.5 sm:p-4 text-left shadow-2xs">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[var(--ca-ink)]/10 pb-2.5">
                  {selectedItem.date && (
                    <div className="flex items-center gap-2">
                      <span className="ca-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/60">
                        Issued:
                      </span>
                      <span className="ca-mono text-xs sm:text-sm font-bold text-[var(--ca-ink)]">
                        {selectedItem.date}
                      </span>
                    </div>
                  )}
                  {selectedItem.credentialId && (
                    <div className="flex items-center gap-1.5">
                      <span className="ca-mono text-[10px] sm:text-xs font-bold uppercase tracking-wider text-[var(--ca-ink)]/60">
                        ID:
                      </span>
                      <code className="ca-mono text-[11px] sm:text-xs font-semibold text-[var(--ca-ink)]/85 bg-[var(--ca-chrome)] px-2 py-0.5 rounded border border-[var(--ca-ink)]/15 select-all">
                        {selectedItem.credentialId}
                      </code>
                    </div>
                  )}
                </div>

                {selectedItem.description && (
                  <p className="mt-2.5 text-xs sm:text-sm text-[var(--ca-ink)]/80 leading-relaxed">
                    {selectedItem.description}
                  </p>
                )}

                {selectedItem.skills && selectedItem.skills.length > 0 && (
                  <div className="mt-3 flex flex-wrap items-center gap-1.5">
                    <span className="ca-mono text-[10px] font-bold uppercase tracking-wider text-[var(--ca-ink)]/50 mr-1">
                      Skills:
                    </span>
                    {selectedItem.skills.map((skill) => (
                      <span
                        key={skill}
                        className="ca-mono rounded-md border border-[var(--ca-ink)]/15 bg-[var(--ca-chrome)]/60 px-2 py-0.5 text-[11px] font-semibold text-[var(--ca-ink)]/80"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Action Buttons Bar with 44px Minimum Touch Targets */}
              <div className="mt-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => copyToClipboard(selectedItem.credentialUrl)}
                    className="ca-mono min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--ca-ink)]/30 bg-white px-4 py-2.5 text-xs font-bold text-[var(--ca-ink)] hover:bg-[var(--ca-chrome)] transition-colors shadow-2xs active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                  >
                    {copiedLink ? (
                      <>
                        <Check size={15} className="text-emerald-700" />
                        Link Copied!
                      </>
                    ) : (
                      <>
                        <Copy size={15} />
                        Copy Link
                      </>
                    )}
                  </button>

                  {selectedItem.pdfUrl ? (
                    <a
                      href={selectedItem.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ca-mono min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--ca-ink)]/30 bg-white px-4 py-2.5 text-xs font-bold text-[var(--ca-ink)] hover:bg-[var(--ca-chrome)] transition-colors shadow-2xs active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                    >
                      <FileText size={15} />
                      Open Original PDF
                      <ExternalLink size={13} />
                    </a>
                  ) : selectedItem.image ? (
                    <a
                      href={selectedItem.image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="ca-mono min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-lg border border-[var(--ca-ink)]/30 bg-white px-4 py-2.5 text-xs font-bold text-[var(--ca-ink)] hover:bg-[var(--ca-chrome)] transition-colors shadow-2xs active:scale-98 focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                    >
                      <FileText size={15} />
                      View Full Image
                      <ExternalLink size={13} />
                    </a>
                  ) : null}
                </div>

                <a
                  href={selectedItem.credentialUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="ca-mono min-h-[44px] inline-flex items-center justify-center gap-1.5 rounded-lg border-2 border-[var(--ca-ink)] bg-[var(--ca-yellow)] px-5 py-2.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--ca-ink)] shadow-[2px_2px_0_var(--ca-ink)] hover:bg-[var(--ca-yellow-soft)] hover:-translate-y-0.5 active:translate-y-0 transition-all focus-visible:outline-hidden focus-visible:ring-2 focus-visible:ring-[var(--ca-orange)]"
                >
                  Verify on Official Site
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}
    </div>
  );
}
