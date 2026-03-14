import { redirect } from "next/navigation";

import { DeleteScadaConnectionButton } from "@/components/scada/DeleteScadaConnectionButton";
import { EditScadaConnectionDialog } from "@/components/scada/EditScadaConnectionDialog";
import { ScadaProtocolBadge } from "@/components/scada/ScadaProtocolBadge";
import { ScadaStatusBadge } from "@/components/scada/ScadaStatusBadge";
import { ListPageLayout } from "@/components/layout/ListPageLayout";
import { StatCard } from "@/components/layout/StatCard";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { PaginationBar } from "@/components/navigation/PaginationBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createServerClientReadOnly } from "@/lib/supabase/server";
import { ScadaStatus } from "@/lib/validation/scada";

export const dynamic = "force-dynamic";

type ScadaRow = {
  id: string;
  name: string;
  protocol: string;
  endpoint: string;
  status: ScadaStatus;
  last_sync: string | null;
  notes: string | null;
  created_at: string;
};

const PAGE_SIZE = 20;

export default async function ScadaPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? "1"));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  const { data: connections, error, count } = await supabase
    .from("scada_connections")
    .select("id,name,protocol,endpoint,status,last_sync,notes,created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (connections ?? []) as ScadaRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  const { data: statusRows } = await supabase
    .from("scada_connections")
    .select("status");

  const statusCounts = (statusRows ?? []).reduce(
    (acc, row) => {
      const key = row.status as ScadaStatus;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<ScadaStatus, number>,
  );

  return (
    <ListPageLayout
      header={
        <DashboardHeader
          eyebrow="SCADA Integration"
          title="SCADA Connections"
          subtitle="Connect PLCs, sensors, and control systems"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "SCADA" },
          ]}
          tabs={{ basePath: "/dashboard/scada", listLabel: "List", newLabel: "Add" }}
        />
      }
      stats={
        <section className="grid gap-4 md:grid-cols-3">
          {(["online", "degraded", "offline"] as ScadaStatus[]).map((status) => (
            <StatCard
              key={status}
              label={status}
              value={statusCounts[status] ?? 0}
            />
          ))}
        </section>
      }
      pagination={
        <PaginationBar
          basePath="/dashboard/scada"
          page={page}
          totalPages={totalPages}
          totalCount={count ?? 0}
          pageSize={PAGE_SIZE}
        />
      }
      viewAllHref="/dashboard/scada/all"
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Protocol</TableHead>
            <TableHead>Endpoint</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Last Sync</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No SCADA connections yet. Add your first endpoint.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <span>{row.name}</span>
                    <p className="text-xs text-muted-foreground">
                      {row.notes ?? "No notes"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>
                  <ScadaProtocolBadge protocol={row.protocol as any} />
                </TableCell>
                <TableCell>{row.endpoint}</TableCell>
                <TableCell>
                  <ScadaStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  {row.last_sync
                    ? new Date(row.last_sync).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditScadaConnectionDialog connection={row as any} />
                    <DeleteScadaConnectionButton id={row.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ListPageLayout>
  );
}
