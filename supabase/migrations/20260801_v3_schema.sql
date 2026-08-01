-- Gym Companion V3: apply in Supabase SQL Editor or with `supabase db push`.
create extension if not exists pgcrypto;

create type public.app_role as enum ('owner', 'admin', 'member');
create type public.membership_status as enum ('active', 'paused', 'expired', 'cancelled');

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  role public.app_role not null default 'member',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.memberships (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null unique references public.profiles(id) on delete cascade,
  status public.membership_status not null default 'active',
  starts_on date,
  ends_on date,
  notes text not null default '',
  updated_at timestamptz not null default now(),
  check (ends_on is null or starts_on is null or ends_on >= starts_on)
);

create table public.exercise_library (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  target_muscles text not null,
  scheme text not null,
  cue text not null,
  image_path text not null check (image_path like 'assets/exercises/%.png'),
  alt_text text not null,
  active boolean not null default true,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table public.member_weekly_plans (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  day_index smallint not null check (day_index between 0 and 5),
  focus text not null,
  warmup jsonb not null default '[]'::jsonb,
  recovery jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now(),
  unique(member_id, day_index)
);

create table public.member_plan_slots (
  id uuid primary key default gen_random_uuid(),
  plan_id uuid not null references public.member_weekly_plans(id) on delete cascade,
  position smallint not null check (position >= 0),
  exercise_id uuid not null references public.exercise_library(id),
  alternative_exercise_id uuid references public.exercise_library(id),
  created_at timestamptz not null default now(),
  unique(plan_id, position)
);

create table public.workout_sessions (
  id uuid primary key default gen_random_uuid(),
  member_id uuid not null references public.profiles(id) on delete cascade,
  session_date date not null,
  day_index smallint not null check (day_index between 0 and 5),
  plan_snapshot jsonb not null,
  progress jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  unique(member_id, session_date)
);

create index member_plans_member_idx on public.member_weekly_plans(member_id, day_index);
create index plan_slots_plan_idx on public.member_plan_slots(plan_id, position);
create index sessions_member_date_idx on public.workout_sessions(member_id, session_date desc);

create or replace function public.set_updated_at() returns trigger language plpgsql as $$
begin new.updated_at = now(); return new; end $$;
create trigger profiles_updated before update on public.profiles for each row execute procedure public.set_updated_at();
create trigger memberships_updated before update on public.memberships for each row execute procedure public.set_updated_at();
create trigger exercises_updated before update on public.exercise_library for each row execute procedure public.set_updated_at();
create trigger plans_updated before update on public.member_weekly_plans for each row execute procedure public.set_updated_at();
create trigger sessions_updated before update on public.workout_sessions for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, full_name) values (new.id, coalesce(new.raw_user_meta_data->>'full_name', ''));
  insert into public.memberships (member_id) values (new.id);
  return new;
end $$;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

create or replace function public.is_staff() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active and role in ('owner','admin'));
$$;
create or replace function public.is_owner() returns boolean language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles where id = auth.uid() and active and role = 'owner');
$$;

alter table public.profiles enable row level security;
alter table public.memberships enable row level security;
alter table public.exercise_library enable row level security;
alter table public.member_weekly_plans enable row level security;
alter table public.member_plan_slots enable row level security;
alter table public.workout_sessions enable row level security;

create policy "profiles: own or staff read" on public.profiles for select using (id = auth.uid() or public.is_staff());
create policy "memberships: own or staff read" on public.memberships for select using (member_id = auth.uid() or public.is_staff());
create policy "library: signed in read" on public.exercise_library for select using (auth.uid() is not null and (active or public.is_staff()));
create policy "library: staff write" on public.exercise_library for all using (public.is_staff()) with check (public.is_staff());
create policy "plans: own or staff read" on public.member_weekly_plans for select using (member_id = auth.uid() or public.is_staff());
create policy "plans: staff write" on public.member_weekly_plans for all using (public.is_staff()) with check (public.is_staff());
create policy "slots: own plan or staff read" on public.member_plan_slots for select using (public.is_staff() or exists(select 1 from public.member_weekly_plans p where p.id=plan_id and p.member_id=auth.uid()));
create policy "slots: staff write" on public.member_plan_slots for all using (public.is_staff()) with check (public.is_staff());
create policy "sessions: own read" on public.workout_sessions for select using (member_id = auth.uid());
create policy "sessions: own write" on public.workout_sessions for insert with check (member_id = auth.uid());
create policy "sessions: own update" on public.workout_sessions for update using (member_id = auth.uid()) with check (member_id = auth.uid());
create policy "sessions: own delete" on public.workout_sessions for delete using (member_id = auth.uid());

-- After the first owner accepts an invite, make that account the owner once:
-- update public.profiles set role = 'owner' where id = '<AUTH_USER_UUID>';
