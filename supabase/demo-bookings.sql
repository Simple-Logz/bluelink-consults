-- Booking data is readable only by explicitly enrolled demo administrators.
create table public.demo_booking_admins (
  user_id uuid primary key references auth.users(id) on delete cascade
);
alter table public.demo_booking_admins enable row level security;
revoke all on public.demo_booking_admins from anon, authenticated;
grant select on public.demo_booking_admins to authenticated;
create policy "Read own demo admin membership" on public.demo_booking_admins
  for select to authenticated using (user_id = (select auth.uid()));
insert into public.demo_booking_admins(user_id)
  select id from public.profiles where role = 'admin' on conflict do nothing;

create table public.demo_slots (
  id uuid primary key default gen_random_uuid(),
  starts_at timestamptz not null unique,
  duration_minutes integer not null default 30 check (duration_minutes = 30),
  enabled boolean not null default true,
  created_at timestamptz not null default now(),
  check (extract(minute from starts_at) in (0,30) and extract(second from starts_at)=0)
);
alter table public.demo_slots enable row level security;
revoke all on public.demo_slots from anon, authenticated;
grant select, insert, update on public.demo_slots to authenticated;
create policy "Demo admins manage slots" on public.demo_slots for all to authenticated
  using (exists(select 1 from public.demo_booking_admins where user_id=(select auth.uid())))
  with check (exists(select 1 from public.demo_booking_admins where user_id=(select auth.uid())));

create table public.demo_bookings (
  id uuid primary key default gen_random_uuid(),
  request_key uuid not null unique,
  slot_id uuid not null references public.demo_slots(id),
  full_name text not null,
  email text not null,
  organisation text not null,
  phone text,
  service text not null,
  message text not null,
  timezone text not null,
  starts_at timestamptz not null,
  status text not null default 'processing' check (status in ('processing','confirmed','failed','needs_review')),
  meeting_id text,
  join_url text,
  notification_status text not null default 'pending' check (notification_status in ('pending','sent','failed')),
  failure_code text,
  created_at timestamptz not null default now(),
  check (status <> 'confirmed' or (meeting_id is not null and join_url is not null))
);
create unique index demo_booking_reserved_slot on public.demo_bookings(slot_id)
  where status in ('processing','confirmed','needs_review');
create index demo_bookings_email_created on public.demo_bookings(email,created_at);
alter table public.demo_bookings enable row level security;
revoke all on public.demo_bookings from anon, authenticated;
grant select on public.demo_bookings to authenticated;
create policy "Demo admins read bookings" on public.demo_bookings for select to authenticated
  using (exists(select 1 from public.demo_booking_admins where user_id=(select auth.uid())));
-- Never grant visitors INSERT, UPDATE or SELECT on booking records.
grant all on public.demo_slots,public.demo_bookings,public.demo_booking_admins to service_role;

-- Runs only as service_role; locks a slot and an email before reserving.
create function public.reserve_demo_booking(payload jsonb) returns jsonb
language plpgsql security invoker set search_path = '' as $$
declare slot public.demo_slots; booking public.demo_bookings;
begin
  perform pg_advisory_xact_lock(hashtext(payload->>'request_key'));
  perform pg_advisory_xact_lock(hashtext(lower(payload->>'email')));
  select * into booking from public.demo_bookings where request_key=(payload->>'request_key')::uuid;
  if found then return to_jsonb(booking) || '{"_existing":true}'::jsonb; end if;
  if (select count(*) from public.demo_bookings where email=lower(payload->>'email') and created_at>now()-interval '1 day') >= 3 then
    raise exception 'booking_rate_limit';
  end if;
  select * into slot from public.demo_slots where id=(payload->>'slot_id')::uuid for update;
  if not found or not slot.enabled or slot.starts_at<now()+interval '2 hours' or slot.starts_at>now()+interval '60 days' then
    raise exception 'slot_unavailable';
  end if;
  insert into public.demo_bookings(request_key,slot_id,full_name,email,organisation,phone,service,message,timezone,starts_at)
    values ((payload->>'request_key')::uuid,slot.id,payload->>'full_name',lower(payload->>'email'),payload->>'organisation',payload->>'phone',payload->>'service',payload->>'message',payload->>'timezone',slot.starts_at)
    returning * into booking;
  return to_jsonb(booking);
end;
$$;
revoke all on function public.reserve_demo_booking(jsonb) from public,anon,authenticated;
grant execute on function public.reserve_demo_booking(jsonb) to service_role;
