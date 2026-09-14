import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = process.cwd();
const dir = path.join(root, '.codex/v541/artwork-v3/tuesday');
const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'GENERATION-MANIFEST.json'), 'utf8'));
const reuse = JSON.parse(fs.readFileSync(path.join(dir, 'REUSE-MAP.json'), 'utf8'));
const mondayContext = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(root, 'data/periodized-v3-monday-artwork.js'), 'utf8'), mondayContext);
const monday = mondayContext.window.GYM_COMPANION_PERIODIZED_V3_MONDAY_ARTWORK;

const movements = {};
const runtimeMap = {};
const aliases = {};
for (const entry of manifest.movements) {
  const record = {
    stableMovementId: entry.canonicalMovementId,
    name: entry.name,
    roles: entry.roles || [],
    weekKeys: entry.weekKeys || ['A', 'B', 'C'],
    sourceRows: entry.sourceRows || [],
    equipment: entry.equipment,
    equipmentStatus: entry.equipmentStatus,
    reviewOnly: false,
    artworkStatus: 'complete',
    visualReviewStatus: 'pending',
    semanticReviewStatus: 'ai-review-pending',
    coachReviewStatus: 'pending',
    assetVersion: 'periodized-abc-art-v3-tuesday',
    altStart: 'Fitness 7 illustration: ' + entry.name + ' starting position',
    altMovement: 'Fitness 7 illustration: ' + entry.name + ' working position',
    startInstruction: entry.startPose,
    movementInstruction: entry.movementPose,
    directionCue: entry.gripStance,
    gripCue: entry.gripStance,
    imageSet: { start: entry.outputPaths.start, movement: entry.outputPaths.movement },
    mappedRuntimeIds: entry.mappedRuntimeIds || []
  };
  movements[record.stableMovementId] = record;
  runtimeMap[record.stableMovementId] = { canonicalMovementId: record.stableMovementId, source: 'tuesday-v3-canonical' };
  for (const runtimeId of record.mappedRuntimeIds) runtimeMap[runtimeId] = { canonicalMovementId: record.stableMovementId, source: 'tuesday-v3' };
}

for (const alias of reuse.aliases || []) {
  aliases[alias.runtimeId] = alias.canonicalMovementId;
  runtimeMap[alias.runtimeId] = { canonicalMovementId: alias.canonicalMovementId, source: 'tuesday-v3-alias' };
}

for (const item of reuse.mondayReuse || []) {
  const source = monday.movements[item.canonicalMovementId];
  if (!source) throw new Error('Monday reuse source is missing: ' + item.canonicalMovementId);
  runtimeMap[item.runtimeId] = { canonicalMovementId: source.stableMovementId, source: 'monday-v3-reuse' };
  aliases[item.runtimeId] = source.stableMovementId;
}

const registry = {
  version: 'periodized-v3-tuesday-artwork-v1',
  plan: 'periodized-abc',
  day: 'Tuesday',
  weekKeys: ['A', 'B', 'C'],
  totalSets: 41,
  generatedSets: 36,
  reusedSets: 4,
  deferredTendonSets: 1,
  generatedAt: new Date().toISOString(),
  movements,
  runtimeMap,
  aliases,
  mondayReuse: reuse.mondayReuse || []
};
const output = 'window.GYM_COMPANION_PERIODIZED_V3_TUESDAY_ARTWORK = ' + JSON.stringify(registry, null, 2) + ';\n';
fs.writeFileSync(path.join(root, 'data/periodized-v3-tuesday-artwork.js'), output);
console.log('Built Tuesday registry: ' + Object.keys(movements).length + ' generated sets, ' + Object.keys(runtimeMap).length + ' explicit runtime mappings.');
