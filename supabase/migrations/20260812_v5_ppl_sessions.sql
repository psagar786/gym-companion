-- Fitness 7 V5: keep immutable V4 history alongside separately editable V5 sessions.
alter table public.member_training_preferences drop constraint if exists member_training_preferences_template_key_check;
alter table public.member_training_preferences add constraint member_training_preferences_template_key_check check (template_key in ('v5ppl', 'ppl', 'fitness7'));

alter table public.workout_sessions add column if not exists source_version text not null default 'v4';
alter table public.workout_sessions drop constraint if exists workout_sessions_member_id_session_date_key;
create unique index if not exists sessions_member_date_source_idx on public.workout_sessions(member_id, session_date, source_version);
create index if not exists sessions_member_source_date_idx on public.workout_sessions(member_id, source_version, session_date desc);

comment on column public.workout_sessions.source_version is 'Immutable session source: v4 legacy history or V5 PPL session.';
