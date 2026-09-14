import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const existing = path.join(root, 'assets/exercises');
const target = path.join(existing, 'biweekly');
const context = { window: {} };
vm.createContext(context);
vm.runInContext(fs.readFileSync(path.join(root, 'data/biweekly-routine.js'), 'utf8'), context);
const source = context.window.GYM_COMPANION_BIWEEKLY_ROUTINE;
const map = {
  'Stick Standing Torso Twists': 'thoracic-rotations',
  'Stick Torso Twists': 'thoracic-rotations',
  'Stick Standing Trunk Rotations': 'thoracic-rotations',
  'Stick Trunk Rotations': 'thoracic-rotations',
  'Stick Spinal Twist': 'thoracic-rotations',
  'Stick High Knee Marches': 'standing-march',
  'Stick Lateral Leg Swings': 'hip-mobility',
  'Stick Hip Swings': 'hip-mobility',
  'Stick Good Mornings': 'hip-hinge-drill',
  'Stick Deep Squat Prys': 'bodyweight-squat',
  'Stick Overhead Deep Squat Prys': 'bodyweight-squat',
  'Stick Overhead Deep Squats': 'bodyweight-squat',
  'Stick Quad Stretch': 'quad-stretch',
  'Stick Hamstring Stretch': 'hamstring-stretch',
  'Stick Doorway Chest Stretch': 'doorway-pec-stretch',
  'Doorway Stretch': 'doorway-pec-stretch',
  'Cat-Cow Mobility': 'cat-cow',
  'Stick Overhead Lat Stretch': 'lat-stretch',
  'Overhead Lat Lengthener': 'lat-stretch',
  'Stick Lat Stretch': 'lat-stretch',
  'Cobra Pose': 'chest-opener',
  'Cross-Body Stretch': 'shoulder-mobility',
  'Stick Shoulder Dislocates': 'shoulder-mobility',
  'Stick Dislocates': 'shoulder-mobility',
  'Stick Around-the-Worlds': 'shoulder-mobility',
  'Stick Overhead Thoracic Spine Extensions': 'thoracic-rotations',
  'Stick Overhead Thoracic Extensions': 'thoracic-rotations',
  'Stick Behind-the-Back Chest Opener': 'chest-opener',
  'Stick Behind-the-Back Opener': 'chest-opener',
  'Stick Overhead Side Stretch': 'lat-stretch',
  'Stick Standing Overhead Side Stretch': 'lat-stretch',
  'Stick Overhead Side Bends': 'lat-stretch',
  'Stick Overhead Lateral Side Bends': 'lat-stretch',
  '15 Min LISS Incline Walk (Speed 3.8 km/h, Incline 9%)': 'incline-treadmill-walk',
  'Incline Walk': 'incline-treadmill-walk',
  'Intervals': 'treadmill-run-walk-intervals'
};
const slugify = value => String(value ?? '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const seen = new Set();
for (const day of source.days || []) for (const items of [day.warmup, day.recovery, day.cardio]) for (const item of items || []) {
  const base = map[item.name]; if (!base || seen.has(item.name)) continue;
  const paths = {};
  for (const phase of ['setup', 'move', 'return']) {
    const src = path.join(existing, `${base}-phase-${phase}.png`);
    const dest = path.join(target, `biweekly-${slugify(item.name)}-phase-${phase}.png`);
    if (!fs.existsSync(src)) continue;
    fs.copyFileSync(src, dest); paths[phase] = dest;
  }
  if (Object.keys(paths).length === 3) { seen.add(item.name); console.log(`Linked approved exact guided artwork: ${item.name} <- ${base}`); }
}
