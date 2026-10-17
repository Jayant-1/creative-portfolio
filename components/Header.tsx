"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { social } from "@/lib/site";

export function SmileyLogo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`${className} overflow-visible [filter:drop-shadow(1px_1.5px_0_rgba(25,21,16,0.28))] transition-transform duration-200 hover:rotate-12 hover:scale-110`}
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="10" fill="var(--ca-magenta)" stroke="#ffffff" strokeWidth="2.5" paintOrder="stroke" />
      <circle cx="8.5" cy="10.5" r="1.35" fill="#ffffff" />
      <circle cx="15.5" cy="10.5" r="1.35" fill="#ffffff" />
      <path d="M8 14Q12 18 16 14" fill="none" stroke="#ffffff" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

export function SocialButtons({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2 ${className}`} aria-label="Social profiles">
      {/* LinkedIn: #376c96 circle with white square and #376c96 'in' */}
      <a
        href={social.linkedin}
        aria-label="LinkedIn"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-white shadow-[1.5px_1.5px_0_rgba(25,21,16,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
        style={{ backgroundColor: "#376c96" }}
      >
        <svg viewBox="0 0 24 24" className="h-4 w-4" aria-hidden="true">
          <rect x="2" y="2" width="20" height="20" rx="3.5" fill="white" />
          <path
            d="M7.4 6.2a1.35 1.35 0 1 1-2.7 0 1.35 1.35 0 0 1 2.7 0ZM4.8 9.2h2.5V17H4.8V9.2Zm4 0h2.4v1.15h.03c.34-.63 1.15-1.3 2.5-1.3 2.65 0 3.15 1.75 3.15 4V17h-2.5v-3.7c0-.88-.02-2.02-1.23-2.02-1.24 0-1.43.96-1.43 1.95V17H8.8V9.2Z"
            fill="#376c96"
          />
        </svg>
      </a>

      {/* GitHub: Black circle with solid white Octocat mark */}
      <a
        href={social.github}
        aria-label="GitHub"
        target="_blank"
        rel="noopener noreferrer"
        className="flex h-11 w-11 items-center justify-center rounded-full border-2 border-white text-white shadow-[1.5px_1.5px_0_rgba(25,21,16,0.25)] transition-transform duration-200 hover:-translate-y-0.5"
        style={{ backgroundColor: "#000000" }}
      >
        <svg viewBox="0 0 24 24" fill="white" className="h-4 w-4" aria-hidden="true">
          <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0 1 12 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0 0 22 12.017C22 6.484 17.522 2 12 2Z" />
        </svg>
      </a>
    </div>
  );
}

const navItems = [
  {
    href: "/",
    label: "Home",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" className="h-5 w-5 shrink-0 overflow-visible [filter:drop-shadow(1px_1.5px_0_rgba(25,21,16,0.28))] transition-transform duration-200 group-hover:-translate-y-0.5">
        <path d="M12 2.5 3 10.5h2.5V21h4.5v-5a2 2 0 0 1 4 0v5h4.5V10.5H21z" />
      </svg>
    ),
  },
  {
    href: "/about",
    label: "About",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" className="h-5 w-5 shrink-0 overflow-visible [filter:drop-shadow(1px_1.5px_0_rgba(25,21,16,0.28))] transition-transform duration-200 group-hover:-translate-y-0.5">
        <path d="M12 3a3.6 3.6 0 100 7.2A3.6 3.6 0 0012 3zM4.8 20a7.2 7.2 0 0114.4 0z" />
      </svg>
    ),
  },
  {
    href: "/projects",
    label: "Projects",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" className="h-5 w-5 shrink-0 overflow-visible [filter:drop-shadow(1px_1.5px_0_rgba(25,21,16,0.28))] transition-transform duration-200 group-hover:-translate-y-0.5">
        <path fillRule="evenodd" clipRule="evenodd" d="M2.25 6A2.25 2.25 0 0 1 4.5 3.75h15A2.25 2.25 0 0 1 21.75 6v12A2.25 2.25 0 0 1 19.5 20.25h-15A2.25 2.25 0 0 1 2.25 18V6Zm5.25 3.75a.75.75 0 0 0-.53 1.28l1.97 1.97-1.97 1.97a.75.75 0 1 0 1.06 1.06l2.5-2.5a.75.75 0 0 0 0-1.06l-2.5-2.5a.75.75 0 0 0-.53-.22Zm5.25 5.25a.75.75 0 0 0 0 1.5h3a.75.75 0 0 0 0-1.5h-3Z" />
      </svg>
    ),
  },
  {
    href: "/experience",
    label: "Experience",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" className="h-5 w-5 shrink-0 overflow-visible [filter:drop-shadow(1px_1.5px_0_rgba(25,21,16,0.28))] transition-transform duration-200 group-hover:-translate-y-0.5">
        <path d="M20 6h-4V4a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2zM10 4h4v2h-4V4zm10 15H4v-7h16v7zm0-9H4V8h16v2z" />
      </svg>
    ),
  },
  {
    href: "/components",
    label: "Components",
    icon: (
      <svg
        viewBox="0 0 24 24"
        fill="currentColor"
        stroke="#ffffff"
        strokeWidth="2.5"
        strokeLinejoin="round"
        paintOrder="stroke"
        className="h-5 w-5 shrink-0 overflow-visible [filter:drop-shadow(1px_1.5px_0_rgba(25,21,16,0.28))] transition-transform duration-300 ease-out origin-center group-hover:rotate-45 group-hover:scale-110"
      >
        <path d="M12 1.5L17 6.5L12 11.5L7 6.5Z" />
        <path d="M6.5 7L11.5 12L6.5 17L1.5 12Z" />
        <path d="M17.5 7L22.5 12L17.5 17L12.5 12Z" />
        <path d="M12 12.5L17 17.5L12 22.5L7 17.5Z" />
      </svg>
    ),
  },
  {
    href: "/blog",
    label: "Blog",
    icon: (
      <svg viewBox="0 0 24 24" fill="currentColor" stroke="#ffffff" strokeWidth="3" strokeLinejoin="round" paintOrder="stroke" className="h-5 w-5 shrink-0 overflow-visible [filter:drop-shadow(1px_1.5px_0_rgba(25,21,16,0.28))] transition-transform duration-200 group-hover:-translate-y-0.5">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-2 10H7v-2h10v2zm0-4H7V7h10v2z" />
      </svg>
    ),
  },
];

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const menuBtnRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  // Close drawer cleanly on route change
  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  // Trap focus and handle Escape key dismiss
  useEffect(() => {
    if (!mobileOpen) return;

    // Lock body scroll on mobile while drawer is active
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setMobileOpen(false);
        menuBtnRef.current?.focus();
        return;
      }

      if (e.key === "Tab") {
        if (!drawerRef.current) return;
        const focusableElements = drawerRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === firstElement || document.activeElement === menuBtnRef.current) {
            e.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            e.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [mobileOpen]);

  const toggleMobileMenu = useCallback(() => {
    setMobileOpen((prev) => !prev);
  }, []);

  if (pathname?.startsWith("/preview")) {
    return null;
  }

  return (
    <>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:bg-[var(--ca-yellow)] focus:px-4 focus:py-2 focus:font-bold focus:border-2 focus:border-[var(--ca-ink)]"
      >
        Skip to content
      </a>

      {/* Header Container with iPhone Safe Area Inset Top */}
      <header
        className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-[var(--ca-ink)]/15 shadow-sm transition-[padding] duration-200"
        style={{
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div className="relative flex items-stretch justify-between pl-3 pr-3 sm:pl-5 min-h-[56px]">
          <div className="flex items-stretch gap-1 sm:gap-2">
            <Link
              href="/"
              aria-label="Jayant Potdar - Home"
              className="flex items-center lg:hidden py-2 pl-1 pr-2 transition-transform duration-200 hover:scale-105 active:scale-95"
            >
              <SmileyLogo className="h-8 w-8" />
            </Link>
            <nav className="hidden items-stretch lg:flex" aria-label="Main navigation">
              {navItems.map((item) => {
                const isActive =
                  item.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(item.href) ||
                      (item.href === "/projects" && pathname.startsWith("/case-studies")) ||
                      (item.href === "/blog" && pathname.startsWith("/notes"));

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={isActive ? "page" : undefined}
                    className={`ca-mono group flex items-center justify-center gap-2 px-3.5 py-4 text-xs xl:text-sm font-bold uppercase leading-none tracking-wider text-[var(--ca-ink)] transition-colors ${
                      isActive ? "bg-[var(--ca-yellow)]" : "hover:bg-[var(--ca-chrome)]"
                    }`}
                  >
                    {item.icon}
                    {item.label}
                  </Link>
                );
              })}
            </nav>
          </div>

          <div className="flex items-center gap-2 py-2">
            <SocialButtons />

            <Link
              href="/contact"
              className="ca-mono hidden min-h-[44px] items-center gap-2.5 border-2 border-[var(--ca-ink)] px-5 py-2 text-sm font-bold uppercase tracking-widest text-[var(--ca-ink)] transition-colors hover:bg-[var(--ca-ink)] hover:text-white sm:inline-flex"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
              </svg>
              Contact
            </Link>

            {/* Accessible Hamburger Toggle Button with 44x44px Touch Target */}
            <button
              ref={menuBtnRef}
              type="button"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
              aria-controls="mobile-navigation"
              className="flex h-11 w-11 items-center justify-center border-2 border-[var(--ca-ink)] bg-[var(--ca-surface)] lg:hidden transition-colors hover:bg-[var(--ca-yellow)] active:scale-95"
              onClick={toggleMobileMenu}
            >
              {mobileOpen ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" className="h-5 w-5 text-[var(--ca-ink)]" aria-hidden="true">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" className="h-5 w-5 text-[var(--ca-ink)]" aria-hidden="true">
                  <path d="M3 6h18M3 12h18M3 18h18" />
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile dropdown drawer with Backdrop & Spring Animation */}
        <AnimatePresence>
          {mobileOpen && (
            <>
              {/* Tap-outside Backdrop Overlay */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => {
                  setMobileOpen(false);
                  menuBtnRef.current?.focus();
                }}
                className="fixed inset-0 top-[57px] z-40 bg-black/45 backdrop-blur-[2px] lg:hidden"
                aria-hidden="true"
              />

              {/* Drawer Sheet */}
              <motion.nav
                ref={drawerRef}
                id="mobile-navigation"
                aria-label="Mobile navigation"
                role="dialog"
                aria-modal="true"
                initial={{ opacity: 0, y: -12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                className="relative z-50 flex flex-col border-b-2 border-[var(--ca-ink)] bg-[var(--ca-surface)]/95 backdrop-blur-md p-4 shadow-2xl lg:hidden"
                style={{
                  paddingBottom: "max(1.5rem, env(safe-area-inset-bottom, 0px))",
                }}
              >
                {navItems.map((item) => {
                  const isActive =
                    item.href === "/"
                      ? pathname === "/"
                      : pathname.startsWith(item.href) ||
                        (item.href === "/projects" && pathname.startsWith("/case-studies")) ||
                        (item.href === "/blog" && pathname.startsWith("/notes"));

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      aria-current={isActive ? "page" : undefined}
                      className={`ca-mono group flex min-h-[48px] items-center gap-3 px-4 py-3 text-sm font-bold uppercase tracking-widest transition-colors ${
                        isActive
                          ? "bg-[var(--ca-yellow)] text-[var(--ca-ink)]"
                          : "text-[var(--ca-ink)] hover:bg-[var(--ca-chrome)] active:bg-[var(--ca-chrome)]"
                      }`}
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.icon}
                      {item.label}
                    </Link>
                  );
                })}
                <Link
                  href="/contact"
                  className="ca-mono mt-3 flex min-h-[48px] items-center justify-center gap-2 border-2 border-[var(--ca-ink)] bg-[var(--ca-blue)] py-3 text-sm font-bold uppercase tracking-widest text-white shadow-[2px_2px_0_var(--ca-ink)] transition-colors active:translate-y-0.5"
                  onClick={() => setMobileOpen(false)}
                >
                  <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
                    <path d="M1.5 8.67v8.58a3 3 0 0 0 3 3h15a3 3 0 0 0 3-3V8.67l-8.928 5.493a3 3 0 0 1-3.144 0L1.5 8.67Z" />
                    <path d="M22.5 6.908V6.75a3 3 0 0 0-3-3h-15a3 3 0 0 0-3 3v.158l9.714 5.978a1.5 1.5 0 0 0 1.572 0L22.5 6.908Z" />
                  </svg>
                  Contact Me
                </Link>
              </motion.nav>
            </>
          )}
        </AnimatePresence>
      </header>
    </>
  );
}
