'use client';

import { useState } from "react";
import Link from "next/link";
import { Check, Wallet } from "lucide-react";
import { truncateAddress } from "@/lib/utils";

export function ConnectView() {
  const [connected, setConnected] = useState(false);

  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 py-12">
      <div className="w-full rounded-card border border-border bg-surface p-8 shadow-soft">
        <div className="flex items-center gap-3">
          <div className="grid size-11 place-items-center rounded-xl bg-primary/10 text-primary">
            <Wallet aria-hidden="true" size={22} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-ink">Connect your wallet</h1>
            <p className="mt-0.5 text-sm text-muted">
              Link a Solana wallet to open the Airlock dashboard.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center gap-4 rounded-xl bg-sky/5 p-6">
          <button
            type="button"
            onClick={() => setConnected(true)}
            disabled={connected}
            className="inline-flex min-h-12 items-center gap-2 rounded-lg bg-primary px-6 text-sm font-semibold text-surface disabled:opacity-40"
          >
            {connected ? "Connected" : "Connect demo wallet"}
          </button>
          {connected ? (
            <div className="flex items-center gap-2 text-sm text-muted">
              <Check aria-hidden="true" size={16} className="text-success" />
              <span className="font-mono">{truncateAddress("5VtQ2ZkRx...")}</span>
              <span>connected</span>
            </div>
          ) : (
            <p className="text-xs text-muted">
              Use the demo wallet to explore the dashboard without real funds.
            </p>
          )}
          {connected && (
            <Link
              href="/onboarding"
              className="mt-2 inline-flex min-h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-semibold text-surface"
            >
              Continue to onboarding
            </Link>
          )}
        </div>
      </div>
    </main>
  );
}