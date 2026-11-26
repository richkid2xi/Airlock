"use client";

import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { appContent } from "../../content/app";
import { useAgents } from "../../hooks/useAgents";
import { useApprovals } from "../../hooks/useApprovals";
import type { TxEvent } from "../../lib/types";
import { formatCurrency, formatRelativeTime, truncateAddress } from "../../lib/utils";
import AppShell from "./AppShell";
import { ConfirmDialog, EmptyState, LoadingSkeleton, Toast, VerdictBadge } from "./AppPrimitives";
import TxDetailDrawer from "./TxDetailDrawer";

export default function ApprovalsView() {
  const { held, loading, resolve } = useApprovals();
  const { agents } = useAgents();
  const names = new Map(agents.map((agent) => [agent.id, agent.name]));
  const [selected, setSelected] = useState<TxEvent | null>(null);
  const [decision, setDecision] = useState<"approve" | "reject" | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const confirm = async () => {
    if (!selected || !decision) return;
    await resolve(selected.id, decision);
    setSelected(null);
    setToast(
      decision === "approve"
        ? appContent.approvals.approvedToast
        : appContent.approvals.rejectedToast,
    );
    setDecision(null);
    window.setTimeout(() => setToast(null), 2200);
  };

  return (
    <AppShell title={appContent.approvals.title} activeHref="/app/approvals">
      <p className="mb-5 text-sm text-muted">{appContent.approvals.description}</p>
      {loading ? (
        <LoadingSkeleton rows={4} />
      ) : held.length === 0 ? (
        <EmptyState
          title={appContent.approvals.emptyTitle}
          description={appContent.approvals.emptyBody}
        />
      ) : (
        <div className="grid gap-4 xl:grid-cols-2">
          <AnimatePresence initial={false}>
            {held.map((event) => {
              const effect = event.effects.find((item) => item.delta < 0) ?? event.effects[0];
              return (
                <motion.article
                  layout
                  exit={{ opacity: 0, scale: 0.96 }}
                  key={event.id}
                  className="rounded-card border border-border bg-surface p-5 shadow-soft"
                >
                  <button
                    type="button"
                    onClick={() => setSelected(event)}
                    className="w-full text-left"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-bold text-ink">
                          {names.get(event.agentId) ?? event.agentId}
                        </p>
                        <p className="mt-1 text-xs text-muted">{formatRelativeTime(event.ts)}</p>
                      </div>
                      <VerdictBadge verdict={event.verdict} />
                    </div>
                    <dl className="mt-5 grid gap-4 sm:grid-cols-2">
                      <div>
                        <dt className="text-xs font-semibold text-muted">
                          {appContent.approvals.amount}
                        </dt>
                        <dd className="mt-1 font-bold text-ink">
                          {formatCurrency(Math.abs(effect?.delta ?? 0))}
                        </dd>
                      </div>
                      <div>
                        <dt className="text-xs font-semibold text-muted">
                          {appContent.approvals.destination}
                        </dt>
                        <dd className="mt-1 truncate font-mono text-xs text-ink">
                          {truncateAddress(effect?.counterparty ?? "", 8, 6)}
                        </dd>
                      </div>
                    </dl>
                    <div className="mt-4 rounded-xl bg-warning/10 p-3">
                      <p className="text-xs font-bold text-ink">{appContent.approvals.risk}</p>
                      <p className="mt-1 text-sm text-muted">{event.reason}</p>
                    </div>
                  </button>
                  <div className="mt-5 flex gap-3">
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(event);
                        setDecision("approve");
                      }}
                      className="min-h-11 flex-1 rounded-lg bg-success px-4 text-sm font-semibold text-surface"
                    >
                      {appContent.common.approve}
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setSelected(event);
                        setDecision("reject");
                      }}
                      className="min-h-11 flex-1 rounded-lg bg-danger px-4 text-sm font-semibold text-surface"
                    >
                      {appContent.common.reject}
                    </button>
                  </div>
                </motion.article>
              );
            })}
          </AnimatePresence>
        </div>
      )}
      <ConfirmDialog
        open={decision !== null}
        title={
          decision === "approve"
            ? appContent.approvals.confirmApprove
            : appContent.approvals.confirmReject
        }
        confirmLabel={decision === "approve" ? appContent.common.approve : appContent.common.reject}
        onConfirm={() => void confirm()}
        onClose={() => setDecision(null)}
      />
      <TxDetailDrawer
        event={decision ? null : selected}
        agentName={selected ? (names.get(selected.agentId) ?? selected.agentId) : ""}
        onClose={() => setSelected(null)}
      />
      <Toast message={toast} />
    </AppShell>
  );
}
