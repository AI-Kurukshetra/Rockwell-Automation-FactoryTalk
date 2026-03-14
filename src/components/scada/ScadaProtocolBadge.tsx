import { Badge } from "@/components/ui/badge";
import { ScadaProtocol } from "@/lib/validation/scada";

const protocolStyles: Record<ScadaProtocol, string> = {
  opc_ua: "bg-indigo-100 text-indigo-700",
  modbus: "bg-amber-100 text-amber-700",
  ethernet_ip: "bg-emerald-100 text-emerald-700",
  mqtt: "bg-sky-100 text-sky-700",
  profinet: "bg-rose-100 text-rose-700",
};

export function ScadaProtocolBadge({ protocol }: { protocol: ScadaProtocol }) {
  return (
    <Badge className={`border-0 px-2.5 py-1 text-xs ${protocolStyles[protocol]}`}>
      {protocol.replace("_", " ")}
    </Badge>
  );
}
