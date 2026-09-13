# Fitness 7 V5.4.1 Luna Medium runbook

For the full task-by-task procedure, viewport checklist, failure codes, checkpoint names, and preview-deployment gate, use `LUNA-MEDIUM-EXECUTION-PLAN.md` in this directory. This shorter runbook is the operating summary.

## Fixed scope

Work only in `/Users/exxxy/Documents/Daily AI Help/gym-companion-v541-art-integration` on branch `codex/v541-v2-art-integration`. The baseline branches remain read-only. Do not deploy until the local V5.4.1 review is accepted.

The current V2 library has 43 complete Start/Movement pairs. It maps safely to 59 of 291 current runtime identities because some mechanically identical runtime aliases share one pair. The remaining 232 runtime identities do not have V2 artwork. Do not call the 43-set library a complete A-B-A-C library.

## Resume protocol

1. Read `.codex/v541/integration/STATE.json`.
2. Confirm the exact workspace and branch.
3. Inspect the working tree without discarding files.
4. Read only the files needed for `nextAtomicAction`.
5. Never repeat an ID in `completedUnits` unless a recorded regression proves it failed.
6. Execute one bounded unit.
7. Run that unit's checks.
8. Update `VALIDATION.md` and `STATE.json`.
9. Set one exact next action before stopping.
10. Commit after a completed unit or before usage expires.

If state and the real checkout disagree, stop and record `BLOCKED: checkpoint state does not match the V5.4.1 workspace`.

## Asset rules

- Source of truth: `data/periodized-v2-runtime-map.json`.
- V2 masters: `assets/exercises/periodized-v2/*-v2-start.png` and `*-v2-movement.png`.
- Listing cards always use Movement.
- Detail pages always show Start then Movement.
- Never crop the athlete or equipment.
- Never use `object-fit: cover` for exercise artwork. Use a square reserved box with `object-fit: contain` and the charcoal background.
- Never stretch an image or use fixed height without the matching width.
- Never map by fuzzy name similarity. A runtime identity must be listed explicitly in `runtimeIds`.
- Do not overwrite legacy artwork. Unmapped exercises retain their exact legacy pair.
- Do not use a different movement as a fallback.
- The QA gallery is private at `?qa=art-v2`; do not add it to member Home.

## UI contract

### Listing card

- At 320 to 430px, reserve an 80 to 88px square image column.
- The exercise name, level, dose, rest, and details link stay in a separate `minmax(0, 1fr)` column.
- Done and variation controls must never overlap the image or title.
- Long names wrap; no horizontal scroll.
- All controls are at least 44px high.

### Detail page

- Use the 512x512 PNG master at up to 512 CSS pixels.
- Show Start and Movement as separate square panels.
- Keep the complete athlete and equipment visible.
- At 640px and below, stack image above instruction.
- Above 640px, use a 280 to 512px image column plus the instruction column.
- Preserve one-to-one alt text and phase instructions.

## Atomic units

- `V541-I01`: verify isolated worktree and branch.
- `V541-I02`: run `node scripts/audit-v541-art-coverage.mjs`; never hard-code a coverage claim without this report.
- `V541-I03`: verify 86 V2 PNGs exist and are 512x512.
- `V541-I04`: review explicit runtime mappings. Remove uncertain mappings; never add a fuzzy one.
- `V541-I05`: verify card uses Movement and detail uses Start plus Movement.
- `V541-I06`: verify no-crop CSS at 320, 390, 430, and desktop.
- `V541-I07`: inspect all 43 gallery pairs for title, equipment, phase, limb visibility, and safe margins. Record semantic failures; do not silently replace them.
- `V541-I08`: test Monday through Saturday, Main, Alternative, Option 2, warm-up, tendon, recovery, and optional flows.
- `V541-I09`: capture accepted local screenshots and checkpoint `V541-LOCAL-REVIEW`.
- `V541-I10`: only after Sagar accepts local, prepare a Vercel preview for version 5.4.1.

## Commands and acceptance evidence

Run:

```text
node --check member-app.js
node --check data/periodized-v2-pilot.js
node scripts/validate-v2-pilot.mjs
node scripts/audit-v541-art-coverage.mjs
node scripts/validate-periodized-abc.mjs
```

For browser QA, use the local HTTP URL at port 4177. Do not use `file://`. Confirm no broken image requests, no white gutters from an old contact sheet, no clipping, and no image/text overlap.

## Failure handling

Record one of: `WRONG_EXERCISE`, `WRONG_EQUIPMENT`, `WRONG_PHASE`, `PHASES_TOO_SIMILAR`, `CROPPED`, `BLURRY`, `BROKEN_PATH`, `LAYOUT_OVERFLOW`, or `NEEDS_HUMAN_REVIEW`. A failed pair remains visible only in QA and must not be newly mapped into the workout. Preserve the failure evidence and set its repair as the next atomic action.

## Deployment gate

Do not deploy merely because all files exist. Deployment requires: local demo login, correct V5.4.1 label, 43/43 technical asset validation, safe explicit mappings, mobile screenshots, all workout roles smoke-tested, and Sagar's local approval. Deploy as a preview first; production promotion is a separate decision.
