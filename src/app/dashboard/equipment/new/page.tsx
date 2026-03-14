import { redirect } from "next/navigation";

import { CreateEquipmentForm } from "@/components/equipment/CreateEquipmentForm";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { createServerClientReadOnly } from "@/lib/supabase/server";

export default async function EquipmentNewPage() {
  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,_oklch(0.98_0.02_210),_oklch(0.99_0_0)_55%,_oklch(0.95_0.03_260))]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
        <DashboardHeader
          eyebrow="Equipment"
          title="Add Equipment"
          subtitle="Register a new asset"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Equipment", href: "/dashboard/equipment" },
            { label: "Add" },
          ]}
          tabs={{ basePath: "/dashboard/equipment", listLabel: "List", newLabel: "Add" }}
        />
        <section className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm">
          <CreateEquipmentForm />
        </section>
      </div>
    </main>
  );
}
