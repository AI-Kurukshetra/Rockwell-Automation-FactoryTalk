import { z } from "zod";

export const widgetTypes = ["kpi", "chart", "table", "text"] as const;

export type WidgetType = (typeof widgetTypes)[number];

export const dashboardSchema = z.object({
  name: z.string().trim().min(3, "Dashboard name is required."),
  description: z.string().trim().optional(),
});

export const widgetSchema = z.object({
  title: z.string().trim().min(3, "Widget title is required."),
  type: z.enum(widgetTypes),
  config: z.string().trim().optional(),
  position: z.string().trim().optional(),
});
