/*
 * Fitness 7 periodized activity source.
 *
 * The Google Sheet remains the reviewed content reference. This runtime
 * adapter deliberately keeps the source rows intact, normalises day-level
 * targets to movement-level targets, and exposes the agreed four-week cadence:
 * A -> B -> A -> C. Week C is the once-monthly foundation/strength week.
 */
(() => {
  'use strict';

  const source = window.GYM_COMPANION_BIWEEKLY_ROUTINE || { days: [] };
  const clone = value => JSON.parse(JSON.stringify(value));
  const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  const excluded = /captain|band(?:ed|s)?|trap[- ]bar|hack squat|swiss ball|seated leg curl|cable (?:standing )?hip abduction|cuffed cable|pec[- ]deck|dip machine|machine chest press|barbell hip thrust|ab wheel/i;
  const targetGroups = name => {
    const text = String(name || '').toLowerCase();
    const groups = new Set();
    if (/chest|press|fly|pec|push-up/.test(text)) groups.add('chest');
    if (/lat|pulldown|pull-up|row|pullover|rear.?delt|back extension|hyperextension/.test(text)) groups.add('back');
    if (/curl|biceps|hammer|forearm|wrist|triceps|pressdown|extension/.test(text)) groups.add('arms');
    if (/shoulder|scap|lateral raise|rotator|around-the-world|thoracic/.test(text)) groups.add('shoulders');
    if (/squat|lunge|leg|rdl|deadlift|hinge|glute|hamstring|calf|tibialis|abductor|adductor|poliquin|monster/.test(text)) groups.add('legs');
    if (/abs|core|plank|crunch|knee raise|pallof|vacuum|oblique|woodchop|trunk/.test(text)) groups.add('core');
    if (/walk|bike|cardio|treadmill|interval/.test(text)) groups.add('cardio');
    if (/stretch|mobility|rotation|warm|prep|activation|drill|stick|pose|rock|circle/.test(text)) groups.add('mobility');
    if (!groups.size) groups.add('mobility');
    return [...groups];
  };
  const isExcluded = item => excluded.test(`${item?.name || ''} ${item?.equipment || ''}`);
  const dose = (beginner, intermediate, advanced) => ({ beginner, intermediate, advanced });
  const phase = (start, movement, direction = '', grip = '') => ({
    start: { instruction: start, directionCue: direction, gripCue: grip },
    movement: { instruction: movement, directionCue: direction, gripCue: grip }
  });
  /* Thursday copy is intentionally authored here, beside the normalized
     source. It powers the listing card as well as the detail route; generic
     fallback copy is not used for this pilot day. */
  const thursdayContent = {
    'Stick Behind-the-Back Chest Opener': {
      description: 'Hold the stick behind your hips and gently draw the shoulders back without flaring the ribs.',
      prescriptions: dose('1 round · 6 slow reps · 20s rest', '2 rounds · 6 slow reps · 20s rest', '2 rounds · 8 slow reps · 20s rest'),
      why: 'Creates a comfortable chest and shoulder position before the mixed pull, press, and row work.',
      cue: 'Keep the neck long and move the hands only as far back as the ribs stay stacked.',
      commonMistake: 'Pushing the stick away from the body by arching the lower back.',
      safetyCue: 'Use a wider grip or stop the arc if the front of the shoulder pinches or the hand tingles.',
      progression: 'First make six smooth, pain-free repetitions; narrow the grip only when the full arc stays comfortable.',
      phaseBriefs: phase('Stand tall with a wide grip and the stick resting behind the hips.', 'Draw the hands a few centimetres back, pause, then return without shrugging.', 'Hands travel backward only within a pain-free arc.', 'Wide overhand grip; relaxed wrists.')
    },
    'Stick Behind-the-Back Opener': {
      description: 'Use a wide stick grip behind the hips to rehearse shoulder extension without forcing the range.',
      prescriptions: dose('1 round · 6 slow reps · 20s rest', '2 rounds · 6 slow reps · 20s rest', '2 rounds · 8 slow reps · 20s rest'),
      why: 'Prepares the chest and anterior shoulder for Thursday pressing and pulling angles.',
      cue: 'Keep the belt line quiet as the hands move back.',
      commonMistake: 'Leaning the ribs forward to create a bigger-looking stretch.',
      safetyCue: 'Widen the hands and reduce the range for any pinch, numbness, or sharp pain.',
      progression: 'Add one controlled repetition before changing grip width.',
      phaseBriefs: phase('Stand tall with the stick behind the hips and elbows relaxed.', 'Gently lift the stick away from the body, then lower it with control.', 'Move the hands back, not the ribs forward.', 'Wide overhand grip; no hard squeeze.')
    },
    'Stick Dislocates': {
      description: 'Sweep a wide-held stick from in front of the body overhead and behind you, then reverse the path.',
      prescriptions: dose('1 round · 5 reps · 20s rest', '2 rounds · 5 reps · 20s rest', '2 rounds · 6 reps · 20s rest'),
      why: 'Rehearses the overhead shoulder path used to stabilize rows, pulldowns, and presses.',
      cue: 'Move the stick around your head while your ribs remain down.',
      commonMistake: 'Shrugging or bending the elbows to hide a restricted shoulder path.',
      safetyCue: 'Widen the grip and stop before pain; never force the stick behind the body.',
      progression: 'Use the same wide grip until every repetition is smooth and symptom-free.',
      phaseBriefs: phase('Stand with a very wide overhand grip and the stick at thigh height.', 'Arc the stick overhead to a comfortable position behind the hips.', 'Reverse the same arc slowly; no bouncing.', 'Hands wider than shoulders; elbows soft.')
    },
    'Stick Lat Stretch': {
      description: 'Reach the stick overhead and lean gently away to lengthen one side of the back.',
      prescriptions: dose('1 set · 20s/side · 20s rest', '2 sets · 20–30s/side · 20s rest', '2 sets · 30s/side · 20s rest'),
      why: 'Gives the lats a low-intensity lengthening input before and after Thursday’s vertical pulls.',
      cue: 'Reach up first, then make a small side bend without rotating the chest.',
      commonMistake: 'Turning the stretch into a deep backbend or twisting toward the side.',
      safetyCue: 'Keep the stretch mild and stop for shoulder, rib, or low-back pain.',
      progression: 'Add seconds only while breathing normally and keeping both feet grounded.',
      phaseBriefs: phase('Stand tall with both hands on the stick overhead.', 'Shift the hips slightly and lean away until the lat lengthens.', 'Return upright before changing sides.', 'Hands wider than shoulders; shoulders stay away from ears.')
    },
    'Seated Dumbbell Overhead Shoulder Press': {
      description: 'Press dumbbells from shoulder height to overhead while keeping the bench, ribs, and wrists stable.',
      prescriptions: dose('2–3 sets · 10–12 reps · 90s rest', '3 sets · 8–12 reps · 120s rest', '4 sets · 6–10 reps · 150s rest'),
      why: 'Builds the delts and triceps that support Thursday’s upper-body balance without turning the press into a backbend.',
      cue: 'Stack wrists over elbows and finish with biceps beside the ears.',
      commonMistake: 'Flaring the ribs or letting the dumbbells drift forward at lockout.',
      safetyCue: 'Use a range that keeps the shoulder smooth; stop if pressing causes a sharp pinch or numbness.',
      progression: 'Add reps within the range first; then increase each dumbbell by the smallest available jump.',
      phaseBriefs: phase('Sit supported with dumbbells at ear level and forearms vertical.', 'Drive the weights up and slightly in until arms are straight without shrugging.', 'Lower to ear level over two controlled seconds.', 'Neutral-to-slightly-pronated grip; wrists stacked.')
    },
    'Standing Barbell Overhead Press': {
      description: 'Press the bar from the upper chest overhead while bracing the trunk and keeping the bar close.',
      prescriptions: dose('2–3 sets · 10–12 reps · 90s rest', '3 sets · 6–10 reps · 120s rest', '4 sets · 5–8 reps · 150s rest'),
      why: 'Trains shoulder and triceps strength while the standing brace supports the rest of Thursday’s pulling volume.',
      cue: 'Squeeze glutes, move the head back then through, and finish with the bar over mid-foot.',
      commonMistake: 'Leaning back to turn the press into an incline bench press.',
      safetyCue: 'Use safeties and a load you can lower to the chest without losing balance; stop for shoulder or back pain.',
      progression: 'When all sets reach the top of the range at the planned RIR, add the smallest plate increment.',
      phaseBriefs: phase('Stand with the bar at the upper chest, elbows slightly forward, feet even.', 'Press vertically as the head moves through, finishing with ribs stacked under the bar.', 'Lower to the upper chest without dropping the elbows.', 'Just outside shoulder width; full-hand grip.')
    },
    'Close-Grip V-Bar Lat Pulldown': {
      description: 'Pull the neutral V-bar toward the upper chest by driving the elbows down, then allow a full controlled reach.',
      prescriptions: dose('2–3 sets · 10–12 reps · 90s rest', '3 sets · 8–12 reps · 120s rest', '4 sets · 6–10 reps · 150s rest'),
      why: 'Adds lat width and elbow-flexor work after the press, balancing Thursday’s mixed upper-body session.',
      cue: 'Keep the chest tall and pull the elbows into your back pockets.',
      commonMistake: 'Swinging backward or curling the bar down with the hands only.',
      safetyCue: 'Keep the bar in front of the face and reduce load if the shoulder loses control overhead.',
      progression: 'Own the top stretch and reach the rep ceiling before adding a small plate.',
      phaseBriefs: phase('Sit with thighs secured, arms long, and a neutral V-bar grip.', 'Pull the handle to the upper chest with elbows travelling down.', 'Let the elbows rise until the lats lengthen without shrugging.', 'Neutral close grip; thumbs wrapped.')
    },
    'Neutral-Grip Lat Pulldown (Close-Grip V-Bar)': {
      description: 'Use the close neutral handle to pull from a tall torso, then return until the elbows are comfortably straight.',
      prescriptions: dose('2–3 sets · 10–12 reps · 90s rest', '3 sets · 8–12 reps · 120s rest', '4 sets · 6–10 reps · 150s rest'),
      why: 'Targets the lats through a shoulder-friendly vertical pull and keeps the Thursday B session comparable to Thursday A.',
      cue: 'Lead with elbows, not the handle, and keep the sternum quietly lifted.',
      commonMistake: 'Pulling behind the neck or shortening the overhead reach.',
      safetyCue: 'Stay in front of the head and use assistance or less load if the shoulder pinches.',
      progression: 'Add one clean repetition per set before increasing the stack.',
      phaseBriefs: phase('Brace the thighs and take the close neutral grip with arms overhead.', 'Drive elbows down until the handle reaches the upper chest.', 'Control the cable upward without losing the rib position.', 'Neutral V-bar grip; wrists straight.')
    },
    'Seated Wide-Grip Cable Row': {
      description: 'Row the wide handle toward the lower ribs while the trunk stays quiet and the shoulder blades glide.',
      prescriptions: dose('2–3 sets · 10–12 reps · 90s rest', '3 sets · 8–12 reps · 120s rest', '4 sets · 6–10 reps · 150s rest'),
      why: 'Builds mid-back thickness and scapular control to complement Thursday’s vertical pull.',
      cue: 'Reach long, then pull the elbows back until the handle meets the ribs.',
      commonMistake: 'Rocking the torso to move a load the back cannot control.',
      safetyCue: 'Stop the pull before the shoulders round or the low back flexes.',
      progression: 'Pause one second at the ribs for all reps before adding load.',
      phaseBriefs: phase('Sit tall with knees soft, arms extended, and a wide overhand handle.', 'Pull toward the lower ribs with elbows travelling out and back.', 'Reach forward slowly until the shoulder blades glide.', 'Wide overhand grip; wrists neutral.')
    },
    'Chest-Supported T-Bar Row': {
      description: 'Brace against the incline pad and pull the T-bar toward the lower chest without lifting the torso.',
      prescriptions: dose('2–3 sets · 10–12 reps · 90s rest', '3 sets · 8–12 reps · 120s rest', '4 sets · 6–10 reps · 150s rest'),
      why: 'Adds supported upper-back thickness while reducing momentum after Thursday’s vertical pull.',
      cue: 'Keep the chest heavy on the pad and finish by driving elbows toward the hips.',
      commonMistake: 'Peeling the chest off the pad to turn the row into a lower-back lift.',
      safetyCue: 'Set the pad so breathing is easy and stop if the shoulder or sternum feels compressed.',
      progression: 'Add a one-second squeeze before increasing the smallest plate increment.',
      phaseBriefs: phase('Lie chest-down on the incline pad with arms extended to the handles.', 'Pull the handles toward the lower chest while the pad stays loaded.', 'Lower until the elbows are long without dropping the shoulders.', 'Neutral handle; thumbs wrapped.')
    },
    'Incline Smith Machine Press 45°': {
      description: 'Press the guided bar from the upper chest on a 45-degree bench while keeping shoulder blades anchored.',
      prescriptions: dose('2–3 sets · 10–12 reps · 90s rest', '3 sets · 8–12 reps · 120s rest', '4 sets · 6–10 reps · 150s rest'),
      why: 'Provides controlled upper-chest and triceps volume without demanding a free-bar balance after rows.',
      cue: 'Lower toward the upper chest with elbows slightly tucked, then press in the bar’s track.',
      commonMistake: 'Touching too high on the neck or flaring the elbows wide.',
      safetyCue: 'Set the stops just below the bottom range and use a load you can rerack smoothly.',
      progression: 'Reach the rep ceiling with two clean reps in reserve before adding a small plate.',
      phaseBriefs: phase('Set the bench to 45 degrees, unrack with wrists over elbows, and brace the feet.', 'Lower the bar to the upper chest, then press to straight arms without shrugging.', 'Return the bar under control until the elbows are just below the bench line.', 'Grip slightly wider than shoulders; full-hand grip.')
    },
    'Incline Dumbbell Curl': {
      description: 'Curl from a supported incline position while the upper arm stays behind the torso and the wrist stays neutral.',
      prescriptions: dose('2 sets · 10–15 reps · 60s rest', '3 sets · 10–15 reps · 75s rest', '4 sets · 8–12 reps · 90s rest'),
      why: 'Trains the biceps in a lengthened position after the pulling work, giving Thursday a complete elbow-flexor finish.',
      cue: 'Let the elbows stay behind you and curl without rolling the shoulders forward.',
      commonMistake: 'Lifting the shoulders off the bench or cutting off the bottom stretch.',
      safetyCue: 'Use a lighter dumbbell if the front of the elbow feels strained; never force the last degrees of extension.',
      progression: 'Add reps with a quiet shoulder before increasing each dumbbell slightly.',
      phaseBriefs: phase('Lie on a low incline with arms hanging and palms forward.', 'Curl until the forearm meets the upper arm without moving the shoulder.', 'Lower for two seconds until the elbow is comfortably open.', 'Supinated grip; wrists straight.')
    },
    'Bayesian Cable Curl': {
      description: 'Stand in front of a low cable with the working arm behind the body and curl while the elbow remains fixed.',
      prescriptions: dose('2 sets · 10–15/side · 60s rest', '3 sets · 10–15/side · 75s rest', '4 sets · 8–12/side · 90s rest'),
      why: 'Loads the biceps through shoulder extension and adds a distinct arm angle to Thursday B.',
      cue: 'Keep the elbow behind the hip and move only the forearm.',
      commonMistake: 'Rotating the torso toward the cable or letting the elbow drift forward.',
      safetyCue: 'Reduce load if the cable pulls the shoulder into an uncomfortable stretch or the elbow becomes sharp.',
      progression: 'Reach the top of the range on both sides before adding the smallest cable increment.',
      phaseBriefs: phase('Stand side-on with the cable behind you and the arm gently extended back.', 'Curl the handle toward the shoulder while the upper arm stays behind the torso.', 'Lower until the elbow is open but not forced straight.', 'Supinated grip; shoulder stays down.')
    },
    'Incline Dumbbell Reverse Fly': {
      description: 'With the chest supported, raise light dumbbells out and slightly back to train the rear shoulder without shrugging.',
      prescriptions: dose('2 sets · 12–15 reps · 60s rest', '3 sets · 12–15 reps · 75s rest', '4 sets · 10–15 reps · 90s rest'),
      why: 'Finishes the rear delts and upper back so Thursday’s press and pull volume stays balanced.',
      cue: 'Lead with the elbows and stop when the arms align with the torso.',
      commonMistake: 'Turning the fly into a shrug or swinging the dumbbells from the floor.',
      safetyCue: 'Use very light loads and shorten the arc if the shoulder front pinches.',
      progression: 'First add a one-second top pause, then add the smallest dumbbell increase.',
      phaseBriefs: phase('Lie chest-down on a low incline with dumbbells hanging and palms facing.', 'Sweep the arms out until they are level with the torso, keeping the neck relaxed.', 'Lower slowly until the shoulders are long again.', 'Neutral grip; soft elbows.')
    },
    'Incline Prone Dumbbell Reverse Fly': {
      description: 'Lie chest-down on an incline bench and open the arms to shoulder height to isolate rear delts with a stable trunk.',
      prescriptions: dose('2 sets · 12–15 reps · 60s rest', '3 sets · 12–15 reps · 75s rest', '4 sets · 10–15 reps · 90s rest'),
      why: 'Adds rear-delt balance to the heavier press and row patterns in Thursday B.',
      cue: 'Keep the thumbs neutral and move from the back of the shoulder, not the neck.',
      commonMistake: 'Using momentum or bending the elbows to turn the lift into a row.',
      safetyCue: 'Choose a load that keeps the shoulder smooth; stop for sharp pain or tingling.',
      progression: 'Own the top pause for every rep before increasing load.',
      phaseBriefs: phase('Set the incline bench low and let the dumbbells hang beneath the shoulders.', 'Raise the arms wide to torso height with the chest supported.', 'Lower under control until the arms hang again.', 'Neutral grip; elbows softly bent.')
    },
    'Cable Fly': {
      description: 'Stand between the cable columns and arc the handles together in front of the chest without letting the shoulders roll forward.',
      prescriptions: dose('2 sets · 10–15 reps · 60s rest', '3 sets · 10–15 reps · 75s rest', '4 sets · 8–12 reps · 90s rest'),
      why: 'Adds controlled chest adduction to balance Thursday’s presses, pulls, and rear-delt work.',
      cue: 'Bring the upper arms together, not the hands by bending the elbows.',
      commonMistake: 'Letting the shoulders glide forward or turning the rep into a press.',
      safetyCue: 'Set the pulleys around mid-chest and stop the stretch before the shoulder feels pulled forward.',
      progression: 'Own the stretched position for one breath before adding the smallest cable increment.',
      phaseBriefs: phase('Stand staggered between mid-height pulleys with soft elbows and a tall chest.', 'Arc the handles forward until the chest contracts, keeping the elbows in the same soft bend.', 'Open the arms slowly until the pecs lengthen without shoulder roll.', 'Neutral grip; wrists straight.')
    },
    'Side Plank Hold with Rotation': {
      description: 'Hold a side plank, then rotate the top arm under the torso and reopen while the hips stay lifted.',
      prescriptions: dose('2 sets · 20–30s/side · 45s rest', '3 sets · 30–40s/side · 60s rest', '3–4 sets · 40–60s/side · 60s rest'),
      why: 'Trains anti-rotation and lateral trunk control as an optional complement to Thursday’s upper-body work.',
      cue: 'Push the floor away and keep the ribs stacked over the pelvis.',
      commonMistake: 'Dropping the hips or rotating from the shoulder while the trunk sags.',
      safetyCue: 'Use the lower knee for support if the shoulder or low back cannot stay comfortable; stop for sharp pain.',
      progression: 'Add seconds only while the hips remain high and breathing stays steady.',
      phaseBriefs: phase('Set the elbow under the shoulder with legs stacked or the lower knee bent.', 'Lift the hips, thread the top arm under the ribs, then return to open.', 'Lower the hips with control after the timed hold.', 'Forearm vertical; top hand reaches without collapsing the shoulder.')
    },
    'Dumbbell Pullover on Flat Bench': {
      description: 'Lower one dumbbell behind the head with ribs controlled, then pull it back over the chest using the lats.',
      prescriptions: dose('2 sets · 10–12 reps · 75s rest', '3 sets · 10–12 reps · 90s rest', '3–4 sets · 8–12 reps · 120s rest'),
      why: 'Adds a shoulder-extension pattern for lat and serratus work without another heavy row.',
      cue: 'Keep the ribs down as the elbows travel behind the head.',
      commonMistake: 'Bending the elbows deeply and turning the pullover into a triceps extension.',
      safetyCue: 'Use a short range if the shoulder feels unstable or the low back arches.',
      progression: 'Increase range before load, then add the smallest dumbbell jump.',
      phaseBriefs: phase('Lie across the bench with one dumbbell over the chest and elbows softly bent.', 'Arc the dumbbell behind the head while the ribs stay down.', 'Pull it back over the chest without snapping the elbows straight.', 'Both hands on the dumbbell; neutral wrists.')
    },
    'Incline Cable Pullover with Stretched Bias': {
      description: 'On an incline bench, let the cable lengthen the lats overhead before pulling the handle toward the thighs.',
      prescriptions: dose('2 sets · 10–12 reps · 75s rest', '3 sets · 10–12 reps · 90s rest', '3–4 sets · 8–12 reps · 120s rest'),
      why: 'Provides a controlled long-length lat option for Thursday B without adding another elbow-flexion exercise.',
      cue: 'Keep a soft elbow and sweep the arms in one arc toward the pockets.',
      commonMistake: 'Bending the elbows or lifting the ribs to shorten the stretch.',
      safetyCue: 'Use a light stack and stop the overhead reach before the shoulder loses control.',
      progression: 'Add one clean repetition per set before changing the load.',
      phaseBriefs: phase('Lie on the incline bench holding the cable with arms angled overhead.', 'Sweep the handles down toward the thighs while the torso stays quiet.', 'Return to the overhead stretch slowly without losing the rib brace.', 'Neutral or rope grip; elbows soft.')
    },
    'Hanging Oblique Knee Raise': {
      description: 'Hang tall and curl the knees toward one side of the ribs without swinging the body.',
      prescriptions: dose('2 sets · 8–10/side · 60s rest', '3 sets · 10–12/side · 75s rest', '3–4 sets · 10–15/side · 90s rest'),
      why: 'Adds controlled oblique and lower-abdominal work as the optional trunk balance for Thursday B.',
      cue: 'Tuck the pelvis first, then lift the knees; keep the shoulders packed.',
      commonMistake: 'Swinging the legs or pulling the knees up with the hip flexors only.',
      safetyCue: 'Use a captain-free pull-up bar and stop if the grip, shoulder, or low back becomes painful.',
      progression: 'Remove swing and add a one-second top pause before adding reps.',
      phaseBriefs: phase('Hang with a firm overhand grip, ribs down, and legs long.', 'Curl the pelvis and guide both knees toward one side of the ribs.', 'Lower the legs until the body is still before the next repetition.', 'Shoulder-width overhand grip; no kipping.')
    },
    '15 Min LISS Incline Walk (Speed 3.8 km/h, Incline 9%)': {
      description: 'Walk at a conversational pace after lifting; the incline should raise breathing without turning the finish into intervals.',
      prescriptions: dose('10–15 min · easy conversational pace', '15–20 min · 3.8 km/h · 9% incline', '15–20 min · 3.8 km/h · 9% incline'),
      why: 'Adds low-intensity conditioning after upper-body work without competing with the next leg session.',
      cue: 'Keep steps quiet, posture tall, and breathing steady enough to speak a sentence.',
      commonMistake: 'Holding the rails or turning the walk into a hard test after lifting.',
      safetyCue: 'Lower speed or incline for dizziness, unusual breathlessness, or calf/Achilles discomfort.',
      progression: 'Add minutes only while recovery and next-day leg readiness remain normal.',
      phaseBriefs: phase('Set the treadmill before stepping on and choose a pace you can sustain.', 'Walk continuously with light arm swing and a steady conversational effort.', 'Reduce incline and speed gradually before stepping off.', 'Hands off rails unless balance requires support.')
    },
    'Stick Doorway Chest Stretch': {
      description: 'Place the forearm on a doorway and turn the body slightly away until the chest opens without shoulder strain.',
      prescriptions: dose('1 set · 20s/side', '2 sets · 20–30s/side', '2 sets · 30s/side'),
      why: 'Downshifts the chest and front shoulder after pressing while keeping the stretch optional and gentle.',
      cue: 'Keep the shoulder blade down as the sternum turns away from the arm.',
      commonMistake: 'Pushing the shoulder forward or rotating the whole pelvis through the doorway.',
      safetyCue: 'Stay below a pinching sensation and stop for numbness or sharp pain.',
      progression: 'Increase seconds only when breathing remains calm and the shoulder feels clear.',
      phaseBriefs: phase('Stand beside the doorway with forearm supported and elbow near shoulder height.', 'Turn the chest a few degrees away until the pec lengthens.', 'Return to square before switching sides.', 'Forearm contact; shoulder relaxed.')
    },
    'Cross-Body Stretch': {
      description: 'Bring one arm across the chest and use the other arm to draw it gently closer while the shoulder stays low.',
      prescriptions: dose('1 set · 20s/side', '2 sets · 20–30s/side', '2 sets · 30s/side'),
      why: 'Offers a low-load rear-shoulder reset after rows and reverse-fly work.',
      cue: 'Keep the arm below shoulder height and turn the chest forward.',
      commonMistake: 'Pulling at the elbow or rounding the whole upper back to chase range.',
      safetyCue: 'Use light pressure and stop for front-shoulder pain, tingling, or numbness.',
      progression: 'Hold a little longer before attempting a deeper arm position.',
      phaseBriefs: phase('Stand tall with one arm relaxed across the chest.', 'Use the opposite forearm to draw it closer without lifting the shoulder.', 'Release slowly and reset posture.', 'Support above the elbow; wrist relaxed.')
    }
  };
  function applyThursdayContent(day) {
    if (day.dayIndex !== 3) return day;
    const records = [...(day.warmup || []), ...(day.coreSlots || []), ...(day.optionalSlots || []), ...(day.cardio || []), ...(day.recovery || [])];
    for (const item of records) {
      const copy = thursdayContent[item.name];
      if (copy) Object.assign(item, clone(copy));
    }
    return day;
  }
  const normaliseMovement = (item, weekKey, dayIndex, roleOverride) => {
    const next = clone(item);
    const replacements = {
      'Seated Leg Curl Machine': 'Lying Leg Curl',
      'Pec Deck Machine': 'Cable Fly',
      'Cuffed Cable Rear-Delt Fly': 'Incline Dumbbell Reverse Fly',
      'Barbell Hip Thrust': 'Glute Bridge',
      'Seated Machine Chest Press': 'Incline Dumbbell Press',
      "Captain's Chair Knee": 'Hanging Knee Raise',
      'Trap Bar Deadlift': 'Romanian Deadlift',
      'Hack Squat Machine': 'Leg Press',
      'Ab Wheel Rollout from Knees': 'Dead Bug',
      'Conventional': 'Conventional Deadlift'
    };
    const replacedName = replacements[next.name];
    if (replacedName) next.name = replacedName;
    if (/^Stick\b/i.test(next.name)) next.equipment = 'Light stick or empty-hand range';
    if (replacedName) {
      const catalogItem = window.GYM_COMPANION_TRAINING?.catalog?.find(candidate => candidate.name === next.name);
      if (catalogItem?.image_path) {
        next.image = catalogItem.image_path;
        next.imageSet = { move: catalogItem.image_path };
      } else {
        next.image = undefined;
        next.imageSet = {};
      }
    }
    next.weekKey = weekKey;
    next.dayIndex = dayIndex;
    next.role = roleOverride || next.role;
    next.stableMovementId = replacedName ? `periodized-${slug(next.name)}` : (next.stableMovementId || `periodized-${slug(next.name)}`);
    next.targetGroups = targetGroups(next.name);
    next.primaryTargets = next.targetGroups.filter(group => group !== 'mobility' && group !== 'cardio').slice(0, 2);
    next.secondaryTargets = next.targetGroups.filter(group => !next.primaryTargets.includes(group));
    next.equipmentStatus = isExcluded(item) ? 'Review before use · source equipment excluded; approved substitute shown' : (next.equipmentStatus || 'Review source sheet');
    next.sourceSheetRows = [...new Set([...(next.sourceSheetRows || []), next.sourceSheetRow].filter(Boolean))];
    next.sourceVersion = 'periodized-abc-v1';
    return next;
  };
  const normaliseDay = (day, weekKey, dayIndex, foundation = false) => {
    const next = clone(day);
    next.weekKey = weekKey;
    next.dayIndex = dayIndex;
    next.dayName = day.dayName || ['Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'][dayIndex];
    next.focus = foundation ? `${day.focus.split('·')[0].trim()} · Foundation strength & support` : day.focus;
    next.targetGroups = [...new Set((next.coreSlots || []).flatMap(item => targetGroups(item.name)).filter(group => !['mobility','cardio'].includes(group)))];
    next.coreSlots = (next.coreSlots || []).map(item => {
      const movement = normaliseMovement(item, weekKey, dayIndex, 'core');
      if (foundation) {
        movement.prescriptions = {
          beginner: '3 Sets x 8–10 Reps | Rest: 120s | Focus: stable technique, 3 RIR',
          intermediate: '4 Sets x 5–8 Reps | Rest: 150s | Focus: controlled strength, 1–2 RIR',
          advanced: '4 Sets x 4–6 Reps | Rest: 180s | Focus: crisp strength reps, about 1 RIR'
        };
      }
      movement.alternatives = (movement.alternatives || []).filter(name => !excluded.test(name));
      return movement;
    });
    next.optionalSlots = (next.optionalSlots || []).map(item => normaliseMovement(item, weekKey, dayIndex, 'optional')).filter(item => !isExcluded(item));
    next.warmup = (next.warmup || []).map(item => normaliseMovement(item, weekKey, dayIndex, 'warmup'));
    next.recovery = (next.recovery || []).map(item => normaliseMovement(item, weekKey, dayIndex, 'recovery'));
    next.cardio = (next.cardio || []).map(item => normaliseMovement(item, weekKey, dayIndex, 'cardio'));
    applyThursdayContent(next);
    return next;
  };

  const sourceA = source.days.filter(day => day.weekKey === 'A');
  const sourceB = source.days.filter(day => day.weekKey === 'B');
  const byIndex = (list, index) => list.find(day => day.dayIndex === index) || sourceA.find(day => day.dayIndex === index);
  const weeks = ['A', 'B', 'A', 'C'];
  const days = [];
  weeks.forEach((weekKey, cycleIndex) => {
    for (let dayIndex = 0; dayIndex < 7; dayIndex += 1) {
      const base = byIndex(weekKey === 'B' ? sourceB : sourceA, dayIndex);
      if (!base) continue;
      const record = normaliseDay(base, weekKey, dayIndex, weekKey === 'C');
      record.cycleIndex = cycleIndex;
      days.push(record);
    }
  });

  window.GYM_COMPANION_PERIODIZED_ABC = {
    key: 'periodized-abc',
    planVersion: 'periodized-abc-v1',
    name: 'Periodized A-B-A-C Activity',
    sourceSheet: 'Fitness 7 V5 — Optimized Master Workout Plan · 3-Week Periodized Plan (A-B-C)',
    cadence: ['A', 'B', 'A', 'C'],
    anchorDate: '2026-08-31',
    defaultTier: 'intermediate',
    days,
    excludedEquipment: ['Captain’s chair', 'Banded Pallof press', 'Banded monster walks', 'Trap bar RDL', 'Cable hip abduction', 'Hack squat', 'Swiss-ball leg curl', 'Seated leg curl', 'Barbell hip thrust', 'Machine chest press', 'Ab wheel'],
    notes: 'Week C is a once-monthly foundation and strength-support week. Review-before-use equipment remains visible in the workbook but is not auto-approved for member activation.'
  };
})();
