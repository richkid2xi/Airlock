import type { DataSource } from './types.js';
import type { Agent, Policy, TxEvent, Scenario, AppStats, AgentConnection, Session } from "@airlock/shared";
import type { SdkSnippet } from "@airlock/shared";
import { clone, nowIso, DAY, seedAgents, seedPolicies, seedEvents, seedScenarios, seedConnections, seedSession } from "./mock-data/index.js";

class MockStore implements DataSource {
  private agents: Agent[] = [];
  private policies: Policy[] = [];
  private events: TxEvent[] = [];
  private scenarios: Scenario[] = [];
  private connections: Map<string, AgentConnection> = new Map();
  private apiKeys = new Map<string, string>();
  private subscribers = new Set<(event: TxEvent) => void>();
  private timer: ReturnType<typeof setTimeout> | null = null;
  private sequence = 100;
  private demoSession: Session | null = null;

  constructor() {
    this.restore();
  }

  private restore() {
    this.agents = seedAgents();
    this.policies = seedPolicies();
    this.events = seedEvents();
    this.scenarios = seedScenarios();
    this.connections = new Map(seedConnections().map((c: AgentConnection) => [c.agentId, c]));
    this.apiKeys = new Map([["agent-trader", "sk_air_3f8a"], ["agent-payroll", "sk_air_7b2c"], ["agent-support", "sk_air_1d9e"]]);
    this.sequence = 100;
    this.demoSession = seedSession();
  }

  private emit(event: TxEvent) {
    this.events = [event, ...this.events];
    this.subscribers.forEach((subscriber) => subscriber(clone(event)));
    this.schedule();
  }

  private schedule() {
    if (this.timer || this.subscribers.size === 0) return;
    const delay = 3000 + Math.random() * 3000;
    this.timer = setTimeout(() => {
      this.timer = null;
      const event = createEvent(this.sequence++);
      event.ts = nowIso();
      this.emit(event);
      this.schedule();
    }, delay);
  }

  async listAgents() {
    return clone(this.agents);
  }

  async getAgent(id: string) {
    return clone(this.agents.find((agent) => agent.id === id) ?? null);
  }

  async createAgent(input: { name: string; balanceUsd: number }): Promise<{ agent: Agent; connection: AgentConnection; apiKey: string }> {
    const id = `agent-${Date.now()}`;
    const policyId = `policy-${Date.now()}`;
    const agent: Agent = {
      id,
      name: input.name,
      status: "active",
      vaultAddress: `Air${Math.random().toString(36).slice(2, 12)}Qp7Xk9Vr5Nt2Yw8Ds`,
      balanceUsd: input.balanceUsd,
      createdAt: nowIso(),
      policyId,
    };
    this.agents = [...this.agents, agent];
    this.policies = [
      ...this.policies,
      {
        id: policyId,
        agentId: id,
        perTxCapUsd: 250,
        dailyCapUsd: 1000,
        allowedPrograms: ["System Program", "Token Program"],
        allowedDestinations: [],
        blockedActions: ["set_authority", "approve_delegate", "close_account"],
        intentCheck: true,
      },
    ];
    this.connections.set(id, {
      agentId: id,
      agentPubkey: `Air${Math.random().toString(36).slice(2, 12)}Qp7Xk9Vr5Nt2Yw8Ds`,
      apiKeyPreview: `sk_air_${Math.random().toString(36).slice(2, 10)}`,
      status: "waiting",
    });
    this.apiKeys.set(id, `sk_air_${Math.random().toString(36).slice(2, 16)}`);
    this.sequence += 1;
    const apiKey = this.apiKeys.get(id) ?? `sk_air_${Math.random().toString(36).slice(2, 16)}`;
    return {
      agent: clone(agent),
      connection: clone(this.connections.get(id))!,
      apiKey,
    };
  }

  async getPolicy(agentId: string) {
    return clone(this.policies.find((policy) => policy.agentId === agentId) ?? null);
  }

  async updatePolicy(agentId: string, patch: Partial<Omit<Policy, "id" | "agentId">>) {
    const index = this.policies.findIndex((policy) => policy.agentId === agentId);
    if (index < 0) throw new Error("Policy not found");
    this.policies[index] = { ...this.policies[index], ...clone(patch) };
    return clone(this.policies[index]);
  }

  async freezeAgent(id: string, frozen: boolean) {
    const agent = this.agents.find((item) => item.id === id);
    if (!agent) throw new Error("Agent not found");
    agent.status = frozen ? "frozen" : "active";
    return clone(agent);
  }

  async listEvents(filter?: { agentId?: string; verdict?: TxEvent["verdict"] }) {
    return clone(
      this.events.filter(
        (event) =>
          (!filter?.agentId || event.agentId === filter.agentId) &&
          (!filter?.verdict || event.verdict === filter.verdict),
      ),
    );
  }

  async getEvent(id: string) {
    return clone(this.events.find((event) => event.id === id) ?? null);
  }

  subscribeEvents(cb: (event: TxEvent) => void) {
    this.subscribers.add(cb);
    this.schedule();
    return () => {
      this.subscribers.delete(cb);
      if (this.subscribers.size === 0 && this.timer) {
        clearTimeout(this.timer);
        this.timer = null;
      }
    };
  }

  async listHeld() {
    return clone(this.events.filter((event) => event.verdict === "HOLD"));
  }

  async resolveHeld(id: string, resolution: "approve" | "reject") {
    const event = this.events.find((item) => item.id === id);
    if (!event) throw new Error("Held event not found");
    event.verdict = resolution === "approve" ? "ALLOW" : "BLOCK";
    event.reason =
      resolution === "approve" ? "Approved by the wallet owner" : "Rejected by the wallet owner";
    if (event.verdict === "ALLOW") event.signature = `5hK${Date.now()}Airlock`;
    if (event.verdict === "BLOCK") event.ruleFired = "owner rejected approval";
    this.subscribers.forEach((subscriber) => subscriber(clone(event)));
    return clone(event);
  }

  async runScenario(id: Scenario["id"], onStep: (step: Scenario["steps"][number]) => void) {
    const selected = this.scenarios.find((item) => item.id === id);
    if (!selected) throw new Error("Scenario not found");
    const failedStage = selected.resultEvent.intentResult?.match === false ? "intent" : "rules";
    for (const sourceStep of selected.steps) {
      onStep({ ...sourceStep, status: "running" });
      await new Promise((resolve) => setTimeout(resolve, 700));
      const failed = sourceStep.stage === failedStage;
      onStep({ ...sourceStep, status: failed ? "fail" : "pass" });
      if (failed) {
        for (const remaining of selected.steps.slice(selected.steps.indexOf(sourceStep) + 1)) {
          onStep({
            ...remaining,
            status: remaining.stage === "verdict" ? "fail" : "pending",
          });
        }
        break;
      }
    }
    const result = clone(selected.resultEvent);
    result.id = `scenario-${id}-${Date.now()}`;
    result.ts = nowIso();
    if (id === "over-limit-drain") {
      for (let index = 1; index <= 11; index += 1) {
        const allowed: TxEvent = {
          ...clone(result),
          id: `scenario-${id}-allowed-${index}-${Date.now()}`,
          ts: nowIso(-(12 - index) * 14_000),
          intentText: `Transfer ${index} of 12: send 180 USDC`,
          effects: [{ asset: "USDC", delta: -180, counterparty: "9aXq...Lm4" }],
          verdict: "ALLOW",
          ruleFired: undefined,
          intentResult: {
            match: true,
            confidence: 0.96,
            note: "Transfer matches the requested batch",
          },
          reason: "Transfer remained within the daily cap",
          signature: `5hK${index}OverLimitAirlock`,
        };
        this.emit(allowed);
      }
    }
    this.emit(result);
    return clone(result);
  }

  async listScenarios() {
    return clone(this.scenarios);
  }

  async resetDemo() {
    this.restore();
    const latest = this.events[0];
    if (latest) this.subscribers.forEach((subscriber) => subscriber(clone(latest)));
  }

  async getStats(): Promise<AppStats> {
    const allowedCount = this.events.filter((event) => event.verdict === "ALLOW").length;
    const blockedCount = this.events.filter((event) => event.verdict === "BLOCK").length;
    const heldCount = this.events.filter((event) => event.verdict === "HOLD").length;
    const series = Array.from({ length: 7 }, (_, index) => {
      const date = new Date(Date.now() - (6 - index) * DAY);
      const day = date.toLocaleDateString("en-US", { weekday: "short" });
      return {
        day,
        allowed: 12 + ((index * 7 + 3) % 16),
        blocked: 2 + ((index * 3 + 1) % 7),
      };
    });
    return {
      fundsProtectedUsd: this.agents.reduce((sum, agent) => sum + agent.balanceUsd, 0),
      allowedCount,
      blockedCount,
      heldCount,
      series,
    };
  }

  // Auth and linking methods

  async getSession(): Promise<Session | null> {
    if (!this.demoSession) return null;
    return clone(this.demoSession);
  }

  async signInWithWallet(wallet: string, signature: string): Promise<{ agent: Agent; connection: AgentConnection; apiKey: string }> {
    let agent = this.agents.find((a) => a.vaultAddress === wallet || a.ownerWallet === wallet);
    if (!agent) {
      agent = {
        id: `agent-${Date.now()}`,
        name: `Wallet-Agent-${wallet.slice(0, 6)}`,
        status: "active",
        vaultAddress: wallet,
        balanceUsd: 0,
        createdAt: nowIso(),
        policyId: `policy-${Date.now()}`,
      };
      this.agents = [...this.agents, agent];
    }

    const agentPubkey = agent.agentPubkey ?? `Air${Math.random().toString(36).slice(2, 12)}Qp7Xk9Vr5Nt2Yw8Ds`;
    const connection: AgentConnection = {
      agentId: agent.id,
      agentPubkey,
      apiKeyPreview: this.apiKeys.get(agent.id) ?? `sk_air_${Math.random().toString(36).slice(2, 10)}`,
      status: "connected",
    };
    this.connections.set(agent.id, connection);
    agent.ownerWallet = wallet;

    const agentIndex = this.agents.findIndex((a) => a.id === agent.id);
    if (agentIndex >= 0) this.agents[agentIndex] = agent;

    const apiKey = this.apiKeys.get(agent.id) ?? `sk_air_${Math.random().toString(36).slice(2, 16)}`;

    return { agent, connection, apiKey };
  }

  async signInDemo(): Promise<Session> {
    this.demoSession = seedSession();
    return clone(this.demoSession);
  }

  async signOut(): Promise<void> {
    this.demoSession = null;
  }

  async getConnection(agentId: string) {
    return clone(this.connections.get(agentId) ?? null);
  }

  async regenerateApiKey(agentId: string): Promise<{ newApiKey: string; preview: string }> {
    const newKey = `sk_air_${Math.random().toString(36).slice(2, 16)}`;
    const preview = `sk_air_${Math.random().toString(36).slice(2, 10)}`;
    this.apiKeys.set(agentId, newKey);
    return { newApiKey: newKey, preview };
  }

  async getSdkSnippet(agentId: string): Promise<SdkSnippet> {
    const apiKey = this.apiKeys.get(agentId) ?? "sk_test_1234";
    const code = `// Airlock SDK snippet for ${agentId}
// Install: npm install @airlock/sdk
// Init: import { initializeAirlock } from "@airlock/sdk";
// Initialize: initializeAirlock({ apiKey: "${apiKey}" });

export function submit(tx, intent) {
  return airlock.submit(tx, intent);
}`;

    return { language: "typescript", code };
  }
}

export const mockDataSource: DataSource = new MockStore();

function createEvent(index: number, verdict?: TxEvent["verdict"]): TxEvent {
  const resolvedVerdict =
    verdict ?? (index % 13 === 0 ? "HOLD" : index % 5 === 0 || index % 7 === 0 ? "BLOCK" : "ALLOW");
  const agentIds = ["agent-trader", "agent-payroll", "agent-support"];
  const agentId = agentIds[index % agentIds.length];
  const amount = 24 + ((index * 73) % 1420);
  const blockReason = [
    ["Per-transaction cap exceeded", "per-tx cap exceeded"],
    ["Program is not on the allowlist", "program not allowlisted"],
    ["Transaction creates a new token delegation", "approve_delegate is blocked"],
    ["Destination is not on the allowlist", "destination not allowlisted"],
    ["Transaction effects do not match the request", "intent mismatch"],
  ][index % 5];
  const reason =
    resolvedVerdict === "ALLOW"
      ? [
          "Within spend cap and approved program",
          "Destination and transaction intent verified",
          "Simulation matched the requested swap",
          "Recurring payment is inside policy",
        ][index % 4]
      : resolvedVerdict === "BLOCK"
        ? blockReason[0]
        : [
          "Unusual destination requires owner approval",
          "Payment is near the daily limit",
          "New counterparty requires review",
        ][index % 3];
  const programs =
    resolvedVerdict === "BLOCK" && index % 4 === 1
      ? ["Unknown9xQProgram"]
      : [["Jupiter", "System Program", "Token Program"][index % 3]];
  return {
    id: `event-${index}-${Math.round(Date.now() / 1000)}`,
    agentId,
    ts: nowIso(-index * 3.7 * 60 * 60 * 1000),
    intentText:
      agentId === "agent-trader"
        ? `Swap ${amount.toFixed(0)} USDC to SOL at the best available price`
        : agentId === "agent-payroll"
          ? `Pay approved contractor invoice for ${amount.toFixed(0)} USDC`
          : `Refund customer ${amount.toFixed(0)} USDC`,
    programs,
    effects: [
      { asset: "USDC", delta: -amount, counterparty: "9aXq...Lm4" },
      ...(agentId === "agent-trader"
        ? [
            {
              asset: "SOL",
              delta: Number((amount / 148).toFixed(2)),
              counterparty: "Jupiter aggregator",
            },
          ]
        : []),
    ],
    verdict: resolvedVerdict,
    ruleFired: resolvedVerdict === "BLOCK" ? blockReason[1] : undefined,
    intentResult: {
      match: !(resolvedVerdict === "BLOCK" && index % 5 === 4),
      confidence: resolvedVerdict === "BLOCK" && index % 5 === 4 ? 0.18 : 0.94,
      note:
        resolvedVerdict === "BLOCK" && index % 5 === 4
          ? "Observed effects differ from the owner's instruction"
          : "Transaction effects match the stated intent",
    },
    reason,
    signature: resolvedVerdict === "ALLOW" ? `5hK${index}pQ9xLm7Vr2Nt8Yw4Ds6cFa3eHu` : undefined,
  };
}