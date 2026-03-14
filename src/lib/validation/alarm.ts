import { z } from "zod";

export const alarmSeverities = [
  "low",
  "medium",
  "high",
  "critical",
] as const;

export const alarmStatuses = ["active", "acknowledged", "resolved"] as const;

export const alarmSchema = z.object({
  title: z
    .string()
    .trim()
    .min(3, "Title is required.")
    .max(140, "Title is too long."),
  description: z
    .string()
    .trim()
    .max(500, "Description is too long.")
    .optional()
    .or(z.literal("")),
  severity: z.enum(alarmSeverities).default("medium"),
  equipment_id: z.string().uuid().optional().or(z.literal("")),
});

export type AlarmFormValues = z.infer<typeof alarmSchema>;
export type AlarmSeverity = (typeof alarmSeverities)[number];
export type AlarmStatus = (typeof alarmStatuses)[number];
