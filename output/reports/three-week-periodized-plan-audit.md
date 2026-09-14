# Fitness 7 Three-Week Periodized Plan (A-B-C) Audit

**Source reviewed:** `Fitness 7 V5 — Optimized Master Workout Plan`  
**Source tab:** `3-Week Periodized Plan (A-B-C)`  
**Runtime decision:** four-week cadence `A → B → A → C` (Week C is the once-monthly foundation/strength-support week)  
**Status:** content-normalisation baseline for the local V5.3 lab; not a production approval

## 1. Executive readout

The tab contains 103 populated movement/activity rows across 21 day groups: Week 1, Week 2, and Week 3, each with Monday through Sunday. Week 1 and Week 2 are broadly repeatable training weeks. Week 3 is a sparse foundation/strength-support week rather than a complete third workout week. The agreed runtime therefore uses the source’s A and B content, repeats A as the third week, and maps the source’s Week 3 foundation intent to Week C.

The sheet is useful as a coaching reference, but it is not yet a safe runtime source without normalization. It mixes main movements, support work, cardio, tendon preparation, and recovery in one table; several rows bundle alternatives with “OR”; and some prescriptions do not match their row titles. The app adapter keeps the source row references while giving each movement a stable identity, movement-level targets, explicit role, and equipment review status.

## 2. Inventory by source week and day

| Source group | Populated rows | Runtime interpretation |
|---|---:|---|
| Week 1 Monday | 7 | Pull/press anchor plus support work |
| Week 1 Tuesday | 7 | Push and joint-support work |
| Week 1 Wednesday | 5 | Lower body plus support work |
| Week 1 Thursday | 7 | Pull/upper-body mixed day |
| Week 1 Friday | 7 | Push/shoulder and support work |
| Week 1 Saturday | 5 | Legs/core support |
| Week 1 Sunday | 1 | Active recovery |
| Week 2 Monday–Saturday | 38 | Repeatable second exposure with different emphasis |
| Week 2 Sunday | 1 | Active recovery |
| Week 3 Monday–Saturday | 24 | Sparse foundation/strength-support content |
| Week 3 Sunday | 1 | Active recovery |
| **Total** | **103** | **21 source day groups** |

The source role mix is: Foundation 6, Secondary 6, Shoulders 4, Triceps 2, Joint/Tendon 20, Cardio 14, Tendon 18, Rear Delts 2, Biceps 2, Core 7, Obliques 2, Isolation 3, Calves 2, Chest 2, Back 2, Arms 2, Recovery 3, and Anchor 6. These labels are retained for review, but the runtime additionally classifies each row as `core`, `optional`, `warmup`, `tendon`, `cardio`, `recovery`, or `active-rest`.

## 3. Movement-level review findings

### Main programming gaps

- Week C is not a complete six-day plan. Several days contain only three to five rows and need the fixed support areas to make the monthly session coherent.
- The sheet has no consistently authored rest, RIR, tempo, or progression field. The runtime supplies coach-safe tier prescriptions while retaining the sheet’s exercise order and cues.
- Week 1 titles imply higher repetitions, but multiple rows specify 8–10 reps. The app uses the prescription field as the source for display and flags title/prescription mismatches for review.
- Week 2 titles imply dumbbell/cable work, but some rows contain barbell or machine choices. These are shown as equipment-review decisions rather than silently substituted.
- The tendon/support work is not consistently located. For example, wrist-roller/forearm work appears on a leg-focused day; the app keeps it visible as support content but does not treat it as a leg core movement.
- Warm-up rows are not consistently separated from main exercise rows. The normalized source exposes warm-up and recovery panels independently.

### Bundled or ambiguous rows requiring atomic treatment

- `Y-T-W` should be three shoulder/scapular movements when shown as a sequence.
- `Walk + stick drills` should be a walk/cardio item plus separate stick mobility drills.
- `Incline barbell/DB press OR flat chest press` contains multiple mechanics and must resolve to separate alternatives.
- `Hanging leg/knee raises OR woodchoppers` contains different movement patterns and target areas.
- `Overhead press OR lat pulldown/pull-ups` cannot share one exercise identity.
- `Reverse wrist/forearm curls` should identify wrist extension and elbow-flexor support separately when both are prescribed.
- `Reverse crunch OR Pallof` contains flexion and anti-rotation and must remain separate choices.
- `DB RDL/conventional deadlift OR barbell hip thrust` mixes a hinge, deadlift, and hip-extension station.

## 4. Equipment compatibility decisions

The previous confirmed gym-equipment exclusions remain authoritative. The following source movements are not auto-approved for the member routine: captain’s-chair knee raise, banded Pallof press, banded monster walks, trap-bar RDL, cable hip abduction, cable standing hip abduction, hack squat, Swiss-ball leg curl, seated leg curl, cuffed cable rear-delt fly, reverse pec deck, machine chest press, barbell hip thrust, and ab wheel.

Approved review substitutions preserve the training pattern: cable Pallof press, bodyweight hip/ankle preparation, leg press, lying leg curl, dumbbell RDL or conventional deadlift, incline dumbbell reverse fly, cable fly, and hanging knee raise or reverse crunch. In the local adapter, excluded names are marked `Review before use · excluded from default activation` and are not silently activated.

## 5. Fixed support areas for Week C

The monthly Week C foundation session must cover the agreed support areas without turning them into an uncontrolled volume increase:

- Rotator cuff and shoulder external-rotation control.
- Scapular upward rotation, retraction, and depression control.
- Forearm and grip capacity.
- Deep core bracing and anti-extension.
- Spinal stability and controlled back-extension capacity.
- VMO/patellar and knee-control support.
- Tibialis and ankle control.
- Calf capacity and ankle range.

These are support slots or optional accessories, not replacements for the six core movements. Timed holds use the requested 30-second × 3-set format only where the movement is genuinely isometric.

## 6. Runtime mapping implemented in the lab

- New source: `data/periodized-abc.js`.
- Version: `periodized-abc-v1`.
- Cadence: `A → B → A → C`, anchored to the first Monday after activation.
- Sunday: active-recovery record with no main-workout completion requirement.
- Main workout: six core slots per training day.
- Optional/advanced rows remain separate and never determine main-workout completion.
- Every normalized record carries `stableMovementId`, movement-level target groups, role, equipment status, prescriptions, and source row references.
- Existing V5/V5.2/V5.3 sessions are not rewritten. New sessions receive the new source version.

## 7. Approval checklist before any remote release

- Coach confirms the normalized Week A/B/A/C order and each movement’s exact mechanics.
- Equipment availability is confirmed for every default and alternative.
- Bundled rows are split into atomic member-facing records.
- Tier prescriptions are reviewed for safe volume and the 90–110-minute upper bound.
- Warm-up, tendon, cardio, and recovery entries have distinct descriptions and are not counted as main slots.
- Artwork queue is derived from the frozen movement registry; no artwork is generated from ambiguous names.
- Runtime and content validators pass before any deployment decision.
