# Luna Medium Artwork Runbook

## Scope and safety

Work only in the V5.4 Periodized A-B-A-C artwork namespace. Do not change V4, V5, V5.1, V5.2, documentation, presentations, spreadsheets, coach/admin apps, or deployments. Existing artwork pairs are preservation candidates: never regenerate or overwrite them in this run. The spreadsheet is a content reference; the runtime registry and this manifest are the source of truth.

## Resume protocol (one atomic unit)

1. Read `.codex/v54/artwork/STATE.json`.
2. Confirm the exact workspace and branch `feature/member-accounts-v54`.
3. Inspect `git status --short`; do not discard unrelated work.
4. Read only the current row/specification named by `nextAtomicAction`.
5. Never regenerate an ID in `existingMovementIds`, `completedMovementIds`, or `excludedMovementIds`.
6. Execute exactly one mapping, specification, existing-art review, image phase, or validation unit.
7. Run that unit's technical checks.
8. Update `STATE.json`, `VALIDATION.md`, and the relevant report before stopping.
9. Commit after every five completed pairs or before stopping, and record the commit SHA.
10. Leave one exact `nextAtomicAction`; do not begin a second unit after a failure.

If repository state and `STATE.json` disagree, stop with `BLOCKED: checkpoint state does not match repository` and record the evidence without changing assets.

## Frozen baseline and count math

The audit baseline is 288 selectable identities, 125 existing Start/Movement pairs (250 files), and 163 missing sets (326 files). The sheet has 43 prompt rows and no blank prompt cells. Theoretical capacity is 43 sets / 86 files, which would leave 120 sets / 240 files. This is not the production count: only rows mapped to a distinct, missing runtime identity may be generated.

After semantic mapping, freeze `approvedMissingPromptMappings`. Then use:

```text
remainingMissingSets = 163 - generatedSets
generatedFiles = generatedSets * 2
remainingMissingFiles = remainingMissingSets * 2
```

Never report 43 generated sets unless 43 distinct missing canonical identities have passed both-phase validation. Existing-exact, alias-of-existing, excluded-equipment, combined-row-split-required, ambiguous-needs-review, and not-used rows do not count as generated sets.

## Phase 1: map the 43 prompt rows (no generation)

Read `2-Step Visual & Anatomy Library!A2:H44`. For each row, preserve the source name, category, Start position, Movement position, primary/secondary/stabilizer anatomy, and original prompt. Resolve to the actual selectable Periodized A-B-A-C runtime identity and stable ID. Confirm equipment, grip, stance, and mechanics; a name match alone is insufficient.

Assign exactly one status:

```text
existing-exact
missing-generate
alias-of-existing
combined-row-split-required
excluded-equipment
ambiguous-needs-review
not-used-by-current-runtime
```

Do not generate during mapping. For an alias, prove identical equipment, joint path, grip, range, and phase mechanics. For combined rows, create separate specs for each mechanically different movement. Exclude machine chest press, pec deck, trap-bar deadlift, and barbell hip thrust; if a row mixes allowed and excluded movements, keep only the allowed spec. Freeze the exact approved mapping count in `STATE.json` before generation.

Checkpoint: `V54-ART-01-PROMPT-MAP-FROZEN`

## Phase 2: special-row specifications

Split, do not merge, these mechanics when present: T-bar row vs Meadows row; straight-arm cable pulldown vs dumbbell pullover; hanging knee raise vs hanging straight-leg raise; standing vs seated trunk rotation; conventional deadlift vs trap-bar deadlift; Kas glute bridge vs barbell hip thrust. Each generated identity needs a compact spec containing equipment, camera angle, Start pose, Movement pose, direction, grip/stance, primary targets, secondary targets, stabilizers, and avoid-list. Stick, mobility, walking, cardio, recovery, and isometric tendon records receive activity-specific scenes, not generic lifting poses.

Checkpoint: `V54-ART-02-SPECS-FROZEN`

## Phase 3: existing-art review (read-only)

For each of the 125 existing pairs, verify presence, PNG decode, 512×512 dimensions, exact movement identity, equipment, phase difference, and path ownership. Mark `existing-review-passed` or `existing-mismatch-backlog`. Do not regenerate or overwrite either status. Existing mismatches are logged for a later repair run.

Checkpoint: `V54-ART-03-EXISTING-REVIEWED`

## Fitness 7 prompt contract

Use the `conversion.sharedPromptTemplate` in `PROMPT-MAP.json` and substitute the current movement spec. The source sheet's anatomy and mechanics remain authoritative, but its white-background EvolutionFit split-view wrapper is removed.

Required visual treatment:

- scientific-educational, premium realistic 3D fitness illustration;
- minimal charcoal gym background, black clothing, off-white figure/equipment;
- restrained orange primary-muscle emphasis, muted blue secondary, grey-green stabilizers;
- one adult athlete, one exercise, one phase, square 1:1 composition;
- full athlete and named equipment visible with at least 10% clear margin;
- consistent athlete, clothing, equipment, camera, lighting, and background within a pair;
- no white background, split view, collage, text, logo, watermark, external brand, unrelated equipment, distorted anatomy, mirrored equipment, cropped limbs/cables/bars/machines, or duplicated pose.

Start suffix: `Phase name: Start. Show the stable starting position before the repetition begins. Make equipment placement, grip, stance, bench or machine adjustment, posture, and joint stacking immediately understandable. Do not show peak contraction or movement arrows.`

Movement suffix: `Phase name: Movement. Use the approved Start image as the visual identity reference. Keep the same athlete, clothing, equipment, camera angle, lighting, and background. Show the peak working or clearly active position. Make it visibly different from Start through meaningful joint and equipment movement. Where helpful, use one restrained orange directional cue. Do not show the original Start pose.`

The built-in image-generation tool is the default. It does not require a separate API key. Generate one image per phase, inspect it, contain-resize proportionally to 512×512, pad with charcoal, and save as separate PNGs. Never stretch or auto-trim the athlete.

## Phase 4: generate one missing pair at a time

Generate only a `missing-generate` record. Start first; reject before generating Movement if equipment, anatomy, pose, grip, or framing is wrong. Generate Movement using Start as the visual identity reference, then confirm meaningful joint/equipment movement. Accepted files use:

```text
assets/exercises/periodized/{stableMovementId}-v2-start.png
assets/exercises/periodized/{stableMovementId}-v2-movement.png
```

Update the runtime registry only after both files pass technical checks and the pair is recorded in the state ledger. Commit after five completed pairs, not after an unvalidated output.

Failure statuses:

```text
WRONG_EXERCISE, WRONG_EQUIPMENT, WRONG_GRIP, WRONG_PHASE,
START_AND_MOVEMENT_TOO_SIMILAR, ANATOMY_ERROR, SUBJECT_CROPPED,
EQUIPMENT_CROPPED, MULTIPLE_POSES, BLURRY, STYLE_MISMATCH,
NEEDS_HUMAN_REVIEW
```

On failure, preserve the output only in a review area, record the exact reason and phase, set `nextAtomicAction` to repair that phase, and do not move to another movement.

## Per-pair validation gate

Both files must exist, decode as PNG, be exactly 512×512, have unique paths, different hashes, visibly distinct Start/Movement poses, correct movement/equipment/grip/stance, full subject and equipment, at least 10% margin, Fitness 7 styling, no external branding/text/split view, descriptive alt text, and registry paths that match rendered cards/details. Listing cards use Movement; details use Start and Movement. No unrelated fallback artwork is allowed. Perceptual comparison only flags similarity; it is not coach approval.

## Required state/checkpoint sequence

```text
mapping-frozen → specs-frozen → existing-reviewed →
start-generated → movement-generated → pair-validated → complete
```

Every stop must update the changed files, hashes, counts, failures, and one exact next action. Final completion is only the prompt-derived queue being generated and validated; do not claim the full 163-set backlog is complete unless every missing identity has actually passed.
