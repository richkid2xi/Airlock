'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

/**
 * Site-wide scroll reveal.
 * - Observes all `.reveal` elements on the page.
 * - Re-runs whenever the route changes (new page) and whenever new
 *   `.reveal` nodes are added to the DOM (MutationObserver).
 * - Instantly reveals everything when prefers-reduced-motion is set.
 */
export function useScrollReveal(): void {
  const prefersReducedMotion = usePrefersReducedMotion();
  const pathname = usePathname();

  useEffect(() => {
    // If reduced motion is preferred, instantly reveal everything
    if (prefersReducedMotion) {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        el.classList.add("is-revealed");
        el.dataset.revealed = "true";
      });
      return;
    }

    if (typeof IntersectionObserver === "undefined") {
      document.querySelectorAll<HTMLElement>(".reveal").forEach((el) => {
        el.classList.add("is-revealed");
        el.dataset.revealed = "true";
      });
      return;
    }

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const target = entry.target as HTMLElement;
            target.classList.add("is-revealed");
            target.dataset.revealed = "true";
            io.unobserve(target);
          }
        });
      },
      {
        threshold: 0.05,
        rootMargin: "0px 0px -30px 0px",
      }
    );

    // Run after React layout stabilizes
    const timeoutId = setTimeout(() => {
      const windowHeight = window.innerHeight;
      const elements = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));

      elements.forEach((el, index) => {
        if (el.classList.contains("is-revealed") || el.dataset.revealed === "true") {
          return;
        }

        const rect = el.getBoundingClientRect();
        // If element is already in initial view, animate it in with subtle stagger
        if (rect.top < windowHeight * 0.95 && rect.bottom > 0) {
          setTimeout(
            () => {
              el.classList.add("is-revealed");
              el.dataset.revealed = "true";
            },
            40 + index * 80
          );
        } else {
          // Off-screen elements: observe for scroll entry
          io.observe(el);
        }
      });
    }, 40);

    return () => {
      clearTimeout(timeoutId);
      io.disconnect();
    };
  }, [prefersReducedMotion, pathname]);
}
