import { z } from "zod";

export const AgentStatusSchema = z.enum(["active", "frozen"]);
export type AgentStatus = z.infer<typeof AgentStatusSchema>;

export const AgentSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: AgentStatusSchema,
  vaultAddress: z.string(),
  balanceUsd: z.number(),
  createdAt: z.string(),
  policyId: z.string(),
  ownerWallet: z.string().optional(),
  agentPubkey: z.string().optional(),
});

export type Agent = z.infer<typeof AgentSchema>;

export const CreateAgentInputSchema = z.object({
  name: z.string().min(1),
  balanceUsd: z.number().min(0),
});

export type CreateAgentInput = z.infer<typeof CreateAgentInputSchema>;

export const AgentConnectionSchema = z.object({
  agentId: z.string(),
  agentPubkey: z.string(),
  apiKeyPreview: z.string(),
  status: z.enum(["waiting", "connected"]),
  lastSeenAt: z.string().optional(),
});

export type AgentConnection = z.infer<typeof AgentConnectionSchema>;
