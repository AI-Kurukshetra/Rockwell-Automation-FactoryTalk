import { z } from "zod";

export const eventTypes = [
  "auth",
  "equipment",
  "alarm",
  "telemetry",
  "production",
  "quality",
  "system",
] as const;

export const eventSeverities = ["info", "warning", "critical"] as const;

export type EventType = (typeof eventTypes)[number];
export type EventSeverity = (typeof eventSeverities)[number];

export const eventLogSchema = z.object({
  title: z.string().trim().min(3, "Title is required."),
  type: z.enum(eventTypes),
  severity: z.enum(eventSeverities),
  actor: z.string().trim().optional(),
  details: z.string().trim().optional(),
  occurred_at: z.string().optional(),
});
