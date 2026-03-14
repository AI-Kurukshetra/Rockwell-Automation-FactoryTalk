import { z } from "zod";

export const equipmentStatuses = [
  "online",
  "offline",
  "maintenance",
  "idle",
] as const;

export const equipmentSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name is required.")
    .max(120, "Name is too long."),
  status: z.enum(equipmentStatuses).default("offline"),
  location: z
    .string()
    .trim()
    .max(120, "Location is too long.")
    .optional()
    .or(z.literal("")),
  last_seen: z
    .string()
    .trim()
    .optional()
    .refine((value) => !value || !Number.isNaN(Date.parse(value)), {
      message: "Invalid date/time.",
    }),
  notes: z
    .string()
    .trim()
    .max(500, "Notes are too long.")
    .optional()
    .or(z.literal("")),
});

export type EquipmentFormValues = z.infer<typeof equipmentSchema>;
export type EquipmentStatus = (typeof equipmentStatuses)[number];
