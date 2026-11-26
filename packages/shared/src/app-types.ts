import { z } from "zod";

export const AppStatsSchema = z.object({
  fundsProtectedUsd: z.number(),
  allowedCount: z.number(),
  blockedCount: z.number(),
  heldCount: z.number(),
  series: z.array(
    z.object({
      day: z.string(),
      allowed: z.number(),
      blocked: z.number(),
    })
  ),
});

export type AppStats = z.infer<typeof AppStatsSchema>;

export const SessionSchema = z.object({
  wallet: z.string(),
  mode: z.enum(["demo", "wallet"]),
  expiresAt: z.string(),
});

export type Session = z.infer<typeof SessionSchema>;

export const CreateAgentResultSchema = z.object({
  agent: z.object({
    id: z.string(),
    name: z.string(),
    status: z.enum(["active", "frozen"]),
    vaultAddress: z.string(),
    balanceUsd: z.number(),
    createdAt: z.string(),
    policyId: z.string(),
    ownerWallet: z.string().optional(),
    agentPubkey: z.string().optional(),
  }),
  connection: z.object({
    agentId: z.string(),
    agentPubkey: z.string(),
    apiKeyPreview: z.string(),
    status: z.enum(["waiting", "connected"]),
    lastSeenAt: z.string().optional(),
  }),
  apiKey: z.string(),
});

export type CreateAgentResult = z.infer<typeof CreateAgentResultSchema>;

export const SdkSnippetSchema = z.object({
  language: z.string(),
  code: z.string(),
});

export type SdkSnippet = z.infer<typeof SdkSnippetSchema>;