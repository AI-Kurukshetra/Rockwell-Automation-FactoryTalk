import { z } from "zod";

export const scadaProtocols = [
  "opc_ua",
  "modbus",
  "ethernet_ip",
  "mqtt",
  "profinet",
] as const;

export const scadaStatuses = ["online", "degraded", "offline"] as const;

export type ScadaProtocol = (typeof scadaProtocols)[number];
export type ScadaStatus = (typeof scadaStatuses)[number];

export const scadaConnectionSchema = z.object({
  name: z.string().trim().min(3, "Name is required."),
  protocol: z.enum(scadaProtocols),
  endpoint: z.string().trim().min(3, "Endpoint is required."),
  status: z.enum(scadaStatuses),
  last_sync: z.string().optional(),
  notes: z.string().optional(),
});
