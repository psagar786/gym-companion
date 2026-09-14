import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.resolve(fileURLToPath(new URL('..', import.meta.url)));
const manifestPath = path.join(root, '.codex/v541/artwork-v3/monday/GENERATION-MANIFEST.json');
const outputPath = path.join(root, 'data/periodized-v3-monday-artwork.js');
const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const promptLine = (prompt, label) => String(prompt || '').split('\n').find(line => line.startsWith(`${label}:`))?.slice(label.length + 1).trim() || '';

const movements = Object.fromEntries(manifest.movements.map(row => [row.canonicalMovementId, {
  stableMovementId: row.canonicalMovementId,
  name: row.displayName,
  roles: row.roles,
  sourceRows: row.sourceRows,
  equipment: row.equipment,
  equipmentStatus: row.equipmentStatus,
  reviewOnly: Boolean(row.reviewOnly),
  artworkStatus: 'complete',
  visualReviewStatus: row.semanticReviewStatus === 'ai-review-pending' ? 'pending' : 'pending',
  semanticReviewStatus: row.semanticReviewStatus || 'pending',
  coachReviewStatus: row.humanCoachReviewStatus || 'pending',
  assetVersion: 'periodized-abc-art-v3',
  altStart: `Fitness 7 illustration: ${row.displayName} starting position`,
  altMovement: `Fitness 7 illustration: ${row.displayName} working position`,
  startInstruction: promptLine(row.startPrompt, 'Body position'),
  movementInstruction: promptLine(row.movementPrompt, 'Body position'),
  directionCue: promptLine(row.movementPrompt, 'Movement mechanics'),
  gripCue: promptLine(row.startPrompt, 'Grip and stance'),
  imageSet: row.outputPaths
} ]));

const output = {
  version: 'periodized-v3-monday-artwork-v1',
  plan: 'periodized-abc',
  day: 'Monday',
  weekKeys: ['A', 'B', 'C'],
  generatedAt: new Date().toISOString(),
  totalSets: manifest.movements.length,
  movements
};

fs.writeFileSync(outputPath, `window.GYM_COMPANION_PERIODIZED_V3_MONDAY_ARTWORK = ${JSON.stringify(output, null, 2)};\n`);
console.log(`Built Monday v3 artwork registry: ${manifest.movements.length} movement sets.`);
