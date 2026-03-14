"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

type SectionTabsProps = {
  basePath: string;
  listLabel: string;
  newLabel: string;
};

export function SectionTabs({ basePath, listLabel, newLabel }: SectionTabsProps) {
  const pathname = usePathname();
  const listPath = basePath;
  const newPath = `${basePath}/new`;

  return (
    <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 p-1">
      <Link
        href={listPath}
        className={cn(
          "rounded-full px-3 py-1.5 text-sm font-medium transition",
          pathname === listPath
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {listLabel}
      </Link>
      <Link
        href={newPath}
        className={cn(
          "rounded-full px-3 py-1.5 text-sm font-medium transition",
          pathname === newPath
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground",
        )}
      >
        {newLabel}
      </Link>
    </div>
  );
}
