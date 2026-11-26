export type Verdict = "ALLOW" | "BLOCK" | "HOLD";

export interface DemoAgent {
  name: string;
  status: "active" | "frozen";
  balance: number;
  perTx: number;
  daily: number;
  programs: string[];
  vault: string;
  destinations: number;
}

export interface DemoEvent {
  id: number;
  agent: string;
  ts: string;
  intentText: string;
  programs: string[];
  effects: Array<{ asset: string; delta: number; counterparty: string }>;
  verdict: Verdict;
  ruleFired: string;
  intentResult: { match: boolean; confidence: number; note: string };
  reason: string;
  signature?: string;
}

export const agentsSeed: DemoAgent[] = [
  { name: "Trader-01", status: "active", balance: 12480, perTx: 500, daily: 2000, programs: ["Jupiter", "System", "Token"], vault: "7KqP...D3vM", destinations: 8 },
  { name: "Payroll-Bot", status: "active", balance: 8200, perTx: 1500, daily: 6000, programs: ["System", "Token"], vault: "3RmV...9xKa", destinations: 5 },
  { name: "Support-Refunds", status: "frozen", balance: 950, perTx: 50, daily: 300, programs: ["System", "Token"], vault: "8NwC...2pLq", destinations: 3 },
];

const reasonSets: Record<Verdict, string[]> = {
  ALLOW: ["Within per-transaction and daily limits", "Destination is allowlisted", "Intent matches the proposed transaction"],
  BLOCK: ["Destination not allowlisted", "Over daily cap", "Unknown program", "Delegation attempt"],
  HOLD: ["Requires human approval", "Intent mismatch needs review"],
};

export function createSeedEvents(): DemoEvent[] {
  let held = 0;
  return Array.from({ length: 40 }, (_, i) => {
    const roll = (i * 37) % 100;
    let verdict: Verdict = roll < 70 ? "ALLOW" : roll < 92 ? "BLOCK" : "HOLD";
    if (verdict === "HOLD" && held === 3) verdict = "BLOCK";
    if (verdict === "HOLD") held++;
    const agent = agentsSeed[i % agentsSeed.length].name;
    const reason = verdict === "HOLD" ? "Requires human approval" : reasonSets[verdict][i % reasonSets[verdict].length];
    return {
      id: 4400 + i,
      agent,
      ts: `${String(9 + Math.floor(i / 12)).padStart(2, "0")}:${String((i * 7) % 60).padStart(2, "0")}`,
      intentText: verdict === "ALLOW"
        ? "Send the approved amount to an allowlisted destination."
        : "Attempt an unexpected onchain transfer.",
      programs: i % 3 === 0 ? ["Jupiter", "Token"] : ["System", "Token"],
      effects: [{ asset: "USDC", delta: verdict === "ALLOW" ? -(25 + (i % 400)) : -(500 + (i % 900)), counterparty: verdict === "BLOCK" ? "Unknown destination" : "Allowlisted vault" }],
      verdict,
      ruleFired: verdict === "ALLOW" ? "Policy pass" : verdict === "BLOCK" ? "Hard policy rule" : "Approval required",
      intentResult: { match: verdict !== "BLOCK", confidence: verdict === "ALLOW" ? 96 : 82, note: verdict === "HOLD" ? "Human review recommended" : "Effects compared with intent" },
      reason,
      ...(verdict === "ALLOW" ? { signature: `sig_${4400 + i}_demo` } : {}),
    };
  });
}

class MockEngine {
  agents = structuredClone(agentsSeed);
  events = createSeedEvents();
  listeners = new Set<() => void>();

  subscribe(listener: () => void) {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }
  emit() { this.listeners.forEach((listener) => listener()); }
  reset() {
    this.agents = structuredClone(agentsSeed);
    this.events = createSeedEvents();
    this.emit();
  }
  addEvent(event: DemoEvent) {
    this.events = [event, ...this.events].slice(0, 80);
    this.emit();
  }
  setAgentStatus(name: string, status: "active" | "frozen") {
    this.agents = this.agents.map((agent) => agent.name === name ? { ...agent, status } : agent);
    this.emit();
  }
  resolveHeld(id: number, verdict: "ALLOW" | "BLOCK") {
    this.events = this.events.map((event) => event.id === id
      ? { ...event, verdict, reason: verdict === "ALLOW" ? "Approved after human review" : "Rejected after human review", signature: verdict === "ALLOW" ? `sig_${id}_approved_demo` : undefined }
      : event);
    this.emit();
  }
  updatePolicy(name: string, perTx: number, daily: number) {
    this.agents = this.agents.map((agent) => agent.name === name ? { ...agent, perTx, daily } : agent);
    this.emit();
  }
  stats() {
    return {
      protected: this.agents.reduce((sum, agent) => sum + agent.balance, 0),
      allowed: this.events.filter((event) => event.verdict === "ALLOW").length,
      blocked: this.events.filter((event) => event.verdict === "BLOCK").length,
      held: this.events.filter((event) => event.verdict === "HOLD").length,
    };
  }
}

export const mockEngine = new MockEngine();
