"use client";

import { useEffect, useRef } from "react";

export interface UseFocusTrapOptions<T extends HTMLElement = HTMLElement> {
  /** Whether the focus trap is currently active (e.g. dialog is open) */
  isActive: boolean;
  /** Callback invoked when the user presses Escape */
  onClose?: () => void;
  /** Optional ref to the element that should receive initial focus when activated */
  initialFocusRef?: React.RefObject<HTMLElement | null>;
  /** Optional explicit element or ref to restore focus to when deactivated */
  returnFocusRef?: React.RefObject<HTMLElement | null> | HTMLElement | null;
  /** Optional existing container ref (if not provided, a ref is created and returned) */
  containerRef?: React.RefObject<T | null>;
  /** Whether to mark outside elements as inert and aria-hidden while active (default: true) */
  setInertBackground?: boolean;
  /** Whether to lock document body scrolling while active (default: true) */
  lockScroll?: boolean;
}

const FOCUSABLE_SELECTOR = [
  'a[href]:not([tabindex="-1"]):not([disabled])',
  'button:not([disabled]):not([tabindex="-1"])',
  'textarea:not([disabled]):not([tabindex="-1"])',
  'input:not([disabled]):not([tabindex="-1"])',
  'select:not([disabled]):not([tabindex="-1"])',
  '[tabindex]:not([tabindex="-1"]):not([disabled])',
  '[contenteditable="true"]:not([tabindex="-1"])',
].join(", ");

export function getFocusableElements(container: HTMLElement): HTMLElement[] {
  const elements = Array.from(
    container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
  );
  return elements.filter((el) => {
    return (
      (el.offsetWidth > 0 || el.offsetHeight > 0 || el.getClientRects().length > 0) &&
      window.getComputedStyle(el).visibility !== "hidden"
    );
  });
}

export function useFocusTrap<T extends HTMLElement = HTMLDivElement>({
  isActive,
  onClose,
  initialFocusRef,
  returnFocusRef,
  containerRef: externalContainerRef,
  setInertBackground = true,
  lockScroll = true,
}: UseFocusTrapOptions<T>): React.RefObject<T> {
  const internalContainerRef = useRef<T>(null);
  const containerRef = (externalContainerRef || internalContainerRef) as React.RefObject<T>;
  const previousActiveElementRef = useRef<HTMLElement | null>(null);

  // Store trigger element when trap becomes active
  useEffect(() => {
    if (isActive) {
      if (returnFocusRef) {
        if ("current" in returnFocusRef) {
          previousActiveElementRef.current = returnFocusRef.current;
        } else {
          previousActiveElementRef.current = returnFocusRef;
        }
      } else if (
        typeof document !== "undefined" &&
        document.activeElement &&
        document.activeElement instanceof HTMLElement
      ) {
        previousActiveElementRef.current = document.activeElement;
      }
    }
  }, [isActive, returnFocusRef]);

  // Initial focus management
  useEffect(() => {
    if (!isActive) return;

    let timeoutId: ReturnType<typeof setTimeout>;

    const setInitialFocus = () => {
      const container = containerRef.current;
      if (!container) return;

      if (initialFocusRef?.current) {
        initialFocusRef.current.focus();
        return;
      }

      const focusable = getFocusableElements(container);
      if (focusable.length > 0) {
        focusable[0].focus();
      } else {
        if (!container.hasAttribute("tabindex")) {
          container.setAttribute("tabindex", "-1");
        }
        container.focus();
      }
    };

    // RAF + small timeout ensures portaled / animated elements have fully mounted in the DOM
    const rafId = requestAnimationFrame(() => {
      setInitialFocus();
      timeoutId = setTimeout(() => {
        const container = containerRef.current;
        if (
          container &&
          typeof document !== "undefined" &&
          document.activeElement &&
          !container.contains(document.activeElement)
        ) {
          setInitialFocus();
        }
      }, 30);
    });

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timeoutId);
    };
  }, [isActive, initialFocusRef, containerRef]);

  // Body scroll locking
  useEffect(() => {
    if (!isActive || !lockScroll || typeof document === "undefined") return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [isActive, lockScroll]);

  // Keyboard navigation trap (Tab / Shift+Tab) & Escape dismiss
  useEffect(() => {
    if (!isActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        e.stopPropagation();
        onClose?.();
        return;
      }

      if (e.key !== "Tab") return;

      const container = containerRef.current;
      if (!container) return;

      const focusable = getFocusableElements(container);
      if (focusable.length === 0) {
        e.preventDefault();
        container.focus();
        return;
      }

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = (typeof document !== "undefined" ? document.activeElement : null) as HTMLElement | null;

      if (e.shiftKey) {
        // Shift + Tab: wrap to last if currently on first or outside container
        if (!active || active === first || !container.contains(active)) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // Tab: wrap to first if currently on last or outside container
        if (!active || active === last || !container.contains(active)) {
          e.preventDefault();
          first.focus();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown, { capture: true });
    return () => {
      window.removeEventListener("keydown", handleKeyDown, { capture: true });
    };
  }, [isActive, onClose, containerRef]);

  // Enforce boundary containment if focus somehow leaves the dialog
  useEffect(() => {
    if (!isActive || typeof document === "undefined") return;

    const handleFocusIn = (e: FocusEvent) => {
      const container = containerRef.current;
      if (!container) return;

      if (!container.contains(e.target as Node)) {
        e.preventDefault();
        const focusable = getFocusableElements(container);
        if (focusable.length > 0) {
          focusable[0].focus();
        } else {
          container.focus();
        }
      }
    };

    document.addEventListener("focusin", handleFocusIn);
    return () => {
      document.removeEventListener("focusin", handleFocusIn);
    };
  }, [isActive, containerRef]);

  // Background inertness
  useEffect(() => {
    if (!isActive || !setInertBackground || typeof document === "undefined") return;

    const container = containerRef.current;
    if (!container) return;

    // Locate the top-level ancestor of container that is a direct child of document.body
    let topAncestor: HTMLElement | null = container;
    while (topAncestor && topAncestor.parentElement !== document.body) {
      topAncestor = topAncestor.parentElement;
    }

    if (!topAncestor) return;

    const affectedElements: HTMLElement[] = [];
    const prevInertMap = new Map<HTMLElement, string | null>();
    const prevAriaHiddenMap = new Map<HTMLElement, string | null>();

    Array.from(document.body.children).forEach((child) => {
      if (
        child instanceof HTMLElement &&
        child !== topAncestor &&
        child.tagName !== "SCRIPT" &&
        child.tagName !== "STYLE"
      ) {
        affectedElements.push(child);
        prevInertMap.set(child, child.getAttribute("inert"));
        prevAriaHiddenMap.set(child, child.getAttribute("aria-hidden"));

        child.setAttribute("inert", "");
        child.setAttribute("aria-hidden", "true");
      }
    });

    return () => {
      affectedElements.forEach((el) => {
        const prevInert = prevInertMap.get(el);
        if (prevInert !== null && prevInert !== undefined) {
          el.setAttribute("inert", prevInert);
        } else {
          el.removeAttribute("inert");
        }

        const prevHidden = prevAriaHiddenMap.get(el);
        if (prevHidden !== null && prevHidden !== undefined) {
          el.setAttribute("aria-hidden", prevHidden);
        } else {
          el.removeAttribute("aria-hidden");
        }
      });
    };
  }, [isActive, setInertBackground, containerRef]);

  // Restore focus to trigger element on deactivation / unmount
  useEffect(() => {
    return () => {
      const elToRestore = previousActiveElementRef.current;
      if (
        elToRestore &&
        typeof elToRestore.focus === "function" &&
        typeof document !== "undefined" &&
        document.body.contains(elToRestore)
      ) {
        requestAnimationFrame(() => {
          elToRestore.focus();
        });
      }
    };
  }, []);

  // When isActive transitions from true -> false while mounted, restore focus
  const prevIsActiveRef = useRef(isActive);
  useEffect(() => {
    if (prevIsActiveRef.current && !isActive) {
      const elToRestore = previousActiveElementRef.current;
      if (
        elToRestore &&
        typeof elToRestore.focus === "function" &&
        typeof document !== "undefined" &&
        document.body.contains(elToRestore)
      ) {
        requestAnimationFrame(() => {
          elToRestore.focus();
        });
      }
    }
    prevIsActiveRef.current = isActive;
  }, [isActive]);

  return containerRef;
}
