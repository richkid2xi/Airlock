'use client';

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { headerNavItems } from "@/content/navigation";
import { ArrowIcon } from "@/assets/icons/ArrowIcon";
import { siteConfig } from "@/content/site";
import { APP_URL, DEMO_VIDEO_URL } from "@/content/airlock";

export interface MobileMenuProps {
  isOpen: boolean;
  onClose: () => void;
  toggleButtonRef: React.RefObject<HTMLButtonElement | null>;
}

export function MobileMenu({ isOpen, onClose, toggleButtonRef }: MobileMenuProps) {
  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  const [isRendered, setIsRendered] = useState(isOpen);
  const [isClosing, setIsClosing] = useState(false);
  const pathname = usePathname();
  const menuRef = useRef<HTMLDivElement>(null);

  // Synchronize enter/exit transitions during render per React 19 guidelines
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    if (isOpen) {
      setIsRendered(true);
      setIsClosing(false);
    } else if (isRendered) {
      setIsClosing(true);
    }
  }

  // Manage exit timer after closing animation completes
  useEffect(() => {
    if (isClosing) {
      const timer = setTimeout(() => {
        setIsRendered(false);
        setIsClosing(false);
      }, 250);
      return () => clearTimeout(timer);
    }
  }, [isClosing]);

  // Close when pathname changes
  useEffect(() => {
    if (isOpen) {
      onClose();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll, trap focus, handle Escape key, and restore focus on close
  useEffect(() => {
    if (!isRendered) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }

      if (event.key === "Tab" && menuRef.current) {
        const focusableElements = menuRef.current.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, textarea, select, [tabindex]:not([tabindex="-1"])'
        );
        if (focusableElements.length === 0) return;

        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];

        if (event.shiftKey) {
          if (document.activeElement === firstElement) {
            event.preventDefault();
            lastElement.focus();
          }
        } else {
          if (document.activeElement === lastElement) {
            event.preventDefault();
            firstElement.focus();
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    // Focus the first focusable link inside menu on open
    const timer = setTimeout(() => {
      const firstFocusable = menuRef.current?.querySelector<HTMLElement>("a, button");
      firstFocusable?.focus();
    }, 50);

    const toggleBtn = toggleButtonRef.current;

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      clearTimeout(timer);
      if (!isOpen) {
        toggleBtn?.focus();
      }
    };
  }, [isRendered, isOpen, onClose, toggleButtonRef]);

  if (!isRendered) return null;

  return (
    <div
      id="mobile-menu"
      ref={menuRef}
      role="dialog"
      aria-modal="true"
      aria-label="Mobile Navigation Menu"
      className={`mobile-menu-drawer custom-scrollbar lg:hidden ${isClosing ? "is-closing" : ""}`}
    >
      <div className="flex flex-col pt-2">
        <nav aria-label="Mobile Navigation Links" className="flex flex-col">
          {headerNavItems.map((item, index) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                style={{ animationDelay: `${index * 40}ms` }}
                className={`mobile-menu-link ${isActive ? "is-active" : ""}`}
              >
                <span>{item.label}</span>
                <ArrowIcon className="h-5 w-5" />
              </Link>
            );
          })}
        </nav>

        <div className="flex flex-col gap-3 pt-8">
          <Link href={APP_URL} onClick={onClose} className="button button-primary w-full has-arrow">
            <span>Launch app</span>
            <ArrowIcon />
          </Link>
          <a href={DEMO_VIDEO_URL === "#" ? "#projects" : DEMO_VIDEO_URL} className="button button-secondary w-full">
            Watch demo
          </a>
        </div>
      </div>

      <div className="pt-8 pb-4">
        <p className="text-caption">{siteConfig.tagline}</p>
      </div>
    </div>
  );
}
