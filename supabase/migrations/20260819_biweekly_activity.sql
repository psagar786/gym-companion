-- Bi-weekly activity source: preserves existing V5 sessions and enables future-plan selection.
alter table public.member_training_preferences drop constraint if exists member_training_preferences_template_key_check;
alter table public.member_training_preferences add constraint member_training_preferences_template_key_check check (template_key in ('v5ppl', 'ppl', 'fitness7', 'biweekly'));

comment on column public.workout_sessions.source_version is 'Immutable session source: v4 legacy history, V5 PPL session, or biweekly-v1 activity.';
