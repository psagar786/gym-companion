import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const dayNames = { wednesday: 'Wednesday', thursday: 'Thursday', friday: 'Friday', saturday: 'Saturday' };
const slug = value => String(value || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
const readJson = file => JSON.parse(fs.readFileSync(path.join(root, file), 'utf8'));
const runtimeContext = { window: {} };
vm.createContext(runtimeContext);
for (const file of ['data/biweekly-routine.js', 'data/periodized-abc.js']) {
  vm.runInContext(fs.readFileSync(path.join(root, file), 'utf8'), runtimeContext, { filename: file });
}
const periodizedRuntime = runtimeContext.window.GYM_COMPANION_PERIODIZED_ABC || { days: [] };
const result = { version: 'periodized-v3-day-artwork-v1', plan: 'periodized-abc', generatedAt: new Date().toISOString(), days: {} };

for (const key of Object.keys(dayNames)) {
  const manifestFile = path.join(root, `.codex/v541/artwork-v3/${key}/GENERATION-MANIFEST.json`);
  const reuseFile = path.join(root, `.codex/v541/artwork-v3/${key}/REUSE-MAP.json`);
  const manifest = fs.existsSync(manifestFile) ? readJson(`.codex/v541/artwork-v3/${key}/GENERATION-MANIFEST.json`) : { generationQueue: [] };
  const reuse = fs.existsSync(reuseFile) ? readJson(`.codex/v541/artwork-v3/${key}/REUSE-MAP.json`) : { approved: [] };
  const movements = {};
  const runtimeMap = {};
  // Saturday's frozen manifest uses `canonicalMovements`; earlier day
  // manifests use `generationQueue`. Support both shapes so the same
  // day-aware registry remains the runtime source of truth.
  const generationEntries = manifest.generationQueue || manifest.canonicalMovements || [];
  for (const entry of generationEntries) {
    const start = entry.outputPaths?.start || entry.imageSet?.start || '';
    const movement = entry.outputPaths?.movement || entry.imageSet?.movement || '';
    const complete = Boolean(start && movement && fs.existsSync(path.join(root, start)) && fs.existsSync(path.join(root, movement)));
    movements[entry.canonicalMovementId] = {
      stableMovementId: entry.canonicalMovementId,
      name: entry.displayName,
      roles: [entry.role],
      weekKeys: entry.weekKeys || ['A', 'B', 'C'],
      equipment: entry.equipment,
      equipmentStatus: entry.equipmentStatus,
      artworkStatus: complete ? 'complete' : 'pending',
      visualReviewStatus: entry.technicalReviewStatus === 'pass' ? 'pending' : (entry.technicalReviewStatus || 'pending'),
      semanticReviewStatus: entry.semanticReviewStatus || 'pending',
      coachReviewStatus: entry.humanCoachReviewStatus || 'pending',
      assetVersion: 'periodized-abc-art-v3',
      altStart: entry.altText?.start || `Fitness 7 illustration: ${entry.displayName} starting position`,
      altMovement: entry.altText?.movement || `Fitness 7 illustration: ${entry.displayName} working position`,
      imageSet: { start, movement },
      sourceRows: entry.sourceRows || [],
      reviewOnly: Boolean(entry.reviewOnly)
    };
    runtimeMap[entry.canonicalMovementId] = { canonicalMovementId: entry.canonicalMovementId };
    runtimeMap[`periodized-${slug(entry.displayName)}`] = { canonicalMovementId: entry.canonicalMovementId };
    for (const mappedRuntimeId of entry.mappedRuntimeIds || []) {
      runtimeMap[mappedRuntimeId] = { canonicalMovementId: entry.canonicalMovementId };
    }
  }
  for (const item of reuse.approved || []) {
    const canonicalMovementId = item.canonicalMovementId || item.runtimeId;
    const name = item.displayName || item.name || canonicalMovementId.replace(/^periodized-/, '').replace(/^biweekly-/, '').replace(/-/g, ' ')
      .replace(/\b\w/g, char => char.toUpperCase());
    movements[canonicalMovementId] = {
      stableMovementId: canonicalMovementId,
      name,
      roles: ['reuse'],
      weekKeys: ['A', 'B', 'C'],
      equipmentStatus: 'approved reuse from Monday V3',
      artworkStatus: 'complete',
      visualReviewStatus: 'pending',
      semanticReviewStatus: 'pending',
      coachReviewStatus: 'pending',
      assetVersion: 'periodized-abc-art-v3',
      altStart: `Fitness 7 illustration: ${name} starting position`,
      altMovement: `Fitness 7 illustration: ${name} working position`,
      imageSet: { start: item.imageSet.start, movement: item.imageSet.movement },
      source: item.imageSet.source || 'Monday V3'
    };
    runtimeMap[canonicalMovementId] = { canonicalMovementId };
    runtimeMap[`periodized-${slug(name)}`] = { canonicalMovementId };
    for (const mappedRuntimeId of item.mappedRuntimeIds || []) {
      runtimeMap[mappedRuntimeId] = { canonicalMovementId };
    }
  }
  // Friday has a few explicit cross-day aliases whose source titles differ
  // from the canonical V3 record. Keep these mappings data-driven and exact;
  // never fall back to fuzzy name matching for artwork.
  if (key === 'friday') {
    const externalReuses = [
      ['periodized-stick-around-the-worlds', 'Stick Around-the-Worlds', 'biweekly-stick-around-the-worlds', 'assets/exercises/periodized-v3/biweekly-stick-around-the-worlds-v3-start.png', 'assets/exercises/periodized-v3/biweekly-stick-around-the-worlds-v3-movement.png', 'Monday V3'],
      ['periodized-stick-good-mornings', 'Stick Good Mornings', 'biweekly-stick-good-mornings', 'assets/exercises/periodized-v3/biweekly-stick-good-mornings-v3-start.png', 'assets/exercises/periodized-v3/biweekly-stick-good-mornings-v3-movement.png', 'Wednesday V3']
    ];
    for (const [runtimeId, name, canonicalMovementId, start, movement, source] of externalReuses) {
      movements[canonicalMovementId] = { stableMovementId: canonicalMovementId, name, roles: ['reuse'], weekKeys: ['A','B','C'], equipmentStatus: `approved reuse from ${source}`, artworkStatus: 'complete', visualReviewStatus: 'pending', semanticReviewStatus: 'pending', coachReviewStatus: 'pending', assetVersion: 'periodized-abc-art-v3', altStart: `Fitness 7 illustration: ${name} starting position`, altMovement: `Fitness 7 illustration: ${name} working position`, imageSet: { start, movement }, source };
      runtimeMap[runtimeId] = { canonicalMovementId };
      runtimeMap[canonicalMovementId] = { canonicalMovementId };
      runtimeMap[`periodized-${slug(name)}`] = { canonicalMovementId };
    }
    const aliases = {
      'periodized-stick-standing-trunk-rotations': 'periodized-stick-standing-trunk-rotation',
      'periodized-stick-trunk-rotations': 'periodized-stick-standing-trunk-rotation',
      'periodized-cable-woodchopper-low-to-high': 'periodized-standing-cable-woodchopper-low-to-high',
      'periodized-floor-reverse-crunch': 'periodized-floor-reverse-crunch-with-pelvic-tilt',
      'periodized-stick-overhead-lateral-side-bends': 'periodized-stick-overhead-lateral-side-bend',
      'periodized-forearm-plank': 'periodized-standard-forearm-plank',
      'periodized-standard-forearm-plank-to-rkc-hardstyle-plank': 'periodized-standard-forearm-plank',
      'periodized-incline-bench-reverse-crunch-with-pelvic-curl': 'periodized-incline-bench-reverse-crunch',
      'periodized-hanging-straight-leg-raise': 'periodized-hanging-leg-raise',
      'periodized-stick-good-mornings': 'biweekly-stick-good-mornings',
      'periodized-stick-around-the-worlds': 'biweekly-stick-around-the-worlds',
      'periodized-transverse-abdominis-stomach-vacuums': 'periodized-standing-stomach-vacuum',
      'periodized-intervals': 'periodized-incline-walk',
      'periodized-incline-treadmill-intervals': 'periodized-incline-walk',
      'v53-tendon-wrist-extensor-isometric': 'tendon-wrist-extensor-isometric',
      'periodized-wrist-extensor-isometric': 'tendon-wrist-extensor-isometric'
    };
    for (const [aliasId, canonicalMovementId] of Object.entries(aliases)) runtimeMap[aliasId] = { canonicalMovementId };
  }
  if (key === 'saturday') {
    const aliases = {
      'periodized-single-arm-db-row': 'periodized-single-arm-dumbbell-row',
      'periodized-side-plank-clamshells': 'periodized-side-plank-clamshell',
      'periodized-single-leg-db-rdl': 'periodized-single-leg-dumbbell-rdl',
      'periodized-cable-upright-row-wide': 'periodized-cable-upright-row-wide-grip'
    };
    for (const [aliasId, canonicalMovementId] of Object.entries(aliases)) runtimeMap[aliasId] = { canonicalMovementId };
  }
  const byName = new Map(Object.values(movements).map(record => [slug(record.name), record.stableMovementId]));
  const dayIndex = { wednesday: 2, thursday: 3, friday: 4, saturday: 5 }[key];
  for (const sourceDay of periodizedRuntime.days.filter(entry => entry.dayIndex === dayIndex)) {
    for (const role of ['coreSlots', 'warmup', 'cardio', 'recovery', 'optionalSlots']) {
      for (const item of sourceDay[role] || []) {
        const canonicalMovementId = byName.get(slug(item.name)) || (movements[item.stableMovementId] ? item.stableMovementId : null);
        if (!canonicalMovementId) continue;
        runtimeMap[item.id] = { canonicalMovementId };
        runtimeMap[item.stableMovementId] = { canonicalMovementId };
        runtimeMap[`periodized-${slug(item.name)}`] = { canonicalMovementId };
        for (const alternative of item.alternatives || []) {
          const alternativeId = `periodized-${slug(alternative)}`;
          if (byName.has(slug(alternative))) runtimeMap[alternativeId] = { canonicalMovementId: byName.get(slug(alternative)) };
        }
      }
    }
  }
  const addPending = (runtimeId, name, role) => {
    const canonicalMovementId = `periodized-${slug(name)}`;
    if (!movements[canonicalMovementId]) movements[canonicalMovementId] = {
      stableMovementId: canonicalMovementId,
      name,
      roles: [role],
      weekKeys: ['A', 'B', 'C'],
      equipmentStatus: 'pending artwork specification',
      artworkStatus: 'pending',
      visualReviewStatus: 'pending',
      semanticReviewStatus: 'pending',
      coachReviewStatus: 'pending',
      assetVersion: 'periodized-abc-art-v3',
      altStart: `Fitness 7 illustration: ${name} starting position`,
      altMovement: `Fitness 7 illustration: ${name} working position`,
      imageSet: {},
      reviewOnly: /cable standing abduction/i.test(name)
    };
    runtimeMap[runtimeId] = { canonicalMovementId };
    return canonicalMovementId;
  };
  for (const sourceDay of periodizedRuntime.days.filter(entry => entry.dayIndex === dayIndex)) {
    for (const role of ['coreSlots', 'warmup', 'cardio', 'recovery', 'optionalSlots']) {
      for (const item of sourceDay[role] || []) {
        const explicitNameMapping = runtimeMap[`periodized-${slug(item.name)}`];
        if (explicitNameMapping && !runtimeMap[item.id]) runtimeMap[item.id] = explicitNameMapping;
        if (!runtimeMap[item.id]) addPending(item.id, item.name, role);
        for (const alternative of item.alternatives || []) {
          const alternativeId = `periodized-${slug(alternative)}`;
          if (!runtimeMap[alternativeId]) addPending(alternativeId, alternative, 'alternative');
        }
      }
    }
  }
  result.days[dayNames[key]] = { movements, runtimeMap, pending: Object.values(movements).filter(item => item.artworkStatus !== 'complete').map(item => item.stableMovementId) };
}

const output = `window.GYM_COMPANION_PERIODIZED_V3_DAY_ARTWORK = ${JSON.stringify(result, null, 2)};\n`;
fs.writeFileSync(path.join(root, 'data/periodized-v3-day-artwork.js'), output);
console.log(`Built day artwork registry: ${Object.values(result.days).map(day => Object.keys(day.movements).length).join(' + ')} records.`);
