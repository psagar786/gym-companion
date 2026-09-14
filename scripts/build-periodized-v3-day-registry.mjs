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
  for (const entry of manifest.generationQueue || []) {
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
      sourceRows: entry.sourceRows || []
    };
    runtimeMap[entry.canonicalMovementId] = { canonicalMovementId: entry.canonicalMovementId };
    runtimeMap[`periodized-${slug(entry.displayName)}`] = { canonicalMovementId: entry.canonicalMovementId };
  }
  for (const item of reuse.approved || []) {
    const canonicalMovementId = item.runtimeId;
    const name = item.runtimeId.replace(/^periodized-/, '').replace(/^biweekly-/, '').replace(/-/g, ' ')
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
      imageSet: {}
    };
    runtimeMap[runtimeId] = { canonicalMovementId };
    return canonicalMovementId;
  };
  for (const sourceDay of periodizedRuntime.days.filter(entry => entry.dayIndex === dayIndex)) {
    for (const role of ['coreSlots', 'warmup', 'cardio', 'recovery', 'optionalSlots']) {
      for (const item of sourceDay[role] || []) {
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
