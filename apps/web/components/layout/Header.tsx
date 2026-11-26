'use client';

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerNavItems } from "@/content/navigation";
import { Logo } from "@/assets/icons/Logo";
import { Button } from "@/components/ui/Button";
import { MobileMenu } from "./MobileMenu";
import { cn } from "@/lib/utils";
import { APP_URL, DEMO_VIDEO_URL } from "@/content/airlock";

export interface HeaderProps {
  isAtTop?: boolean;
}

export function Header({ isAtTop: isAtTopProp }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  const toggleButtonRef = useRef<HTMLButtonElement>(null);
  const [activeHash, setActiveHash] = useState("");
  const [scrolled, setScrolled] = useState(false);

  // Track scroll for glassmorphism + active section highlighting
  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 8);

      const sections = ["use-cases", "modules", "process", "about", "faq", "contact"];
      let current = "";
      for (const id of sections) {
        const element = document.getElementById(id);
        if (element && element.getBoundingClientRect().top < 140) current = `#${id}`;
      }
      setActiveHash(current);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, [pathname]);

  // Transparent over the hero at the top; glass once scrolled or while the menu is open
  const isSolid = scrolled || mobileMenuOpen;

  return (
    <>
      <header className={cn("site-header", isSolid && "is-solid")}>
        <div className="page-shell site-header-inner">
          <Link
            href="/"
            className="flex items-center justify-self-start"
            aria-label="Airlock Home"
            onClick={() => setMobileMenuOpen(false)}
          >
            <Logo />
          </Link>

          <nav aria-label="Primary navigation" className="site-nav">
            {headerNavItems.map((item) => {
              const isActive = activeHash === item.href.replace("/", "");
              return (
                <Link key={item.href} href={item.href} className={cn(isActive && "is-active")}>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="site-header-actions">
            {/* Inverted priority: the white pill is the quieter action */}
            <Button variant="light-sm" href={APP_URL}>
              Launch app
            </Button>
            <Button variant="dark-sm" href={DEMO_VIDEO_URL === "#" ? "#demo" : DEMO_VIDEO_URL}>
              Watch demo
            </Button>

            {/* Accessible Mobile Menu Toggle (44x44px minimum tap target) */}
            <button
              ref={toggleButtonRef}
              type="button"
              className="hamburger-btn"
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-menu"
              aria-label={mobileMenuOpen ? "Close navigation menu" : "Open navigation menu"}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
            >
              <span
                className="flex flex-col justify-center items-center w-6 h-5 gap-1.5"
                aria-hidden="true"
              >
                <span
                  className={cn(
                    "block w-6 h-[2px] rounded-full bg-current transition-all duration-200 ease-out origin-center",
                    mobileMenuOpen && "translate-y-[8px] rotate-45"
                  )}
                />
                <span
                  className={cn(
                    "block w-6 h-[2px] rounded-full bg-current transition-all duration-150 ease-out",
                    mobileMenuOpen && "opacity-0 scale-x-0"
                  )}
                />
                <span
                  className={cn(
                    "block w-6 h-[2px] rounded-full bg-current transition-all duration-200 ease-out origin-center",
                    mobileMenuOpen && "-translate-y-[8px] -rotate-45"
                  )}
                />
              </span>
            </button>
          </div>
        </div>
      </header>

      <MobileMenu
        isOpen={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        toggleButtonRef={toggleButtonRef}
      />
    </>
  );
}