import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const dir = path.join(root, '.codex/v541/artwork-v3/friday');
fs.mkdirSync(dir, { recursive: true });
const out = id => `assets/exercises/periodized-v3/${id}-v3-`;
const alt = name => ({ start: `Fitness 7 illustration: ${name} starting position`, movement: `Fitness 7 illustration: ${name} working position` });
const makePrompt = (name, equipment, phase, pose, direction) => `Use case: scientific educational fitness guidance. Brand system: Fitness 7. Create one square instructional illustration for ${name}, showing only the ${phase} phase. One adult male athlete in black training clothes. Minimal charcoal gym environment, off-white athlete and equipment, restrained orange primary-muscle emphasis, muted-blue secondary-muscle emphasis, grey-green stabilizers. Equipment: ${equipment}. Phase position: ${pose}. Movement mechanics: ${direction}. Full athlete and equipment visible with at least 10% clear margin. Square 1:1, exactly 512x512 PNG after proportional contain-resize. No text, labels, logos, watermarks, white background, split view, collage, unrelated equipment, distorted anatomy, or cropped hands, feet, cables, bars, benches, weights, or machines.`;
const specs = [
  ['periodized-stick-standing-trunk-rotation','Stick Standing Trunk Rotation','warmup,core','straight mobility stick across upper back, wide overhand grip','stick across upper back; feet shoulder-width; torso upright','rotate torso from neutral while hips and feet stay stable'],
  ['periodized-standing-cable-woodchopper-low-to-high','Standing Cable Woodchopper, Low-to-High','coreSlots,alternative','low cable with D-handle','split stance, handle near outside hip','sweep handle diagonally upward across the body without turning the hips'],
  ['periodized-floor-reverse-crunch-with-pelvic-tilt','Floor Reverse Crunch with Pelvic Tilt','coreSlots,alternative','exercise mat, bodyweight','supine, knees bent, arms beside body','curl pelvis upward using abdominal control; do not swing the legs'],
  ['periodized-stick-overhead-lateral-side-bend','Stick Overhead Lateral Side Bend','coreSlots','straight mobility stick overhead','feet planted, elbows extended, ribs stacked','lean trunk laterally through a comfortable range without rotating'],
  ['periodized-standard-forearm-plank','Standard Forearm Plank','coreSlots,alternative','exercise mat, bodyweight','elbows under shoulders, straight body line','hold neutral alignment with ribs down and glutes lightly braced'],
  ['periodized-rkc-hardstyle-plank','RKC Hardstyle Plank','coreSlots,alternative','exercise mat, bodyweight','forearms down, toes tucked, shoulders over elbows','actively squeeze glutes and pull elbows toward toes without moving them'],
  ['periodized-extended-plank','Extended Plank','alternative','exercise mat, bodyweight','hands forward of shoulders, legs extended','maintain a long body line while resisting lower-back extension'],
  ['periodized-hanging-windshield-wipers','Hanging Windshield Wipers','alternative','fixed pull-up bar','arms straight, legs together hanging','rotate straight legs side to side under control; avoid swinging'],
  ['periodized-dragon-flag-negatives','Dragon Flag Negatives','alternative','flat bench with hands gripping behind head','shoulders supported, body straight, legs together','lower the rigid body slowly toward the bench while keeping hips extended'],
  ['periodized-decline-leg-raise','Decline Bench Leg Raise','alternative','decline bench, hands holding bench supports','supine on decline bench, legs straight','raise legs by posteriorly tilting the pelvis, then control the descent'],
  ['periodized-cat-cow-mobility','Cat-Cow Mobility','recovery','exercise mat, bodyweight','quadruped hands under shoulders, knees under hips','alternate gentle spinal flexion and extension within a pain-free range'],
  ['periodized-childs-pose','Child’s Pose','recovery','exercise mat, bodyweight','hips toward heels, arms reaching forward','breathe into a comfortable back and hip stretch without forcing range'],
  ['periodized-landmine-rotations','Landmine Rotations','alternative','barbell anchored in a landmine sleeve','both hands on bar end, feet shoulder-width','guide the bar in an arc from one hip toward the opposite shoulder'],
  ['periodized-cable-side-crunch-on-mat','Kneeling Cable Side Crunch on Mat','alternative','high cable with rope attachment and exercise mat','kneel side-on, rope beside head, hips stacked','shorten the side of the trunk toward the cable while hips remain still'],
  ['periodized-dead-bug','Dead Bug','coreSlots,alternative','exercise mat, bodyweight','supine, hips and knees at 90 degrees, arms vertical','extend opposite arm and leg while keeping ribs and lower back controlled'],
  ['periodized-bicycle-kicks','Bicycle Kicks','alternative','exercise mat, bodyweight','supine, hands lightly behind head, knees bent','alternate opposite elbow toward knee without pulling the neck'],
  ['periodized-decline-bench-russian-twists','Decline Bench Russian Twists','alternative','decline bench, bodyweight','seated on decline bench, hands together, feet anchored','rotate ribcage side to side while keeping the pelvis controlled']
];
const generationQueue = specs.map(([id,name,role,equipment,startPose,movementPose], i) => ({
  order:i+1, canonicalMovementId:id, displayName:name, day:'Friday', weekKeys:['A','B','C'], role, equipment, equipmentStatus:'review-before-generation',
  status:'generate', outputPaths:{start:out(id)+'start.png',movement:out(id)+'movement.png'},
  startPrompt:makePrompt(name,equipment,'Start',startPose,'stable setup before the repetition begins'),
  movementPrompt:makePrompt(name,equipment,'Movement',movementPose,'clear working position with controlled direction'), altText:alt(name), technicalReviewStatus:'pending', semanticReviewStatus:'pending', humanCoachReviewStatus:'pending', generationStatus:'not-started'
}));
const reuse = [
  ['periodized-stick-around-the-worlds','Stick Around-the-Worlds','assets/exercises/periodized-v3/biweekly-stick-around-the-worlds-v3-start.png','assets/exercises/periodized-v3/biweekly-stick-around-the-worlds-v3-movement.png','Monday V3'],
  ['periodized-hanging-leg-raise','Hanging Leg Raise','assets/exercises/periodized-v3/biweekly-hanging-straight-leg-raise-v3-start.png','assets/exercises/periodized-v3/biweekly-hanging-straight-leg-raise-v3-movement.png','Monday V3'],
  ['periodized-lying-leg-lift','Lying Leg Lift','assets/exercises/periodized-v3/periodized-floor-leg-raise-v3-start.png','assets/exercises/periodized-v3/periodized-floor-leg-raise-v3-movement.png','Monday V3'],
  ['periodized-incline-bench-reverse-crunch','Incline Bench Reverse Crunch with Pelvic Curl','assets/exercises/periodized-v3/periodized-incline-reverse-crunch-v3-start.png','assets/exercises/periodized-v3/periodized-incline-reverse-crunch-v3-movement.png','Monday V3'],
  ['periodized-russian-twists','Russian Twists','assets/exercises/periodized-v3/periodized-floor-bodyweight-twist-v3-start.png','assets/exercises/periodized-v3/periodized-floor-bodyweight-twist-v3-movement.png','Tuesday V3'],
  ['periodized-knee-tuck','Knee Tuck','assets/exercises/periodized-v3/periodized-hanging-knee-raise-v3-start.png','assets/exercises/periodized-v3/periodized-hanging-knee-raise-v3-movement.png','Tuesday V3'],
  ['periodized-stick-russian-twists','Stick Russian Twists','assets/exercises/periodized-v3/biweekly-stick-seated-russian-twists-v3-start.png','assets/exercises/periodized-v3/biweekly-stick-seated-russian-twists-v3-movement.png','Tuesday V3'],
  ['periodized-stick-lateral-side-bends','Stick Lateral Side Bends','assets/exercises/periodized-v3/biweekly-stick-standing-lateral-side-bends-v3-start.png','assets/exercises/periodized-v3/biweekly-stick-standing-lateral-side-bends-v3-movement.png','Tuesday V3'],
  ['periodized-stick-side-bends','Stick Side Bends','assets/exercises/periodized-v3/biweekly-stick-standing-lateral-side-bends-v3-start.png','assets/exercises/periodized-v3/biweekly-stick-standing-lateral-side-bends-v3-movement.png','Tuesday V3'],
  ['periodized-cable-side-crunch','Cable Side Crunch','assets/exercises/periodized-v3/periodized-cable-side-crunch-v3-start.png','assets/exercises/periodized-v3/periodized-cable-side-crunch-v3-movement.png','Tuesday V3'],
  ['periodized-side-plank-hip-dips','Side Plank Hip Dips','assets/exercises/periodized-v3/periodized-side-plank-hip-dips-v3-start.png','assets/exercises/periodized-v3/periodized-side-plank-hip-dips-v3-movement.png','Tuesday V3'],
  ['periodized-light-db-side-bend','Light DB Side Bend','assets/exercises/periodized-v3/periodized-db-side-bend-v3-start.png','assets/exercises/periodized-v3/periodized-db-side-bend-v3-movement.png','Tuesday V3'],
  ['periodized-quadruped-vacuum','Quadruped Vacuum','assets/exercises/periodized-v3/periodized-quadruped-vacuum-v3-start.png','assets/exercises/periodized-v3/periodized-quadruped-vacuum-v3-movement.png','Tuesday V3'],
  ['periodized-lying-vacuum','Lying Vacuum','assets/exercises/periodized-v3/periodized-lying-vacuum-v3-start.png','assets/exercises/periodized-v3/periodized-lying-vacuum-v3-movement.png','Tuesday V3'],
  ['periodized-plank-vacuum','Plank Vacuum','assets/exercises/periodized-v3/periodized-plank-vacuum-v3-start.png','assets/exercises/periodized-v3/periodized-plank-vacuum-v3-movement.png','Tuesday V3'],
  ['periodized-standing-stomach-vacuum','Standing Stomach Vacuum','assets/exercises/periodized-v3/periodized-standing-stomach-vacuum-v3-start.png','assets/exercises/periodized-v3/periodized-standing-stomach-vacuum-v3-movement.png','Tuesday V3'],
  ['periodized-seated-stomach-vacuum','Seated Stomach Vacuum','assets/exercises/periodized-v3/periodized-seated-stomach-vacuum-v3-start.png','assets/exercises/periodized-v3/periodized-seated-stomach-vacuum-v3-movement.png','Tuesday V3'],
  ['periodized-elliptical-intervals','Elliptical Intervals','assets/exercises/periodized-v3/periodized-elliptical-intervals-v3-start.png','assets/exercises/periodized-v3/periodized-elliptical-intervals-v3-movement.png','Tuesday V3'],
  ['periodized-bike-sprint-intervals','Stationary Bike Sprint Intervals','assets/exercises/periodized-v3/periodized-bike-sprint-intervals-v3-start.png','assets/exercises/periodized-v3/periodized-bike-sprint-intervals-v3-movement.png','Tuesday V3'],
  ['periodized-incline-walk','Incline Walk','assets/exercises/periodized-v3/biweekly-15-min-liss-incline-walk-speed-3-8-km-h-incline-9-v3-start.png','assets/exercises/periodized-v3/biweekly-15-min-liss-incline-walk-speed-3-8-km-h-incline-9-v3-movement.png','Monday V3'],
  ['periodized-stick-lat-oblique-reach','Stick Lat & Oblique Reach','assets/exercises/periodized-v3/biweekly-stick-lat-stretch-v3-start.png','assets/exercises/periodized-v3/biweekly-stick-lat-stretch-v3-movement.png','Thursday V3'],
  ['tendon-wrist-extensor-isometric','Wrist Extensor Isometric','assets/exercises/periodized-v3/tendon-wrist-extensor-isometric-v3-start.png','assets/exercises/periodized-v3/tendon-wrist-extensor-isometric-v3-movement.png','Monday V3']
].map(([runtimeId,name,start,movement,source])=>({runtimeId,name,imageSet:{start,movement,source},status:'reuse-approved-after-mechanics-review'}));
const audit={day:'Friday',weekKeys:['A','B','C'],rawRuntimeLabels:43,finalCanonicalSets:39,reuseSets:22,newGenerationSets:17,newGenerationFiles:34,textOnlyRecords:0,notes:['Week C repeats Week A mechanics.','Expert vacuum resolves to Seated Stomach Vacuum.','Intervals resolve by tier to Elliptical, Incline Treadmill, or Stationary Bike.','All older periodized files are review-only and are not final Friday V3 assets.']};
const state={project:'Fitness 7 V5.4.1 Friday V3 artwork',branch:'codex/v541-release',day:'Friday',weekKeys:['A','B','C'],rawRuntimeLabels:43,finalCanonicalSets:39,reuseSets:22,newGenerationSets:17,newGenerationFiles:34,completedSets:0,completedFiles:0,remainingSets:17,remainingFiles:34,currentBatch:'B01',currentMovementId:null,currentPhase:null,failedMovementIds:[],completedMovementIds:[],currentCheckpoint:'V541-FRI-00-AUDIT-FROZEN',lastCompletedCommit:'',nextAtomicAction:'Verify REUSE-MAP.json paths and freeze Friday movement specifications'};
fs.writeFileSync(path.join(dir,'AUDIT.json'),JSON.stringify(audit,null,2)+'\n');
fs.writeFileSync(path.join(dir,'REUSE-MAP.json'),JSON.stringify({day:'Friday',approved:reuse,rule:'Reuse only when equipment, grip, stance, joint path, range and intent match exactly.'},null,2)+'\n');
fs.writeFileSync(path.join(dir,'GENERATION-MANIFEST.json'),JSON.stringify({schemaVersion:'fitness7-friday-v3-artwork-v1',day:'Friday',generationQueue},null,2)+'\n');
fs.writeFileSync(path.join(dir,'VALIDATION.md'),'# Friday V3 artwork validation\n\nAudit frozen. New generation queue: 17 pairs / 34 files. Existing reuses require exact mechanics verification. AI semantic review and human gym-coach review remain pending.\n');
fs.writeFileSync(path.join(dir,'REPAIR-QUEUE.md'),'# Friday repair queue\n\nNo generated pairs yet.\n');
fs.writeFileSync(path.join(dir,'STATE.json'),JSON.stringify(state,null,2)+'\n');
console.log('Prepared Friday audit: 39 canonical sets, 22 reuses, 17 new pairs.');
