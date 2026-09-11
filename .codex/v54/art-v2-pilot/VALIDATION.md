# V5.4 A-B-A-C V2 visual pilot validation

## Scope

This branch is a comparison pilot, not the complete 288-identity workout release. It uses only the new `periodized-v2` namespace and never overwrites baseline artwork.

## Checkpoint: V54-PILOT-00-BASELINE

- Baseline branch: `feature/member-accounts-v54`
- Pilot branch: `codex/v54-art-v2-comparison`
- Target: 43 movement sets / 86 PNG files
- Completed at branch creation: 1 set / 2 files
- Completed in pilot branch: 2 sets / 4 files
- Remaining: 41 sets / 82 files
- Technical checks for the preserved pair: 512×512 PNG, distinct file hashes, separate Start and Movement paths.

## Open checks

- Generate and validate the remaining 42 pairs one movement at a time.
- Add side-by-side old/new comparison evidence after the manifest is wired.
- Run local visual checks at 320, 375, 390, 393, 414, and 430px.
- Local browser smoke check passed at `http://localhost:4176/?qa=art-v2`: demo sign-in opened the gallery and rendered both V2 pairs with Start and Movement instructions.

## Checkpoint: V54-PILOT-periodized-incline-smith-machine-press-COMPLETE

- Incline Smith Machine Press Start and Movement are present under `assets/exercises/periodized-v2/`.
- Both files are 512×512 PNGs and have distinct hashes.
- Semantic review remains pending; this is not qualified gym-coach approval.

## Automated technical check

`node scripts/validate-v2-pilot.mjs` passed: 4 registered files, 4 unique paths, 0 missing files, and 4 unique SHA-256 hashes.
