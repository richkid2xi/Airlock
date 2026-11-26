import { z } from "zod";

export const SupplierSchema = z.object({
  id: z.string(),
  name: z.string(),
  payoutWallet: z.string(),
  verified: z.boolean(),
  country: z.string().optional(),
  addedAt: z.string(),
});

export type Supplier = z.infer<typeof SupplierSchema>;

export const AddSupplierInputSchema = z.object({
  name: z.string().min(1),
  payoutWallet: z.string().min(1),
  verified: z.boolean().default(false),
  country: z.string().optional(),
});

export type AddSupplierInput = z.infer<typeof AddSupplierInputSchema>;

export const InvoiceStatusSchema = z.enum([
  "open",
  "attested",
  "paid",
  "disputed",
  "cancelled",
]);

export type InvoiceStatus = z.infer<typeof InvoiceStatusSchema>;

export const InvoiceSchema = z.object({
  id: z.string(),
  agentId: z.string(),
  supplierId: z.string(),
  supplierName: z.string(),
  amount: z.number().min(0),
  currency: z.literal("USDC"),
  dueDate: z.string(),
  docHash: z.string(),
  reference: z.string().optional(),
  status: InvoiceStatusSchema,
  deliveryAttested: z.boolean(),
  attestedAt: z.string().optional(),
  paidAt: z.string().optional(),
  paymentSignature: z.string().optional(),
  createdAt: z.string(),
});

export type Invoice = z.infer<typeof InvoiceSchema>;

export const RegisterInvoiceInputSchema = z.object({
  supplierId: z.string(),
  amount: z.number().min(0),
  dueDate: z.string(),
  reference: z.string().min(1),
});

export type RegisterInvoiceInput = z.infer<typeof RegisterInvoiceInputSchema>;

export const PaymentRequestSchema = z.object({
  invoiceId: z.string().optional(),
  payTo: z.string().min(1),
  amount: z.number().min(0),
  intent: z.string().min(1),
  evidence: z.string().optional(),
});

export type PaymentRequest = z.infer<typeof PaymentRequestSchema>;

export const RuleFiredSchema = z.enum([
  "frozen",
  "invoice_not_found",
  "invoice_not_payable",
  "payee_mismatch",
  "amount_mismatch",
  "supplier_unverified",
  "over_invoice_cap",
  "daily_cap",
  "delivery_not_attested",
  "intent_mismatch",
]);

export type RuleFired = z.infer<typeof RuleFiredSchema>;

export const InvoiceRulesSchema = z.object({
  requireVerifiedSupplier: z.boolean(),
  requireDeliveryAttestation: z.boolean(),
  perInvoiceCapUsdc: z.number().min(0),
});

export type InvoiceRules = z.infer<typeof InvoiceRulesSchema>;
