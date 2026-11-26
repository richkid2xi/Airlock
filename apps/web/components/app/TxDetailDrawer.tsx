"use client";

import { CheckCircle2, CircleMinus, X, XCircle } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { appContent } from "../../content/app";
import { AppLink } from "../../lib/navigation";
import type { TxEvent } from "../../lib/types";
import { cn, truncateAddress } from "../../lib/utils";
import { CopyButton, VerdictBadge } from "./AppPrimitives";

type TxDetailDrawerProps = {
  event: TxEvent | null;
  agentName: string;
  onClose: () => void;
};

export default function TxDetailDrawer({ event, agentName, onClose }: TxDetailDrawerProps) {
  const policyFailure =
    event?.verdict === "BLOCK" &&
    event.ruleFired !== "intent_mismatch" &&
    event.intentResult?.match !== false;
  const intentFailure =
    event?.intentResult?.match === false || event?.ruleFired === "intent_mismatch";

  return (
    <AnimatePresence>
      {event && (
        <div className="fixed inset-0 z-[60]">
          <motion.button
            type="button"
            aria-label={appContent.common.close}
            className="absolute inset-0 bg-navy/35"
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
          <motion.aside
            className="absolute inset-y-0 right-0 flex w-full max-w-xl flex-col overflow-hidden bg-surface shadow-float sm:border-l sm:border-border"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
          >
            <div className="flex items-start justify-between border-b border-border p-5">
              <div>
                <VerdictBadge verdict={event.verdict} />
                <h2 className="mt-3 text-xl font-bold text-ink">{appContent.detail.title}</h2>
                <p className="mt-1 text-sm text-muted">
                  {agentName} · {new Date(event.ts).toLocaleString()}
                </p>
              </div>
              <button
                type="button"
                aria-label={appContent.common.close}
                onClick={onClose}
                className="grid size-11 place-items-center rounded-lg border border-border text-muted"
              >
                <X aria-hidden="true" size={20} />
              </button>
            </div>
            <div className="flex-1 space-y-7 overflow-y-auto p-5">
              {event.signature && (
                <section>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                    {appContent.detail.signature}
                  </h3>
                  <div className="mt-2 flex items-center gap-2 rounded-xl border border-border bg-sky/5 p-3">
                    <code className="min-w-0 flex-1 truncate text-xs text-ink">
                      {truncateAddress(event.signature, 12, 10)}
                    </code>
                    <CopyButton value={event.signature} />
                  </div>
                </section>
              )}
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  {appContent.detail.asked}
                </h3>
                <p className="mt-2 rounded-xl border border-border bg-sky/5 p-4 text-sm leading-6 text-ink">
                  {event.intentText}
                </p>
              </section>
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  {appContent.detail.actual}
                </h3>
                <div className="mt-2 divide-y divide-border rounded-xl border border-border">
                  {event.effects.map((effect, index) => (
                    <div
                      key={`${effect.asset}-${index}`}
                      className="flex items-center justify-between gap-4 p-3 text-sm"
                    >
                      <div className="min-w-0">
                        <p className="font-semibold text-ink">{effect.asset}</p>
                        <p className="truncate text-xs text-muted">{effect.counterparty}</p>
                      </div>
                      <span
                        className={
                          effect.delta < 0 ? "font-bold text-danger" : "font-bold text-success"
                        }
                      >
                        {effect.delta > 0 ? "+" : ""}
                        {effect.delta.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
                <h4 className="mt-4 text-xs font-bold uppercase tracking-wider text-muted">
                  {appContent.detail.programs}
                </h4>
                <div className="mt-2 flex flex-wrap gap-2">
                  {event.programs.map((program) => (
                    <span
                      key={program}
                      className="rounded-pill bg-primary/10 px-2.5 py-1 text-xs font-semibold text-primary"
                    >
                      {program}
                    </span>
                  ))}
                </div>
              </section>
              <section>
                <h3 className="text-xs font-bold uppercase tracking-wider text-muted">
                  {appContent.detail.checks}
                </h3>
                <div className="mt-3 space-y-2">
                  {appContent.detail.steps.map((step, index) => {
                    const failed = (index === 2 && policyFailure) || (index === 3 && intentFailure);
                    const skipped = index === 3 && policyFailure;
                    const Icon = skipped ? CircleMinus : failed ? XCircle : CheckCircle2;
                    return (
                      <div
                        key={step}
                        className={cn(
                          "flex gap-3 rounded-xl border p-3",
                          failed ? "border-danger/30 bg-danger/5" : "border-border",
                        )}
                      >
                        <Icon
                          aria-hidden="true"
                          size={18}
                          className={
                            skipped ? "text-muted" : failed ? "text-danger" : "text-success"
                          }
                        />
                        <div>
                          <p className="text-sm font-semibold text-ink">{step}</p>
                          <p className="mt-0.5 text-xs text-muted">
                            {failed
                              ? (event.ruleFired ?? appContent.detail.failed)
                              : skipped
                                ? appContent.detail.skipped
                                : appContent.detail.passed}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </section>
              <section className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                <h3 className="text-xs font-bold uppercase tracking-wider text-primary">
                  {appContent.detail.why}
                </h3>
                <p className="mt-2 text-sm leading-6 text-ink">{event.reason}</p>
              </section>
            </div>
            <div className="flex gap-3 border-t border-border p-4">
              <AppLink
                href={`/app/agents/${event.agentId}`}
                className="flex min-h-11 flex-1 items-center justify-center rounded-lg bg-primary px-4 text-sm font-semibold text-surface"
              >
                {appContent.detail.viewPolicy}
              </AppLink>
              <CopyButton value={event.id} label={appContent.detail.copyEvent} />
            </div>
          </motion.aside>
        </div>
      )}
    </AnimatePresence>
  );
}
