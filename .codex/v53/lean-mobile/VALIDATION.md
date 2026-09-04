# V5.3 Lean Mobile Validation

## Baseline

- Branch: `feature/member-accounts-v53`
- Local URL: `http://localhost:4175/`
- Scope: lean mobile UI, prescription normalization, current-day selection, and border-only image repair.
- New artwork generation: intentionally out of scope.

## Findings to validate

- Main cards currently repeat source scheme, generic RIR/tempo, description, and cue text.
- Guided cards expose long descriptions instead of only practical quantities.
- `.visual`, `.visual-button`, guided, and optional image sizes conflict across multiple CSS blocks.
- Some periodized image crops contain white contact-sheet edge strips.
- Home currently exposes an artwork-review card that should be internal-only.
- `state.dayIndex` starts at Monday rather than highlighting the device's current weekday.

## Evidence

Evidence will be added after each checkpoint with commands, viewport, result, and any remaining issue.

## V53-LEAN-01-PRESCRIPTIONS

- `node --check member-app.js`: PASS
- `node --check bootstrap.js`: PASS
- `git diff --check`: PASS
- `node scripts/validate-periodized-abc.mjs`: PASS; 24 training records and 26 equipment-review warnings.
- Existing three-week validator still reports its known baseline missing-artwork/review queue; it is outside this UI/content pass and no new artwork was generated.

## V53-LEAN-02-CARDS and V53-LEAN-03-DETAIL

- Main card output now contains image, name, level, dose, rest, technique badge, details, variation controls, and Done.
- Guided and optional cards now show image, name, dose, rest, details, and Done/Add controls without long descriptions.
- Detail output now contains sets, reps/hold, rest, Start, Movement, progression, and one safety line.
- `node --check member-app.js`: PASS after renderer changes.
- `git diff --check`: PASS.

## Browser verification blocker

- Starting `node scripts/local-v53-server.mjs` on `127.0.0.1:4175` returned `EPERM` in this execution environment.
- `curl http://localhost:4175/` confirmed no server was available.
- The six viewport checks must be rerun in a local environment where port 4175 can bind; no production deployment was attempted.

## V53-LEAN-05-IMAGES and V53-LEAN-06-HOME

- Periodized image inventory: 250 PNGs / 125 Start-Movement pairs.
- Border-only repair: 77 files rewritten with proportional crop-and-pad; 173 files unchanged.
- Post-repair technical check: 250 present, 512×512, 0 byte-identical duplicates.
- Home renderer no longer includes the artwork-review card or production notice.
- Home highlights Monday–Saturday today using local weekday and does not auto-open the workout.
