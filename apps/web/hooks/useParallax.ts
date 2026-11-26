import { useEffect, useRef } from "react";
import { usePrefersReducedMotion } from "./usePrefersReducedMotion";

export interface ParallaxOptions {
  speed?: number;
  scale?: number;
  clamp?: boolean;
  maxOffset?: number;
  lerp?: number;
}

/**
 * Performant, ref-driven parallax hook with hardware acceleration and smooth lerp inertia.
 * Mutates the DOM directly to avoid triggering React re-renders on scroll frames.
 */
export function useParallax<T extends HTMLElement = HTMLDivElement>(options: ParallaxOptions = {}) {
  const { speed = -0.22, scale, clamp = true, maxOffset = 160, lerp = 0.12 } = options;

  const ref = useRef<T>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useEffect(() => {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;

    let isVisible = true;
    let targetY = 0;
    let currentY = 0;
    let rafId: number | null = null;
    let isRunning = false;

    const io = new IntersectionObserver(
      ([entry]) => {
        isVisible = entry.isIntersecting;
        if (isVisible && !isRunning) {
          isRunning = true;
          rafId = requestAnimationFrame(loop);
        }
      },
      { rootMargin: "80px" }
    );
    io.observe(el);

    const onScroll = () => {
      const scrollY = window.scrollY;
      let raw = scrollY * speed;
      if (clamp) {
        raw = Math.max(-maxOffset, Math.min(maxOffset, raw));
      }
      targetY = raw;
      if (isVisible && !isRunning) {
        isRunning = true;
        rafId = requestAnimationFrame(loop);
      }
    };

    const loop = () => {
      const diff = targetY - currentY;
      if (Math.abs(diff) > 0.05) {
        currentY += diff * lerp;
      } else {
        currentY = targetY;
      }

      const transformStr = scale
        ? `translate3d(0, ${currentY.toFixed(2)}px, 0) scale(${scale})`
        : `translate3d(0, ${currentY.toFixed(2)}px, 0)`;

      el.style.transform = transformStr;

      if (isVisible && Math.abs(diff) > 0.05) {
        rafId = requestAnimationFrame(loop);
      } else {
        isRunning = false;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      io.disconnect();
      window.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [speed, scale, clamp, maxOffset, lerp, prefersReducedMotion]);

  return ref;
}
