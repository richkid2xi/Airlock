import type { Agent, Policy, TxEvent, Scenario, AppStats, AgentConnection, Session, CreateAgentResult, SdkSnippet } from "@airlock/shared";
import type { Supplier, Invoice, InvoiceStatus, PaymentRequest, RuleFired, InvoiceRules } from "@airlock/shared";

export interface DataSource {
  // Agent management
  listAgents(): Promise<Agent[]>;
  getAgent(id: string): Promise<Agent | null>;
  createAgent(input: { name: string; balanceUsd: number }): Promise<CreateAgentResult>;
  getPolicy(agentId: string): Promise<Policy | null>;
  updatePolicy(agentId: string, patch: Partial<Omit<Policy, "id" | "agentId">>): Promise<Policy>;
  freezeAgent(id: string, frozen: boolean): Promise<Agent>;

  // ** NEW: Supplier management **
  listSuppliers(agentId: string): Promise<Supplier[]>;
  addSupplier(agentId: string, input: { name: string; payoutWallet: string; verified?: boolean; country?: string }): Promise<Supplier>;
  verifySupplier(supplierId: string): Promise<Supplier>;

  // ** NEW: Invoice management **
  listInvoices(agentId?: string, filter?: { status?: InvoiceStatus }): Promise<Invoice[]>;
  getInvoice(id: string): Promise<Invoice | null>;
  registerInvoice(agentId: string, input: { supplierId: string; amount: number; dueDate: string; reference?: string }): Promise<Invoice>;
  attestDelivery(invoiceId: string): Promise<Invoice>;
  disputeInvoice(invoiceId: string): Promise<Invoice>;
  submitPayment(agentId: string, request: PaymentRequest): Promise<TxEvent>;

  // Events and feed
  listEvents(filter?: { agentId?: string; verdict?: TxEvent["verdict"] }): Promise<TxEvent[]>;
  getEvent(id: string): Promise<TxEvent | null>;
  subscribeEvents(cb: (event: TxEvent) => void): () => void;
  listHeld(): Promise<TxEvent[]>;
  resolveHeld(id: string, resolution: "approve" | "reject"): Promise<TxEvent>;
  runScenario(id: Scenario["id"], onStep: (step: Scenario["steps"][number]) => void): Promise<TxEvent>;
  listScenarios(): Promise<Scenario[]>;
  resetDemo(): Promise<void>;
  getStats(): Promise<AppStats>;

  // Auth and linking
  getSession(): Promise<Session | null>;
  signInWithWallet(wallet: string, signature: string): Promise<{ agent: Agent; connection: AgentConnection; apiKey: string }>;
  signInDemo(): Promise<Session>;
  signOut(): Promise<void>;
  getConnection(agentId: string): Promise<AgentConnection | null>;
  regenerateApiKey(agentId: string): Promise<{ newApiKey: string; preview: string }>;
  getSdkSnippet(agentId: string): Promise<SdkSnippet>;
}