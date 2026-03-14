"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";

type PaginationBarProps = {
  basePath: string;
  page: number;
  totalPages: number;
  totalCount: number;
  pageSize: number;
};

export function PaginationBar({
  basePath,
  page,
  totalPages,
  totalCount,
  pageSize,
}: PaginationBarProps) {
  const searchParams = useSearchParams();
  const pageParam = searchParams.get("page");
  const derivedPage = pageParam ? Number.parseInt(pageParam, 10) : page;
  const currentPage =
    Number.isFinite(derivedPage) && derivedPage > 0 ? derivedPage : page;
  const from = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const to = Math.min(currentPage * pageSize, totalCount);
  const hasPrev = currentPage > 1;
  const hasNext = currentPage < totalPages;
  const pages: (number | "ellipsis")[] = [];

  const push = (value: number | "ellipsis") => {
    if (pages[pages.length - 1] !== value) {
      pages.push(value);
    }
  };

  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i += 1) {
      push(i);
    }
  } else {
    push(1);
    if (currentPage > 3) {
      push("ellipsis");
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    for (let i = start; i <= end; i += 1) {
      push(i);
    }

    if (currentPage < totalPages - 2) {
      push("ellipsis");
    }
    push(totalPages);
  }

  return (
    <div className="mt-4 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-border/60 bg-background/70 px-4 py-3 text-sm text-muted-foreground">
      <span>
        Showing {from}-{to} of {totalCount}
      </span>
      <div className="flex items-center gap-2">
        {hasPrev ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`${basePath}?page=${currentPage - 1}`}>Previous</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Previous
          </Button>
        )}
        <div className="flex items-center gap-1">
          {pages.map((item, index) =>
            item === "ellipsis" ? (
              <span
                key={`ellipsis-${index}`}
                className="px-2 text-xs text-muted-foreground"
              >
                …
              </span>
            ) : (
              <Button
                key={item}
                asChild
                size="sm"
                variant="outline"
                className={
                  item === currentPage
                    ? "pointer-events-none !border-primary !bg-primary !text-primary-foreground ring-2 ring-primary/30"
                    : undefined
                }
              >
                <Link
                  href={`${basePath}?page=${item}`}
                  aria-current={item === currentPage ? "page" : undefined}
                >
                  {item}
                </Link>
              </Button>
            ),
          )}
        </div>
        {hasNext ? (
          <Button asChild variant="outline" size="sm">
            <Link href={`${basePath}?page=${currentPage + 1}`}>Next</Link>
          </Button>
        ) : (
          <Button variant="outline" size="sm" disabled>
            Next
          </Button>
        )}
      </div>
    </div>
  );
}
