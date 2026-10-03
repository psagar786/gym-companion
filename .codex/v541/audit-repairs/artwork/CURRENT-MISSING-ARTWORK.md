# Current missing / Coming soon artwork inventory

Checkpoint: `F7-ART-GAPS-LISTED` · 2026-10-03 · local audit only.

Audited source: `8793b0a3b3007d84829bf83194f75116b4fbd9e3`, branch `codex/v541-release`.
Review app: http://localhost:4175/?v=5.4.1-mobile-optimization

## Scope and method

Evaluated the actual ABAC plan and card artwork display boundary for all six training days, all three levels, and all four cadence positions (A, B, repeated A, C): 72 cases. Included main, available Alternative/Option 2, required guides, optional tendon work and the actual eligible optional picker (no saved extras selected). Excluded source-only/unavailable options. Historical saved snapshots were not edited or exhaustively enumerated.

The fresh occurrence scan evaluated 1,851 selectable/guided occurrences: 1,827 physical and 24 repeated No Cardio status occurrences. 1,669 occurrences resolved both existing phase files. The remaining 158 physical occurrences consolidate to 32 day/name entries below. Repeated phases, levels and aliases do not create new artwork sets. The resolved library references 302 unique active phase paths.

The existing mapping validator passed all 72 cases; approved asset hashes are unchanged, exclusions are preserved, and pending entries have no fallback artwork. This is a runtime/path audit, not a new semantic inspection or gym-coach approval of the entire library.

## Summary

| Treatment | Pending day/name entries | Production implication |
|---|---:|---|
| Confirmed missing approved pair | 8 | 8 prospective sets / 16 phase files after specification approval |
| Existing artwork held for review | 6 | 4 canonical pairs; review or repair, not six new sets |
| Mechanics/setup clarification | 9 | Confirm execution and potential exact reuse before counting generation |
| Combined movement decision | 5 | Decide split/tier handling; do not create one proxy illustration |
| Deferred tendon work | 4 | Await the separate tendon specification/research decision |
| **Physical total** | **32** | **Not 32 new canonical sets** |
| No Cardio status entries | 2 | Text-only; no artwork generation |

Monday has no physical image gaps. Tuesday has 2, Wednesday 15, Thursday 11, Friday 1 and Saturday 3. Optional items below appear only for Expert; they are not missing exercises in the Intermediate main workout.

## Confirmed new-artwork queue

Both Start and Movement need an approved pair. Names alone are not sufficient generation specifications.

| Day | Exercise | Location | Phases | Levels |
|---|---|---|---|---|
| Wednesday | Standing Machine Calf Raise | Optional | A/C | Expert |
| Wednesday | Deficit Barbell RDL | Alternative | B | All |
| Wednesday | Stick Overhead Deep Squats | Warm-up | B | All |
| Wednesday | Sissy Squat | Optional | B | Expert |
| Wednesday | Seated Calf Raise Machine | Optional | B | Expert |
| Thursday | Incline Smith Machine Press 45° | Main | B | All |
| Thursday | Bayesian Cable Curl | Main | B | All |
| Thursday | Overhead Dual-Cable Tricep Extension | Alternative | B | All |

## Every other physical entry currently without an active pair

### Tuesday

| Exercise | Location / phases | Why no active pair |
|---|---|---|
| Standing & Seated Transverse Abdominis Stomach Vacuum | Main · B · all levels | Combined identity; standing/seated artwork exists separately; execution decision needed |
| Wrist flexor isometric | Tendon · A/B/C · all levels | Deferred tendon review |

### Wednesday

| Exercise | Location / phases | Why no active pair |
|---|---|---|
| Deficit Bulgarian Split Squat | Alternative · A/C · all levels | Existing pair held: deficit and rear-foot support setup need confirmation |
| Deficit Bulgarian Split Squats | Optional · A/C · Expert | Same held canonical pair, not another new set |
| Wide-Stance Sumo Leg Press | Alternative · B · all levels | Existing wide-stance pair held: machine/seating differs between phases |
| Leg Press | Main · B · all levels | Clarify exact machine/setup; runtime ID still contains the older hack-squat name |
| 45° Incline Leg Press | Option 2 · B · all levels | Clarify stance/setup before sharing the existing mid-stance pair |
| Reverse Lunges with Dumbbells | Main · B · all levels | Confirm exact loaded reverse-lunge execution and any reuse |
| Walking Lunges | Alternative · B · all levels | Confirm bodyweight versus loaded execution; no automatic reuse |
| Bulgarian Split Squats | Option 2 · B · all levels | Confirm load, support and range; do not inherit deficit/1.5-rep mechanics |
| Stick Hip Swings | Warm-up · B · all levels | Define swing direction and stick support; do not assume lateral leg swings |
| Patellar tendon isometric | Tendon · A/B/C · all levels | Deferred tendon review |

The five confirmed missing Wednesday movements are listed in the production table above, bringing Wednesday's total to 15.

### Thursday

| Exercise | Location / phases | Why no active pair |
|---|---|---|
| Chest-Supported T-Bar Row | Main · B · all levels | Existing pair held: Start lacks chest support and differs from Movement equipment |
| Incline DB Press | Alternative · B · all levels | Existing pair held: bench appears nearly upright rather than the intended chest-press incline |
| Dumbbell Pullover on Flat Bench | Optional · A/C · Expert | Confirm body support/bench setup against the existing pullover pair |
| Incline Bench Row | Alternative · B · all levels | Confirm chest support, grip, equipment and bench angle before reuse |
| Low-to-High Cable Fly | Option 2 · B · all levels | Confirm exact cable path/setup before sharing existing crossover artwork |
| Ez-Bar Curl & Skullcrushers | Option 2 · A/C · all levels | Combined exercises; separate execution/content decision required |
| Incline DB Curl & Rope Pressdown | Option 2 · B · all levels | Combined exercises; separate execution/content decision required |
| Calf isometric | Tendon · A/B/C · all levels | Deferred tendon review |

The three confirmed missing Thursday movements are listed in the production table above, bringing Thursday's total to 11.

### Friday

| Exercise | Location / phases | Why no active pair |
|---|---|---|
| Standard Forearm Plank to RKC Hardstyle Plank | Main · A/C · all levels | Combined identity; separate Standard and RKC pairs exist, but current combined card remains pending |

### Saturday

| Exercise | Location / phases | Why no active pair |
|---|---|---|
| Wide-Stance Leg Press | Alternative · A/B/C · all levels | Same held wide-stance pair used by Wednesday's Sumo label; not another new set |
| Bodyweight Air Squats to Walking Lunges | Optional · A/C · Expert | Combined identity; individual movement artwork exists, but one image must not represent both |
| Core brace isometric | Tendon · A/B/C · all levels | Deferred tendon review; actual runtime title, not an assumed wall-sit replacement |

## Not artwork-production demand

- Wednesday and Saturday: `NO CARDIO (Safeguard Knee & CNS Recovery)` still receives the generic pending-image presentation. It is a status instruction, not an exercise. A later presentation-only repair should remove its image frame; do not generate an athlete for it.
- Unavailable optional source choices are not active image gaps: Monday Cable Face Pull with External Rotation, Hanging Straight-Leg Raise and Hanging Straight-Leg Toes-to-Bar; Thursday Side Plank Hold with Rotation, Incline Cable Pullover with Stretched Bias and Hanging Oblique Knee Raise; Saturday Dead Bug to Dragon Flag Negatives and Dragon Flag Negatives on Flat Bench.
- Review-only excluded equipment remains unavailable. Existence of a file must not activate it.

## Next bounded action

Review this list with the user and approve the first production unit. Prioritize the missing Thursday Week B main movements (45° Smith press and Bayesian curl), then resolve Wednesday Week B main setup ambiguities. Only after exact equipment, Start/Movement, grip, range and reuse decisions are frozen should generation begin. Keep tendon and combined-movement decisions separate. No generation, source/UI change, asset deletion, push or deployment occurred in this audit.
