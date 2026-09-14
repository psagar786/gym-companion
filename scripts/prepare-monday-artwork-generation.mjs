import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const audit = JSON.parse(fs.readFileSync(path.join(root, '.codex/v541/artwork-v3/MONDAY-A-B-C-AUDIT.json'), 'utf8'));
const promptManifest = JSON.parse(fs.readFileSync(path.join(root, '.codex/v541/artwork-v3/PROMPT-MANIFEST.json'), 'utf8'));
const canonicalById = new Map(promptManifest.movements.map(row => [row.canonicalMovementId, row]));
const uniqueByCanonical = new Map(audit.uniqueRuntimeIdentities.map(row => [row.canonicalMovementId, row]));
const excluded = /captain['’]?s chair|band(?:ed|s)?|trap[- ]bar|hack squat|swiss ball|seated leg curl|cable (?:standing )?hip abduction|cuffed cable|pec[- ]deck|dip machine|machine chest press|barbell hip thrust|ab wheel/i;
const roleOrder = ['core', 'warmup', 'tendon', 'cardio', 'recovery', 'optional', 'alternative'];
const allIds = [...uniqueByCanonical.keys()];
const records = allIds.map(id => {
  const runtime = uniqueByCanonical.get(id);
  const prompt = canonicalById.get(id);
  if (!prompt) throw new Error(`No prompt record for ${id}`);
  const reviewOnly = excluded.test(`${runtime.name} ${runtime.equipment || ''}`);
  return {
    canonicalMovementId: id,
    displayName: prompt.displayName,
    roles: prompt.roles,
    compatibleDays: prompt.compatibleDays,
    sourceRows: prompt.sourceRows,
    equipment: prompt.equipment,
    equipmentStatus: prompt.equipmentStatus,
    reviewOnly,
    oldArtwork: runtime.existingImageSet,
    startPrompt: prompt.startPrompt,
    movementPrompt: prompt.movementPrompt,
    outputPaths: {
      start: `assets/exercises/periodized-v3/${id}-v3-start.png`,
      movement: `assets/exercises/periodized-v3/${id}-v3-movement.png`
    },
    generationStatus: 'not-started',
    technicalReviewStatus: 'pending',
    semanticReviewStatus: 'pending',
    humanCoachReviewStatus: 'pending',
    failureReasons: []
  };
});
records.sort((a, b) => {
  const roleA = Math.min(...a.roles.map(role => roleOrder.indexOf(role)).filter(index => index >= 0));
  const roleB = Math.min(...b.roles.map(role => roleOrder.indexOf(role)).filter(index => index >= 0));
  return roleA - roleB || a.displayName.localeCompare(b.displayName);
});
const batches = [];
for (let index = 0; index < records.length; index += 12) {
  const batch = records.slice(index, index + 12);
  batches.push({ batchId: `B${String(batches.length + 1).padStart(2, '0')}`, movementIds: batch.map(row => row.canonicalMovementId), status: 'not-started' });
}
const outDir = path.join(root, '.codex/v541/artwork-v3/monday');
const assetDir = path.join(root, 'assets/exercises/periodized-v3');
fs.mkdirSync(outDir, { recursive: true });
fs.mkdirSync(assetDir, { recursive: true });
fs.writeFileSync(path.join(outDir, 'GENERATION-MANIFEST.json'), `${JSON.stringify({ schemaVersion: 'fitness7-monday-art-generation-v1', generatedAt: new Date().toISOString(), plan: 'periodized-abc', day: 'Monday', weekKeys: ['A', 'B', 'C'], assetModel: 'fresh Start + Movement pair per canonical identity', totalSets: records.length, totalFiles: records.length * 2, batches, movements: records }, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'STATE.json'), `${JSON.stringify({ plan: 'periodized-abc', day: 'Monday', weekKeys: ['A', 'B', 'C'], totalCanonicalSets: records.length, completedSets: 0, completedFiles: 0, remainingSets: records.length, remainingFiles: records.length * 2, currentBatch: batches[0]?.batchId || null, currentMovementId: null, currentPhase: null, failedMovementIds: [], excludedReviewOnlyIds: records.filter(row => row.reviewOnly).map(row => row.canonicalMovementId), lastCompletedCommit: '', nextAtomicAction: 'Generate Start for the first Monday canonical movement' }, null, 2)}\n`);
fs.writeFileSync(path.join(outDir, 'VALIDATION.md'), '# Monday artwork generation validation\n\n- Generation has not started.\n- Existing artwork is preserved and hash snapshots remain in the audit JSON.\n- All new pairs require technical and semantic review before integration.\n- Excluded-equipment records are review-only and must not be activated.\n');
fs.writeFileSync(path.join(outDir, 'REPAIR-QUEUE.md'), '# Monday artwork repair queue\n\nNo failures recorded.\n');
console.log(JSON.stringify({ totalSets: records.length, totalFiles: records.length * 2, batches: batches.length, reviewOnly: records.filter(row => row.reviewOnly).length, firstBatch: batches[0] }, null, 2));
