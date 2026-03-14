import Link from "next/link";
import { redirect } from "next/navigation";

import { AlarmStatusChart } from "@/components/charts/AlarmStatusChart";
import { EquipmentStatusChart } from "@/components/charts/EquipmentStatusChart";
import { TelemetryTrendChart } from "@/components/charts/TelemetryTrendChart";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { Button } from "@/components/ui/button";
import { createServerClientReadOnly } from "@/lib/supabase/server";
import { EquipmentStatus } from "@/lib/validation/equipment";
import { AlarmSeverity, AlarmStatus } from "@/lib/validation/alarm";

export default async function OverviewPage() {
  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  const [{ data: equipmentRows }, { data: alarmRows }, { data: telemetryRows }] =
    await Promise.all([
      supabase.from("equipment").select("status"),
      supabase.from("alarms").select("severity,status"),
      supabase.from("telemetry").select("metric,recorded_at").limit(200),
    ]);

  const equipmentCount = equipmentRows?.length ?? 0;
  const equipmentStatusCounts = (equipmentRows ?? []).reduce(
    (acc, row) => {
      const key = row.status as EquipmentStatus;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<EquipmentStatus, number>,
  );

  const alarmCount = alarmRows?.length ?? 0;
  const alarmSeverityCounts = (alarmRows ?? []).reduce(
    (acc, row) => {
      const key = row.severity as AlarmSeverity;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<AlarmSeverity, number>,
  );

  const alarmStatusCounts = (alarmRows ?? []).reduce(
    (acc, row) => {
      const key = row.status as AlarmStatus;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<AlarmStatus, number>,
  );

  const telemetryCount = telemetryRows?.length ?? 0;
  const recentMetrics = (telemetryRows ?? []).reduce(
    (acc, row) => {
      const key = row.metric as string;
      acc[key] = (acc[key] ?? 0) + 1;
      return acc;
    },
    {} as Record<string, number>,
  );
  const topMetrics = Object.entries(recentMetrics)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
  const maxMetric = Math.max(1, ...topMetrics.map(([, count]) => count));

  const now = new Date();
  const hours = Array.from({ length: 12 }, (_, i) => {
    const d = new Date(now);
    d.setHours(now.getHours() - (11 - i), 0, 0, 0);
    return d;
  });
  const hourLabels = hours.map((d) =>
    d.toLocaleTimeString("en-US", { hour: "numeric" }),
  );
  const hourCounts = hours.map((d) => {
    const start = d.getTime();
    const end = start + 60 * 60 * 1000;
    return (telemetryRows ?? []).filter((row) => {
      const ts = new Date(row.recorded_at as string).getTime();
      return ts >= start && ts < end;
    }).length;
  });

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,_oklch(0.98_0.02_210),_oklch(0.99_0_0)_55%,_oklch(0.95_0.03_260))]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
        <DashboardHeader
          eyebrow="Dashboard"
          title="Operational Overview"
          subtitle="High-level performance snapshot"
          email={authData.user.email}
          breadcrumbs={[{ label: "Dashboard", href: "/dashboard/overview" }]}
        />

        <section className="grid gap-4 md:grid-cols-3">
          <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Equipment
            </p>
            <p className="mt-2 text-3xl font-semibold">{equipmentCount}</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {(["online", "maintenance", "offline"] as EquipmentStatus[]).map(
                (status) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="capitalize">{status}</span>
                    <span>{equipmentStatusCounts[status] ?? 0}</span>
                  </div>
                ),
              )}
            </div>
            <Button
              asChild
              className="mt-auto w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard/equipment">View equipment</Link>
            </Button>
          </div>

          <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Alarms
            </p>
            <p className="mt-2 text-3xl font-semibold">{alarmCount}</p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {(["critical", "high", "medium", "low"] as AlarmSeverity[]).map(
                (severity) => (
                  <div
                    key={severity}
                    className="flex items-center justify-between"
                  >
                    <span className="capitalize">{severity}</span>
                    <span>{alarmSeverityCounts[severity] ?? 0}</span>
                  </div>
                ),
              )}
            </div>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              {(["active", "acknowledged", "resolved"] as AlarmStatus[]).map(
                (status) => (
                  <div key={status} className="flex items-center justify-between">
                    <span className="capitalize">{status}</span>
                    <span>{alarmStatusCounts[status] ?? 0}</span>
                  </div>
                ),
              )}
            </div>
            <Button
              asChild
              className="mt-auto w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard/alarms">View alarms</Link>
            </Button>
          </div>

          <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
              Telemetry
            </p>
            <p className="mt-2 text-3xl font-semibold">{telemetryCount}</p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              {topMetrics.length === 0 ? (
                <span>No telemetry yet</span>
              ) : (
                topMetrics.map(([metric, count]) => (
                  <div key={metric} className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span className="capitalize">{metric}</span>
                      <span>{count}</span>
                    </div>
                    <div className="h-1.5 w-full rounded-full bg-muted">
                      <div
                        className="h-1.5 rounded-full bg-primary"
                        style={{ width: `${(count / maxMetric) * 100}%` }}
                      />
                    </div>
                  </div>
                ))
              )}
            </div>
            <Button
              asChild
              className="mt-auto w-full rounded-full bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link href="/dashboard/telemetry">View telemetry</Link>
            </Button>
          </div>
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <EquipmentStatusChart
            online={equipmentStatusCounts.online ?? 0}
            maintenance={equipmentStatusCounts.maintenance ?? 0}
            offline={equipmentStatusCounts.offline ?? 0}
          />
          <AlarmStatusChart
            active={alarmStatusCounts.active ?? 0}
            acknowledged={alarmStatusCounts.acknowledged ?? 0}
            resolved={alarmStatusCounts.resolved ?? 0}
          />
          <TelemetryTrendChart labels={hourLabels} values={hourCounts} />
        </section>

        <section className="grid gap-4 md:grid-cols-3">
          <div className="flex h-full flex-col rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
            <h2 className="text-lg font-semibold">Quick Actions</h2>
            <div className="mt-4 grid gap-2">
              <Button asChild variant="outline" className="justify-between rounded-full">
                <Link href="/dashboard/equipment/new">Add equipment</Link>
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-full">
                <Link href="/dashboard/alarms/new">Create alarm</Link>
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-full">
                <Link href="/dashboard/telemetry/new">Log telemetry</Link>
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-full">
                <Link href="/dashboard/scada/new">Add SCADA connection</Link>
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-full">
                <Link href="/dashboard/quality/new">Log quality</Link>
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-full">
                <Link href="/dashboard/production/new">Schedule production</Link>
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-full">
                <Link href="/dashboard/events/new">Log event</Link>
              </Button>
              <Button asChild variant="outline" className="justify-between rounded-full">
                <Link href="/dashboard/dashboards/new">Create dashboard</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm md:col-span-2">
            <h2 className="text-lg font-semibold">System Health</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-3">
              <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Online rate
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {equipmentCount > 0
                    ? Math.round(
                        ((equipmentStatusCounts.online ?? 0) / equipmentCount) *
                          100,
                      )
                    : 0}
                  %
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Active alarms
                </p>
                <p className="mt-2 text-2xl font-semibold">
                  {alarmStatusCounts.active ?? 0}
                </p>
              </div>
              <div className="rounded-xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
                  Recent telemetry
                </p>
                <p className="mt-2 text-2xl font-semibold">{telemetryCount}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
