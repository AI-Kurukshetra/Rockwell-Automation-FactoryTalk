"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { signOut } from "@/app/actions/auth";
import { SectionTabs } from "@/components/navigation/SectionTabs";
import { Button } from "@/components/ui/button";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type DashboardHeaderProps = {
  eyebrow: string;
  title: string;
  subtitle?: string;
  email?: string | null;
  breadcrumbs?: BreadcrumbItem[];
  tabs?: {
    basePath: string;
    listLabel: string;
    newLabel: string;
  };
};

export function DashboardHeader({
  eyebrow,
  title,
  subtitle,
  email,
  breadcrumbs,
  tabs,
}: DashboardHeaderProps) {
  const pathname = usePathname();
  const isActive = (href: string) => {
    if (href === "/dashboard") {
      return pathname === "/dashboard" || pathname === "/dashboard/overview";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <header className="rounded-3xl border border-border/60 bg-card/70 p-5 shadow-sm">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <div className="mb-2 flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
              {breadcrumbs.map((item, index) => (
                <span key={`${item.label}-${index}`} className="flex items-center gap-2">
                  {item.href ? (
                    <Link href={item.href} className="hover:text-foreground">
                      {item.label}
                    </Link>
                  ) : (
                    <span className="text-foreground">{item.label}</span>
                  )}
                  {index < breadcrumbs.length - 1 ? <span>/</span> : null}
                </span>
              ))}
            </div>
          ) : null}
          <p className="text-xs uppercase tracking-[0.35em] text-muted-foreground">
            {eyebrow}
          </p>
          <h1 className="text-3xl font-semibold">{title}</h1>
          <p className="text-sm text-muted-foreground">
            {subtitle ?? "Operational view"}
            {email ? ` · ${email}` : ""}
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Button variant={isActive("/dashboard") ? "default" : "outline"} asChild>
            <Link href="/dashboard">Dashboard</Link>
          </Button>
          <Button variant={isActive("/dashboard/equipment") ? "default" : "outline"} asChild>
            <Link href="/dashboard/equipment">Equipment</Link>
          </Button>
          <Button variant={isActive("/dashboard/alarms") ? "default" : "outline"} asChild>
            <Link href="/dashboard/alarms">Alarms</Link>
          </Button>
          <Button variant={isActive("/dashboard/telemetry") ? "default" : "outline"} asChild>
            <Link href="/dashboard/telemetry">Telemetry</Link>
          </Button>
          <Button variant={isActive("/dashboard/scada") ? "default" : "outline"} asChild>
            <Link href="/dashboard/scada">SCADA</Link>
          </Button>
          <Button variant={isActive("/dashboard/quality") ? "default" : "outline"} asChild>
            <Link href="/dashboard/quality">Quality</Link>
          </Button>
          <Button variant={isActive("/dashboard/dashboards") ? "default" : "outline"} asChild>
            <Link href="/dashboard/dashboards">Dashboards</Link>
          </Button>
          <Button variant={isActive("/dashboard/production") ? "default" : "outline"} asChild>
            <Link href="/dashboard/production">Production</Link>
          </Button>
          <Button variant={isActive("/dashboard/events") ? "default" : "outline"} asChild>
            <Link href="/dashboard/events">Events</Link>
          </Button>
          <form action={signOut}>
            <Button type="submit">Sign out</Button>
          </form>
        </div>
      </div>
      {tabs ? (
        <div className="mt-4">
          <SectionTabs
            basePath={tabs.basePath}
            listLabel={tabs.listLabel}
            newLabel={tabs.newLabel}
          />
        </div>
      ) : null}
    </header>
  );
}
