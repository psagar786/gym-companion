# Compact ABAC Validation

Checkpoint: `V541-COMPACT-03-LOCAL-VERIFIED`

## Automated and source checks

- `node --check member-app.js` — PASS.
- Active template selector — PASS: only `Periodized A–B–A–C` is rendered.
- Home duplicate-plan scan — PASS: no `My Training Plan` card; header `My plan`
  remains the single settings entry point.
- Workout DOM scan — PASS: one required warm-up section, one optional tendon
  disclosure, one required recovery section, one optional-add-ons disclosure.
- Artwork smoke scan — PASS: rendered cards resolve existing exact
  `periodized-v3` paths; no fallback generation was introduced.

## Browser evidence

Local URL: `http://localhost:4175/?v=5.4.1-compact-abac`

- Home shows `A–B–A–C · Intermediate`, compact day/date rows, and today’s
  highlight without auto-opening a workout.
- Plan screen shows one template option and preserves Beginner/Intermediate/
  Expert level choices.
- Monday workout shows Warm-up and Post-workout recovery open by default,
  first two records in the bounded scroll region, and “Scroll for more” only
  when additional records exist.
- “Need a different option?”, Tendon preparation, Consistency Outlook, and
  Optional Add-ons are closed initially and expand on tap.
- Main and guided cards keep artwork left, text in a flexible column, and Done
  as a labeled top-right control.

## Responsive matrix

| Viewport | Result | Notes |
| --- | --- | --- |
| 320×720 | PASS | no horizontal overflow; 128px artwork column; today badge stays inside card |
| 375×812 | PASS | no horizontal overflow; compact day grid |
| 390×844 | PASS | no horizontal overflow; workout card image 128px; optional picker closed |
| 393×852 | PASS | no horizontal overflow; same compact grid |
| 414×896 | PASS | no horizontal overflow; wrapped controls remain reachable |
| 430×932 | PASS | no horizontal overflow; 128px artwork column breakpoint |

No deployment was performed. Historical snapshots and existing artwork paths
remain untouched.
