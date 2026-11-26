import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createDataSource } from "../src/index.js";
import type { Agent, Policy, TxEvent, Scenario, AppStats, AgentConnection, Session } from "@airlock/shared";

const ds = createDataSource();

describe("datasource createAgent", () => {
  it("creates agent with policy and connection", async () => {
    const { agent, connection, apiKey } = await ds.createAgent({ name: "Test-Agent", balanceUsd: 500 });
    expect(agent.id).toMatch(/^agent-/);
    expect(agent.name).toBe("Test-Agent");
    expect(agent.balanceUsd).toBe(500);
    expect(connection.status).toBe("waiting");
    expect(apiKey).toMatch(/^sk_/);
  });

  it("creates agent with policy and connection", async () => {
    const result = await ds.createAgent({ name: "Test2", balanceUsd: 100 });
    expect(result.agent.id).toMatch(/^agent-/);
    expect(result.connection.status).toBe("waiting");
  });
});

describe("datasource connection flow", () => {
  it("signInWithWallet transitions from waiting to connected", async () => {
    const { agent } = await ds.createAgent({ name: "WalletAgent", balanceUsd: 0 });
    const connectionBefore = await ds.getConnection(agent.id);
    expect(connectionBefore?.status).toBe("waiting");

    const signature = `5hK${Date.now()}test`;
    const { connection } = await ds.signInWithWallet(agent.vaultAddress ?? "test", signature);
    expect(connection?.status).toBe("connected");

    const connectionAfter = await ds.getConnection(agent.id);
    expect(connectionAfter?.status).toBe("connected");
  });

  it("signInDemo creates a session", async () => {
    const session = await ds.signInDemo();
    expect(session).toBeDefined();
    expect(session.wallet).toBeDefined();
    expect(session.mode).toBe("demo");
  });
});

describe("datasource updatePolicy", () => {
  it("updates policy persistence", async () => {
    const { agent } = await ds.createAgent({ name: "PolicyTest", balanceUsd: 100 });
    const policy = await ds.getPolicy(agent.id!);
    expect(policy).toBeDefined();
    expect(policy?.perTxCapUsd).toBe(250);

    await ds.updatePolicy(agent.id!, { perTxCapUsd: 500 });
    const updated = await ds.getPolicy(agent.id!);
    expect(updated?.perTxCapUsd).toBe(500);
  });
});

describe("datasource resolveHeld", () => {
  it("resolves held event to ALLOW and updates stats", async () => {
    const events = await ds.listEvents();
    const held = events.find((e) => e.verdict === "HOLD");
    expect(held).toBeDefined();

    const resolved = await ds.resolveHeld(held!.id, "approve");
    expect(resolved.verdict).toBe("ALLOW");
    expect(resolved.reason).toBe("Approved by the wallet owner");

    const stats = await ds.getStats();
    expect(stats.allowedCount).toBeGreaterThan(0);
  });

  it("rejects held event and updates verdict to BLOCK", async () => {
    const events = await ds.listEvents();
    const held = events.find((e) => e.verdict === "HOLD");
    expect(held).toBeDefined();

    const resolved = await ds.resolveHeld(held!.id, "reject");
    expect(resolved.verdict).toBe("BLOCK");
    expect(resolved.reason).toBe("Rejected by the wallet owner");

    const stats = await ds.getStats();
    expect(stats.blockedCount).toBeGreaterThan(0);
  });
});

describe("datasource runScenario", () => {
  it("runs scenario with BLOCK verdict", async () => {
    const { agent } = await ds.createAgent({ name: "BlockTest", balanceUsd: 0 });
    const { connection } = await ds.signInWithWallet(agent.vaultAddress ?? "test", "");
    const result = await ds.runScenario("prompt-injection", () => {});
    expect(result.verdict).toBe("BLOCK");
  });

  it("runs scenario and events are pushed to subscribers", async () => {
    let receivedEvent: TxEvent | undefined;
    const unsubscribe = ds.subscribeEvents((event) => {
      receivedEvent = event;
    });

    await ds.runScenario("prompt-injection", () => {});
    expect(receivedEvent).toBeDefined();
    expect(receivedEvent?.verdict).toBe("BLOCK");

    unsubscribe();
  });
});

describe("datasource signOut", () => {
  it("clears demo session", async () => {
    await ds.signInDemo();
    expect(await ds.getSession()).toBeDefined();
    await ds.signOut();
    const session = await ds.getSession();
    expect(session).toBeNull();
  });
});

describe("datasource getStats", () => {
  it("returns AppStats with correct structure", async () => {
    const stats = await ds.getStats();
    expect(stats).toHaveProperty("fundsProtectedUsd");
    expect(stats).toHaveProperty("allowedCount");
    expect(stats).toHaveProperty("blockedCount");
    expect(stats).toHaveProperty("heldCount");
    expect(stats).toHaveProperty("series");
    expect(Array.isArray(stats.series)).toBe(true);
    expect(stats.series.length).toBe(7);
  });
});