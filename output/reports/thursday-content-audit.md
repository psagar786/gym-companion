# Thursday content audit — Pull B · Shoulders + Back + Chest

Scope: the Thursday record in each A, B, and C periodized week. The same authored copy is intentionally reused only where the movement identity is identical; prescriptions remain tier-aware.

## Coverage

| Zone | A/B/C rendered records | Content status |
|---|---:|---|
| Pre-workout | 3 per week | Authored dose, description, phases, cue, mistake, safety, progression |
| Main workout | 6 per week | Authored for both A and B movement identities and all alternatives |
| Optional | 2 per week | Authored and kept below the core workout |
| Cardio | 1 per week | Authored Zone 2 dose, pacing and safety |
| Recovery | 3 per week | Authored stretch dose, setup, range and safety |
| Tendon preparation | 1 per week | Authored separately in `data/v53-content.js` |

## Exercise identities reviewed

### Preparation

- Stick Behind-the-Back Chest Opener / Stick Behind-the-Back Opener — 1–2 rounds of 5–8 slow reps, 20 seconds rest; wide grip, ribs stacked, no forced shoulder extension.
- Stick Dislocates — 1–2 rounds of 5–6 reps, 20 seconds rest; wide grip, overhead arc, no shrugging or painful end range.
- Stick Lat Stretch — 1–2 sets of 20–30 seconds per side, 20 seconds rest; reach up before the side bend and keep both feet grounded.

### Main movement identities

- Seated Dumbbell Overhead Shoulder Press.
- Standing Barbell Overhead Press.
- Close-Grip V-Bar Lat Pulldown.
- Neutral-Grip Lat Pulldown (Close-Grip V-Bar).
- Seated Wide-Grip Cable Row.
- Chest-Supported T-Bar Row.
- Cable Fly.
- Incline Smith Machine Press 45°.
- Incline Dumbbell Curl.
- Bayesian Cable Curl.
- Incline Dumbbell Reverse Fly.
- Incline Prone Dumbbell Reverse Fly.

Each main identity now has a tier-specific sets/reps/rest dose, target muscles, a practical form cue, an observable mistake, an exercise-specific safety boundary, a progression rule, and Start/Movement phase instructions with grip and direction guidance.

### Optional work

- Dumbbell Pullover on Flat Bench.
- Side Plank Hold with Rotation.
- Incline Cable Pullover with Stretched Bias.
- Hanging Oblique Knee Raise.

Optional work is explicitly accessory volume. It does not change the six-slot main completion score.

### Cardio and recovery

- 15 Min LISS Incline Walk (Speed 3.8 km/h, Incline 9%) — 10–20 minutes depending on tier, conversational effort, no rail-hanging or interval push.
- Stick Doorway Chest Stretch — 1–2 sets of 20–30 seconds per side.
- Stick Lat Stretch — 1–2 sets of 20–30 seconds per side.
- Cross-Body Stretch — 1–2 sets of 20–30 seconds per side.

## Validation

- 60/60 A/B/C Thursday records contain `description`, `prescriptions`, `why`, `cue`, `commonMistake`, `safetyCue`, `progression`, and `phaseBriefs`.
- Listing cards now show a short description and an explicit `Form cue:` line.
- `node scripts/validate-periodized-abc.mjs` passes the periodized identity, target-group, six-slot, Sunday, and equipment checks.
- This is content and technical validation only; no qualified gym-coach approval is claimed.
