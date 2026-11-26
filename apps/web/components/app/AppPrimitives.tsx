"use client";

import { Check, Copy, LoaderCircle, X } from "lucide-react";
import type { ReactNode } from "react";
import { appContent } from "../../content/app";
import type { Agent, TxEvent } from "../../lib/types";
import { cn } from "../../lib/utils";

export function VerdictBadge({ verdict }: { verdict: TxEvent["verdict"] }) {
  const styles = {
    ALLOW: "bg-success/10 text-success",
    BLOCK: "bg-danger/10 text-danger",
    HOLD: "bg-warning/15 text-ink",
  };
  return (
    <span className={cn("rounded-pill px-2.5 py-1 text-xs font-bold", styles[verdict])}>
      {verdict}
    </span>
  );
}

export function StatusBadge({ status }: { status: Agent["status"] }) {
  return (
    <span
      className={cn(
        "rounded-pill px-2.5 py-1 text-xs font-semibold capitalize",
        status === "active" ? "bg-success/10 text-success" : "bg-muted/10 text-muted",
      )}
    >
      {status}
    </span>
  );
}

export function LoadingSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }, (_, index) => (
        <div
          key={index}
          className="h-16 animate-pulse rounded-card border border-border bg-surface"
        />
      ))}
    </div>
  );
}

export function EmptyState({ title, description }: { title: string; description?: string }) {
  return (
    <div className="rounded-card border border-dashed border-border bg-surface px-6 py-12 text-center">
      <p className="font-semibold text-ink">{title}</p>
      {description && <p className="mt-2 text-sm text-muted">{description}</p>}
    </div>
  );
}

export function CopyButton({
  value,
  label = appContent.common.copy,
}: {
  value: string;
  label?: string;
}) {
  const copy = () => void navigator.clipboard?.writeText(value);
  return (
    <button
      type="button"
      aria-label={label}
      onClick={copy}
      className="grid size-10 shrink-0 place-items-center rounded-lg border border-border text-muted transition hover:text-primary"
    >
      <Copy aria-hidden="true" size={15} />
    </button>
  );
}

export function Toast({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-5 right-5 z-[80] flex items-center gap-2 rounded-xl bg-navy px-4 py-3 text-sm font-medium text-surface shadow-float">
      <Check aria-hidden="true" size={17} className="text-success" />
      {message}
    </div>
  );
}

type DialogProps = {
  open: boolean;
  title: string;
  description?: string;
  confirmLabel: string;
  onConfirm: () => void;
  onClose: () => void;
  children?: ReactNode;
};

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel,
  onConfirm,
  onClose,
  children,
}: DialogProps) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[70] grid place-items-center p-4">
      <button
        type="button"
        aria-label={appContent.common.close}
        className="absolute inset-0 bg-navy/45"
        onClick={onClose}
      />
      <div className="relative w-full max-w-md rounded-card border border-border bg-surface p-6 shadow-float">
        <button
          type="button"
          aria-label={appContent.common.close}
          onClick={onClose}
          className="absolute right-4 top-4 grid size-10 place-items-center rounded-lg text-muted"
        >
          <X aria-hidden="true" size={18} />
        </button>
        <h2 className="pr-10 text-lg font-bold text-ink">{title}</h2>
        {description && <p className="mt-2 text-sm leading-6 text-muted">{description}</p>}
        {children}
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="min-h-11 rounded-lg border border-border px-4 text-sm font-semibold text-ink"
          >
            {appContent.common.cancel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-surface"
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Spinner() {
  return <LoaderCircle aria-hidden="true" className="animate-spin text-primary" size={20} />;
}
