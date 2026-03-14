import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";


import { DeleteEquipmentButton } from "@/components/equipment/DeleteEquipmentButton";
import { EditEquipmentDialog } from "@/components/equipment/EditEquipmentDialog";
import { EquipmentStatusBadge } from "@/components/equipment/EquipmentStatusBadge";
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
import { EquipmentStatus } from "@/lib/validation/equipment";

type EquipmentRow = {
  id: string;
  name: string;
  status: EquipmentStatus;
  location: string | null;
  last_seen: string | null;
  notes: string | null;
  created_at: string;
};

const PAGE_SIZE = 50;

export default async function EquipmentAllPage({
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

  const { data: equipment, error, count } = await supabase
    .from("equipment")
    .select("id,name,status,location,last_seen,notes,created_at", {
      count: "exact",
    })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (equipment ?? []) as EquipmentRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <ListPageLayout
      header={
        <DashboardHeader
          eyebrow="Equipment"
          title="All Equipment"
          subtitle="Paginated equipment registry"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Equipment", href: "/dashboard/equipment" },
            { label: "All" },
          ]}
          tabs={{ basePath: "/dashboard/equipment", listLabel: "List", newLabel: "Add" }}
        />
      }
      pagination={
        <PaginationBar
          basePath="/dashboard/equipment/all"
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
            <TableHead>Status</TableHead>
            <TableHead>Location</TableHead>
            <TableHead>Last Seen</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No equipment found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">{row.name}</TableCell>
                <TableCell>
                  <EquipmentStatusBadge status={row.status} />
                </TableCell>
                <TableCell>{row.location ?? "—"}</TableCell>
                <TableCell>
                  {row.last_seen
                    ? new Date(row.last_seen).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditEquipmentDialog
                      equipment={{
                        id: row.id,
                        name: row.name,
                        status: row.status,
                        location: row.location,
                        last_seen: row.last_seen,
                        notes: row.notes,
                      }}
                    />
                    <DeleteEquipmentButton id={row.id} />
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
