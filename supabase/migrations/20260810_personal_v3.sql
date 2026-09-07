-- Personal V3: member-owned plan selection, recurring extras, and habit tracking.
create type public.training_tier as enum ('beginner', 'intermediate', 'expert');

create table public.member_training_preferences (
  member_id uuid primary key references public.profiles(id) on delete cascade,
  template_key text not null default 'ppl' check (template_key in ('ppl', 'fitness7')),
  tier public.training_tier not null default 'intermediate',
  updated_at timestamptz not null default now()
);
create table public.member_extra_templates (
  member_id uuid not null references public.profiles(id) on delete cascade,
  day_index smallint not null check (day_index between 0 and 5),
  position smallint not null check (position between 0 and 1),
  exercise_id uuid not null references public.exercise_library(id),
  created_at timestamptz not null default now(),
  primary key (member_id, day_index, position)
);
create table public.member_habit_templates (
  member_id uuid primary key references public.profiles(id) on delete cascade,
  habits jsonb not null default '[]'::jsonb,
  updated_at timestamptz not null default now()
);
create table public.daily_habit_logs (
  member_id uuid not null references public.profiles(id) on delete cascade,
  log_date date not null,
  checks jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  primary key (member_id, log_date)
);
create trigger preferences_updated before update on public.member_training_preferences for each row execute procedure public.set_updated_at();
create trigger habit_templates_updated before update on public.member_habit_templates for each row execute procedure public.set_updated_at();
create trigger habit_logs_updated before update on public.daily_habit_logs for each row execute procedure public.set_updated_at();
alter table public.member_training_preferences enable row level security;
alter table public.member_extra_templates enable row level security;
alter table public.member_habit_templates enable row level security;
alter table public.daily_habit_logs enable row level security;
create policy "preferences: own" on public.member_training_preferences for all using (member_id = auth.uid()) with check (member_id = auth.uid());
create policy "extras: own" on public.member_extra_templates for all using (member_id = auth.uid()) with check (member_id = auth.uid());
create policy "habit templates: own" on public.member_habit_templates for all using (member_id = auth.uid()) with check (member_id = auth.uid());
create policy "habit logs: own" on public.daily_habit_logs for all using (member_id = auth.uid()) with check (member_id = auth.uid());
-- Personal mode lets a member replace only their own future weekly plan.
create policy "plans: own personal write" on public.member_weekly_plans for all using (member_id = auth.uid()) with check (member_id = auth.uid());
create policy "slots: own personal write" on public.member_plan_slots for all using (exists (select 1 from public.member_weekly_plans p where p.id = plan_id and p.member_id = auth.uid())) with check (exists (select 1 from public.member_weekly_plans p where p.id = plan_id and p.member_id = auth.uid()));
create index extras_member_day_idx on public.member_extra_templates(member_id, day_index);
create index habit_logs_member_date_idx on public.daily_habit_logs(member_id, log_date desc);
