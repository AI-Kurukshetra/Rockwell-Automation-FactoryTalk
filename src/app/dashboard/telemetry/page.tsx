import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";


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

type TelemetryRow = {
  id: string;
  metric: string;
  value: number;
  unit: string | null;
  recorded_at: string;
  equipment: { name: string | null } | null;
};

const PAGE_SIZE = 20;

export default async function TelemetryPage({
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

  const { data: metricRows } = await supabase
    .from("telemetry")
    .select("metric")
    .order("recorded_at", { ascending: false })
    .limit(300);

  const metricCounts = (metricRows ?? []).reduce(
    (acc, row) => {
      const key = row.metric as string;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );

  const topMetrics = Object.entries(metricCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  const topMetricMax = Math.max(1, ...topMetrics.map(([, count]) => count));
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <ListPageLayout
      header={
        <DashboardHeader
          eyebrow="Historical Data Logging"
          title="Telemetry Feed"
          subtitle="Recent readings across your equipment"
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Telemetry" },
          ]}
          tabs={{ basePath: "/dashboard/telemetry", listLabel: "List", newLabel: "Log" }}
        />
      }
      stats={
        <section className="grid gap-4 md:grid-cols-4">
          {topMetrics.map(([metric, count]) => (
            <StatCard
              key={metric}
              label={metric}
              value={count}
              footer={
                <div className="h-1.5 w-full rounded-full bg-muted">
                  <div
                    className="h-1.5 rounded-full bg-primary"
                    style={{ width: `${(count / topMetricMax) * 100}%` }}
                  />
                </div>
              }
            />
          ))}
        </section>
      }
      pagination={
        <PaginationBar
          basePath="/dashboard/telemetry"
          page={page}
          totalPages={totalPages}
          totalCount={count ?? 0}
          pageSize={PAGE_SIZE}
        />
      }
      viewAllHref="/dashboard/telemetry/all"
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
          {telemetry && telemetry.length > 0 ? (
            (telemetry as TelemetryRow[]).map((row) => (
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
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No telemetry yet. Create your first reading.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ListPageLayout>
  );
}
