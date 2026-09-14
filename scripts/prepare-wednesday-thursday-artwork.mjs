import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';

const root = process.cwd();
const context = { window: {} };
for (const file of [
  'data/biweekly-routine.js',
  'data/periodized-abc.js',
  'data/periodized-v3-tuesday-artwork.js',
  'data/periodized-v3-monday-artwork.js'
]) {
  vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);
}

const tuesday = context.window.GYM_COMPANION_PERIODIZED_V3_TUESDAY_ARTWORK;
const monday = context.window.GYM_COMPANION_PERIODIZED_V3_MONDAY_ARTWORK;
const plan = context.window.GYM_COMPANION_PERIODIZED_ABC;

const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const sourcePath = relative => path.join(root, relative);
const info = relative => {
  if (!relative || !fs.existsSync(sourcePath(relative))) return { path: relative || null, exists: false };
  const data = fs.readFileSync(sourcePath(relative));
  return {
    path: relative,
    exists: true,
    width: data.readUInt32BE(16),
    height: data.readUInt32BE(20),
    sha256: crypto.createHash('sha256').update(data).digest('hex')
  };
};

// These are the approved day-wise production scopes. They intentionally do not
// include every hidden historical alternative in the source workbook.
const daySpecs = {
  Wednesday: [
    ['biweekly-seated-hip-adductor-machine', 'Seated Hip Adductor Machine', 'main', 'hip-adductor machine'],
    ['biweekly-seated-hip-abductor-machine', 'Seated Hip Abductor Machine', 'main', 'hip-abductor machine'],
    ['biweekly-dumbbell-romanian-deadlift-rdl', 'Dumbbell Romanian Deadlift (RDL)', 'main', 'dumbbells'],
    ['biweekly-45-incline-leg-press-mid-stance', '45° Incline Leg Press (Mid-Stance)', 'main', '45-degree leg press machine'],
    ['biweekly-lying-leg-curl-machine', 'Lying Leg Curl Machine', 'main', 'lying leg-curl machine'],
    ['biweekly-dumbbell-walking-lunges', 'Dumbbell Walking Lunges', 'main', 'dumbbells'],
    ['periodized-wide-stance-sumo-goblet-squat', 'Wide-Stance Sumo Goblet Squat', 'alternative', 'single dumbbell'],
    ['periodized-cable-hip-adduction', 'Cable Hip Adduction', 'alternative', 'low cable with ankle cuff'],
    ['periodized-side-lying-adduction', 'Side-Lying Adduction', 'alternative', 'exercise mat'],
    ['periodized-side-plank-abduction', 'Side Plank Abduction', 'alternative', 'exercise mat'],
    ['periodized-barbell-rdl', 'Barbell Romanian Deadlift', 'alternative', 'barbell and rack'],
    ['periodized-cable-pull-through', 'Cable Pull-Through', 'alternative', 'low cable with rope'],
    ['periodized-goblet-squat-to-box', 'Goblet Squat to Box', 'alternative', 'dumbbell and box'],
    ['periodized-bodyweight-box-squat', 'Bodyweight Box Squat', 'alternative', 'box and open floor'],
    ['periodized-dumbbell-lying-leg-curl', 'Dumbbell Lying Leg Curl', 'alternative', 'single dumbbell and mat'],
    ['periodized-deficit-bulgarian-split-squat', 'Deficit Bulgarian Split Squat', 'alternative', 'dumbbells and low platform'],
    ['periodized-step-ups-on-bench', 'Step-Ups on Bench', 'alternative', 'bench and optional dumbbells'],
    ['periodized-reverse-lunges', 'Reverse Lunges', 'alternative', 'open floor and optional dumbbells'],
    ['biweekly-stick-overhead-deep-squat-prys', 'Stick Overhead Deep Squat Prys', 'warmup', 'light mobility stick'],
    ['biweekly-stick-good-mornings', 'Stick Good Mornings', 'warmup', 'light mobility stick'],
    ['biweekly-stick-lateral-leg-swings', 'Stick Lateral Leg Swings', 'warmup', 'light mobility stick and support'],
    ['biweekly-stick-quad-stretch', 'Stick Quad Stretch', 'recovery', 'light mobility stick and support'],
    ['biweekly-butterfly-groin-stretch', 'Butterfly Groin Stretch', 'recovery', 'exercise mat'],
    ['biweekly-hamstring-stretch', 'Hamstring Stretch', 'recovery', 'exercise mat'],
    ['biweekly-no-cardio-safeguard-knee-cns-recovery', 'NO CARDIO (Safeguard Knee & CNS Recovery)', 'status', 'text-only status']
  ],
  Thursday: [
    ['biweekly-seated-dumbbell-overhead-shoulder-press', 'Seated Dumbbell Overhead Shoulder Press', 'main', 'back-supported bench and dumbbells'],
    ['biweekly-close-grip-v-bar-lat-pulldown', 'Close-Grip V-Bar Lat Pulldown', 'main', 'lat-pulldown station with V-bar'],
    ['biweekly-seated-wide-grip-cable-row', 'Seated Wide-Grip Cable Row', 'main', 'seated cable row with wide bar'],
    ['periodized-cable-fly', 'Cable Fly', 'main', 'dual adjustable cable station'],
    ['biweekly-incline-dumbbell-curl', 'Incline Dumbbell Curl', 'main', 'incline bench and dumbbells'],
    ['periodized-incline-dumbbell-reverse-fly', 'Incline Dumbbell Reverse Fly', 'main', 'incline bench and dumbbells'],
    ['periodized-machine-shoulder-press', 'Machine Shoulder Press', 'alternative', 'shoulder-press machine'],
    ['periodized-arnold-press', 'Arnold Press', 'alternative', 'dumbbells and bench'],
    ['periodized-standing-barbell-overhead-press', 'Standing Barbell Overhead Press', 'alternative', 'barbell and rack'],
    ['periodized-underhand-lat-pulldown', 'Underhand Lat Pulldown', 'alternative', 'lat-pulldown station with underhand bar'],
    ['periodized-chin-ups', 'Chin-Ups', 'alternative', 'fixed pull-up bar'],
    ['periodized-single-arm-cable-pulldown', 'Single-Arm Cable Pulldown', 'alternative', 'single-handle cable station'],
    ['periodized-incline-db-prone-row', 'Incline DB Prone Row', 'alternative', 'incline bench and dumbbells'],
    ['periodized-standing-cable-crossover', 'Standing Cable Crossover', 'alternative', 'dual adjustable cable station'],
    ['periodized-dumbbell-incline-fly', 'Dumbbell Incline Fly', 'alternative', 'incline bench and dumbbells'],
    ['periodized-rope-tricep-pressdown', 'Rope Tricep Pressdown', 'alternative', 'high cable with rope'],
    ['periodized-ez-bar-curl-skullcrushers', 'EZ-Bar Curl & Skullcrushers', 'alternative', 'EZ-bar and flat bench'],
    ['periodized-cable-hammer-curl-dips', 'Cable Hammer Curl & Dips', 'alternative', 'cable station and dip handles'],
    ['periodized-concentration-curls', 'Concentration Curls', 'alternative', 'dumbbell and bench'],
    ['periodized-incline-prone-db-reverse-fly', 'Incline Prone DB Reverse Fly', 'alternative', 'incline bench and dumbbells'],
    ['biweekly-stick-behind-the-back-chest-opener', 'Stick Behind-the-Back Chest Opener', 'reuse', 'light mobility stick'],
    ['biweekly-stick-dislocates', 'Stick Dislocates', 'warmup', 'light mobility stick'],
    ['biweekly-stick-lat-stretch', 'Stick Lat Stretch', 'warmup-recovery', 'light mobility stick'],
    ['biweekly-15-min-liss-incline-walk-speed-3-8-km-h-incline-9', '15 Min LISS Incline Walk (Speed 3.8 km/h, Incline 9%)', 'reuse', 'treadmill'],
    ['biweekly-stick-doorway-chest-stretch', 'Stick Doorway Chest Stretch', 'recovery', 'light mobility stick and doorway'],
    ['biweekly-cross-body-stretch', 'Cross-Body Stretch', 'recovery', 'exercise mat'],
    ['periodized-t-bar-row', 'T-Bar Row', 'reuse', 'T-bar row machine'],
    ['periodized-chest-supported-machine-row', 'Chest-Supported Machine Row', 'reuse', 'chest-supported row machine'],
    ['periodized-low-incline-cable-fly', 'Low Incline Cable Fly', 'reuse', 'dual adjustable cable station'],
    ['periodized-parallel-bar-dips', 'Parallel Bar Dips', 'reuse', 'parallel dip bars']
  ]
};

const mondayReuseIds = new Set([
  'periodized-t-bar-row',
  'periodized-chest-supported-machine-row',
  'periodized-low-incline-cable-fly',
  'periodized-parallel-bar-dips',
  'biweekly-stick-behind-the-back-chest-opener',
  'biweekly-15-min-liss-incline-walk-speed-3-8-km-h-incline-9'
]);

const tuesdayRecords = Object.values(tuesday?.movements || {});
const tuesdayRuntimeMap = tuesday?.runtimeMap || {};
const mondayRecords = monday?.movements || {};
const mondayPathFor = id => {
  const record = mondayRecords[id];
  if (!record?.imageSet) return null;
  return { start: record.imageSet.start, movement: record.imageSet.movement, source: 'Monday V3' };
};

function exactTuesdayCandidates(item) {
  return tuesdayRecords.filter(record => {
    const sameName = record.name === item.name;
    const sameSlug = record.stableMovementId === item.id;
    return sameName || sameSlug;
  }).map(record => ({
    canonicalMovementId: record.stableMovementId,
    name: record.name,
    equipment: record.equipment,
    imageSet: record.imageSet,
    mappedRuntimeIds: record.mappedRuntimeIds || [],
    status: 'name-or-id-match-requires-mechanics-review'
  }));
}

function promptFor(item, phase) {
  const start = phase === 'start';
  const direction = /row|pulldown|curl|press|fly|raise|squat|lunge|deadlift|rdl|step|adduction|abduction|stretch|swing|walk/i.test(item.name)
    ? `Show the exact controlled path for ${item.name}; keep the joints aligned and stay inside a pain-free range.`
    : `Show the stable, exercise-specific position for ${item.name} without exaggerated range.`;
  const phaseText = start
    ? `Stable starting position before the repetition. Show ${item.equipment}, grip, stance, joint stacking, and neutral posture.`
    : `Peak or clearly active working position for ${item.name}. Keep the same athlete and equipment as Start and change the joint/equipment positions meaningfully.`;
  return `Use case: scientific educational fitness guidance. Brand system: Fitness 7. Create one square instructional illustration for ${item.name}, showing only the ${start ? 'Start' : 'Movement'} phase. One adult male athlete in black training clothes. Minimal charcoal gym environment; off-white athlete and equipment; restrained orange primary-muscle emphasis, muted-blue secondary emphasis, and grey-green stabilizers. Equipment: ${item.equipment}. Phase position: ${phaseText} Movement mechanics: ${direction} Full athlete and equipment visible with at least 10% clear margin. Square 1:1, exactly 512x512 PNG after proportional contain-resize. No text, labels, logos, watermarks, white background, split view, collage, unrelated equipment, distorted anatomy, or cropped hands, feet, cables, bars, benches, weights, or machines.`;
}

function buildDay(dayName) {
  const rows = daySpecs[dayName];
  const records = rows.map(([id, name, role, equipment]) => {
    const status = role === 'status' ? 'excluded-text-only' : role === 'reuse' ? 'reuse-candidate' : 'generate';
    const tuesdayCandidates = exactTuesdayCandidates({ id, name });
    const monday = mondayPathFor(id);
    const reuseSource = monday ? 'monday-v3-candidate' : 'none';
    const output = {
      canonicalMovementId: id,
      displayName: name,
      day: dayName,
      weekKeys: ['A', 'B', 'C'],
      role,
      equipment,
      equipmentStatus: role === 'status' ? 'text-only' : 'review-before-generation',
      tuesdayExactCandidates: tuesdayCandidates,
      tuesdayDecision: tuesdayCandidates.length ? 'needs-mechanics-review' : 'no-name-or-id-match-found',
      mondayDecision: mondayReuseIds.has(id) ? 'reuse-candidate' : 'not-a-reuse-candidate',
      existingSource: reuseSource,
      status,
      imageSet: monday || null,
      outputPaths: {
        start: `assets/exercises/periodized-v3/${id}-v3-start.png`,
        movement: `assets/exercises/periodized-v3/${id}-v3-movement.png`
      },
      startPrompt: promptFor({ name, equipment }, 'start'),
      movementPrompt: promptFor({ name, equipment }, 'movement'),
      altText: {
        start: `Fitness 7 illustration: ${name} starting position`,
        movement: `Fitness 7 illustration: ${name} working position`
      },
      technicalReviewStatus: 'pending',
      semanticReviewStatus: 'pending',
      humanCoachReviewStatus: 'pending'
    };
    if (monday) {
      output.imageSetValidation = { start: info(monday.start), movement: info(monday.movement) };
    }
    return output;
  });
  const physical = records.filter(record => record.status !== 'excluded-text-only');
  const reuse = physical.filter(record => record.mondayDecision === 'reuse-candidate');
  const generate = physical.filter(record => record.status === 'generate');
  return {
    schemaVersion: 'fitness7-wed-thu-artwork-v1',
    day: dayName,
    auditScope: 'A-B-A-C active day records; day-wise production scope from approved artwork plan',
    counts: {
      totalListedRecords: records.length,
      physicalRecords: physical.length,
      excludedTextOnly: records.length - physical.length,
      mondayReuseCandidates: reuse.length,
      tuesdayReuseCandidatesNeedingReview: records.filter(record => record.tuesdayExactCandidates.length).length,
      newGenerationPairsBeforeTuesdayReview: generate.length,
      newGenerationFilesBeforeTuesdayReview: generate.length * 2
    },
    tuesdayLibraryAudit: {
      movementRecords: tuesdayRecords.length,
      runtimeMapRecords: Object.keys(tuesdayRuntimeMap).length,
      generatedSets: tuesday?.generatedSets || 36,
      reusedSets: tuesday?.reusedSets || 4,
      deferredSets: tuesday?.deferredTendonSets || 1,
      rule: 'No reuse is approved by name alone; every candidate requires mechanics review.'
    },
    records
  };
}

const rootDir = path.join(root, '.codex/v541/artwork-v3');
const outputs = {};
for (const day of ['Wednesday', 'Thursday']) {
  const dir = path.join(rootDir, day.toLowerCase());
  fs.mkdirSync(dir, { recursive: true });
  const audit = buildDay(day);
  outputs[day] = audit;
  fs.writeFileSync(path.join(dir, 'AUDIT.json'), `${JSON.stringify(audit, null, 2)}\n`);
  const physical = audit.records.filter(record => record.status !== 'excluded-text-only');
  const reuse = physical.filter(record => record.mondayDecision === 'reuse-candidate');
  const generation = physical.filter(record => record.status === 'generate');
  const reuseMap = {
    day,
    tuesdayAudit: audit.tuesdayLibraryAudit,
    candidates: audit.records.flatMap(record => record.tuesdayExactCandidates.map(candidate => ({ runtimeId: record.canonicalMovementId, candidate }))),
    mondayReuse: reuse.map(record => ({ runtimeId: record.canonicalMovementId, imageSet: record.imageSet, status: 'candidate-awaiting-final-mechanics-check' })),
    approved: [],
    rejected: [],
    rule: 'Approval requires exact equipment, grip, stance, joint path, range, and intent match.'
  };
  fs.writeFileSync(path.join(dir, 'REUSE-MAP.json'), `${JSON.stringify(reuseMap, null, 2)}\n`);
  const manifest = {
    schemaVersion: 'fitness7-wed-thu-artwork-generation-v1',
    day,
    generationOrder: 'audit -> reuse review -> queue freeze -> male-only Start/Movement generation',
    generationQueue: generation.map((record, index) => ({ order: index + 1, ...record })),
    excluded: audit.records.filter(record => record.status === 'excluded-text-only').map(record => ({ id: record.canonicalMovementId, name: record.displayName, reason: 'text/status record; no artwork' }))
  };
  fs.writeFileSync(path.join(dir, 'GENERATION-MANIFEST.json'), `${JSON.stringify(manifest, null, 2)}\n`);
  const state = {
    project: `Fitness 7 V5.4.1 ${day} artwork-only production`,
    branch: 'codex/v541-v2-art-integration',
    day,
    weekKeys: ['A', 'B', 'C'],
    currentCheckpoint: `V541-${day === 'Wednesday' ? 'WED' : 'THU'}-00-TUESDAY-REUSE-AUDIT`,
    totalListedRecords: audit.counts.totalListedRecords,
    physicalRecords: audit.counts.physicalRecords,
    tuesdayLibrarySetsReviewed: tuesdayRecords.length,
    mondayReuseCandidates: audit.counts.mondayReuseCandidates,
    tuesdayReuseCandidates: audit.counts.tuesdayReuseCandidatesNeedingReview,
    newGenerationSetsBeforeReuseReview: audit.counts.newGenerationPairsBeforeTuesdayReview,
    newGenerationFilesBeforeReuseReview: audit.counts.newGenerationFilesBeforeTuesdayReview,
    completedSets: 0,
    completedFiles: 0,
    failedMovementIds: [],
    completedMovementIds: [],
    lastCompletedCommit: '',
    knownIssues: ['Reuse is not approved by name alone.', 'Technical and AI semantic review are not qualified gym-coach approval.'],
    nextAtomicAction: `Review ${day} REUSE-MAP.json against Tuesday V3 mechanics and freeze the generation queue`
  };
  fs.writeFileSync(path.join(dir, 'STATE.json'), `${JSON.stringify(state, null, 2)}\n`);
  fs.writeFileSync(path.join(dir, 'REPAIR-QUEUE.md'), `# ${day} artwork repair queue\n\nNo generated pairs yet. Add one row per failed Start or Movement phase; do not regenerate accepted companion phases.\n`);
  fs.writeFileSync(path.join(dir, 'VALIDATION.md'), `# ${day} artwork-only validation\n\n- Tuesday V3 movement records inspected: ${tuesdayRecords.length}.\n- Tuesday runtime-map records inspected: ${Object.keys(tuesdayRuntimeMap).length}.\n- Listed day records: ${audit.counts.totalListedRecords}.\n- Physical records: ${audit.counts.physicalRecords}.\n- Text-only records excluded: ${audit.counts.excludedTextOnly}.\n- Monday reuse candidates: ${audit.counts.mondayReuseCandidates}.\n- Tuesday candidates requiring mechanics review: ${audit.counts.tuesdayReuseCandidatesNeedingReview}.\n- New generation queue before reuse review: ${audit.counts.newGenerationPairsBeforeTuesdayReview} pairs / ${audit.counts.newGenerationFilesBeforeTuesdayReview} files.\n- Image generation: not started.\n- Runtime integration: not run.\n`);
}

const report = [
  '# Wednesday and Thursday V3 artwork production audit',
  '',
  'This checkpoint audits Tuesday V3 reuse before any Wednesday or Thursday image generation. No UI, runtime registry, Monday/Tuesday asset, or deployment files were changed.',
  '',
  '## Counts before mechanics review',
  '',
  `- Wednesday: ${outputs.Wednesday.counts.physicalRecords} physical records, ${outputs.Wednesday.counts.newGenerationPairsBeforeTuesdayReview} provisional new pairs.`,
  `- Thursday: ${outputs.Thursday.counts.physicalRecords} physical records, ${outputs.Thursday.counts.mondayReuseCandidates} Monday reuse candidates, ${outputs.Thursday.counts.newGenerationPairsBeforeTuesdayReview} provisional new pairs.`,
  `- Tuesday library inspected: ${tuesdayRecords.length} canonical records, ${Object.keys(tuesdayRuntimeMap).length} runtime mappings, ${tuesday?.generatedSets || 36} generated sets, ${tuesday?.reusedSets || 4} reused sets, ${tuesday?.deferredTendonSets || 1} deferred set.`,
  '',
  'Final generation counts are not frozen until every Tuesday candidate is approved or rejected using mechanics, equipment, grip, stance, path, and range.',
  '',
  '## Next actions',
  '',
  '1. Review Wednesday and Thursday REUSE-MAP.json files.',
  '2. Approve or reject each Tuesday candidate explicitly.',
  '3. Freeze each generation manifest.',
  '4. Generate male-only Start and Movement pairs in batches of 10–15.',
  '5. Checkpoint after every pair; do not integrate artwork into the app in this stage.'
].join('\n') + '\n';
fs.mkdirSync(path.join(root, 'output/reports'), { recursive: true });
fs.writeFileSync(path.join(root, 'output/reports/wednesday-thursday-artwork-audit.md'), report);
console.log(JSON.stringify({
  tuesdayRecords: tuesdayRecords.length,
  tuesdayRuntimeMap: Object.keys(tuesdayRuntimeMap).length,
  Wednesday: outputs.Wednesday.counts,
  Thursday: outputs.Thursday.counts
}, null, 2));
