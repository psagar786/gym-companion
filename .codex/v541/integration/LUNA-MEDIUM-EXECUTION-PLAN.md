# Fitness 7 V5.4.1: Luna Medium execution plan

## 1. Mission

Finish and verify the V5.4.1 artwork-integration branch without rebuilding completed work.

This release is a controlled hybrid visual upgrade:

- 43 new scientific artwork sets exist.
- Each set has one 512 x 512 Start PNG and one 512 x 512 Movement PNG.
- The 43 sets map explicitly to 59 mechanically identical runtime identities.
- The current A-B-A-C runtime contains 291 selectable identities.
- 232 identities do not yet have V2 artwork and must retain their exact legacy artwork.
- No fuzzy image matching, placeholder substitution, or unrelated fallback is allowed.

The next goal is not to regenerate images. The next goal is to prove that the integrated images are correctly mapped, uncropped, readable on phones, and safe to deploy as a V5.4.1 preview.

## 2. Fixed project boundaries

Use only:

```text
Workspace: /Users/exxxy/Documents/Daily AI Help/gym-companion-v541-art-integration
Branch: codex/v541-v2-art-integration
Current integration commit: 7f2f719
Local port: 4177
Member app: http://localhost:4177/
Private artwork gallery: http://localhost:4177/?qa=art-v2
```

Do not edit or deploy:

- V4.
- V5.
- V5.1.
- V5.2.
- V5.3.
- Coach or admin applications.
- Product documentation, presentations, or spreadsheets.
- Existing legacy exercise artwork.

Do not create a new repository. Do not overwrite the V5.4 baseline branch.

## 3. Mandatory resume protocol

At the beginning of every Luna Medium session:

1. Open `.codex/v541/integration/STATE.json`.
2. Confirm that `workspace` matches the exact path above.
3. Confirm that the current Git branch is `codex/v541-v2-art-integration`.
4. Confirm that commit `7f2f719` is present in the branch history.
5. Inspect the working tree. Do not discard, reset, stash, or overwrite existing changes.
6. Read `nextAtomicAction`.
7. Read only the files needed for that action.
8. Execute one atomic unit only.
9. Run the checks assigned to that unit.
10. Record results in `.codex/v541/integration/VALIDATION.md`.
11. Update `STATE.json` only after the evidence exists.
12. Commit the completed unit before moving to another unit or before usage expires.
13. Leave one concrete `nextAtomicAction`.

If the branch, workspace, counts, or checkpoint disagree with the saved state, stop and record:

```text
BLOCKED: saved V5.4.1 checkpoint does not match the real checkout
```

Never restart from the 43-row spreadsheet or regenerate the completed pairs merely because the conversation history is unavailable.

## 4. Sources of truth

Use these files in this order:

1. `data/periodized-v2-runtime-map.json`
   - Exact V2 set to runtime-identity mappings.
   - A movement receives V2 artwork only when its runtime ID is listed here.
2. `data/periodized-v2-pilot.js`
   - Generated 43-record artwork and instruction library.
3. `assets/exercises/periodized-v2/`
   - The 86 V2 PNG files.
4. `output/reports/v541-artwork-coverage.md`
   - Human-readable coverage result.
5. `.codex/v541/integration/COVERAGE-AUDIT.json`
   - Machine-readable coverage result.
6. `.codex/v541/integration/VALIDATION.md`
   - Completed checks and known blockers.
7. `.codex/v541/integration/STATE.json`
   - Current checkpoint and exact next action.

Do not use visible exercise-name similarity as a source of truth.

## 5. Non-negotiable image rules

### Listing cards

- Use `imageSet.movement` from the exact selected movement.
- Keep the image square.
- Use `object-fit: contain`.
- Reserve the image box before loading to prevent layout shift.
- Lazy-load below-the-fold images.
- Do not crop the athlete, bench, bar, dumbbell, cable, machine, hands, or feet.
- Do not show a Start image on a listing card when Movement exists.

### Detail page

- Show Start first and Movement second.
- Use the full 512 x 512 source asset.
- Keep each asset inside a square, charcoal frame.
- Use `object-fit: contain`, never `cover`.
- Show the instruction belonging to the same phase beside or below the image.
- At widths of 640px and below, stack the image above its instruction.
- Above 640px, allow a 280px to 512px image column and a flexible instruction column.

### Identity safety

- Main, Alternative, and Option 2 must each resolve their own movement identity.
- Changing a variation must update title, image, instruction, prescription, and detail destination together.
- Never inherit the primary movement image for a mechanically different alternative.
- Never use a generic artwork placeholder in a member workout.
- An unmapped identity retains its exact legacy artwork.

## 6. Current checkpoint interpretation

Completed and not to be repeated:

- Isolated V5.4.1 worktree and branch.
- 43-pair asset promotion.
- 86-file technical validation.
- Explicit runtime mapping.
- Card Movement-image resolution.
- Detail Start-and-Movement resolution.
- Desktop no-crop layout.
- Local demo sign-in.
- Monday A-cycle smoke test.
- Gallery lazy-load test for all 129 visible V2 image instances.
- Member release and browser credential-boundary check.

Still required before preview deployment:

- Exact 320px, 390px, and 430px screenshots.
- Monday through Saturday representative workout review.
- Variation switching for Main, Alternative, and Option 2.
- Warm-up, tendon, cardio, recovery, and optional-card review.
- Semantic inspection of all 43 Start/Movement pairs.
- Human approval of the local result.
- Vercel preview deployment and preview verification.

The strict three-week production validator remains red because 232 non-pilot identities still contain missing three-week assets, incomplete content, or pending review status. Do not misreport this as a V2 asset-file failure. It is a full-library completion gap.

## 7. Execution stages

### Stage A: establish a clean checkpoint

Task ID: `V541-L01`

Actions:

1. Confirm branch and workspace.
2. Confirm the current commit.
3. Confirm whether `STATE.json` contains an uncommitted checkpoint update.
4. Review that change. If it only records truthful validation state, commit it.
5. Run `git diff --check`.

Pass conditions:

- No accidental source changes.
- No unstaged generated assets.
- The state file accurately names the next action.

Checkpoint:

```text
V541-L01-CLEAN-RESUME
```

### Stage B: rerun deterministic validation

Task ID: `V541-L02`

Run:

```text
node --check member-app.js
node --check data/periodized-v2-pilot.js
node scripts/validate-v2-pilot.mjs
node scripts/audit-v541-art-coverage.mjs
node scripts/validate-periodized-abc.mjs
node scripts/validate-member-release.mjs
node scripts/validate-personal-library.mjs
```

Expected evidence:

- 43 registered V2 sets.
- 86 registered V2 files.
- Zero missing V2 files.
- 86 unique paths.
- 86 unique hashes.
- 59 explicitly mapped runtime identities.
- 291 total runtime identities.
- 232 identities without V2 artwork.
- V5.4.1 member release marker present.
- No service-role reference in browser-delivered member files.

Run the strict three-week validator separately. Record its failure categories, but do not block local pilot inspection solely because the remaining 232 identities are incomplete. It does block claiming that the whole A-B-A-C library has been converted.

Checkpoint:

```text
V541-L02-DETERMINISTIC-PASS
```

### Stage C: start and verify the local server

Task ID: `V541-L03`

Actions:

1. Start the existing local member server on port 4177.
2. Confirm `http://localhost:4177/` responds.
3. Confirm `http://localhost:4177/api/config` responds in member/demo mode.
4. Confirm the response does not expose a service-role credential.
5. Sign in with the documented demo account.
6. Confirm the header displays `V5.4.1`.

Do not use `file://` for QA.

Checkpoint:

```text
V541-L03-LOCAL-RUNNING
```

### Stage D: exact mobile-layout validation

Task ID: `V541-L04`

Test these viewport sizes:

```text
320 x 720
390 x 844
430 x 932
1280 x 720
```

Capture and save:

1. Home at 390px.
2. One workout page at 320px.
3. One workout page at 390px.
4. One workout page at 430px.
5. A mapped main card with all three variation buttons.
6. A stick warm-up card.
7. A tendon card.
8. An optional exercise card.
9. One V2 detail page at 390px.
10. The same V2 detail page at desktop width.

For every viewport verify:

- No horizontal page overflow.
- The exercise image remains square.
- `object-fit` is `contain`.
- The image does not enter the text column.
- Long exercise names wrap without clipping.
- Done remains visible and at least 44 x 44px.
- Variation buttons wrap without overlapping the image.
- Start and Movement detail sections stack on mobile.
- No white gutter or contact-sheet edge is visible.
- No large layout jump occurs as images load.

Failure labels:

```text
LAYOUT_OVERFLOW
IMAGE_TEXT_OVERLAP
IMAGE_CROPPED
CONTROL_CLIPPED
TOUCH_TARGET_TOO_SMALL
LAYOUT_SHIFT
```

Fix the smallest responsible CSS rule. Do not add repeated emergency media-query overrides on top of conflicting rules.

Checkpoint:

```text
V541-L04-MOBILE-VERIFIED
```

### Stage E: runtime mapping and variation audit

Task ID: `V541-L05`

Review Monday through Saturday.

For each day:

1. Open the day card.
2. Record the rotation week and source day.
3. Inspect the six main movement cards.
4. For every mapped V2 movement, confirm the card URL is under `assets/exercises/periodized-v2/`.
5. Open its detail page and confirm Start and Movement use the same stable movement identity.
6. Return to the workout and confirm state is preserved.
7. Test Main, Alternative, and Option 2 where available.
8. Confirm a mechanically different option never reuses the previous movement's V2 path.
9. Confirm an unmapped option retains its exact legacy path rather than an unrelated V2 path.

Also inspect:

- Warm-up.
- Tendon preparation.
- Cardio.
- Recovery.
- Optional picker.

Do not mark an entire day as passed after checking only its first movement.

Checkpoint:

```text
V541-L05-RUNTIME-MAPPING-VERIFIED
```

### Stage F: all-43 semantic artwork review

Task ID: `V541-L06`

Open the private gallery at `?qa=art-v2`.

For each of the 43 pairs record:

- Exercise title.
- Runtime-mapping status.
- Start image status.
- Movement image status.
- Equipment correctness.
- Grip and stance correctness.
- Joint-path plausibility.
- Start/Movement difference.
- Athlete and equipment containment.
- White-border/contact-sheet contamination.
- Overall result.

Allowed results:

```text
TECHNICAL_PASS
NEEDS_HUMAN_REVIEW
WRONG_EXERCISE
WRONG_EQUIPMENT
WRONG_GRIP
WRONG_PHASE
PHASES_TOO_SIMILAR
CROPPED
BLURRY
ANATOMY_ERROR
```

Do not claim gym-coach approval. Luna may report only technical pass and AI-assisted semantic review.

If a pair fails:

1. Do not delete it.
2. Do not map it to additional runtime identities.
3. Add the exact failure to `VALIDATION.md`.
4. Add one repair task for that pair.
5. Continue only after saving the checkpoint.

Checkpoint:

```text
V541-L06-SEMANTIC-REVIEWED
```

### Stage G: local acceptance package

Task ID: `V541-L07`

Prepare a concise handoff containing:

- Local member URL.
- Private gallery URL.
- Branch name.
- Commit SHA.
- 43-set/86-file technical result.
- 59-of-291 runtime mapping result.
- The 232-set remaining V2 conversion gap.
- Mobile screenshot locations.
- Semantic failures, if any.
- Explicit statement that the app is hybrid, not a complete V2 replacement.

Ask for local approval before deployment.

Checkpoint:

```text
V541-L07-SAGAR-REVIEW
```

### Stage H: Vercel preview only after approval

Task ID: `V541-L08`

Preconditions:

- Sagar has approved the local version.
- `V541-L04`, `V541-L05`, and `V541-L06` are complete.
- The working tree is clean.
- The branch is pushed to `psagar786/gym-companion`.
- The target Vercel team and project are verified before deployment.

Deployment rules:

- Create a V5.4.1 preview first.
- Do not overwrite old version-specific deployments.
- Use member-safe environment variables only.
- Never add `SUPABASE_SERVICE_ROLE_KEY`.
- Do not promote to production until preview verification passes.

Preview checks:

- App and `/api/config` load.
- Demo login works.
- Header says V5.4.1.
- Home and current-day behavior match local.
- Mapped V2 cards and details load with no broken requests.
- Main, Alternative, and Option 2 remain identity-safe.
- Mobile screenshots match local.
- No coach/admin screen or privileged API is exposed.

Checkpoint:

```text
V541-L08-PREVIEW-VERIFIED
```

Production promotion is a separate atomic unit and requires explicit approval.

## 8. State-update format

After each unit, update `STATE.json` with:

```json
{
  "currentCheckpoint": "V541-L04-MOBILE-VERIFIED",
  "completedUnits": ["..."],
  "failedUnits": [],
  "changedFiles": [],
  "validationResults": {
    "mobile320": "pass",
    "mobile390": "pass",
    "mobile430": "pass"
  },
  "lastCommit": "exact-sha",
  "knownIssues": [],
  "nextAtomicAction": "Audit Monday Main, Alternative, and Option 2 image ownership"
}
```

Use exact facts. Never use `done`, `looks fine`, or `all good` without the corresponding evidence.

## 9. Usage-limit rules

- Work on one task ID at a time.
- Do not open the full generated library when one record is enough.
- Use the saved coverage report instead of recounting manually unless code changed.
- Do not regenerate the 43 completed pairs.
- Save screenshots and compact results rather than repeating long prose.
- Commit after each stage that changes source files.
- If usage becomes low, stop before starting another task.
- Before stopping, update state and write one exact next action.
- A later Luna session must continue that action, not restart Stage A.

## 10. Definition of done for V5.4.1 preview readiness

V5.4.1 is preview-ready only when:

- All 43 V2 pairs remain present and technically valid.
- All 59 runtime mappings remain explicit and identity-safe.
- No V2 image is displayed for an unlisted runtime ID.
- Cards use Movement.
- Details use Start and Movement.
- Images are contained, square, and uncropped.
- 320px, 390px, and 430px checks pass.
- Monday through Saturday and every exercise role are smoke-tested.
- Semantic failures are either repaired or removed from runtime mappings.
- Member security checks pass.
- The hybrid coverage gap is disclosed.
- Sagar approves the local build.

V5.4.1 is not a complete all-V2 A-B-A-C release. A separate future production wave is required for the remaining 232 identities.
