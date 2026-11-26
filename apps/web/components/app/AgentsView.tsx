"use client";

import { useState } from "react";
import { Bot, Plus, X } from "lucide-react";
import { appContent } from "../../content/app";
import { useAgents } from "../../hooks/useAgents";
import { usePolicy } from "../../hooks/usePolicy";
import { AppLink } from "../../lib/navigation";
import type { Agent } from "../../lib/types";
import { cn, formatCurrency, truncateAddress } from "../../lib/utils";
import AppShell from "./AppShell";
import { CopyButton, LoadingSkeleton, StatusBadge, Toast } from "./AppPrimitives";

function AgentRow({ agent, onFreeze }: { agent: Agent; onFreeze: (agent: Agent) => void }) {
  const { policy } = usePolicy(agent.id);
  return (
    <article className="grid gap-4 rounded-card border border-border bg-surface p-4 shadow-soft md:grid-cols-[1.1fr_1.4fr_.7fr_1fr_auto] md:items-center">
      <div>
        <div className="flex items-center gap-2">
          <p className="font-bold text-ink">{agent.name}</p>
          <StatusBadge status={agent.status} />
        </div>
        <p className="mt-1 text-xs text-muted">{new Date(agent.createdAt).toLocaleDateString()}</p>
      </div>
      <div className="flex min-w-0 items-center gap-2">
        <code className="min-w-0 flex-1 truncate text-xs text-muted">
          {truncateAddress(agent.vaultAddress, 9, 7)}
        </code>
        <CopyButton value={agent.vaultAddress} label={appContent.agents.copyVault} />
      </div>
      <p className="font-bold text-ink">{formatCurrency(agent.balanceUsd)}</p>
      <div className="text-xs leading-5 text-muted">
        {policy ? (
          <>
            <p>
              {formatCurrency(policy.perTxCapUsd)} {appContent.agents.perTransaction}
            </p>
            <p>
              {formatCurrency(policy.dailyCapUsd)} {appContent.agents.perDay}
            </p>
          </>
        ) : (
          <span>{appContent.common.loading}</span>
        )}
      </div>
      <div className="flex gap-2 md:justify-end">
        <AppLink
          href={`/app/agents/${agent.id}`}
          className="inline-flex min-h-11 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-surface"
        >
          {appContent.common.open}
        </AppLink>
        <button
          type="button"
          onClick={() => onFreeze(agent)}
          className="min-h-11 rounded-lg border border-border px-3 text-sm font-semibold text-ink"
        >
          {agent.status === "active" ? appContent.common.freeze : appContent.common.unfreeze}
        </button>
      </div>
    </article>
  );
}

export default function AgentsView() {
  const { agents, loading, createAgent, freezeAgent } = useAgents();
  const [modalOpen, setModalOpen] = useState(false);
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [template, setTemplate] = useState<"conservative" | "balanced" | "custom">("balanced");
  const [amount, setAmount] = useState("");
  const [toast, setToast] = useState<string | null>(null);

  const notify = (message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(null), 2200);
  };

  const finish = async () => {
    await createAgent({ name, balanceUsd: Number(amount) || 0, template });
    setModalOpen(false);
    setStep(0);
    setName("");
    setAmount("");
    notify(appContent.agents.createdToast);
  };

  const toggleFreeze = async (agent: Agent) => {
    await freezeAgent(agent.id, agent.status === "active");
    notify(appContent.agents.frozenToast);
  };

  const createButton = (
    <button
      type="button"
      onClick={() => setModalOpen(true)}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-4 text-sm font-semibold text-surface"
    >
      <Plus aria-hidden="true" size={17} />
      <span className="hidden sm:inline">{appContent.agents.create}</span>
    </button>
  );

  return (
    <AppShell title={appContent.agents.title} activeHref="/app/agents" actions={createButton}>
      {loading ? (
        <LoadingSkeleton rows={3} />
      ) : (
        <div className="space-y-3">
          {agents.map((agent) => (
            <AgentRow key={agent.id} agent={agent} onFreeze={toggleFreeze} />
          ))}
        </div>
      )}

      {modalOpen && (
        <div className="fixed inset-0 z-[70] grid place-items-center p-4">
          <button
            type="button"
            aria-label={appContent.common.close}
            className="absolute inset-0 bg-navy/45"
            onClick={() => setModalOpen(false)}
          />
          <section className="relative w-full max-w-lg rounded-card border border-border bg-surface p-6 shadow-float">
            <button
              type="button"
              aria-label={appContent.common.close}
              onClick={() => setModalOpen(false)}
              className="absolute right-4 top-4 grid size-11 place-items-center rounded-lg text-muted"
            >
              <X aria-hidden="true" size={19} />
            </button>
            <h2 className="text-xl font-bold text-ink">{appContent.agents.modalTitle}</h2>
            <div className="mt-5 flex gap-2">
              {appContent.agents.steps.map((label, index) => (
                <div key={label} className="flex-1">
                  <div
                    className={cn("h-1.5 rounded-pill", index <= step ? "bg-primary" : "bg-border")}
                  />
                  <p className="mt-2 text-xs text-muted">{label}</p>
                </div>
              ))}
            </div>
            <div className="mt-7 min-h-48">
              {step === 0 && (
                <label className="block text-sm font-semibold text-ink">
                  {appContent.agents.nameLabel}
                  <input
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                    placeholder={appContent.agents.namePlaceholder}
                    className="mt-2 min-h-12 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
                  />
                </label>
              )}
              {step === 1 && (
                <div>
                  <p className="text-sm font-semibold text-ink">
                    {appContent.agents.templateLabel}
                  </p>
                  <div className="mt-3 space-y-2">
                    {appContent.agents.templates.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setTemplate(item.id)}
                        className={cn(
                          "w-full rounded-xl border p-4 text-left",
                          template === item.id ? "border-primary bg-primary/5" : "border-border",
                        )}
                      >
                        <span className="font-semibold text-ink">{item.title}</span>
                        <span className="mt-1 block text-xs text-muted">{item.description}</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {step === 2 && (
                <label className="block text-sm font-semibold text-ink">
                  {appContent.agents.amountLabel}
                  <input
                    inputMode="decimal"
                    value={amount}
                    onChange={(event) => setAmount(event.target.value)}
                    placeholder={appContent.agents.amountPlaceholder}
                    className="mt-2 min-h-12 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
                  />
                </label>
              )}
            </div>
            <div className="mt-6 flex justify-between gap-3">
              <button
                type="button"
                disabled={step === 0}
                onClick={() => setStep((current) => Math.max(0, current - 1))}
                className="min-h-11 rounded-lg border border-border px-4 text-sm font-semibold text-ink disabled:opacity-40"
              >
                {appContent.agents.back}
              </button>
              <button
                type="button"
                disabled={step === 0 && !name.trim()}
                onClick={() => (step === 2 ? void finish() : setStep((current) => current + 1))}
                className="min-h-11 rounded-lg bg-primary px-4 text-sm font-semibold text-surface disabled:opacity-40"
              >
                {step === 2 ? appContent.agents.finish : appContent.agents.next}
              </button>
            </div>
          </section>
        </div>
      )}
      <Toast message={toast} />
    </AppShell>
  );
}
