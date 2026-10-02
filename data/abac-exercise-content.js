/* Content-only exact identity registry. No artwork, dose, tier or history mutation. */
(() => {
 const data={
  "version": "f7-content-v1",
  "records": {
    "biweekly-chest-supported-incline-dumbbell-row": {
      "canonicalMovementId": "biweekly-chest-supported-incline-dumbbell-row",
      "name": "Chest-Supported Incline Dumbbell Row",
      "startInstruction": "Set bench to 30-45°. Lie face down with chest on the pad. Let arms hang straight down with dumbbells.",
      "movementInstruction": "Row dumbbells up, retracting scapula and driving elbows back. Squeeze the mid-back at the top.",
      "equipment": "Dumbbells and bench where shown",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-flat-dumbbell-bench-press": {
      "canonicalMovementId": "biweekly-flat-dumbbell-bench-press",
      "name": "Flat Dumbbell Bench Press",
      "startInstruction": "Lie flat on bench. Retract scapula, puff chest, plant feet. Hold dumbbells at chest level with pronated grip.",
      "movementInstruction": "Press dumbbells straight up. Squeeze the mid-chest at the top. Lower under control to stretch the pecs.",
      "equipment": "Dumbbells and bench where shown",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-hanging-straight-leg-raise": {
      "canonicalMovementId": "biweekly-hanging-straight-leg-raise",
      "name": "Hanging Straight-Leg Raise",
      "startInstruction": "Hang from a fixed pull-up bar with arms straight, shoulders active, legs together and straight below the hips, ribs down, and pelvis neutral.",
      "movementInstruction": "From the hang, raise both straight legs together until they reach hip height, using a controlled posterior pelvic tilt without swinging.",
      "equipment": "Pull-up bar",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-incline-dumbbell-bench-press-30": {
      "canonicalMovementId": "biweekly-incline-dumbbell-bench-press-30",
      "name": "Incline Dumbbell Bench Press (30°)",
      "startInstruction": "Set bench to 30°. Sit with dumbbells at shoulder level. Retract scapula, puff chest out, plant feet firmly.",
      "movementInstruction": "Press dumbbells upward and slightly inward. Peak contraction at the top without locking out elbows completely.",
      "equipment": "Dumbbells and bench where shown",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-incline-dumbbell-hex-press": {
      "canonicalMovementId": "biweekly-incline-dumbbell-hex-press",
      "name": "Incline Dumbbell Hex Press",
      "startInstruction": "Set bench to 30°. Hold two dumbbells pressed together over the chest with a neutral grip. Retract scapula.",
      "movementInstruction": "Press dumbbells upward while actively squeezing them together. Focus on the inner chest contraction.",
      "equipment": "Dumbbells and bench where shown",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-neutral-grip-mag-grip-lat-pulldown": {
      "canonicalMovementId": "biweekly-neutral-grip-mag-grip-lat-pulldown",
      "name": "Neutral-Grip Mag-Grip Lat Pulldown",
      "startInstruction": "Sit tall under the thigh pad with feet planted, torso nearly upright, arms extended overhead holding the close neutral handle.",
      "movementInstruction": "Pull the neutral handle down toward the upper chest with elbows traveling down and slightly back; keep the torso nearly upright and shoulder blades depressed.",
      "equipment": "Cable station",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-single-arm-iliac-cable-lat-pulldown": {
      "canonicalMovementId": "biweekly-single-arm-iliac-cable-lat-pulldown",
      "name": "Single-Arm Iliac Cable Lat Pulldown",
      "startInstruction": "Half-kneel side-on to the high pulley with the inside knee down and outside foot planted; hold one D-handle overhead with a neutral grip, torso tall and ribs stacked.",
      "movementInstruction": "Pull elbow down and into the hip, focusing on the lowest part of the lat. Squeeze and hold.",
      "equipment": "Cable station with the exercise-specific attachment",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-straight-arm-cable-pulldown": {
      "canonicalMovementId": "biweekly-straight-arm-cable-pulldown",
      "name": "Straight-Arm Cable Pulldown",
      "startInstruction": "Stand facing a high cable with a straight bar. Keep arms straight with a slight bend in elbows.",
      "movementInstruction": "Pull the bar down to your thighs in a sweeping arc, using only the lats. Squeeze at the bottom.",
      "equipment": "Cable station with the exercise-specific attachment",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-wide-grip-lat-pulldown": {
      "canonicalMovementId": "biweekly-wide-grip-lat-pulldown",
      "name": "Wide-Grip Lat Pulldown",
      "startInstruction": "Sit at pulldown machine. Grip bar wider than shoulder-width. Keep chest up and slight backward lean.",
      "movementInstruction": "Pull bar down to upper chest, driving elbows down and back. Squeeze lats at the bottom.",
      "equipment": "Cable station with the exercise-specific attachment",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-around-the-worlds": {
      "canonicalMovementId": "biweekly-stick-around-the-worlds",
      "name": "Stick Around-the-Worlds",
      "startInstruction": "Stand holding a stick with a wide grip in front of you.",
      "movementInstruction": "Keep one arm relatively straight while the other arm brings the stick over the head and behind the back in a circular motion.",
      "equipment": "Light mobility stick",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-behind-the-back-chest-opener": {
      "canonicalMovementId": "biweekly-stick-behind-the-back-chest-opener",
      "name": "Stick Behind-the-Back Chest Opener",
      "startInstruction": "Stand tall with a wide grip and the stick resting behind the hips.",
      "movementInstruction": "Draw the hands a few centimetres back, pause, then return without shrugging.",
      "source": "data/periodized-abc.js",
      "safetyCue": "Use a wider grip or stop the arc if the front of the shoulder pinches or the hand tingles.",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-behind-the-back-opener": {
      "canonicalMovementId": "biweekly-stick-behind-the-back-opener",
      "name": "Stick Behind-the-Back Opener",
      "startInstruction": "Stand tall with the stick behind the hips and elbows relaxed.",
      "movementInstruction": "Gently lift the stick away from the body, then lower it with control.",
      "equipment": "Light stick or empty-hand range",
      "source": "data/periodized-abc.js",
      "safetyCue": "Widen the hands and reduce the range for any pinch, numbness, or sharp pain.",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-overhead-thoracic-extensions": {
      "canonicalMovementId": "biweekly-stick-overhead-thoracic-extensions",
      "name": "Stick Overhead Thoracic Extensions",
      "startInstruction": "Hold a stick overhead with a wide grip. Kneel or sit.",
      "movementInstruction": "Push the chest forward and extend the upper back, keeping the lower back neutral. Feel the stretch in the lats and thoracic spine.",
      "equipment": "Light mobility stick",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-overhead-thoracic-spine-extensions": {
      "canonicalMovementId": "biweekly-stick-overhead-thoracic-spine-extensions",
      "name": "Stick Overhead Thoracic Spine Extensions",
      "startInstruction": "Hold a stick overhead with a wide grip. Kneel or sit.",
      "movementInstruction": "Push the chest forward and extend the upper back, keeping the lower back neutral. Feel the stretch in the lats and thoracic spine.",
      "equipment": "Light mobility stick",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-shoulder-dislocates": {
      "canonicalMovementId": "biweekly-stick-shoulder-dislocates",
      "name": "Stick Shoulder Dislocates",
      "startInstruction": "Stand tall, holding a PVC pipe or stick with a wide overhand grip in front of the hips.",
      "movementInstruction": "Keep arms straight and raise the stick overhead, passing it behind the back down to the glutes. Return.",
      "equipment": "Light mobility stick",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-cable-face-pull-with-external-rotation": {
      "canonicalMovementId": "biweekly-cable-face-pull-with-external-rotation",
      "name": "Cable Face Pull with External Rotation",
      "startInstruction": "Set cable to upper chest height with rope attachment. Grip ends of the rope.",
      "movementInstruction": "Pull rope towards the face, separating hands and externally rotating the shoulders at the end of the movement.",
      "equipment": "Cable station with the exercise-specific attachment",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-chest-supported-db-row": {
      "canonicalMovementId": "periodized-chest-supported-db-row",
      "name": "Chest-Supported DB Row",
      "startInstruction": "Set bench to 30-45°. Lie face down with chest on the pad. Let arms hang straight down with dumbbells.",
      "movementInstruction": "Row dumbbells up, retracting scapula and driving elbows back. Squeeze the mid-back at the top.",
      "equipment": "Dumbbells and bench where shown",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-flat-dumbbell-bench": {
      "canonicalMovementId": "periodized-flat-dumbbell-bench",
      "name": "Flat Dumbbell Bench",
      "startInstruction": "Lie flat on bench. Retract scapula, puff chest, plant feet. Hold dumbbells at chest level with pronated grip.",
      "movementInstruction": "Press dumbbells straight up. Squeeze the mid-chest at the top. Lower under control to stretch the pecs.",
      "equipment": "Dumbbells and bench where shown",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-incline-barbell-bench": {
      "canonicalMovementId": "periodized-incline-barbell-bench",
      "name": "Incline Barbell Bench",
      "startInstruction": "Set bench to 30-45°. Grip barbell slightly wider than shoulder-width. Unrack and hold above upper chest.",
      "movementInstruction": "Lower bar to upper chest under control. Press back up to starting position, squeezing the upper pecs.",
      "equipment": "Barbell and appropriate rack or lifting platform",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-incline-reverse-crunch": {
      "canonicalMovementId": "periodized-incline-reverse-crunch",
      "name": "Incline Reverse Crunch",
      "startInstruction": "Lie on an incline bench, holding the top handle. Keep legs slightly bent.",
      "movementInstruction": "Curl the pelvis off the bench, bringing knees towards the chest. Squeeze the lower abs, then slowly lower.",
      "equipment": "Incline bench; bodyweight",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-incline-smith-machine-press": {
      "canonicalMovementId": "periodized-incline-smith-machine-press",
      "name": "Incline Smith Machine Press",
      "startInstruction": "Set bench to 30°. Align upper chest with the bar. Grip slightly wider than shoulder-width. Unrack bar.",
      "movementInstruction": "Lower bar to clavicle. Press up in a fixed path, squeezing the upper chest at the top.",
      "equipment": "Smith machine and incline bench",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-seated-cable-row": {
      "canonicalMovementId": "periodized-seated-cable-row",
      "name": "Seated Cable Row",
      "startInstruction": "Sit at cable row station. Plant feet, keep knees slightly bent. Maintain an upright torso.",
      "movementInstruction": "Pull handle to lower abdomen, driving elbows back and squeezing shoulder blades together.",
      "equipment": "Cable station with the exercise-specific attachment",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-t-bar-row": {
      "canonicalMovementId": "periodized-t-bar-row",
      "name": "T-Bar Row",
      "startInstruction": "Straddle a T-bar or landmine setup. Hinge at the hips, keeping back straight. Grip the handle firmly.",
      "movementInstruction": "Row the weight up to your torso, squeezing the back muscles. Lower under control to full stretch.",
      "equipment": "T-bar or anchored landmine with row handle",
      "source": ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-seated-russian-twists": {
      "canonicalMovementId": "biweekly-stick-seated-russian-twists",
      "name": "Stick Seated Russian Twists",
      "startInstruction": "Sit on a mat with knees bent, feet lightly planted, torso tall, and both hands holding a light stick across the chest.",
      "movementInstruction": "Rotate the ribcage and stick toward one hip while keeping the pelvis steady; return through center without swinging.",
      "equipment": "Light stick or empty-hand range",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-cable-russian-twist": {
      "canonicalMovementId": "periodized-cable-russian-twist",
      "name": "Cable Russian Twist",
      "startInstruction": "Sit facing away from a low cable with knees bent, feet supported, torso slightly reclined, and both hands holding the handle at the chest.",
      "movementInstruction": "Rotate the ribcage and handle toward one side while the pelvis stays quiet; return through center and alternate.",
      "equipment": "Low cable station with handle",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-floor-bodyweight-twist": {
      "canonicalMovementId": "periodized-floor-bodyweight-twist",
      "name": "Floor Bodyweight Twist",
      "startInstruction": "Sit on a mat with knees bent and feet planted, torso tall and hands together at the chest.",
      "movementInstruction": "Rotate the ribcage toward one hip without collapsing the spine; return to center and alternate sides.",
      "equipment": "Bodyweight on exercise mat",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-medicine-ball-twists": {
      "canonicalMovementId": "periodized-medicine-ball-twists",
      "name": "Medicine Ball Twists",
      "startInstruction": "Sit with knees bent and feet grounded, holding one medicine ball at the chest with the torso slightly reclined.",
      "movementInstruction": "Move the ball beside one hip by rotating the trunk while keeping the spine long; return to center and alternate.",
      "equipment": "Medicine ball and exercise mat",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-lying-pelvic-tilt-leg-raise": {
      "canonicalMovementId": "biweekly-lying-pelvic-tilt-leg-raise",
      "name": "Lying Pelvic-Tilt Leg Raise",
      "startInstruction": "Lie supine on a mat, legs straight together, hands beside the hips, and lower back gently connected to the floor.",
      "movementInstruction": "Tilt the pelvis posteriorly and raise the straight legs to a comfortable height without arching the lower back; lower with control.",
      "equipment": "Bodyweight / floor",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-bench-reverse-crunch": {
      "canonicalMovementId": "periodized-bench-reverse-crunch",
      "name": "Bench Reverse Crunch",
      "startInstruction": "Lie on a flat bench with hands gripping the sides, hips near the edge, knees bent and shins parallel to the floor.",
      "movementInstruction": "Curl the pelvis toward the ribs to lift the hips slightly from the bench; lower the pelvis slowly without swinging the legs.",
      "equipment": "Flat bench; bodyweight",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-cable-pallof-press-with-iso-hold": {
      "canonicalMovementId": "biweekly-cable-pallof-press-with-iso-hold",
      "name": "Cable Pallof Press with Iso-Hold",
      "startInstruction": "Stand side-on to a cable at sternum height, feet shoulder-width, handle at the chest, ribs stacked over pelvis.",
      "movementInstruction": "Press the handle straight forward and hold while resisting trunk rotation; return the handle to the chest slowly.",
      "equipment": "Cable station",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-side-plank-hold": {
      "canonicalMovementId": "periodized-side-plank-hold",
      "name": "Side Plank Hold",
      "startInstruction": "Set the forearm under the shoulder with legs extended and body in one straight line, or use the lower knee for support.",
      "movementInstruction": "Lift the hips and hold a rigid side plank while breathing normally; lower with control after the hold.",
      "equipment": "Exercise mat; bodyweight",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight-hold",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-db-suitcase-carry": {
      "canonicalMovementId": "periodized-db-suitcase-carry",
      "name": "DB Suitcase Carry",
      "startInstruction": "Stand tall holding one dumbbell at the side, feet hip-width, shoulders level and ribs stacked.",
      "movementInstruction": "Walk slowly while resisting side-bending and keeping the dumbbell close to the thigh; stop and lower it under control.",
      "equipment": "One dumbbell and clear walking space",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-standing-lateral-side-bends": {
      "canonicalMovementId": "biweekly-stick-standing-lateral-side-bends",
      "name": "Stick Standing Lateral Side Bends",
      "startInstruction": "Stand tall with a light stick across the upper back, feet hip-width, and ribs stacked over the pelvis.",
      "movementInstruction": "Bend the trunk sideways without rotating or shifting the hips; return to upright under control.",
      "equipment": "Light stick or empty-hand range",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-side-plank-hip-dips": {
      "canonicalMovementId": "periodized-side-plank-hip-dips",
      "name": "Side Plank Hip Dips",
      "startInstruction": "Set the lower elbow under the shoulder in a side plank with feet stacked or the lower knee down.",
      "movementInstruction": "Lower the hip toward the floor a short distance, then drive it back to the straight-line plank position.",
      "equipment": "Exercise mat; bodyweight",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-cable-side-crunch": {
      "canonicalMovementId": "periodized-cable-side-crunch",
      "name": "Cable Side Crunch",
      "startInstruction": "Stand side-on to a high cable with the handle near the temple, feet stable and torso long.",
      "movementInstruction": "Shorten the side of the trunk to bring the ribs toward the hip against the cable; return slowly without rotating.",
      "equipment": "High cable station with handle",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-incline-bench-plank-vacuum": {
      "canonicalMovementId": "periodized-incline-bench-plank-vacuum",
      "name": "Incline Bench Plank Vacuum",
      "startInstruction": "Place forearms on an incline bench, step back into a straight-body plank and keep the pelvis neutral.",
      "movementInstruction": "Exhale and gently draw the lower abdomen inward while maintaining the plank line; release without dropping the hips.",
      "equipment": "Incline bench; bodyweight",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "vacuum",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-cat-cow-vacuum": {
      "canonicalMovementId": "periodized-cat-cow-vacuum",
      "name": "Cat-Cow Vacuum",
      "startInstruction": "Start on hands and knees with wrists under shoulders, knees under hips, and spine neutral.",
      "movementInstruction": "Exhale into a gentle abdominal draw-in as the spine moves through a small comfortable flexion; return to neutral without forcing the arc.",
      "equipment": "Bodyweight / floor",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "vacuum",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-kneeling-cable-rope-crunch": {
      "canonicalMovementId": "biweekly-kneeling-cable-rope-crunch",
      "name": "Kneeling Cable Rope Crunch",
      "startInstruction": "Kneel facing a high cable with the rope beside the ears, hips under the torso, and spine long.",
      "movementInstruction": "Curl the ribs toward the pelvis by flexing the spine; pause the abdominal contraction, then re-extend slowly.",
      "equipment": "Cable station",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-stability-ball-crunch": {
      "canonicalMovementId": "periodized-stability-ball-crunch",
      "name": "Stability Ball Crunch",
      "startInstruction": "Sit on a stability ball and walk the feet forward until the mid-back is supported, knees bent and hands lightly behind the head.",
      "movementInstruction": "Curl the ribs toward the pelvis while the ball supports the back; lower until the spine lengthens over the ball.",
      "equipment": "Stability ball",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-floor-crunch": {
      "canonicalMovementId": "periodized-floor-crunch",
      "name": "Floor Crunch",
      "startInstruction": "Lie supine with knees bent, feet planted and fingertips behind the head without interlocking or pulling.",
      "movementInstruction": "Lift the shoulder blades by curling the ribs toward the pelvis; lower until the upper back returns to the mat.",
      "equipment": "Exercise mat; bodyweight",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-standing-torso-twists": {
      "canonicalMovementId": "biweekly-stick-standing-torso-twists",
      "name": "Stick Standing Torso Twists",
      "startInstruction": "Stand with feet hip-width and a light stick across the chest, elbows relaxed and pelvis facing forward.",
      "movementInstruction": "Rotate the ribcage a small distance to one side while the hips stay quiet; return through center and alternate.",
      "equipment": "Light stick or empty-hand range",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-elliptical-intervals": {
      "canonicalMovementId": "periodized-elliptical-intervals",
      "name": "Elliptical Intervals",
      "startInstruction": "Stand on the elliptical with feet centered on the pedals, hands lightly on the moving handles and torso upright.",
      "movementInstruction": "Drive the pedals and handles in a controlled interval effort while keeping the knees tracking forward; ease down smoothly.",
      "equipment": "Elliptical trainer",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "cardio",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-bike-sprint-intervals": {
      "canonicalMovementId": "periodized-bike-sprint-intervals",
      "name": "Stationary Bike Sprint Intervals",
      "startInstruction": "Sit on a stationary bike with the saddle set so the knee remains softly bent at the bottom and hands relaxed on the bars.",
      "movementInstruction": "Accelerate the pedals for the work interval while keeping the torso stable, then reduce resistance and cadence for recovery.",
      "equipment": "Stationary bike",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "cardio",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-cobra-pose": {
      "canonicalMovementId": "biweekly-cobra-pose",
      "name": "Cobra Pose",
      "startInstruction": "Lie prone with hands beside the lower ribs, legs extended and tops of the feet on the mat.",
      "movementInstruction": "Press lightly through the hands to lift the chest into a comfortable spinal extension while the pelvis stays heavy; lower slowly.",
      "equipment": "Bodyweight / floor",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-standing-cable-woodchopper-high-to-low": {
      "canonicalMovementId": "biweekly-standing-cable-woodchopper-high-to-low",
      "name": "Standing Cable Woodchopper (High-to-Low)",
      "startInstruction": "Stand side-on to a high cable with both hands near the outside shoulder, feet staggered, and knees softly bent.",
      "movementInstruction": "Pull the handle diagonally down toward the opposite hip while rotating the trunk and pivoting the rear foot slightly; return along the same path.",
      "equipment": "Cable station",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-dumbbell-woodchopper": {
      "canonicalMovementId": "periodized-dumbbell-woodchopper",
      "name": "Dumbbell Woodchopper",
      "startInstruction": "Stand with feet staggered holding one dumbbell near the outside shoulder, knees soft and trunk braced.",
      "movementInstruction": "Rotate and guide the dumbbell diagonally down toward the opposite hip, then return along the same controlled arc.",
      "equipment": "One dumbbell",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-hanging-knee-raise": {
      "canonicalMovementId": "periodized-hanging-knee-raise",
      "name": "Hanging Knee Raise",
      "startInstruction": "Hang from a fixed pull-up bar with shoulders active, arms straight, knees bent about 90 degrees, and pelvis neutral.",
      "movementInstruction": "Curl the pelvis and draw both knees toward the chest without swinging; lower until the legs hang quietly.",
      "equipment": "Fixed pull-up bar; bodyweight",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-half-kneeling-cable-pallof-press-with-overhead-raise": {
      "canonicalMovementId": "biweekly-half-kneeling-cable-pallof-press-with-overhead-raise",
      "name": "Half-Kneeling Cable Pallof Press with Overhead Raise",
      "startInstruction": "Kneel with the inside knee down beside a cable at sternum height, handle at the chest, glute lightly engaged, and ribs stacked.",
      "movementInstruction": "Press the handle forward, then raise the straight arms overhead while resisting rotation; lower and return to the chest.",
      "equipment": "Cable station",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-standard-pallof-press": {
      "canonicalMovementId": "periodized-standard-pallof-press",
      "name": "Standard Pallof Press",
      "startInstruction": "Stand side-on to a cable at sternum height with feet shoulder-width and handle held at the chest.",
      "movementInstruction": "Press the handle straight forward, pause while resisting rotation, and return it to the chest without shifting the hips.",
      "equipment": "Cable station",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-side-plank-hip-dips-with-rotation": {
      "canonicalMovementId": "biweekly-side-plank-hip-dips-with-rotation",
      "name": "Side Plank Hip Dips with Rotation",
      "startInstruction": "Set the lower elbow under the shoulder in a side plank with feet stacked or staggered and the top arm reaching upward.",
      "movementInstruction": "Lower the hip a few centimetres, lift back to a straight line, then rotate the top arm under the ribs without collapsing the shoulder.",
      "equipment": "Bodyweight / floor",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-standing-stomach-vacuum": {
      "canonicalMovementId": "periodized-standing-stomach-vacuum",
      "name": "Standing Stomach Vacuum",
      "startInstruction": "Stand tall with feet hip-width and hands resting lightly on the thighs.",
      "movementInstruction": "Exhale and draw the lower abdomen inward while keeping the ribs and pelvis stacked; release while breathing normally.",
      "equipment": "Bodyweight / floor",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "vacuum",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-seated-stomach-vacuum": {
      "canonicalMovementId": "periodized-seated-stomach-vacuum",
      "name": "Seated Stomach Vacuum",
      "startInstruction": "Sit tall with feet grounded, hands on thighs and spine neutral.",
      "movementInstruction": "Exhale and draw the lower abdomen inward without rounding the back; release gradually while breathing normally.",
      "equipment": "Bodyweight / floor",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "vacuum",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-quadruped-vacuum": {
      "canonicalMovementId": "periodized-quadruped-vacuum",
      "name": "Quadruped Vacuum",
      "startInstruction": "Start on hands and knees with a neutral spine, hands under shoulders and knees under hips.",
      "movementInstruction": "Exhale and gently draw the abdomen upward and inward while keeping the spine still; release gradually.",
      "equipment": "Bodyweight / floor",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "vacuum",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-plank-vacuum": {
      "canonicalMovementId": "periodized-plank-vacuum",
      "name": "Plank Vacuum",
      "startInstruction": "Set a forearm plank with elbows under shoulders, legs straight and body in one line.",
      "movementInstruction": "Exhale and draw the lower abdomen inward while maintaining the plank; release without sagging the hips.",
      "equipment": "Bodyweight / floor",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "vacuum",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-lying-vacuum": {
      "canonicalMovementId": "periodized-lying-vacuum",
      "name": "Lying Vacuum",
      "startInstruction": "Lie supine with knees bent, feet on the mat, arms relaxed and lower back neutral.",
      "movementInstruction": "Exhale gently, draw the lower abdomen inward without lifting the ribs or pelvis, and hold the brace before releasing slowly.",
      "equipment": "Bodyweight / floor",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "vacuum",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-decline-bench-weighted-crunch": {
      "canonicalMovementId": "biweekly-decline-bench-weighted-crunch",
      "name": "Decline Bench Weighted Crunch",
      "startInstruction": "Secure the ankles on a decline bench, hold a light plate at the chest, and lie back with the pelvis neutral.",
      "movementInstruction": "Curl the ribs toward the pelvis while keeping the plate against the chest; pause, then lower the spine to the bench slowly.",
      "equipment": "Decline bench and weight plate",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-overhead-side-stretch": {
      "canonicalMovementId": "biweekly-stick-overhead-side-stretch",
      "name": "Stick Overhead Side Stretch",
      "startInstruction": "Stand tall holding a light stick overhead with hands wider than shoulders and feet grounded.",
      "movementInstruction": "Reach upward and lean gently to one side without rotating the chest; return upright before switching sides.",
      "equipment": "Light stick or empty-hand range",
      "source": ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-seated-hip-adductor-machine": {
      "canonicalMovementId": "biweekly-seated-hip-adductor-machine",
      "name": "Seated Hip Adductor Machine",
      "startInstruction": "Sit in the machine with pads inside the knees. Set a wide starting position.",
      "movementInstruction": "Squeeze thighs together against the resistance until pads touch. Control the return to the start.",
      "equipment": "Seated hip-adductor machine",
      "source": ".codex/v541/artwork-v3/CANONICAL-MOVEMENTS.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-seated-hip-abductor-machine": {
      "canonicalMovementId": "biweekly-seated-hip-abductor-machine",
      "name": "Seated Hip Abductor Machine",
      "startInstruction": "Sit in the machine with pads on the outside of the knees. Set a narrow starting position.",
      "movementInstruction": "Push knees outward against the resistance as far as possible. Squeeze the outer glutes.",
      "equipment": "Seated hip-abductor machine",
      "source": ".codex/v541/artwork-v3/CANONICAL-MOVEMENTS.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-dumbbell-romanian-deadlift-rdl": {
      "canonicalMovementId": "biweekly-dumbbell-romanian-deadlift-rdl",
      "name": "Dumbbell Romanian Deadlift (RDL)",
      "startInstruction": "Stand with feet hip-width apart holding dumbbells. Keep a slight bend in the knees.",
      "movementInstruction": "Hinge at the hips, pushing them back while lowering dumbbells along the legs until a stretch is felt in hamstrings.",
      "equipment": "Pair of dumbbells",
      "source": ".codex/v541/artwork-v3/CANONICAL-MOVEMENTS.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-45-incline-leg-press-mid-stance": {
      "canonicalMovementId": "biweekly-45-incline-leg-press-mid-stance",
      "name": "45° Incline Leg Press (Mid-Stance)",
      "startInstruction": "Sit in the machine, place feet shoulder-width apart on the sled. Unrack the safety handles.",
      "movementInstruction": "Lower the sled until knees are at 90 degrees. Press the weight back up, stopping just short of lockout.",
      "equipment": "45° leg press machine",
      "source": ".codex/v541/artwork-v3/CANONICAL-MOVEMENTS.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-lying-leg-curl-machine": {
      "canonicalMovementId": "biweekly-lying-leg-curl-machine",
      "name": "Lying Leg Curl Machine",
      "startInstruction": "Lie face down on the machine. Align knees with the pivot point. Place ankles under the pad.",
      "movementInstruction": "Curl the pad up towards the glutes by flexing the knees. Squeeze hamstrings at the top.",
      "equipment": "Prone lying leg curl machine",
      "source": ".codex/v541/artwork-v3/CANONICAL-MOVEMENTS.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-dumbbell-walking-lunges": {
      "canonicalMovementId": "biweekly-dumbbell-walking-lunges",
      "name": "Dumbbell Walking Lunges",
      "startInstruction": "Stand holding dumbbells at your sides. Step forward with one leg.",
      "movementInstruction": "Lower hips until both knees are bent at a 90-degree angle. Push off the front foot to bring the back foot forward.",
      "equipment": "Dumbbells and bench where shown",
      "source": ".codex/v541/artwork-v3/CANONICAL-MOVEMENTS.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-seated-dumbbell-overhead-shoulder-press": {
      "canonicalMovementId": "biweekly-seated-dumbbell-overhead-shoulder-press",
      "name": "Seated Dumbbell Overhead Shoulder Press",
      "startInstruction": "Sit supported with dumbbells at ear level and forearms vertical.",
      "movementInstruction": "Drive the weights up and slightly in until arms are straight without shrugging.",
      "equipment": "Dumbbells and bench where shown",
      "source": "data/periodized-abc.js",
      "safetyCue": "Use a range that keeps the shoulder smooth; stop if pressing causes a sharp pinch or numbness.",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-close-grip-v-bar-lat-pulldown": {
      "canonicalMovementId": "biweekly-close-grip-v-bar-lat-pulldown",
      "name": "Close-Grip V-Bar Lat Pulldown",
      "startInstruction": "Sit with thighs secured, arms long, and a neutral V-bar grip.",
      "movementInstruction": "Pull the handle to the upper chest with elbows travelling down.",
      "equipment": "Cable station with the exercise-specific attachment",
      "source": "data/periodized-abc.js",
      "safetyCue": "Keep the bar in front of the face and reduce load if the shoulder loses control overhead.",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-seated-wide-grip-cable-row": {
      "canonicalMovementId": "biweekly-seated-wide-grip-cable-row",
      "name": "Seated Wide-Grip Cable Row",
      "startInstruction": "Sit tall with knees soft, arms extended, and a wide overhand handle.",
      "movementInstruction": "Pull toward the lower ribs with elbows travelling out and back.",
      "equipment": "seated cable row with wide bar",
      "source": "data/periodized-abc.js",
      "safetyCue": "Stop the pull before the shoulders round or the low back flexes.",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-cable-fly": {
      "canonicalMovementId": "periodized-cable-fly",
      "name": "Cable Fly",
      "startInstruction": "Stand staggered between mid-height pulleys with soft elbows and a tall chest.",
      "movementInstruction": "Arc the handles forward until the chest contracts, keeping the elbows in the same soft bend.",
      "equipment": "dual adjustable cable station",
      "source": "data/periodized-abc.js",
      "safetyCue": "Set the pulleys around mid-chest and stop the stretch before the shoulder feels pulled forward.",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-incline-dumbbell-curl": {
      "canonicalMovementId": "biweekly-incline-dumbbell-curl",
      "name": "Incline Dumbbell Curl",
      "startInstruction": "Lie on a low incline with arms hanging and palms forward.",
      "movementInstruction": "Curl until the forearm meets the upper arm without moving the shoulder.",
      "equipment": "incline bench and dumbbells",
      "source": "data/periodized-abc.js",
      "safetyCue": "Use a lighter dumbbell if the front of the elbow feels strained; never force the last degrees of extension.",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-incline-dumbbell-reverse-fly": {
      "canonicalMovementId": "periodized-incline-dumbbell-reverse-fly",
      "name": "Incline Dumbbell Reverse Fly",
      "startInstruction": "Lie chest-down on a low incline with dumbbells hanging and palms facing.",
      "movementInstruction": "Sweep the arms out until they are level with the torso, keeping the neck relaxed.",
      "equipment": "Dumbbells and bench where shown",
      "source": "data/periodized-abc.js",
      "safetyCue": "Use very light loads and shorten the arc if the shoulder front pinches.",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-standing-barbell-overhead-press": {
      "canonicalMovementId": "periodized-standing-barbell-overhead-press",
      "name": "Standing Barbell Overhead Press",
      "startInstruction": "Stand with the bar at the upper chest, elbows slightly forward, feet even.",
      "movementInstruction": "Press vertically as the head moves through, finishing with ribs stacked under the bar.",
      "equipment": "barbell and rack",
      "source": "data/periodized-abc.js",
      "safetyCue": "Use safeties and a load you can lower to the chest without losing balance; stop for shoulder or back pain.",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-incline-prone-db-reverse-fly": {
      "canonicalMovementId": "periodized-incline-prone-db-reverse-fly",
      "name": "Incline Prone DB Reverse Fly",
      "startInstruction": "Set the incline bench low and let the dumbbells hang beneath the shoulders.",
      "movementInstruction": "Raise the arms wide to torso height with the chest supported.",
      "equipment": "incline bench and dumbbells",
      "source": "data/periodized-abc.js",
      "safetyCue": "Choose a load that keeps the shoulder smooth; stop for sharp pain or tingling.",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-dislocates": {
      "canonicalMovementId": "biweekly-stick-dislocates",
      "name": "Stick Dislocates",
      "startInstruction": "Stand with a very wide overhand grip and the stick at thigh height.",
      "movementInstruction": "Arc the stick overhead to a comfortable position behind the hips.",
      "equipment": "Light mobility stick",
      "source": "data/periodized-abc.js",
      "safetyCue": "Widen the grip and stop before pain; never force the stick behind the body.",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-lat-stretch": {
      "canonicalMovementId": "biweekly-stick-lat-stretch",
      "name": "Stick Lat Stretch",
      "startInstruction": "Stand tall with both hands on the stick overhead.",
      "movementInstruction": "Shift the hips slightly and lean away until the lat lengthens.",
      "equipment": "light mobility stick",
      "source": "data/periodized-abc.js",
      "safetyCue": "Keep the stretch mild and stop for shoulder, rib, or low-back pain.",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-stick-doorway-chest-stretch": {
      "canonicalMovementId": "biweekly-stick-doorway-chest-stretch",
      "name": "Stick Doorway Chest Stretch",
      "startInstruction": "Stand beside the doorway with forearm supported and elbow near shoulder height.",
      "movementInstruction": "Turn the chest a few degrees away until the pec lengthens.",
      "equipment": "light mobility stick and doorway",
      "source": "data/periodized-abc.js",
      "safetyCue": "Stay below a pinching sensation and stop for numbness or sharp pain.",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "biweekly-cross-body-stretch": {
      "canonicalMovementId": "biweekly-cross-body-stretch",
      "name": "Cross-Body Stretch",
      "startInstruction": "Stand tall with one arm relaxed across the chest.",
      "movementInstruction": "Use the opposite forearm to draw it closer without lifting the shoulder.",
      "equipment": "exercise mat",
      "source": "data/periodized-abc.js",
      "safetyCue": "Use light pressure and stop for front-shoulder pain, tingling, or numbness.",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-stick-standing-trunk-rotation": {
      "canonicalMovementId": "periodized-stick-standing-trunk-rotation",
      "name": "Stick Standing Trunk Rotation",
      "startInstruction": "stick across upper back; feet shoulder-width; torso upright.",
      "movementInstruction": "rotate torso from neutral while hips and feet stay stable.",
      "equipment": "straight mobility stick across upper back, wide overhand grip",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-standing-cable-woodchopper-low-to-high": {
      "canonicalMovementId": "periodized-standing-cable-woodchopper-low-to-high",
      "name": "Standing Cable Woodchopper, Low-to-High",
      "startInstruction": "split stance, handle near outside hip.",
      "movementInstruction": "sweep handle diagonally upward across the body without turning the hips.",
      "equipment": "low cable with D-handle",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-floor-reverse-crunch-with-pelvic-tilt": {
      "canonicalMovementId": "periodized-floor-reverse-crunch-with-pelvic-tilt",
      "name": "Floor Reverse Crunch with Pelvic Tilt",
      "startInstruction": "supine, knees bent, arms beside body.",
      "movementInstruction": "curl pelvis upward using abdominal control; do not swing the legs.",
      "equipment": "exercise mat, bodyweight",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-stick-overhead-lateral-side-bend": {
      "canonicalMovementId": "periodized-stick-overhead-lateral-side-bend",
      "name": "Stick Overhead Lateral Side Bend",
      "startInstruction": "feet planted, elbows extended, ribs stacked.",
      "movementInstruction": "lean trunk laterally through a comfortable range without rotating.",
      "equipment": "straight mobility stick overhead",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-standard-forearm-plank": {
      "canonicalMovementId": "periodized-standard-forearm-plank",
      "name": "Standard Forearm Plank",
      "startInstruction": "elbows under shoulders, straight body line.",
      "movementInstruction": "hold neutral alignment with ribs down and glutes lightly braced.",
      "equipment": "exercise mat, bodyweight",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight-hold",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-rkc-hardstyle-plank": {
      "canonicalMovementId": "periodized-rkc-hardstyle-plank",
      "name": "RKC Hardstyle Plank",
      "startInstruction": "forearms down, toes tucked, shoulders over elbows.",
      "movementInstruction": "actively squeeze glutes and pull elbows toward toes without moving them.",
      "equipment": "exercise mat, bodyweight",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight-hold",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-extended-plank": {
      "canonicalMovementId": "periodized-extended-plank",
      "name": "Extended Plank",
      "startInstruction": "hands forward of shoulders, legs extended.",
      "movementInstruction": "maintain a long body line while resisting lower-back extension.",
      "equipment": "exercise mat, bodyweight",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight-hold",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-dragon-flag-negatives": {
      "canonicalMovementId": "periodized-dragon-flag-negatives",
      "name": "Dragon Flag Negatives",
      "startInstruction": "shoulders supported, body straight, legs together.",
      "movementInstruction": "lower the rigid body slowly toward the bench while keeping hips extended.",
      "equipment": "flat bench with hands gripping behind head",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-decline-leg-raise": {
      "canonicalMovementId": "periodized-decline-leg-raise",
      "name": "Decline Bench Leg Raise",
      "startInstruction": "supine on decline bench, legs straight.",
      "movementInstruction": "raise legs by posteriorly tilting the pelvis, then control the descent.",
      "equipment": "decline bench, hands holding bench supports",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-cat-cow-mobility": {
      "canonicalMovementId": "periodized-cat-cow-mobility",
      "name": "Cat-Cow Mobility",
      "startInstruction": "quadruped hands under shoulders, knees under hips.",
      "movementInstruction": "alternate gentle spinal flexion and extension within a pain-free range.",
      "equipment": "exercise mat, bodyweight",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-childs-pose": {
      "canonicalMovementId": "periodized-childs-pose",
      "name": "Child’s Pose",
      "startInstruction": "hips toward heels, arms reaching forward.",
      "movementInstruction": "breathe into a comfortable back and hip stretch without forcing range.",
      "equipment": "exercise mat, bodyweight",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-landmine-rotations": {
      "canonicalMovementId": "periodized-landmine-rotations",
      "name": "Landmine Rotations",
      "startInstruction": "both hands on bar end, feet shoulder-width.",
      "movementInstruction": "guide the bar in an arc from one hip toward the opposite shoulder.",
      "equipment": "barbell anchored in a landmine sleeve",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-dead-bug": {
      "canonicalMovementId": "periodized-dead-bug",
      "name": "Dead Bug",
      "startInstruction": "supine, hips and knees at 90 degrees, arms vertical.",
      "movementInstruction": "extend opposite arm and leg while keeping ribs and lower back controlled.",
      "equipment": "exercise mat, bodyweight",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-bicycle-kicks": {
      "canonicalMovementId": "periodized-bicycle-kicks",
      "name": "Bicycle Kicks",
      "startInstruction": "supine, hands lightly behind head, knees bent.",
      "movementInstruction": "alternate opposite elbow toward knee without pulling the neck.",
      "equipment": "exercise mat, bodyweight",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-decline-bench-russian-twists": {
      "canonicalMovementId": "periodized-decline-bench-russian-twists",
      "name": "Decline Bench Russian Twists",
      "startInstruction": "seated on decline bench, hands together, feet anchored.",
      "movementInstruction": "rotate ribcage side to side while keeping the pelvis controlled.",
      "equipment": "decline bench, bodyweight",
      "source": ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-glute-bridge": {
      "canonicalMovementId": "periodized-glute-bridge",
      "name": "Bodyweight Glute Bridge",
      "startInstruction": "Floor, supine, knees bent and feet hip-width, arms by sides.",
      "movementInstruction": "Drive through the heels to lift the pelvis until hips are extended without arching the ribs.",
      "equipment": "Bodyweight on exercise mat",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-dumbbell-glute-bridge": {
      "canonicalMovementId": "periodized-dumbbell-glute-bridge",
      "name": "Dumbbell Glute Bridge",
      "startInstruction": "Supine with the dumbbell secured across the hip crease, knees bent and feet planted.",
      "movementInstruction": "Press the floor away and raise the pelvis to a level bridge while keeping the dumbbell stable.",
      "equipment": "One dumbbell held across the pelvis with a pad",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-single-leg-hip-thrust": {
      "canonicalMovementId": "periodized-single-leg-hip-thrust",
      "name": "Single-Leg Hip Thrust",
      "startInstruction": "Upper back supported on a bench, one foot planted, opposite knee held above the hip.",
      "movementInstruction": "Extend the planted hip until the shoulders, pelvis and knee align, then lower under control.",
      "equipment": "Flat bench and bodyweight",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-machine-hip-thrust": {
      "canonicalMovementId": "periodized-machine-hip-thrust",
      "name": "Machine Hip Thrust",
      "startInstruction": "Sit into the machine with the pad across the pelvis, feet planted and back supported.",
      "movementInstruction": "Drive the platform or pad through hip extension until the torso and thighs align, then return slowly.",
      "equipment": "Hip-thrust machine with padded belt",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-kas-glute-bridge": {
      "canonicalMovementId": "periodized-kas-glute-bridge",
      "name": "Kas Glute Bridge",
      "startInstruction": "Upper back supported on a bench, hips slightly below lockout, feet planted and knees bent.",
      "movementInstruction": "Perform a short-range hip extension to a strong glute squeeze, then lower only to the starting tension.",
      "equipment": "Flat bench and padded dumbbell across pelvis",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-side-plank-clamshell": {
      "canonicalMovementId": "periodized-side-plank-clamshell",
      "name": "Side-Plank Clamshell",
      "startInstruction": "Side plank from the forearm with knees bent and stacked, hips lifted and feet together.",
      "movementInstruction": "Keep the feet touching while opening the top knee without rolling the pelvis backward.",
      "equipment": "Exercise mat; no band",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-single-arm-dumbbell-row": {
      "canonicalMovementId": "periodized-single-arm-dumbbell-row",
      "name": "Single-Arm Dumbbell Row",
      "startInstruction": "One hand and knee support the bench, spine neutral, dumbbell hanging below the shoulder.",
      "movementInstruction": "Pull the dumbbell toward the hip while keeping the shoulder away from the ear, then lower fully.",
      "equipment": "Dumbbell and flat bench",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-dumbbell-stiff-leg-romanian-deadlift": {
      "canonicalMovementId": "periodized-dumbbell-stiff-leg-romanian-deadlift",
      "name": "Dumbbell Stiff-Leg Romanian Deadlift",
      "startInstruction": "Stand tall with dumbbells by the thighs, knees softly unlocked and feet hip-width.",
      "movementInstruction": "Hinge from the hips with minimal knee bend until the hamstrings load, then extend the hips to stand.",
      "equipment": "Pair of dumbbells",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-single-leg-dumbbell-rdl": {
      "canonicalMovementId": "periodized-single-leg-dumbbell-rdl",
      "name": "Single-Leg Dumbbell RDL",
      "startInstruction": "Stand on one leg with the dumbbell in the opposite hand, pelvis square and knee softly unlocked.",
      "movementInstruction": "Hinge while the free leg reaches backward, then drive the standing heel into the floor to return.",
      "equipment": "One dumbbell",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-nordic-curl-negatives": {
      "canonicalMovementId": "periodized-nordic-curl-negatives",
      "name": "Nordic Curl Negatives",
      "startInstruction": "Kneel upright with ankles secured, hips extended and hands ready to catch the descent.",
      "movementInstruction": "Keep the body straight and lower forward slowly from the knees, catching with the hands before returning.",
      "equipment": "Kneeling pad and ankle anchor",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-nordic-hamstring-curl": {
      "canonicalMovementId": "periodized-nordic-hamstring-curl",
      "name": "Nordic Hamstring Curl",
      "startInstruction": "Kneel upright with ankles secured and hips extended, hands off the floor if control allows.",
      "movementInstruction": "Lower under control and use the hamstrings to assist the return toward upright.",
      "equipment": "Kneeling pad and ankle anchor",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-conventional-barbell-deadlift": {
      "canonicalMovementId": "periodized-conventional-barbell-deadlift",
      "name": "Conventional Barbell Deadlift",
      "startInstruction": "Feet hip-width, bar over mid-foot, hands just outside the knees and spine neutral.",
      "movementInstruction": "Push the floor away and extend knees and hips until standing tall, then lower by hinging first.",
      "equipment": "Barbell with plates on the floor",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-dumbbell-shrug": {
      "canonicalMovementId": "periodized-dumbbell-shrug",
      "name": "Dumbbell Shrug",
      "startInstruction": "Stand tall with dumbbells at the sides, arms straight and shoulders relaxed.",
      "movementInstruction": "Elevate the shoulders straight toward the ears, pause briefly, then lower without rolling.",
      "equipment": "Pair of dumbbells",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-barbell-shrug": {
      "canonicalMovementId": "periodized-barbell-shrug",
      "name": "Barbell Shrug",
      "startInstruction": "Stand with the bar in front of the thighs, hands just outside the legs and elbows straight.",
      "movementInstruction": "Shrug the shoulders vertically, pause, and lower the bar without bending the elbows.",
      "equipment": "Barbell with manageable load",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-hex-bar-shrug": {
      "canonicalMovementId": "periodized-hex-bar-shrug",
      "name": "Hex-Bar Shrug",
      "startInstruction": "Stand centered inside the hex bar with handles held at the sides and knees softly unlocked.",
      "movementInstruction": "Elevate both shoulders vertically, pause, and lower while keeping the frame level.",
      "equipment": "Loaded hex bar",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-cable-upright-row-wide-grip": {
      "canonicalMovementId": "periodized-cable-upright-row-wide-grip",
      "name": "Wide-Grip Cable Upright Row",
      "startInstruction": "Stand facing the low pulley with a wide overhand grip and bar at the thighs.",
      "movementInstruction": "Pull the bar upward to the lower chest while elbows lead slightly higher than the hands, then lower.",
      "equipment": "Low cable station with straight bar",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-standard-cable-face-pull": {
      "canonicalMovementId": "periodized-standard-cable-face-pull",
      "name": "Standard Cable Face Pull",
      "startInstruction": "Stand facing the pulley with a neutral rope grip, arms extended and ribs stacked.",
      "movementInstruction": "Pull the rope toward the upper face while elbows move outward, stopping before the shoulders pinch.",
      "equipment": "Cable station with rope at upper-chest height",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "stack",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-stick-deep-squat-pry": {
      "canonicalMovementId": "periodized-stick-deep-squat-pry",
      "name": "Supported Stick Deep Squat Pry",
      "startInstruction": "Hold the stick vertically for support, feet slightly wider than hips and torso tall.",
      "movementInstruction": "Sink into a comfortable squat and gently shift the knees side to side without collapsing the arches.",
      "equipment": "Light mobility stick used as a balance aid",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-stick-hamstring-stretch": {
      "canonicalMovementId": "periodized-stick-hamstring-stretch",
      "name": "Stick Hamstring Stretch",
      "startInstruction": "Stand with one heel lightly forward, toes up, stick vertical for balance and spine long.",
      "movementInstruction": "Hinge toward the extended leg until a mild hamstring stretch is felt, then return upright.",
      "equipment": "Light mobility stick used for balance",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-pigeon-pose": {
      "canonicalMovementId": "periodized-pigeon-pose",
      "name": "Pigeon Pose",
      "startInstruction": "Set one shin forward on the mat, rear leg extended behind and pelvis supported as needed.",
      "movementInstruction": "Lower the torso only as far as the front hip remains comfortable, then return upright.",
      "equipment": "Exercise mat",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-supine-figure-four-stretch": {
      "canonicalMovementId": "periodized-supine-figure-four-stretch",
      "name": "Supine Figure-Four Stretch",
      "startInstruction": "Lie on your back with one ankle crossed over the opposite thigh and both feet relaxed.",
      "movementInstruction": "Draw the supporting thigh toward the chest until the crossed-hip stretch is mild, then release slowly.",
      "equipment": "Exercise mat",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "mobility",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-bodyweight-air-squat": {
      "canonicalMovementId": "periodized-bodyweight-air-squat",
      "name": "Bodyweight Air Squat",
      "startInstruction": "Stand with feet about shoulder-width, toes slightly out and arms forward for balance.",
      "movementInstruction": "Bend the knees and hips to a comfortable depth, then stand by pressing through the whole foot.",
      "equipment": "Bodyweight on open floor",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-bodyweight-walking-lunge": {
      "canonicalMovementId": "periodized-bodyweight-walking-lunge",
      "name": "Bodyweight Walking Lunge",
      "startInstruction": "Stand tall with feet hip-width and hands free for balance.",
      "movementInstruction": "Step forward, lower the rear knee toward the floor, then push through the front foot to continue walking.",
      "equipment": "Bodyweight on open floor",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-bulgarian-split-squat-1-5-rep": {
      "canonicalMovementId": "periodized-bulgarian-split-squat-1-5-rep",
      "name": "Bulgarian Split Squat with 1.5-Rep Technique",
      "startInstruction": "Rear foot rests on a bench, front foot stable and torso slightly inclined.",
      "movementInstruction": "Lower to the bottom, rise halfway, lower again, then stand tall; that sequence counts as one rep.",
      "equipment": "Flat bench and optional dumbbells",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "weighted",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-jump-squat": {
      "canonicalMovementId": "periodized-jump-squat",
      "name": "Jump Squat",
      "startInstruction": "Stand with feet shoulder-width and arms relaxed, landing area clear.",
      "movementInstruction": "Descend to a partial squat, jump vertically, and land softly with knees tracking over toes.",
      "equipment": "Bodyweight on clear floor",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    },
    "periodized-hollow-body-hold": {
      "canonicalMovementId": "periodized-hollow-body-hold",
      "name": "Hollow Body Hold",
      "startInstruction": "Lie supine with arms overhead and legs extended, lower back gently contacting the mat.",
      "movementInstruction": "Brace the abdomen and lift shoulders and heels slightly while maintaining the hollow shape.",
      "equipment": "Exercise mat",
      "source": ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json",
      "progressionType": "bodyweight-hold",
      "contentReviewStatus": "source-backed-ai-reviewed",
      "humanCoachReviewStatus": "pending"
    }
  },
  "byPair": {
    "assets/exercises/periodized-v3/biweekly-chest-supported-incline-dumbbell-row-v3-start.webp|assets/exercises/periodized-v3/biweekly-chest-supported-incline-dumbbell-row-v3-movement.webp": "biweekly-chest-supported-incline-dumbbell-row",
    "assets/exercises/periodized-v3/biweekly-flat-dumbbell-bench-press-v3-start.webp|assets/exercises/periodized-v3/biweekly-flat-dumbbell-bench-press-v3-movement.webp": "biweekly-flat-dumbbell-bench-press",
    "assets/exercises/periodized-v3/biweekly-hanging-straight-leg-raise-v3-start.webp|assets/exercises/periodized-v3/biweekly-hanging-straight-leg-raise-v3-movement.webp": "biweekly-hanging-straight-leg-raise",
    "assets/exercises/periodized-v3/biweekly-incline-dumbbell-bench-press-30-v3-start.webp|assets/exercises/periodized-v3/biweekly-incline-dumbbell-bench-press-30-v3-movement.webp": "biweekly-incline-dumbbell-bench-press-30",
    "assets/exercises/periodized-v3/biweekly-incline-dumbbell-hex-press-v3-start.webp|assets/exercises/periodized-v3/biweekly-incline-dumbbell-hex-press-v3-movement.webp": "biweekly-incline-dumbbell-hex-press",
    "assets/exercises/periodized-v3/biweekly-neutral-grip-mag-grip-lat-pulldown-v3-start.webp|assets/exercises/periodized-v3/biweekly-neutral-grip-mag-grip-lat-pulldown-v3-movement.webp": "biweekly-neutral-grip-mag-grip-lat-pulldown",
    "assets/exercises/periodized-v3/biweekly-single-arm-iliac-cable-lat-pulldown-v3-start.webp|assets/exercises/periodized-v3/biweekly-single-arm-iliac-cable-lat-pulldown-v3-movement.webp": "biweekly-single-arm-iliac-cable-lat-pulldown",
    "assets/exercises/periodized-v3/biweekly-straight-arm-cable-pulldown-v3-start.webp|assets/exercises/periodized-v3/biweekly-straight-arm-cable-pulldown-v3-movement.webp": "biweekly-straight-arm-cable-pulldown",
    "assets/exercises/periodized-v3/biweekly-wide-grip-lat-pulldown-v3-start.webp|assets/exercises/periodized-v3/biweekly-wide-grip-lat-pulldown-v3-movement.webp": "biweekly-wide-grip-lat-pulldown",
    "assets/exercises/periodized-v3/biweekly-stick-around-the-worlds-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-around-the-worlds-v3-movement.webp": "biweekly-stick-around-the-worlds",
    "assets/exercises/periodized-v3/biweekly-stick-behind-the-back-chest-opener-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-behind-the-back-chest-opener-v3-movement.webp": "biweekly-stick-behind-the-back-chest-opener",
    "assets/exercises/periodized-v3/biweekly-stick-behind-the-back-opener-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-behind-the-back-opener-v3-movement.webp": "biweekly-stick-behind-the-back-opener",
    "assets/exercises/periodized-v3/biweekly-stick-overhead-thoracic-extensions-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-overhead-thoracic-extensions-v3-movement.webp": "biweekly-stick-overhead-thoracic-extensions",
    "assets/exercises/periodized-v3/biweekly-stick-overhead-thoracic-spine-extensions-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-overhead-thoracic-spine-extensions-v3-movement.webp": "biweekly-stick-overhead-thoracic-spine-extensions",
    "assets/exercises/periodized-v3/biweekly-stick-shoulder-dislocates-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-shoulder-dislocates-v3-movement.webp": "biweekly-stick-shoulder-dislocates",
    "assets/exercises/periodized-v3/biweekly-cable-face-pull-with-external-rotation-v3-start.webp|assets/exercises/periodized-v3/biweekly-cable-face-pull-with-external-rotation-v3-movement.webp": "biweekly-cable-face-pull-with-external-rotation",
    "assets/exercises/periodized-v3/periodized-chest-supported-db-row-v3-start.webp|assets/exercises/periodized-v3/periodized-chest-supported-db-row-v3-movement.webp": "periodized-chest-supported-db-row",
    "assets/exercises/periodized-v3/periodized-flat-dumbbell-bench-v3-start.webp|assets/exercises/periodized-v3/periodized-flat-dumbbell-bench-v3-movement.webp": "periodized-flat-dumbbell-bench",
    "assets/exercises/periodized-v3/periodized-incline-barbell-bench-v3-start.webp|assets/exercises/periodized-v3/periodized-incline-barbell-bench-v3-movement.webp": "periodized-incline-barbell-bench",
    "assets/exercises/periodized-v3/periodized-incline-reverse-crunch-v3-start.webp|assets/exercises/periodized-v3/periodized-incline-reverse-crunch-v3-movement.webp": "periodized-incline-reverse-crunch",
    "assets/exercises/periodized-v3/periodized-incline-smith-machine-press-v3-start.webp|assets/exercises/periodized-v3/periodized-incline-smith-machine-press-v3-movement.webp": "periodized-incline-smith-machine-press",
    "assets/exercises/periodized-v3/periodized-seated-cable-row-v3-start.webp|assets/exercises/periodized-v3/periodized-seated-cable-row-v3-movement.webp": "periodized-seated-cable-row",
    "assets/exercises/periodized-v3/periodized-t-bar-row-v3-start.webp|assets/exercises/periodized-v3/periodized-t-bar-row-v3-movement.webp": "periodized-t-bar-row",
    "assets/exercises/periodized-v3/biweekly-stick-seated-russian-twists-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-seated-russian-twists-v3-movement.webp": "biweekly-stick-seated-russian-twists",
    "assets/exercises/periodized-v3/periodized-cable-russian-twist-v3-start.webp|assets/exercises/periodized-v3/periodized-cable-russian-twist-v3-movement.webp": "periodized-cable-russian-twist",
    "assets/exercises/periodized-v3/periodized-floor-bodyweight-twist-v3-start.webp|assets/exercises/periodized-v3/periodized-floor-bodyweight-twist-v3-movement.webp": "periodized-floor-bodyweight-twist",
    "assets/exercises/periodized-v3/periodized-medicine-ball-twists-v3-start.webp|assets/exercises/periodized-v3/periodized-medicine-ball-twists-v3-movement.webp": "periodized-medicine-ball-twists",
    "assets/exercises/periodized-v3/biweekly-lying-pelvic-tilt-leg-raise-v3-start.webp|assets/exercises/periodized-v3/biweekly-lying-pelvic-tilt-leg-raise-v3-movement.webp": "biweekly-lying-pelvic-tilt-leg-raise",
    "assets/exercises/periodized-v3/periodized-bench-reverse-crunch-v3-start.webp|assets/exercises/periodized-v3/periodized-bench-reverse-crunch-v3-movement.webp": "periodized-bench-reverse-crunch",
    "assets/exercises/periodized-v3/biweekly-cable-pallof-press-with-iso-hold-v3-start.webp|assets/exercises/periodized-v3/biweekly-cable-pallof-press-with-iso-hold-v3-movement.webp": "biweekly-cable-pallof-press-with-iso-hold",
    "assets/exercises/periodized-v3/periodized-side-plank-hold-v3-start.webp|assets/exercises/periodized-v3/periodized-side-plank-hold-v3-movement.webp": "periodized-side-plank-hold",
    "assets/exercises/periodized-v3/periodized-db-suitcase-carry-v3-start.webp|assets/exercises/periodized-v3/periodized-db-suitcase-carry-v3-movement.webp": "periodized-db-suitcase-carry",
    "assets/exercises/periodized-v3/biweekly-stick-standing-lateral-side-bends-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-standing-lateral-side-bends-v3-movement.webp": "biweekly-stick-standing-lateral-side-bends",
    "assets/exercises/periodized-v3/periodized-side-plank-hip-dips-v3-start.webp|assets/exercises/periodized-v3/periodized-side-plank-hip-dips-v3-movement.webp": "periodized-side-plank-hip-dips",
    "assets/exercises/periodized-v3/periodized-cable-side-crunch-v3-start.webp|assets/exercises/periodized-v3/periodized-cable-side-crunch-v3-movement.webp": "periodized-cable-side-crunch",
    "assets/exercises/periodized-v3/periodized-incline-bench-plank-vacuum-v3-start.webp|assets/exercises/periodized-v3/periodized-incline-bench-plank-vacuum-v3-movement.webp": "periodized-incline-bench-plank-vacuum",
    "assets/exercises/periodized-v3/periodized-cat-cow-vacuum-v3-start.webp|assets/exercises/periodized-v3/periodized-cat-cow-vacuum-v3-movement.webp": "periodized-cat-cow-vacuum",
    "assets/exercises/periodized-v3/biweekly-kneeling-cable-rope-crunch-v3-start.webp|assets/exercises/periodized-v3/biweekly-kneeling-cable-rope-crunch-v3-movement.webp": "biweekly-kneeling-cable-rope-crunch",
    "assets/exercises/periodized-v3/periodized-stability-ball-crunch-v3-start.webp|assets/exercises/periodized-v3/periodized-stability-ball-crunch-v3-movement.webp": "periodized-stability-ball-crunch",
    "assets/exercises/periodized-v3/periodized-floor-crunch-v3-start.webp|assets/exercises/periodized-v3/periodized-floor-crunch-v3-movement.webp": "periodized-floor-crunch",
    "assets/exercises/periodized-v3/biweekly-stick-standing-torso-twists-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-standing-torso-twists-v3-movement.webp": "biweekly-stick-standing-torso-twists",
    "assets/exercises/periodized-v3/periodized-elliptical-intervals-v3-start.webp|assets/exercises/periodized-v3/periodized-elliptical-intervals-v3-movement.webp": "periodized-elliptical-intervals",
    "assets/exercises/periodized-v3/periodized-bike-sprint-intervals-v3-start.webp|assets/exercises/periodized-v3/periodized-bike-sprint-intervals-v3-movement.webp": "periodized-bike-sprint-intervals",
    "assets/exercises/periodized-v3/biweekly-cobra-pose-v3-start.webp|assets/exercises/periodized-v3/biweekly-cobra-pose-v3-movement.webp": "biweekly-cobra-pose",
    "assets/exercises/periodized-v3/biweekly-standing-cable-woodchopper-high-to-low-v3-start.webp|assets/exercises/periodized-v3/biweekly-standing-cable-woodchopper-high-to-low-v3-movement.webp": "biweekly-standing-cable-woodchopper-high-to-low",
    "assets/exercises/periodized-v3/periodized-dumbbell-woodchopper-v3-start.webp|assets/exercises/periodized-v3/periodized-dumbbell-woodchopper-v3-movement.webp": "periodized-dumbbell-woodchopper",
    "assets/exercises/periodized-v3/periodized-hanging-knee-raise-v3-start.webp|assets/exercises/periodized-v3/periodized-hanging-knee-raise-v3-movement.webp": "periodized-hanging-knee-raise",
    "assets/exercises/periodized-v3/biweekly-half-kneeling-cable-pallof-press-with-overhead-raise-v3-start.webp|assets/exercises/periodized-v3/biweekly-half-kneeling-cable-pallof-press-with-overhead-raise-v3-movement.webp": "biweekly-half-kneeling-cable-pallof-press-with-overhead-raise",
    "assets/exercises/periodized-v3/periodized-standard-pallof-press-v3-start.webp|assets/exercises/periodized-v3/periodized-standard-pallof-press-v3-movement.webp": "periodized-standard-pallof-press",
    "assets/exercises/periodized-v3/biweekly-side-plank-hip-dips-with-rotation-v3-start.webp|assets/exercises/periodized-v3/biweekly-side-plank-hip-dips-with-rotation-v3-movement.webp": "biweekly-side-plank-hip-dips-with-rotation",
    "assets/exercises/periodized-v3/periodized-standing-stomach-vacuum-v3-start.webp|assets/exercises/periodized-v3/periodized-standing-stomach-vacuum-v3-movement.webp": "periodized-standing-stomach-vacuum",
    "assets/exercises/periodized-v3/periodized-seated-stomach-vacuum-v3-start.webp|assets/exercises/periodized-v3/periodized-seated-stomach-vacuum-v3-movement.webp": "periodized-seated-stomach-vacuum",
    "assets/exercises/periodized-v3/periodized-quadruped-vacuum-v3-start.webp|assets/exercises/periodized-v3/periodized-quadruped-vacuum-v3-movement.webp": "periodized-quadruped-vacuum",
    "assets/exercises/periodized-v3/periodized-plank-vacuum-v3-start.webp|assets/exercises/periodized-v3/periodized-plank-vacuum-v3-movement.webp": "periodized-plank-vacuum",
    "assets/exercises/periodized-v3/periodized-lying-vacuum-v3-start.webp|assets/exercises/periodized-v3/periodized-lying-vacuum-v3-movement.webp": "periodized-lying-vacuum",
    "assets/exercises/periodized-v3/biweekly-decline-bench-weighted-crunch-v3-start.webp|assets/exercises/periodized-v3/biweekly-decline-bench-weighted-crunch-v3-movement.webp": "biweekly-decline-bench-weighted-crunch",
    "assets/exercises/periodized-v3/biweekly-stick-overhead-side-stretch-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-overhead-side-stretch-v3-movement.webp": "biweekly-stick-overhead-side-stretch",
    "assets/exercises/periodized-v3/biweekly-seated-hip-adductor-machine-v3-start.webp|assets/exercises/periodized-v3/biweekly-seated-hip-adductor-machine-v3-movement.webp": "biweekly-seated-hip-adductor-machine",
    "assets/exercises/periodized-v3/biweekly-seated-hip-abductor-machine-v3-start.webp|assets/exercises/periodized-v3/biweekly-seated-hip-abductor-machine-v3-movement.webp": "biweekly-seated-hip-abductor-machine",
    "assets/exercises/periodized-v3/biweekly-dumbbell-romanian-deadlift-rdl-v3-start.webp|assets/exercises/periodized-v3/biweekly-dumbbell-romanian-deadlift-rdl-v3-movement.webp": "biweekly-dumbbell-romanian-deadlift-rdl",
    "assets/exercises/periodized-v3/biweekly-45-incline-leg-press-mid-stance-v3-start.webp|assets/exercises/periodized-v3/biweekly-45-incline-leg-press-mid-stance-v3-movement.webp": "biweekly-45-incline-leg-press-mid-stance",
    "assets/exercises/periodized-v3/biweekly-lying-leg-curl-machine-v3-start.webp|assets/exercises/periodized-v3/biweekly-lying-leg-curl-machine-v3-movement.webp": "biweekly-lying-leg-curl-machine",
    "assets/exercises/periodized-v3/biweekly-dumbbell-walking-lunges-v3-start.webp|assets/exercises/periodized-v3/biweekly-dumbbell-walking-lunges-v3-movement.webp": "biweekly-dumbbell-walking-lunges",
    "assets/exercises/periodized-v3/biweekly-seated-dumbbell-overhead-shoulder-press-v3-start.webp|assets/exercises/periodized-v3/biweekly-seated-dumbbell-overhead-shoulder-press-v3-movement.webp": "biweekly-seated-dumbbell-overhead-shoulder-press",
    "assets/exercises/periodized-v3/biweekly-close-grip-v-bar-lat-pulldown-v3-start.webp|assets/exercises/periodized-v3/biweekly-close-grip-v-bar-lat-pulldown-v3-movement.webp": "biweekly-close-grip-v-bar-lat-pulldown",
    "assets/exercises/periodized-v3/biweekly-seated-wide-grip-cable-row-v3-start.webp|assets/exercises/periodized-v3/biweekly-seated-wide-grip-cable-row-v3-movement.webp": "biweekly-seated-wide-grip-cable-row",
    "assets/exercises/periodized-v3/periodized-cable-fly-v3-start.webp|assets/exercises/periodized-v3/periodized-cable-fly-v3-movement.webp": "periodized-cable-fly",
    "assets/exercises/periodized-v3/biweekly-incline-dumbbell-curl-v3-start.webp|assets/exercises/periodized-v3/biweekly-incline-dumbbell-curl-v3-movement.webp": "biweekly-incline-dumbbell-curl",
    "assets/exercises/periodized-v3/periodized-incline-dumbbell-reverse-fly-v3-start.webp|assets/exercises/periodized-v3/periodized-incline-dumbbell-reverse-fly-v3-movement.webp": "periodized-incline-dumbbell-reverse-fly",
    "assets/exercises/periodized-v3/periodized-standing-barbell-overhead-press-v3-start.webp|assets/exercises/periodized-v3/periodized-standing-barbell-overhead-press-v3-movement.webp": "periodized-standing-barbell-overhead-press",
    "assets/exercises/periodized-v3/periodized-incline-prone-db-reverse-fly-v3-start.webp|assets/exercises/periodized-v3/periodized-incline-prone-db-reverse-fly-v3-movement.webp": "periodized-incline-prone-db-reverse-fly",
    "assets/exercises/periodized-v3/biweekly-stick-dislocates-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-dislocates-v3-movement.webp": "biweekly-stick-dislocates",
    "assets/exercises/periodized-v3/biweekly-stick-lat-stretch-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-lat-stretch-v3-movement.webp": "biweekly-stick-lat-stretch",
    "assets/exercises/periodized-v3/biweekly-stick-doorway-chest-stretch-v3-start.webp|assets/exercises/periodized-v3/biweekly-stick-doorway-chest-stretch-v3-movement.webp": "biweekly-stick-doorway-chest-stretch",
    "assets/exercises/periodized-v3/biweekly-cross-body-stretch-v3-start.webp|assets/exercises/periodized-v3/biweekly-cross-body-stretch-v3-movement.webp": "biweekly-cross-body-stretch",
    "assets/exercises/periodized-v3/periodized-stick-standing-trunk-rotation-v3-start.webp|assets/exercises/periodized-v3/periodized-stick-standing-trunk-rotation-v3-movement.webp": "periodized-stick-standing-trunk-rotation",
    "assets/exercises/periodized-v3/periodized-standing-cable-woodchopper-low-to-high-v3-start.webp|assets/exercises/periodized-v3/periodized-standing-cable-woodchopper-low-to-high-v3-movement.webp": "periodized-standing-cable-woodchopper-low-to-high",
    "assets/exercises/periodized-v3/periodized-floor-reverse-crunch-with-pelvic-tilt-v3-start.webp|assets/exercises/periodized-v3/periodized-floor-reverse-crunch-with-pelvic-tilt-v3-movement.webp": "periodized-floor-reverse-crunch-with-pelvic-tilt",
    "assets/exercises/periodized-v3/periodized-stick-overhead-lateral-side-bend-v3-start.webp|assets/exercises/periodized-v3/periodized-stick-overhead-lateral-side-bend-v3-movement.webp": "periodized-stick-overhead-lateral-side-bend",
    "assets/exercises/periodized-v3/periodized-standard-forearm-plank-v3-start.webp|assets/exercises/periodized-v3/periodized-standard-forearm-plank-v3-movement.webp": "periodized-standard-forearm-plank",
    "assets/exercises/periodized-v3/periodized-rkc-hardstyle-plank-v3-start.webp|assets/exercises/periodized-v3/periodized-rkc-hardstyle-plank-v3-movement.webp": "periodized-rkc-hardstyle-plank",
    "assets/exercises/periodized-v3/periodized-extended-plank-v3-start.webp|assets/exercises/periodized-v3/periodized-extended-plank-v3-movement.webp": "periodized-extended-plank",
    "assets/exercises/periodized-v3/periodized-dragon-flag-negatives-v3-start.webp|assets/exercises/periodized-v3/periodized-dragon-flag-negatives-v3-movement.webp": "periodized-dragon-flag-negatives",
    "assets/exercises/periodized-v3/periodized-decline-leg-raise-v3-start.webp|assets/exercises/periodized-v3/periodized-decline-leg-raise-v3-movement.webp": "periodized-decline-leg-raise",
    "assets/exercises/periodized-v3/periodized-cat-cow-mobility-v3-start.webp|assets/exercises/periodized-v3/periodized-cat-cow-mobility-v3-movement.webp": "periodized-cat-cow-mobility",
    "assets/exercises/periodized-v3/periodized-childs-pose-v3-start.webp|assets/exercises/periodized-v3/periodized-childs-pose-v3-movement.webp": "periodized-childs-pose",
    "assets/exercises/periodized-v3/periodized-landmine-rotations-v3-start.webp|assets/exercises/periodized-v3/periodized-landmine-rotations-v3-movement.webp": "periodized-landmine-rotations",
    "assets/exercises/periodized-v3/periodized-dead-bug-v3-start.webp|assets/exercises/periodized-v3/periodized-dead-bug-v3-movement.webp": "periodized-dead-bug",
    "assets/exercises/periodized-v3/periodized-bicycle-kicks-v3-start.webp|assets/exercises/periodized-v3/periodized-bicycle-kicks-v3-movement.webp": "periodized-bicycle-kicks",
    "assets/exercises/periodized-v3/periodized-decline-bench-russian-twists-v3-start.webp|assets/exercises/periodized-v3/periodized-decline-bench-russian-twists-v3-movement.webp": "periodized-decline-bench-russian-twists",
    "assets/exercises/periodized-v3/periodized-glute-bridge-v3-start.webp|assets/exercises/periodized-v3/periodized-glute-bridge-v3-movement.webp": "periodized-glute-bridge",
    "assets/exercises/periodized-v3/periodized-dumbbell-glute-bridge-v3-start.webp|assets/exercises/periodized-v3/periodized-dumbbell-glute-bridge-v3-movement.webp": "periodized-dumbbell-glute-bridge",
    "assets/exercises/periodized-v3/periodized-single-leg-hip-thrust-v3-start.webp|assets/exercises/periodized-v3/periodized-single-leg-hip-thrust-v3-movement.webp": "periodized-single-leg-hip-thrust",
    "assets/exercises/periodized-v3/periodized-machine-hip-thrust-v3-start.webp|assets/exercises/periodized-v3/periodized-machine-hip-thrust-v3-movement.webp": "periodized-machine-hip-thrust",
    "assets/exercises/periodized-v3/periodized-kas-glute-bridge-v3-start.webp|assets/exercises/periodized-v3/periodized-kas-glute-bridge-v3-movement.webp": "periodized-kas-glute-bridge",
    "assets/exercises/periodized-v3/periodized-side-plank-clamshell-v3-start.webp|assets/exercises/periodized-v3/periodized-side-plank-clamshell-v3-movement.webp": "periodized-side-plank-clamshell",
    "assets/exercises/periodized-v3/periodized-single-arm-dumbbell-row-v3-start.webp|assets/exercises/periodized-v3/periodized-single-arm-dumbbell-row-v3-movement.webp": "periodized-single-arm-dumbbell-row",
    "assets/exercises/periodized-v3/periodized-dumbbell-stiff-leg-romanian-deadlift-v3-start.webp|assets/exercises/periodized-v3/periodized-dumbbell-stiff-leg-romanian-deadlift-v3-movement.webp": "periodized-dumbbell-stiff-leg-romanian-deadlift",
    "assets/exercises/periodized-v3/periodized-single-leg-dumbbell-rdl-v3-start.webp|assets/exercises/periodized-v3/periodized-single-leg-dumbbell-rdl-v3-movement.webp": "periodized-single-leg-dumbbell-rdl",
    "assets/exercises/periodized-v3/periodized-nordic-curl-negatives-v3-start.webp|assets/exercises/periodized-v3/periodized-nordic-curl-negatives-v3-movement.webp": "periodized-nordic-curl-negatives",
    "assets/exercises/periodized-v3/periodized-nordic-hamstring-curl-v3-start.webp|assets/exercises/periodized-v3/periodized-nordic-hamstring-curl-v3-movement.webp": "periodized-nordic-hamstring-curl",
    "assets/exercises/periodized-v3/periodized-conventional-barbell-deadlift-v3-start.webp|assets/exercises/periodized-v3/periodized-conventional-barbell-deadlift-v3-movement.webp": "periodized-conventional-barbell-deadlift",
    "assets/exercises/periodized-v3/periodized-dumbbell-shrug-v3-start.webp|assets/exercises/periodized-v3/periodized-dumbbell-shrug-v3-movement.webp": "periodized-dumbbell-shrug",
    "assets/exercises/periodized-v3/periodized-barbell-shrug-v3-start.webp|assets/exercises/periodized-v3/periodized-barbell-shrug-v3-movement.webp": "periodized-barbell-shrug",
    "assets/exercises/periodized-v3/periodized-hex-bar-shrug-v3-start.webp|assets/exercises/periodized-v3/periodized-hex-bar-shrug-v3-movement.webp": "periodized-hex-bar-shrug",
    "assets/exercises/periodized-v3/periodized-cable-upright-row-wide-grip-v3-start.webp|assets/exercises/periodized-v3/periodized-cable-upright-row-wide-grip-v3-movement.webp": "periodized-cable-upright-row-wide-grip",
    "assets/exercises/periodized-v3/periodized-standard-cable-face-pull-v3-start.webp|assets/exercises/periodized-v3/periodized-standard-cable-face-pull-v3-movement.webp": "periodized-standard-cable-face-pull",
    "assets/exercises/periodized-v3/periodized-stick-deep-squat-pry-v3-start.webp|assets/exercises/periodized-v3/periodized-stick-deep-squat-pry-v3-movement.webp": "periodized-stick-deep-squat-pry",
    "assets/exercises/periodized-v3/periodized-stick-hamstring-stretch-v3-start.webp|assets/exercises/periodized-v3/periodized-stick-hamstring-stretch-v3-movement.webp": "periodized-stick-hamstring-stretch",
    "assets/exercises/periodized-v3/periodized-pigeon-pose-v3-start.webp|assets/exercises/periodized-v3/periodized-pigeon-pose-v3-movement.webp": "periodized-pigeon-pose",
    "assets/exercises/periodized-v3/periodized-supine-figure-four-stretch-v3-start.webp|assets/exercises/periodized-v3/periodized-supine-figure-four-stretch-v3-movement.webp": "periodized-supine-figure-four-stretch",
    "assets/exercises/periodized-v3/periodized-bodyweight-air-squat-v3-start.webp|assets/exercises/periodized-v3/periodized-bodyweight-air-squat-v3-movement.webp": "periodized-bodyweight-air-squat",
    "assets/exercises/periodized-v3/periodized-bodyweight-walking-lunge-v3-start.webp|assets/exercises/periodized-v3/periodized-bodyweight-walking-lunge-v3-movement.webp": "periodized-bodyweight-walking-lunge",
    "assets/exercises/periodized-v3/periodized-bulgarian-split-squat-1-5-rep-v3-start.webp|assets/exercises/periodized-v3/periodized-bulgarian-split-squat-1-5-rep-v3-movement.webp": "periodized-bulgarian-split-squat-1-5-rep",
    "assets/exercises/periodized-v3/periodized-jump-squat-v3-start.webp|assets/exercises/periodized-v3/periodized-jump-squat-v3-movement.webp": "periodized-jump-squat",
    "assets/exercises/periodized-v3/periodized-hollow-body-hold-v3-start.webp|assets/exercises/periodized-v3/periodized-hollow-body-hold-v3-movement.webp": "periodized-hollow-body-hold"
  },
  "unresolved": [
    {
      "id": "biweekly-incline-barbell-bench-press-30",
      "name": "Incline Barbell Bench Press (30°)",
      "reason": "Source permits 30–45 degrees although identity specifies 30 degrees"
    },
    {
      "id": "biweekly-seated-cable-row-to-sternum-neutral-grip",
      "name": "Seated Cable Row to Sternum (Neutral Grip)",
      "reason": "Source says lower abdomen although identity specifies sternum"
    },
    {
      "id": "biweekly-standing-low-to-high-cable-crossover",
      "name": "Standing Low-to-High Cable Crossover",
      "reason": "Source says low or mid pulley without a definite upward path"
    },
    {
      "id": "tendon-wrist-extensor-isometric",
      "name": "Wrist extensor isometric",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-15-min-liss-incline-walk-speed-3-8-km-h-incline-9",
      "name": "15 Min LISS Incline Walk (Speed 3.8 km/h, Incline 9%)",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-doorway-pec-stretch",
      "name": "Doorway Pec Stretch",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-doorway-stretch",
      "name": "Doorway Stretch",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-overhead-lat-lengthener",
      "name": "Overhead Lat Lengthener",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-stick-overhead-lat-stretch",
      "name": "Stick Overhead Lat Stretch",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-hanging-straight-leg-toes-to-bar",
      "name": "Hanging Straight-Leg Toes-to-Bar",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-assisted-neutral-chin-up",
      "name": "Assisted Neutral Chin-Up",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-assisted-pull-ups",
      "name": "Assisted Pull-Ups",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-cable-pushdown",
      "name": "Cable Pushdown",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-chest-supported-machine-row",
      "name": "Chest-Supported Machine Row",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-close-grip-incline-db-press",
      "name": "Close-Grip Incline DB Press",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-db-pullover",
      "name": "DB Pullover",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-deficit-push-ups",
      "name": "Deficit Push-Ups",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-dumbbell-pullover-on-bench",
      "name": "Dumbbell Pullover on Bench",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-flat-barbell-bench",
      "name": "Flat Barbell Bench",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-floor-leg-raise",
      "name": "Floor Leg Raise",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-incline-deficit-push-ups",
      "name": "Incline Deficit Push-Ups",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-incline-machine-fly",
      "name": "Incline Machine Fly",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-incline-machine-press",
      "name": "Incline Machine Press",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-incline-prone-db-y-raise",
      "name": "Incline Prone DB Y-Raise",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-kneeling-cable-lat-pull",
      "name": "Kneeling Cable Lat Pull",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-low-incline-cable-fly",
      "name": "Low Incline Cable Fly",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-machine-row",
      "name": "Machine Row",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-meadows-row",
      "name": "Meadows Row",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-neutral-grip-mag-pulldown",
      "name": "Neutral-Grip Mag Pulldown",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-parallel-bar-dips",
      "name": "Parallel Bar Dips",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-plate-press",
      "name": "Plate Press",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-standing-plate-press",
      "name": "Standing Plate Press",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-weighted-push-ups",
      "name": "Weighted Push-Ups",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-stick-high-knee-marches",
      "name": "Stick High Knee Marches",
      "reason": "Source allows two different stick positions; needs one exact setup"
    },
    {
      "id": "periodized-db-side-bend",
      "name": "DB Side Bend",
      "reason": "Source describes bending toward unloaded side; resistance direction needs review"
    },
    {
      "id": "periodized-wide-stance-sumo-goblet-squat",
      "name": "Wide-Stance Sumo Goblet Squat",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-cable-hip-adduction",
      "name": "Cable Hip Adduction",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-side-lying-adduction",
      "name": "Side-Lying Adduction",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-side-plank-abduction",
      "name": "Side Plank Abduction",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-barbell-rdl",
      "name": "Barbell Romanian Deadlift",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-cable-pull-through",
      "name": "Cable Pull-Through",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-goblet-squat-to-box",
      "name": "Goblet Squat to Box",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-bodyweight-box-squat",
      "name": "Bodyweight Box Squat",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-dumbbell-lying-leg-curl",
      "name": "Dumbbell Lying Leg Curl",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-step-ups-on-bench",
      "name": "Step-Ups on Bench",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-reverse-lunges",
      "name": "Reverse Lunges",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-stick-overhead-deep-squat-prys",
      "name": "Stick Overhead Deep Squat Prys",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-stick-good-mornings",
      "name": "Stick Good Mornings",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-stick-lateral-leg-swings",
      "name": "Stick Lateral Leg Swings",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-stick-quad-stretch",
      "name": "Stick Quad Stretch",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-butterfly-groin-stretch",
      "name": "Butterfly Groin Stretch",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "biweekly-hamstring-stretch",
      "name": "Hamstring Stretch",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-machine-shoulder-press",
      "name": "Machine Shoulder Press",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-arnold-press",
      "name": "Arnold Press",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-underhand-lat-pulldown",
      "name": "Underhand Lat Pulldown",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-chin-ups",
      "name": "Chin-Ups",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-single-arm-cable-pulldown",
      "name": "Single-Arm Cable Pulldown",
      "reason": "Source allows kneeling or sitting; execution needs confirmation"
    },
    {
      "id": "periodized-incline-db-prone-row",
      "name": "Incline DB Prone Row",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-standing-cable-crossover",
      "name": "Standing Cable Crossover",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-dumbbell-incline-fly",
      "name": "Dumbbell Incline Fly",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-rope-tricep-pressdown",
      "name": "Rope Tricep Pressdown",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-ez-bar-curl-skullcrushers",
      "name": "EZ-Bar Curl & Skullcrushers",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-cable-hammer-curl-dips",
      "name": "Cable Hammer Curl & Dips",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-concentration-curls",
      "name": "Concentration Curls",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-hanging-windshield-wipers",
      "name": "Hanging Windshield Wipers",
      "reason": "Source does not specify supported hip position or safe working arc"
    },
    {
      "id": "periodized-cable-side-crunch-on-mat",
      "name": "Kneeling Cable Side Crunch on Mat",
      "reason": "Source effort direction toward cable requires clarification"
    },
    {
      "id": "periodized-stick-around-the-worlds",
      "name": "Stick Around-the-Worlds",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-hanging-leg-raise",
      "name": "Hanging Leg Raise",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-lying-leg-lift",
      "name": "Lying Leg Lift",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-incline-bench-reverse-crunch",
      "name": "Incline Bench Reverse Crunch with Pelvic Curl",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-russian-twists",
      "name": "Russian Twists",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-knee-tuck",
      "name": "Knee Tuck",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-stick-russian-twists",
      "name": "Stick Russian Twists",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-stick-lateral-side-bends",
      "name": "Stick Lateral Side Bends",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-stick-side-bends",
      "name": "Stick Side Bends",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-light-db-side-bend",
      "name": "Light DB Side Bend",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-incline-walk",
      "name": "Incline Walk",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-stick-lat-oblique-reach",
      "name": "Stick Lat & Oblique Reach",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-seated-hip-adductor-machine",
      "name": "Seated Hip Adductor Machine",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-sumo-goblet-squat",
      "name": "Sumo Goblet Squat",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-seated-hip-abductor-machine",
      "name": "Seated Hip Abductor Machine",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-dumbbell-rdl",
      "name": "Dumbbell RDL",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-romanian-barbell-deadlift",
      "name": "Romanian Barbell Deadlift",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-stick-good-mornings",
      "name": "Stick Good Mornings",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-stick-torso-twists",
      "name": "Stick Torso Twists",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-step-ups",
      "name": "Step-Ups",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-hanging-knee-tuck",
      "name": "Hanging Knee Tuck",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    },
    {
      "id": "periodized-shallow-wall-sit-isometric-hold",
      "name": "Shallow Wall-Sit Isometric Hold",
      "reason": "No concrete, non-deferred exact-identity phase specification"
    }
  ],
  "sourceHashes": {
    ".codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json": "31ba21c69dbdd4428deb21424088978763af71e78750d80c4ffff9894c100a16",
    ".codex/v541/artwork-v3/tuesday/GENERATION-MANIFEST.json": "df36de0cf662530ff4ccbc68c22cbe3d3b86f064734b7ed5476894e02a9b75a9",
    ".codex/v541/artwork-v3/wednesday/GENERATION-MANIFEST.json": "47d81cd3f76bca810c30a6f4194258e279bf7e42b53a4b3f75d78cd02e2ebbd9",
    ".codex/v541/artwork-v3/thursday/GENERATION-MANIFEST.json": "ea0a52d1d1aea02c934328d3df554081cb1883cbb2d815704377e68b05d7e46c",
    ".codex/v541/artwork-v3/friday/GENERATION-MANIFEST.json": "fa21f2d2cce27f23ea9a0254b9e20df0c424f36a99ad5b1c0b83c1701826f27e",
    ".codex/v541/artwork-v3/saturday/GENERATION-MANIFEST.json": "5a542c3cf362a11a9501d6d5654d8846d8f8c8dea6cdc37bc4623a8ad07a1d4d",
    ".codex/v541/artwork-v3/CANONICAL-MOVEMENTS.json": "1af82a85972bc6626f72f22ffe9bb0f3e5897653468984b17f32da10ffcea03d",
    "data/periodized-abc.js": "cf26743921cd1e8160790f9fc8968cffbd9d87572cf7cf3b042fdb6ae63c0f08"
  }
};
 function resolve(item,dayIndex) {
  const art=window.GYM_COMPANION_ABAC_ARTWORK.resolve(item,dayIndex);
  if(art.artworkStatus!=='complete'||art.reviewOnly)return null;
  // Only the approved resolver's exact canonical identity supplies content.
  const key=[art.imageSet.start,art.imageSet.movement].map(path=>String(path||'').replace(/\.png$/,'.webp')).join('|');
  const id=art.canonicalMovementId||art.stableMovementId;
  // The approved V4 Knee Tuck override retains the same hanging bent-knee
  // execution as Tuesday's explicitly specified Hanging Knee Raise.
  const explicitContentAliases={'periodized-knee-tuck':'periodized-hanging-knee-raise','periodized-hanging-knee-tuck':'periodized-hanging-knee-raise'};
  return data.records[id]||data.records[explicitContentAliases[id]]||data.records[data.byPair[key]]||null;
 }
 function enrich(item,dayIndex,tier='intermediate') {
  const content=resolve(item,dayIndex),review='Execution instructions under review for this exercise.';
  if(!content)return {...item,contentReviewStatus:'needs-review',startInstruction:review,movementInstruction:review,safetyCue:'Exercise-specific safety guidance is under review. Stop if you feel sharp pain.'};
  const key=tier==='expert'?'advanced':tier;
  const dose=String(item.prescriptions?.[key]||item.prescriptions?.[tier]||item.scheme||'');
  const conflict=(content.canonicalMovementId==='biweekly-cable-pallof-press-with-iso-hold'&&/half.kneeling/i.test(dose))
   ||(content.canonicalMovementId==='periodized-floor-reverse-crunch-with-pelvic-tilt'&&/incline bench/i.test(dose))
   ||(content.canonicalMovementId==='biweekly-lying-leg-curl-machine'&&/seated position/i.test(dose))
   ||(content.canonicalMovementId==='biweekly-stick-seated-russian-twists'&&/feet elevated/i.test(dose));
  if(conflict)return {...item,contentReviewStatus:'tier-execution-conflict',contentSource:content.source,startInstruction:review,movementInstruction:review,safetyCue:'The selected prescription and setup need review before exercise-specific guidance can be shown.'};
  return {...item,equipment:content.equipment,startInstruction:content.startInstruction,movementInstruction:content.movementInstruction,
   description:content.movementInstruction,cardDescription:content.movementInstruction,cue:content.movementInstruction,
   contentReviewStatus:content.contentReviewStatus,contentSource:content.source,progressionType:content.progressionType,
   safetyCue:content.safetyCue||'Exercise-specific safety guidance is under review. Stop if you feel sharp pain.',
   phaseBriefs:{start:{instruction:content.startInstruction},movement:{instruction:content.movementInstruction}}};
 }
 const progression={
  weighted:'Reach the top of the prescribed rep range on every set for two sessions with control, then add the smallest practical load.',
  stack:'Reach the top of the prescribed rep range on every set for two sessions, then move up one small stack increment.',
  bodyweight:'First reach the prescribed repetitions with control. Then reduce assistance or use a slightly harder variation; do not add load automatically.',
  'bodyweight-hold':'Build control through the prescribed hold first. Progress only while maintaining the same alignment and steady breathing.',
  vacuum:'Improve a gentle abdominal draw-in and comfortable breathing in the prescribed position. Do not add external load or force a deeper hollow.',
  mobility:'Improve comfortable range, control or smoothness. Do not add load to force a larger range.',
  cardio:'Increase either duration by two minutes or incline/resistance by one small level; change only one variable during the week.'
 };
 window.GYM_COMPANION_ABAC_CONTENT={...data,resolve,enrich,progression};
})();
