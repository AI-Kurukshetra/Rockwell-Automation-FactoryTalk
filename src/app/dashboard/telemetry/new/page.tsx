import { redirect } from "next/navigation";

import { CreateTelemetryForm } from "@/components/telemetry/CreateTelemetryForm";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { createServerClientReadOnly } from "@/lib/supabase/server";

export default async function TelemetryNewPage() {
  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  const { data: equipmentOptions } = await supabase
    .from("equipment")
    .select("id,name")
    .order("name", { ascending: true });

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,_oklch(0.98_0.02_210),_oklch(0.99_0_0)_55%,_oklch(0.95_0.03_260))]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
        <DashboardHeader
          eyebrow="Historical Data Logging"
          title="Log Telemetry"
          subtitle="Capture a new reading"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Telemetry", href: "/dashboard/telemetry" },
            { label: "Log" },
          ]}
          tabs={{ basePath: "/dashboard/telemetry", listLabel: "List", newLabel: "Log" }}
        />
        <section className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm">
          <CreateTelemetryForm
            equipmentOptions={(equipmentOptions ?? []) as {
              id: string;
              name: string;
            }[]}
          />
        </section>
      </div>
    </main>
  );
}
