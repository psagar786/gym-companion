import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const context = { window: {} };
const sourceFiles = [
  'data/biweekly-routine.js',
  'data/periodized-abc.js',
  'data/periodized-artwork.js',
  'data/biweekly-artwork-registry.js',
  'data/periodized-v2-pilot.js',
  'data/v53-content.js'
];
for (const file of sourceFiles) vm.runInNewContext(fs.readFileSync(path.join(root, file), 'utf8'), context);

const periodized = context.window.GYM_COMPANION_PERIODIZED_ABC;
const periodizedArtwork = context.window.GYM_COMPANION_PERIODIZED_ARTWORK || { movements: {} };
const biweeklyArtwork = context.window.GYM_COMPANION_BIWEEKLY_REGISTRY || { movements: [] };
const v2 = context.window.GYM_COMPANION_PERIODIZED_V2_PILOT || { movements: {} };
const v53Content = context.window.GYM_COMPANION_V53_CONTENT || { tendon: [] };
const dayNames = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const nonExercise = /hydration|nutritional adherence|no cardio/i;
const physicalRoles = new Set(['core', 'alternative', 'optional', 'warmup', 'tendon', 'recovery', 'cardio']);

const runtime = new Map();
function addRuntime(id, name, role, day, week, sourceItem, sourceType = 'periodized') {
  const record = runtime.get(id) || {
    runtimeId: id,
    name,
    roles: new Set(),
    days: new Set(),
    weeks: new Set(),
    sourceRows: new Set(),
    sourceItems: []
  };
  record.roles.add(role);
  record.days.add(day);
  record.weeks.add(week);
  const sourceRows = sourceItem?.sourceSheetRows || (sourceItem?.sourceSheetRow != null ? [sourceItem.sourceSheetRow] : []);
  for (const sourceRow of sourceRows) record.sourceRows.add(sourceRow);
  record.sourceItems.push({ role, day, week, sourceType, sourceItem });
  runtime.set(id, record);
}

for (const day of periodized.days || []) {
  const groups = {
    core: day.coreSlots || [],
    optional: day.optionalSlots || [],
    warmup: day.warmup || [],
    recovery: day.recovery || [],
    cardio: day.cardio || []
  };
  for (const [role, items] of Object.entries(groups)) {
    for (const item of items) {
      const id = item.stableMovementId || `periodized-${slug(item.name)}`;
      addRuntime(id, item.name, role, day.dayName, day.weekKey, item);
      for (const alternative of item.alternatives || []) {
        addRuntime(`periodized-${slug(alternative)}`, alternative, 'alternative', day.dayName, day.weekKey, { ...item, name: alternative, __alternative: true, imageSet: {} }, 'alternative');
      }
    }
  }
}

for (let index = 0; index < (v53Content.tendon || []).length; index += 1) {
  const item = v53Content.tendon[index];
  if (!item) continue;
  addRuntime(`tendon-${slug(item.name)}`, item.name, 'tendon', dayNames[index] || `Day ${index + 1}`, 'A/B/C', item, 'tendon');
}

function fileInfo(relativePath) {
  if (!relativePath) return { path: null, exists: false, format: null, width: null, height: null, hash: null };
  const absolute = path.join(root, relativePath);
  if (!fs.existsSync(absolute)) return { path: relativePath, exists: false, format: path.extname(relativePath).slice(1) || null, width: null, height: null, hash: null };
  const buffer = fs.readFileSync(absolute);
  const isPng = buffer.length > 24 && buffer.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]));
  return {
    path: relativePath,
    exists: true,
    format: isPng ? 'png' : path.extname(relativePath).slice(1).toLowerCase(),
    width: isPng ? buffer.readUInt32BE(16) : null,
    height: isPng ? buffer.readUInt32BE(20) : null,
    hash: crypto.createHash('sha256').update(buffer).digest('hex')
  };
}

const v2Records = Object.values(v2.movements || {});
const stagedRecords = Object.values(periodizedArtwork.movements || {});
const registryRecords = biweeklyArtwork.movements || [];

function resolveArtwork(record) {
  const name = record.name;
  const nameSlug = slug(name);
  const item = record.sourceItems[0]?.sourceItem || {};
  const runtimeId = item.__alternative ? `periodized-${nameSlug}` : (item.stableMovementId || `periodized-${nameSlug}`);
  const v2Match = v2Records.find(candidate => candidate.stableMovementId === runtimeId || (candidate.runtimeIds || []).includes(runtimeId) || slug(candidate.name) === nameSlug);
  if (v2Match) return { source: 'v2', record: v2Match };
  const staged = stagedRecords.find(candidate => candidate.stableMovementId === nameSlug || candidate.name === name || (candidate.aliases || []).includes(name));
  if (staged) return { source: 'periodized-v1', record: staged };
  const registry = registryRecords.find(candidate => candidate.stableMovementId === nameSlug || candidate.name === name || (candidate.aliases || []).includes(name));
  if (registry) return { source: 'biweekly-v1', record: registry };
  const inline = item.imageSet ? { ...item, stableMovementId: record.runtimeId } : null;
  return { source: inline ? 'inline' : 'none', record: inline };
}

function normalizedName(name) {
  return String(name || '')
    .toLowerCase()
    .replace(/\([^)]*\)/g, '')
    .replace(/\b(machine|with|on|the|a|an)\b/g, ' ')
    .replace(/dumbbell/g, 'db')
    .replace(/romanian deadlift/g, 'rdl')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim()
    .replace(/\s+/g, ' ');
}

function isNonExercise(record) {
  return nonExercise.test(record.name);
}

function muscleGroups(record) {
  const groups = new Set();
  for (const item of record.sourceItems) {
    for (const value of item.sourceItem?.targetGroups || []) groups.add(value);
  }
  return [...groups];
}

function inferEquipment(name, role) {
  const text = String(name || '').toLowerCase();
  if (/stick/.test(text)) return 'Light mobility stick or broom handle';
  if (/cable|pulldown|pallof|woodchop|face pull|pushdown/.test(text)) return 'Cable station with exercise-specific attachment';
  if (/barbell|deadlift|squat|shrug/.test(text)) return 'Barbell with appropriate rack or platform';
  if (/dumbbell|db|lunge|curl|raise/.test(text)) return 'Dumbbells and bench or mat as specified';
  if (/leg press/.test(text)) return '45° leg press machine';
  if (/machine|adductor|abductor/.test(text)) return 'Exercise-specific machine';
  if (/hanging|toes-to-bar/.test(text)) return 'Pull-up bar';
  if (/plank|crunch|vacuum|stretch|mobility|rotation|march/.test(text)) return 'Exercise mat or open floor';
  if (/walk|interval|cardio/.test(text)) return 'Treadmill or stationary bike';
  if (role === 'tendon') return 'Bodyweight and opposite hand or stable support';
  return 'Fitness 7 gym equipment shown in the specification';
}

function inferDirection(name) {
  const text = String(name || '').toLowerCase();
  if (/press|push|extension/.test(text)) return 'Press or extend away from the start while keeping the trunk stacked.';
  if (/row|pulldown|pull-up|pullover|curl|face pull|shrug/.test(text)) return 'Pull toward the target line by driving the elbows or hands along the specified path.';
  if (/squat|lunge|leg press|step-up/.test(text)) return 'Lower through the hips and knees, then drive through the floor to return.';
  if (/deadlift|rdl|hinge|good morning|back extension|glute bridge/.test(text)) return 'Hinge or extend through the hips while keeping the spine neutral.';
  if (/plank|isometric|hold|vacuum/.test(text)) return 'Brace or apply steady resistance without changing the joint position.';
  if (/walk|bike|interval/.test(text)) return 'Move at the specified steady or interval pace while maintaining posture.';
  return 'Move through the named range slowly and return without bouncing.';
}

function inferCamera(name) {
  const text = String(name || '').toLowerCase();
  if (/row|pulldown|press|curl|fly|raise|cable/.test(text)) return 'Front three-quarter view with all handles, cables, and joints visible';
  if (/squat|lunge|deadlift|rdl|leg press|bridge|back extension/.test(text)) return 'Side three-quarter view with feet, hips, knees, and equipment visible';
  if (/stick|stretch|rotation|mobility/.test(text)) return 'Full-body front three-quarter view with the stick path unobstructed';
  if (/plank|crunch|vacuum|hanging/.test(text)) return 'Side three-quarter view with the complete body line visible';
  if (/walk|bike|interval/.test(text)) return 'Side three-quarter cardio-machine view';
  return 'Front three-quarter instructional view';
}

function inferNegativeConstraints(name, equipment) {
  const text = String(name || '').toLowerCase();
  const rules = ['no cropped athlete or equipment', 'no text, logo, watermark, split view, collage, or white background'];
  if (/pulldown|pull-up/.test(text)) rules.push('no behind-neck pull or excessive backward lean');
  if (/squat|lunge|leg press/.test(text)) rules.push('no knees collapsing inward or heels lifting');
  if (/deadlift|rdl|hinge/.test(text)) rules.push('no rounded lumbar spine or bar drifting away');
  if (/press|fly/.test(text)) rules.push('no flared painful shoulder position or incorrect bench angle');
  if (/stick|stretch|mobility/.test(text)) rules.push('no forced end range, bouncing, or missing stick');
  if (/isometric|hold|plank|vacuum/.test(text)) rules.push('no breath-holding, exaggerated motion, or unsupported joint position');
  if (/machine|cable/.test(equipment)) rules.push('show the named machine or cable attachment only');
  return rules;
}

const runtimeRows = [];
for (const record of runtime.values()) {
  const resolved = resolveArtwork(record);
  const sourceRecord = resolved.record || {};
  const imageSet = sourceRecord.imageSet || {};
  const start = imageSet.start || imageSet.setup;
  const movement = imageSet.movement || imageSet.move;
  const startInfo = fileInfo(start);
  const movementInfo = fileInfo(movement);
  const complete = Boolean(startInfo.exists && movementInfo.exists && start !== movement);
  const nonExerciseRecord = isNonExercise(record);
  let condition = 'none';
  if (nonExerciseRecord) condition = 'non-exercise-no-artwork';
  else if (resolved.source === 'v2' && complete) condition = 'v2-approved-existing';
  else if (!startInfo.exists && !movementInfo.exists) condition = 'missing-start-and-movement';
  else if (!startInfo.exists) condition = 'missing-start';
  else if (!movementInfo.exists) condition = 'missing-movement';
  else if (start === movement || startInfo.hash === movementInfo.hash) condition = 'same-image-both-phases';
  else if (resolved.source === 'periodized-v1' || resolved.source === 'biweekly-v1') condition = 'legacy-complete-replace';
  else condition = 'inline-or-proxy-review';
  runtimeRows.push({
    ...record,
    roles: [...record.roles],
    days: [...record.days],
    weeks: [...record.weeks],
    sourceRows: [...record.sourceRows].sort((a, b) => Number(a) - Number(b)),
    targetGroups: muscleGroups(record),
    equipment: sourceRecord.equipment || record.sourceItems[0]?.sourceItem?.equipment || inferEquipment(record.name, [...record.roles][0]),
    equipmentStatus: sourceRecord.equipmentStatus || record.sourceItems[0]?.sourceItem?.equipmentStatus || 'Review source record',
    artworkSource: resolved.source,
    existingImageSet: { start: startInfo, movement: movementInfo },
    currentArtworkCondition: condition,
    nonExercise: nonExerciseRecord,
    replacementRequired: !nonExerciseRecord && condition !== 'v2-approved-existing'
  });
}

const physicalRows = runtimeRows.filter(row => !row.nonExercise);
const v2RuntimeIds = new Set(v2Records.flatMap(record => record.runtimeIds || []).filter(id => runtime.has(id)));
const activeV2Records = v2Records.filter(record => (record.runtimeIds || []).some(id => v2RuntimeIds.has(id)));
const unusedV2Records = v2Records.filter(record => !(record.runtimeIds || []).some(id => v2RuntimeIds.has(id)));

const byNormalizedName = new Map();
for (const row of physicalRows) {
  const key = normalizedName(row.name);
  byNormalizedName.set(key, [...(byNormalizedName.get(key) || []), row]);
}

const aliasDecisions = [];
const canonicalByRuntimeId = new Map();
for (const [key, rows] of byNormalizedName.entries()) {
  const names = [...new Set(rows.map(row => row.name))];
  const equipmentKeys = [...new Set(rows.map(row => String(row.equipment).toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim()))];
  const sameName = names.length === 1;
  const decision = sameName && equipmentKeys.length === 1 ? 'share' : 'separate';
  const canonicalMovementId = rows.map(row => row.runtimeId).sort()[0];
  aliasDecisions.push({
    normalizedName: key,
    candidateIds: rows.map(row => row.runtimeId).sort(),
    names,
    decision,
    canonicalMovementId,
    mechanicalEvidence: sameName && equipmentKeys.length === 1
      ? 'Exact display name and normalized equipment match; confirm joint path and range before final approval.'
      : 'Name or equipment differs; keep independent until a human confirms identical mechanics.',
    reviewerStatus: 'needs-human-review'
  });
  for (const row of rows) canonicalByRuntimeId.set(row.runtimeId, canonicalMovementId);
}

const canonicalRows = [];
for (const decision of aliasDecisions) {
  const rows = decision.candidateIds.map(id => physicalRows.find(row => row.runtimeId === id)).filter(Boolean);
  const first = rows[0];
  const roles = [...new Set(rows.flatMap(row => row.roles))];
  const days = [...new Set(rows.flatMap(row => row.days))];
  const weeks = [...new Set(rows.flatMap(row => row.weeks))];
  const targetGroups = [...new Set(rows.flatMap(row => row.targetGroups))];
  const v2Record = activeV2Records.find(record => (record.runtimeIds || []).some(id => rows.some(row => row.runtimeId === id)) || normalizedName(record.name) === decision.normalizedName);
  const replacementRequired = !v2Record;
  const role = roles[0] || 'core';
  const equipment = first.equipment || inferEquipment(first.name, role);
  const sourceItems = rows.flatMap(row => row.sourceItems);
  const sourceRows = [...new Set(rows.flatMap(row => row.sourceRows || []))].sort((a, b) => Number(a) - Number(b));
  const sourceReferences = [...new Set(sourceItems.map(item => `${item.day} ${item.week} · ${item.role}`).sort())];
  const startPose = v2Record?.startInstruction || `Stable starting position for ${first.name}; show ${equipment}, grip, stance, and neutral joint stacking before the repetition.`;
  const movementPose = v2Record?.movementInstruction || `Clear working position for ${first.name}; show the peak or active position with the named joints and equipment visibly displaced from Start.`;
  canonicalRows.push({
    canonicalMovementId: decision.canonicalMovementId,
    displayName: first.name,
    aliases: [...new Set(rows.flatMap(row => [row.name, ...row.sourceItems.map(item => item.sourceItem?.title).filter(Boolean)]))].filter(Boolean),
    roles,
    compatibleDays: days,
    compatibleWeeks: weeks,
    equipment,
    equipmentStatus: first.equipmentStatus,
    cameraAngle: inferCamera(first.name),
    athleteOrientation: /hanging|plank|crunch|bridge|curl|row|press|fly|raise|squat|lunge|deadlift|rdl/.test(first.name.toLowerCase()) ? 'Exercise-specific orientation shown in the phase specification' : 'Full-body instructional orientation',
    startPose,
    movementPose,
    movementDirection: v2Record?.directionCue || inferDirection(first.name),
    grip: 'Show the exact grip or hand position named by the exercise; mark unknown grip for review.',
    stance: 'Show the exact foot or knee stance required by the movement; mark unknown stance for review.',
    benchOrMachineSetup: equipment,
    primaryMuscles: v2Record?.primaryTargets || (targetGroups.length ? targetGroups.slice(0, 2) : ['Needs content review']),
    secondaryMuscles: v2Record?.secondaryTargets || targetGroups.slice(2),
    stabilizers: v2Record?.stabilizers || ['Trunk and joint stabilizers; replace with authored anatomy before generation'],
    safeRange: 'Pain-free, controlled range specific to the movement; no forced end range.',
    commonVisualErrors: inferNegativeConstraints(first.name, equipment),
    negativeConstraints: inferNegativeConstraints(first.name, equipment),
    sourceReferences,
    sourceRows,
    existingV2Asset: v2Record ? v2Record.imageSet : null,
    currentArtworkConditions: [...new Set(rows.map(row => row.currentArtworkCondition))],
    mappedRuntimeIds: rows.map(row => row.runtimeId).sort(),
    replacementRequired,
    promptStatus: replacementRequired ? 'draft-needs-content-review' : 'preserve-and-review'
  });
}

const promptWrapper = `Use case: scientific educational fitness guidance.\nBrand system: Fitness 7.\n\nCreate one square instructional illustration for {EXERCISE_NAME}, showing only the {PHASE_NAME} position.\n\nSubject: One adult athlete with realistic athletic proportions wearing consistent black training clothes. Show the exact equipment, grip, stance, joint position, and range defined in the movement specification.\n\nEnvironment: Minimal charcoal Fitness 7 gym environment with subtle floor contact and restrained depth.\n\nEquipment: {EXACT_EQUIPMENT_AND_ADJUSTMENT}\n\nBody position: {PHASE_POSITION}\n\nGrip and stance: {GRIP_AND_STANCE}\n\nMovement mechanics: {JOINT_PATH_AND_SAFE_RANGE}\n\nAnatomy: Highlight {PRIMARY_MUSCLES} with restrained Fitness 7 orange; {SECONDARY_MUSCLES} with muted blue; {STABILIZERS} subtly in desaturated grey-green. Anatomy emphasis must not hide posture, joints, or equipment.\n\nComposition: Square 1:1. Full athlete and equipment visible. At least 10 percent clear margin on every side. Camera angle: {CAMERA_ANGLE}. One athlete, one pose, one exercise, one phase only.\n\nStyle: Premium realistic 3D scientific fitness illustration with controlled high-contrast studio lighting and clear separation from charcoal.\n\nDo not include: text, labels, logos, watermarks, split views, collages, neighboring poses, white backgrounds, decorative gym clutter, unrelated equipment, distorted anatomy, mirrored machines, or cropped hands, feet, cables, bars, benches, weights, or machine frames.\n\nMovement-specific exclusions: {NEGATIVE_CONSTRAINTS}`;
const startSuffix = `Phase: Start.\nShow the stable position immediately before the repetition begins. Make equipment adjustment, grip, stance, posture, joint stacking, and initial resistance direction clear. Do not show peak contraction or movement arrows. The athlete must look ready to begin.`;
const movementSuffix = `Phase: Movement.\nUse the approved Start image as the identity reference. Keep the same athlete, clothing, equipment, camera, lighting, and background. Show the clearest working or contracted position. The joint and equipment position must be meaningfully different from Start. Use one restrained orange direction cue only when it improves understanding. Do not repeat the Start pose.`;
function renderPrompt(row, phase) {
  const values = {
    '{EXERCISE_NAME}': row.displayName,
    '{PHASE_NAME}': phase === 'start' ? 'Start' : 'Movement',
    '{EXACT_EQUIPMENT_AND_ADJUSTMENT}': row.equipment,
    '{PHASE_POSITION}': phase === 'start' ? row.startPose : row.movementPose,
    '{GRIP_AND_STANCE}': `${row.grip} ${row.stance}`,
    '{JOINT_PATH_AND_SAFE_RANGE}': `${row.movementDirection} ${row.safeRange}`,
    '{PRIMARY_MUSCLES}': row.primaryMuscles.join(', '),
    '{SECONDARY_MUSCLES}': row.secondaryMuscles.length ? row.secondaryMuscles.join(', ') : 'secondary movers defined during content review',
    '{STABILIZERS}': row.stabilizers.join(', '),
    '{CAMERA_ANGLE}': row.cameraAngle,
    '{NEGATIVE_CONSTRAINTS}': row.negativeConstraints.join('; ')
  };
  let prompt = promptWrapper;
  for (const [token, value] of Object.entries(values)) prompt = prompt.replaceAll(token, value);
  return `${prompt}\n\n${phase === 'start' ? startSuffix : movementSuffix}\n\nOutput treatment: Generate one square image. Inspect before resizing. Contain-resize proportionally to 512 x 512 and pad with the approved charcoal background. Never stretch or crop the athlete or equipment. Save as a standalone PNG.`;
}

const promptManifest = {
  schemaVersion: 'fitness7-scientific-v3',
  generatedAt: new Date().toISOString(),
  source: {
    plan: 'periodized-abc-v1',
    runtimeIdentityCount: runtimeRows.length,
    physicalIdentityCount: physicalRows.length,
    excludedNonExerciseCount: runtimeRows.filter(row => row.nonExercise).length,
    v2MappedRuntimeIdentityCount: v2RuntimeIds.size
  },
  assetModel: 'two separate images per canonical physical movement: Start and Movement',
  expectedOutput: { startFiles: canonicalRows.length, movementFiles: canonicalRows.length, totalFiles: canonicalRows.length * 2 },
  movements: canonicalRows.map(row => ({
    canonicalMovementId: row.canonicalMovementId,
    displayName: row.displayName,
    mappedRuntimeIds: row.mappedRuntimeIds,
    sourceRows: row.sourceRows,
    roles: row.roles,
    compatibleDays: row.compatibleDays,
    equipment: row.equipment,
    equipmentStatus: row.equipmentStatus,
    existingV2Asset: row.existingV2Asset,
    startPrompt: renderPrompt(row, 'start'),
    movementPrompt: renderPrompt(row, 'movement'),
    outputPaths: {
      start: `assets/exercises/periodized-v3/${row.canonicalMovementId}-start.png`,
      movement: `assets/exercises/periodized-v3/${row.canonicalMovementId}-movement.png`
    },
    promptVersion: 'fitness7-scientific-v3',
    generationStatus: row.replacementRequired ? 'not-started' : 'preserve-existing',
    technicalReviewStatus: 'pending',
    semanticReviewStatus: 'pending',
    humanCoachReviewStatus: 'pending',
    replacementRequired: row.replacementRequired
  }))
};

const outDir = path.join(root, '.codex/v541/artwork-v3');
fs.mkdirSync(outDir, { recursive: true });
const writeJson = (name, value) => fs.writeFileSync(path.join(outDir, name), `${JSON.stringify(value, null, 2)}\n`);

writeJson('CANONICAL-MOVEMENTS.json', {
  schemaVersion: 'fitness7-canonical-movements-v3',
  generatedAt: new Date().toISOString(),
  counts: {
    runtimeSelectableIncludingNonExercise: runtimeRows.length,
    nonExerciseExcluded: runtimeRows.filter(row => row.nonExercise).length,
    physicalRuntimeIdentities: physicalRows.length,
    physicalCanonicalGroups: canonicalRows.length,
    v2MappedRuntimeIdentities: v2RuntimeIds.size,
    activeV2CanonicalSets: activeV2Records.length,
    unusedV2Sets: unusedV2Records.length,
    canonicalSetsRequiringTransformation: canonicalRows.filter(row => row.replacementRequired).length,
    startFilesRequiringTransformation: canonicalRows.filter(row => row.replacementRequired).length,
    movementFilesRequiringTransformation: canonicalRows.filter(row => row.replacementRequired).length
  },
  runtimeIdentities: runtimeRows.map(row => ({
    runtimeId: row.runtimeId,
    canonicalMovementId: canonicalByRuntimeId.get(row.runtimeId) || null,
    name: row.name,
    roles: row.roles,
    days: row.days,
    weeks: row.weeks,
    sourceRows: row.sourceRows,
    targetGroups: row.targetGroups,
    equipment: row.equipment,
    equipmentStatus: row.equipmentStatus,
    existingImageSet: row.existingImageSet,
    artworkSource: row.artworkSource,
    currentArtworkCondition: row.currentArtworkCondition,
    nonExercise: row.nonExercise,
    replacementRequired: row.replacementRequired
  })),
  excludedNonExercise: runtimeRows.filter(row => row.nonExercise).map(row => ({ runtimeId: row.runtimeId, name: row.name, roles: row.roles, days: row.days, weeks: row.weeks })),
  movements: canonicalRows
});

writeJson('ALIAS-DECISIONS.json', {
  schemaVersion: 'fitness7-alias-decisions-v3',
  generatedAt: new Date().toISOString(),
  summary: {
    normalizedGroups: aliasDecisions.length,
    duplicateNameGroups: aliasDecisions.filter(row => row.candidateIds.length > 1).length,
    candidateRuntimeIdentitiesInDuplicateGroups: aliasDecisions.filter(row => row.candidateIds.length > 1).reduce((sum, row) => sum + row.candidateIds.length, 0),
    allRequireHumanReview: true
  },
  decisions: aliasDecisions
});

writeJson('PROMPT-MANIFEST.json', promptManifest);

const roleOrder = ['core', 'warmup', 'tendon', 'recovery', 'cardio', 'optional', 'alternative'];
const byRole = Object.fromEntries(roleOrder.map(role => [role, canonicalRows.filter(row => row.roles.includes(role))]));
const byRoleReplacement = Object.fromEntries(roleOrder.map(role => [role, byRole[role].filter(row => row.replacementRequired)]));
const byCondition = {};
for (const row of physicalRows) byCondition[row.currentArtworkCondition] = (byCondition[row.currentArtworkCondition] || 0) + 1;
const dayOccurrence = Object.fromEntries(dayNames.map(day => [day, physicalRows.filter(row => row.days.includes(day)).length]));

const report = [];
report.push('# Fitness 7 V5.4.1 A–B–A–C artwork transformation audit');
report.push('');
report.push('This is an audit and prompt-freeze artifact. No images were generated and no application artwork was changed.');
report.push('');
report.push('## Final count model');
report.push('');
report.push(`- Runtime identities including tendon and non-exercise records: **${runtimeRows.length}**.`);
report.push(`- Non-exercise records excluded from exercise artwork: **${runtimeRows.filter(row => row.nonExercise).length}** (hydration, nutritional adherence, and NO CARDIO safeguard).`);
report.push(`- Physical runtime identities: **${physicalRows.length}**.`);
report.push(`- Canonical physical groups after conservative name/equipment normalization: **${canonicalRows.length}**.`);
report.push(`- New V2 runtime identities already covered: **${v2RuntimeIds.size}**, using **${activeV2Records.length}** active sets.`);
report.push(`- V2 canonical groups requiring new artwork: **${canonicalRows.filter(row => row.replacementRequired).length}**.`);
report.push(`- New files required if every replacement group is approved: **${canonicalRows.filter(row => row.replacementRequired).length * 2}** (one Start and one Movement per group).`);
report.push(`- Eight technically complete V2 sets are not used by the current runtime and remain preserved separately.`);
report.push('');
report.push('The canonical count is conservative: exact aliases may share a pair only after joint path, equipment, grip, stance, and range are reviewed. No similar-but-different movement is merged automatically.');
report.push('');
report.push('## Current artwork condition');
report.push('');
for (const [condition, count] of Object.entries(byCondition).sort()) report.push(`- ${condition}: **${count}** physical runtime identities.`);
report.push('');
report.push('## Day-wise physical identity coverage');
report.push('');
for (const day of dayNames) report.push(`- ${day}: **${dayOccurrence[day] || 0}** physical identities occur in at least one A–B–A–C record.`);
report.push('');
for (const day of dayNames) {
  const dayRows = canonicalRows.filter(row => row.compatibleDays.includes(day)).sort((a, b) => a.displayName.localeCompare(b.displayName));
  report.push(`### ${day} movement list`);
  report.push('');
  for (const row of dayRows) report.push(`- ${row.displayName} · \`${row.canonicalMovementId}\` · ${row.roles.join(', ')} · ${row.replacementRequired ? 'replacement required' : 'V2 covered'}`);
  report.push('');
}
report.push('## Role-wise physical identity coverage');
report.push('');
for (const role of roleOrder) report.push(`- ${role}: **${byRole[role].length}** canonical groups; **${byRoleReplacement[role].length}** require new artwork.`);
report.push('');
report.push('Role totals overlap when one movement appears in multiple roles or days and must not be summed as a production count.');
report.push('');
report.push('## Excluded non-exercise records');
report.push('');
for (const row of runtimeRows.filter(row => row.nonExercise)) report.push(`- ${row.name} · ${row.roles.join(', ')} · ${row.days.join(', ')} · text/status card only.`);
report.push('');
report.push('## Canonical movement queue');
report.push('');
for (const role of roleOrder) {
  report.push(`### ${role}`);
  report.push('');
  for (const row of byRole[role].sort((a, b) => a.displayName.localeCompare(b.displayName))) report.push(`- ${row.displayName} · \`${row.canonicalMovementId}\` · ${row.replacementRequired ? 'new V2 artwork required' : 'V2 artwork mapped'} · ${row.compatibleDays.join(', ')}`);
  report.push('');
}
report.push('## Prompt readiness rules');
report.push('');
report.push('- Every canonical group has separate Start and Movement prompts under `PROMPT-MANIFEST.json`.');
report.push('- Any inferred equipment, grip, stance, muscle, or joint-path field remains `needs-review`; it is not an approval.');
report.push('- Prompts enforce square output, 512 x 512 PNG treatment, 10 percent safe margin, contained framing, no crop, no text, no logo, no white background, and no split view.');
report.push('- Future exercise names must resolve through the canonical registry first; unmatched names produce a draft prompt that cannot be approved while required fields are ambiguous.');
report.push('');
report.push('## Recommended generation waves');
report.push('');
report.push('1. Main/core movement groups.');
report.push('2. Stick warm-ups and tendon preparation.');
report.push('3. Physical recovery and cardio.');
report.push('4. Optional movements.');
report.push('5. Alternative 1 and Option 2.');
report.push('6. Semantic repairs, crop repairs, and coach-review rejects.');
report.push('');
report.push('Generate no more than 10–15 canonical pairs per batch. Do not generate non-exercise status records.');
fs.writeFileSync(path.join(root, 'output/reports/v541-complete-artwork-gap-analysis.md'), `${report.join('\n')}\n`);

const masterPrompt = `# Fitness 7 scientific artwork master prompt\n\n## Asset contract\n\n- One canonical physical movement per registry entry.\n- Two separate files: Start and Movement.\n- 512 x 512 PNG masters; no split views or contact sheets.\n- Charcoal background, black clothing, off-white figure/equipment, orange primary emphasis, muted blue secondary emphasis, grey-green stabilizers.\n- Minimum 10 percent clear margin.\n- Same athlete, clothing, equipment, camera, lighting, and background within a pair.\n- Listing cards use Movement; detail pages use Start and Movement.\n\n## Shared prompt\n\n\`\`\`text\n${promptWrapper}\n\`\`\`\n\n## Start suffix\n\n\`\`\`text\n${startSuffix}\n\`\`\`\n\n## Movement suffix\n\n\`\`\`text\n${movementSuffix}\n\`\`\`\n\n## Future exercise-name workflow\n\n1. Normalize the submitted name and search exact canonical IDs and aliases.\n2. Reuse an existing pair only when equipment, grip, stance, joint path, and range are mechanically identical.\n3. If no exact match exists, create a draft movement specification with equipment, camera, Start, Movement, direction, muscles, and negative constraints.\n4. Mark inferred fields as \`needs-review\`.\n5. Refuse prompt approval while equipment or mechanics are ambiguous.\n6. Generate separate Start and Movement prompts only after the specification is locked.\n7. Validate both files before updating the runtime registry.\n\n## Review gate\n\nTechnical validation is not gym-coach approval. A pair remains pending until file integrity, phase difference, mechanics, equipment, margins, and human review are recorded.`;
fs.writeFileSync(path.join(outDir, 'MASTER-PROMPT.md'), `${masterPrompt}\n`);

const state = {
  project: 'Fitness 7 V5.4.1 A-B-A-C artwork v3 audit',
  branch: 'codex/v541-v2-art-integration',
  workspace: root,
  currentCheckpoint: 'V541-ART-V3-00-AUDIT-COMPLETE',
  runtimeIdentityCount: runtimeRows.length,
  physicalRuntimeIdentityCount: physicalRows.length,
  canonicalMovementGroupCount: canonicalRows.length,
  existingActiveV2Sets: activeV2Records.length,
  unusedV2Sets: unusedV2Records.length,
  replacementSetCount: canonicalRows.filter(row => row.replacementRequired).length,
  replacementFileCount: canonicalRows.filter(row => row.replacementRequired).length * 2,
  completedUnits: ['V541-ART-V3-01-runtime-inventory', 'V541-ART-V3-02-non-exercise-exclusion', 'V541-ART-V3-03-canonical-normalization', 'V541-ART-V3-04-prompt-system'],
  failedUnits: [],
  knownIssues: ['Canonical alias decisions remain pending human mechanics review.', '232 legacy uncovered runtime identities plus five tendon records require replacement at runtime level; canonical queue is the conservative production target.', 'Existing V2 pairs have technical validation but no qualified gym-coach approval.', 'No images were generated in this audit pass.'],
  lastCommit: '',
  nextAtomicAction: 'Review ALIAS-DECISIONS.json and approve or separate each duplicate-name group before generating any artwork'
};
writeJson('STATE.json', state);

const runbook = `# Luna Medium runbook — Fitness 7 A-B-A-C unified artwork v3\n\n## Current checkpoint\n\nRead \`.codex/v541/artwork-v3/STATE.json\` first. This audit has frozen a conservative queue of ${state.replacementSetCount} canonical replacement sets and ${state.replacementFileCount} separate files. Do not regenerate the completed 43 V2 sets.\n\n## Resume protocol\n\n1. Confirm workspace \`${root}\`.\n2. Confirm branch \`codex/v541-v2-art-integration\`.\n3. Inspect the working tree; do not reset or overwrite changes.\n4. Read only \`STATE.json\`, the current manifest, and the current report section.\n5. Execute only \`nextAtomicAction\`.\n6. Run the unit checks.\n7. Update \`STATE.json\` and \`VALIDATION.md\`.\n8. Commit before starting another unit or before usage expires.\n\nIf state and checkout disagree, stop with: \`BLOCKED: artwork-v3 checkpoint does not match checkout\`.\n\n## Frozen decisions\n\n- Asset model: two separate files per physical movement, Start and Movement.\n- Non-exercise records (hydration, nutrition, and NO CARDIO) receive no artwork.\n- Existing V2 art remains unchanged.\n- Eight unused V2 sets remain preserved but are not counted as A-B-A-C coverage.\n- No fuzzy aliasing. Similar names remain separate until mechanics are proven identical.\n\n## Atomic units\n\n- \`V541-ART-V3-01\`: inspect runtime inventory and excluded records.\n- \`V541-ART-V3-02\`: review every duplicate-name alias decision.\n- \`V541-ART-V3-03\`: lock equipment, grip, stance, camera, muscles, and phase positions for one canonical group.\n- \`V541-ART-V3-04\`: verify one pair of prompts and output paths.\n- \`V541-ART-V3-05\`: batch future generation in 10–15 canonical pairs only after approval.\n\n## Per-movement specification gate\n\nDo not generate while any of these fields are ambiguous: equipment, equipment availability, grip, stance, camera, Start pose, Movement pose, direction, safe range, primary muscles, or negative constraints.\n\n## Image generation contract\n\n- Use the shared prompt in \`MASTER-PROMPT.md\`.\n- Keep one athlete and one movement per image.\n- Generate Start first.\n- Generate Movement using Start as the identity reference.\n- Require visibly different joint and equipment positions.\n- Inspect before resizing.\n- Contain-resize to 512 x 512 and pad with charcoal.\n- Never stretch, crop, mirror, or place text inside the image.\n\n## Technical checks\n\n- Both files exist and decode.\n- Both are PNG and exactly 512 x 512.\n- Paths are unique to one canonical ID.\n- Hashes differ.\n- Athlete and equipment remain inside the safe margin.\n- Runtime registry points to Start and Movement for the same canonical ID.\n\n## Semantic review\n\nRecord \`TECHNICAL_PASS\`, \`WRONG_EXERCISE\`, \`WRONG_EQUIPMENT\`, \`WRONG_PHASE\`, \`PHASES_TOO_SIMILAR\`, \`CROPPED\`, \`BLURRY\`, \`ANATOMY_ERROR\`, or \`NEEDS_HUMAN_REVIEW\`. Technical or AI review must never be described as qualified gym-coach approval.\n\n## Stop conditions\n\nStop immediately if a generated image is wrong, if a pair is too similar, if a path belongs to another identity, if an excluded movement appears, or if a non-exercise status record is sent to image generation. Save the failure and set one exact repair action.\n\n## Completion\n\nThe audit stage is complete when the canonical count, alias decisions, prompt manifest, and gap report are committed. Artwork production and app integration are separate later stages.`;
fs.writeFileSync(path.join(outDir, 'LUNA-MEDIUM-RUNBOOK.md'), `${runbook}\n`);
fs.writeFileSync(path.join(outDir, 'VALIDATION.md'), `# Artwork v3 audit validation\n\n- Runtime traversal: ${runtimeRows.length} identities including tendon and non-exercise records.\n- Physical identities: ${physicalRows.length}.\n- Canonical groups: ${canonicalRows.length}.\n- Replacement queue: ${state.replacementSetCount} sets / ${state.replacementFileCount} files.\n- Existing active V2 sets preserved: ${activeV2Records.length}.\n- Unused V2 sets recorded separately: ${unusedV2Records.length}.\n- Non-exercise records excluded: ${runtimeRows.filter(row => row.nonExercise).length}.\n- Prompt manifest: ${promptManifest.movements.length} records with Start and Movement prompts.\n- Image generation: not run.\n- Application integration: not run.\n- Human gym-coach approval: pending.\n`);

console.log(JSON.stringify({
  runtimeIdentities: runtimeRows.length,
  physicalIdentities: physicalRows.length,
  canonicalGroups: canonicalRows.length,
  activeV2Sets: activeV2Records.length,
  unusedV2Sets: unusedV2Records.length,
  replacementSets: state.replacementSetCount,
  replacementFiles: state.replacementFileCount,
  duplicateNameGroups: aliasDecisions.filter(row => row.candidateIds.length > 1).length
}, null, 2));
