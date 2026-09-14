# V5.4.1 validation ledger

## Completed

- Isolated branch and worktree created from the V5.4 visual comparison baseline.
- All 43 Start/Movement pairs promoted to the non-destructive `periodized-v2` namespace.
- All 86 files are registered through the generated V2 library.
- Runtime coverage audit created; mappings are explicit rather than name-similarity fallbacks.
- Card resolver prefers V2 Movement for explicitly mapped identities.
- Detail resolver uses V2 Start and Movement instructions and images.
- Detail artwork is contained in a square area up to 512px and stacks on mobile.

## Browser evidence completed

- Demo sign-in passed in the in-app browser.
- Home identifies the build as V5.4.1 and highlights the current local day without opening it automatically.
- Monday A-cycle workout opened successfully.
- Exact V2 Movement artwork resolved for all six mapped Monday main exercises and all three mapped stick warm-ups.
- The mapped Incline Dumbbell Bench Press detail page resolved its exact 512 x 512 Start and Movement images.
- Desktop detail images render at 512 x 512 with `object-fit: contain`; the page has no horizontal overflow.
- The QA gallery contains 43 records and 129 V2 image instances: card preview, Start, and Movement for each record.
- A progressive lazy-load pass loaded all 129 V2 image instances at 512 x 512 with zero failed requests.
- Every V2 image instance in the gallery uses `object-fit: contain`; no gallery horizontal overflow was detected.

## Static and data checks

- JavaScript syntax: pass.
- V2 pilot asset validator: pass, 43 sets, 86 files, zero missing, 86 unique paths, 86 unique hashes.
- Current runtime coverage audit: pass, 59 of 291 stable runtime identities explicitly mapped; 232 remain on exact legacy artwork.
- Periodized A-B-A-C data validator: pass, 24 training records plus four recovery records.
- Member release/security validator: pass for V5.4.1; no service-role reference in browser-delivered files.
- Personal tiered-library validator: pass, 121 movements and all tiered PPL choices.

## Recorded release blockers

- The strict three-week production validator still fails for legacy records that have missing three-week WebP assets, incomplete authored content, or pending review statuses. This is consistent with the 232 identities outside the V2 pilot and prevents claiming a complete V2 conversion.
- Exact 320px, 390px, and 430px device screenshots remain a release gate for the eventual Vercel deployment. The current pass verified responsive CSS rules plus narrow gallery rendering, but it did not run a separate device-emulation browser.
- Semantic exercise-mechanics and qualified gym-coach review remain pending for all generated pairs.

## Release interpretation

The V2 format is technically integrated, but 232 current runtime identities still lack V2 artwork. The implementation intentionally remains hybrid and does not claim complete visual conversion.
