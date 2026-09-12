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
- Generation-only staging now contains 5 pilot sets total: 2 integrated pairs retained for the gallery plus 3 new pairs held outside the app. The 6 staged files are 512×512 PNGs; they are not registered or selectable.
- The next generation batch adds 3 more pairs, bringing generation-only production to 8 total sets / 16 files. These remain staging-only and are not selectable.
- A third generation batch adds 3 more pairs, bringing production to 11 total sets / 22 files. All new files remain staging-only.
- A fourth generation batch adds T-Bar Row, Straight-Arm Cable Pulldown, and Cable Face Pull with External Rotation, bringing production to 14 sets / 28 files.
- A fifth generation batch adds Incline Prone Dumbbell Reverse Fly, Barbell Back Squat, and 45-Degree Leg Press, bringing production to 17 sets / 34 files.
- A sixth generation batch adds Dumbbell Romanian Deadlift, Conventional Barbell Deadlift, and Seated Hip Adductor, bringing production to 20 sets / 40 files.
- A seventh generation batch adds Seated Hip Abductor, Dumbbell Glute Bridge, and Prone Lying Leg Curl, bringing production to 23 sets / 46 files.

## Checkpoint: V54-PILOT-periodized-incline-smith-machine-press-COMPLETE

- Incline Smith Machine Press Start and Movement are present under `assets/exercises/periodized-v2/`.
- Both files are 512×512 PNGs and have distinct hashes.
- Semantic review remains pending; this is not qualified gym-coach approval.

## Automated technical check

`node scripts/validate-v2-pilot.mjs` passed: 4 registered files, 4 unique paths, 0 missing files, and 4 unique SHA-256 hashes.
