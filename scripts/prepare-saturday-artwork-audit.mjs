import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const outDir = path.join(root, '.codex/v541/artwork-v3/saturday');
fs.mkdirSync(outDir, { recursive: true });

const runtimeContext = { window: {} };
vm.createContext(runtimeContext);
for (const file of ['data/biweekly-routine.js', 'data/periodized-abc.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), runtimeContext, { filename: file });
}
const runtime = runtimeContext.window.GYM_COMPANION_PERIODIZED_ABC;

const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));

const existingLibraries = [];
for (const [day, file] of [
  ['Monday', 'data/periodized-v3-monday-artwork.js'],
  ['Tuesday', 'data/periodized-v3-tuesday-artwork.js'],
]) {
  const ctx = { window: {} };
  vm.createContext(ctx);
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), ctx, { filename: file });
  existingLibraries.push([day, ctx.window[day === 'Monday' ? 'GYM_COMPANION_PERIODIZED_V3_MONDAY_ARTWORK' : 'GYM_COMPANION_PERIODIZED_V3_TUESDAY_ARTWORK']]);
}
const dayArtworkContext = { window: {} };
vm.createContext(dayArtworkContext);
vm.runInContext(fs.readFileSync(path.join(root, 'data/periodized-v3-day-artwork.js'), 'utf8'), dayArtworkContext, { filename: 'data/periodized-v3-day-artwork.js' });
const dayArtwork = dayArtworkContext.window.GYM_COMPANION_PERIODIZED_V3_DAY_ARTWORK;
for (const day of ['Wednesday', 'Thursday', 'Friday']) existingLibraries.push([day, dayArtwork.days[day]]);

const findExisting = id => {
  for (const [day, library] of existingLibraries) {
    const record = library?.movements?.[id];
    if (record?.imageSet?.start && record?.imageSet?.movement) return { day, record };
  }
  return null;
};

const reuseDefinitions = [
  ['periodized-seated-hip-adductor-machine', 'Seated Hip Adductor Machine', 'Wednesday', 'biweekly-seated-hip-adductor-machine', ['coreSlots']],
  ['periodized-cable-hip-adduction', 'Cable Hip Adduction', 'Wednesday', 'periodized-cable-hip-adduction', ['alternative']],
  ['periodized-sumo-goblet-squat', 'Sumo Goblet Squat', 'Wednesday', 'periodized-wide-stance-sumo-goblet-squat', ['alternative']],
  ['periodized-seated-cable-row', 'Seated Cable Row to Mid-Torso / Seated Cable Row', 'Monday', 'periodized-seated-cable-row', ['coreSlots', 'alternative']],
  ['periodized-meadows-row', 'Meadows Row', 'Monday', 'periodized-meadows-row', ['alternative']],
  ['periodized-machine-row', 'Machine Row', 'Monday', 'periodized-machine-row', ['alternative']],
  ['periodized-seated-hip-abductor-machine', 'Seated Hip Abductor Machine', 'Wednesday', 'biweekly-seated-hip-abductor-machine', ['coreSlots']],
  ['periodized-dumbbell-rdl', 'Dumbbell RDL', 'Wednesday', 'biweekly-dumbbell-romanian-deadlift-rdl', ['alternative']],
  ['periodized-romanian-barbell-deadlift', 'Romanian Barbell Deadlift', 'Wednesday', 'periodized-barbell-rdl', ['alternative']],
  ['periodized-stick-good-mornings', 'Stick Good Mornings', 'Wednesday', 'biweekly-stick-good-mornings', ['warmup']],
  ['periodized-stick-torso-twists', 'Stick Torso Twists', 'Tuesday', 'biweekly-stick-standing-torso-twists', ['warmup']],
  ['periodized-step-ups', 'Step-Ups', 'Wednesday', 'periodized-step-ups-on-bench', ['alternative']],
  ['periodized-dead-bug', 'Dead Bug', 'Friday', 'periodized-dead-bug', ['optionalSlots']],
  ['periodized-dragon-flag-negatives', 'Dragon Flag Negatives on Flat Bench', 'Friday', 'periodized-dragon-flag-negatives', ['optionalSlots']],
  ['periodized-hanging-knee-tuck', 'Hanging Knee Tuck', 'Tuesday', 'periodized-hanging-knee-raise', ['alternative']],
];

const newDefinitions = [
  ['periodized-glute-bridge', 'Bodyweight Glute Bridge', 'core', 'Bodyweight on exercise mat', 'Floor, supine, knees bent and feet hip-width, arms by sides.', 'Drive through the heels to lift the pelvis until hips are extended without arching the ribs.', 'Hips travel upward; ribs stay stacked.', 'Bodyweight; feet hip-width, bilateral', ['gluteus maximus', 'hamstrings'], ['adductors', 'abdominals'], ['floor', 'lumbar control'], 'front three-quarter floor view', false],
  ['periodized-dumbbell-glute-bridge', 'Dumbbell Glute Bridge', 'alternative', 'One dumbbell held across the pelvis with a pad', 'Supine with the dumbbell secured across the hip crease, knees bent and feet planted.', 'Press the floor away and raise the pelvis to a level bridge while keeping the dumbbell stable.', 'Drive hips vertically; do not let the weight roll toward the abdomen.', 'Dumbbell across hips; bilateral stance', ['gluteus maximus'], ['hamstrings', 'adductors'], ['abdominals'], 'front three-quarter floor view', false],
  ['periodized-single-leg-hip-thrust', 'Single-Leg Hip Thrust', 'alternative', 'Flat bench and bodyweight', 'Upper back supported on a bench, one foot planted, opposite knee held above the hip.', 'Extend the planted hip until the shoulders, pelvis and knee align, then lower under control.', 'Planted heel drives upward; pelvis stays level.', 'One-leg stance; opposite hip flexed', ['gluteus maximus'], ['hamstrings'], ['abdominals', 'hip stabilizers'], 'front three-quarter bench view', false],
  ['periodized-machine-hip-thrust', 'Machine Hip Thrust', 'alternative', 'Hip-thrust machine with padded belt', 'Sit into the machine with the pad across the pelvis, feet planted and back supported.', 'Drive the platform or pad through hip extension until the torso and thighs align, then return slowly.', 'Hips extend; lumbar spine stays neutral.', 'Bilateral stance; machine belt secured', ['gluteus maximus'], ['hamstrings', 'adductors'], ['abdominals'], 'front three-quarter machine view', false],
  ['periodized-kas-glute-bridge', 'Kas Glute Bridge', 'core', 'Flat bench and padded dumbbell across pelvis', 'Upper back supported on a bench, hips slightly below lockout, feet planted and knees bent.', 'Perform a short-range hip extension to a strong glute squeeze, then lower only to the starting tension.', 'Use the short top-half path; do not turn it into a full back arch.', 'Bilateral stance; dumbbell secured at hips', ['gluteus maximus'], ['hamstrings'], ['abdominals'], 'side three-quarter bench view', false],
  ['periodized-wide-stance-leg-press', 'Wide-Stance Leg Press', 'alternative', '45-degree leg-press machine', 'Back and pelvis supported, feet high and wide on the platform with toes slightly out.', 'Lower the sled until the pelvis remains stable, then press through the whole foot without locking the knees.', 'Sled travels along the machine rails; knees track over toes.', 'Wide bilateral stance; toes slightly out', ['quadriceps', 'gluteus maximus'], ['adductors', 'hamstrings'], ['calves'], 'front three-quarter leg-press view', false],
  ['periodized-side-plank-clamshell', 'Side-Plank Clamshell', 'alternative', 'Exercise mat; no band', 'Side plank from the forearm with knees bent and stacked, hips lifted and feet together.', 'Keep the feet touching while opening the top knee without rolling the pelvis backward.', 'Top knee opens; hips remain stacked.', 'Side-lying bent-knee stance; forearm support', ['gluteus medius'], ['gluteus maximus', 'obliques'], ['shoulder stabilizers'], 'front three-quarter floor view', false],
  ['periodized-single-arm-dumbbell-row', 'Single-Arm Dumbbell Row', 'core', 'Dumbbell and flat bench', 'One hand and knee support the bench, spine neutral, dumbbell hanging below the shoulder.', 'Pull the dumbbell toward the hip while keeping the shoulder away from the ear, then lower fully.', 'Elbow travels back toward the hip.', 'Staggered half-kneeling bench support; one-arm grip', ['latissimus dorsi'], ['rhomboids', 'biceps'], ['erector spinae', 'obliques'], 'side three-quarter bench view', false],
  ['periodized-chest-supported-t-bar-row', 'Chest-Supported T-Bar Row', 'alternative', 'Chest-supported T-bar row machine', 'Chest rests on the angled pad, feet grounded and handles held with a neutral grip.', 'Drive the handles toward the lower ribs while keeping the chest on the pad, then lower with control.', 'Elbows pull back; chest stays in contact with the pad.', 'Neutral handles; bilateral stance', ['latissimus dorsi', 'rhomboids'], ['middle trapezius', 'biceps'], ['rear deltoids'], 'front three-quarter machine view', false],
  ['periodized-dumbbell-stiff-leg-romanian-deadlift', 'Dumbbell Stiff-Leg Romanian Deadlift', 'core', 'Pair of dumbbells', 'Stand tall with dumbbells by the thighs, knees softly unlocked and feet hip-width.', 'Hinge from the hips with minimal knee bend until the hamstrings load, then extend the hips to stand.', 'Hips travel backward; dumbbells stay close to the legs.', 'Bilateral hip hinge; neutral grip', ['hamstrings', 'gluteus maximus'], ['adductors'], ['erector spinae', 'abdominals'], 'side three-quarter standing view', false],
  ['periodized-single-leg-dumbbell-rdl', 'Single-Leg Dumbbell RDL', 'alternative', 'One dumbbell', 'Stand on one leg with the dumbbell in the opposite hand, pelvis square and knee softly unlocked.', 'Hinge while the free leg reaches backward, then drive the standing heel into the floor to return.', 'Torso and free leg counterbalance around the standing hip.', 'Single-leg stance; contralateral dumbbell grip', ['hamstrings', 'gluteus maximus'], ['gluteus medius'], ['foot and ankle stabilizers', 'abdominals'], 'side three-quarter standing view', false],
  ['periodized-nordic-curl-negatives', 'Nordic Curl Negatives', 'alternative', 'Kneeling pad and ankle anchor', 'Kneel upright with ankles secured, hips extended and hands ready to catch the descent.', 'Keep the body straight and lower forward slowly from the knees, catching with the hands before returning.', 'Body descends as one line; movement is eccentric only.', 'Kneeling bilateral stance; ankles anchored', ['hamstrings'], ['gluteus maximus'], ['abdominals', 'calves'], 'side profile kneeling view', false],
  ['periodized-nordic-hamstring-curl', 'Nordic Hamstring Curl', 'alternative', 'Kneeling pad and ankle anchor', 'Kneel upright with ankles secured and hips extended, hands off the floor if control allows.', 'Lower under control and use the hamstrings to assist the return toward upright.', 'Knees hinge while the torso stays braced.', 'Kneeling bilateral stance; ankles anchored', ['hamstrings'], ['gluteus maximus'], ['abdominals'], 'side profile kneeling view', false],
  ['periodized-conventional-barbell-deadlift', 'Conventional Barbell Deadlift', 'core', 'Barbell with plates on the floor', 'Feet hip-width, bar over mid-foot, hands just outside the knees and spine neutral.', 'Push the floor away and extend knees and hips until standing tall, then lower by hinging first.', 'Bar travels vertically close to the shins and thighs.', 'Double-overhand or mixed grip; hip-width stance', ['gluteus maximus', 'hamstrings'], ['quadriceps', 'adductors'], ['erector spinae', 'abdominals', 'forearms'], 'front three-quarter floor view', false],
  ['periodized-dumbbell-shrug', 'Dumbbell Shrug', 'core', 'Pair of dumbbells', 'Stand tall with dumbbells at the sides, arms straight and shoulders relaxed.', 'Elevate the shoulders straight toward the ears, pause briefly, then lower without rolling.', 'Shoulders travel vertically; no circular roll.', 'Bilateral neutral dumbbell grip; feet hip-width', ['upper trapezius'], ['levator scapulae'], ['forearms', 'abdominals'], 'front three-quarter standing view', false],
  ['periodized-barbell-shrug', 'Barbell Shrug', 'alternative', 'Barbell with manageable load', 'Stand with the bar in front of the thighs, hands just outside the legs and elbows straight.', 'Shrug the shoulders vertically, pause, and lower the bar without bending the elbows.', 'Bar stays close; shoulders move up and down.', 'Pronated shoulder-width grip; bilateral stance', ['upper trapezius'], ['levator scapulae'], ['forearms'], 'front three-quarter standing view', false],
  ['periodized-hex-bar-shrug', 'Hex-Bar Shrug', 'alternative', 'Loaded hex bar', 'Stand centered inside the hex bar with handles held at the sides and knees softly unlocked.', 'Elevate both shoulders vertically, pause, and lower while keeping the frame level.', 'Shoulders move up, not backward.', 'Neutral side handles; bilateral stance', ['upper trapezius'], ['levator scapulae'], ['forearms', 'abdominals'], 'front three-quarter standing view', false],
  ['periodized-cable-upright-row-wide-grip', 'Wide-Grip Cable Upright Row', 'core', 'Low cable station with straight bar', 'Stand facing the low pulley with a wide overhand grip and bar at the thighs.', 'Pull the bar upward to the lower chest while elbows lead slightly higher than the hands, then lower.', 'Elbows travel up and out only within a comfortable shoulder range.', 'Wide pronated grip; bilateral stance', ['middle deltoids', 'upper trapezius'], ['biceps'], ['abdominals', 'forearms'], 'front three-quarter cable view', false],
  ['periodized-standard-cable-face-pull', 'Standard Cable Face Pull', 'alternative', 'Cable station with rope at upper-chest height', 'Stand facing the pulley with a neutral rope grip, arms extended and ribs stacked.', 'Pull the rope toward the upper face while elbows move outward, stopping before the shoulders pinch.', 'Hands separate toward the temples; no external-rotation finish beyond control.', 'Neutral rope grip; staggered stance', ['rear deltoids', 'middle trapezius'], ['rhomboids'], ['rotator cuff', 'abdominals'], 'front three-quarter cable view', false],
  ['periodized-stick-deep-squat-pry', 'Supported Stick Deep Squat Pry', 'warmup', 'Light mobility stick used as a balance aid', 'Hold the stick vertically for support, feet slightly wider than hips and torso tall.', 'Sink into a comfortable squat and gently shift the knees side to side without collapsing the arches.', 'Knees track over toes; stick only assists balance.', 'Wide stance; two-hand or single-hand support', ['quadriceps', 'gluteus maximus'], ['adductors'], ['ankle stabilizers', 'abdominals'], 'front three-quarter floor view', false],
  ['periodized-stick-hamstring-stretch', 'Stick Hamstring Stretch', 'recovery', 'Light mobility stick used for balance', 'Stand with one heel lightly forward, toes up, stick vertical for balance and spine long.', 'Hinge toward the extended leg until a mild hamstring stretch is felt, then return upright.', 'Hips hinge; back stays long and range remains mild.', 'Staggered stance; hand on stick', ['hamstrings'], ['calves'], ['abdominals'], 'side three-quarter standing view', false],
  ['periodized-pigeon-pose', 'Pigeon Pose', 'recovery', 'Exercise mat', 'Set one shin forward on the mat, rear leg extended behind and pelvis supported as needed.', 'Lower the torso only as far as the front hip remains comfortable, then return upright.', 'Front hip stays square; no forced rotation.', 'Asymmetric floor position; hands support', ['gluteus medius', 'deep hip rotators'], ['gluteus maximus'], ['shoulder stabilizers'], 'front three-quarter floor view', false],
  ['periodized-supine-figure-four-stretch', 'Supine Figure-Four Stretch', 'recovery', 'Exercise mat', 'Lie on your back with one ankle crossed over the opposite thigh and both feet relaxed.', 'Draw the supporting thigh toward the chest until the crossed-hip stretch is mild, then release slowly.', 'Keep the pelvis heavy on the mat.', 'Supine crossed-leg position; hands behind thigh', ['gluteus maximus', 'deep hip rotators'], ['hamstrings'], ['abdominals'], 'top three-quarter floor view', false],
  ['periodized-bodyweight-air-squat', 'Bodyweight Air Squat', 'optional', 'Bodyweight on open floor', 'Stand with feet about shoulder-width, toes slightly out and arms forward for balance.', 'Bend the knees and hips to a comfortable depth, then stand by pressing through the whole foot.', 'Knees track over toes; chest stays balanced over mid-foot.', 'Bilateral stance; no external load', ['quadriceps', 'gluteus maximus'], ['adductors', 'hamstrings'], ['abdominals'], 'front three-quarter standing view', false],
  ['periodized-bodyweight-walking-lunge', 'Bodyweight Walking Lunge', 'optional', 'Bodyweight on open floor', 'Stand tall with feet hip-width and hands free for balance.', 'Step forward, lower the rear knee toward the floor, then push through the front foot to continue walking.', 'Front knee tracks over the mid-foot; torso remains tall.', 'Alternating unilateral stance; no external load', ['quadriceps', 'gluteus maximus'], ['hamstrings'], ['calves', 'abdominals'], 'front three-quarter walking view', false],
  ['periodized-bulgarian-split-squat-1-5-rep', 'Bulgarian Split Squat with 1.5-Rep Technique', 'optional', 'Flat bench and optional dumbbells', 'Rear foot rests on a bench, front foot stable and torso slightly inclined.', 'Lower to the bottom, rise halfway, lower again, then stand tall; that sequence counts as one rep.', 'Front heel stays grounded; half-rep occurs at the bottom.', 'Rear-foot-elevated split stance', ['quadriceps', 'gluteus maximus'], ['hamstrings', 'adductors'], ['abdominals', 'foot stabilizers'], 'front three-quarter bench view', false],
  ['periodized-jump-squat', 'Jump Squat', 'optional', 'Bodyweight on clear floor', 'Stand with feet shoulder-width and arms relaxed, landing area clear.', 'Descend to a partial squat, jump vertically, and land softly with knees tracking over toes.', 'Land quietly and reset before the next repetition.', 'Bilateral stance; no external load', ['quadriceps', 'gluteus maximus'], ['calves', 'hamstrings'], ['abdominals'], 'front three-quarter standing view', false],
  ['periodized-hollow-body-hold', 'Hollow Body Hold', 'optional', 'Exercise mat', 'Lie supine with arms overhead and legs extended, lower back gently contacting the mat.', 'Brace the abdomen and lift shoulders and heels slightly while maintaining the hollow shape.', 'Ribs stay down; reduce the lever if the low back lifts.', 'Supine bilateral position; arms overhead', ['rectus abdominis', 'transverse abdominis'], ['hip flexors'], ['obliques'], 'side three-quarter floor view', false],
  ['periodized-shallow-wall-sit-isometric-hold', 'Shallow Wall-Sit Isometric Hold', 'tendon', 'Wall', 'Stand with the back against a wall and feet forward, knees only slightly bent.', 'Brace gently and hold the shallow position while breathing normally, then stand up smoothly.', 'Maintain a comfortable knee angle; effort is steady, not maximal.', 'Bilateral stance; back supported by wall', ['quadriceps'], ['gluteus maximus'], ['patellar tendon', 'abdominals'], 'side three-quarter wall view', false],
  ['periodized-cable-standing-hip-abduction-review', 'Cable Standing Hip Abduction', 'alternative', 'Cable station with ankle cuff', 'Stand side-on to the low pulley with the cuff on the outside ankle and one hand supported.', 'Move the cuffed leg outward without leaning, then return slowly.', 'Leg moves laterally; pelvis stays level.', 'Single-leg stance; ankle-cuff resistance', ['gluteus medius'], ['tensor fasciae latae'], ['standing-leg hip stabilizers'], 'side three-quarter cable view', true],
  ['periodized-ab-wheel-rollout-review', 'Ab Wheel Rollout', 'alternative', 'Ab wheel and exercise mat', 'Kneel with the wheel under the shoulders, hips slightly tucked and hands on the handles.', 'Roll forward only while the ribs and pelvis stay connected, then pull the wheel back without collapsing.', 'Wheel travels forward; lumbar extension is limited.', 'Kneeling bilateral stance; neutral handle grip', ['rectus abdominis', 'transverse abdominis'], ['latissimus dorsi'], ['shoulders', 'hip flexors'], 'side three-quarter floor view', true],
];

const existingReuse = reuseDefinitions.map(([canonicalMovementId, displayName, sourceDay, sourceId, roles]) => {
  const found = findExisting(sourceId);
  if (!found) throw new Error(`Missing approved reuse source: ${sourceDay}/${sourceId}`);
  return {
    canonicalMovementId,
    displayName,
    roles,
    sourceDay,
    sourceCanonicalMovementId: sourceId,
    mappedRuntimeIds: [],
    equipmentStatus: 'approved exact mechanical reuse',
    imageSet: found.record.imageSet,
    sourceArtworkStatus: found.record.artworkStatus,
  };
});

const promptWrapper = (spec, phase) => `Use case: scientific educational fitness guidance.\nBrand system: Fitness 7.\n\nCreate one square instructional illustration for ${spec.displayName}, showing only the ${phase} position.\n\nSubject: One adult male athlete with realistic athletic proportions wearing black training clothes. Show one exercise, one pose, one phase, and the exact equipment below.\n\nEnvironment: Minimal charcoal Fitness 7 gym environment with restrained depth and subtle floor contact.\nEquipment: ${spec.equipment}\nBody position: ${phase === 'Start' ? spec.startPose : spec.movementPose}\nGrip and stance: ${spec.grip}\nMovement mechanics: ${spec.direction}\nAnatomy: Highlight ${spec.primaryTargets.join(', ')} with restrained Fitness 7 orange; ${spec.secondaryTargets.join(', ')} with muted blue; ${spec.stabilizers.join(', ')} subtly in grey-green. Do not hide posture, joints, or equipment.\nComposition: Square 1:1, full athlete and equipment visible, at least 10 percent clear margin, camera ${spec.camera}.\nStyle: Premium realistic 3D scientific fitness illustration, controlled studio lighting, charcoal, black, off-white, orange, muted blue, and grey-green palette.\n\nDo not include text, labels, logos, watermarks, split views, collages, neighboring poses, white backgrounds, decorative clutter, unrelated equipment, distorted anatomy, mirrored equipment, or cropped hands, feet, cables, bars, benches, weights, or machines.\nMovement-specific exclusions: ${spec.negativeConstraints.join('; ')}\n\nPhase: ${phase}. ${phase === 'Start' ? 'Show the stable position immediately before effort. Make setup, grip, stance, posture and resistance direction clear. Do not show peak contraction or movement arrows.' : 'Use the Start image as the identity reference. Keep the same athlete, clothing, equipment, camera, lighting and background. Show the clearest working position, visibly different from Start. Do not repeat the Start pose.'}\n\nOutput: standalone PNG, resized proportionally to 512x512 with charcoal padding. Never stretch or crop the athlete or equipment.`;

const generated = newDefinitions.map(([canonicalMovementId, displayName, role, equipment, startPose, movementPose, direction, grip, primaryTargets, secondaryTargets, stabilizers, camera, reviewOnly]) => {
  const spec = { canonicalMovementId, displayName, role, equipment, equipmentStatus: reviewOnly ? 'review-only excluded equipment' : 'specification frozen', startPose, movementPose, direction, grip, primaryTargets, secondaryTargets, stabilizers, camera, negativeConstraints: ['no unrelated equipment', 'no forced range', 'no cropped subject or equipment'] };
  return {
    ...spec,
    mappedRuntimeIds: [],
    reviewOnly,
    altText: { start: `Fitness 7 illustration: ${displayName} starting position`, movement: `Fitness 7 illustration: ${displayName} working position` },
    outputPaths: { start: `assets/exercises/periodized-v3/${canonicalMovementId}-v3-start.png`, movement: `assets/exercises/periodized-v3/${canonicalMovementId}-v3-movement.png` },
    startPrompt: promptWrapper(spec, 'Start'),
    movementPrompt: promptWrapper(spec, 'Movement'),
    generationStatus: 'not-started',
    technicalReviewStatus: 'pending',
    semanticReviewStatus: 'pending',
    humanCoachReviewStatus: 'pending',
  };
});

const aliasToCanonical = {
  'glute bridge': 'periodized-glute-bridge',
  'seated hip adductor machine': 'periodized-seated-hip-adductor-machine',
  'seated hip abductor machine': 'periodized-seated-hip-abductor-machine',
  'dumbbell glute bridge': 'periodized-dumbbell-glute-bridge',
  'single-leg hip thrust': 'periodized-single-leg-hip-thrust',
  'machine hip thrust': 'periodized-machine-hip-thrust',
  'wide-stance leg press': 'periodized-wide-stance-leg-press',
  'cable hip adduction': 'periodized-cable-hip-adduction',
  'sumo goblet squat': 'periodized-sumo-goblet-squat',
  'seated cable row to mid-torso': 'periodized-seated-cable-row',
  'seated cable row': 'periodized-seated-cable-row',
  'single-arm db row': 'periodized-single-arm-dumbbell-row',
  'single-arm dumbbell row': 'periodized-single-arm-dumbbell-row',
  'meadows row': 'periodized-meadows-row',
  'chest-supported t-bar row': 'periodized-chest-supported-t-bar-row',
  'machine row': 'periodized-machine-row',
  'cable standing abduction': 'periodized-cable-standing-hip-abduction-review',
  'side plank clamshell': 'periodized-side-plank-clamshell',
  'side plank clamshells': 'periodized-side-plank-clamshell',
  'dumbbell stiff-leg romanian deadlift': 'periodized-dumbbell-stiff-leg-romanian-deadlift',
  'dumbbell rdl': 'periodized-dumbbell-rdl',
  'single-leg db rdl': 'periodized-single-leg-dumbbell-rdl',
  'nordic curl negatives': 'periodized-nordic-curl-negatives',
  'nordic hamstring curls': 'periodized-nordic-hamstring-curl',
  'dumbbell shrugs with 2s pause': 'periodized-dumbbell-shrug',
  'dumbbell shrugs': 'periodized-dumbbell-shrug',
  'cable upright row (wide)': 'periodized-cable-upright-row-wide-grip',
  'cable upright row (wide-grip)': 'periodized-cable-upright-row-wide-grip',
  'barbell shrug': 'periodized-barbell-shrug',
  'barbell shrugs': 'periodized-barbell-shrug',
  'hex bar shrug': 'periodized-hex-bar-shrug',
  'stick deep squat prys': 'periodized-stick-deep-squat-pry',
  'stick good mornings': 'periodized-stick-good-mornings',
  'stick torso twists': 'periodized-stick-torso-twists',
  'stick hamstring stretch': 'periodized-stick-hamstring-stretch',
  'pigeon pose': 'periodized-pigeon-pose',
  'figure-four stretch': 'periodized-supine-figure-four-stretch',
  'bodyweight air squats': 'periodized-bodyweight-air-squat',
  'bodyweight walking lunges': 'periodized-bodyweight-walking-lunge',
  'walking lunges': 'periodized-bodyweight-walking-lunge',
  'bulgarian split squat 1.5 reps': 'periodized-bulgarian-split-squat-1-5-rep',
  'bulgarian split squats with 1.5 rep style': 'periodized-bulgarian-split-squat-1-5-rep',
  'step-ups': 'periodized-step-ups',
  'jump squats': 'periodized-jump-squat',
  'dead bug': 'periodized-dead-bug',
  'dragon flag negatives': 'periodized-dragon-flag-negatives',
  'dragon flag negatives on flat bench': 'periodized-dragon-flag-negatives',
  'hanging knee tuck': 'periodized-hanging-knee-tuck',
  'ab wheel rollout': 'periodized-ab-wheel-rollout-review',
  'hollow body hold': 'periodized-hollow-body-hold',
  'kas glute bridge': 'periodized-kas-glute-bridge',
  'conventional deadlift': 'periodized-conventional-barbell-deadlift',
  'romanian barbell deadlift': 'periodized-romanian-barbell-deadlift',
  'nordic hamstring curls': 'periodized-nordic-hamstring-curl',
  'cable upright row (wide-grip)': 'periodized-cable-upright-row-wide-grip',
  'face pulls': 'periodized-standard-cable-face-pull',
};

// Workbook rows are combined, but the member-facing artwork queue is atomic.
const splitRecords = [
  { sourceRuntimeId: 'biweekly-a-6-bodyweight-air-squats-to-walking-lunges-slot-7-biweekly-bodyweight-air-squats-to-walking-lunges', sourceName: 'Bodyweight Air Squats to Walking Lunges', splitInto: ['periodized-bodyweight-air-squat', 'periodized-bodyweight-walking-lunge'] },
  { sourceRuntimeId: 'biweekly-a-6-dead-bug-to-dragon-flag-negatives-slot-8-biweekly-dead-bug-to-dragon-flag-negatives', sourceName: 'Dead Bug to Dragon Flag Negatives', splitInto: ['periodized-dead-bug', 'periodized-dragon-flag-negatives'] },
];

const allRecords = [...existingReuse, ...generated];
const byId = new Map(allRecords.map(record => [record.canonicalMovementId, record]));
const occurrences = [];
for (const day of runtime.days.filter(item => item.dayIndex === 5)) {
  for (const role of ['warmup', 'coreSlots', 'optionalSlots', 'cardio', 'recovery']) {
    for (const item of day[role] || []) {
      const canonicalMovementId = aliasToCanonical[String(item.name || '').toLowerCase()];
      if (item.name?.startsWith('NO CARDIO')) {
        occurrences.push({ weekKey: day.weekKey, role, runtimeId: item.id, name: item.name, status: 'non-exercise-text-only', canonicalMovementId: null });
        continue;
      }
      if (item.name === 'Bodyweight Air Squats to Walking Lunges' || item.name === 'Dead Bug to Dragon Flag Negatives') {
        const split = splitRecords.find(record => record.sourceName === item.name);
        occurrences.push({ weekKey: day.weekKey, role, runtimeId: item.id, name: item.name, status: 'combined-row-split-required', canonicalMovementId: null, splitInto: split.splitInto });
        for (const canonicalMovementId of split.splitInto) byId.get(canonicalMovementId).mappedRuntimeIds.push(`${item.id}::split`);
        for (const alternative of item.alternatives || []) {
          const altCanonicalMovementId = aliasToCanonical[String(alternative).toLowerCase()];
          if (!altCanonicalMovementId) throw new Error(`Unmapped Saturday alternative: ${alternative}`);
          byId.get(altCanonicalMovementId).mappedRuntimeIds.push(`${item.id}::${alternative}`);
          occurrences.push({ weekKey: day.weekKey, role: 'alternative', runtimeId: `${item.id}::${alternative}`, name: alternative, canonicalMovementId: altCanonicalMovementId, treatment: byId.get(altCanonicalMovementId).reviewOnly ? 'review-only' : (existingReuse.some(r => r.canonicalMovementId === altCanonicalMovementId) ? 'reuse' : 'generate') });
        }
        continue;
      }
      if (!canonicalMovementId) throw new Error(`Unmapped Saturday item: ${item.name}`);
      byId.get(canonicalMovementId).mappedRuntimeIds.push(item.id);
      occurrences.push({ weekKey: day.weekKey, role, runtimeId: item.id, name: item.name, canonicalMovementId, treatment: byId.get(canonicalMovementId).reviewOnly ? 'review-only' : (existingReuse.some(r => r.canonicalMovementId === canonicalMovementId) ? 'reuse' : 'generate') });
      for (const alternative of item.alternatives || []) {
        const altKey = String(alternative).toLowerCase();
        const altCanonicalMovementId = aliasToCanonical[altKey];
        if (!altCanonicalMovementId) throw new Error(`Unmapped Saturday alternative: ${alternative}`);
        byId.get(altCanonicalMovementId).mappedRuntimeIds.push(`${item.id}::${alternative}`);
        occurrences.push({ weekKey: day.weekKey, role: 'alternative', runtimeId: `${item.id}::${alternative}`, name: alternative, canonicalMovementId: altCanonicalMovementId, treatment: byId.get(altCanonicalMovementId).reviewOnly ? 'review-only' : (existingReuse.some(r => r.canonicalMovementId === altCanonicalMovementId) ? 'reuse' : 'generate') });
      }
    }
  }
}

for (const record of allRecords) record.mappedRuntimeIds = [...new Set(record.mappedRuntimeIds)];
const reuseCount = existingReuse.length;
const reviewOnlyCount = generated.filter(record => record.reviewOnly).length;
const manifest = {
  version: 'periodized-abc-saturday-art-v3',
  day: 'Saturday',
  weekKeys: ['A', 'B', 'C'],
  rawPhysicalRuntimeRecords: 52,
  textOnlyRecords: 1,
  finalCanonicalSets: allRecords.length,
  reuseSets: reuseCount,
  newGenerationSets: generated.length,
  activeNewSets: generated.length - reviewOnlyCount,
  reviewOnlySets: reviewOnlyCount,
  imageFilesRequired: allRecords.length * 2,
  existingImageFilesReused: reuseCount * 2,
  newImageFilesRequired: generated.length * 2,
  canonicalMovements: allRecords,
  occurrences,
  splitRecords,
  aliases: aliasToCanonical,
  generationBatches: [
    { batch: 'B01', movementIds: generated.slice(0, 11).map(record => record.canonicalMovementId) },
    { batch: 'B02', movementIds: generated.slice(11, 21).map(record => record.canonicalMovementId) },
    { batch: 'B03', movementIds: generated.slice(21).map(record => record.canonicalMovementId) },
  ],
};

const reuseMap = {
  day: 'Saturday',
  rules: 'Reuse is allowed only when equipment, grip, stance, setup, joint path, working position and range match exactly.',
  approved: existingReuse.map(record => ({
    canonicalMovementId: record.canonicalMovementId,
    displayName: record.displayName,
    sourceDay: record.sourceDay,
    sourceCanonicalMovementId: record.sourceCanonicalMovementId,
    mappedRuntimeIds: record.mappedRuntimeIds,
    imageSet: record.imageSet,
    decision: 'reuse',
  })),
  rejectedSimilarities: [
    { saturday: 'Chest-Supported T-Bar Row', candidate: 'T-Bar Row', reason: 'Saturday requires a chest pad; existing T-Bar image is unsupported landmine/T-bar rowing.' },
    { saturday: 'Bodyweight Walking Lunge', candidate: 'Dumbbell Walking Lunges', reason: 'External load and arm position differ.' },
    { saturday: 'Stick Hamstring Stretch', candidate: 'Hamstring Stretch', reason: 'Stick-assisted standing hinge differs from floor stretch.' },
    { saturday: 'Standard Cable Face Pull', candidate: 'Cable Face Pull with External Rotation', reason: 'Shoulder rotation finish and hand path differ.' },
    { saturday: 'Supported Stick Deep Squat Pry', candidate: 'Stick Overhead Deep Squat Prys', reason: 'Stick position and support mechanics differ.' },
    { saturday: 'Dumbbell Stiff-Leg Romanian Deadlift', candidate: 'Dumbbell RDL', reason: 'Knee angle and hinge range are intentionally distinct.' },
    { saturday: 'Nordic Hamstring Curl', candidate: 'Nordic Curl Negatives', reason: 'Full return versus eccentric-only direction.' },
  ],
};

const audit = {
  day: 'Saturday',
  weekKeys: ['A', 'B', 'C'],
  roles: { warmup: 3, core: 12, alternatives: 22, optional: 8, cardio: 1, recovery: 3, tendon: 1 },
  findings: [
    'No Cardio is a text-only safeguard and is excluded from artwork.',
    'Two combined optional rows require atomic split records before runtime integration.',
    'Glute Bridge inherited barbell metadata from an excluded hip-thrust row; it is corrected to bodyweight floor bridge.',
    'Conventional Deadlift inherited bodyweight metadata; it is corrected to a barbell floor setup.',
    'Cable Standing Abduction and Ab Wheel Rollout are review-only excluded-equipment records.',
    'Machine Hip Thrust remains artwork-generation eligible but requires equipment confirmation before member activation.',
  ],
  counts: { rawPhysicalRuntimeRecords: 52, canonicalSets: allRecords.length, reuseSets: reuseCount, generateSets: generated.length, activeGenerateSets: generated.length - reviewOnlyCount, reviewOnlySets: reviewOnlyCount, newImages: generated.length * 2 },
  occurrences,
  splitRecords,
};

const validation = `# Saturday Artwork Audit\n\nCheckpoint: V541-SAT-02-SPECS-FROZEN\n\n- Raw physical runtime records: ${audit.counts.rawPhysicalRuntimeRecords}\n- Canonical sets: ${audit.counts.canonicalSets}\n- Approved Monday–Friday reuses: ${audit.counts.reuseSets} sets / ${audit.counts.reuseSets * 2} files\n- New generation queue: ${audit.counts.generateSets} sets / ${audit.counts.newImages} files\n- Active new sets: ${audit.counts.activeGenerateSets}\n- Review-only sets: ${audit.counts.reviewOnlySets}\n- Text-only records: 1 (No Cardio)\n\n## Checks\n\n- [x] Saturday A, B, repeated A and C occurrences enumerated\n- [x] Exact reuse checked against Monday–Friday V3 records\n- [x] Combined rows identified for atomic split\n- [x] Excluded/review-only equipment isolated\n- [x] Every canonical movement has a movement-specific Start and Movement specification\n- [x] Every generated record has a 512×512 output path contract\n- [ ] Image generation not started\n- [ ] Technical image validation pending generation\n- [ ] Semantic review pending generation\n- [ ] Human gym-coach approval pending\n\nNext gate: generate B01 only after reviewing the frozen specifications.\n`;

const repairQueue = `# Saturday Repair Queue\n\nNo generated images exist yet.\n\n- Confirm machine availability for Machine Hip Thrust before activation.\n- Keep Cable Standing Hip Abduction and Ab Wheel Rollout review-only.\n- Split combined rows during the later runtime integration pass.\n- Obtain human gym-coach review after technical and AI-assisted semantic checks.\n`;

const state = {
  project: 'Fitness 7 V5.4.1 Saturday V3 Artwork',
  branch: 'codex/v541-release',
  day: 'Saturday',
  weekKeys: ['A', 'B', 'C'],
  rawPhysicalRuntimeRecords: 52,
  finalCanonicalSets: allRecords.length,
  reuseSets: reuseCount,
  newGenerationSets: generated.length,
  newGenerationFiles: generated.length * 2,
  activeNewSets: generated.length - reviewOnlyCount,
  reviewOnlySets: reviewOnlyCount,
  completedSets: 0,
  completedFiles: 0,
  currentBatch: 'B01',
  currentMovementId: null,
  currentPhase: null,
  failedMovementIds: [],
  completedMovementIds: [],
  currentCheckpoint: 'V541-SAT-02-SPECS-FROZEN',
  lastCompletedCommit: '1f26045',
  nextAtomicAction: 'Generate Start for the first Saturday B01 movement after reviewing the frozen specification',
};

fs.writeFileSync(path.join(outDir, 'AUDIT.json'), JSON.stringify(audit, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'REUSE-MAP.json'), JSON.stringify(reuseMap, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'GENERATION-MANIFEST.json'), JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'VALIDATION.md'), validation);
fs.writeFileSync(path.join(outDir, 'REPAIR-QUEUE.md'), repairQueue);
fs.writeFileSync(path.join(outDir, 'STATE.json'), JSON.stringify(state, null, 2) + '\n');

console.log(JSON.stringify({ checkpoint: state.currentCheckpoint, canonicalSets: allRecords.length, reuseSets: reuseCount, generateSets: generated.length, newImages: generated.length * 2, reviewOnlySets: reviewOnlyCount }, null, 2));
