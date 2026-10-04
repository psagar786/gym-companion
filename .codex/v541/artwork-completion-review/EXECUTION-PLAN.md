# Fitness 7 — Isolated local artwork completion and evidence-led training review

## Scope and boundaries

User requested a separate local branch with missing artwork, explicit pending items, and detailed UI, UX, exercise and content review for an intermediate-to-advanced trainee aiming to become leaner while retaining/building strength and muscle. This document is an execution plan, not completed generation, a completed UI audit, a medical assessment or a personalized prescription.

- Work only in `codex/v541-artwork-completion-review`, sibling checkout `/Users/exxxy/Documents/Daily AI Help/gym-companion-v541-artwork-review`.
- Baseline checkout and port 4175 remain untouched. Review preview will use port 4176 after checking availability again.
- No GitHub push, Vercel deployment, production promotion, cloud member-data write, Supabase migration, paid image API or historical asset deletion.
- Keep existing artwork, V4 overrides, exact aliases, exclusions, session snapshots and completed repair behavior recoverable.
- User has authorized new generic male-athlete exercise imagery, local incorporation and analysis. Exercise-programming changes remain a separate scope choice; default is recommendations only until clarified.
- Do not infer that a muscle is weak or overdeveloped from body weight, BMI, an AI image or a demo profile. Do not promise fat loss in a selected body region or a guaranteed transformation.

## Personal context — confirmation gate

`member-app.js` currently contains a hard-coded **demo** profile: age 33, 167.6 cm, 87 kg, target 70–75 kg, six training days and a 6–12 month timeline. Those values are not verified current body markers. No current body-fat measurement, waist, injury/medical restrictions, working lifts, recovery capacity or training history was confirmed in this review.

Request: current values/restrictions; consistent training experience; realistic days/session minutes; priority muscles/fitness outcomes; and whether to implement an experimental routine locally or keep programming unchanged. Do not fetch private cloud health/member records. Do not store personal measurements in public app source or image prompts. Recommendations must state what is confirmed, assumed, evidence-backed, and awaiting coach/user review.

## Unit 1 — Freeze actual runtime and visual evidence

1. Read this `STATE.json`, branch, Git status and previous checkpoint.
2. Re-evaluate all six days, three tiers and A/B/repeated-A/C cadence; retain occurrence IDs, roles, equipment, prescriptions, eligibility and current phase paths.
3. Reconcile against the current 245 eligible physical day/name entries, 215 resolved entries and 30 pending entries. These are not unique canonical generation counts.
4. Hash existing referenced artwork before editing and protect all baseline asset bytes.
5. Capture the current flow in the in-app browser: Home → plan/level → workout → variation → detail → Back → Done → guided/optional sections → history. Capture at 393×852 (iPhone 16 logical portrait), with 320/390/430px reflow regressions, and desktop.
6. Save and open each current screenshot before using it as audit evidence. Prior screenshots are context, not fresh evidence. Record screenshot step, issue, severity, impact and recommendation. Physical Safari, safe area, VoiceOver and touch behavior remain separate unless tested on the actual device.

Checkpoint: `F7-REVIEW-01-INVENTORY-AND-FLOW-FROZEN`.

## Unit 2 — Confirmed image-production queue

Eight missing pairs:

| Day | Exercise | Runtime use |
|---|---|---|
| Wednesday | Standing Machine Calf Raise | Expert optional A/C |
| Wednesday | Deficit Barbell RDL | Alternative B |
| Wednesday | Stick Overhead Deep Squats | Warm-up B |
| Wednesday | Sissy Squat | Expert optional B |
| Wednesday | Seated Calf Raise Machine | Expert optional B |
| Thursday | Incline Smith Machine Press 45° | Main B |
| Thursday | Bayesian Cable Curl | Main B |
| Thursday | Overhead Dual-Cable Tricep Extension | Alternative B |

Three defective-pair replacements:

- Chest-Supported T-Bar Row: keep one chest-supported machine and standing support configuration in both phases; never switch to a seated row.
- Incline DB Press: lock the authored incline angle first; never borrow a steep/upright shoulder-press pose.
- Wide-Stance Leg Press: lock one machine geometry, seating/backrest, stance and knee path for both phases, including the explicit Wednesday sumo alias only when mechanically exact.

**Initial confirmed minimum: 11 pairs / 22 phase files.** Approval to generate does not resolve an ambiguous specification. Any of these whose support angle, machine configuration or joint path remains uncertain stops at the single specification and receives a targeted question. Updated 4 October: authored cross-bench pullover and explicit 45° mid-stance press were separately confirmed, bringing the accepted total to 13 pairs/26 phases. See current STATE, MISSING-QUEUE and AUDIT-REPORT; the generic Leg Press conflict is not cleared.

## Unit 3 — Resolve the remainder without disguising uncertainty

Nine mechanics holds:

- Wednesday: Leg Press; 45° Incline Leg Press; Reverse Lunges with DBs; Walking Lunges; Bulgarian Split Squats; Stick Hip Swings.
- Thursday: Dumbbell Pullover on Flat Bench; Incline Bench Row; Low-to-High Cable Fly.

Review each against original source, tier instructions and all existing complete pairs. Reuse only exact equipment, loading, grip, stance, support angle, resistance direction, start/working positions, range and unilateral/bilateral execution. Name similarity is not evidence. Approve a new distinct prompt only after source mechanics are fixed and documented.

Five combined decisions:

- Tuesday: Standing & Seated Transverse Abdominis Stomach Vacuum.
- Thursday: Ez-Bar Curl & Skullcrushers; Incline DB Curl & Rope Pressdown.
- Friday: Standard Forearm Plank to RKC Hardstyle Plank.
- Saturday: Bodyweight Air Squats to Walking Lunges.

Do not illustrate a combined name with one component's image. Produce a proposed atomic/tier/superset mapping with the original prescription retained for review; activate only an approved identity decision. Existing correct atomic pairs may avoid generation. A multi-exercise method cannot invent an unauthored partner.

Four deferred tendon records: Tuesday wrist flexor, Wednesday patellar, Thursday calf, Saturday core-brace isometric. Preserve prior user deferral pending research. Do not turn generic resistance-training guidance into tendon rehabilitation prescriptions. Core bracing may need a category correction rather than tendon artwork. Explain pending items visibly in the review report.

Four known content/setup conflicts require separate decisions:

1. Tuesday Stick Seated Russian Twists: planted-foot art versus elevated-foot Intermediate/Expert source.
2. Tuesday Cable Pallof Press with Iso-Hold: standing art versus half-kneeling Intermediate source.
3. Wednesday Lying Leg Curl: prone title/art versus seated Intermediate source.
4. Friday Floor Reverse Crunch: floor art versus incline-bench Intermediate/Expert source.

Freeze a revised exact canonical generation count after these decisions; never claim 30 pending labels mean 30 new sets or that 22 files complete the entire backlog.

Checkpoint: `F7-REVIEW-02-DECISIONS-AND-PROMPTS-FROZEN`.

## Unit 4 — Generate one phase at a time

Use the built-in image-generation workflow, no separate API key or paid service. Load only the current locked specification and shared scientific Fitness 7 preamble.

- One adult male athlete, realistic proportions, black kit; charcoal background; off-white equipment; restrained orange primary muscles, muted blue secondary muscles, grey-green stabilizers.
- One athlete, pose, movement and phase per image. No contact sheet, split view, text, branding, white background, unrelated equipment, distorted joints or cropped equipment/body.
- At least 10% clear framing margin. Exact grip, equipment adjustment, stance, resistance direction and safe range. Static/isometric working tension must not invent a large dynamic movement.
- Start: stable setup. Movement: meaningful working position, generated with accepted Start as identity reference. Same person, kit, machine, camera and lighting.
- Save source output in the review workspace immediately; record source path/hash and phase status before another call. Never leave a project-linked asset only in a generator cache.
- Inspect source visually; proportionally contain-resize and pad to 512×512 charcoal PNG without cropping/stretching. Produce a WebP display copy after the PNG passes; retain original masters.
- Additive namespace: `assets/exercises/periodized-v5-review/{canonicalId}-v5-start.png` and `...-v5-movement.png`; corresponding `.webp` files for the review app. Never overwrite V3/V4.
- Validate PNG/512×512, hash/path difference, correct mechanics, full framing and distinct phases. AI-assisted semantic review is not coach approval.
- Failed outputs stay outside active mappings. Repair only failed phase, never regenerate an accepted companion with matching hash. Log failure reason and exact next action.
- Checkpoint after **every phase**, plus pair acceptance. Commit after two or three accepted pairs and before stopping/usage interruption. Eleven pairs use small 3/3/3/2-pair groups, not a monolithic generation job.

Checkpoint per pair: `F7-REVIEW-{canonicalId}-PAIR-ACCEPTED`.

## Unit 5 — Training-programme analysis, not unsupported personalization

Use actual selected main movements, not every alternative at once. Produce separate Intermediate and Expert tables for A/B/C plus the repeated A calendar position.

Measure:

- Weekly direct working sets by muscle; identify secondary compound contributions separately rather than pretending exact fractional equivalence.
- Frequency, movement patterns (horizontal/vertical push/pull, knee/hip dominant, unilateral, calf, trunk), duplicate stimulus and omitted patterns.
- Exercise order, hard-set density, realistic session time including warm-up/rest/recovery, progression and deload/maintenance logic.
- Main/core day allocation, cardio availability/intensity/duration, recovery spacing and adherence burden.
- Source-authored versus default/unknown quantities; do not label a missing dose as zero or count mobility/vacuum sets as equivalent loaded hypertrophy work.
- Alternative equivalence: a change of artwork is not proof of equivalent training stimulus or load.
- Advanced/skill-heavy options, fatigue cost, knee/back/shoulder constraints, and whether complexity supplies value for this user's goals.

Research register starts with:

1. ACSM 2026 official resistance-training summary: https://www.acsm.org/wp-content/uploads/2026/03/Resistance-Training-Position-Stand-infographic.pdf . General benchmark: consistency, major-muscle coverage and gradual progression, with goal-specific settings. Not an individualized medical prescription.
2. IUSCA 2021 athlete hypertrophy position stand: https://journal.iusca.org/index.php/Journal/article/view/81 and https://journal.iusca.org/index.php/Journal/article/download/81/140/5323 . Review full relevant sections before deriving athlete-level load/volume/rest/proximity-to-failure guidance; distinguish trained populations from general healthy adults.

Use additional primary research/official guidance for concurrent cardio, energy-deficit muscle retention and safety where necessary. Track source date, population, certainty, applicability and limits. No invented expert endorsement. Diet design is out of scope. Do not infer a user's weak muscles from the stated fat-loss goal.

Deliver a recommendation matrix: keep / reduce redundant work / increase only if justified / substitute for access or comfort / clarify / coach review. Explain evidence, current runtime observation, personal constraints and trade-offs for each. Default leaves prescriptions and schedule untouched; an experimental local programme requires the user's scope choice and enough relevant constraints. Its old-versus-new workload and recovery trade-offs must be visible and historical snapshots stay immutable.

Checkpoint: `F7-REVIEW-03-TRAINING-AND-CONTENT-ANALYSIS`.

## Unit 6 — Local integration and showcase

- Add exact review overrides at one shared display boundary. Cards use Movement; details use separate Start and Movement. No fuzzy lookup, primary fallback or activation of excluded equipment.
- Do not rewrite production registries or historical sessions. Preserve view-return, chosen variations, completion, recurring extras and ABAC-only Home.
- Keep pending records honest. Add a local-only review summary/report route only if useful, not a new normal member clutter card.
- Start a local server on 4176 from this checkout; verify its source/hash and config before sharing. No conflict with baseline 4175 or production.
- Showcase approved new pairs and a separate table of unresolved content/mechanics/tendon/combined decisions. Compare baseline and review using the same day, phase, tier, variation and viewport.

Checkpoint: `F7-REVIEW-04-LOCAL-INTEGRATED`.

## Unit 7 — Validation and final handoff

Run syntax, exact artwork ownership/paths/dimensions/hashes, classification, dose/content, detail identity, return-scroll, persistence, member-security and member-build checks. Cover all six days × A/B/repeated-A/C × three levels; all eligible variations and optional/guided records. Assert exclusions remain excluded and old asset hashes unchanged.

Capture current local Home, plan, workout, alternative, detail, return position, guided work, optional picker and history. Open/inspect accepted screenshots; write step-numbered UX and accessibility findings. Test 320/375/390/393/414/430px and desktop, with exact image/text/Done bounds and overflow checks. Full physical iPhone/Safari testing is not implied by viewport emulation. Browser automation outside the selected in-app browser requires the user/tool approval required by the product-audit workflow.

Save:

- `STATE.json`, `WORK-LEDGER.md`, `VALIDATION.md`.
- `RUNTIME-INVENTORY.json`, `PROMPT-MANIFEST.json`, `GENERATION-MANIFEST.json`, `REPAIR-QUEUE.md`.
- `PENDING-DECISIONS.md`, `SOURCE-REGISTER.md`, `TRAINING-REVIEW.md`, `UI-UX-REVIEW.md`.
- Current screenshots and protected-asset hash manifest.

Final checkpoint: `F7-REVIEW-05-LOCAL-SHOWCASE`. Report approved pair/file counts, actual remaining queue, review URL, checks, limitations and one next action. Never claim every pending record resolved when a specification, phase, coach review or personal-data decision remains open.

## Luna Medium resume protocol

1. Read this branch's STATE, verify path/branch/status and previous checkpoint.
2. Read only the next movement or audit unit and current locked sources.
3. Execute one exact `nextAtomicAction`; do not repeat a completed hash-matching phase.
4. Validate; record failures without advancing or marking complete.
5. Checkpoint every phase/unit, including source/output paths, hashes, technical/semantic status and remaining count.
6. Commit validated source/checkpoint units; preserve all unrelated work.
7. Leave exactly one next action before stopping. Work can continue while the user is away in an active session, but must not promise execution after a session/usage interruption. Resume from the saved checkpoint.
