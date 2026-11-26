import { useEffect, useRef, useState } from "react";

export type LegalModalType = "privacy" | "terms";

export interface LegalModalProps {
  type: LegalModalType | null;
  isOpen: boolean;
  onClose: () => void;
}

export function LegalModal({ type, isOpen, onClose }: LegalModalProps) {
  const modalRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    if (!isOpen) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        onClose();
        return;
      }
      if (event.key === "Tab" && modalRef.current) {
        const focusable = modalRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        );
        if (focusable.length === 0) return;
        const first = focusable[0];
        const last = focusable[focusable.length - 1];
        if (event.shiftKey && document.activeElement === first) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && document.activeElement === last) {
          event.preventDefault();
          first.focus();
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    closeButtonRef.current?.focus();
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !type) return null;

  const updateProgress = (target: HTMLDivElement) => {
    const max = target.scrollHeight - target.clientHeight;
    setProgress(max > 0 ? (target.scrollTop / max) * 100 : 100);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="legal-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6"
    >
      <div
        className="fixed inset-0 bg-[#05111f]/80 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={modalRef}
        className="relative z-10 flex max-h-[85vh] w-full max-w-[800px] flex-col overflow-hidden rounded-[var(--radius-card)] border border-[var(--border-subtle)] bg-[#101015] text-[var(--text-primary)] shadow-2xl"
      >
        <div className="sticky top-0 z-10 border-b border-[var(--border-subtle)] bg-[#101015] px-6 py-5">
          <div className="flex items-center justify-between">
            <h2 id="legal-modal-title" className="text-2xl">
              {type === "privacy" ? "Privacy Policy" : "Terms of Service"}
            </h2>
            <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Close" className="min-h-11 rounded-full border border-[var(--border-subtle)] px-4">
              Close
            </button>
          </div>
          <div className="mt-4 h-px bg-[var(--border-subtle)]"><div className="h-px bg-[var(--color-signal)]" style={{ width: `${progress}%` }} /></div>
        </div>
        <div className="overflow-y-auto px-6 py-6 text-sm leading-7 text-[var(--color-muted)]" onScroll={(event) => updateProgress(event.currentTarget)}>
          {type === "privacy" ? (
            <>
              <h3>Prototype and data</h3><p>Airlock is a hackathon prototype running on simulated data. It uses no accounts, no trackers, and no real funds.</p>
              <h3>Contact form</h3><p>The contact form validates locally and does not send data anywhere.</p>
              <h3>Cookies and analytics</h3><p>Airlock does not set cookies or run analytics. If analytics or hosting logs exist on a deployment host, they are the host&apos;s responsibility, not Airlock&apos;s.</p>
              <h3>Wallet connections</h3><p>Wallet connections, if used, are handled by the user&apos;s wallet. Airlock never receives private keys.</p>
              <h3>Network scope</h3><p>Any prototype wallet integration targets devnet and must not be used with real funds.</p>
              <p>Contact placeholder: none configured.</p><p>Effective date: 2026-11-24.</p>
            </>
          ) : (
            <>
              <h3>As-is prototype</h3><p>Airlock is provided as-is with no warranty. It is an unaudited hackathon prototype and must not be used for production or mainnet operations.</p>
              <h3>No real funds</h3><p>No real funds or financial assets should be connected to this demo.</p>
              <h3>Not advice</h3><p>Nothing in Airlock constitutes financial, security, or legal advice.</p>
              <h3>Your responsibility</h3><p>You are responsible for anything you choose to connect or execute.</p>
              <h3>Limitation of liability</h3><p>To the fullest extent permitted by applicable law, the maintainers are not liable for losses arising from use of this prototype.</p>
              <h3>Open-source context</h3><p>This project is a hackathon and open-development prototype. Features may change.</p>
              <h3>Governing law</h3><p>Governing law is to be defined.</p><p>Effective date: 2026-11-24.</p>
            </>
          )}
        </div>
        <div className="sticky bottom-0 flex items-center justify-between border-t border-[var(--border-subtle)] bg-[#101015] px-6 py-4">
          <small>Effective 2026-11-24</small>
          <button type="button" onClick={onClose} className="min-h-11 rounded-full bg-white px-5 text-[#050507]">Close</button>
        </div>
      </div>
    </div>
  );
}
