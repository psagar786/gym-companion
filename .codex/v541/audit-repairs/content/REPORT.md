# Problem 5 — Local content correction report

Baseline: `6fe29fe`; branch: `codex/v541-release`. Local-only update.

## Implemented

- One exact content registry follows approved canonical artwork identities and explicit reused phase paths. No fuzzy exercise-name matching; no parent-equipment or parent-instruction inheritance.
- 116 canonical content entries restore concrete Start/Movement specifications with source provenance. The approved V4 Knee Tuck override uses the explicitly matching hanging bent-knee specification; artwork paths are unchanged.
- 33 of the original 66 alternative/Option 2 instruction labels are repaired. The remaining 33 labels are listed below.
- Work duration is no longer parsed from rest or coaching/tempo text. Short `s` and `m` units, ranges, total/per-side/per-leg/per-direction counts and walking steps survive display normalization.
- Expert uses the authored advanced tier; explicit structured prescriptions take precedence. Dynamic repetition pauses do not become a full isometric prescription. Method badges require an explicit source method.
- Locked/skipped doses say “Not scheduled for this level” rather than invented working sets. No Cardio is a text status. Cardio without an authored dose says “Cardio prescription under review.”
- Bodyweight, hold, mobility, vacuum, cable/machine and weighted progression use the reviewed canonical content category, not loose words such as “raise” or “rotation.” Conflicting setups do not receive progression advice.
- Generic setup boilerplate and elbow-curl coaching cannot masquerade as movement-specific Leg Curl guidance. Ambiguous records remain visibly under review.
- Timed cardio shows Duration, not Hold. Missing/unapproved/non-HTTPS/non-YouTube video links stay hidden.

## Confirmed source conflicts — not silently rewritten

| Day / movement | Conflict | Current treatment |
|---|---|---|
| Tuesday Stick Seated Russian Twists | Frozen pose uses planted feet; selected A Intermediate/Expert source requires elevated feet | Execution and progression under review for affected tiers |
| Tuesday Cable Pallof Press with Iso-Hold | Frozen pair is standing; A Intermediate source says half-kneeling | Execution and progression under review for affected tier |
| Wednesday Lying Leg Curl | A Intermediate prescription says seated position, while title and approved artwork are prone | Execution under review; no change to numeric prescription or artwork |
| Friday Floor Reverse Crunch with Pelvic Tilt | Frozen pair is floor-based; A Intermediate/Expert source asks for incline bench | Execution and progression under review for affected tiers |

The workload and source strings are preserved. Correcting these conflicts requires a programming/identity decision, not a guessed instruction edit.

## Remaining content coverage

Across 72 runtime cases (24 day records, including repeated A, × 3 levels), 1,867 displayed records were checked. 150 day/name entries have source-backed instruction coverage in at least one case; 107 have a review condition in at least one case. These totals overlap when a tier differs and are not unique movement or image-production counts. Two No Cardio day/name status records are excluded from the exercise-content queue.

333 occurrence doses still use the pre-existing role defaults because no usable authored dose is supplied. This pass does not invent a new program. Twelve cardio occurrences (the four Monday cycle records × three levels) have absent authored quantities and are explicitly marked under review. Specific safety-warning coverage is not claimed complete: concrete current authored warnings are retained, while missing warnings are marked under review rather than borrowed from a parent exercise.

### Remaining alternative instruction labels

- 45° Incline Leg Press
- Barbell RDL
- Bodyweight Box Squat
- Bulgarian Split Squats
- Cable Hip Adduction
- Cable Pull-Through
- Chest-Supported Machine Row
- Deficit Barbell RDL
- Deficit Bulgarian Split Squat
- Dumbbell Lying Leg Curl
- Ez-Bar Curl & Skullcrushers
- Goblet Squat to Box
- Hanging Windshield Wipers
- Incline Bench Row
- Incline DB Curl & Rope Pressdown
- Incline DB Press
- Low Incline Cable Fly
- Low-to-High Cable Fly
- Lying Leg Lift
- Machine Shoulder Press
- Meadows Row
- Overhead Dual-Cable Tricep Extension
- Romanian Barbell Deadlift
- Rope Tricep Pressdown
- Side Plank Abduction
- Single-Arm Cable Pulldown
- Standing Cable Crossover
- Step-Ups on Bench
- Underhand Lat Pulldown
- Walking Lunges
- Wide-Stance Leg Press
- Wide-Stance Sumo Goblet Squat
- Wide-Stance Sumo Leg Press

See `VALIDATION.json` for exact day/week/tier cases and the separate mechanics/equipment holds in `data/abac-exercise-content.js`. Combined exercises, excluded equipment and deferred tendon programming remain unapproved.

## Verification

- 34 prescription/status fixtures; 10 video/metric checks: PASS.
- 72 cases / 1,867 content and identity records: PASS.
- All original asset hashes / 302 active image paths: unchanged and PASS.
- Correct day labels/classifications, source prescriptions and exercise order: unchanged and PASS.
- 18 day/width browser checks at 320, 390 and 430px: PASS; no horizontal overflow, page errors or failed requested images. Representative detail images decode at 512×512.
- 64 return-navigation checks: PASS, including browser Back, nested scrolling, disclosures, focus and resize.
- 44 guided details / 3 optional details: PASS.
- Saved historical snapshots, optional additions, completion and variations persist: PASS.
- Syntax, member credential boundary and active asset-bundle checks: PASS.
- An initial regression-test harness omitted the new video validator and reported `ReferenceError: approvedVideoUrl is not defined`. The harness dependency was repaired and the check rerun successfully. No runtime failure remains from that issue.
- Existing checkpoint screenshots were preserved; current regression captures are stored separately in this content evidence directory.

Evidence: `evidence/home-390.png`, `evidence/alternative-detail-390.png`, `evidence/lying-curl-conflict-390.png`, plus separate persistence/navigation regression captures. Screenshots were visually inspected after image decoding.

No new artwork, CSS, programming/source-data edits, deletion, deployment, GitHub push or qualified coach approval. Dedicated real-iPhone/Safari optimization remains Problem 6.

Local review: http://localhost:4175/?v=5.4.1-content-correction
