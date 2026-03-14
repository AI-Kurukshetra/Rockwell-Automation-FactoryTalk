import { redirect } from "next/navigation";

import { DeleteDashboardButton } from "@/components/dashboards/DeleteDashboardButton";
import { EditDashboardDialog } from "@/components/dashboards/EditDashboardDialog";
import { ListPageLayout } from "@/components/layout/ListPageLayout";
import { DashboardHeader } from "@/components/navigation/DashboardHeader";
import { PaginationBar } from "@/components/navigation/PaginationBar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { createServerClientReadOnly } from "@/lib/supabase/server";
import Link from "next/link";

export const dynamic = "force-dynamic";

type DashboardRow = {
  id: string;
  name: string;
  description: string | null;
  created_at: string;
};

const PAGE_SIZE = 50;

export default async function DashboardsAllPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const page = Math.max(1, Number(searchParams.page ?? "1"));
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  const supabase = await createServerClientReadOnly();
  const { data: authData } = await supabase.auth.getUser();

  if (!authData.user) {
    redirect("/login");
  }

  const { data: dashboards, error, count } = await supabase
    .from("dashboards")
    .select("id,name,description,created_at", { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (dashboards ?? []) as DashboardRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <ListPageLayout
      header={
        <DashboardHeader
          eyebrow="Dashboard Builder"
          title="All Dashboards"
          subtitle="Paginated dashboard library"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Dashboards", href: "/dashboard/dashboards" },
            { label: "All" },
          ]}
          tabs={{ basePath: "/dashboard/dashboards", listLabel: "List", newLabel: "Create" }}
        />
      }
      pagination={
        <PaginationBar
          basePath="/dashboard/dashboards/all"
          page={page}
          totalPages={totalPages}
          totalCount={count ?? 0}
          pageSize={PAGE_SIZE}
        />
      }
    >
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Description</TableHead>
            <TableHead>Created</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={4} className="text-center">
                No dashboards found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  <Link
                    href={`/dashboard/dashboards/${row.id}`}
                    className="text-primary hover:underline"
                  >
                    {row.name}
                  </Link>
                </TableCell>
                <TableCell>{row.description ?? "—"}</TableCell>
                <TableCell>
                  {new Date(row.created_at).toLocaleString("en-US", {
                    month: "short",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditDashboardDialog dashboard={row} />
                    <DeleteDashboardButton id={row.id} />
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </ListPageLayout>
  );
}
