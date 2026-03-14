import type { ReactNode } from "react";

type StatCardProps = {
  label: string;
  value: ReactNode;
  tone?: "default" | "muted";
  footer?: ReactNode;
};

export function StatCard({ label, value, tone = "default", footer }: StatCardProps) {
  return (
    <div className="rounded-2xl border border-border/70 bg-card/70 p-4 shadow-sm">
      <p className="text-xs uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </p>
      <p
        className={
          tone === "muted"
            ? "mt-2 text-2xl font-semibold text-muted-foreground"
            : "mt-2 text-2xl font-semibold"
        }
      >
        {value}
      </p>
      {footer ? <div className="mt-3">{footer}</div> : null}
    </div>
  );
}
