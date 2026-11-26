import type { DataSource } from './types.js';
import type { Agent, Policy, TxEvent, Scenario, AppStats, AgentConnection, Session, Supplier, Invoice, InvoiceStatus, PaymentRequest, RuleFired } from "@airlock/shared";
import type { SdkSnippet } from "@airlock/shared";
import { clone, nowIso, DAY, seedAgents, seedPolicies, seedEvents, seedScenarios, seedConnections, seedSession, seedSuppliers, seedInvoices } from "./mock-data/index.js";

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
  private suppliers: Map<string, Supplier> = new Map();
  private invoices: Map<string, Invoice> = new Map();

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
    this.suppliers = new Map(seedSuppliers().map((s: Supplier) => [s.id, s]));
    this.invoices = new Map(seedInvoices().map((i: Invoice) => [i.id, i]));
    this.sequence = 100;
    this.demoSession = seedSession();
  }

  // ---- Supplier methods ----
  async listSuppliers(agentId: string): Promise<Supplier[]> {
    const agent = this.agents.find((a) => a.id === agentId);
    if (!agent) return [];
    const policy = this.policies.find((p) => p.agentId === agentId);
    const requireVerified = (policy as any)?.invoiceRules?.requireVerifiedSupplier ?? false;
    return clone(
      Array.from(this.suppliers.values()).filter((s) => {
        if (requireVerified) return s.verified;
        return true;
      }),
    );
  }

  async addSupplier(agentId: string, input: { name: string; payoutWallet: string; verified?: boolean; country?: string }): Promise<Supplier> {
    const id = `sup-${Date.now()}`;
    const supplier: Supplier = {
      id,
      name: input.name,
      payoutWallet: input.payoutWallet,
      verified: input.verified ?? false,
      country: input.country,
      addedAt: nowIso(),
    };
    this.suppliers.set(id, supplier);
    return clone(supplier);
  }

  async verifySupplier(supplierId: string): Promise<Supplier> {
    const supplier = this.suppliers.get(supplierId);
    if (!supplier) throw new Error("Supplier not found");
    supplier.verified = true;
    this.suppliers.set(supplierId, supplier);
    return clone(supplier);
  }

  // ---- Invoice methods ----
  async listInvoices(agentId?: string, filter?: { status?: InvoiceStatus }): Promise<Invoice[]> {
    const all = clone(Array.from(this.invoices.values()));
    let result = all;
    if (agentId) result = result.filter((inv) => inv.agentId === agentId);
    if (filter?.status) result = result.filter((inv) => inv.status === filter.status);
    return result;
  }

  async getInvoice(id: string): Promise<Invoice | null> {
    return clone(this.invoices.get(id) ?? null);
  }

  async registerInvoice(agentId: string, input: { supplierId: string; amount: number; dueDate: string; reference?: string }): Promise<Invoice> {
    const supplier = this.suppliers.get(input.supplierId);
    if (!supplier) throw new Error("Supplier not found");
    const invoice: Invoice = {
      id: `inv-${Date.now()}`,
      agentId,
      supplierId: input.supplierId,
      supplierName: supplier.name,
      amount: input.amount,
      currency: "USDC",
      dueDate: input.dueDate,
      docHash: `doc-${Math.random().toString(36).slice(2, 32)}`,
      reference: input.reference ?? `REF-${Math.random().toString(36).slice(2, 16)}`,
      status: "open",
      deliveryAttested: false,
      attestedAt: undefined,
      paidAt: undefined,
      paymentSignature: undefined,
      createdAt: nowIso(),
    };
    this.invoices.set(invoice.id, invoice);
    return clone(invoice);
  }

  async attestDelivery(invoiceId: string): Promise<Invoice> {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) throw new Error("Invoice not found");
    invoice.deliveryAttested = true;
    invoice.attestedAt = nowIso();
    this.invoices.set(invoiceId, invoice);
    return clone(invoice);
  }

  async disputeInvoice(invoiceId: string): Promise<Invoice> {
    const invoice = this.invoices.get(invoiceId);
    if (!invoice) throw new Error("Invoice not found");
    invoice.status = "disputed";
    this.invoices.set(invoiceId, invoice);
    return clone(invoice);
  }

  private evalPayment(agentId: string, request: PaymentRequest, invoice: Invoice | null): { verdict: "ALLOW" | "BLOCK" | "HOLD"; ruleFired?: RuleFired; reason?: string } {
    const agent = this.agents.find((a) => a.id === agentId);
    const policy = this.policies.find((p) => p.agentId === agentId);
    if (!agent || !policy) return { verdict: "BLOCK", ruleFired: "invoice_not_found", reason: "Agent or policy not found" };

    // 1. Frozen agent
    if (agent.status === "frozen") return { verdict: "BLOCK", ruleFired: "frozen", reason: "Agent is frozen" };

    // 2. Missing invoice
    if (!invoice) return { verdict: "BLOCK", ruleFired: "invoice_not_found", reason: "Invoice not found" };

    const supplier = this.suppliers.get(invoice.supplierId) ?? null;

    // 3. Invoice already paid, cancelled, or disputed
    if (invoice.status === "paid" || invoice.status === "cancelled" || invoice.status === "disputed") {
      return { verdict: "BLOCK", ruleFired: "invoice_not_payable", reason: `Invoice is already ${invoice.status}` };
    }

    // 4. Payee mismatch
    if (supplier && request.payTo !== supplier.payoutWallet) {
      return { verdict: "BLOCK", ruleFired: "payee_mismatch", reason: `Payee ${request.payTo} does not match invoice supplier wallet ${supplier.payoutWallet}` };
    }

    // 5. Amount mismatch
    if (request.amount !== invoice.amount) {
      return { verdict: "BLOCK", ruleFired: "amount_mismatch", reason: `Requested ${request.amount} USDC does not match invoice ${invoice.amount} USDC` };
    }

    // 6. Supplier unverified when required
    if (policy.invoiceRules?.requireVerifiedSupplier && supplier?.verified === false) {
      return { verdict: "BLOCK", ruleFired: "supplier_unverified", reason: "Supplier is not verified" };
    }

    // 7. Invoice amount cap
    if (policy.invoiceRules?.perInvoiceCapUsdc && request.amount > policy.invoiceRules.perInvoiceCapUsdc) {
      return { verdict: "BLOCK", ruleFired: "over_invoice_cap", reason: `Amount ${request.amount} USDC exceeds per-invoice cap ${policy.invoiceRules.perInvoiceCapUsdc} USDC` };
    }

    // 8. Daily spending cap
    const today = nowIso().slice(0, 10);
    const absDeltas = this.events
      .filter((e) => e.agentId === agentId && e.ts?.slice(0, 10) === today && e.verdict === "ALLOW")
      .reduce((sum, e) => sum + Math.abs(e.effects?.[0]?.delta ?? 0), 0);
    const dailyCap = policy.dailyCapUsd ?? 0;
    if (absDeltas + request.amount > dailyCap) {
      return { verdict: "BLOCK", ruleFired: "daily_cap", reason: `Daily total ${absDeltas + request.amount} USDC exceeds cap ${dailyCap} USDC` };
    }

    // 9. Missing delivery attestation (if required)
    if (policy.invoiceRules?.requireDeliveryAttestation && !invoice.deliveryAttested) {
      return { verdict: "HOLD", ruleFired: "delivery_not_attested", reason: "Delivery not yet attested" };
    }

    // 10. Intent check on evidence
    const suspiciousPhrases = ["ignore previous", "new bank details", "payment details changed"];
    const hasSuspiciousText = suspiciousPhrases.some((p) => (request.evidence ?? "").toLowerCase().includes(p));
    const intentCheckEnabled = policy.intentCheck ?? false;
    if (intentCheckEnabled && (hasSuspiciousText || (supplier && request.payTo !== supplier.payoutWallet))) {
      return { verdict: "BLOCK", ruleFired: "intent_mismatch", reason: "Suspicious invoice text or wallet mismatch, blocked by intent check" };
    }

    // 11. ALLOW — mark invoice paid, decrement vault balance once, attach mock signature; record event
    const payoutWallet = supplier?.payoutWallet ?? "unknown";
    const allowEvent: TxEvent = {
      id: `ev-${Date.now()}`,
      agentId,
      ts: nowIso(),
      intentText: request.intent ?? `Pay ${invoice.supplierName} ${invoice.amount} USDC`,
      programs: ["System Program"],
      effects: [{ asset: "USDC", delta: -request.amount, counterparty: payoutWallet }],
      verdict: "ALLOW",
      ruleFired: undefined,
      intentResult: { match: true, confidence: 1.0, note: "All checks passed" },
      reason: "Invoice payment allowed",
      signature: `5hK${Math.round(Date.now() / 1000)}Airlock`,
    };
    this.events = [allowEvent, ...this.events];
    const agentIndex = this.agents.findIndex((a) => a.id === agentId);
    if (agentIndex >= 0) {
      this.agents[agentIndex].balanceUsd = Math.max(0, this.agents[agentIndex].balanceUsd - request.amount);
    }
    invoice.status = "paid";
    invoice.paidAt = nowIso();
    invoice.paymentSignature = allowEvent.signature;
    this.invoices.set(invoice.id, invoice);
    return { verdict: "ALLOW", ruleFired: undefined, reason: "Invoice payment allowed" };
  }

  async submitPayment(agentId: string, request: PaymentRequest): Promise<TxEvent> {
    const invoice = request.invoiceId ? this.invoices.get(request.invoiceId) ?? null : null;
    const result = this.evalPayment(agentId, request, invoice);

    if (result.verdict === "ALLOW") {
      // Already recorded inside evalPayment: event pushed, balance decremented, invoice marked paid
      // Return the most recently recorded ALLOW event for this agent
      const recorded = this.events[0];
      if (recorded && recorded.agentId === agentId && recorded.verdict === "ALLOW") return recorded;
      return this.buildTxEvent(agentId, request, invoice!, "ALLOW");
    }

    // BLOCK or HOLD — record event without deducting funds
    return this.buildBlockEvent(agentId, request, invoice, result);
  }

  private buildTxEvent(agentId: string, request: PaymentRequest, invoice: Invoice | null, verdict: "ALLOW"): TxEvent {
    const supplier = invoice ? this.suppliers.get(invoice.supplierId) : null;
    return {
      id: `ev-${Date.now()}`,
      agentId,
      ts: nowIso(),
      intentText: request.intent ?? `Pay ${invoice?.supplierName ?? "unknown"} ${invoice?.amount ?? 0} USDC`,
      programs: ["System Program"],
      effects: [{ asset: "USDC", delta: -request.amount, counterparty: supplier?.payoutWallet ?? "unknown" }],
      verdict,
      ruleFired: undefined,
      intentResult: { match: true, confidence: 1.0, note: "All checks passed" },
      reason: "Invoice payment allowed",
      signature: `5hK${Math.round(Date.now() / 1000)}Airlock`,
    };
  }

  private buildBlockEvent(agentId: string, request: PaymentRequest, invoice: Invoice | null, result: { verdict: "ALLOW" | "BLOCK" | "HOLD"; ruleFired?: RuleFired; reason?: string }): TxEvent {
    const { verdict, ruleFired, reason } = result;
    const supplier = invoice ? this.suppliers.get(invoice.supplierId) : null;
    return {
      id: `ev-${Date.now()}`,
      agentId,
      ts: nowIso(),
      intentText: request.intent ?? `Pay ${invoice?.supplierName ?? "unknown"} ${invoice?.amount ?? 0} USDC`,
      programs: ["System Program"],
      effects: [],
      verdict,
      ruleFired,
      intentResult: { match: false, confidence: 0.2, note: "Payment blocked" },
      reason: reason ?? "Payment blocked",
      signature: undefined,
    };
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
    if (event.verdict === "BLOCK") event.signature = undefined;
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
    const fundsProtected = this.events
      .filter((event) => event.verdict === "BLOCK")
      .reduce((sum, event) => {
        const amt = event.effects?.[0]?.delta;
        return amt ? sum + Math.abs(amt) : sum;
      }, 0);
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
      fundsProtectedUsd: fundsProtected,
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
    ruleFired: resolvedVerdict === "BLOCK" ? (blockReason[1] as RuleFired) : undefined,
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