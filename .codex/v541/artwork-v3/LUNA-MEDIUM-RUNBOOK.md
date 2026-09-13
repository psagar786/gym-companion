# Luna Medium runbook — Fitness 7 A-B-A-C unified artwork v3

## Current checkpoint

Read `.codex/v541/artwork-v3/STATE.json` first. This audit has frozen a conservative queue of 223 canonical replacement sets and 446 separate files. Do not regenerate the completed 43 V2 sets.

## Resume protocol

1. Confirm workspace `/Users/exxxy/Documents/Daily AI Help/gym-companion-v541-art-integration`.
2. Confirm branch `codex/v541-v2-art-integration`.
3. Inspect the working tree; do not reset or overwrite changes.
4. Read only `STATE.json`, the current manifest, and the current report section.
5. Execute only `nextAtomicAction`.
6. Run the unit checks.
7. Update `STATE.json` and `VALIDATION.md`.
8. Commit before starting another unit or before usage expires.

If state and checkout disagree, stop with: `BLOCKED: artwork-v3 checkpoint does not match checkout`.

## Frozen decisions

- Asset model: two separate files per physical movement, Start and Movement.
- Non-exercise records (hydration, nutrition, and NO CARDIO) receive no artwork.
- Existing V2 art remains unchanged.
- Eight unused V2 sets remain preserved but are not counted as A-B-A-C coverage.
- No fuzzy aliasing. Similar names remain separate until mechanics are proven identical.

## Atomic units

- `V541-ART-V3-01`: inspect runtime inventory and excluded records.
- `V541-ART-V3-02`: review every duplicate-name alias decision.
- `V541-ART-V3-03`: lock equipment, grip, stance, camera, muscles, and phase positions for one canonical group.
- `V541-ART-V3-04`: verify one pair of prompts and output paths.
- `V541-ART-V3-05`: batch future generation in 10–15 canonical pairs only after approval.

## Per-movement specification gate

Do not generate while any of these fields are ambiguous: equipment, equipment availability, grip, stance, camera, Start pose, Movement pose, direction, safe range, primary muscles, or negative constraints.

## Image generation contract

- Use the shared prompt in `MASTER-PROMPT.md`.
- Keep one athlete and one movement per image.
- Generate Start first.
- Generate Movement using Start as the identity reference.
- Require visibly different joint and equipment positions.
- Inspect before resizing.
- Contain-resize to 512 x 512 and pad with charcoal.
- Never stretch, crop, mirror, or place text inside the image.

## Technical checks

- Both files exist and decode.
- Both are PNG and exactly 512 x 512.
- Paths are unique to one canonical ID.
- Hashes differ.
- Athlete and equipment remain inside the safe margin.
- Runtime registry points to Start and Movement for the same canonical ID.

## Semantic review

Record `TECHNICAL_PASS`, `WRONG_EXERCISE`, `WRONG_EQUIPMENT`, `WRONG_PHASE`, `PHASES_TOO_SIMILAR`, `CROPPED`, `BLURRY`, `ANATOMY_ERROR`, or `NEEDS_HUMAN_REVIEW`. Technical or AI review must never be described as qualified gym-coach approval.

## Stop conditions

Stop immediately if a generated image is wrong, if a pair is too similar, if a path belongs to another identity, if an excluded movement appears, or if a non-exercise status record is sent to image generation. Save the failure and set one exact repair action.

## Completion

The audit stage is complete when the canonical count, alias decisions, prompt manifest, and gap report are committed. Artwork production and app integration are separate later stages.
