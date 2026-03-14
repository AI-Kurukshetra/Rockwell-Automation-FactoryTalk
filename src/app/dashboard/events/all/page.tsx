import { redirect } from "next/navigation";

import { DeleteEventLogButton } from "@/components/events/DeleteEventLogButton";
import { EditEventLogDialog } from "@/components/events/EditEventLogDialog";
import { EventSeverityBadge } from "@/components/events/EventSeverityBadge";
import { EventTypeBadge } from "@/components/events/EventTypeBadge";
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
import { EventSeverity, EventType } from "@/lib/validation/event";

export const dynamic = "force-dynamic";

type EventRow = {
  id: string;
  title: string;
  type: EventType;
  severity: EventSeverity;
  actor: string | null;
  details: string | null;
  occurred_at: string | null;
  created_at: string;
};

const PAGE_SIZE = 50;

export default async function EventsAllPage({
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

  const { data: events, error, count } = await supabase
    .from("event_logs")
    .select(
      "id,title,type,severity,actor,details,occurred_at,created_at",
      { count: "exact" },
    )
    .order("occurred_at", { ascending: false })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (error) {
    throw new Error(error.message);
  }

  const rows = (events ?? []) as EventRow[];
  const totalPages = Math.max(1, Math.ceil((count ?? 0) / PAGE_SIZE));

  return (
    <ListPageLayout
      header={
        <DashboardHeader
          eyebrow="Event Logging"
          title="All Event Logs"
          subtitle="Paginated audit history"
          email={authData.user.email}
          breadcrumbs={[
            { label: "Dashboard", href: "/dashboard/overview" },
            { label: "Events", href: "/dashboard/events" },
            { label: "All" },
          ]}
          tabs={{ basePath: "/dashboard/events", listLabel: "List", newLabel: "Log" }}
        />
      }
      pagination={
        <PaginationBar
          basePath="/dashboard/events/all"
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
            <TableHead>Title</TableHead>
            <TableHead>Type</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Actor</TableHead>
            <TableHead>Occurred</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center">
                No events found.
              </TableCell>
            </TableRow>
          ) : (
            rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell className="font-medium">
                  <div className="space-y-1">
                    <span>{row.title}</span>
                    {row.details ? (
                      <p className="text-xs text-muted-foreground">
                        {row.details}
                      </p>
                    ) : null}
                  </div>
                </TableCell>
                <TableCell>
                  <EventTypeBadge type={row.type} />
                </TableCell>
                <TableCell>
                  <EventSeverityBadge severity={row.severity} />
                </TableCell>
                <TableCell>{row.actor ?? "—"}</TableCell>
                <TableCell>
                  {row.occurred_at
                    ? new Date(row.occurred_at).toLocaleString("en-US", {
                        month: "short",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      })
                    : "—"}
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <EditEventLogDialog event={row} />
                    <DeleteEventLogButton id={row.id} />
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
