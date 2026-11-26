import { CSSProperties, useState, useEffect, useRef, useCallback } from "react";
import { processSteps } from "@/content/process";
import { Container } from "@/components/layout/Container";
import { SectionHeader } from "@/components/layout/Section";
import { cn } from "@/lib/utils";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const STEP_INTERVAL = 4000; // 4 seconds per step for gentle pacing

const deliverables = [
  "Intent captured",
  "Effects extracted",
  "Allow, block or hold",
  "Onchain enforcement",
];

export function Process() {
  const [active, setActive] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Advance to next step
  const nextStep = useCallback(() => {
    setActive((prev) => (prev + 1) % processSteps.length);
  }, []);

  // Gentle autoplay when visible and not paused by user hover/touch
  useEffect(() => {
    if (prefersReducedMotion || isPaused) return;

    let isVisible = true;
    const el = sectionRef.current;

    if (el && typeof IntersectionObserver !== "undefined") {
      const observer = new IntersectionObserver(
        ([entry]) => {
          isVisible = entry.isIntersecting;
        },
        { threshold: 0.15 }
      );
      observer.observe(el);

      const timer = setInterval(() => {
        if (isVisible) {
          nextStep();
        }
      }, STEP_INTERVAL);

      return () => {
        clearInterval(timer);
        observer.disconnect();
      };
    }

    const timer = setInterval(nextStep, STEP_INTERVAL);
    return () => clearInterval(timer);
  }, [isPaused, nextStep, prefersReducedMotion]);

  const isPlaying = !prefersReducedMotion && !isPaused;

  return (
    <section
      id="process"
      ref={sectionRef}
      className="section reveal"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onTouchStart={() => setIsPaused(true)}
      aria-labelledby="approach-title"
    >
      <Container>
        <SectionHeader
          id="approach-title"
          title="Every transaction takes the same four steps."
          intro="From the agent's request to onchain execution, nothing skips a stage."
          className="reveal-child"
        />

        <div className="panel panel-list reveal-child">
          <div
            className="process-grid"
            style={{ "--step-duration": `${STEP_INTERVAL}ms` } as CSSProperties}
          >
            {processSteps.map((step, i) => {
              const isActive = i === active;
              return (
                <button
                  key={step.step}
                  type="button"
                  onClick={() => {
                    setActive(i);
                    setIsPaused(true);
                  }}
                  className={cn(
                    "process-card",
                    isActive && "is-active",
                    isActive && isPlaying && "is-playing"
                  )}
                  aria-pressed={isActive}
                >
                  <span className="process-card-progress" aria-hidden="true">
                    <span />
                  </span>

                  <span className="process-card-top">
                    <span className="process-step-pill">{step.step}</span>
                    <span className="text-caption">{step.title}</span>
                  </span>

                  <span className="heading-item">{step.short}</span>
                  <span className="text-small">{step.description}</span>

                  <span className="process-deliverable">
                    <span className="status-dot" aria-hidden="true" />
                    {deliverables[i]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </Container>
    </section>
  );
}
