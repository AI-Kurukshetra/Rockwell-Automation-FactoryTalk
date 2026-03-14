"use client";

import { ReactNode } from "react";

type ChartCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export function ChartCard({ title, subtitle, children }: ChartCardProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-5 shadow-sm">
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
          {title}
        </p>
        {subtitle ? (
          <p className="text-sm font-medium text-foreground">{subtitle}</p>
        ) : null}
      </div>
      <div className="mt-4 h-40">{children}</div>
    </div>
  );
}
