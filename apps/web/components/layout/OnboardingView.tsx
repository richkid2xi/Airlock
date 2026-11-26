'use client';

import { useState } from "react";
import { ArrowRight, CheckCircle, Router, ShieldCheck, Wallet } from "lucide-react";
import { truncateAddress } from "@/lib/utils";

const STEPS = [
  { id: "workspace", title: "Create workspace", body: "Name your workspace and create the first policy set.", icon: Router },
  { id: "fund", title: "Fund vault", body: "Mock vault funded automatically in demo mode.", icon: ShieldCheck },
  { id: "wallet", title: "Link wallet", body: "Connect a Solana wallet so the demo can attribute activity to an owner.", icon: Wallet },
  { id: "agent", title: "Invite agent", body: "Generate an API key for your first AI agent.", icon: CheckCircle },
];

export function OnboardingView() {
  const [step, setStep] = useState(0);
  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");

  const completedSteps = step;

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
                <label className="block text-sm font-semibold text-ink">
                  Amount
                  <input
                    inputMode="decimal"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="mt-2 min-h-12 w-full rounded-lg border border-border px-3 outline-none focus:border-primary"
                  />
                </label>
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
                  className="mt-4 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-surface"
                >
                  Create agent <ArrowRight size={16} aria-hidden="true" />
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
                (step === 0 && !name.trim()) ||
                (step === 1 && !amount.trim())
              }
              onClick={() =>
                step === STEPS.length - 1 ? setStep(0) : setStep((s) => Math.min(STEPS.length - 1, s + 1))
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