import { redirect } from "next/navigation";

import { CreateAlarmForm } from "@/components/alarms/CreateAlarmForm";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { createServerClientReadOnly } from "@/lib/supabase/server";

export default async function AlarmsNewPage() {
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
          eyebrow="Alarm Management"
          title="Create Alarm"
          subtitle="Log a new event for operators"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Alarms", href: "/dashboard/alarms" },
            { label: "Create" },
          ]}
          tabs={{ basePath: "/dashboard/alarms", listLabel: "List", newLabel: "Create" }}
        />
        <section className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm">
          <CreateAlarmForm
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
