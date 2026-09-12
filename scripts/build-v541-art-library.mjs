import { readFile, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const promptManifest = JSON.parse(await readFile(path.join(root, '.codex/v54/art-v2-pilot/PROMPT-MANIFEST.json'), 'utf8'));
const runtimeMap = JSON.parse(await readFile(path.join(root, 'data/periodized-v2-runtime-map.json'), 'utf8'));
const promptByRow = new Map(promptManifest.records.map(record => [record.row, record]));
const contentOverrides = {
  6: {
    equipment: 'Dual cable station with two single handles',
    startInstruction: 'Set both pulleys at mid-chest height. Take one handle in each hand, step forward into a staggered stance, brace the trunk, and keep elbows softly bent.',
    movementInstruction: 'Press both handles forward and slightly inward until the hands meet in front of the chest. Keep the ribs stacked and return until the elbows are just behind the torso.'
  },
  9: {
    equipment: 'Dual cable station with pulleys above shoulder height',
    startInstruction: 'Set both pulleys above shoulder height. Step forward with a staggered stance and open the arms with a soft elbow bend.',
    movementInstruction: 'Sweep the handles down and inward toward the lower chest or upper abdomen. Pause briefly, then return along the same arc without shrugging.'
  },
  24: {
    equipment: 'Olympic barbell and lifting platform',
    startInstruction: 'Stand with the bar over mid-foot, feet about hip-width apart. Hinge down, grip just outside the shins, brace the trunk, and keep the bar close.',
    movementInstruction: 'Push the floor away and extend the knees and hips together until standing tall. Keep the bar close and do not lean back at lockout.'
  },
  27: {
    equipment: 'One dumbbell and exercise mat',
    startInstruction: 'Lie on the floor with knees bent and feet planted. Place one dumbbell securely across the front of the hips and hold it with both hands.',
    movementInstruction: 'Drive through the whole foot and lift the hips until the trunk and thighs form a straight line. Pause with the ribs down, then lower under control.'
  },
  30: {
    equipment: 'Pull-up bar',
    startInstruction: 'Hang from a pull-up bar with a comfortable overhand grip. Set the shoulders, keep the legs still, and lightly brace the abdomen.',
    movementInstruction: 'Curl the pelvis and lift the bent knees toward the lower ribs without swinging. Lower until the body is quiet before the next repetition.'
  },
  35: {
    equipment: 'Open floor space; no equipment',
    startInstruction: 'Stand, sit, or kneel tall. Exhale gently until the ribs settle, then keep the spine long and shoulders relaxed.',
    movementInstruction: 'Draw the lower abdomen inward without rounding the back. Hold briefly while taking small controlled breaths, then release fully.'
  },
  40: {
    equipment: '45° back-extension bench',
    startInstruction: 'Set the pad below the hip crease and secure the feet. Fold forward from the hips with a long spine and arms crossed over the chest.',
    movementInstruction: 'Extend through the hips until the body forms one straight line. Hold without arching past neutral or throwing the head back.'
  }
};

const equipmentByName = name => {
  if (/smith/i.test(name)) return 'Smith machine and incline bench';
  if (/cable|pallof|woodchopper|pulldown|face pull/i.test(name)) return 'Cable station with the exercise-specific attachment';
  if (/leg press/i.test(name)) return '45° leg press machine';
  if (/adductor|abductor/i.test(name)) return `${name} machine`;
  if (/leg curl/i.test(name)) return 'Prone lying leg curl machine';
  if (/barbell|back squat|deadlift/i.test(name)) return 'Barbell and appropriate rack or lifting platform';
  if (/dumbbell|hex press|walking lunge/i.test(name)) return 'Dumbbells and bench where shown';
  if (/stick/i.test(name)) return 'Light mobility stick';
  if (/hanging/i.test(name)) return 'Pull-up bar';
  if (/plank|vacuum|side plank/i.test(name)) return 'Exercise mat';
  if (/back extension/i.test(name)) return '45° back-extension bench';
  return 'Fitness 7 gym equipment shown in the illustration';
};

const movements = {};
for (const mapping of runtimeMap) {
  const source = promptByRow.get(mapping.row);
  if (!source) throw new Error(`Missing prompt row ${mapping.row}`);
  const override = contentOverrides[mapping.row] || {};
  const base = `assets/exercises/periodized-v2/${mapping.assetId}-v2`;
  movements[mapping.assetId] = {
    stableMovementId: mapping.assetId,
    runtimeIds: mapping.runtimeIds,
    name: mapping.name,
    sourceRow: mapping.row,
    sourceName: source.sourceName,
    category: source.category,
    equipment: override.equipment || equipmentByName(mapping.name),
    primaryTargets: String(source.primaryMuscles || '').split(',').map(value => value.trim()).filter(Boolean),
    secondaryTargets: String(source.secondaryMuscles || '').split(',').map(value => value.trim()).filter(Boolean),
    stabilizers: String(source.stabilizers || '').split(',').map(value => value.trim()).filter(Boolean),
    startInstruction: override.startInstruction || source.startInstruction,
    movementInstruction: override.movementInstruction || source.movementInstruction,
    directionCue: 'Follow the Start and Movement positions shown; return under control.',
    imageSet: { start: `${base}-start.png`, movement: `${base}-movement.png` },
    altStart: `Fitness 7 illustration: ${mapping.name} starting position`,
    altMovement: `Fitness 7 illustration: ${mapping.name} working position`,
    artworkStatus: 'complete',
    visualReviewStatus: 'technical-pass',
    semanticReviewStatus: 'needs-human-review',
    assetVersion: 'periodized-abc-art-v2'
  };
}

const payload = {
  key: 'periodized-v2-pilot',
  label: 'A–B–A–C V2 Artwork Library',
  planVersion: 'periodized-abc-v2-pilot',
  targetSets: runtimeMap.length,
  completedSets: Object.keys(movements).length,
  runtimeMappedSets: new Set(runtimeMap.flatMap(item => item.runtimeIds)).size,
  movements
};
const output = `window.GYM_COMPANION_PERIODIZED_V2_PILOT = ${JSON.stringify(payload, null, 2)};\n`;
await writeFile(path.join(root, 'data/periodized-v2-pilot.js'), output);
console.log(`Built ${payload.completedSets} V2 sets with ${payload.runtimeMappedSets} explicit runtime identity mappings.`);
