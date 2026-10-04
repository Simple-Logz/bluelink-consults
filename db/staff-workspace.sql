create schema if not exists bluelink_private;
revoke all on schema bluelink_private from public, anon;
grant usage on schema bluelink_private to authenticated;

create or replace function bluelink_private.is_staff()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from auth.users u
    where u.id = (select auth.uid())
      and lower(u.email) ~ '^[^@[:space:]]+@bluelinkconsults[.]com$'
      and u.email_confirmed_at is not null
      and not coalesce(u.is_anonymous, false)
      and (u.banned_until is null or u.banned_until <= now())
  );
$$;
revoke all on function bluelink_private.is_staff() from public, anon;
grant execute on function bluelink_private.is_staff() to authenticated;

create or replace function public.bluelink_staff_access()
returns boolean language sql stable security invoker set search_path = ''
as $$ select bluelink_private.is_staff(); $$;
revoke all on function public.bluelink_staff_access() from public, anon;
grant execute on function public.bluelink_staff_access() to authenticated;

create table if not exists public.staff_assessments (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  module text not null check (module in ('cost','modernisation','migration','devops','audit')),
  title text not null default 'Untitled assessment' check (length(title) <= 240),
  status text not null default 'draft' check (status in ('draft','completed')),
  draft jsonb not null default '{}'::jsonb check (jsonb_typeof(draft) = 'object' and octet_length(draft::text) <= 5242880),
  snapshot jsonb check (snapshot is null or (jsonb_typeof(snapshot) = 'object' and octet_length(snapshot::text) <= 5242880)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists staff_assessments_owner_updated_idx on public.staff_assessments (owner_id, updated_at desc);
alter table public.staff_assessments enable row level security;
revoke all on public.staff_assessments from public, anon;
grant select, insert, update on public.staff_assessments to authenticated;
drop policy if exists staff_assessments_read on public.staff_assessments;
create policy staff_assessments_read on public.staff_assessments for select to authenticated
using (owner_id = (select auth.uid()) and (select bluelink_private.is_staff()));
drop policy if exists staff_assessments_insert on public.staff_assessments;
create policy staff_assessments_insert on public.staff_assessments for insert to authenticated
with check (owner_id = (select auth.uid()) and (select bluelink_private.is_staff()));
drop policy if exists staff_assessments_update on public.staff_assessments;
create policy staff_assessments_update on public.staff_assessments for update to authenticated
using (owner_id = (select auth.uid()) and (select bluelink_private.is_staff()))
with check (owner_id = (select auth.uid()) and (select bluelink_private.is_staff()));

-- Retire anonymous writes from the previous public simulator without deleting history.
revoke insert on public.simulator_sessions, public.simulator_trials, public.simulator_completed from anon;
drop policy if exists "simulator anonymous insert" on public.simulator_sessions;
create policy "staff simulator insert" on public.simulator_sessions for insert to authenticated
with check ((select bluelink_private.is_staff()));
drop policy if exists "public can insert simulator trials" on public.simulator_trials;
create policy "staff trials insert" on public.simulator_trials for insert to authenticated
with check ((select bluelink_private.is_staff()));
drop policy if exists "public can insert completed simulations" on public.simulator_completed;
create policy "staff completed insert" on public.simulator_completed for insert to authenticated
with check ((select bluelink_private.is_staff()) and status = 'completed' and completed_at is not null);
