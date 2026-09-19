# V5.4.1 Compact ABAC Work Ledger

## Scope

Member-facing A–B–A–C compression only. No new artwork, prescription changes,
historical snapshot rewrites, or deployment changes.

## Completed

- Forced the active member renderer and selector to `periodized-abc` while
  preserving stored historical source versions.
- Removed the duplicate Home `My Training Plan` card and the day-card `Ready`
  status. Day and scheduled date now share one compact line.
- Kept required warm-up and recovery open, with the first two records visible
  in a bounded scroll region and a conditional “Scroll for more” nudge.
- Kept warm-up and recovery alternatives in closed native disclosures.
- Kept tendon preparation collapsed and independent.
- Moved optional add-ons after recovery and made the picker a closed native
  disclosure by default.
- Moved Done into the exercise content column, enlarged the artwork column,
  and preserved wrapping/44px interaction targets.
- Kept Consistency Outlook as a compact collapsed disclosure.

## Evidence

- `node --check member-app.js` passed.
- Local preview verified at `http://localhost:4175/?v=5.4.1-compact-abac`.
- Accessibility inspection verified one template option, required guided
  sections, collapsed tendon/add-ons, and exact V3 image paths.

## Next

Run responsive checks at 320, 375, 390, 393, 414, and 430 CSS pixels, update
`VALIDATION.md`, and commit the source plus checkpoint files.
