# Gym Companion V3 — Member & Coach Apps

Fitness 7’s account-enabled workout companion. V3 uses two simple Vercel apps backed by one secure Supabase database. V1 and V2 stay unchanged.

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

## Deploy V3 as two apps

Create two new Vercel projects from branch `feature/member-accounts-v3`: `gym-companion-member-v3` and `gym-companion-coach-v3`. Both projects use this repository root and these shared values:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `MEMBER_APP_URL`
- `ADMIN_APP_URL`

Set `APP_MODE=member` in the member project. Set `APP_MODE=admin` and `SUPABASE_SERVICE_ROLE_KEY` in the coach project only. The shared bootstrap loads only the correct interface for that deployment. `/api/admin` returns 404 from the member deployment, even for signed-in users.

The member app contains workouts, profile, password change, and history. The coach app contains a task-based dashboard, member management, membership dates/status, password reset, personal plan builder, and exercise library.

The browser fetches only the public URL/key from `/api/config`. Invitations, role changes, and password-reset emails run through the coach deployment’s `/api/admin`, which verifies the caller’s staff role before using the service key.

## Security model

Supabase row-level security permits members to read and write only their own sessions, profiles, membership data, and plans. Staff can manage gym content and plans. Owner-only role changes are enforced server-side. Admins never see or set member passwords; they send a secure reset email instead.

## Local development

Opening `index.html` directly launches an offline two-app preview. It lets reviewers switch between member and coach experiences, add sample members, edit memberships, build weekday plans, and tick workouts; preview changes remain in that browser only.

Use `vercel dev` with the environment values above to test real authentication and database behavior. Set `APP_MODE` to preview the hosted member or coach interface. V2’s device-only local history is deliberately not imported.

## Validation checklist

- Invite a member, set a password, sign in, change password, and sign out.
- Confirm another member cannot read that member’s plan or workout sessions.
- Save a custom Monday plan as an admin and confirm only its assigned member sees it.
- Archive an exercise and confirm it remains in existing session snapshots but cannot be assigned as a new active exercise.
