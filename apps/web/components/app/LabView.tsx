"use client";

import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Play, RotateCcw, ShieldAlert } from "lucide-react";
import { appContent } from "../../content/app";
import { useAgents } from "../../hooks/useAgents";
import { useScenarios } from "../../hooks/useScenarios";
import type { Scenario, TxEvent } from "../../lib/types";
import { cn, formatCurrency } from "../../lib/utils";
import AppShell from "./AppShell";
import { LoadingSkeleton, Toast } from "./AppPrimitives";
import TxDetailDrawer from "./TxDetailDrawer";

type StepState = Record<Scenario["steps"][number]["stage"], Scenario["steps"][number]>;

function AnimatedFunds({ value }: { value: number }) {
  const reduceMotion = useReducedMotion();
  const [display, setDisplay] = useState(reduceMotion ? value : 0);

  useEffect(() => {
    if (reduceMotion) {
      setDisplay(value);
      return;
    }
    setDisplay(0);
    const started = Date.now();
    const timer = window.setInterval(() => {
      const progress = Math.min(1, (Date.now() - started) / 700);
      setDisplay(value * progress);
      if (progress === 1) window.clearInterval(timer);
    }, 30);
    return () => window.clearInterval(timer);
  }, [reduceMotion, value]);

  return <>{formatCurrency(display)}</>;
}

export default function LabView() {
  const { scenarios, loading, runScenario, resetDemo } = useScenarios();
  const { agents } = useAgents();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [steps, setSteps] = useState<StepState | null>(null);
  const [result, setResult] = useState<TxEvent | null>(null);
  const [history, setHistory] = useState<TxEvent[]>([]);
  const [detail, setDetail] = useState<TxEvent | null>(null);
  const [running, setRunning] = useState(false);
  const [withoutAirlock, setWithoutAirlock] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const reduceMotion = useReducedMotion();
  const selected = scenarios.find((item) => item.id === selectedId) ?? scenarios[0] ?? null;
  const agentNames = new Map(agents.map((agent) => [agent.id, agent.name]));

  const initialize = (item: Scenario) =>
    Object.fromEntries(item.steps.map((step) => [step.stage, step])) as StepState;

  const run = async (item: Scenario) => {
    setSelectedId(item.id);
    setSteps(initialize(item));
    setResult(null);
    setWithoutAirlock(false);
    setRunning(true);
    const event = await runScenario(item.id, (step) => {
      setSteps((current) => ({ ...(current ?? initialize(item)), [step.stage]: step }));
    });
    setResult(event);
    setHistory((current) => [event, ...current]);
    setRunning(false);
  };

  const runAll = async () => {
    for (const item of scenarios) await run(item);
  };

  const reset = async () => {
    await resetDemo();
    setSelectedId(null);
    setSteps(null);
    setResult(null);
    setHistory([]);
    setWithoutAirlock(false);
    setToast(appContent.lab.resetToast);
    window.setTimeout(() => setToast(null), 2200);
  };

  const protectedAmount = useMemo(
    () => Math.abs(result?.effects.find((effect) => effect.delta < 0)?.delta ?? 0),
    [result],
  );
  const activeStepIndex =
    selected?.steps.findIndex((step) => steps?.[step.stage]?.status === "running") ?? -1;
  const labActions = (
    <button
      type="button"
      onClick={() => void reset()}
      className="inline-flex min-h-11 items-center gap-2 rounded-lg border border-border bg-surface px-4 text-sm font-semibold text-ink"
    >
      <RotateCcw aria-hidden="true" size={16} />
      <span className="hidden sm:inline">{appContent.lab.reset}</span>
    </button>
  );

  return (
    <AppShell title={appContent.lab.title} activeHref="/app/lab" actions={labActions}>
      {loading ? (
        <LoadingSkeleton rows={5} />
      ) : (
        <>
          <div className="grid gap-6 xl:grid-cols-[340px_1fr]">
            <aside className="space-y-3">
              <button
                type="button"
                disabled={running}
                onClick={() => void runAll()}
                className="min-h-11 w-full rounded-lg bg-primary px-4 text-sm font-semibold text-surface disabled:opacity-50"
              >
                {appContent.lab.runAll}
              </button>
              {scenarios.map((item) => (
                <article
                  key={item.id}
                  className={cn(
                    "rounded-card border bg-surface p-4 shadow-soft",
                    selected?.id === item.id ? "border-primary" : "border-border",
                  )}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <h2 className="font-bold text-ink">{item.title}</h2>
                      <p className="mt-1 text-xs leading-5 text-muted">{item.description}</p>
                    </div>
                    <span className="shrink-0 rounded-pill bg-danger/10 px-2 py-1 text-[10px] font-bold text-danger">
                      {appContent.lab.threat}
                    </span>
                  </div>
                  <button
                    type="button"
                    disabled={running}
                    onClick={() => void run(item)}
                    className="mt-4 inline-flex min-h-10 items-center gap-2 rounded-lg border border-primary/20 px-3 text-xs font-bold text-primary disabled:opacity-50"
                  >
                    <Play aria-hidden="true" size={14} />
                    {appContent.lab.runAttack}
                  </button>
                </article>
              ))}
            </aside>

            <section className="min-h-[650px] rounded-card bg-navy p-5 text-surface shadow-float sm:p-7">
              {selected ? (
                <div>
                  <div className="rounded-xl border border-surface/10 bg-surface/[0.05] p-4">
                    <p className="text-xs font-bold uppercase tracking-wider text-sky">
                      {appContent.lab.agent}
                    </p>
                    <p className="mt-1 font-bold">{appContent.lab.agentName}</p>
                    <p className="mt-4 rounded-lg border border-danger/20 bg-danger/10 p-3 text-sm leading-6 text-surface/80">
                      {selected.steps[0].detail}
                    </p>
                  </div>

                  <div className="mt-8 grid gap-3 md:grid-cols-6">
                    {selected.steps.map((step, index) => {
                      const state = steps?.[step.stage]?.status ?? "pending";
                      return (
                        <div key={step.stage} className="relative">
                          <div
                            className={cn(
                              "rounded-xl border p-3 text-center transition",
                              state === "pass" && "border-success/40 bg-success/10",
                              state === "fail" && "border-danger/50 bg-danger/10",
                              state === "running" && "border-sky bg-sky/10",
                              state === "pending" && "border-surface/10 bg-surface/[0.03]",
                            )}
                          >
                            <span className="text-[10px] font-bold text-surface/45">
                              {index + 1}
                            </span>
                            <p className="mt-1 text-xs font-semibold">{step.label}</p>
                          </div>
                          {state !== "pending" && (
                            <p
                              className={cn(
                                "mt-2 text-[10px] leading-4",
                                state === "fail" ? "text-danger" : "text-surface/45",
                              )}
                            >
                              {steps?.[step.stage]?.detail}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {selected.id === "over-limit-drain" && running && (
                    <div className="mt-8">
                      <div className="flex justify-between text-xs text-surface/60">
                        <span>{appContent.lab.balance}</span>
                        <span>{Math.max(0, activeStepIndex + 1)}/6</span>
                      </div>
                      <div className="mt-2 h-3 overflow-hidden rounded-pill bg-surface/10">
                        <motion.div
                          className="h-full bg-warning"
                          animate={{ width: `${Math.max(8, ((activeStepIndex + 1) / 6) * 100)}%` }}
                        />
                      </div>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {result && (
                      <motion.div
                        key={result.id}
                        initial={reduceMotion ? false : { opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-9 rounded-xl border border-danger/40 bg-danger/10 p-6 text-center"
                      >
                        <ShieldAlert aria-hidden="true" className="mx-auto text-danger" size={38} />
                        <p className="mt-3 text-3xl font-black text-danger">
                          {appContent.lab.blocked}
                        </p>
                        <p className="mx-auto mt-2 max-w-lg text-sm text-surface/70">
                          {result.reason}
                        </p>
                        <p className="mt-5 text-sm font-semibold text-surface">
                          {appContent.lab.fundsProtected}: <AnimatedFunds value={protectedAmount} />
                        </p>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="mt-8 rounded-xl border border-surface/10 p-4">
                    <label className="flex min-h-11 items-center justify-between gap-4 text-sm font-semibold">
                      {appContent.lab.without}
                      <input
                        type="checkbox"
                        checked={withoutAirlock}
                        onChange={(event) => setWithoutAirlock(event.target.checked)}
                        className="size-5 accent-danger"
                      />
                    </label>
                    <div className="mt-3 h-4 overflow-hidden rounded-pill bg-surface/10">
                      <motion.div
                        key={`${selected.id}-${withoutAirlock}`}
                        className="h-full bg-gradient-to-r from-success to-danger"
                        initial={{ width: "100%" }}
                        animate={{ width: withoutAirlock ? "0%" : "100%" }}
                        transition={{ duration: reduceMotion ? 0 : 1.4 }}
                      />
                    </div>
                    <p className="mt-2 text-xs text-surface/45">{appContent.lab.balance}</p>
                  </div>
                </div>
              ) : (
                <div className="grid min-h-[590px] place-items-center text-center">
                  <div>
                    <ShieldAlert aria-hidden="true" className="mx-auto text-sky" size={46} />
                    <h2 className="mt-4 text-xl font-bold">{appContent.lab.ready}</h2>
                    <p className="mx-auto mt-2 max-w-md text-sm text-surface/50">
                      {appContent.lab.readyDescription}
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          <section className="mt-6 rounded-card border border-border bg-surface p-5 shadow-soft">
            <h2 className="font-bold text-ink">{appContent.lab.runHistory}</h2>
            {history.length === 0 ? (
              <p className="mt-4 text-sm text-muted">{appContent.lab.noHistory}</p>
            ) : (
              <div className="mt-4 divide-y divide-border">
                {history.map((event) => (
                  <button
                    key={event.id}
                    type="button"
                    onClick={() => setDetail(event)}
                    className="flex min-h-14 w-full items-center justify-between gap-4 py-3 text-left"
                  >
                    <span className="min-w-0 truncate text-sm font-semibold text-ink">
                      {event.intentText}
                    </span>
                    <span className="rounded-pill bg-danger/10 px-2.5 py-1 text-xs font-bold text-danger">
                      {event.verdict}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </section>
        </>
      )}
      <TxDetailDrawer
        event={detail}
        agentName={detail ? (agentNames.get(detail.agentId) ?? detail.agentId) : ""}
        onClose={() => setDetail(null)}
      />
      <Toast message={toast} />
    </AppShell>
  );
}
