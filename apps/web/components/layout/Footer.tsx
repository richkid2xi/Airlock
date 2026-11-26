'use client';

import { useEffect, useState } from "react";
import Link from "next/link";
import { footerSections, legalLinks } from "@/content/navigation";
import { siteConfig } from "@/content/site";
import { Logo } from "@/assets/icons/Logo";
import { CloudSignoff } from "@/assets/illustrations/CloudSignoff";
import { LegalModal, LegalModalType } from "@/components/ui/LegalModal";
import { Container } from "./Container";
import { CONTACT_EMAIL, GITHUB_URL } from "@/content/airlock";

export function Footer() {
  const currentYear = new Date().getFullYear();
  const [activeModal, setActiveModal] = useState<LegalModalType | null>(null);

  useEffect(() => {
    const openHashModal = () => {
      if (window.location.hash === "#privacy") setActiveModal("privacy");
      if (window.location.hash === "#terms") setActiveModal("terms");
    };
    openHashModal();
    window.addEventListener("hashchange", openHashModal);
    return () => window.removeEventListener("hashchange", openHashModal);
  }, []);

  return (
    <>
      <footer className="site-footer">
        <Container>
          <div className="footer-grid">
            <div>
              <Link href="/" className="inline-block mb-5" aria-label="Airlock Home">
                <Logo />
              </Link>
              <p className="text-small max-w-[320px]">{siteConfig.tagline}</p>
              <div className="mt-8 footer-link-list">
                <span className="footer-col-title !mb-1">Direct inquiries</span>
                {CONTACT_EMAIL && <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>}
              </div>
            </div>

            {footerSections.map((section) => (
              <div key={section.title}>
                <span className="footer-col-title">{section.title}</span>
                <div className="footer-link-list">
                  {section.links.map((link) => {
                    const isInternal = link.href.startsWith("/") && !link.href.startsWith("//");
                    if (isInternal) {
                      return (
                        <Link key={link.label} href={link.href}>
                          {link.label}
                        </Link>
                      );
                    }
                    return (
                      <a key={link.label} href={link.href}>
                        {link.label}
                      </a>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>

          <div id="footer-legal" className="footer-bottom">
            <p className="m-0">
              © {currentYear} {siteConfig.name}. Built for the Dev Pack 3 hackathon. Demo uses simulated data.
            </p>
            <div className="flex gap-6">
              {GITHUB_URL !== "#" && (
                <a href={GITHUB_URL}>GitHub</a>
              )}
              {GITHUB_URL === "#" && (
                <button type="button" onClick={() => window.dispatchEvent(new CustomEvent("airlock-toast", { detail: "Coming soon" }))}>GitHub</button>
              )}
              {legalLinks.map((link) => (
                <button
                  key={link.label}
                  type="button"
                  onClick={() => {
                    setActiveModal(link.href === "#privacy" ? "privacy" : "terms");
                    window.history.replaceState(null, "", link.href);
                  }}
                  className="cursor-pointer border-0 bg-transparent p-0 text-[13px] text-[var(--text-tertiary)] transition-colors hover:text-white"
                >
                  {link.label}
                </button>
              ))}
            </div>
          </div>
        </Container>

        {/* Ambient cloud & atmospheric signoff placed safely below content with zero overlap */}
        <div className="footer-signoff-wrap" aria-hidden="true">
          <CloudSignoff className="footer-cloud-bg" />
          <p className="footer-wordmark">Airlock</p>
        </div>
      </footer>
      <LegalModal
        type={activeModal}
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
      />
    </>
  );
}
