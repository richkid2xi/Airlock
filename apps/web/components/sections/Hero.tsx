import { CSSProperties, useEffect, useState } from "react";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { Button } from "@/components/ui/Button";
import { LogoStrip } from "@/components/sections/LogoStrip";
import { cn } from "@/lib/utils";
import { APP_URL } from "@/content/airlock";

export function Hero() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      requestAnimationFrame(() => setEntered(true));
    });
    return () => cancelAnimationFrame(id);
  }, []);

  // Page-load sequence: headline → subtext → CTA, 70ms apart
  const enter = (i: number, className?: string) => ({
    className: cn(className, "hero-enter", entered && "is-in"),
    style: { "--i": i } as CSSProperties,
  });

  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-scene" aria-hidden="true">
        <div className="hero-sky" />
        <div className="hero-aurora" />
        <div className="hero-grid" />
        <div className="hero-glow" />
      </div>

      <div className="page-shell hero-inner">
        <h1 id="hero-title" {...enter(0, "display-hero hero-title")}>
          Every agent transaction clears the airlock first.
        </h1>

        <p {...enter(1, "text-lead hero-sub")}>
          Airlock simulates, checks, and enforces onchain limits on AI agent wallets, so one poisoned prompt can&apos;t drain your funds.
        </p>

        <div {...enter(2, "hero-actions")}>
          <Button variant="primary" href={APP_URL} className="has-arrow">
            <span>Launch app</span>
            <ArrowIcon />
          </Button>
        </div>
      </div>
      <LogoStrip />
    </section>
  );
}