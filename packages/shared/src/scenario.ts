import { z } from "zod";
import { TxEventSchema } from "./tx-event.js";

export const ScenarioStageSchema = z.enum([
  "submit",
  "decode",
  "simulate",
  "rules",
  "intent",
  "verdict",
]);

export type ScenarioStage = z.infer<typeof ScenarioStageSchema>;

export const ScenarioStepStatusSchema = z.enum(["pending", "running", "pass", "fail"]);

export type ScenarioStepStatus = z.infer<typeof ScenarioStepStatusSchema>;

export const ScenarioStepSchema = z.object({
  stage: ScenarioStageSchema,
  label: z.string(),
  status: ScenarioStepStatusSchema,
  detail: z.string(),
});

export type ScenarioStep = z.infer<typeof ScenarioStepSchema>;

export const ScenarioSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string(),
  steps: z.array(ScenarioStepSchema),
  resultEvent: TxEventSchema,
});

export type Scenario = z.infer<typeof ScenarioSchema>;