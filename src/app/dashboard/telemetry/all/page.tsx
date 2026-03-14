import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";


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

type TelemetryRow = {
  id: string;
  metric: string;
  value: number;
  unit: string | null;
  recorded_at: string;
  equipment: { name: string | null } | null;
};

const PAGE_SIZE = 50;

export default async function TelemetryAllPage({
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

  const { data: telemetry, error, count } = await supabase
    .from("telemetry")
    .select("id,metric,value,unit,recorded_at,equipment(name)", {
      count: "exact",
    })
    .order("recorded_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (telemetry ?? []) as TelemetryRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <ListPageLayout
      header={
        <DashboardHeader
          eyebrow="Historical Data Logging"
          title="All Telemetry"
          subtitle="Paginated telemetry feed"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Telemetry", href: "/dashboard/telemetry" },
            { label: "All" },
          ]}
          tabs={{ basePath: "/dashboard/telemetry", listLabel: "List", newLabel: "Log" }}
        />
      }
      pagination={
        <PaginationBar
          basePath="/dashboard/telemetry/all"
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
            <TableHead>Equipment</TableHead>
            <TableHead>Metric</TableHead>
            <TableHead>Value</TableHead>
            <TableHead>Recorded At</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No telemetry found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>{row.equipment?.name ?? "—"}</TableCell>
                <TableCell className="font-medium">{row.metric}</TableCell>
                <TableCell>
                  {row.value}
                  {row.unit ? ` ${row.unit}` : ""}
                </TableCell>
                <TableCell>
                  {new Date(row.recorded_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ListPageLayout>
  );
}
