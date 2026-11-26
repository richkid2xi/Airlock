"use client";

import { useEffect, useMemo, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { appContent } from "../../content/app";
import { useAgent } from "../../hooks/useAgent";
import { useFeed } from "../../hooks/useFeed";
import { usePolicy } from "../../hooks/usePolicy";
import { useAppParams } from "../../lib/navigation";
import type { Policy } from "../../lib/types";
import { cn, formatCurrency, formatRelativeTime, truncateAddress } from "../../lib/utils";
import AppShell from "./AppShell";
import {
  ConfirmDialog,
  CopyButton,
  LoadingSkeleton,
  StatusBadge,
  Toast,
  VerdictBadge,
} from "./AppPrimitives";

export default function AgentDetailView() {
  const { id } = useAppParams<"id">();
  const { agent, loading: agentLoading, setFrozen } = useAgent(id);
  const { policy, loading: policyLoading, savePolicy } = usePolicy(id);
  const { events } = useFeed(id ? { agentId: id } : undefined);
  const [tab, setTab] = useState<"Policy" | "Activity">("Policy");
  const [draft, setDraft] = useState<Policy | null>(null);
  const [customProgram, setCustomProgram] = useState("");
  const [destination, setDestination] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    setDraft(policy ? structuredClone(policy) : null);
  }, [policy]);

  const dirty = useMemo(
    () => Boolean(policy && draft && JSON.stringify(policy) !== JSON.stringify(draft)),
    [draft, policy],
  );

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  if (agentLoading || policyLoading) {
    return (
      <AppShell title={appContent.common.loading} activeHref="/app/agents">
        <LoadingSkeleton rows={6} />
      </AppShell>
    );
  }

  if (!agent || !draft) {
    return (
      <AppShell title={appContent.agents.title} activeHref="/app/agents">
        <div className="rounded-card border border-border bg-surface p-8 text-center text-muted">
          {appContent.common.noData}
        </div>
      </AppShell>
    );
  }

  const toggleProgram = (program: string) => {
    setDraft((current) =>
      current
        ? {
            ...current,
            allowedPrograms: current.allowedPrograms.includes(program)
              ? current.allowedPrograms.filter((item) => item !== program)
              : [...current.allowedPrograms, program],
          }
        : current,
    );
  };

  const save = async () => {
    await savePolicy({
      perTxCapUsd: draft.perTxCapUsd,
      dailyCapUsd: draft.dailyCapUsd,
      allowedPrograms: draft.allowedPrograms,
      allowedDestinations: draft.allowedDestinations,
      blockedActions: draft.blockedActions,
      intentCheck: draft.intentCheck,
    });
    notify(appContent.agentDetail.savedToast);
  };

  const freeze = async () => {
    await setFrozen(agent.status === "active");
    setConfirmOpen(false);
    notify(appContent.agents.frozenToast);
  };

  return (
    <AppShell title={agent.name} activeHref="/app/agents">
      <section className="rounded-card border border-border bg-surface p-5 shadow-soft">
        <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-ink">{agent.name}</h2>
              <StatusBadge status={agent.status} />
            </div>
            <div className="mt-4 flex items-center gap-2">
              <code className="text-xs text-muted">
                {truncateAddress(agent.vaultAddress, 12, 9)}
              </code>
              <CopyButton value={agent.vaultAddress} />
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right">
              <p className="text-xs text-muted">{appContent.agentDetail.balance}</p>
              <p className="text-xl font-bold text-ink">{formatCurrency(agent.balanceUsd)}</p>
            </div>
            <button
              type="button"
              onClick={() => setConfirmOpen(true)}
              className={cn(
                "min-h-11 rounded-lg px-4 text-sm font-semibold",
                agent.status === "active" ? "bg-danger text-surface" : "bg-success text-surface",
              )}
            >
              {agent.status === "active"
                ? appContent.agentDetail.killSwitch
                : appContent.agentDetail.unfreeze}
            </button>
          </div>
        </div>
      </section>

      <div className="mt-6 flex gap-1 rounded-xl border border-border bg-surface p-1">
        {appContent.agentDetail.tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={cn(
              "min-h-11 flex-1 rounded-lg px-4 text-sm font-semibold",
              tab === item ? "bg-primary text-surface" : "text-muted",
            )}
          >
            {item}
          </button>
        ))}
      </div>

      {tab === "Policy" ? (
        <div className="mt-6 space-y-5">
          <section className="rounded-card border border-border bg-surface p-5 shadow-soft">
            <h2 className="font-bold text-ink">{appContent.agentDetail.policyTitle}</h2>
            <div className="mt-5 grid gap-6 md:grid-cols-2">
              <CapControl
                label={appContent.agentDetail.perTx}
                value={draft.perTxCapUsd}
                max={5000}
                onChange={(value) => setDraft({ ...draft, perTxCapUsd: value })}
              />
              <CapControl
                label={appContent.agentDetail.daily}
                value={draft.dailyCapUsd}
                max={20000}
                onChange={(value) => setDraft({ ...draft, dailyCapUsd: value })}
              />
            </div>
          </section>

          <section className="rounded-card border border-border bg-surface p-5 shadow-soft">
            <h2 className="font-bold text-ink">{appContent.agentDetail.programs}</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {appContent.agentDetail.programOptions.map((program) => (
                <button
                  key={program}
                  type="button"
                  onClick={() => toggleProgram(program)}
                  className={cn(
                    "min-h-10 rounded-pill border px-3 text-sm font-semibold",
                    draft.allowedPrograms.includes(program)
                      ? "border-primary bg-primary/10 text-primary"
                      : "border-border text-muted",
                  )}
                >
                  {program}
                </button>
              ))}
            </div>
            <div className="mt-4 flex gap-2">
              <input
                value={customProgram}
                onChange={(event) => setCustomProgram(event.target.value)}
                placeholder={appContent.agentDetail.addressPlaceholder}
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                aria-label={appContent.agentDetail.addProgram}
                onClick={() => {
                  if (customProgram.trim()) toggleProgram(customProgram.trim());
                  setCustomProgram("");
                }}
                className="grid size-11 place-items-center rounded-lg bg-primary text-surface"
              >
                <Plus aria-hidden="true" size={18} />
              </button>
            </div>
          </section>

          <section className="rounded-card border border-border bg-surface p-5 shadow-soft">
            <h2 className="font-bold text-ink">{appContent.agentDetail.destinations}</h2>
            <div className="mt-4 space-y-2">
              {draft.allowedDestinations.map((item) => (
                <div
                  key={item}
                  className="flex items-center gap-2 rounded-lg border border-border p-2"
                >
                  <code className="min-w-0 flex-1 truncate text-xs text-muted">{item}</code>
                  <button
                    type="button"
                    aria-label={appContent.common.close}
                    onClick={() =>
                      setDraft({
                        ...draft,
                        allowedDestinations: draft.allowedDestinations.filter(
                          (address) => address !== item,
                        ),
                      })
                    }
                    className="grid size-10 place-items-center rounded-lg text-danger"
                  >
                    <Trash2 aria-hidden="true" size={16} />
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <input
                value={destination}
                onChange={(event) => setDestination(event.target.value)}
                placeholder={appContent.agentDetail.addressPlaceholder}
                className="min-h-11 min-w-0 flex-1 rounded-lg border border-border px-3 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                aria-label={appContent.agentDetail.addDestination}
                onClick={() => {
                  if (destination.trim()) {
                    setDraft({
                      ...draft,
                      allowedDestinations: [...draft.allowedDestinations, destination.trim()],
                    });
                  }
                  setDestination("");
                }}
                className="grid size-11 place-items-center rounded-lg bg-primary text-surface"
              >
                <Plus aria-hidden="true" size={18} />
              </button>
            </div>
          </section>

          <section className="grid gap-5 md:grid-cols-2">
            <div className="rounded-card border border-border bg-surface p-5 shadow-soft">
              <h2 className="font-bold text-ink">{appContent.agentDetail.blockedActions}</h2>
              <div className="mt-4 space-y-3">
                {appContent.agentDetail.actions.map((action) => (
                  <ToggleRow
                    key={action.id}
                    label={action.label}
                    checked={draft.blockedActions.includes(action.id)}
                    onChange={() =>
                      setDraft({
                        ...draft,
                        blockedActions: draft.blockedActions.includes(action.id)
                          ? draft.blockedActions.filter((item) => item !== action.id)
                          : [...draft.blockedActions, action.id],
                      })
                    }
                  />
                ))}
              </div>
            </div>
            <div className="rounded-card border border-border bg-surface p-5 shadow-soft">
              <ToggleRow
                label={appContent.agentDetail.intent}
                checked={draft.intentCheck}
                onChange={() => setDraft({ ...draft, intentCheck: !draft.intentCheck })}
              />
              <p className="mt-3 text-sm leading-6 text-muted">
                {appContent.agentDetail.intentDescription}
              </p>
            </div>
          </section>

          {dirty && (
            <div className="sticky bottom-4 z-20 rounded-card border border-primary/20 bg-surface p-4 shadow-float">
              <div className="flex flex-col gap-4 md:flex-row md:items-center">
                <div className="flex-1 rounded-xl bg-primary/5 p-3">
                  <p className="text-xs font-bold uppercase tracking-wider text-primary">
                    {appContent.agentDetail.summaryTitle}
                  </p>
                  <p className="mt-1 text-sm leading-6 text-ink">
                    {appContent.agentDetail.summaryParts.start} {formatCurrency(draft.perTxCapUsd)}{" "}
                    {appContent.agentDetail.summaryParts.transaction}{" "}
                    {formatCurrency(draft.dailyCapUsd)} {appContent.agentDetail.summaryParts.day}{" "}
                    {draft.allowedPrograms.join(", ")} {appContent.agentDetail.summaryParts.end}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setDraft(structuredClone(policy!))}
                    className="min-h-11 rounded-lg border border-border px-4 text-sm font-semibold text-ink"
                  >
                    {appContent.agentDetail.discard}
                  </button>
                  <button
                    type="button"
                    onClick={() => void save()}
                    className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-surface"
                  >
                    {appContent.agentDetail.savePolicy}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      ) : (
        <section className="mt-6 rounded-card border border-border bg-surface p-5 shadow-soft">
          <h2 className="font-bold text-ink">{appContent.agentDetail.activityTitle}</h2>
          <div className="mt-4 divide-y divide-border">
            {events.length === 0 ? (
              <p className="py-8 text-center text-sm text-muted">
                {appContent.agentDetail.noActivity}
              </p>
            ) : (
              events.map((event) => (
                <div key={event.id} className="flex items-center gap-3 py-3">
                  <VerdictBadge verdict={event.verdict} />
                  <p className="min-w-0 flex-1 truncate text-sm text-ink">{event.intentText}</p>
                  <span className="text-xs text-muted">{formatRelativeTime(event.ts)}</span>
                </div>
              ))
            )}
          </div>
        </section>
      )}

      <ConfirmDialog
        open={confirmOpen}
        title={appContent.agentDetail.confirmFreezeTitle}
        description={appContent.agentDetail.confirmFreezeBody}
        confirmLabel={
          agent.status === "active" ? appContent.common.freeze : appContent.common.unfreeze
        }
        onConfirm={() => void freeze()}
        onClose={() => setConfirmOpen(false)}
      />
      <Toast message={toast} />
    </AppShell>
  );
}

function CapControl({
  label,
  value,
  max,
  onChange,
}: {
  label: string;
  value: number;
  max: number;
  onChange: (value: number) => void;
}) {
  return (
    <label className="block text-sm font-semibold text-ink">
      {label}
      <div className="mt-2 flex items-center gap-3">
        <input
          type="number"
          min="0"
          max={max}
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-h-11 w-28 rounded-lg border border-border px-3 outline-none focus:border-primary"
        />
        <input
          type="range"
          min="0"
          max={max}
          step="50"
          value={value}
          onChange={(event) => onChange(Number(event.target.value))}
          className="min-h-11 min-w-0 flex-1 accent-primary"
        />
      </div>
    </label>
  );
}

function ToggleRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onChange}
      className="flex min-h-11 w-full items-center justify-between gap-4 text-left text-sm font-medium text-ink"
    >
      {label}
      <span
        className={cn(
          "relative h-7 w-12 rounded-pill transition",
          checked ? "bg-primary" : "bg-border",
        )}
      >
        <span
          className={cn(
            "absolute top-1 size-5 rounded-full bg-surface shadow transition",
            checked ? "left-6" : "left-1",
          )}
        />
      </span>
    </button>
  );
}
