import { redirect } from "next/navigation";

import { CreateEventLogForm } from "@/components/events/CreateEventLogForm";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { createServerClientReadOnly } from "@/lib/supabase/server";

export default async function EventNewPage() {
  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,_oklch(0.98_0.02_210),_oklch(0.99_0_0)_55%,_oklch(0.95_0.03_260))]">
      <div className="mx-auto flex min-h-screen w-full max-w-4xl flex-col gap-10 px-6 pb-16 pt-10">
        <DashboardHeader
          eyebrow="Event Logging"
          title="Log Event"
          subtitle="Capture new audit entries"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Events", href: "/dashboard/events" },
            { label: "Log" },
          ]}
          tabs={{ basePath: "/dashboard/events", listLabel: "List", newLabel: "Log" }}
        />
        <CreateEventLogForm />
      </div>
    </main>
  );
}
