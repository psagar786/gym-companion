# Fitness 7 V5.4 Periodized Prompt Wave Audit

## Scope

Source workbook: **Fitness 7 V5 — Optimized Master Workout Plan**  
Source tab: **2-Step Visual & Anatomy Library**  
Source range: `A1:H44`  
Runtime: Periodized A-B-A-C member activity

## Artwork count

| Metric | Sets | Images |
| --- | ---: | ---: |
| Selectable runtime identities | 288 | 576 |
| Existing Start + Movement pairs | 125 | 250 |
| Initial missing queue | 163 | 326 |
| Spreadsheet prompt rows | 43 | 86 capacity |
| Maximum remaining after 43 genuinely missing sets | 120 | 240 |
| Approved missing mappings at this checkpoint | 1 | 2 capacity |
| Current remaining queue before generation | 163 | 326 |
| Completed and integrated at this checkpoint | 1 | 2 |
| Remaining after completed pair | 162 | 324 |

The 120-set figure is capacity planning only. It assumes every spreadsheet row is a distinct missing runtime identity, which the reconciliation does not support. Row 14, Single-Arm Cable Pulldown (Iliac focus) → `periodized-single-arm-cable-pulldown`, has now passed the two-file technical gate. The production-safe result is `163 - generatedSets`; the queue is now 162 sets / 324 files.

## Prompt reconciliation

| Mapping status | Rows | Generation treatment |
| --- | ---: | --- |
| Existing exact | 13 | Preserve and review; do not regenerate |
| Alias of existing | 12 | Confirm mechanics before sharing existing art |
| Combined row, split required | 7 | Create separate specs for distinct mechanics |
| Excluded equipment | 4 | Review-only; do not generate or activate |
| Ambiguous, needs review | 6 | Resolve canonical identity before generation |
| Missing generate approved | 1 | One pair authorized: row 14 |
| **Total** | **43** | |

Combined or ambiguous examples include T-bar vs Meadows row, straight-arm pulldown vs dumbbell pullover, hanging knee vs straight-leg raise, standing vs seated trunk rotation, conventional vs trap-bar deadlift, and Kas glute bridge vs barbell hip thrust. The four excluded-equipment rows are retained as source references only.

## Fitness 7 conversion

The spreadsheet prompts are treated as mechanics/anatomy source material. Their white EvolutionFit split-view wrapper is replaced by two separate 512×512 PNG prompts: Start and Movement. The converted style is charcoal background, black clothing, off-white athlete/equipment, restrained orange primary emphasis, muted blue secondary emphasis, and grey-green stabilizers. Each frame contains one athlete, one exercise, and one phase with 10% clear margin; no text, logo, watermark, split view, collage, unrelated equipment, or external branding.

The full reusable prompt template and phase suffixes are stored in `.codex/v54/artwork/PROMPT-MAP.json` and `.codex/v54/artwork/LUNA-RUNBOOK.md`.

## Current checkpoint

`V54-ART-01-PROMPT-MAP-FROZEN`

No new images have been generated. The next safe action is to resolve alias and combined-row mappings, freeze the approved missing count, and only then generate one missing pair at a time.
