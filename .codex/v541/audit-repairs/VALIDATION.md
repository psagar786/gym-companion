# Problem 1 validation

- Baseline: 498c565, codex/v541-release. Local-only; no GitHub push or Vercel deployment.
- Exact classification: 840 authored movement-name occurrences (including alternatives); all reviewed. Five unique tendon records covered. Unknown movement returns needs-review and empty groups.
- Presentation: 54 unique A/B/C day/tier combinations, plus repeated A records. Correct progression labels and six main slots.
- Non-classification runtime data deep-equal to baseline: prescriptions, order, names, equipment, images, exclusions and compatibility unchanged.
- Historical records: identifiable ABAC uses neutral headings; other sources preserve saved focus. Input snapshots remain unchanged.
- Syntax and member security: PASS. Routine validator: PASS, with 26 pre-existing equipment-review warnings retained.
- Tuesday artwork mapping: 50 IDs PASS. Wednesday/Thursday/Friday mapping validator: PASS; pending artwork remains pending (Wednesday 37, Thursday 36 runtime occurrences).
- Browser: demo sign-in; six Home labels and six workout headings; all six days at 320/390/430px. All 18 combinations have scrollWidth equal to viewport width; no page errors. Completion and selected variation survive refresh.
- Screenshots: evidence/home-390.png and evidence/monday-390.png. Home image visually reviewed; weekday orange, focus/date white; no exercise-count label.
- No CSS or artwork files changed. Artwork and navigation defects are separate future repairs.
- Test harness initially used unsuitable button/input selectors; corrected to actual sign-in button and visible Done label. Final browser test passes.
- Review: http://localhost:4175/?v=5.4.1-focus-correction

# Problem 2 validation

- Checkpoint: F7-02-LOCAL-REVIEW. Local only; no generation, asset deletion, GitHub push or Vercel deployment.
- Actual selectable runtime: 72 day/tier cases including repeated A. Every case retains six main slots. Twelve previously unresolved day/name links now resolve through exact mappings.
- Browser: all 72 cases and 1,236 available main/alternative/Option 2 selections pass title and Movement-path checks. Six representative details pass separate Start/Movement checks. All 302 active files decode as 512×512; zero image request failures and zero page errors.
- Mobile regression: six workouts at 320/390/430px; all 18 measurements have scrollWidth equal to viewport width. No CSS changes or mobile redesign.
- Problem 1 regression: labels/classifications, prescription/order preservation, historical immutability, completion and variation refresh persistence pass.
- Dedicated isolated Expert fixture: stale saved artwork displays current exact mapping without changing saved snapshot bytes; optional add/remove survives refresh. Earlier Intermediate fixture had no authored eligible extras, so it was replaced with Expert rather than expanding the pool.
- Browser clock initially reset after navigation and compared different scheduled phases. Corrected with a persistent isolated fixture clock; final all-phase run passes.
- Original artwork hashes unchanged. 302 active WebP files total 6,980,960 bytes (6.66 MiB). Manifest derives eligible resolved runtime; it is not deployed.
- Existing-pair semantic inspection: 21 candidate pairs plus chest opener inspected. Four canonical pairs held for mechanics/setup review. This is AI-assisted review, not qualified gym-coach approval; no blanket semantic approval of the full library is claimed.
- Evidence: artwork/evidence/home-390.png, day-0-390.png through day-5-390.png, wednesday-detail-390.png, pending-optional.png and repaired-rdl-detail.png. Wednesday and Thursday full screens visually inspected. Pending and detailed evidence retained for user review.
- Remaining queue: eight missing approved pairs (16 prospective files), four canonical visual-review pairs, nine mechanics clarifications, five combined decisions, four tendon records. Categories are separate; 32 pending day/name entries must not be described as 32 new canonical sets.
- Review: http://localhost:4175/?v=5.4.1-artwork-mapping-repair
