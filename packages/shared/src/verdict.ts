import { z } from "zod";

export const VerdictSchema = z.enum(["ALLOW", "BLOCK", "HOLD"]);
export type Verdict = z.infer<typeof VerdictSchema>;