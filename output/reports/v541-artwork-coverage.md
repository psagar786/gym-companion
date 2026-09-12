# Fitness 7 V5.4.1 V2 artwork coverage audit

- Current A–B–A–C selectable identities: **291**.
- New V2 artwork: **43 sets / 86 images**.
- Runtime identities safely mapped to V2 artwork: **59**.
- Runtime identities still without V2 artwork: **232**.
- Pilot sets not used by the current runtime: **8**.
- Technically valid 512×512 Start/Movement pairs: **43/43**.

## Decision

The 43-set library is complete as a visual pilot, but it is not a complete replacement library for the A–B–A–C program. V5.4.1 may apply a V2 pair only to the explicit runtime IDs in the mapping file. Every other exercise keeps its exact legacy artwork; no similarity-based fallback is allowed.

## Pilot sets not currently used by A–B–A–C

- Row 6: Standing Cable Chest Press (periodized-standing-cable-chest-press)
- Row 9: High-to-Low Cable Fly (periodized-high-to-low-cable-fly)
- Row 21: Barbell Back Squat (periodized-barbell-back-squat)
- Row 32: Cable Woodchopper (periodized-cable-woodchopper)
- Row 36: Rotator Cuff External Rotation Isometric Hold (periodized-rotator-cuff-external-rotation-isometric)
- Row 38: Poliquin Heel-Elevated VMO Step-Up Hold (periodized-poliquin-vmo-step-up-hold)
- Row 39: Reverse-Grip Dumbbell Wrist and Forearm Isometric Hold (periodized-reverse-grip-dumbbell-wrist-forearm-isometric)
- Row 40: 45° Back Extension Peak Hold (periodized-45-degree-back-extension-hold)

## Runtime identities still awaiting V2 conversion

| Runtime identity | Exercise | Roles | Days | Weeks |
|---|---|---|---|---|
| periodized-deficit-push-ups | Deficit Push-Ups | alternative | Monday | A, C |
| periodized-neutral-grip-mag-pulldown | Neutral-Grip Mag Pulldown | alternative | Monday | A, C |
| periodized-assisted-pull-ups | Assisted Pull-Ups | alternative | Monday | A, C |
| periodized-chest-supported-machine-row | Chest-Supported Machine Row | alternative | Monday, Thursday | A, C |
| periodized-flat-barbell-bench | Flat Barbell Bench | alternative | Monday | A, B, C |
| periodized-parallel-bar-dips | Parallel Bar Dips | alternative | Monday, Thursday | A, C |
| periodized-dumbbell-pullover-on-bench | Dumbbell Pullover on Bench | alternative | Monday | A, C |
| periodized-cable-pushdown | Cable Pushdown | alternative | Monday | A, C |
| periodized-low-incline-cable-fly | Low Incline Cable Fly | alternative | Monday, Thursday | A, C |
| periodized-standing-plate-press | Standing Plate Press | alternative | Monday | A, C |
| periodized-close-grip-incline-db-press | Close-Grip Incline DB Press | alternative | Monday | A, C |
| periodized-reverse-pec-deck-fly | Reverse Pec Deck Fly | alternative | Monday | A, C |
| periodized-incline-prone-db-y-raise | Incline Prone DB Y-Raise | alternative | Monday | A, C |
| periodized-band-pull-apart | Band Pull-Apart | alternative | Monday | A, C |
| biweekly-hanging-straight-leg-raise | Hanging Straight-Leg Raise | optional, core | Monday, Friday | A, C |
| periodized-captain-s-chair-leg-raise | Captain's Chair Leg Raise | alternative | Monday | A, B, C |
| periodized-ab-wheel-rollout | Ab Wheel Rollout | alternative | Monday, Saturday | A, B, C |
| periodized-floor-leg-raise | Floor Leg Raise | alternative | Monday | A, C |
| biweekly-stick-behind-the-back-chest-opener | Stick Behind-the-Back Chest Opener | recovery, warmup | Monday, Thursday | A, C |
| biweekly-stick-overhead-lat-stretch | Stick Overhead Lat Stretch | recovery | Monday | A, C |
| biweekly-doorway-pec-stretch | Doorway Pec Stretch | recovery | Monday | A, C |
| biweekly-15-min-liss-incline-walk-speed-3-8-km-h-incline-9 | 15 Min LISS Incline Walk (Speed 3.8 km/h, Incline 9%) | cardio | Monday, Thursday | A, B, C |
| biweekly-stick-seated-russian-twists | Stick Seated Russian Twists | core | Tuesday | A, C |
| periodized-cable-russian-twist | Cable Russian Twist | alternative | Tuesday | A, C |
| periodized-floor-bodyweight-twist | Floor Bodyweight Twist | alternative | Tuesday | A, C |
| periodized-medicine-ball-twists | Medicine Ball Twists | alternative | Tuesday | A, C |
| biweekly-lying-pelvic-tilt-leg-raise | Lying Pelvic-Tilt Leg Raise | core | Tuesday | A, C |
| periodized-bench-reverse-crunch | Bench Reverse Crunch | alternative | Tuesday | A, C |
| periodized-hanging-leg-raise | Hanging Leg Raise | alternative | Tuesday, Friday | A, B, C |
| biweekly-cable-pallof-press-with-iso-hold | Cable Pallof Press with Iso-Hold | core | Tuesday | A, C |
| periodized-db-suitcase-carry | DB Suitcase Carry | alternative | Tuesday | A, C |
| biweekly-stick-standing-lateral-side-bends | Stick Standing Lateral Side Bends | core | Tuesday | A, C |
| periodized-light-db-side-bend | Light DB Side Bend | alternative | Tuesday, Friday | A, B, C |
| periodized-side-plank-hip-dips | Side Plank Hip Dips | alternative | Tuesday, Friday | A, B, C |
| periodized-cable-side-crunch | Cable Side Crunch | alternative | Tuesday, Friday | A, B, C |
| periodized-lying-supine-vacuum | Lying Supine Vacuum | alternative | Tuesday | A, C |
| periodized-incline-bench-plank-vacuum | Incline Bench Plank Vacuum | alternative | Tuesday | A, C |
| periodized-cat-cow-vacuum | Cat-Cow Vacuum | alternative | Tuesday | A, C |
| biweekly-kneeling-cable-rope-crunch | Kneeling Cable Rope Crunch | core | Tuesday | A, C |
| periodized-decline-bench-weighted-crunch | Decline Bench Weighted Crunch | alternative | Tuesday | A, C |
| periodized-stability-ball-crunch | Stability Ball Crunch | alternative | Tuesday | A, B, C |
| periodized-floor-crunch | Floor Crunch | alternative | Tuesday | A, B, C |
| biweekly-stick-standing-torso-twists | Stick Standing Torso Twists | warmup | Tuesday | A, B, C |
| biweekly-stick-overhead-side-bends | Stick Overhead Side Bends | warmup | Tuesday | A, B, C |
| biweekly-stick-high-knee-marches | Stick High Knee Marches | warmup | Tuesday | A, B, C |
| biweekly-stick-standing-overhead-side-stretch | Stick Standing Overhead Side Stretch | recovery | Tuesday | A, C |
| biweekly-stick-spinal-twist | Stick Spinal Twist | recovery | Tuesday | A, B, C |
| biweekly-cobra-pose | Cobra Pose | recovery | Tuesday | A, B, C |
| biweekly-incline-walk | Incline Walk | cardio | Tuesday, Friday | A, B, C |
| biweekly-intervals | Intervals | cardio | Tuesday, Friday | A, B, C |
| periodized-wide-stance-sumo-goblet-squat | Wide-Stance Sumo Goblet Squat | alternative | Wednesday | A, C |
| periodized-cable-hip-adduction | Cable Hip Adduction | alternative | Wednesday, Saturday | A, B, C |
| periodized-side-lying-adduction | Side-Lying Adduction | alternative | Wednesday | A, C |
| periodized-side-plank-abduction | Side Plank Abduction | alternative | Wednesday | A, B, C |
| periodized-barbell-rdl | Barbell RDL | alternative | Wednesday | A, C |
| periodized-cable-pull-through | Cable Pull-Through | alternative | Wednesday | A, B, C |
| periodized-goblet-squat-to-box | Goblet Squat to Box | alternative | Wednesday | A, C |
| periodized-bodyweight-box-squat | Bodyweight Box Squat | alternative | Wednesday | A, B, C |
| periodized-dumbbell-lying-leg-curl | Dumbbell Lying Leg Curl | alternative | Wednesday | A, B, C |
| periodized-deficit-bulgarian-split-squat | Deficit Bulgarian Split Squat | alternative | Wednesday | A, C |
| periodized-step-ups-on-bench | Step-Ups on Bench | alternative | Wednesday | A, C |
| periodized-reverse-lunges | Reverse Lunges | alternative | Wednesday | A, C |
| biweekly-deficit-bulgarian-split-squats | Deficit Bulgarian Split Squats | optional | Wednesday | A, C |
| periodized-single-leg-press | Single-Leg Press | alternative | Wednesday | A, C |
| periodized-single-leg-step-ups | Single-Leg Step-Ups | alternative | Wednesday | A, C |
| periodized-bodyweight-split-squats | Bodyweight Split Squats | alternative | Wednesday | A, C |
| biweekly-standing-machine-calf-raise | Standing Machine Calf Raise | optional | Wednesday | A, C |
| periodized-seated-calf-raise | Seated Calf Raise | alternative | Wednesday | A, C |
| periodized-dumbbell-single-leg-calf-raise | Dumbbell Single-Leg Calf Raise | alternative | Wednesday | A, C |
| periodized-leg-press-calf-raise | Leg Press Calf Raise | alternative | Wednesday | A, B, C |
| biweekly-stick-overhead-deep-squat-prys | Stick Overhead Deep Squat Prys | warmup | Wednesday | A, C |
| biweekly-stick-good-mornings | Stick Good Mornings | warmup | Wednesday, Friday, Saturday | A, B, C |
| biweekly-stick-lateral-leg-swings | Stick Lateral Leg Swings | warmup | Wednesday | A, C |
| biweekly-stick-quad-stretch | Stick Quad Stretch | recovery | Wednesday | A, B, C |
| biweekly-butterfly-groin-stretch | Butterfly Groin Stretch | recovery | Wednesday | A, B, C |
| biweekly-hamstring-stretch | Hamstring Stretch | recovery | Wednesday | A, B, C |
| biweekly-no-cardio-safeguard-knee-cns-recovery | NO CARDIO (Safeguard Knee & CNS Recovery) | cardio | Wednesday, Saturday | A, B, C |
| periodized-machine-shoulder-press | Machine Shoulder Press | alternative | Thursday | A, B, C |
| periodized-arnold-press | Arnold Press | alternative | Thursday | A, B, C |
| periodized-underhand-lat-pulldown | Underhand Lat Pulldown | alternative | Thursday | A, C |
| periodized-chin-ups | Chin-Ups | alternative | Thursday | A, C |
| biweekly-seated-wide-grip-cable-row | Seated Wide-Grip Cable Row | core | Thursday | A, C |
| periodized-incline-db-prone-row | Incline DB Prone Row | alternative | Thursday | A, C |
| periodized-cable-fly | Cable Fly | core | Thursday | A, C |
| periodized-standing-cable-crossover | Standing Cable Crossover | alternative | Thursday | A, C |
| periodized-dumbbell-incline-fly | Dumbbell Incline Fly | alternative | Thursday | A, C |
| biweekly-incline-dumbbell-curl | Incline Dumbbell Curl | core | Thursday | A, C |
| periodized-rope-tricep-pressdown | Rope Tricep Pressdown | alternative | Thursday | A, C |
| periodized-ez-bar-curl-skullcrushers | Ez-Bar Curl & Skullcrushers | alternative | Thursday | A, C |
| periodized-cable-hammer-curl-dips | Cable Hammer Curl & Dips | alternative | Thursday | A, C |
| periodized-concentration-curls | Concentration Curls | alternative | Thursday | A, C |
| biweekly-dumbbell-pullover-on-flat-bench | Dumbbell Pullover on Flat Bench | optional | Thursday | A, C |
| periodized-straight-arm-cable-pushdown | Straight-Arm Cable Pushdown | alternative | Thursday | A, B, C |
| periodized-incline-cable-pullover | Incline Cable Pullover | alternative | Thursday | A, C |
| periodized-decline-db-pullover | Decline DB Pullover | alternative | Thursday | A, B, C |
| biweekly-side-plank-hold-with-rotation | Side Plank Hold with Rotation | optional | Thursday | A, C |
| periodized-hanging-oblique-knee-raise | Hanging Oblique Knee Raise | alternative | Thursday | A, C |
| periodized-suitcase-carry | Suitcase Carry | alternative | Thursday | A, C |
| biweekly-stick-lat-stretch | Stick Lat Stretch | warmup, recovery | Thursday | A, B, C |
| biweekly-stick-doorway-chest-stretch | Stick Doorway Chest Stretch | recovery | Thursday | A, B, C |
| biweekly-cross-body-stretch | Cross-Body Stretch | recovery | Thursday | A, B, C |
| periodized-cable-woodchopper-low-to-high | Cable Woodchopper (Low-to-High) | alternative | Friday | A, C |
| periodized-russian-twists | Russian Twists | alternative | Friday | A, C |
| biweekly-floor-reverse-crunch-with-pelvic-tilt | Floor Reverse Crunch with Pelvic Tilt | core | Friday | A, C |
| periodized-lying-leg-lift | Lying Leg Lift | alternative | Friday | A, C |
| biweekly-stick-overhead-lateral-side-bends | Stick Overhead Lateral Side Bends | core | Friday | A, C |
| biweekly-standard-forearm-plank-to-rkc-hardstyle-plank | Standard Forearm Plank to RKC Hardstyle Plank | core | Friday | A, C |
| periodized-extended-plank | Extended Plank | alternative | Friday | A, C |
| periodized-quadruped-vacuum | Quadruped Vacuum | alternative | Friday, Tuesday | A, B, C |
| periodized-lying-vacuum | Lying Vacuum | alternative | Friday, Tuesday | A, B, C |
| periodized-plank-vacuum | Plank Vacuum | alternative | Friday, Tuesday | A, B, C |
| periodized-knee-tuck | Knee Tuck | alternative | Friday | A, C |
| periodized-hanging-windshield-wipers | Hanging Windshield Wipers | alternative | Friday | A, C |
| periodized-dragon-flag-negatives | Dragon Flag Negatives | alternative | Friday | A, B, C |
| periodized-decline-leg-raise | Decline Leg Raise | alternative | Friday | A, C |
| biweekly-stick-trunk-rotations | Stick Trunk Rotations | warmup | Friday | A, B, C |
| biweekly-stick-lat-oblique-reach | Stick Lat & Oblique Reach | recovery | Friday | A, B, C |
| biweekly-cat-cow-mobility | Cat-Cow Mobility | recovery | Friday | A, B, C |
| biweekly-child-s-pose | Child's Pose | recovery | Friday | A, B, C |
| periodized-glute-bridge | Glute Bridge | core, alternative | Saturday | A, C |
| periodized-single-leg-hip-thrust | Single-Leg Hip Thrust | alternative | Saturday | A, B, C |
| periodized-machine-hip-thrust | Machine Hip Thrust | alternative | Saturday | A, B, C |
| periodized-wide-stance-leg-press | Wide-Stance Leg Press | alternative | Saturday | A, B, C |
| periodized-sumo-goblet-squat | Sumo Goblet Squat | alternative | Saturday, Wednesday | A, B, C |
| biweekly-seated-cable-row-to-mid-torso | Seated Cable Row to Mid-Torso | core | Saturday | A, C |
| periodized-single-arm-db-row | Single-Arm DB Row | alternative | Saturday, Thursday | A, B, C |
| periodized-meadows-row | Meadows Row | alternative | Saturday, Monday, Thursday | A, B, C |
| periodized-chest-supported-t-bar-row | Chest-Supported T-Bar Row | alternative | Saturday | A, B, C |
| periodized-cable-standing-abduction | Cable Standing Abduction | alternative | Saturday, Wednesday | A, B, C |
| periodized-side-plank-clamshells | Side Plank Clamshells | alternative | Saturday | A, B, C |
| biweekly-dumbbell-stiff-leg-romanian-deadlift | Dumbbell Stiff-Leg Romanian Deadlift | core | Saturday | A, C |
| periodized-single-leg-db-rdl | Single-Leg DB RDL | alternative | Saturday | A, C |
| periodized-nordic-curl-negatives | Nordic Curl Negatives | alternative | Saturday | A, C |
| biweekly-dumbbell-shrugs-with-2s-pause | Dumbbell Shrugs with 2s Pause | core | Saturday | A, C |
| periodized-cable-upright-row-wide | Cable Upright Row (Wide) | alternative | Saturday | A, C |
| periodized-barbell-shrug | Barbell Shrug | alternative | Saturday | A, C |
| periodized-hex-bar-shrug | Hex Bar Shrug | alternative | Saturday | A, B, C |
| biweekly-bodyweight-air-squats-to-walking-lunges | Bodyweight Air Squats to Walking Lunges | optional | Saturday | A, C |
| periodized-bulgarian-split-squat-1-5-reps | Bulgarian Split Squat 1.5 Reps | alternative | Saturday | A, C |
| periodized-step-ups | Step-Ups | alternative | Saturday, Wednesday | A, B, C |
| periodized-jump-squats | Jump Squats | alternative | Saturday | A, B, C |
| biweekly-dead-bug-to-dragon-flag-negatives | Dead Bug to Dragon Flag Negatives | optional | Saturday | A, C |
| periodized-hanging-knee-tuck | Hanging Knee Tuck | alternative | Saturday | A, B, C |
| periodized-hollow-body-hold | Hollow Body Hold | alternative | Saturday | A, B, C |
| biweekly-stick-deep-squat-prys | Stick Deep Squat Prys | warmup | Saturday | A, B, C |
| biweekly-stick-torso-twists | Stick Torso Twists | warmup | Saturday | A, B, C |
| biweekly-stick-hamstring-stretch | Stick Hamstring Stretch | recovery | Saturday | A, B, C |
| biweekly-pigeon-pose | Pigeon Pose | recovery | Saturday | A, B, C |
| biweekly-figure-four-stretch | Figure-Four Stretch | recovery | Saturday | A, B, C |
| biweekly-30-min-brisk-walk | 30-min brisk walk | recovery | Sunday | A, B, C |
| biweekly-full-body-stick-mobility | full-body stick mobility | recovery | Sunday | A, B, C |
| biweekly-hydration | hydration | recovery | Sunday | A, B, C |
| biweekly-nutritional-adherence | nutritional adherence. | recovery | Sunday | A, B, C |
| periodized-incline-machine-press | Incline Machine Press | alternative | Monday | B |
| periodized-incline-deficit-push-ups | Incline Deficit Push-Ups | alternative | Monday | B |
| biweekly-neutral-grip-mag-grip-lat-pulldown | Neutral-Grip Mag-Grip Lat Pulldown | core | Monday | B |
| periodized-assisted-neutral-chin-up | Assisted Neutral Chin-Up | alternative | Monday | B |
| periodized-machine-row | Machine Row | alternative | Monday, Saturday | B |
| periodized-weighted-push-ups | Weighted Push-Ups | alternative | Monday | B |
| periodized-db-pullover | DB Pullover | alternative | Monday, Thursday | B |
| periodized-kneeling-cable-lat-pull | Kneeling Cable Lat Pull | alternative | Monday | B |
| periodized-incline-machine-fly | Incline Machine Fly | alternative | Monday | B |
| periodized-plate-press | Plate Press | alternative | Monday | B |
| biweekly-hanging-straight-leg-toes-to-bar | Hanging Straight-Leg Toes-to-Bar | optional | Monday | B |
| biweekly-stick-behind-the-back-opener | Stick Behind-the-Back Opener | recovery, warmup | Monday, Thursday | B |
| biweekly-overhead-lat-lengthener | Overhead Lat Lengthener | recovery | Monday | B |
| biweekly-doorway-stretch | Doorway Stretch | recovery | Monday | B |
| biweekly-standing-cable-woodchopper-high-to-low | Standing Cable Woodchopper (High-to-Low) | core | Tuesday | B |
| periodized-stick-russian-twists | Stick Russian Twists | alternative | Tuesday, Friday | B |
| periodized-dumbbell-woodchopper | Dumbbell Woodchopper | alternative | Tuesday | B |
| periodized-leg-raise | Leg Raise | alternative | Tuesday | B |
| periodized-lying-floor-leg-raise | Lying Floor Leg Raise | alternative | Tuesday | B |
| biweekly-half-kneeling-cable-pallof-press-with-overhead-raise | Half-Kneeling Cable Pallof Press with Overhead Raise | core | Tuesday | B |
| biweekly-side-plank-hip-dips-with-rotation | Side Plank Hip Dips with Rotation | core | Tuesday | B |
| periodized-stick-side-bends | Stick Side Bends | alternative | Tuesday, Friday | B |
| periodized-db-side-bend | DB Side Bend | alternative | Tuesday | B |
| biweekly-standing-seated-transverse-abdominis-stomach-vacuum | Standing & Seated Transverse Abdominis Stomach Vacuum | core | Tuesday | B |
| biweekly-decline-bench-weighted-crunch | Decline Bench Weighted Crunch | core | Tuesday | B |
| periodized-kneeling-cable-rope-crunch | Kneeling Cable Rope Crunch | alternative | Tuesday | B |
| biweekly-stick-overhead-side-stretch | Stick Overhead Side Stretch | recovery | Tuesday | B |
| periodized-wide-stance-sumo-leg-press | Wide-Stance Sumo Leg Press | alternative | Wednesday | B |
| periodized-romanian-deadlift | Romanian Deadlift | core | Wednesday | B |
| periodized-deficit-barbell-rdl | Deficit Barbell RDL | alternative | Wednesday | B |
| periodized-dumbbell-rdl | Dumbbell RDL | alternative | Wednesday, Saturday | B |
| periodized-leg-press | Leg Press | core | Wednesday | B |
| periodized-goblet-squat | Goblet Squat | alternative | Wednesday | B |
| biweekly-reverse-lunges-with-dumbbells | Reverse Lunges with Dumbbells | core | Wednesday | B |
| periodized-walking-lunges | Walking Lunges | alternative | Wednesday, Saturday | B |
| periodized-bulgarian-split-squats | Bulgarian Split Squats | alternative | Wednesday | B |
| biweekly-sissy-squat | Sissy Squat | optional | Wednesday | B |
| periodized-leg-extension-dropset | Leg Extension Dropset | alternative | Wednesday | B |
| periodized-single-leg-extension | Single-Leg Extension | alternative | Wednesday | B |
| periodized-deficit-split-squat | Deficit Split Squat | alternative | Wednesday | B |
| periodized-bodyweight-sissy-squat | Bodyweight Sissy Squat | alternative | Wednesday | B |
| biweekly-seated-calf-raise-machine | Seated Calf Raise Machine | optional | Wednesday | B |
| periodized-standing-calf-raise | Standing Calf Raise | alternative | Wednesday | B |
| periodized-single-leg-calf-raise | Single-Leg Calf Raise | alternative | Wednesday | B |
| biweekly-stick-overhead-deep-squats | Stick Overhead Deep Squats | warmup | Wednesday | B |
| biweekly-stick-hip-swings | Stick Hip Swings | warmup | Wednesday | B |
| periodized-landmine-press | Landmine Press | alternative | Thursday | B |
| periodized-assisted-pull-up | Assisted Pull-Up | alternative | Thursday | B |
| biweekly-chest-supported-t-bar-row | Chest-Supported T-Bar Row | core | Thursday | B |
| periodized-incline-bench-row | Incline Bench Row | alternative | Thursday | B |
| biweekly-incline-smith-machine-press-45 | Incline Smith Machine Press 45° | core | Thursday | B |
| periodized-weighted-dips | Weighted Dips | alternative | Thursday | B |
| biweekly-bayesian-cable-curl | Bayesian Cable Curl | core | Thursday | B |
| periodized-overhead-dual-cable-tricep-extension | Overhead Dual-Cable Tricep Extension | alternative | Thursday | B |
| periodized-incline-db-curl-rope-pressdown | Incline DB Curl & Rope Pressdown | alternative | Thursday | B |
| periodized-ez-bar-preacher-curl-skullcrushers | Ez-Bar Preacher Curl & Skullcrushers | alternative | Thursday | B |
| biweekly-incline-cable-pullover-with-stretched-bias | Incline Cable Pullover with Stretched Bias | optional | Thursday | B |
| biweekly-hanging-oblique-knee-raise | Hanging Oblique Knee Raise | optional | Thursday | B |
| periodized-captain-s-chair-oblique-raise | Captain's Chair Oblique Raise | alternative | Thursday | B |
| biweekly-standing-cable-woodchopper-low-to-high | Standing Cable Woodchopper (Low-to-High) | core | Friday | B |
| periodized-landmine-rotations | Landmine Rotations | alternative | Friday | B |
| periodized-floor-reverse-crunch | Floor Reverse Crunch | alternative | Friday | B |
| biweekly-cable-side-crunch-on-mat | Cable Side Crunch on Mat | core | Friday | B |
| periodized-stick-lateral-side-bends | Stick Lateral Side Bends | alternative | Friday | B |
| periodized-dead-bug | Dead Bug | core | Friday | B |
| periodized-forearm-plank | Forearm Plank | alternative | Friday | B |
| biweekly-hanging-windshield-wipers | Hanging Windshield Wipers | core | Friday | B |
| periodized-bicycle-kicks | Bicycle Kicks | alternative | Friday | B |
| periodized-decline-bench-russian-twists | Decline Bench Russian Twists | alternative | Friday | B |
| biweekly-kas-glute-bridge | Kas Glute Bridge | core | Saturday | B |
| biweekly-single-arm-dumbbell-row | Single-Arm Dumbbell Row | core | Saturday | B |
| periodized-romanian-barbell-deadlift | Romanian Barbell Deadlift | alternative | Saturday | B |
| periodized-nordic-hamstring-curls | Nordic Hamstring Curls | alternative | Saturday | B |
| biweekly-cable-upright-row-wide-grip | Cable Upright Row (Wide-Grip) | core | Saturday | B |
| periodized-barbell-shrugs | Barbell Shrugs | alternative | Saturday | B |
| periodized-dumbbell-shrugs | Dumbbell Shrugs | alternative | Saturday | B |
| periodized-face-pulls | Face Pulls | alternative | Saturday | B |
| biweekly-bulgarian-split-squats-with-1-5-rep-style | Bulgarian Split Squats with 1.5 Rep Style | optional | Saturday | B |
| biweekly-dragon-flag-negatives-on-flat-bench | Dragon Flag Negatives on Flat Bench | optional | Saturday | B |
