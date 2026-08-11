# Product Requirements Document - Fitness 7 Gym Companion

| Field | Value |
|---|---|
| Product | Fitness 7 Gym Companion |
| Product owner | Sagar Paperwala, Product Manager - Fitness 7 |
| Document status | Management review and committed pilot planning |
| Document version | 1.0 |
| Last updated | 11 August 2026 |
| Intended audience | Fitness 7 owners, gym managers, trainers, operations, product and engineering |
| Current product release | V4 public showcase |
| Product review and system blueprint | [`PRODUCT-REVIEW-AND-ARCHITECTURE.md`](PRODUCT-REVIEW-AND-ARCHITECTURE.md) |
| Showcase | https://gym-companion-member-v4.vercel.app/ |

## 1. Executive summary

Fitness 7 Gym Companion is a visual, mobile-first workout product that helps members understand what to train, how to perform each movement, and what alternative to select when equipment or confidence is limited. It was created after the existing gym application became unavailable and members had to depend on trainers, ChatGPT, YouTube, or improvised routines while standing on the gym floor.

The product has progressed from a personal static routine into a public V4 showcase with illustrated daily programming, exercise alternatives, warm-up and recovery guidance, optional movements, detailed setup/move/return instruction, and completion tracking. The next business objective is to operationalize this foundation for Fitness 7 through a committed 50-member pilot, prove adoption and support readiness, and then expand toward the full base of 1,000 active members.

Fitness 7 operates two locations for this business case. Replacing the current annual application maintenance arrangement avoids an estimated INR 30,000 per location, or INR 60,000 per year across both gyms. That figure is a direct cost-avoidance estimate, not projected revenue. Additional value is expected through better member confidence, greater consistency, reduced repetitive trainer demonstrations, faster content changes, and stronger retention, but those benefits must be measured during the pilot.

## 2. Product vision

Give every Fitness 7 member a dependable personal workout companion that is available whenever they train, visually explains every movement, adapts to their level and equipment, and connects gym guidance with measurable long-term consistency.

### Product promise

> Open the app, understand today's training in seconds, complete the session confidently, and see that the effort counted.

## 3. Background and problem

### 3.1 Member problem

When the existing Fitness 7 application is unavailable or incomplete, members do not have a reliable source for their daily workout. This creates several forms of friction:

- Members do not know which muscle group or sequence to train that day.
- Exercise names alone are insufficient for people who recognize movements visually.
- Members must interrupt trainers for recurring basic demonstrations.
- YouTube and web searches introduce delay, distraction, inconsistent advice, and poor gym-floor usability.
- Members may choose unrelated exercises, skip the session, or lose motivation because there is no predefined plan.
- Equipment availability differs between gyms, making generic routines unreliable.
- A single prescribed exercise may feel unsuitable because of fatigue, confidence, or machine availability.

### 3.2 Trainer and operations problem

Trainers repeatedly answer questions that a clear visual reference could resolve. Gym management also depends on an application maintenance model that costs money while limiting the speed at which routines, illustrations, alternatives, and member experiences can be improved.

### 3.3 Business opportunity

Gym Companion gives Fitness 7 an owned, frequently updated product layer that can:

- Provide a free member-facing workout reference.
- Reduce dependency on a slow or unavailable third-party application.
- Save an estimated INR 60,000 in combined annual maintenance across two gyms.
- Allow Fitness 7 to change workout content without waiting for an annual application cycle.
- Standardize exercise guidance while preserving trainer authority.
- Create a foundation for personalization, member operations, home workouts, goals, and engagement.

## 4. Operating context and assumptions

| Measure | Planning assumption |
|---|---:|
| Fitness 7 locations | 2 |
| Active members | 1,000 |
| Initial committed pilot | 50 members |
| Existing annual maintenance per gym | INR 30,000 |
| Combined annual maintenance avoided | INR 60,000 |
| Member price at launch | Free |
| Primary usage device | Member-owned smartphone |
| Primary usage environment | Fitness 7 gym floor |

The 50-member pilot is committed. Expansion to all 1,000 members is conditional on usability, reliability, operational support, privacy, and adoption thresholds defined in this document.

## 5. Users and jobs to be done

### 5.1 Member

**Context:** A beginner, intermediate, or advanced member training at Fitness 7 with limited time and varying familiarity with exercise names.

**Job:** "When I arrive at the gym, help me start the correct workout quickly, understand each movement visually, choose a safe alternative, and record that I completed it."

**Needs:** Fast access, clear images, concise instructions, relevant alternatives, warm-up/recovery priorities, progress feedback, and confidence that the routine matches available equipment.

### 5.2 Trainer or coach

**Context:** A non-technical fitness professional supporting multiple members during busy hours.

**Job:** "Help me assign and maintain member-appropriate routines without building software or repeatedly explaining every basic movement."

**Needs:** Simple plan assignment, visual preview, approved exercise content, member search, limited administrative steps, and clear exceptions.

### 5.3 Gym manager or administrator

**Context:** Staff responsible for memberships, access, data quality, and operational continuity.

**Job:** "Help me manage member access, membership status, and workout content safely without seeing passwords or using technical tools."

**Needs:** Role-based access, member lifecycle controls, auditability, recoverable changes, and reliable deployment.

### 5.4 Gym owner

**Context:** The decision-maker responsible for member experience, operating cost, risk, and growth.

**Job:** "Give me evidence that the product improves service, reduces avoidable cost, and can scale without creating operational or data risk."

**Needs:** Adoption metrics, maintenance economics, support visibility, security assurance, roadmap clarity, and staged investment gates.

## 6. Product principles

1. **Visual first:** A member should understand the movement before reading a long explanation.
2. **Mobile first:** The core workout must work one-handed on modern phones without horizontal scrolling.
3. **Low friction:** A member should reach today's workout and first exercise within two meaningful taps.
4. **Relevant flexibility:** Alternatives must train the intended muscle group and respect Fitness 7 equipment.
5. **Safe progression:** More content must not encourage members to perform every available exercise or train through warning symptoms.
6. **Trainer aligned:** The product supports coaches; it does not replace professional judgement.
7. **Measurable consistency:** Completion should create simple, motivating evidence of progress.
8. **Easy to maintain:** Workout content and illustrations should be updateable without rewriting presentation logic.
9. **Privacy by design:** Member information must remain private and role-restricted.

## 7. Goals and non-goals

### 7.1 Goals

- Enable members to identify and begin the correct workout quickly.
- Provide a clear visual and concise technique reference for every active movement.
- Offer relevant primary, alternative, and optional exercise choices.
- Provide prioritized warm-up and recovery guidance without making it mandatory.
- Improve member consistency and confidence.
- Reduce repetitive trainer questions about basic movement identification and setup.
- Enable frequent routine and content updates.
- Validate readiness for member accounts and gym-managed personalization.
- Demonstrate a credible path to INR 60,000 annual maintenance cost avoidance.

### 7.2 Non-goals for the current release

- Payment processing or membership fee collection.
- Medical diagnosis, physiotherapy, or injury rehabilitation.
- Detailed calorie or meal logging.
- Public social networking.
- Unmoderated user-uploaded exercise content.
- Automatic replacement of trainer judgement.
- Native wearable integration.
- Guaranteed fat-loss, muscle-gain, or retention outcomes.

## 8. Current product requirements

### 8.1 Daily workout selection

- Present Monday through Saturday training and a clear rest-day treatment for Sunday where applicable.
- Show the day's date, focus, estimated duration, and completion status.
- Preserve the Fitness 7 split as the primary public routine while allowing future member-specific programs.
- Keep navigation understandable on phone widths from 320px to 430px.

### 8.2 Main workout

- Display an ordered sequence of movements for the selected day.
- Show exercise name, target muscles, prescription, rest, coaching cue, and illustration.
- Allow exactly one selected variation per movement slot.
- Persist selected alternatives and completion state for the dated session.
- Keep optional extras separate from required main-workout completion.

### 8.3 Exercise alternatives and optional movements

- Alternatives must match the movement purpose and target group.
- Optional exercise lists must be filtered by the day's explicit muscle groups.
- Stretching, mobility, warm-up, and recovery movements must not appear as strength-workout extras.
- Members may save up to two recurring optional strength exercises per weekday.
- Changing future optional templates must not rewrite historical workout snapshots.

### 8.4 Exercise detail experience

- Every active main, alternative, warm-up, recovery, and optional movement must open a detail view.
- Detail content must show setup, movement, and controlled return phases.
- Each phase must have a distinct, square, descriptive visual.
- Detail pages must explain how to perform the movement, why it matters, target muscles, equipment, prescription, form cue, and safety cue.
- Returning to the workout must preserve selections and completion state.

### 8.5 Warm-up and recovery

- Warm-up and recovery remain recommended rather than mandatory.
- Each step must include an illustration, short cue, priority, and checkmark.
- Warm-ups should be day-specific and usable without specialized equipment when possible.
- Upper-body recovery may include Zone 2 treadmill or bike work and targeted mobility.
- Leg-day recovery must avoid hard post-workout intervals.
- Completion of warm-up, main workout, and recovery must be measured independently.

### 8.6 Progress and history

- Represent fully completed warm-up, main workout, and recovery zones independently.
- Use three-ring monthly history to provide immediate visual feedback.
- A ring appears only when every item in that zone is completed.
- Historical sessions are read-only and retain the selected alternatives and routine snapshot from that date.
- A clear-session control must reset the selected day's tracked activity with explicit intent.

### 8.7 Coach and administration foundation

- Separate member and coach experiences.
- Support owner, admin, and member roles.
- Allow staff to manage member profiles, membership status, approved exercises, and individual plans.
- Admins may initiate secure password-reset emails but must never view or directly set member passwords.
- Members must be restricted to their own profile, plan, membership, and workout history.

## 9. Non-functional requirements

### 9.1 Performance

- Initial mobile content should become usable within three seconds on a typical 4G connection.
- Day-to-day navigation should feel immediate after assets are cached.
- Exercise images must be optimized without visible stretching or cropping.

### 9.2 Mobile usability

- Support 320, 375, 390, 393, 414, and 430px widths.
- Maintain minimum 44px touch targets for primary controls.
- Prevent horizontal overflow.
- Respect phone safe areas.
- Present one primary content column on phones.

### 9.3 Accessibility

- Every exercise image requires meaningful alternative text.
- Controls must have accessible names and keyboard-operable behavior.
- Completion status must not rely on color alone.
- Text and controls must meet reasonable contrast requirements.

### 9.4 Security and privacy

- Use managed authentication for real accounts.
- Enforce row-level access so members cannot read or change another member's data.
- Keep privileged service credentials server-side.
- Separate demonstration data from real member records.
- Minimize retained logs and avoid storing unnecessary health information.

### 9.5 Reliability and maintainability

- Keep routine data separate from rendering logic.
- Validate active exercise metadata and asset paths before release.
- Preserve immutable session snapshots.
- Use branch-based previews and explicit production promotion.
- Maintain recovery and rollback procedures for production deployments.

## 10. Version history and product learning

### V1 - Visual Routine MVP

V1 proved that a simple static site could remove gym-floor uncertainty. It introduced a Monday-Saturday routine, primary/alternative choices, exercise illustrations, device-local checkmarks, and a public reference URL. It was intentionally personal and required no account or backend.

**Learning:** Visual clarity and predefined structure were more valuable than a complex logging system at the start.

### V2 - Guided Workout

V2 introduced a mobile two-screen flow, illustrated warm-up and recovery, date-based local history, recurring optional exercises, and better phone usability. It kept data private on the device and separated main workout completion from recommended preparation and recovery.

**Learning:** Members need guidance before and after lifting, but those sections must stay optional and compact.

### V3 - Accounts and Gym Management Foundation

V3 established separate member and coach experiences, Supabase authentication and data structures, role-based access, memberships, personalized plans, account controls, and local demonstration identities. It also explored a tiered exercise catalog and personal habit tracking.

**Status boundary:** V3 provides an architectural and demonstration foundation. Real gym operations, production data onboarding, support procedures, and organization-wide adoption still require V5 operationalization.

### V4 - Rich Visual Workout Experience

V4 expanded the member routine to ten ordered daily slots, strict muscle-compatible optional exercises, detailed exercise pages, setup/move/return visual phases, warm-up and recovery priorities, mobile refinements, and a three-ring monthly progress view. V4 is the current public showcase and the reference experience for the pilot.

**Learning:** Exercise discovery and execution must be visual at every point, including optional content and movement phases.

## 11. Pilot plan

### 11.1 Cohort

- 50 Fitness 7 members.
- Representation from both locations where operationally practical.
- Mix of beginner, intermediate, and experienced members.
- Mix of members who regularly request trainer guidance and members who train independently.

### 11.2 Pilot stages

1. **Readiness:** Verify routine accuracy, equipment compatibility, mobile behavior, safety language, and trainer briefing.
2. **Controlled onboarding:** Introduce members in small groups, provide a QR/link, and capture the first-session experience.
3. **Observation:** Measure usage, completion, repeated questions, errors, and support load for four weeks.
4. **Review:** Compare results against rollout gates and document required corrections.
5. **Expansion:** Move toward 1,000-member onboarding only after critical issues are resolved.

### 11.3 Pilot success criteria

| Metric | Pilot target |
|---|---:|
| Members who start at least one workout | 80% of invited pilot members |
| Weekly active pilot members by week four | 60% |
| Median time to open today's workout | Under 30 seconds |
| Members able to select an alternative without trainer help | 80% in observed test |
| Successful workout page loads | 99% during pilot period |
| Critical privacy or account incidents | 0 |
| Member satisfaction | At least 4.0/5 |
| Trainer-reported reduction in basic exercise-identification questions | At least 25% |

The targets are initial management thresholds and should be reviewed after baseline measurement. They are not guaranteed outcomes.

## 12. Measurement framework

### Activation

- Percentage of invited members who open the product.
- Percentage who reach a workout.
- Time from opening the product to viewing the first exercise.

### Engagement

- Weekly active members.
- Workouts started and completed.
- Alternatives and optional exercises selected.
- Exercise-detail views.
- Warm-up and recovery completion.

### Retention and consistency

- Week-one to week-four return rate.
- Active weeks per member.
- Completed workout zones and streak patterns.

### Service impact

- Trainer questions about exercise identity and setup.
- Support tickets and content-correction requests.
- Time required to publish a routine change.

### Business impact

- Annual maintenance cost avoided.
- Hosting and backend cost.
- Trainer time recovered.
- Member satisfaction and retention signals.

## 13. Business case

### Direct financial case

| Item | Annual amount |
|---|---:|
| Existing maintenance - Gym 1 | INR 30,000 |
| Existing maintenance - Gym 2 | INR 30,000 |
| Combined maintenance avoided | INR 60,000 |

The INR 60,000 is the approved planning basis for direct annual cost avoidance. Hosting, database, support, content production, and future feature costs must be tracked separately. Savings should be reported net of those actual operating costs after production onboarding.

### Strategic value to validate

- Faster product improvements.
- Stronger member confidence and consistency.
- Reduced repetitive trainer workload.
- Better visibility into workout engagement.
- A differentiated digital member benefit.
- A foundation for goals, home workouts, and responsible gamification.

No unmeasured benefit will be treated as realized revenue or guaranteed retention.

## 14. Risks and mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Incorrect exercise guidance | Safety and trust | Trainer approval, concise safety cues, controlled content publishing |
| Too much workout volume | Recovery and adherence | Tiered programs, required/optional separation, volume limits |
| Poor mobile performance | Abandonment | Asset optimization, phone-width testing, performance monitoring |
| Member data exposure | Legal and trust | Authentication, row-level security, least privilege, security testing |
| Trainer resistance | Low adoption | Include trainers in pilot, preserve coach authority, simplify admin tasks |
| Low member adoption | Weak ROI | Two-tap entry, QR onboarding, in-gym prompts, feedback loops |
| Content becomes outdated | Incorrect plans | Named content ownership, versioned routines, release checklist |
| Free-tier infrastructure limits | Reliability | Usage monitoring, capacity thresholds, documented upgrade decision |
| Brand or asset rights uncertainty | Legal exposure | Confirm Fitness 7 authorization and asset ownership before broad launch |

## 15. Dependencies

- Fitness 7 owner approval and brand authorization.
- Trainer review of active routines and exercise visuals.
- Confirmed equipment inventory by location.
- Production authentication and database configuration.
- Privacy notice, terms, and member support process.
- Named operational owners for member data and exercise content.
- Hosting and monitoring suitable for the rollout size.

## 16. Release and rollout gates

### Gate 1 - Pilot readiness

- Trainer-approved routine and exercise library.
- Mobile and accessibility checks pass.
- No critical asset or data validation failures.
- Privacy and support documentation available.

### Gate 2 - Pilot completion

- Four weeks of usable evidence.
- No unresolved critical security, privacy, or safety issue.
- Adoption and reliability thresholds reviewed by management.
- Prioritized correction backlog agreed.

### Gate 3 - Staged member expansion

- V5 operational requirements completed.
- Trainers and administrators trained.
- Support ownership and escalation path active.
- Capacity and cost reviewed before each cohort increase.

## 17. Future direction

The product roadmap is defined in `V5-V7-PRODUCT-SCOPE.md`:

- V5 operationalizes tiered training, member data, memberships, and coach workflows.
- V6 adds anywhere training and goal management.
- V7 adds responsible gamification and progress intelligence.

Payment processing, detailed calorie tracking, wearable integrations, and public social networking are not included in V5.

## 18. Approval record

| Role | Decision required |
|---|---|
| Fitness 7 owner | Approve pilot, business case, brand use, and rollout gates |
| Product manager | Own requirements, priorities, evidence, and release decisions |
| Head trainer | Approve training content, equipment compatibility, and safety wording |
| Operations/admin | Approve onboarding, support, membership workflows, and data ownership |
| Engineering/platform | Confirm security, reliability, deployment, monitoring, and recovery |
