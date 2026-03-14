import { z } from "zod";

export const productionStatuses = [
  "planned",
  "in_progress",
  "paused",
  "completed",
  "cancelled",
] as const;

export const productionPriorities = ["low", "medium", "high"] as const;

export type ProductionStatus = (typeof productionStatuses)[number];
export type ProductionPriority = (typeof productionPriorities)[number];

export const productionOrderSchema = z.object({
  order_number: z.string().trim().min(3, "Order number is required."),
  product_name: z.string().trim().min(2, "Product name is required."),
  line: z.string().trim().min(2, "Line is required."),
  quantity: z.coerce.number().int().positive("Quantity must be positive."),
  status: z.enum(productionStatuses),
  priority: z.enum(productionPriorities),
  scheduled_start: z.string().optional(),
  scheduled_end: z.string().optional(),
  actual_start: z.string().optional(),
  actual_end: z.string().optional(),
  notes: z.string().optional(),
});
