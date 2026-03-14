import { redirect } from "next/navigation";

import { CreateWidgetForm } from "@/components/dashboards/CreateWidgetForm";
import { DeleteWidgetButton } from "@/components/dashboards/DeleteWidgetButton";
import { EditWidgetDialog } from "@/components/dashboards/EditWidgetDialog";
import { WidgetTypeBadge } from "@/components/dashboards/WidgetTypeBadge";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createServerClientReadOnly } from "@/lib/supabase/server";
import { WidgetType } from "@/lib/validation/dashboard";

export const dynamic = "force-dynamic";

type DashboardRow = {
  id: string;
  name: string;
  description: string | null;
};

type WidgetRow = {
  id: string;
  title: string;
  type: WidgetType;
  config: string | null;
  position: string | null;
  created_at: string;
};

export default async function DashboardDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  const { data: dashboard, error } = await supabase
    .from("dashboards")
    .select("id,name,description")
    .eq("id", params.id)
    .single();

  if (error || !dashboard) {
    redirect("/dashboard/dashboards");
  }

  const { data: widgets, error: widgetError } = await supabase
    .from("dashboard_widgets")
    .select("id,title,type,config,position,created_at")
    .eq("dashboard_id", params.id)
    .order("created_at", { ascending: false });

  if (widgetError) {
    throw new Error(widgetError.message);
  }

  const row = dashboard as DashboardRow;
  const widgetRows = (widgets ?? []) as WidgetRow[];

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,_oklch(0.98_0.02_210),_oklch(0.99_0_0)_55%,_oklch(0.95_0.03_260))]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
        <DashboardHeader
          eyebrow="Dashboard Builder"
          title={row.name}
          subtitle={row.description ?? "Widget configuration"}
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Dashboards", href: "/dashboard/dashboards" },
            { label: row.name },
          ]}
          tabs={{ basePath: "/dashboard/dashboards", listLabel: "List", newLabel: "Create" }}
        />

        <section className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm">
            <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/70">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Widget</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Position</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {widgetRows.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No widgets yet. Add your first widget.
                      </TableCell>
                    </TableRow>
                  ) : (
                    widgetRows.map((widget) => (
                      <TableRow key={widget.id}>
                        <TableCell className="font-medium">
                          <div className="space-y-1">
                            <span>{widget.title}</span>
                            <p className="text-xs text-muted-foreground">
                              {widget.config ?? "No config"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <WidgetTypeBadge type={widget.type} />
                        </TableCell>
                        <TableCell>{widget.position ?? "—"}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <EditWidgetDialog
                              widget={widget}
                              dashboardId={row.id}
                            />
                            <DeleteWidgetButton
                              id={widget.id}
                              dashboardId={row.id}
                            />
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          <CreateWidgetForm dashboardId={row.id} />
        </section>
      </div>
    </main>
  );
}
