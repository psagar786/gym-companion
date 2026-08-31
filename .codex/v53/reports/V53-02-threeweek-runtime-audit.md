# V53-02 Three-Week PPL Runtime Audit

**Snapshot:** 2026-08-31, `feature/member-accounts-v53`  
**Scope:** Data/runtime readiness only. This audit does not modify rendering, workout content, artwork, or cloud data.

## Gate result

**Not activation-ready.** The new source has a useful normalized foundation, but the member runtime does not consume it and its content/artwork is intentionally incomplete.

`node scripts/validate-threeweek-ppl.mjs --audit` currently reports:

- 3 of 3 resolvable rotation weeks.
- 18 of 18 rendered training days from six shared day definitions.
- 108 of 108 rendered core slots.
- 86 unique active movement/guided identities reached by the schedule.
- 555 activation errors and two manual-review warnings.

| Gate | Count | Meaning |
|---|---:|---|
| Review approval | 258 | Active identities are not yet marked artwork-, visual-, and coach-approved. |
| Start/Movement assets | 172 | Exact V5.3 WebP pairs do not exist. |
| Authored content | 75 | Required coaching fields are absent. |
| Phase instructions | 46 | Start or Movement instruction is absent/generic. |
| Runtime integration | 4 | Canonical source, tendon accounting, and two-frame detail defects remain. |

The validator deduplicates movement identities before content/artwork checks. Counts are activation findings, not an estimate of images to generate.

## What exists now

- `data/v53-threeweek.js` defines a canonical registry, six PPL days, six slots per day, three variants per slot, relevant extras, tier prescriptions, tendon records, equipment exclusions, rotation logic, and an immutable resolver.
- Six shared day definitions are sufficient because each slot owns Primary, Alternative, and Option 2; resolving across three weeks yields 18 day views.
- The source exports `window.GYM_COMPANION_V53_THREEWEEK` with `source_version: threeweek-ppl-v1`.
- Demo/local preferences now have a rotation anchor, active session lookup uses the active source version, snapshots preserve the rotation week, and tendon-only checks count as workout activity.

## Release-blocking findings

### Canonical source is not used by the member runtime

The source exports `GYM_COMPANION_V53_THREEWEEK`, while `member-app.js` reads `GYM_COMPANION_V53_PLAN`. The live plan falls back to V5 routine records rather than resolving the new registry.

Required fix: consume one canonical global and use its `resolveDay(dayIndex, {weekIndex,tier,overrides})` output for Home, Workout, Details, Extras, and snapshots.

### Tendon completion is only partially integrated

Independent tendon checks, snapshots, and activity visibility work. `ringStatus()` and `zoneCounts()` still omit tendon work. History does not list tendon completion, so weekly Warm-up progress understates scheduled preparation.

Required rule: store tendon separately, but complete/count the Warm-up zone across both scheduled warm-up and tendon items.

### Two-frame details are not connected

New V5.3 records use Start + Movement. The detail pipeline still assumes Setup + Move + Return and does not explicitly read the Start image.

Required fix: add a V5.3 two-frame adapter while leaving three-frame legacy snapshots readable.

### Content and artwork remain a production backlog

Every selectable identity needs exact targets, equipment status, card description, benefit, form cue, common mistake, safety cue, progression, tendon/joint note, authored phase instructions, descriptive alt text, two exact 512×512 WebPs, and separate artwork/visual/coach approval.

Tendon records must not reuse one generic isometric image. They remain draft-only until exact pairs and coaching metadata pass.

## Validator usage

```sh
node scripts/validate-threeweek-ppl.mjs --self-test
node scripts/validate-threeweek-ppl.mjs --audit
node scripts/validate-threeweek-ppl.mjs --data-only --audit
node scripts/validate-threeweek-ppl.mjs --json --audit
node scripts/validate-threeweek-ppl.mjs
```

- `--self-test`: verifies missing schedule, equipment denylist, duplicate phase, and image-header rules.
- `--audit`: reports the staged backlog without failing the development run.
- `--data-only`: omits static runtime checks.
- `--json`: machine-readable evidence for the progress ledger/CI.
- Default: activation gate; exits non-zero for release blockers.

The validator checks schedule coverage, six-slot days, distinct variants, target compatibility, excluded equipment, optional type/target rules, tier prescriptions, authored copy, two-frame metadata/files, unique artwork ownership, source-version/rotation integration, and tendon accounting.

It cannot prove mechanics, perceptual pose difference, clear margins, or mobile usability. Those require recorded image review, gym-coach review, and browser checks.

## Next atomic actions

1. Make `GYM_COMPANION_V53_THREEWEEK` the one runtime source and remove the temporary V5 wrapper.
2. Correct tendon ring/count/history behavior.
3. Add the Start + Movement detail adapter.
4. Complete authored movement metadata before generating artwork.
5. Produce exact image pairs in small approved waves; never activate placeholders.
6. Run the default validator, then mobile/browser and manual visual reviews before deployment.

## Non-regression boundaries

- Do not rewrite V4, V5, V5.1, V5.2, or Bi-Weekly snapshots.
- Do not deploy before local approval.
- Do not use name-only substitutions or unrelated fallback art.
- Do not mark art approved from file existence alone.
