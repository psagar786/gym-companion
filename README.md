# Gym Companion V3

Fitness 7’s account-enabled workout companion. V3 is a separate branch and deployment; V1 and V2 stay unchanged.

## What V3 adds

- Invite-only member accounts and self-service password changes.
- Private cloud workout sessions and personalised Monday–Saturday plans.
- Owner/admin panel for members, membership dates/status, approved exercise content, and individual plans.
- Fitness 7 imagery from the existing curated asset set only.

## Set up Supabase

1. Create a Supabase project and configure the Authentication **Site URL** and allowed redirect URL to the V3 Vercel URL.
2. Run [`supabase/migrations/20260801_v3_schema.sql`](supabase/migrations/20260801_v3_schema.sql) in the Supabase SQL editor.
3. Invite the first owner through Supabase Auth, then promote them manually:

   ```sql
   update public.profiles set role = 'owner' where id = '<AUTH_USER_UUID>';
   ```

4. Seed the approved exercise records once:

   ```sh
   SUPABASE_URL=... SUPABASE_SERVICE_ROLE_KEY=... node scripts/seed-library.mjs
   ```

## Deploy V3

Create a new Vercel project from branch `feature/member-accounts-v3`; do not repoint the V2 project. Add the values from [`.env.example`](.env.example):

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` — server-side only
- `APP_URL` — the deployed V3 URL, used for account invite/reset redirects

The browser fetches only the public URL/key from `/api/config`. Invitations, role changes, and password-reset emails run through `/api/admin`, which verifies the caller’s staff role before using the service key.

## Security model

Supabase row-level security permits members to read and write only their own sessions, profiles, membership data, and plans. Staff can manage gym content and plans. Owner-only role changes are enforced server-side. Admins never see or set member passwords; they send a secure reset email instead.

## Local development

Use `vercel dev` after setting the variables above locally. V3 requires a live Supabase project; V2’s device-only local history is deliberately not imported.

## Validation checklist

- Invite a member, set a password, sign in, change password, and sign out.
- Confirm another member cannot read that member’s plan or workout sessions.
- Save a custom Monday plan as an admin and confirm only its assigned member sees it.
- Archive an exercise and confirm it remains in existing session snapshots but cannot be assigned as a new active exercise.
