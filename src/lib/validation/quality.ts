import { z } from "zod";

export const qualityStatuses = ["pass", "fail", "rework"] as const;

export type QualityStatus = (typeof qualityStatuses)[number];

export const qualityRecordSchema = z.object({
  record_number: z.string().trim().min(3, "Record number is required."),
  product_name: z.string().trim().min(2, "Product name is required."),
  line: z.string().trim().min(2, "Line is required."),
  status: z.enum(qualityStatuses),
  defect_type: z.string().trim().optional(),
  defect_count: z.coerce.number().int().min(0, "Defect count must be 0 or more."),
  inspected_at: z.string().optional(),
  notes: z.string().optional(),
});
