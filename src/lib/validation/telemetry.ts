import { z } from "zod";

export const telemetrySchema = z.object({
  equipment_id: z.string().uuid("Equipment is required."),
  metric: z
    .string()
    .trim()
    .min(2, "Metric is required.")
    .max(80, "Metric is too long."),
  value: z.coerce.number().finite(),
  unit: z.string().trim().max(20).optional().or(z.literal("")),
  recorded_at: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Invalid date/time.",
    }),
});

export type TelemetryFormValues = z.infer<typeof telemetrySchema>;
