import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";


import { DeleteProductionOrderButton } from "@/components/production/DeleteProductionOrderButton";
import { EditProductionOrderDialog } from "@/components/production/EditProductionOrderDialog";
import { ProductionPriorityBadge } from "@/components/production/ProductionPriorityBadge";
import { ProductionStatusBadge } from "@/components/production/ProductionStatusBadge";
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
import {
  ProductionPriority,
  ProductionStatus,
} from "@/lib/validation/production";

type ProductionRow = {
  id: string;
  order_number: string;
  product_name: string;
  line: string;
  quantity: number;
  status: ProductionStatus;
  priority: ProductionPriority;
  scheduled_start: string | null;
  scheduled_end: string | null;
  actual_start: string | null;
  actual_end: string | null;
  notes: string | null;
  created_at: string;
};

const PAGE_SIZE = 50;

export default async function ProductionAllPage({
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

  const { data: orders, error, count } = await supabase
    .from("production_orders")
    .select(
      "id,order_number,product_name,line,quantity,status,priority,scheduled_start,scheduled_end,actual_start,actual_end,notes,created_at",
      { count: "exact" },
    )
    .order("scheduled_start", { ascending: true })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (orders ?? []) as ProductionRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <ListPageLayout
      header={
        <DashboardHeader
          eyebrow="Production Scheduling"
          title="All Production Orders"
          subtitle="Paginated production schedule"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Production", href: "/dashboard/production" },
            { label: "All" },
          ]}
          tabs={{ basePath: "/dashboard/production", listLabel: "List", newLabel: "Create" }}
        />
      }
      pagination={
        <PaginationBar
          basePath="/dashboard/production/all"
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
            <TableHead>Order</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Line</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Priority</TableHead>
            <TableHead>Scheduled</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No production orders found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <span>{row.order_number}</span>
                    <p className="text-xs text-muted-foreground">
                      Qty {row.quantity}
                    </p>
                  </div>
                </TableCell>
                <TableCell>{row.product_name}</TableCell>
                <TableCell>{row.line}</TableCell>
                <TableCell>
                  <ProductionStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  <ProductionPriorityBadge priority={row.priority} />
                </TableCell>
                <TableCell>
                  <div className="space-y-1 text-xs text-muted-foreground">
                    <p>
                      {row.scheduled_start
                        ? new Date(row.scheduled_start).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                    <p>
                      {row.scheduled_end
                        ? new Date(row.scheduled_end).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : "—"}
                    </p>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditProductionOrderDialog order={row} />
                    <DeleteProductionOrderButton id={row.id} />
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
