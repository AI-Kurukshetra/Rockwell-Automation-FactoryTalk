import { redirect } from "next/navigation";

import { CreateProductionOrderForm } from "@/components/production/CreateProductionOrderForm";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { createServerClientReadOnly } from "@/lib/supabase/server";

export default async function ProductionNewPage() {
  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,_oklch(0.98_0.02_210),_oklch(0.99_0_0)_55%,_oklch(0.95_0.03_260))]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 pb-16 pt-10">
        <DashboardHeader
          eyebrow="Production Scheduling"
          title="Create Production Order"
          subtitle="Define new jobs and planned timelines"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Production", href: "/dashboard/production" },
            { label: "Create" },
          ]}
          tabs={{ basePath: "/dashboard/production", listLabel: "List", newLabel: "Create" }}
        />
        <CreateProductionOrderForm />
      </div>
    </main>
  );
}
