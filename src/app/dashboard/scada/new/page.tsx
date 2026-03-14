import { redirect } from "next/navigation";

import { CreateScadaConnectionForm } from "@/components/scada/CreateScadaConnectionForm";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { createServerClientReadOnly } from "@/lib/supabase/server";

export default async function ScadaNewPage() {
  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,_oklch(0.98_0.02_210),_oklch(0.99_0_0)_55%,_oklch(0.95_0.03_260))]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 pb-16 pt-10">
        <DashboardHeader
          eyebrow="SCADA Integration"
          title="Add SCADA Connection"
          subtitle="Register new PLC or SCADA endpoints"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "SCADA", href: "/dashboard/scada" },
            { label: "Add" },
          ]}
          tabs={{ basePath: "/dashboard/scada", listLabel: "List", newLabel: "Add" }}
        />
        <CreateScadaConnectionForm />
      </div>
    </main>
  );
}
