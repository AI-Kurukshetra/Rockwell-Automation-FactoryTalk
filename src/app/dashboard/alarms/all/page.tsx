import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";


import { AlarmActionButtons } from "@/components/alarms/AlarmActionButtons";
import { AlarmSeverityBadge } from "@/components/alarms/AlarmSeverityBadge";
import { AlarmStatusBadge } from "@/components/alarms/AlarmStatusBadge";
import { ListPageLayout } from "@/components/layout/ListPageLayout";
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
import { AlarmSeverity, AlarmStatus } from "@/lib/validation/alarm";

type AlarmRow = {
  id: string;
  title: string;
  description: string | null;
  severity: AlarmSeverity;
  status: AlarmStatus;
  created_at: string;
  acknowledged_at: string | null;
  resolved_at: string | null;
  equipment: { name: string | null }[] | null;
};

const PAGE_SIZE = 50;

export default async function AlarmsAllPage({
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

  const { data: alarms, error, count } = await supabase
    .from("alarms")
    .select(
      "id,title,description,severity,status,created_at,acknowledged_at,resolved_at,equipment(name)",
      { count: "exact" },
    )
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (alarms ?? []) as AlarmRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <ListPageLayout
      header={
        <DashboardHeader
          eyebrow="Alarm Management"
          title="All Alarms"
          subtitle="Paginated alarm history"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Alarms", href: "/dashboard/alarms" },
            { label: "All" },
          ]}
          tabs={{ basePath: "/dashboard/alarms", listLabel: "List", newLabel: "Create" }}
        />
      }
      pagination={
        <PaginationBar
          basePath="/dashboard/alarms/all"
          page={page}
          totalPages={totalPages}
          totalCount={count ?? 0}
          pageSize={PAGE_SIZE}
        />
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Title</TableHead>
            <TableHead>Equipment</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No alarms found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((alarm) => (
              <TableRow key={alarm.id}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <span>{alarm.title}</span>
                    {alarm.description ? (
                      <p className="text-xs text-muted-foreground">
                        {alarm.description}
                      </p>
                    ) : null}
                  </div>
                </TableCell>
                      <TableCell>{alarm.equipment?.[0]?.name ?? "—"}</TableCell>
                <TableCell>
                  <AlarmSeverityBadge severity={alarm.severity} />
                </TableCell>
                <TableCell>
                  <AlarmStatusBadge status={alarm.status} />
                </TableCell>
                <TableCell>
                  {new Date(alarm.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <AlarmActionButtons id={alarm.id} status={alarm.status} />
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ListPageLayout>
  );
}
