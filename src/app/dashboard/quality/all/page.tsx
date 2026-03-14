import { redirect } from "next/navigation";

import { DeleteQualityRecordButton } from "@/components/quality/DeleteQualityRecordButton";
import { EditQualityRecordDialog } from "@/components/quality/EditQualityRecordDialog";
import { QualityStatusBadge } from "@/components/quality/QualityStatusBadge";
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
import { QualityStatus } from "@/lib/validation/quality";

export const dynamic = "force-dynamic";

type QualityRow = {
  id: string;
  record_number: string;
  product_name: string;
  line: string;
  status: QualityStatus;
  defect_type: string | null;
  defect_count: number;
  inspected_at: string | null;
  notes: string | null;
  created_at: string;
};

const PAGE_SIZE = 50;

export default async function QualityAllPage({
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

  const { data: records, error, count } = await supabase
    .from("quality_records")
    .select(
      "id,record_number,product_name,line,status,defect_type,defect_count,inspected_at,notes,created_at",
      { count: "exact" },
    )
    .order("inspected_at", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (records ?? []) as QualityRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <ListPageLayout
      header={
        <DashboardHeader
          eyebrow="Quality Management"
          title="All Quality Records"
          subtitle="Paginated inspection history"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Quality", href: "/dashboard/quality" },
            { label: "All" },
          ]}
          tabs={{ basePath: "/dashboard/quality", listLabel: "List", newLabel: "Log" }}
        />
      }
      pagination={
        <PaginationBar
          basePath="/dashboard/quality/all"
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
            <TableHead>Record</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Line</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Defects</TableHead>
            <TableHead>Inspected</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No quality records found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <span>{row.record_number}</span>
                    <p className="text-xs text-muted-foreground">
                      {row.defect_type ?? "No defect type"}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{row.product_name}</TableCell>
                <TableCell>{row.line}</TableCell>
                <TableCell>
                  <QualityStatusBadge status={row.status} />
                </TableCell>
                <TableCell>{row.defect_count}</TableCell>
                <TableCell>
                  {row.inspected_at
                    ? new Date(row.inspected_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditQualityRecordDialog record={row} />
                    <DeleteQualityRecordButton id={row.id} />
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
