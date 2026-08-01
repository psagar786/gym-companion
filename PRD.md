# Product Requirements Document — Gym Companion

## V3: member accounts and gym management

V3 evolves the device-only V2 comparison into a secure Gym Companion service. The problem remains the same—members need a reliable, visual routine when the Fitness 7 app is unavailable—but a shared gym needs each member’s routine, history, and membership to be private and manageable by the gym.

The V3 MVP introduces invite-only accounts, a member profile, cloud workout history, and individual Monday–Saturday plans. Owners/admins can manage members, membership dates/status, the approved exercise library, and member-specific routines. This allows one member to train back on Monday while another sees a completely different prescribed session.

V3 does not process payments, expose member passwords, accept arbitrary exercise images, or migrate V2 browser history. Future work can add payment integrations, trainer notes, notifications, and a broader equipment database.

## Why this exists

Fitness 7’s app became unavailable, leaving members to ask a coach, search YouTube, or improvise a workout in the gym. That uncertainty can reduce motivation. Gym Companion provides a dependable visual routine with safe alternatives when a machine is unavailable or an exercise does not feel right that day.

## MVP

The MVP is a mobile-first six-day Fitness 7 routine. Each day displays the target group, warm-up, exercise options, sets/reps, a visual for every option, a finish, and browser-local completion tracking. The routine is tailored to the available equipment and makes the selected variation mutually exclusive within each movement slot.

## Guided Workout V2

V2 upgrades the session into a 75–90 minute guided flow: a seven-day mobile home screen, optional illustrated warm-up and recovery checklists, selected-exercise detail, recovery-aware Zone 2 cardio, mobility cooldowns, and device-only dated history. Warm-ups use zero-equipment movement preparation; heavy leg days use recovery walking and mobility rather than hard post-workout cardio. Main workout completion stays separate from recommended preparation and recovery progress; saved calendar sessions can be reviewed read-only.

## Audience and success

The first user is the creator at Fitness 7; the next audience is members who need a reliable gym reference. A successful visit lets a member open the app in the gym, understand today’s work visually, choose an alternative confidently, and complete the session without another lookup.

## Product principles

- Fast: static assets, no login, no server round trip.
- Clear: one daily decision at a time and visual form references.
- Flexible: one selected variation per slot, while retaining measurable progression.
- Private: choices and checkmarks remain on the device.

## Roadmap

1. Daily motivation and workout reminders.
2. Android and iOS apps.
3. Daily training notifications with completion encouragement.
4. Apple Watch-style weekly activity and completion view.
5. Progressive sets, reps, and load logging.
6. Multi-user onboarding: body parameters plus tailored plans from a 100+ exercise library.

Accounts, cloud data, personalization, notifications, and native apps are intentionally outside the public static MVP.
