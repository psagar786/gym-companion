# Problem 1 validation

## Problem 4 — return navigation local review

- Baseline 38ada25; implementation f3b1b87 on codex/v541-release. Local only.
- 64 return checks at 320/390/430px pass: 36 main/image-link visits (including repeated open/close), 18 nested guided visits, three tendon, three optional, three My Plan and one resize visit.
- Same-width page scroll restores exactly in the tested cases. Nested scroll, disclosure open states, checkbox state, variation selection and originating-button focus are preserved. Resizing 390→430 adjusts the page position to keep the origin exercise in view rather than restoring an obsolete pixel offset.
- In-app Back and browser Back both pass while details are open. Navigating to My Plan from detail discards the old cache; subsequent browser Back does not resurrect it. Refresh returns the normal app, not stale cached DOM.
- Navigation-only round trips leave demo-member storage byte-for-byte unchanged. No transient DOM/history context is persisted in workout records.
- Regression: 1,867 detail records/72 cases, 302 active image hashes/paths, 840 classifications, member security and bundle validation pass. Browser checks for 44 guided and three optional details pass. Completion/variation and optional add/remove persist after refresh; historical snapshots unchanged.
- All 18 six-day/width measurements have no horizontal overflow. No CSS or artwork changes.
- Evidence: navigation/evidence/returned-to-exercise-430.png, visually reviewed. Test automation is Chromium-based; real-device iPhone/Safari review remains a later stage, not a claimed result.
- Review: http://localhost:4175/?v=5.4.1-detail-return


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

## Problem 3 local review

- Source checkpoint: 3923bf8. Selected detail identity only; local, no generation or deployment.
- Unit checks: 1,867 records across 72 day/phase/level cases; exact clicked identity, same-name dose isolation, unknown detail rejection, own alternative equipment and immutable input records pass.
- Browser: 72 workout cases, 1,236 variations and 103 opened main/alternative/Option 2 details pass title, dose and Start/Movement paths. Expert guided/optional checks pass for 44 guided and 3 optional details.
- All 302 active images decode. No image request failures or page errors. Six workouts at 320/390/430px have no horizontal overflow; no CSS edits.
- Stale saved artwork and optional add/remove refresh regression passes without rewriting snapshot bytes. Classification, original asset hashes, member security, programming and order regressions pass.
- Evidence: details/evidence/Home and all six day screenshots, plus Wednesday RDL detail. RDL detail visually inspected at 390px.
- Bound detail keys are in-memory and are not written to workout data. Pending alternatives retain explicit under-review instructions instead of their parent's setup. Remaining instruction labels are recorded separately in details/INSTRUCTION-REVIEW-QUEUE.json; this is not an image count or a claim that all educational content is complete.
- Return-scroll is deliberately unchanged and remains Problem 4.
- Review URL: http://localhost:4175/?v=5.4.1-detail-identity


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
# Problem 5 local content review

Implementation: `743d2c4`. Checkpoint: `F7-05-LOCAL-REVIEW`.

72 runtime cases / 1,867 records; 34 dose/status fixtures; 10 video/metric checks; 18 mobile day/width browser checks; 64 return-navigation checks; 44 guided and 3 optional details: PASS. Asset hashes, source programming, historical snapshots, saved selections and completion are preserved. Member-security and bundle checks pass. No deployment.

See `content/REPORT.md` and `content/VALIDATION.json` for the 33 remaining alternative labels, four execution conflicts, role-default quantities and missing authored cardio doses. Specific safety coverage remains partial, not coach-approved. Real iPhone optimization remains next separate stage after local review.
# Current missing-artwork audit

2026-10-03 · F7-ART-GAPS-LISTED · source 8793b0a. Fresh occurrence-level evaluation of periodizedPlan, optionalCandidates and activeArtworkDisplay: 72 cases; 1,851 eligible/guided occurrences including 24 repeated non-exercise occurrences; 1,669 resolve both phase files. 158 pending physical occurrences group into 32 day/name entries. Existing approved missing/review/clarification categories reconciled against current results. validate-abac-artwork-mappings.mjs PASS: 302 active files, hashes unchanged, excluded choices remain excluded, pending entries do not inherit artwork. No new browser/physical-device or full-library semantic approval is claimed. Report: artwork/CURRENT-MISSING-ARTWORK.md. Runtime, presets, artwork and historical data untouched.

# Problem 6 local mobile review

Source `592f8ac`; checkpoint `F7-06-LOCAL-REVIEW`. Local only. Six days across 320/375/390/393/414/430px: 36 passing workout checks. Landscape/desktop: 12; narrow reflow actual 240px: six. Zero page overflow or image/text/Done overlaps; standalone targets 44px, calendar-cell exception documented. Expanded panels and guides pass at 320/393/430; three live returns restore exact scroll/UI state. 1,690 protected source/data/artwork files byte-match baseline. Existing runtime/content/security/asset validators pass, with previous review queues retained. Physical iPhone/Safari not claimed. Final accepted captures and detailed limits: `mobile/REPORT.md` and `mobile/VALIDATION.json`. Review: http://localhost:4175/?v=5.4.1-mobile-optimization
