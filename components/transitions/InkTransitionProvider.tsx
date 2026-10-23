"use client";

import React, {
  createContext,
  useContext,
  useRef,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { usePathname, useRouter } from "next/navigation";
import { InkCanvas, InkCanvasHandle } from "./InkCanvas";

interface InkTransitionContextType {
  navigate: (href: string, origin?: { x: number; y: number }) => void;
  pageAnimationReady: boolean;
  prewarmShader: () => boolean;
}

const InkTransitionContext = createContext<InkTransitionContextType>({
  navigate: () => {},
  pageAnimationReady: true,
  prewarmShader: () => false,
});

export const useInkTransition = () => useContext(InkTransitionContext);
export const usePageAnimationReady = () => {
  const ctx = useContext(InkTransitionContext);
  return ctx.pageAnimationReady;
};

export function InkTransitionProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const inkCanvasRef = useRef<InkCanvasHandle | null>(null);

  const [pageAnimationReady, setPageAnimationReady] = useState(true);
  const prewarmShader = useCallback(() => inkCanvasRef.current?.prewarm() ?? false, []);
  const isTransitioningRef = useRef(false);
  const targetHrefRef = useRef<string | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize global window flags
  useEffect(() => {
    if (typeof window !== "undefined") {
      (window as any).__ca_page_anim_ready = true;
      (window as any).__ca_transition_active = false;
    }
  }, []);

  const clearFailsafe = () => {
    if (timeoutIdRef.current) {
      clearTimeout(timeoutIdRef.current);
      timeoutIdRef.current = null;
    }
  };

  const startTransition = useCallback(
    (href: string, originX: number, originY: number) => {
      if (isTransitioningRef.current) return;
      isTransitioningRef.current = true;
      targetHrefRef.current = href;

      // Lock page entrance animations immediately while navigating
      setPageAnimationReady(false);
      if (typeof window !== "undefined") {
        (window as any).__ca_page_anim_ready = false;
        (window as any).__ca_transition_active = true;
        window.dispatchEvent(new CustomEvent("ca-transition-start"));
      }

      // Prefetch destination route immediately
      try {
        router.prefetch(href);
      } catch {}

      // Failsafe reset after 1600ms to guarantee user is never stuck
      clearFailsafe();
      timeoutIdRef.current = setTimeout(() => {
        if (isTransitioningRef.current) {
          inkCanvasRef.current?.reset();
          isTransitioningRef.current = false;
          targetHrefRef.current = null;
          setPageAnimationReady(true);
          if (typeof window !== "undefined") {
            (window as any).__ca_page_anim_ready = true;
            (window as any).__ca_transition_active = false;
            window.dispatchEvent(new CustomEvent("ca-page-animation-ready"));
          }
        }
      }, 1600);

      // Play ink cover (360ms total)
      inkCanvasRef.current?.playLeave(
        originX,
        originY,
        // onCoverReady: triggered early at ~80% coverage to remove black screen waiting pause!
        () => {
          router.push(href);
        },
        // onComplete: 100% cover reached
        () => {
          // Cover phase complete
        }
      );
    },
    [router]
  );

  const navigate = useCallback(
    (href: string, origin?: { x: number; y: number }) => {
      try {
        const dest = new URL(href, window.location.origin);
        const currentPath = window.location.pathname;
        const isComponentSwitch =
          currentPath.startsWith("/components") && dest.pathname.startsWith("/components");
        const isCurrentProject =
          currentPath.startsWith("/projects") || currentPath.startsWith("/work");
        const isDestProject =
          dest.pathname.startsWith("/projects") || dest.pathname.startsWith("/work");
        const isProjectSwitch = isCurrentProject && isDestProject;

        if (isComponentSwitch || isProjectSwitch) {
          router.push(href);
          return;
        }
      } catch {}

      const x = origin?.x ?? window.innerWidth / 2;
      const y = origin?.y ?? window.innerHeight / 2;
      startTransition(href, x, y);
    },
    [startTransition, router]
  );

  // Watch for route change completion
  useEffect(() => {
    if (isTransitioningRef.current) {
      // New page mounted in DOM
      window.scrollTo(0, 0);

      // Immediately start aperture reveal (360ms) with zero pause
      inkCanvasRef.current?.playEnter(
        // onPageVisible90: triggered once the page is 90% visible!
        () => {
          setPageAnimationReady(true);
          if (typeof window !== "undefined") {
            (window as any).__ca_page_anim_ready = true;
            window.dispatchEvent(new CustomEvent("ca-page-animation-ready"));
          }
        },
        // onComplete: reveal 100% finished
        () => {
          clearFailsafe();
          isTransitioningRef.current = false;
          targetHrefRef.current = null;
          if (typeof window !== "undefined") {
            (window as any).__ca_transition_active = false;
          }
        }
      );
    }
  }, [pathname]);

  // Global link click interceptor
  useEffect(() => {
    const handleDocumentClick = (e: MouseEvent) => {
      // Only process plain left-clicks without modifier keys
      if (
        e.button !== 0 ||
        e.ctrlKey ||
        e.metaKey ||
        e.altKey ||
        e.shiftKey ||
        e.defaultPrevented
      ) {
        return;
      }

      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;

      const href = anchor.getAttribute("href");
      if (!href) return;

      // Ignore external tabs, downloads, and protocols
      if (anchor.target === "_blank" || anchor.hasAttribute("download")) return;
      if (
        href.startsWith("http://") ||
        href.startsWith("https://") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#") ||
        href.endsWith(".pdf") ||
        href.startsWith("blob:")
      ) {
        return;
      }

      // Check if URL is internal and distinct from current route
      try {
        const dest = new URL(href, window.location.origin);
        if (dest.origin !== window.location.origin) return;

        // If target is the same path and search without hash, no transition
        if (
          dest.pathname === window.location.pathname &&
          dest.search === window.location.search
        ) {
          return;
        }

        const currentPath = window.location.pathname;

        // 1. Bypass transition when switching between components (/components or /components/*)
        const isComponentSwitch =
          currentPath.startsWith("/components") && dest.pathname.startsWith("/components");

        // 2. Bypass transition when switching between projects (/projects or /projects/*, or legacy /work)
        const isCurrentProject =
          currentPath.startsWith("/projects") || currentPath.startsWith("/work");
        const isDestProject =
          dest.pathname.startsWith("/projects") || dest.pathname.startsWith("/work");
        const isProjectSwitch = isCurrentProject && isDestProject;

        if (isComponentSwitch || isProjectSwitch) {
          // Allow instant native Next.js router navigation without transition screen
          return;
        }

        // Intercept qualifying navigation
        e.preventDefault();
        const originX = e.clientX || window.innerWidth / 2;
        const originY = e.clientY || window.innerHeight / 2;

        startTransition(href, originX, originY);
      } catch {
        // Fallback to default browser navigation if URL parsing fails
      }
    };

    document.addEventListener("click", handleDocumentClick, { capture: true });
    return () => {
      document.removeEventListener("click", handleDocumentClick, { capture: true });
      clearFailsafe();
    };
  }, [startTransition]);

  return (
    <InkTransitionContext.Provider value={{ navigate, pageAnimationReady, prewarmShader }}>
      {children}
      <InkCanvas ref={inkCanvasRef} />
    </InkTransitionContext.Provider>
  );
}
