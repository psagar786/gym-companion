# Fitness 7 — isolated artwork completion and training review

Review completed 4 October 2026. Local branch: `codex/v541-artwork-completion-review`.

## Outcome and boundaries

The review build contains **13 newly generated or replacement movement pairs: 26 PNG masters for delivery plus 26 WebP display copies**. Larger generator sources are retained separately. These are not 52 distinct instructional phases: PNG/WebP are two formats of the same 26 phases.

Review app: http://localhost:4176/?v=5.4.1-artwork-completion-review

Gallery and pending list: http://localhost:4176/artwork-review.html

The original localhost:4175 checkout and production are unchanged. No push, Vercel deployment, exercise-order change, prescription change, new selectable equipment or personal profile update occurred. An additive exact-identity resolver connects accepted review pairs; no approximate name matching is used. All images have technical and AI-assisted visual review; **qualified coach approval remains pending**.

Across 72 day/cadence/tier runtime cases, resolved day/name artwork entries increased from **215 to 229**. **16 physical day/name entries remain pending**. These are not 16 unique generation jobs: seven have unresolved mechanics/content, five combine multiple movements and four retain earlier preparation-work deferrals. Excluded equipment and non-exercise status records are not counted as new artwork jobs.

## Completed artwork

| Day | Movement | Exact treatment |
|---|---|---|
| Wednesday | Standing Machine Calf Raise | Standing shoulder-yoke machine, free heels, straight-knee ankle movement |
| Wednesday | Deficit Barbell RDL | Low stable platform; hip hinge, not conventional deadlift |
| Wednesday | Stick Overhead Deep Squats | Unloaded overhead stick; comfortable squat depth |
| Wednesday | Sissy Squat | Bodyweight moderate-range knee-dominant variation, not normal hip-hinge squat |
| Wednesday | Seated Calf Raise Machine | Thigh pad above knees, bent-knee ankle movement |
| Wednesday | 45° Incline Leg Press (Mid-Stance) | Explicit 45°/shoulder-width alias only; replaces cropped equipment; not generic Leg Press |
| Thursday | Incline Smith Machine Press 45° | Attached bar, complete rail frame, supported incline bench |
| Thursday | Bayesian Cable Curl | Low pulley behind athlete and supinated working hand |
| Thursday | Overhead Dual-Cable Tricep Extension | Two separate cables, stable overhead upper arms |
| Thursday | Chest-Supported T-Bar Row | Same neutral handles and plate-loaded lever; chest remains on support |
| Thursday | Incline DB Press | Authored 30° low incline, not inherited 45° Smith setup |
| Thursday | Dumbbell Pullover on Flat Bench | Authored cross-bench upper-back support; not longitudinal full-body support |
| Saturday / explicit Wednesday alias | Wide-Stance Leg Press / Wide-Stance Sumo Leg Press | Same 45° sled with wide stance; not standard mid-stance or single-leg press |

The final square assets are proportionally reduced to a 410px inset and padded to 512×512, providing at least a 10% outer margin without trimming any body/equipment. The charcoal inset boundary can remain visible. No stretching, contact-sheet cropping, legacy overwrite or borrowed primary artwork was used. Technical hashes are in `GENERATION-MANIFEST.json`; visual observations are recorded per phase. Illustrative plate loads are not prescribed working loads. Camera perspective cannot certify a bench angle or machine linkage; confirm actual gym equipment and comfortable range in person.

## Remaining physical artwork/content decisions

| Day | Pending record | Why it cannot safely receive a guessed image |
|---|---|---|
| Tuesday | Wrist flexor isometric | Prior research deferral; resistance/joint setup not newly approved |
| Tuesday | Standing & Seated Transverse Abdominis Stomach Vacuum | Combined name needs an atomic/tier mapping; both constituent art types already exist |
| Wednesday | Patellar tendon isometric | Prior research deferral; do not invent tendon rehabilitation |
| Wednesday | Leg Press | Source renames Hack Squat but retains Hack Squat tier cues. Separate from lunges and from confirmed 45° mid-stance artwork |
| Wednesday | Reverse Lunges with Dumbbells | Standard floor step-back and Expert front-foot-elevated execution differ; need tier-specific identities, not one universal pair |
| Wednesday | Walking Lunges | Load not established; inherited reverse-lunge information is not proof of forward walking execution |
| Wednesday | Bulgarian Split Squats | Bodyweight and dumbbell versions are distinct. User confirmed distinction, not which existing runtime occurrence uses which. Do not borrow deficit or 1.5-rep art |
| Wednesday | Stick Hip Swings | Forward/back versus side-to-side plane and stick support position unclear |
| Thursday | Ez-Bar Curl & Skullcrushers | Two separate joint paths; cannot show both with one Start/Movement pair |
| Thursday | Calf isometric | Prior preparation research deferral |
| Thursday | Incline Bench Row | Dumbbell versus other resistance, support angle and grip not reliably authored; inherited T-Bar metadata cannot decide |
| Thursday | Low-to-High Cable Fly | Existing V2 candidate has tight/cropped apparatus. Source refers to low or mid cable height; lock the intended low-to-high version before replacement |
| Thursday | Incline DB Curl & Rope Pressdown | Separate curl and elbow-extension equipment/paths; explicit superset/atomic selection decision needed |
| Friday | Standard Forearm Plank to RKC Hardstyle Plank | Existing atomic art can be reused after an approved tier decision; do not collapse different bracing intents |
| Saturday | Core brace isometric | Previously deferred as preparation; may need category clarification rather than a new tendon illustration |
| Saturday | Bodyweight Air Squats to Walking Lunges | Two physical movements; atomic existing art may be reusable after source identity decision |

### Response to the latest clarification

Leg Press is a supported machine press, not a walking lunge. Published guidance describes supported back, platform feet and controlled knee extension, but cannot identify the user's exact machine or fix the app's Hack Squat source conflict. The explicitly authored 45° mid-stance record was therefore completed separately. [NASM Leg Press](https://www.nasm.org/resource-center/exercise-library/leg-press).

Bodyweight and dumbbell-loaded split squats remain separate visual identities. A published dumbbell example does not establish the load of a source record with only a generic title. [NASM exercise library](https://www.nasm.org/workout-exercise-guidance).

Forward/back motion and side-to-side motion are different planes. Internet research can define them; it cannot identify which the author meant by “Stick Hip Swings.” No guessed plane was activated. [NASM planes of motion](https://www.nasm.org/resource-center/blog/training/the-3-planes-of-motion-explained-with-exercises).

**Next decisions:** reconcile the renamed Leg Press instructions; explicitly assign walking-lunge load and ordinary split-squat load by tier; identify hip-swing plane; lock row equipment/angle and cable-fly height; resolve combined records without changing their training intent. Only then calculate a new canonical image count. Some decisions require content/resolver repairs and zero new images; others require more than one pair.

## Exercise and content audit — fix before personal optimisation

These are observed source conflicts, not a diagnosis or a request to change programming automatically:

| Priority | Record | Conflict / recommended bounded repair |
|---|---|---|
| High | Tuesday Stick Seated Russian Twists | Planted-foot art versus elevated-foot Intermediate/Expert instructions; separate or explicitly select execution |
| High | Tuesday Cable Pallof Press with Iso-Hold | Standing art versus half-kneeling Intermediate instructions |
| High | Wednesday Lying Leg Curl | Prone name/art versus seated Intermediate cue |
| High | Friday Floor Reverse Crunch | Floor name/art versus incline Intermediate/Expert instructions |
| High | Saturday Single-Arm DB Row | Standard dumbbell-row title/art versus Meadows landmine text in Intermediate/Expert |
| High | Saturday Seated Cable Row | Expert text changes to chest-supported T-Bar row |
| High | Wednesday Leg Press / Reverse DB Lunge | Renamed Hack Squat conflict and standard-versus-front-foot-elevated tier conflict described above |
| Medium | Alternative instructions | Several source alternatives still inherit parent equipment/cues. Example: an elbow-extension alternative must not inherit a pulldown instruction |
| Medium | Guided quantities | Some mobility/recovery records receive strength-like defaults. Wednesday overhead stick squats show 3×6–10 with 90–120s rest; some static recovery stretches display repetitions instead of a hold |
| Medium | Monday cardio | Twelve repeated runtime occurrences have no authored quantity. Parser tests pass because the missing-data state is explicit, not because these doses are valid |
| Medium | Content review | Review branch validator finds 93 day/name entries needing content review; this is different from 16 artwork gaps |

Content validation traverses 1,867 occurrences over 72 cases: 1,522 authored/structured prescriptions, 333 role-default prescriptions and 12 missing-cardio occurrences. Those are occurrence counts, not unique movements. Four conflicts are recognized by the existing validator; the broader source review above identifies additional tier-switch issues. A successful validator is not expert approval of all source instructions.

## Training review for the waist/fitness goal — recommendations only

The user can train six days and wants a leaner waist. Session duration, recent consistent training history, current working loads/repetitions, performance trends, waist measurements and actual aerobic activity are unknown. There is insufficient evidence to diagnose a weak muscle, overtraining, recovery capacity or prescribe a personalised replacement programme. The demo age, height and target were not reconfirmed and were not used to calculate a personal target.

### What the current schedule actually contains

Primary-choice only, excluding alternatives, optional additions and guided work:

| Phase | Intermediate scheduled sets | Expert scheduled sets |
|---|---:|---:|
| A | 122 | 140–146 |
| B | 122 | 144–150 |
| C | 138 | 144 |

These are **nominal scheduled sets**, including mobility/vacuum/isometric records, not measured hard sets or direct sets for a single muscle. Do not compare the whole-programme total with a per-muscle research threshold. The repeated A calendar occurrence is not counted as a second week within these tables.

Intermediate Tuesday and Friday together schedule 38 sets in A/B and 48 in C, including stick and vacuum work. This does **not** mean 38 or 48 hard abdominal sets. Intermediate A/B includes five available main slots on those days while the UI displays a six-slot denominator. Phase C Monday assigns six movements × four sets with 150s between sets: 18 inter-set gaps alone imply 45 minutes of rest if performed sequentially. This is a planning estimate, not a measured session duration.

Back work occurs Monday/Thursday/Saturday; core-focused days Tuesday/Friday; lower-body work Wednesday/Saturday. Adductor/abductor isolation precedes larger movements on some days. Movement presence alone does not establish adequate intensity, balanced effective volume or progression.

### Evidence-based interpretation

Consistency, progressive training and training the major muscle groups matter more than choosing the hardest-labelled tier. ACSM's general guidance supports at least twice-weekly muscle-group training; its volume guidance is not a personal set target. [ACSM 2026 guidance](https://www.acsm.org/wp-content/uploads/2026/03/Resistance-Training-Position-Stand-infographic.pdf).

For athletic hypertrophy, IUSCA discusses distributing larger volumes and allowing longer rest for multi-joint work, commonly at least two minutes, rather than shortening rest at any cost. Failure training has recovery trade-offs. This supports reviewing the app's rest and volume allocation, not declaring its present programme unsafe or unsuitable without performance data. [IUSCA position stand](https://journal.iusca.org/index.php/Journal/article/view/81).

A small six-week trial in sedentary adults found abdominal exercise improved endurance but did not reduce abdominal fat/waist measures. It is not a trial in advanced athletes, but provides no basis to promise local waist-fat loss from more crunches or vacuums. [Abdominal exercise trial](https://pubmed.ncbi.nlm.nih.gov/21804427/).

General adult activity guidance includes at least 150 minutes of moderate or 75 minutes of vigorous aerobic activity weekly, plus strengthening. This is an activity benchmark, not a guaranteed weight-loss dose. Count actual weekly activity before increasing cardio. [WHO physical activity](https://www.who.int/initiatives/behealthy/physical-activity/).

### Practical recommendations to discuss with a qualified coach

1. Correct identity/tier conflicts first. Better artwork cannot repair incorrect instructions.
2. Keep a manageable controlled training level; Expert is not automatically a better fat-loss choice. Log actual loads, achieved reps, effort and recovery instead of escalating because of the label.
3. Review the two core-focused days before adding abdominal work. Consider overall strength coverage and aerobic activity rather than expecting local fat reduction. Diet remains outside this requested implementation.
4. Review whether hip isolation should precede compounds for the user's actual priorities; do not automatically reorder an authored plan.
5. Review compound rest against rep quality and repeat-set performance. Longer rest may require removing redundant work or allowing more session time; do not silently change doses.
6. Track waist once weekly under the same conditions, body-weight trends and strength performance. Interpret trends over time, not a single measurement or completion streak.
7. Prioritise controlled execution and gradual loading. Sissy squats, deficit hinges and complex hanging movements are not obligatory shortcuts to becoming leaner; use coached technique and comfortable ranges.
8. Obtain session minutes, recent training history and two weeks of representative logs before designing an experimental programme. Programming remains unchanged here.

## UI/UX audit

| Finding | Evidence | Next improvement, not implemented here |
|---|---|---|
| Main cards remain tall | Thursday at 320px: sampled T-Bar/Smith cards 382px; at 393px around 306px; at 414/430px 256px | Review image/text/variation wrapping; do not just shrink touch targets |
| Required guided viewport partly cuts the second details link | Wednesday/Thursday screenshots show scrolling needed for full second card | Expose a stronger scroll affordance or align viewport to complete cards |
| My Plan is long | 393px screenshot is 2,161px high; future-day previews repeat Home purpose | Keep level/apply primary; put explanatory previews behind a disclosure |
| Generic level summary conflicts with real prescriptions | Settings summary gives broad sets/reps/RIR/tempo while real tier records differ | State clearly that quantities are exercise-specific; remove misleading universal dose copy |
| No Cardio still looks like missing artwork | Status record renders Coming soon visual/detail affordance | Use a compact text status, not an image-production placeholder |
| Old card image alt text describes Start | Existing cards use Movement but several older alt labels say starting position | Correct the existing display boundary after review. New local pairs use Movement alt text |
| Calendar today distinction is weak | Sunday Home screenshot shows a disabled empty history cell with little visual emphasis | Separate Today styling from existence of history |
| Checkboxes are not training logs | No observed entry for actual working loads/reps | Add optional strength/effort logging later without mutating snapshots |

Positive findings: weekday/focus contrast is retained; optional add-ons are collapsed; new phases fit without cropping; Done targets measured at least 44px high. Thursday variations changed title and new artwork together. Checking one item and choosing an alternative persisted after refresh; test changes were then restored. Detail Back returned focus/scroll to the exercise, not the top. All six phone widths passed Thursday horizontal-overflow measurements. Physical iPhone/Safari behaviour has not been tested.

## Validation and limitations

Passed: new asset integrity; 72-case artwork/runtime mapping; source programming equality; classification; detail identity; content parser/guard checks; member security; 1,692 frozen baseline source/data/assets and 304 active artwork hashes unchanged; responsive gallery/workout checks.

The existing historical mobile validator fails its old protected-file hash: resolver expected `5e311e91f6a54d7f14314771447dfb1f349baaf6`, current/frozen source `c3248f69934bea75c643b724b1ae607d1c83b26e`. It locks an earlier source revision. The new review validator independently compares all protected files to the accepted `b429bd53…` baseline and passes. The old failure was not hidden or “fixed” by replacing its expected hash. Therefore this report does not claim every legacy test passes.

Scope limits: no physical phone test; not every visual variant manually exercised in a browser; no clinical/qualified-coach review; no measured workload or body-composition outcome. The 72-case runtime inventory and file checks supplement representative browser interaction, not replace semantic human review.

## Recommended next units

1. Review the 13 pairs in the local gallery and provide image-specific feedback.
2. Approve atomic/tier identity corrections for the seven mechanics holds and five combined records. Generate only the newly confirmed missing variant; reuse exact existing constituent pairs where possible.
3. Resolve the reported content conflicts before optimisation or release.
4. Review a proposed programme with a coach after actual session/log information is available; keep current programming until approved.
5. Run physical iPhone Safari checks and a separate compact-card redesign if requested.
6. Deployment remains a separate authorised release after local acceptance.
