-- Replace with a real auth.users.id before running.
-- Example: select id from auth.users limit 1;
create extension if not exists "uuid-ossp";

do $$
declare
  seed_user uuid := '002b683c-0f18-4626-99c6-37a6e7570cda';
  seed_namespace uuid := uuid_generate_v5('00000000-0000-0000-0000-000000000000', seed_user::text);
begin
  with seed_equipment as (
    select
      uuid_generate_v5(seed_namespace, 'equipment:' || name) as id,
      seed_user as user_id,
      name,
      status,
      location,
      last_seen,
      notes
    from (
      values
        ('Filling Line 1', 'online', 'Zone A / Line 1', now() - interval '12 minutes', 'Nominal throughput'),
        ('Filling Line 2', 'maintenance', 'Zone A / Line 2', now() - interval '3 hours', 'Seal inspection'),
        ('Filling Line 3', 'online', 'Zone A / Line 3', now() - interval '9 minutes', 'OEE 93%'),
        ('Mixer Unit 1', 'idle', 'Zone B / Prep', now() - interval '2 hours', 'Awaiting batch'),
        ('Mixer Unit 2', 'offline', 'Zone B / Prep', now() - interval '6 hours', 'Power cycle scheduled'),
        ('Packaging Cell 1', 'online', 'Zone C / Pack', now() - interval '5 minutes', 'All green'),
        ('Packaging Cell 2', 'online', 'Zone C / Pack', now() - interval '20 minutes', 'Minor vibration alert'),
        ('Packaging Cell 3', 'maintenance', 'Zone C / Pack', now() - interval '1 day', 'Conveyor belt replacement'),
        ('Palletizer 1', 'online', 'Zone D / Shipping', now() - interval '18 minutes', 'Cycle stable'),
        ('Palletizer 2', 'idle', 'Zone D / Shipping', now() - interval '4 hours', 'Awaiting dispatch'),
        ('Compressor A', 'online', 'Utilities / West', now() - interval '2 minutes', 'Pressure steady'),
        ('Compressor B', 'maintenance', 'Utilities / West', now() - interval '8 hours', 'Filter replacement'),
        ('Boiler 1', 'online', 'Utilities / East', now() - interval '7 minutes', 'Steam output nominal'),
        ('Boiler 2', 'offline', 'Utilities / East', now() - interval '3 days', 'Safety check pending'),
        ('Conveyor Loop 1', 'online', 'Zone A / Transfer', now() - interval '15 minutes', null),
        ('Conveyor Loop 2', 'idle', 'Zone B / Transfer', now() - interval '3 hours', null),
        ('Labeling Station 1', 'online', 'Zone C / Pack', now() - interval '6 minutes', null),
        ('Labeling Station 2', 'online', 'Zone C / Pack', now() - interval '11 minutes', null),
        ('Capping Unit 1', 'online', 'Zone A / Line 1', now() - interval '9 minutes', null),
        ('Capping Unit 2', 'maintenance', 'Zone A / Line 2', now() - interval '12 hours', 'Torque calibration'),
        ('Quality Scan 1', 'online', 'Zone A / QA', now() - interval '4 minutes', 'Yield 99.2%'),
        ('Quality Scan 2', 'idle', 'Zone B / QA', now() - interval '5 hours', null),
        ('Cooling Tunnel 1', 'online', 'Zone B / Process', now() - interval '13 minutes', null),
        ('Cooling Tunnel 2', 'online', 'Zone B / Process', now() - interval '22 minutes', null),
        ('Heating Oven 1', 'online', 'Zone B / Process', now() - interval '17 minutes', null),
        ('Heating Oven 2', 'offline', 'Zone B / Process', now() - interval '2 days', 'Spare parts ordered'),
        ('Robot Arm 1', 'online', 'Zone C / Pack', now() - interval '3 minutes', 'Cycle time 14s'),
        ('Robot Arm 2', 'maintenance', 'Zone C / Pack', now() - interval '7 hours', 'Sensor alignment'),
        ('AGV Dock 1', 'idle', 'Zone D / Shipping', now() - interval '6 hours', null),
        ('AGV Dock 2', 'online', 'Zone D / Shipping', now() - interval '19 minutes', null),
        ('Weigh Station 1', 'online', 'Zone A / QA', now() - interval '10 minutes', null),
        ('Weigh Station 2', 'online', 'Zone A / QA', now() - interval '14 minutes', null),
        ('CIP System', 'idle', 'Utilities / West', now() - interval '8 hours', 'Scheduled for night shift'),
        ('Water Filtration', 'online', 'Utilities / West', now() - interval '21 minutes', null),
        ('Air Dryer', 'online', 'Utilities / West', now() - interval '16 minutes', null),
        ('Generator 1', 'offline', 'Utilities / East', now() - interval '5 days', 'Inspection due'),
        ('Generator 2', 'online', 'Utilities / East', now() - interval '25 minutes', null),
        ('Filling Line 4', 'online', 'Zone A / Line 4', now() - interval '8 minutes', null),
        ('Filling Line 5', 'idle', 'Zone A / Line 5', now() - interval '2 hours', null),
        ('Packaging Cell 4', 'online', 'Zone C / Pack', now() - interval '12 minutes', null),
        ('Packaging Cell 5', 'online', 'Zone C / Pack', now() - interval '9 minutes', null),
        ('Palletizer 3', 'maintenance', 'Zone D / Shipping', now() - interval '1 day', 'Hydraulic service'),
        ('Loader Station 1', 'online', 'Zone D / Shipping', now() - interval '6 minutes', null),
        ('Loader Station 2', 'idle', 'Zone D / Shipping', now() - interval '5 hours', null),
        ('Vision Check 1', 'online', 'Zone A / QA', now() - interval '7 minutes', 'False reject rate 0.3%'),
        ('Vision Check 2', 'online', 'Zone B / QA', now() - interval '13 minutes', null),
        ('Mixing Tank 3', 'online', 'Zone B / Prep', now() - interval '18 minutes', null),
        ('Mixing Tank 4', 'maintenance', 'Zone B / Prep', now() - interval '11 hours', 'Agitator check'),
        ('Cooling Tower 1', 'online', 'Utilities / North', now() - interval '24 minutes', null),
        ('Cooling Tower 2', 'online', 'Utilities / North', now() - interval '28 minutes', null)
    ) as v(name, status, location, last_seen, notes)
  )
  insert into public.equipment (id, user_id, name, status, location, last_seen, notes)
  select id, user_id, name, status, location, last_seen, notes
  from seed_equipment
  on conflict (id) do update set
    name = excluded.name,
    status = excluded.status,
    location = excluded.location,
    last_seen = excluded.last_seen,
    notes = excluded.notes;

  with seed_alarms as (
    select
      uuid_generate_v5(seed_namespace, 'alarm:' || title) as id,
      seed_user as user_id,
      (select id from public.equipment where user_id = seed_user and name = equipment_name limit 1) as equipment_id,
      title,
      description,
      severity,
      status,
      created_at,
      acknowledged_at,
      resolved_at
    from (
      values
        (
          'Packaging Cell 3',
          'Packaging Cell 3 temperature spike',
          'Temperature exceeded 85C for 4 minutes.',
          'high',
          'active',
          now() - interval '25 minutes',
          null,
          null
        ),
        (
          'Compressor B',
          'Compressor B filter replacement overdue',
          'Filter service window exceeded by 2 hours.',
          'medium',
          'acknowledged',
          now() - interval '6 hours',
          now() - interval '5 hours',
          null
        ),
        (
          'Boiler 2',
          'Boiler 2 safety check pending',
          'Pressure anomaly detected, unit stopped.',
          'critical',
          'active',
          now() - interval '2 days',
          null,
          null
        ),
        (
          'Mixer Unit 2',
          'Mixer Unit 2 power cycle required',
          'Unexpected shutdown detected. Manual restart required.',
          'high',
          'acknowledged',
          now() - interval '8 hours',
          now() - interval '7 hours',
          null
        ),
        (
          'Filling Line 2',
          'Filling Line 2 seal inspection',
          'Seal wear above tolerance.',
          'medium',
          'resolved',
          now() - interval '1 day',
          now() - interval '23 hours',
          now() - interval '20 hours'
        )
    ) as v(
      equipment_name,
      title,
      description,
      severity,
      status,
      created_at,
      acknowledged_at,
      resolved_at
    )
  )
  insert into public.alarms (
    id,
    user_id,
    equipment_id,
    title,
    description,
    severity,
    status,
    created_at,
    acknowledged_at,
    resolved_at
  )
  select
    id,
    user_id,
    equipment_id,
    title,
    description,
    severity,
    status,
    created_at,
    acknowledged_at,
    resolved_at
  from seed_alarms
  on conflict (id) do update set
    title = excluded.title,
    description = excluded.description,
    severity = excluded.severity,
    status = excluded.status,
    created_at = excluded.created_at,
    acknowledged_at = excluded.acknowledged_at,
    resolved_at = excluded.resolved_at;

  with seed_telemetry as (
    select
      uuid_generate_v5(seed_namespace, 'telemetry:' || equipment_name || ':' || metric || ':' || recorded_at::text) as id,
      seed_user as user_id,
      (select id from public.equipment where user_id = seed_user and name = equipment_name limit 1) as equipment_id,
      metric,
      value,
      unit,
      recorded_at
    from (
      values
        ('Filling Line 1', 'temperature', 68.4, 'C', now() - interval '35 minutes'),
        ('Filling Line 1', 'pressure', 1.8, 'bar', now() - interval '30 minutes'),
        ('Filling Line 2', 'temperature', 72.1, 'C', now() - interval '40 minutes'),
        ('Filling Line 3', 'temperature', 66.9, 'C', now() - interval '25 minutes'),
        ('Mixer Unit 1', 'rpm', 1320, 'rpm', now() - interval '18 minutes'),
        ('Mixer Unit 2', 'rpm', 0, 'rpm', now() - interval '2 hours'),
        ('Packaging Cell 1', 'throughput', 420, 'units/hr', now() - interval '12 minutes'),
        ('Packaging Cell 2', 'throughput', 380, 'units/hr', now() - interval '20 minutes'),
        ('Compressor A', 'pressure', 6.2, 'bar', now() - interval '9 minutes'),
        ('Compressor B', 'pressure', 5.8, 'bar', now() - interval '3 hours'),
        ('Boiler 1', 'steam_output', 14.2, 't/hr', now() - interval '15 minutes'),
        ('Boiler 2', 'steam_output', 0.0, 't/hr', now() - interval '2 days'),
        ('Cooling Tunnel 1', 'temperature', 9.4, 'C', now() - interval '14 minutes'),
        ('Cooling Tunnel 2', 'temperature', 9.9, 'C', now() - interval '16 minutes'),
        ('Heating Oven 1', 'temperature', 182.3, 'C', now() - interval '10 minutes'),
        ('Heating Oven 2', 'temperature', 0.0, 'C', now() - interval '2 days'),
        ('Robot Arm 1', 'cycle_time', 14.2, 's', now() - interval '8 minutes'),
        ('Robot Arm 2', 'cycle_time', 0.0, 's', now() - interval '7 hours'),
        ('Quality Scan 1', 'reject_rate', 0.8, '%', now() - interval '6 minutes'),
        ('Quality Scan 2', 'reject_rate', 1.2, '%', now() - interval '4 hours')
    ) as v(equipment_name, metric, value, unit, recorded_at)
  )
  insert into public.telemetry (
    id,
    user_id,
    equipment_id,
    metric,
    value,
    unit,
    recorded_at
  )
  select id, user_id, equipment_id, metric, value, unit, recorded_at
  from seed_telemetry
  on conflict (id) do update set
    metric = excluded.metric,
    value = excluded.value,
    unit = excluded.unit,
    recorded_at = excluded.recorded_at;

  with seed_production as (
    select
      uuid_generate_v5(seed_namespace, 'production:' || order_number) as id,
      seed_user as user_id,
      order_number,
      product_name,
      line,
      quantity,
      status,
      priority,
      scheduled_start,
      scheduled_end,
      actual_start,
      actual_end,
      notes
    from (
      values
        (
          'PO-1042',
          'Sparkling Water 500ml',
          'Line A / Filling',
          18000,
          'in_progress',
          'high',
          now() - interval '2 hours',
          now() + interval '4 hours',
          now() - interval '90 minutes',
          null,
          'Rush order for retail partner'
        ),
        (
          'PO-1043',
          'Still Water 1L',
          'Line B / Filling',
          22000,
          'planned',
          'medium',
          now() + interval '6 hours',
          now() + interval '14 hours',
          null,
          null,
          'Shift B scheduled'
        ),
        (
          'PO-1044',
          'Citrus Energy 330ml',
          'Line C / Mix',
          12000,
          'paused',
          'high',
          now() - interval '6 hours',
          now() + interval '2 hours',
          now() - interval '5 hours',
          null,
          'Waiting on ingredient delivery'
        ),
        (
          'PO-1038',
          'Mineral Water 750ml',
          'Line A / Filling',
          15000,
          'completed',
          'low',
          now() - interval '2 days',
          now() - interval '1 day 18 hours',
          now() - interval '2 days',
          now() - interval '1 day 19 hours',
          'No issues'
        ),
        (
          'PO-1040',
          'Tonic Water 500ml',
          'Line D / Pack',
          9000,
          'cancelled',
          'medium',
          now() - interval '1 day',
          now() - interval '20 hours',
          null,
          null,
          'Customer postponed'
        )
    ) as v(
      order_number,
      product_name,
      line,
      quantity,
      status,
      priority,
      scheduled_start,
      scheduled_end,
      actual_start,
      actual_end,
      notes
    )
  )
  insert into public.production_orders (
    id,
    user_id,
    order_number,
    product_name,
    line,
    quantity,
    status,
    priority,
    scheduled_start,
    scheduled_end,
    actual_start,
    actual_end,
    notes
  )
  select
    id,
    user_id,
    order_number,
    product_name,
    line,
    quantity,
    status,
    priority,
    scheduled_start,
    scheduled_end,
    actual_start,
    actual_end,
    notes
  from seed_production
  on conflict (id) do update set
    order_number = excluded.order_number,
    product_name = excluded.product_name,
    line = excluded.line,
    quantity = excluded.quantity,
    status = excluded.status,
    priority = excluded.priority,
    scheduled_start = excluded.scheduled_start,
    scheduled_end = excluded.scheduled_end,
    actual_start = excluded.actual_start,
    actual_end = excluded.actual_end,
    notes = excluded.notes;

  with seed_quality as (
    select
      uuid_generate_v5(seed_namespace, 'quality:' || record_number) as id,
      seed_user as user_id,
      record_number,
      product_name,
      line,
      status,
      defect_type,
      defect_count,
      inspected_at,
      notes
    from (
      values
        (
          'QR-9001',
          'Sparkling Water 500ml',
          'Line A / QA',
          'pass',
          null,
          0,
          now() - interval '35 minutes',
          'Inline inspection passed'
        ),
        (
          'QR-9002',
          'Sparkling Water 500ml',
          'Line A / QA',
          'fail',
          'Seal leak',
          18,
          now() - interval '2 hours',
          'Batch held for rework'
        ),
        (
          'QR-9003',
          'Citrus Energy 330ml',
          'Line C / QA',
          'rework',
          'Label misalignment',
          42,
          now() - interval '5 hours',
          'Rework on packaging line'
        ),
        (
          'QR-9004',
          'Mineral Water 750ml',
          'Line B / QA',
          'pass',
          null,
          0,
          now() - interval '1 day',
          'All checks within tolerance'
        ),
        (
          'QR-9005',
          'Tonic Water 500ml',
          'Line D / QA',
          'fail',
          'Fill level low',
          12,
          now() - interval '3 hours',
          'Adjust filler calibration'
        )
    ) as v(
      record_number,
      product_name,
      line,
      status,
      defect_type,
      defect_count,
      inspected_at,
      notes
    )
  )
  insert into public.quality_records (
    id,
    user_id,
    record_number,
    product_name,
    line,
    status,
    defect_type,
    defect_count,
    inspected_at,
    notes
  )
  select
    id,
    user_id,
    record_number,
    product_name,
    line,
    status,
    defect_type,
    defect_count,
    inspected_at,
    notes
  from seed_quality
  on conflict (id) do update set
    record_number = excluded.record_number,
    product_name = excluded.product_name,
    line = excluded.line,
    status = excluded.status,
    defect_type = excluded.defect_type,
    defect_count = excluded.defect_count,
    inspected_at = excluded.inspected_at,
    notes = excluded.notes;

  with seed_events as (
    select
      uuid_generate_v5(seed_namespace, 'event:' || title || ':' || occurred_at::text) as id,
      seed_user as user_id,
      title,
      type,
      severity,
      actor,
      details,
      occurred_at
    from (
      values
        (
          'Operator login',
          'auth',
          'info',
          'ops.supervisor@plant.local',
          'Shift A lead logged in.',
          now() - interval '2 hours'
        ),
        (
          'Filling Line 2 paused',
          'equipment',
          'warning',
          'System',
          'Line paused due to seal inspection.',
          now() - interval '3 hours'
        ),
        (
          'Critical alarm acknowledged',
          'alarm',
          'critical',
          'maintenance.tech',
          'Boiler 2 pressure anomaly acknowledged.',
          now() - interval '1 day'
        ),
        (
          'Production schedule updated',
          'production',
          'info',
          'planner.team',
          'PO-1043 rescheduled by 4 hours.',
          now() - interval '6 hours'
        ),
        (
          'Quality batch held',
          'quality',
          'warning',
          'qa.manager',
          'QR-9002 held for rework.',
          now() - interval '5 hours'
        )
    ) as v(title, type, severity, actor, details, occurred_at)
  )
  insert into public.event_logs (
    id,
    user_id,
    title,
    type,
    severity,
    actor,
    details,
    occurred_at
  )
  select
    id,
    user_id,
    title,
    type,
    severity,
    actor,
    details,
    occurred_at
  from seed_events
  on conflict (id) do update set
    title = excluded.title,
    type = excluded.type,
    severity = excluded.severity,
    actor = excluded.actor,
    details = excluded.details,
    occurred_at = excluded.occurred_at;

  with seed_scada as (
    select
      uuid_generate_v5(seed_namespace, 'scada:' || name) as id,
      seed_user as user_id,
      name,
      protocol,
      endpoint,
      status,
      last_sync,
      notes
    from (
      values
        (
          'PLC Gateway A',
          'opc_ua',
          'opc.tcp://10.0.0.15:4840',
          'online',
          now() - interval '7 minutes',
          'Primary gateway for filling lines'
        ),
        (
          'Utility PLC West',
          'modbus',
          'tcp://10.0.1.12:502',
          'degraded',
          now() - interval '2 hours',
          'Intermittent polling delays'
        ),
        (
          'Packaging Cell Network',
          'ethernet_ip',
          'enip://10.0.2.30',
          'online',
          now() - interval '18 minutes',
          'Packaging cell controller'
        ),
        (
          'Telemetry Broker',
          'mqtt',
          'mqtt://10.0.3.8:1883',
          'online',
          now() - interval '4 minutes',
          'Central telemetry broker'
        ),
        (
          'Mixer Profinet Node',
          'profinet',
          'pnio://10.0.4.20',
          'offline',
          now() - interval '1 day',
          'Awaiting firmware update'
        )
    ) as v(name, protocol, endpoint, status, last_sync, notes)
  )
  insert into public.scada_connections (
    id,
    user_id,
    name,
    protocol,
    endpoint,
    status,
    last_sync,
    notes
  )
  select
    id,
    user_id,
    name,
    protocol,
    endpoint,
    status,
    last_sync,
    notes
  from seed_scada
  on conflict (id) do update set
    name = excluded.name,
    protocol = excluded.protocol,
    endpoint = excluded.endpoint,
    status = excluded.status,
    last_sync = excluded.last_sync,
    notes = excluded.notes;
end $$;
