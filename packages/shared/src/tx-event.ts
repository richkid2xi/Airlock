import { z } from "zod";

import { RuleFiredSchema, type RuleFired, InvoiceSchema, type Invoice } from "./invoice.js";

export const VerdictSchema = z.enum(["ALLOW", "BLOCK", "HOLD"]);
export type Verdict = z.infer<typeof VerdictSchema>;

export const TxEffectSchema = z.object({
  asset: z.string(),
  delta: z.number(),
  counterparty: z.string(),
});

export type TxEffect = z.infer<typeof TxEffectSchema>;

export const IntentResultSchema = z.object({
  match: z.boolean(),
  confidence: z.number().min(0).max(1),
  note: z.string(),
});

export type IntentResult = z.infer<typeof IntentResultSchema>;

export const TxEventSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  ts: z.string(),
  intentText: z.string(),
  programs: z.array(z.string()),
  effects: z.array(TxEffectSchema),
  verdict: VerdictSchema,
  ruleFired: RuleFiredSchema.optional(),
  intentResult: IntentResultSchema.optional(),
  reason: z.string(),
  signature: z.string().optional(),
  invoiceId: z.string().optional(),
  supplierName: z.string().optional(),
  requestedPayTo: z.string().optional(),
  requestedAmount: z.number().optional(),
  evidenceExcerpt: z.string().optional(),
});

export type TxEvent = z.infer<typeof TxEventSchema>;
