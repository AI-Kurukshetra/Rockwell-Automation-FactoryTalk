import Link from "next/link";
import type { ReactNode } from "react";

type ListPageLayoutProps = {
  header: ReactNode;
  stats?: ReactNode;
  children: ReactNode;
  pagination?: ReactNode;
  viewAllHref?: string;
  viewAllLabel?: string;
};

export function ListPageLayout({
  header,
  stats,
  children,
  pagination,
  viewAllHref,
  viewAllLabel = "View all",
}: ListPageLayoutProps) {
  return (
    <main className="min-h-screen bg-[linear-gradient(140deg,_oklch(0.98_0.02_210),_oklch(0.99_0_0)_55%,_oklch(0.95_0.03_260))]">
      <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col gap-10 px-6 pb-16 pt-10">
        {header}
        {stats}
        <section className="rounded-3xl border border-border/70 bg-card/70 p-6 shadow-sm">
          <div className="overflow-hidden rounded-2xl border border-border/70 bg-background/70">
            {children}
          </div>
          {pagination}
          {viewAllHref ? (
            <div className="mt-3 text-right text-xs text-muted-foreground">
              Need the full archive?{" "}
              <Link className="font-medium text-primary hover:underline" href={viewAllHref}>
                {viewAllLabel}
              </Link>
            </div>
          ) : null}
        </section>
      </div>
    </main>
  );
}
