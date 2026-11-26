'use client';

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, CheckCircle, Loader2, Router, ShieldCheck, Wallet } from "lucide-react";
import { useAgents } from "../../hooks/useAgents";
import { truncateAddress } from "@/lib/utils";

const STEPS = [
  { id: "workspace", title: "Create workspace", body: "Name your workspace and create the first policy set.", icon: Router },
  { id: "fund", title: "Fund vault", body: "Mock vault funded automatically in demo mode.", icon: ShieldCheck },
  { id: "wallet", title: "Link wallet", body: "Connect a Solana wallet so the demo can attribute activity to an owner.", icon: Wallet },
  { id: "agent", title: "Invite agent", body: "Generate an API key for your first AI agent.", icon: CheckCircle },
];

const QUICK_AMOUNTS = [10, 50, 100, 500];

export function OnboardingView() {
  const router = useRouter();
  const { createAgent } = useAgents();
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [creating, setCreating] = useState(false);

  const completedSteps = step;

  const finish = async () => {
    setCreating(true);
    await createAgent({ name, balanceUsd: Number(amount) || 0, template: "balanced" });
    router.push("/app");
  };

  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col items-center justify-center px-6 py-12">
      <div className="w-full rounded-card border border-border bg-surface p-8 shadow-soft">
        <div className="space-y-2 md:space-y-6">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold text-ink">Onboarding</h1>
            <span className="text-xs font-semibold text-primary">
              {step + 1} of {STEPS.length}
            </span>
          </div>
          <div className="space-y-2">
            {STEPS.map((s, i) => (
              <div key={s.id} className="flex items-start gap-3">
                <div
                  className={`grid size-7 shrink-0 place-items-center rounded-full border px-1 text-xs font-semibold transition ${
                    i < completedSteps ? "bg-success text-success" : "border-border text-muted"
                  }`}
                >
                  {i < completedSteps ? <CheckCircle size={10} /> : String(i + 1)}
                </div>
                <div>
                  <p className="font-semibold text-ink">{s.title}</p>
                  <p className="text-xs text-muted">{s.body}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-8 space-y-4 rounded-xl border border-border bg-sky/5 p-5">
            {step === 0 && (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-4">
                  <Router aria-hidden="true" size={16} /> Create workspace
                </div>
                <label className="block text-sm font-semibold text-ink">
                  Name
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. AirLock Startup"
                    className="mt-2 min-h-12 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
                  />
                </label>
              </>
            )}
            {step === 1 && (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-4">
                  <ShieldCheck aria-hidden="true" size={16} /> Fund vault
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="rounded-pill bg-success/15 px-2 py-0.5 text-[11px] font-semibold text-success">USDC (devnet)</span>
                  <span className="text-xs text-muted">Mock vault funded automatically in demo mode.</span>
                </div>
                <label className="block text-sm font-semibold text-ink">
                  Amount
                  <div className="relative mt-2">
                    <input
                      inputMode="decimal"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.00"
                      className="min-h-12 w-full rounded-lg border border-border bg-surface pl-3 pr-16 outline-none focus:border-primary"
                    />
                    <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs font-semibold text-muted">USDC</span>
                  </div>
                </label>
                <div className="flex gap-2">
                  {QUICK_AMOUNTS.map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setAmount(String(v))}
                      className="min-h-9 flex-1 rounded-lg border border-border bg-surface px-2 text-xs font-semibold text-ink hover:border-primary hover:text-primary"
                    >
                      {v}
                    </button>
                  ))}
                </div>
                <p className="text-[11px] text-muted">1 USDC ≈ $1</p>
                <div className="rounded-lg border border-border bg-surface px-3 py-2 text-xs text-muted">
                  <div className="flex justify-between">
                    <span>Gas (read-only)</span>
                    <span className="font-semibold text-ink">0.001 SOL</span>
                  </div>
                  <div className="mt-1 flex justify-between">
                    <span>Current balance</span>
                    <span className="font-semibold text-ink">{amount || "0.00"} USDC</span>
                  </div>
                </div>
                <p className="text-[11px] text-muted">
                  Need test funds? Visit the devnet faucet to request mock USDC.
                </p>
              </>
            )}
            {step === 2 && (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-4">
                  <Wallet aria-hidden="true" size={16} /> Link wallet
                </div>
                <p className="text-sm text-muted">
                  Your demo wallet is ready: {truncateAddress("5VtQ2ZkRx...")}
                </p>
              </>
            )}
            {step === 3 && (
              <>
                <div className="flex items-center gap-2 text-sm font-semibold text-ink mb-4">
                  <CheckCircle aria-hidden="true" size={16} /> Invite agent
                </div>
                <p className="text-sm text-muted">Create your first agent to activate policy enforcement.</p>
                <button
                  type="button"
                  onClick={() => void finish()}
                  disabled={creating || !name.trim()}
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-surface disabled:opacity-40"
                >
                  {creating ? <Loader2 size={16} aria-hidden="true" className="animate-spin" /> : <ArrowRight size={16} aria-hidden="true" />}
                  {creating ? "Creating..." : "Create agent"}
                </button>
              </>
            )}
          </div>

          <div className="mt-8 flex items-center justify-between">
            <button
              type="button"
              onClick={() => setStep((s) => Math.max(0, s - 1))}
              disabled={step === 0}
              className="min-h-11 rounded-lg border border-border px-4 text-sm font-semibold text-ink disabled:opacity-40"
            >
              Back
            </button>
            <button
              type="button"
              disabled={
                creating ||
                (step === 0 && !name.trim()) ||
                (step === 1 && !amount.trim())
              }
              onClick={() =>
                step === STEPS.length - 1 ? void finish() : setStep((s) => Math.min(STEPS.length - 1, s + 1))
              }
              className="min-h-11 rounded-lg bg-primary px-5 text-sm font-semibold text-surface disabled:opacity-40"
            >
              {step === STEPS.length - 1 ? "Finish" : "Next"}
              <ArrowRight size={14} aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}