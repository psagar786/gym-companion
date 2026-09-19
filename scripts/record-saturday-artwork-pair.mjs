import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const root = process.cwd();
const saturdayDir = path.join(root, '.codex/v541/artwork-v3/saturday');
const manifestPath = path.join(saturdayDir, 'GENERATION-MANIFEST.json');
const statePath = path.join(saturdayDir, 'STATE.json');
const validationPath = path.join(saturdayDir, 'VALIDATION.md');
const [movementId] = process.argv.slice(2);
if (!movementId) throw new Error('Usage: node scripts/record-saturday-artwork-pair.mjs <canonicalMovementId>');

const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'));
const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));
const item = manifest.canonicalMovements.find(record => record.canonicalMovementId === movementId);
if (!item) throw new Error(`Unknown Saturday movement: ${movementId}`);
const files = ['start', 'movement'].map(phase => path.join(root, item.outputPaths[phase]));
for (const file of files) {
  if (!fs.existsSync(file)) throw new Error(`Missing generated ${path.basename(file)}`);
  const bytes = fs.readFileSync(file);
  if (bytes.toString('ascii', 1, 4) !== 'PNG') throw new Error(`Not a PNG: ${file}`);
  const dimensions = { width: bytes.readUInt32BE(16), height: bytes.readUInt32BE(20) };
  if (dimensions.width !== 512 || dimensions.height !== 512) throw new Error(`Invalid dimensions for ${file}: ${dimensions.width}x${dimensions.height}`);
}
const hashes = files.map(file => crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'));
if (hashes[0] === hashes[1]) throw new Error(`Start and Movement are byte-identical for ${movementId}`);
item.generationStatus = 'technical-pass';
item.technicalReviewStatus = 'technical-pass';
item.semanticReviewStatus = 'ai-review-pending';
item.generatedHashes = { start: hashes[0], movement: hashes[1] };
item.generatedAt = new Date().toISOString();
state.completedMovementIds = [...new Set([...(state.completedMovementIds || []), movementId])];
state.completedSets = state.completedMovementIds.length;
state.completedFiles = state.completedSets * 2;
state.currentMovementId = null;
state.currentPhase = null;
state.currentBatch = state.completedSets <= 11 ? 'B01' : state.completedSets <= 21 ? 'B02' : 'B03';
state.currentCheckpoint = state.completedSets === 11 ? 'V541-SAT-B01-COMPLETE' : state.completedSets === 21 ? 'V541-SAT-B02-COMPLETE' : state.completedSets === 31 ? 'V541-SAT-B03-COMPLETE' : `V541-SAT-${movementId}-PAIR-COMPLETE`;
state.nextAtomicAction = state.completedSets === state.newGenerationSets ? 'Run final Saturday local artwork validation' : `Generate Start for the next Saturday ${state.currentBatch} movement`;
fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2) + '\n');
fs.writeFileSync(statePath, JSON.stringify(state, null, 2) + '\n');
fs.appendFileSync(validationPath, `\n- ${state.currentCheckpoint}: ${movementId} passed 512x512 PNG, hash uniqueness and file existence checks.\n`);
console.log(JSON.stringify({ movementId, completedSets: state.completedSets, completedFiles: state.completedFiles, checkpoint: state.currentCheckpoint, nextAtomicAction: state.nextAtomicAction }, null, 2));
