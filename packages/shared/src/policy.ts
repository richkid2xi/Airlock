import { z } from "zod";

import { InvoiceRulesSchema, type InvoiceRules } from "./invoice.js";

export const BlockedActionSchema = z.enum([
  "set_authority",
  "approve_delegate",
  "close_account",
]);

export type BlockedAction = z.infer<typeof BlockedActionSchema>;

export const PolicySchema = z.object({
  id: z.string(),
  agentId: z.string(),
  perTxCapUsd: z.number().min(0),
  dailyCapUsd: z.number().min(0),
  allowedPrograms: z.array(z.string()),
  allowedDestinations: z.array(z.string()),
  blockedActions: z.array(BlockedActionSchema),
  intentCheck: z.boolean(),
  invoiceRules: InvoiceRulesSchema.optional(),
});

export type Policy = z.infer<typeof PolicySchema>;

export const UpdatePolicyInputSchema = PolicySchema.omit({ id: true, agentId: true }).partial();

export type UpdatePolicyInput = z.infer<typeof UpdatePolicyInputSchema>;