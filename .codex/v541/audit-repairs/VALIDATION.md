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
