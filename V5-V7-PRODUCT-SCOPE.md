# Fitness 7 Gym Companion - V5 to V7 Product Scope

| Field | Value |
|---|---|
| Product owner | Sagar Paperwala, Product Manager - Fitness 7 |
| Status | Roadmap definition for management review |
| Scope horizon | V5 to V7 |
| Last updated | 10 August 2026 |
| Foundation release | V4 public showcase |
| Pilot commitment | 50 members before staged expansion to 1,000 |

## 1. Purpose

This document converts the Gym Companion product vision into three controlled releases. The sequence prioritizes safe personalization and gym operations before expanding into home workouts, goals, gamification, and advanced insights.

The roadmap is deliberately phased:

- **V5:** Make the product operational for Fitness 7 members, trainers, and administrators.
- **V6:** Preserve training consistency outside the gym and connect activity to personal goals.
- **V7:** Turn consistent activity into motivating progress intelligence and responsible gamification.

Every release requires its own approval gate. A later release must not delay the production quality required by an earlier one.

## 2. Shared roadmap principles

- The member's active workout remains the most important screen.
- More exercise choice must not automatically create more prescribed volume.
- Trainers approve content; members select only from approved options.
- Historical sessions remain immutable.
- Member privacy and role separation apply to every new data feature.
- Home activity contributes to consistency without pretending to equal unavailable gym equipment.
- Gamification rewards adherence and safe progression, not reckless volume or daily failure training.
- Features must work for non-technical gym staff.
- Rollout decisions are evidence-based and reversible.

# V5 - Production Personalization and Gym Operations

## 3. V5 objective

Operationalize Gym Companion for a committed 50-member Fitness 7 pilot by providing safe training levels, a governed exercise database, member and membership management, trainer-assigned routines, secure accounts, and non-technical administration.

## 4. V5 target users

- Members who need a program suitable for their experience level.
- Trainers who assign and adjust weekly routines.
- Administrators who manage accounts and memberships.
- Gym owners who monitor adoption, support load, security, and cost.

## 5. V5 user stories

### Member

- As a new member, I want a beginner plan so I can train safely without being overwhelmed.
- As an experienced member, I want appropriate exercise choices and progression without performing every available movement.
- As a member, I want my assigned Monday to differ from another member's Monday when our goals or experience differ.
- As a member, I want my selections and completed sessions available after signing in on another device.

### Trainer

- As a trainer, I want to assign a complete approved template and make small member-specific changes.
- As a trainer, I want to preview exactly what the member will see before saving.
- As a trainer, I want archived exercises preserved in history but unavailable for new assignments.

### Administrator

- As an administrator, I want to add, update, pause, expire, cancel, reinstate, and search memberships.
- As an administrator, I want to invite accounts and send password-reset emails without knowing passwords.
- As an administrator, I want common tasks expressed in gym language rather than database language.

## 6. V5 functional requirements

### 6.1 Training levels

| Level | Intended experience | Base movements | Typical prescription | Default effort |
|---|---|---:|---|---|
| Beginner | 0-3 months | 6 | 2-3 sets, 8-15 reps | 2-3 reps in reserve |
| Intermediate | Consistent beyond 3 months | 7 | 3 sets, 6-15 reps | 1-2 reps in reserve |
| Advanced | Long-term consistent training | 8 | 3-4 sets, 5-15 reps | Usually 1-2 reps in reserve |

- Each level must provide at least ten compatible choices per training day.
- Every assigned slot must have a primary and appropriate alternative.
- Up to two recurring optional exercises remain separate from base completion.
- Advanced does not mean forced repetitions, unsafe failure training, or unrestricted volume.
- Plan changes affect future sessions only.

### 6.2 Exercise library

Each approved movement requires:

- Stable identifier and name.
- Active or archived status.
- Target muscles and target groups.
- Movement pattern.
- Equipment requirements.
- Compatible days and program templates.
- Suitable training levels.
- Sets, repetitions or duration, rest, and effort guidance.
- Primary alternative relationships.
- Form cue, safety cue, and why-it-matters copy.
- Descriptive alt text.
- Validated setup, move, and return images.

The initial production library target is at least 120 approved movements. Only trainer-approved content becomes assignable.

### 6.3 Member accounts and profiles

- Invite-only account creation during the pilot.
- Owner, admin, trainer, and member permissions.
- Member name, contact identifier, home location, joined date, training level, goal, trainer, and account status.
- Secure sign-in, remember-me choice, self-service password change, reset email, and sign-out.
- No staff access to member passwords.

### 6.4 Membership management

- Active, paused, expired, cancelled, and reinstated states.
- Start and end dates.
- Operational notes with restricted visibility.
- Search and filters by location, status, trainer, and expiry window.
- Clear warnings before deactivation or plan removal.
- No payment processing in V5.

### 6.5 Personalized weekly plans

- Monday-Saturday plan per member.
- Template assignment followed by optional member-level editing.
- Reorder, replace, add, remove, or restore approved exercise slots.
- Member-view preview before save.
- Effective date for future plan changes.
- Immutable plan snapshot stored with each completed session.

### 6.6 Workout sessions

- Cloud storage of dated choices and completion state.
- Independent warm-up, main, recovery, and optional-extra progress.
- Read-only history.
- Safe retry behavior for unreliable gym connectivity.
- Duplicate submissions must not create duplicate sessions.

### 6.7 Non-technical administration

- Task-based dashboard: Add member, Update membership, Assign plan, Send reset, Manage exercise.
- Plain-language status and error messages.
- Search before long tables.
- Mobile or compact laptop usability for coaches.
- Preview and confirmation for high-impact changes.
- Archive and restore instead of destructive deletion for referenced content.

## 7. V5 data requirements

Core records:

- User identity and role.
- Member profile.
- Membership.
- Trainer assignment.
- Training preference and goal.
- Exercise library record and assets.
- Weekly plan and ordered slots.
- Recurring optional exercise template.
- Dated workout session and immutable snapshot.
- Minimal audit event for privileged administrative changes.

Member access is limited to the member's records. Trainers and administrators receive only the access required by their role and location. Sensitive credentials remain server-side.

## 8. V5 non-functional requirements

- Support 1,000 active member records with growth headroom.
- Meet the V4 phone usability baseline.
- 99% successful workout-page loads during the pilot.
- Recover gracefully from a temporary network failure.
- Publish a tested backup and restore procedure.
- Monitor authentication failures, server errors, data growth, and infrastructure limits.
- Maintain a minimal, privacy-conscious audit trail for privileged changes.
- Provide a privacy notice and operational data-retention policy before onboarding real members.

## 9. V5 exclusions

- Payments and billing automation.
- Native iOS or Android applications.
- Wearable synchronization.
- Automated nutrition or medical advice.
- Public social feeds or open member messaging.
- AI-generated routines without an approved ruleset and trainer governance.

## 10. V5 success metrics

| Metric | Target |
|---|---:|
| Invited pilot members starting a workout | 80% |
| Week-four weekly active members | 60% |
| Member satisfaction | 4.0/5 or higher |
| Successful workout-page loads | 99% |
| Critical privacy/security incidents | 0 |
| Trainer reduction in basic identification questions | 25% |
| Admins completing core tasks without technical support | 90% in usability test |

## 11. V5 acceptance criteria

- Beginner, Intermediate, and Advanced plans pass trainer review.
- Every active exercise has complete metadata and validated imagery.
- Two members can receive different Monday plans and cannot access each other's records.
- Administrators can complete member, membership, reset, and plan tasks without database access.
- Historical sessions remain unchanged after future plan edits.
- Archived exercises cannot be newly assigned but remain visible in history.
- Security and recovery tests pass.
- The 50-member pilot support process is staffed and documented.

## 12. V5 rollout gate

V5 moves from pilot to staged expansion only when:

- No critical security, privacy, safety, or data-integrity issue is open.
- Pilot reliability and usability evidence has been reviewed.
- Trainers approve content corrections.
- Operations accepts the support load.
- Infrastructure cost and limits are understood.
- Management approves the next cohort size.

# V6 - Anywhere Training and Goal Management

## 13. V6 objective

Help members maintain consistency when they cannot reach Fitness 7 and connect every workout to a clear personal outcome.

## 14. V6 user stories

- As a member missing the gym because of rain, travel, or time constraints, I want a credible home workout that preserves my streak.
- As a member with limited equipment, I want the routine to use only what I have available.
- As a member pursuing fat loss or strength, I want the app to explain how today's session supports my goal.
- As a trainer, I want home alternatives to remain within approved programming rules.

## 15. V6 functional requirements

### 15.1 Training modes

- Gym workout.
- Home bodyweight workout.
- Home limited-equipment workout.
- Travel workout.
- Recovery or mobility day.

### 15.2 Home-workout generation

- Ask which equipment is available: none, mat, bands, dumbbells, bench, or other approved set.
- Match the planned muscle groups and movement patterns where practical.
- Explain when a home substitute has a different training effect.
- Use safe duration and volume limits.
- Preserve primary/alternative selection and detailed visuals.
- Allow a trainer-approved default home template for each regular training day.

### 15.3 Goal management

Supported starting goals:

- Fat loss while preserving muscle.
- Muscle gain.
- Strength improvement.
- General fitness.
- Workout consistency.

Each goal includes a plain-language objective, selected start date, target review date, baseline, weekly behavior targets, and progress signals. Goals guide program recommendations but do not promise an outcome.

### 15.4 Continuity and adherence

- A completed approved home workout contributes to workout consistency.
- History identifies whether a session occurred at the gym, at home, while travelling, or as recovery.
- Home substitutions preserve the original scheduled-day reference.
- Members can resume the next scheduled gym workout without manually rebuilding the week.

## 16. V6 data requirements

- Active member goal and review history.
- Available home equipment profile.
- Approved substitution mapping by movement pattern and difficulty.
- Workout location/mode.
- Goal-related adherence events.
- Trainer notes or approval state where used.

## 17. V6 dependencies

- Stable V5 identity, exercise library, plan, and history systems.
- Trainer-approved home exercise content and images.
- Safety review for limited-space and no-equipment movements.
- Clear rules for workout equivalence and streak contribution.

## 18. V6 exclusions

- Live video coaching.
- Camera-based form scoring.
- Medical rehabilitation programs.
- Automated diet plans.
- Location tracking.

## 19. V6 success metrics

- Percentage of missed gym days converted into an approved home or recovery session.
- Four-week consistency among members using home mode.
- Completion rate by workout mode.
- Member confidence in selecting home alternatives.
- Safety/content issue rate.
- Goal review completion.

## 20. V6 acceptance criteria

- Every supported gym-day focus has an approved no-equipment and limited-equipment alternative.
- A member can switch modes in two or fewer meaningful decisions.
- Home completion contributes correctly to consistency without being recorded as a gym session.
- Goal changes affect future recommendations and preserve historical context.
- Trainers can identify which workout mode a member completed.

## 21. V6 rollout gate

- V5 production metrics remain healthy.
- Home routines pass trainer and safety review.
- Pilot members understand workout-mode differences.
- Goal recommendations are explainable and reversible.
- No location or unnecessary sensitive data is collected.

# V7 - Gamification and Progress Intelligence

## 22. V7 objective

Turn completed training into understandable, motivating progress while protecting recovery, privacy, and healthy behavior.

## 23. V7 user stories

- As a member, I want to see that my consistency is improving even when body weight fluctuates.
- As a member, I want recognition for sustainable milestones rather than only maximum weight.
- As a trainer, I want a concise view of adherence, muscle coverage, and missed patterns.
- As a gym owner, I want aggregated engagement signals without exposing private member details.

## 24. V7 functional requirements

### 24.1 Activity rings and calendar

- Main workout ring.
- Warm-up ring.
- Recovery ring.
- Independent completion logic.
- Monthly and weekly summaries.
- Read-only historical session details.

### 24.2 Streaks and milestones

- Weekly consistency streak.
- First complete workout.
- First complete training week.
- Warm-up and recovery consistency.
- Personal bests where load/repetition logging is available.
- Return-after-break encouragement.

Streaks must allow recovery days and must not reward unsafe consecutive high-intensity training.

### 24.3 Challenges

- Individual consistency challenges.
- Trainer-created cohort challenges.
- Gym-wide participation challenges.
- Privacy-preserving rankings using display aliases or opt-in names.
- No public body-weight or sensitive health rankings.

### 24.4 Progress intelligence

- Workout frequency and completion trend.
- Training volume trend where sets, repetitions, and load are recorded.
- Muscle-group coverage.
- Exercise progression.
- Warm-up and recovery adherence.
- Recovery warning when recent training volume, missed recovery, or self-reported readiness suggests caution.

Insights must explain the data used and avoid medical conclusions.

### 24.5 Trainer and management dashboards

- Member adherence summary for assigned members.
- Members who may need plan review or encouragement.
- Aggregate adoption by location and cohort.
- Content usage and frequently selected alternatives.
- Privacy-protected retention indicators.

### 24.6 Motivation and notifications

- Today's training reminder.
- Inactivity encouragement.
- Milestone celebration.
- Goal review reminder.
- Recovery-aware messaging.
- Member-controlled notification preferences and quiet hours.

## 25. V7 data requirements

- Derived completion and streak records.
- Achievement definitions and earned milestones.
- Challenge, cohort, participation, and privacy preferences.
- Optional set, repetition, load, and personal-best records.
- Aggregated location-level engagement metrics.
- Notification preferences and delivery events.

## 26. V7 dependencies

- Reliable V5 workout and member records.
- V6 goal and workout-mode context.
- Governance for challenges and trainer access.
- Analytics definitions reviewed by product, training, and privacy owners.
- Notification delivery service and opt-out controls.

## 27. V7 exclusions

- Public social feed.
- Unmoderated direct messaging.
- Cash prizes or gambling-like mechanics.
- Body-comparison leaderboards.
- Medical fatigue diagnosis.
- Rewards for unsafe workout volume.

## 28. V7 success metrics

- Change in weekly workout completion after feature adoption.
- Member interaction with progress summaries.
- Challenge participation and completion.
- Notification opt-out and complaint rate.
- Warm-up and recovery adherence.
- Member-reported motivation.
- Trainer use of actionable progress summaries.

## 29. V7 acceptance criteria

- Ring and streak calculations match recorded session data.
- Recovery days do not incorrectly break healthy streaks.
- Historical corrections recalculate derived results predictably.
- Members control challenge visibility and notifications.
- Rankings do not expose private health or membership information.
- Insights are explainable and avoid medical claims.
- Gamification cannot reward completion beyond safe program limits.

## 30. V7 rollout gate

- Engagement experiments demonstrate benefit without harmful behavior signals.
- Privacy review approves challenges and aggregated reporting.
- Notification frequency and opt-out behavior pass pilot thresholds.
- Trainers approve recovery and progression messaging.
- Management approves any ongoing notification or analytics cost.

## 31. Cross-release delivery sequence

| Stage | Primary outcome | Exit decision |
|---|---|---|
| V5 pilot | Safe personalized operations for 50 members | Expand, correct, or pause |
| V5 staged rollout | Operational readiness toward 1,000 members | Approve V6 pilot |
| V6 pilot | Consistency across gym and home modes | Expand anywhere training |
| V7 experiment | Evidence that gamification improves healthy adherence | Scale selected mechanics |

## 32. Governance and ownership

| Workstream | Accountable owner |
|---|---|
| Product priorities and release gates | Product manager |
| Exercise content and progression | Head trainer |
| Member onboarding and membership data | Gym operations |
| Privacy and role access | Product and platform owners |
| Deployment, recovery, and monitoring | Platform engineering |
| Member support and feedback | Gym manager and trainer team |
| Business-case reporting | Product manager and gym owner |

## 33. Roadmap decision rules

- Safety, privacy, or data-integrity failures block expansion.
- Pilot evidence can reduce or reorder scope.
- A feature that increases gym-floor friction must be redesigned before rollout.
- New exercise volume requires training approval.
- Free infrastructure is acceptable only while reliability and data limits remain within agreed thresholds.
- The INR 60,000 annual maintenance saving is reported separately from unproven retention or revenue value.
