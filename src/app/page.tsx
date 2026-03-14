import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top,_oklch(0.97_0.02_240)_0%,_oklch(0.99_0_0)_45%,_oklch(0.96_0.03_260)_100%)] text-foreground">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-6 pb-16 pt-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-2xl bg-primary text-primary-foreground">
              IA
            </span>
            <div>
              <p className="text-sm uppercase tracking-[0.3em] text-muted-foreground">
                Command Center
              </p>
              <h1 className="text-lg font-semibold">Industrial Automation</h1>
            </div>
          </div>
          <nav className="flex items-center gap-3">
            <Button asChild variant="ghost">
              <Link href="/login">Log in</Link>
            </Button>
            <Button asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </nav>
        </header>

        <section className="mt-20 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-6">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-muted-foreground">
              Real-time visibility
            </p>
            <h2 className="text-4xl font-semibold leading-tight sm:text-5xl">
              Orchestrate production floors with a single pane of glass.
            </h2>
            <p className="text-lg text-muted-foreground">
              Track equipment health, respond to alarms, and optimize throughput
              with a modern SCADA-inspired experience. Built for operators who
              need clarity in seconds.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link href="/signup">Launch Dashboard</Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link href="/login">View Demo Data</Link>
              </Button>
            </div>
          </div>

          <div className="rounded-3xl border border-border/60 bg-card/70 p-6 shadow-xl backdrop-blur">
            <div className="flex items-center justify-between border-b border-border/60 pb-4">
              <div>
                <p className="text-sm text-muted-foreground">
                  Live Equipment Status
                </p>
                <h3 className="text-xl font-semibold">Plant Alpha</h3>
              </div>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
                24 Online
              </span>
            </div>
            <div className="mt-6 space-y-4">
              {[
                {
                  name: "Filling Line 3",
                  status: "Online",
                  detail: "92% OEE",
                },
                {
                  name: "Packaging Cell 7",
                  status: "Maintenance",
                  detail: "ETA 45m",
                },
                {
                  name: "Mixer Unit 2",
                  status: "Idle",
                  detail: "Last run 2h ago",
                },
              ].map((item) => (
                <div
                  key={item.name}
                  className="flex items-center justify-between rounded-2xl border border-border/60 bg-background/70 px-4 py-3"
                >
                  <div>
                    <p className="font-medium">{item.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.detail}
                    </p>
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                    {item.status}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section className="mt-16 grid gap-4 md:grid-cols-3">
          {[
            {
              title: "Unified dashboards",
              desc: "Compose views for operators, supervisors, and plant managers.",
            },
            {
              title: "Alarm-ready workflows",
              desc: "Route critical events with clear ownership and audit trails.",
            },
            {
              title: "Secure by design",
              desc: "Role-based access and per-user data isolation via Supabase.",
            },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-2xl border border-border/70 bg-card/60 p-5"
            >
              <h4 className="text-lg font-semibold">{item.title}</h4>
              <p className="mt-2 text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </section>
      </div>
    </main>
  );
}
