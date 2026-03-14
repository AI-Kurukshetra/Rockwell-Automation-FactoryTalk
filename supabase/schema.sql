create extension if not exists "pgcrypto";

create table if not exists public.equipment (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  status text not null default 'offline',
  location text,
  last_seen timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint equipment_status_check check (
    status in ('online', 'offline', 'maintenance', 'idle')
  )
);

create table if not exists public.alarms (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  equipment_id uuid references public.equipment (id) on delete set null,
  title text not null,
  description text,
  severity text not null default 'medium',
  status text not null default 'active',
  created_at timestamptz not null default now(),
  acknowledged_at timestamptz,
  resolved_at timestamptz,
  constraint alarms_severity_check check (
    severity in ('low', 'medium', 'high', 'critical')
  ),
  constraint alarms_status_check check (
    status in ('active', 'acknowledged', 'resolved')
  )
);

create table if not exists public.telemetry (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  equipment_id uuid not null references public.equipment (id) on delete cascade,
  metric text not null,
  value double precision not null,
  unit text,
  recorded_at timestamptz not null default now()
);

create table if not exists public.production_orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  order_number text not null,
  product_name text not null,
  line text not null,
  quantity integer not null,
  status text not null default 'planned',
  priority text not null default 'medium',
  scheduled_start timestamptz,
  scheduled_end timestamptz,
  actual_start timestamptz,
  actual_end timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint production_status_check check (
    status in ('planned', 'in_progress', 'paused', 'completed', 'cancelled')
  ),
  constraint production_priority_check check (
    priority in ('low', 'medium', 'high')
  )
);

create table if not exists public.quality_records (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  record_number text not null,
  product_name text not null,
  line text not null,
  status text not null default 'pass',
  defect_type text,
  defect_count integer not null default 0,
  inspected_at timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint quality_status_check check (
    status in ('pass', 'fail', 'rework')
  )
);

create table if not exists public.event_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  title text not null,
  type text not null default 'system',
  severity text not null default 'info',
  actor text,
  details text,
  occurred_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint event_type_check check (
    type in ('auth', 'equipment', 'alarm', 'telemetry', 'production', 'quality', 'system')
  ),
  constraint event_severity_check check (
    severity in ('info', 'warning', 'critical')
  )
);

create table if not exists public.scada_connections (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  name text not null,
  protocol text not null default 'opc_ua',
  endpoint text not null,
  status text not null default 'offline',
  last_sync timestamptz,
  notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint scada_protocol_check check (
    protocol in ('opc_ua', 'modbus', 'ethernet_ip', 'mqtt', 'profinet')
  ),
  constraint scada_status_check check (
    status in ('online', 'degraded', 'offline')
  )
);

create or replace function public.set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

drop trigger if exists set_equipment_updated_at on public.equipment;

create trigger set_equipment_updated_at
before update on public.equipment
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_production_updated_at on public.production_orders;

create trigger set_production_updated_at
before update on public.production_orders
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_quality_updated_at on public.quality_records;

create trigger set_quality_updated_at
before update on public.quality_records
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_event_updated_at on public.event_logs;

create trigger set_event_updated_at
before update on public.event_logs
for each row
execute procedure public.set_updated_at();

drop trigger if exists set_scada_updated_at on public.scada_connections;

create trigger set_scada_updated_at
before update on public.scada_connections
for each row
execute procedure public.set_updated_at();

alter table public.equipment enable row level security;
alter table public.alarms enable row level security;
alter table public.telemetry enable row level security;
alter table public.production_orders enable row level security;
alter table public.quality_records enable row level security;
alter table public.event_logs enable row level security;
alter table public.scada_connections enable row level security;

drop policy if exists "Equipment read" on public.equipment;
create policy "Equipment read"
on public.equipment
for select
using (auth.uid() = user_id);

drop policy if exists "Equipment insert" on public.equipment;
create policy "Equipment insert"
on public.equipment
for insert
with check (auth.uid() = user_id);

drop policy if exists "Equipment update" on public.equipment;
create policy "Equipment update"
on public.equipment
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Equipment delete" on public.equipment;
create policy "Equipment delete"
on public.equipment
for delete
using (auth.uid() = user_id);

drop policy if exists "Alarms read" on public.alarms;
create policy "Alarms read"
on public.alarms
for select
using (auth.uid() = user_id);

drop policy if exists "Alarms insert" on public.alarms;
create policy "Alarms insert"
on public.alarms
for insert
with check (auth.uid() = user_id);

drop policy if exists "Alarms update" on public.alarms;
create policy "Alarms update"
on public.alarms
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Alarms delete" on public.alarms;
create policy "Alarms delete"
on public.alarms
for delete
using (auth.uid() = user_id);

drop policy if exists "Telemetry read" on public.telemetry;
create policy "Telemetry read"
on public.telemetry
for select
using (auth.uid() = user_id);

drop policy if exists "Telemetry insert" on public.telemetry;
create policy "Telemetry insert"
on public.telemetry
for insert
with check (auth.uid() = user_id);

drop policy if exists "Telemetry update" on public.telemetry;
create policy "Telemetry update"
on public.telemetry
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Telemetry delete" on public.telemetry;
create policy "Telemetry delete"
on public.telemetry
for delete
using (auth.uid() = user_id);

drop policy if exists "Production read" on public.production_orders;
create policy "Production read"
on public.production_orders
for select
using (auth.uid() = user_id);

drop policy if exists "Production insert" on public.production_orders;
create policy "Production insert"
on public.production_orders
for insert
with check (auth.uid() = user_id);

drop policy if exists "Production update" on public.production_orders;
create policy "Production update"
on public.production_orders
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Production delete" on public.production_orders;
create policy "Production delete"
on public.production_orders
for delete
using (auth.uid() = user_id);

drop policy if exists "Quality read" on public.quality_records;
create policy "Quality read"
on public.quality_records
for select
using (auth.uid() = user_id);

drop policy if exists "Quality insert" on public.quality_records;
create policy "Quality insert"
on public.quality_records
for insert
with check (auth.uid() = user_id);

drop policy if exists "Quality update" on public.quality_records;
create policy "Quality update"
on public.quality_records
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Quality delete" on public.quality_records;
create policy "Quality delete"
on public.quality_records
for delete
using (auth.uid() = user_id);

drop policy if exists "Event read" on public.event_logs;
create policy "Event read"
on public.event_logs
for select
using (auth.uid() = user_id);

drop policy if exists "Event insert" on public.event_logs;
create policy "Event insert"
on public.event_logs
for insert
with check (auth.uid() = user_id);

drop policy if exists "Event update" on public.event_logs;
create policy "Event update"
on public.event_logs
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Event delete" on public.event_logs;
create policy "Event delete"
on public.event_logs
for delete
using (auth.uid() = user_id);

drop policy if exists "Scada read" on public.scada_connections;
create policy "Scada read"
on public.scada_connections
for select
using (auth.uid() = user_id);

drop policy if exists "Scada insert" on public.scada_connections;
create policy "Scada insert"
on public.scada_connections
for insert
with check (auth.uid() = user_id);

drop policy if exists "Scada update" on public.scada_connections;
create policy "Scada update"
on public.scada_connections
for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

drop policy if exists "Scada delete" on public.scada_connections;
create policy "Scada delete"
on public.scada_connections
for delete
using (auth.uid() = user_id);
